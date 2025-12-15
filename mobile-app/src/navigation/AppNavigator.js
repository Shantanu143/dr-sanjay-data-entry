import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import RegisterPatientScreen from '../screens/RegisterPatientScreen';
import RecordRevisitScreen from '../screens/RecordRevisitScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';
import ManagePatientsScreen from '../screens/ManagePatientsScreen';

const Stack = createNativeStackNavigator();

// Loading screen component
const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.slate[50] }}>
        <ActivityIndicator size="large" color={COLORS.primary.purple} />
    </View>
);

// Main App Navigator
const AppNavigator = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
                        <Stack.Screen name="ManagePatients" component={ManagePatientsScreen} />
                        <Stack.Screen name="RegisterPatient" component={RegisterPatientScreen} />
                        <Stack.Screen name="RecordRevisit" component={RecordRevisitScreen} />
                        <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

