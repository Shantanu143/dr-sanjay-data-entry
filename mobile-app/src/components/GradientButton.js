import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, commonStyles } from '../styles/theme';
import { COLORS } from '../constants';

/**
 * GradientButton Component
 * 
 * A beautiful gradient button matching the web design
 * 
 * Props:
 * - title: Button text
 * - onPress: Function to call on press
 * - colors: Array of gradient colors (default: purple to pink)
 * - icon: Icon component to display (optional)
 * - loading: Boolean to show loading spinner
 * - disabled: Boolean to disable button
 * - style: Additional styles for container
 * - textStyle: Additional styles for text
 * 
 * Usage:
 * <GradientButton 
 *   title="Login"
 *   onPress={handleLogin}
 *   colors={['#9333EA', '#EC4899']}
 *   icon={<UserPlus size={20} color="white" />}
 * />
 */
const GradientButton = ({
    title,
    onPress,
    colors = [COLORS.primary.purple, COLORS.primary.pink],
    icon,
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[styles.container, style]}
        >
            <LinearGradient
                colors={disabled ? [COLORS.slate[300], COLORS.slate[400]] : colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                ) : (
                    <View style={styles.content}>
                        {icon && <View style={styles.icon}>{icon}</View>}
                        <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    gradient: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
});

export default GradientButton;
