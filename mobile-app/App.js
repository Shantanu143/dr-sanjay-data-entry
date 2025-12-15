import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App Component
 * 
 * This is the root component of the application.
 * It sets up:
 * - SafeAreaProvider for safe area handling
 * - AuthProvider for authentication context
 * - AppNavigator for navigation
 * - StatusBar configuration
 * 
 * TODO:
 * 1. Create AppNavigator component
 * 2. Test on both iOS and Android
 * 3. Add error boundary
 * 4. Add loading screen while checking auth
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
