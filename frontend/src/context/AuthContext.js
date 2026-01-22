import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // MOCK AUTH - Remove this when backend is ready
      // Demo credentials: demo@circlo.com / demo123
      if (email === 'demo@circlo.com' && password === 'demo123') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@circlo.com',
          bio: 'Love exploring my neighborhood!',
          interests: ['Shopping', 'Dining', 'Sports', 'Walking'],
          profileImage: null
        };
        
        await AsyncStorage.setItem('authToken', mockToken);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        
        setToken(mockToken);
        setUser(mockUser);
        
        return { success: true };
      }
      
      // Uncomment below when backend is ready
      // const response = await authAPI.login(email, password);
      // const { token, user } = response.data;
      // 
      // await AsyncStorage.setItem('authToken', token);
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      // 
      // setToken(token);
      // setUser(user);
      // 
      // return { success: true };
      
      return { 
        success: false, 
        error: 'Invalid credentials. Use: demo@circlo.com / demo123' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      // MOCK AUTH - Remove this when backend is ready
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        bio: '',
        interests: [],
        profileImage: null
      };
      
      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      setToken(mockToken);
      setUser(mockUser);
      
      return { success: true };
      
      // Uncomment below when backend is ready
      // const response = await authAPI.signup(userData);
      // const { token, user } = response.data;
      // 
      // await AsyncStorage.setItem('authToken', token);
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      // 
      // setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
