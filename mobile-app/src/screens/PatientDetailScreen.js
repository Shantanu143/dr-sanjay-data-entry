import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone, MapPin, Calendar, Plus } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import VisitCard from '../components/VisitCard';
import GradientButton from '../components/GradientButton';
import api from '../lib/api';
import { COLORS } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const PatientDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPatientDetails();
    }, [id]);

    const fetchPatientDetails = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
            Alert.alert('Error', 'Failed to load patient details');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPatientDetails();
        setRefreshing(false);
    };

    const calculateGap = (date1, date2) => {
        const diff = Math.abs(new Date(date1) - new Date(date2));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''}`;
        if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''}`;
        return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''}`;
    };

    const handleDeleteVisit = async (visitId) => {
        try {
            await api.delete(`/patients/${id}/visits/${visitId}`);
            Alert.alert('Success', 'Visit deleted successfully');
            fetchPatientDetails();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete visit');
        }
    };

    if (loading || !patient) {
        return (
            <View style={[commonStyles.container, commonStyles.center]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const visits = patient.visits || [];
    const sortedVisits = [...visits].sort((a, b) =>
        new Date(b.visitDate) - new Date(a.visitDate)
    );

    return (
        <View style={commonStyles.container}>
            <LinearGradient
                colors={COLORS.gradient.purplePink}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Patient Details</Text>
                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={commonStyles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Patient Info Card */}
                <GlassCard style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{patient.name.charAt(0).toUpperCase()}</Text>
                        </View>
                    </View>
                    <Text style={styles.patientName}>{patient.name}</Text>

                    <View style={styles.infoRow}>
                        <User size={16} color={COLORS.slate[600]} />
                        <Text style={styles.infoText}>Age: {patient.age} • {patient.gender}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Phone size={16} color={COLORS.slate[600]} />
                        <Text style={styles.infoText}>{patient.phoneNo}</Text>
                    </View>

                    {patient.address && (
                        <View style={styles.infoRow}>
                            <MapPin size={16} color={COLORS.slate[600]} />
                            <Text style={styles.infoText}>{patient.address}</Text>
                        </View>
                    )}
                </GlassCard>

                {/* Visit Statistics */}
                <View style={styles.statsRow}>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>{visits.length}</Text>
                        <Text style={styles.statLabel}>Total Visits</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {visits.length > 0 ? new Date(visits[visits.length - 1].visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                        </Text>
                        <Text style={styles.statLabel}>First Visit</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {visits.length > 0 ? new Date(visits[0].visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                        </Text>
                        <Text style={styles.statLabel}>Latest Visit</Text>
                    </GlassCard>
                </View>

                {/* Add Visit Button */}
                <GradientButton
                    title="Add Visit"
                    icon={<Plus size={20} color="white" />}
                    onPress={() => {
                        // Navigate to add visit (could be a modal or new screen)
                        Alert.alert('Add Visit', 'This would open add visit form');
                    }}
                    colors={COLORS.gradient.blueCyan}
                    style={styles.addButton}
                />

                {/* Visit History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visit History</Text>

                    {sortedVisits.length === 0 ? (
                        <Text style={styles.emptyText}>No visits recorded yet</Text>
                    ) : (
                        sortedVisits.map((visit, index) => {
                            const previousVisit = sortedVisits[index + 1];
                            const gap = previousVisit ? calculateGap(visit.visitDate, previousVisit.visitDate) : null;

                            return (
                                <View key={visit._id}>
                                    {gap && (
                                        <View style={styles.gapIndicator}>
                                            <View style={styles.gapLine} />
                                            <Text style={styles.gapText}>{gap} gap</Text>
                                            <View style={styles.gapLine} />
                                        </View>
                                    )}
                                    <VisitCard
                                        visit={visit}
                                        visitNumber={visits.length - index}
                                        isFirst={index === sortedVisits.length - 1}
                                        onDelete={handleDeleteVisit}
                                    />
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: theme.spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    headerTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    card: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary.purple,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: theme.fontWeight.bold,
    },
    patientName: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    infoText: {
        fontSize: theme.fontSize.md,
        color: COLORS.slate[600],
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    statCard: {
        flex: 1,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[600],
        textAlign: 'center',
    },
    addButton: {
        marginBottom: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.md,
    },
    gapIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.md,
    },
    gapLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.slate[300],
    },
    gapText: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[500],
        marginHorizontal: theme.spacing.md,
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.slate[500],
        fontSize: theme.fontSize.md,
        paddingVertical: theme.spacing.xl,
    },
});

export default PatientDetailScreen;
