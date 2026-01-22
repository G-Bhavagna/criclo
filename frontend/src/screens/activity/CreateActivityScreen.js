import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, ACTIVITY_TYPES } from '../../config/constants';
import { useLocation } from '../../context/LocationContext';
import { activityAPI } from '../../services/api';

const CreateActivityScreen = ({ navigation }) => {
  const { location } = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [maxMembers, setMaxMembers] = useState('5');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventTime(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!activityType) {
      Alert.alert('Error', 'Please select an activity type');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (parseInt(maxMembers) < 2 || parseInt(maxMembers) > 20) {
      Alert.alert('Error', 'Max members must be between 2 and 20');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        title: title.trim(),
        description: description.trim(),
        activityType,
        latitude: location.latitude,
        longitude: location.longitude,
        radiusKm: 2,
        eventTime: eventTime.toISOString(),
        maxMembers: parseInt(maxMembers),
      };

      await activityAPI.createActivity(activityData);
      Alert.alert('Success', 'Activity created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create activity');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Activity</Text>
        <Text style={styles.subtitle}>Invite people nearby to join you</Text>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Activity Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Morning Coffee at Starbucks"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />
        </View>

        {/* Activity Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Activity Type *</Text>
          <View style={styles.typeGrid}>
            {ACTIVITY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeChip,
                  activityType === type.id && {
                    backgroundColor: type.color,
                    borderColor: type.color,
                  },
                ]}
                onPress={() => setActivityType(type.id)}
              >
                <Text
                  style={[
                    styles.typeText,
                    activityType === type.id && styles.typeTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what you plan to do..."
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/200</Text>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Date & Time *</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {eventTime.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={eventTime}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={eventTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Max Members */}
        <View style={styles.section}>
          <Text style={styles.label}>Max Members *</Text>
          <View style={styles.memberSelector}>
            <TouchableOpacity
              style={styles.memberButton}
              onPress={() => setMaxMembers(Math.max(2, parseInt(maxMembers) - 1).toString())}
            >
              <Text style={styles.memberButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.memberCount}>{maxMembers}</Text>
            <TouchableOpacity
              style={styles.memberButton}
              onPress={() => setMaxMembers(Math.min(20, parseInt(maxMembers) + 1).toString())}
            >
              <Text style={styles.memberButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Activity'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  typeTextSelected: {
    color: COLORS.surface,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateTimeText: {
    fontSize: 16,
    color: COLORS.text,
  },
  memberSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  memberButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberButtonText: {
    fontSize: 24,
    color: COLORS.surface,
  },
  memberCount: {
    fontSize: 32,
    color: COLORS.text,
    minWidth: 60,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  createButtonText: {
    color: COLORS.surface,
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default CreateActivityScreen;
