import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Activity, Stethoscope, ClipboardList, FileText, Trash2 } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { theme } from '../styles/theme';
import { COLORS } from '../constants';

const VisitCard = ({ visit, visitNumber, isFirst, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Visit',
            'Are you sure you want to delete this visit?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(visit._id)
                },
            ]
        );
    };

    return (
        <GlassCard style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Calendar size={16} color={COLORS.white} />
                    </View>
                    <View>
                        <Text style={styles.visitNumber}>Visit #{visitNumber}</Text>
                        <Text style={styles.date}>{formatDate(visit.visitDate)}</Text>
                    </View>
                </View>
                {onDelete && (
                    <TouchableOpacity onPress={handleDelete}>
                        <Trash2 size={20} color={COLORS.error} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.details}>
                {visit.symptoms && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailHeader}>
                            <Activity size={14} color={COLORS.slate[500]} />
                            <Text style={styles.detailLabel}>
                                {isFirst ? 'CASE TAKING / INITIAL SYMPTOMS' : 'SYMPTOMS'}
                            </Text>
                        </View>
                        <Text style={styles.detailText}>{visit.symptoms}</Text>
                    </View>
                )}

                {visit.diagnosis && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailHeader}>
                            <Stethoscope size={14} color={COLORS.slate[500]} />
                            <Text style={styles.detailLabel}>DIAGNOSIS</Text>
                        </View>
                        <Text style={styles.detailText}>{visit.diagnosis}</Text>
                    </View>
                )}

                {visit.protocol && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailHeader}>
                            <ClipboardList size={14} color={COLORS.slate[500]} />
                            <Text style={styles.detailLabel}>TREATMENT PROTOCOL</Text>
                        </View>
                        <Text style={styles.detailText}>{visit.protocol}</Text>
                    </View>
                )}

                {visit.notes && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailHeader}>
                            <FileText size={14} color={COLORS.slate[500]} />
                            <Text style={styles.detailLabel}>NOTES</Text>
                        </View>
                        <Text style={styles.detailText}>{visit.notes}</Text>
                    </View>
                )}
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.primary.blue,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
    },
    visitNumber: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[800],
    },
    date: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
    },
    details: {
        gap: theme.spacing.md,
    },
    detailItem: {
        gap: theme.spacing.xs,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    detailLabel: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[500],
        fontWeight: theme.fontWeight.medium,
    },
    detailText: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[700],
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
});

export default VisitCard;
