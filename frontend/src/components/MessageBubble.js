import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';
import { format } from 'date-fns';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
      {!isOwn && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
        {format(new Date(message.timestamp), 'h:mm a')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '75%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  ownMessageText: {
    color: COLORS.surface,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    marginLeft: 12,
  },
  ownTimestamp: {
    marginRight: 12,
    marginLeft: 0,
  },
});

export default MessageBubble;
