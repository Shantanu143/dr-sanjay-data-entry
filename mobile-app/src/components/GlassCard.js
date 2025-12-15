import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, theme } from '../styles/theme';

/**
 * GlassCard Component
 * 
 * A beautiful glassmorphic card component matching the web design
 * 
 * Props:
 * - children: React nodes to render inside the card
 * - style: Additional styles to apply
 * - gradient: Boolean to enable gradient background (default: false)
 * - gradientColors: Array of colors for gradient
 * 
 * Usage:
 * <GlassCard>
 *   <Text>Content here</Text>
 * </GlassCard>
 * 
 * <GlassCard gradient gradientColors={['#9333EA', '#EC4899']}>
 *   <Text>Gradient content</Text>
 * </GlassCard>
 */
const GlassCard = ({
    children,
    style,
    gradient = false,
    gradientColors = ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)']
}) => {
    if (gradient) {
        return (
            <View style={[styles.container, style]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {children}
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={[commonStyles.glassCard, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    gradient: {
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
});

export default GlassCard;
