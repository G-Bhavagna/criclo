import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS, MESSAGE_TYPES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { messageAPI } from '../../services/api';
import websocketService from '../../services/websocket';
import MessageBubble from '../../components/MessageBubble';

const GroupChatScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      websocketService.leaveGroup(groupId);
    };
  }, [groupId]);

  const initializeChat = async () => {
    try {
      // Connect to WebSocket
      await websocketService.connect();
      
      // Fetch existing messages
      const response = await messageAPI.getGroupMessages(groupId);
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        senderId: msg.userId || msg.senderId,
        senderName: msg.userName || msg.senderName,
        content: msg.content,
        type: msg.type,
        timestamp: msg.sentAt || msg.timestamp,
      }));
      setMessages(formattedMessages);

      // Join the group and register message callback
      websocketService.registerMessageCallback(groupId, handleNewMessage);
      websocketService.joinGroup(groupId);

      setLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    const formattedMessage = {
      id: message.id,
      senderId: message.userId || message.senderId,
      senderName: message.userName || message.senderName,
      content: message.content,
      type: message.type,
      timestamp: message.sentAt || message.timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    scrollToBottom();
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      websocketService.sendMessage(groupId, messageText, MESSAGE_TYPES.TEXT);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }) => (
    <MessageBubble
      message={item}
      isOwn={item.senderId === user.id}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  messagesList: {
    padding: 16,
    paddingTop: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  sendButtonText: {
    color: COLORS.surface,
    fontSize: 16,
  },
});

export default GroupChatScreen;
