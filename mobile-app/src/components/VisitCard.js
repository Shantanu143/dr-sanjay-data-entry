import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Activity, Stethoscope, ClipboardList, FileText, Trash2, DollarSign, CheckCircle, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
                {/* Payment Information */}
                <LinearGradient
                    colors={['rgba(16, 185, 129, 0.1)', 'rgba(20, 184, 166, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.paymentCard}
                >
                    <View style={styles.paymentHeader}>
                        <View style={styles.detailHeader}>
                            <DollarSign size={14} color={COLORS.primary.green} />
                            <Text style={[styles.detailLabel, { color: COLORS.primary.green }]}>
                                PAYMENT INFORMATION
                            </Text>
                        </View>
                    </View>
                    <View style={styles.paymentGrid}>
                        <View style={styles.paymentItem}>
                            <Text style={styles.paymentLabel}>Doctor Fees</Text>
                            <Text style={styles.paymentValue}>
                                ₹{visit.payment?.doctorFees || 0}
                            </Text>
                        </View>
                        <View style={styles.paymentItem}>
                            <Text style={styles.paymentLabel}>Status</Text>
                            <View style={[
                                styles.statusBadge,
                                visit.payment?.status === 'Paid'
                                    ? styles.statusPaid
                                    : styles.statusUnpaid
                            ]}>
                                {visit.payment?.status === 'Paid' ? (
                                    <CheckCircle size={12} color={COLORS.success} />
                                ) : (
                                    <XCircle size={12} color={COLORS.error} />
                                )}
                                <Text style={[
                                    styles.statusText,
                                    visit.payment?.status === 'Paid'
                                        ? { color: COLORS.success }
                                        : { color: COLORS.error }
                                ]}>
                                    {visit.payment?.status || 'Unpaid'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.paymentItem}>
                            <Text style={styles.paymentLabel}>Method</Text>
                            <Text style={styles.paymentValue}>
                                {visit.payment?.method || 'Not Paid'}
                            </Text>
                        </View>
                        {visit.payment?.paidDate && (
                            <View style={styles.paymentItem}>
                                <Text style={styles.paymentLabel}>Paid Date</Text>
                                <Text style={styles.paymentValue}>
                                    {new Date(visit.payment.paidDate).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>

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
    paymentCard: {
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    paymentHeader: {
        marginBottom: theme.spacing.sm,
    },
    paymentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    paymentItem: {
        flex: 1,
        minWidth: '45%',
    },
    paymentLabel: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[500],
        marginBottom: 4,
    },
    paymentValue: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[800],
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        gap: 4,
    },
    statusPaid: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    statusUnpaid: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    statusText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
    },
});

export default VisitCard;
