import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, ACTIVITY_TYPES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

const ProfileSetupScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleComplete = async () => {
    if (!bio.trim()) {
      Alert.alert('Error', 'Please add a bio');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    setLoading(true);
    
    try {
      // Upload profile image if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
        await userAPI.uploadProfileImage(user.id, formData);
      }

      // Update profile
      const updatedData = {
        bio,
        interests: selectedInterests,
      };
      
      const response = await userAPI.updateProfile(user.id, updatedData);
      await updateUser(response.data);
      
      // Profile setup complete, navigation will be handled by AppNavigator
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow user to skip profile setup
    navigation.navigate('Main');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

        {/* Profile Image */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Write a short bio..."
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={150}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/150</Text>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <Text style={styles.sectionSubtitle}>
            Select activities you're interested in
          </Text>
          <View style={styles.interestsGrid}>
            {ACTIVITY_TYPES.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.interestChip,
                  selectedInterests.includes(activity.id) && {
                    backgroundColor: activity.color,
                    borderColor: activity.color,
                  },
                ]}
                onPress={() => toggleInterest(activity.id)}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(activity.id) && styles.interestTextSelected,
                  ]}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.completeButton, loading && styles.disabledButton]}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for Now</Text>
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
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  bioInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interestText: {
    fontSize: 14,
    color: COLORS.text,
  },
  interestTextSelected: {
    color: COLORS.surface,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  completeButtonText: {
    color: COLORS.surface,
    fontSize: 16,
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default ProfileSetupScreen;
