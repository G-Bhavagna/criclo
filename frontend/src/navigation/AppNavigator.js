import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../config/constants';
import { useAuth } from '../context/AuthContext';

// Onboarding Screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import LandingScreen from '../screens/onboarding/LandingScreen';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Profile
import ProfileSetupScreen from '../screens/profile/ProfileSetupScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';

// Main Screens
import HomeScreen from '../screens/home/HomeScreen';
import MyActivitiesScreen from '../screens/activity/MyActivitiesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Activity Screens
import CreateActivityScreen from '../screens/activity/CreateActivityScreen';
import ActivityDetailsScreen from '../screens/activity/ActivityDetailsScreen';
import JoinRequestsScreen from '../screens/activity/JoinRequestsScreen';

// Chat
import GroupChatScreen from '../screens/chat/GroupChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'map';
          } else if (route.name === 'MyActivities') {
            iconName = 'event';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="MyActivities" 
        component={MyActivitiesScreen}
        options={{ title: 'My Activities' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {showSplash ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : null}
      
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="CreateActivity" 
            component={CreateActivityScreen}
            options={{
              headerShown: true,
              headerTitle: 'Create Activity',
              headerStyle: {
                backgroundColor: COLORS.surface,
              },
              headerTitleStyle: {
              },
              headerTintColor: COLORS.text,
            }}
          />
          <Stack.Screen 
            name="ActivityDetails" 
            component={ActivityDetailsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Activity Details',
              headerStyle: {
                backgroundColor: COLORS.surface,
              },
              headerTitleStyle: {
              },
              headerTintColor: COLORS.text,
            }}
          />
          <Stack.Screen 
            name="JoinRequests" 
            component={JoinRequestsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Join Requests',
              headerStyle: {
                backgroundColor: COLORS.surface,
              },
              headerTitleStyle: {
              },
              headerTintColor: COLORS.text,
            }}
          />
          <Stack.Screen 
            name="GroupChat" 
            component={GroupChatScreen}
            options={{
              headerShown: true,
              headerTitle: 'Group Chat',
              headerStyle: {
                backgroundColor: COLORS.surface,
              },
              headerTitleStyle: {
              },
              headerTintColor: COLORS.text,
            }}
          />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfileScreen}
            options={{
              headerShown: true,
              headerTitle: 'Profile',
              headerStyle: {
                backgroundColor: COLORS.surface,
              },
              headerTitleStyle: {
              },
              headerTintColor: COLORS.text,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
