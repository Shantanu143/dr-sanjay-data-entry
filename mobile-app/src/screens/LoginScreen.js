import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { COLORS, APP_NAME } from '../constants';
import { theme, commonStyles } from '../styles/theme';

/**
 * LoginScreen Component
 * 
 * Beautiful login screen matching the web design
 * 
 * Features:
 * - Email/password input
 * - Show/hide password
 * - Loading states
 * - Error handling
 * - Gradient background
 * - Glassmorphic card
 * 
 * TODO:
 * 1. Test with backend API
 * 2. Add "Remember Me" checkbox
 * 3. Add "Forgot Password" link
 * 4. Add form validation
 * 5. Add keyboard dismiss on tap outside
 */
const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await login(email, password);

            if (result.success) {
                // Navigation is handled by AuthContext
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={COLORS.gradient.purplePinkBlue}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={commonStyles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.appName}>{APP_NAME}</Text>
                            <View style={styles.subtitleContainer}>
                                <Sparkles size={16} color={COLORS.white} />
                                <Text style={styles.subtitle}>Sign in to Dashboard</Text>
                            </View>
                        </View>

                        {/* Login Card */}
                        <GlassCard style={styles.card}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.description}>
                                Sign in to access your patient management dashboard
                            </Text>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <Mail size={20} color={COLORS.slate[500]} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.slate[400]}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Lock size={20} color={COLORS.slate[500]} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.slate[400]}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} color={COLORS.slate[500]} />
                                        ) : (
                                            <Eye size={20} color={COLORS.slate[500]} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Login Button */}
                            <GradientButton
                                title="Sign In"
                                onPress={handleLogin}
                                loading={loading}
                                colors={COLORS.gradient.purplePink}
                                style={styles.loginButton}
                            />

                            {/* TODO: Add Remember Me and Forgot Password */}
                        </GlassCard>

                        {/* Footer */}
                        <Text style={styles.footer}>
                            Patient Management System v1.0
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    appName: {
        fontSize: 36,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
        textAlign: 'center',
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: COLORS.white,
        marginLeft: theme.spacing.xs,
    },
    card: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.xs,
    },
    description: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
        marginBottom: theme.spacing.lg,
    },
    inputContainer: {
        marginBottom: theme.spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
    },
    eyeIcon: {
        padding: theme.spacing.xs,
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    errorText: {
        color: COLORS.error,
        fontSize: theme.fontSize.sm,
    },
    loginButton: {
        marginTop: theme.spacing.md,
    },
    footer: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xl,
    },
});

export default LoginScreen;
