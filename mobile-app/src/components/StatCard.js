import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from './GlassCard';
import { theme } from '../styles/theme';
import { COLORS } from '../constants';

const StatCard = ({ title, value, icon: Icon, gradientColors }) => {
    return (
        <GlassCard style={styles.card}>
            <View style={styles.iconContainer}>
                <LinearGradient
                    colors={gradientColors}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {Icon && <Icon size={24} color="white" />}
                </LinearGradient>
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: theme.spacing.xs,
        alignItems: 'center',
        padding: theme.spacing.md,
        minWidth: 100,
    },
    iconContainer: {
        marginBottom: theme.spacing.sm,
    },
    iconGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.xs,
    },
    title: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
        textAlign: 'center',
    },
});

export default StatCard;
