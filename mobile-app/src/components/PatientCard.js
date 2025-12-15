import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { theme } from '../styles/theme';
import { COLORS } from '../constants';

const PatientCard = ({ patient, onPress }) => {
    const getInitial = (name) => name?.charAt(0).toUpperCase() || 'P';

    const getAvatarColor = (name) => {
        const colors = [
            COLORS.primary.purple,
            COLORS.primary.pink,
            COLORS.primary.blue,
            COLORS.primary.green,
            COLORS.primary.teal,
        ];
        const index = (name?.charCodeAt(0) || 0) % colors.length;
        return colors[index];
    };

    return (
        <TouchableOpacity onPress={() => onPress(patient)} activeOpacity={0.7}>
            <GlassCard style={styles.card}>
                <View style={styles.content}>
                    <View style={[styles.avatar, { backgroundColor: getAvatarColor(patient.name) }]}>
                        <Text style={styles.avatarText}>{getInitial(patient.name)}</Text>
                    </View>

                    <View style={styles.info}>
                        <Text style={styles.name}>{patient.name}</Text>
                        <View style={styles.details}>
                            <Text style={styles.detail}>
                                Age: {patient.age} • {patient.gender}
                            </Text>
                            <View style={styles.row}>
                                <Phone size={14} color={COLORS.slate[500]} />
                                <Text style={styles.phone}> {patient.phoneNo}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.arrow}>
                        <Text style={styles.arrowText}>›</Text>
                    </View>
                </View>
            </GlassCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    avatarText: {
        color: COLORS.white,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.xs,
    },
    details: {
        gap: theme.spacing.xs,
    },
    detail: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phone: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
    },
    arrow: {
        marginLeft: theme.spacing.sm,
    },
    arrowText: {
        fontSize: 24,
        color: COLORS.slate[400],
    },
});

export default PatientCard;
