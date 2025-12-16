import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    User,
    Phone,
    MapPin,
    Calendar,
    Plus,
    Activity,
    TrendingUp,
    Clock,
    Mail,
    Cake
} from 'lucide-react-native';
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
    const scrollY = new Animated.Value(0);

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

    const getAvatarGradient = (name) => {
        const gradients = [
            COLORS.gradient.purplePink,
            COLORS.gradient.blueCyan,
            COLORS.gradient.greenTeal,
        ];
        const index = (name?.charCodeAt(0) || 0) % gradients.length;
        return gradients[index];
    };

    if (loading || !patient) {
        return (
            <View style={[commonStyles.container, commonStyles.center]}>
                <Activity size={40} color={COLORS.primary.purple} />
                <Text style={styles.loadingText}>Loading patient details...</Text>
            </View>
        );
    }

    const visits = patient.visits || [];
    const sortedVisits = [...visits].sort((a, b) =>
        new Date(b.visitDate) - new Date(a.visitDate)
    );

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={commonStyles.container}>
            {/* Animated Header */}
            <Animated.View style={[styles.headerWrapper, { opacity: headerOpacity }]}>
                <LinearGradient
                    colors={COLORS.gradient.purplePink}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.animatedHeader}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerContent}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <ArrowLeft size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle} numberOfLines={1}>{patient.name}</Text>
                            <View style={{ width: 40 }} />
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            {/* Fixed Header with Back Button */}
            <View style={styles.fixedHeader}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <View style={styles.backButtonCircle}>
                                <ArrowLeft size={20} color={COLORS.slate[800]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            <Animated.ScrollView
                style={commonStyles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Section with Gradient Avatar */}
                <LinearGradient
                    colors={getAvatarGradient(patient.name)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroSection}
                >
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarOuter}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{patient.name.charAt(0).toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={styles.quickInfoRow}>
                        <View style={styles.quickInfoBadge}>
                            <Cake size={14} color={COLORS.white} />
                            <Text style={styles.quickInfoText}>{patient.age} years</Text>
                        </View>
                        <View style={styles.quickInfoBadge}>
                            <User size={14} color={COLORS.white} />
                            <Text style={styles.quickInfoText}>{patient.gender}</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Contact Information Card */}
                <GlassCard style={styles.contactCard}>
                    <Text style={styles.cardTitle}>Contact Information</Text>

                    <View style={styles.contactRow}>
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                            <Phone size={18} color={COLORS.primary.blue} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Phone Number</Text>
                            <Text style={styles.contactValue}>{patient.phoneNo}</Text>
                        </View>
                    </View>

                    {patient.address && (
                        <View style={styles.contactRow}>
                            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                <MapPin size={18} color={COLORS.primary.green} />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Address</Text>
                                <Text style={styles.contactValue}>{patient.address}</Text>
                            </View>
                        </View>
                    )}
                </GlassCard>

                {/* Visit Statistics - Enhanced */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Visit Overview</Text>
                    <View style={styles.statsGrid}>
                        <GlassCard style={styles.statCard}>
                            <LinearGradient
                                colors={['rgba(147, 51, 234, 0.1)', 'rgba(236, 72, 153, 0.1)']}
                                style={styles.statIconWrapper}
                            >
                                <Activity size={24} color={COLORS.primary.purple} />
                            </LinearGradient>
                            <Text style={styles.statValue}>{visits.length}</Text>
                            <Text style={styles.statLabel}>Total Visits</Text>
                        </GlassCard>

                        <GlassCard style={styles.statCard}>
                            <LinearGradient
                                colors={['rgba(59, 130, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']}
                                style={styles.statIconWrapper}
                            >
                                <Calendar size={24} color={COLORS.primary.blue} />
                            </LinearGradient>
                            <Text style={styles.statValue}>
                                {visits.length > 0 ? new Date(visits[visits.length - 1].visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                            </Text>
                            <Text style={styles.statLabel}>First Visit</Text>
                        </GlassCard>

                        <GlassCard style={styles.statCard}>
                            <LinearGradient
                                colors={['rgba(16, 185, 129, 0.1)', 'rgba(20, 184, 166, 0.1)']}
                                style={styles.statIconWrapper}
                            >
                                <Clock size={24} color={COLORS.primary.green} />
                            </LinearGradient>
                            <Text style={styles.statValue}>
                                {visits.length > 0 ? new Date(visits[0].visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                            </Text>
                            <Text style={styles.statLabel}>Latest Visit</Text>
                        </GlassCard>
                    </View>
                </View>

                {/* Visit History with Timeline */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Medical History</Text>
                        <View style={styles.visitCountBadge}>
                            <Text style={styles.visitCountText}>{visits.length} visits</Text>
                        </View>
                    </View>

                    {sortedVisits.length === 0 ? (
                        <GlassCard style={styles.emptyCard}>
                            <TrendingUp size={48} color={COLORS.slate[300]} />
                            <Text style={styles.emptyTitle}>No visits recorded yet</Text>
                            <Text style={styles.emptySubtext}>Start tracking patient visits by adding the first visit</Text>
                        </GlassCard>
                    ) : (
                        <View style={styles.timelineContainer}>
                            {sortedVisits.map((visit, index) => {
                                const previousVisit = sortedVisits[index + 1];
                                const gap = previousVisit ? calculateGap(visit.visitDate, previousVisit.visitDate) : null;

                                return (
                                    <View key={visit._id} style={styles.timelineItem}>
                                        {gap && (
                                            <View style={styles.gapIndicator}>
                                                <View style={styles.gapLine} />
                                                <View style={styles.gapBadge}>
                                                    <Clock size={12} color={COLORS.slate[500]} />
                                                    <Text style={styles.gapText}>{gap} gap</Text>
                                                </View>
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
                            })}
                        </View>
                    )}
                </View>

                {/* Bottom padding for scrolling past the sticky button */}
                <View style={{ height: 120 }} />
            </Animated.ScrollView>

            {/* Floating Action Button */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('RecordRevisit', { patient })}
                    style={styles.fab}
                >
                    <LinearGradient
                        colors={COLORS.gradient.blueCyan}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.fabGradient}
                    >
                        <Plus size={28} color={COLORS.white} />
                        <Text style={styles.fabText}>Add Visit</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    animatedHeader: {
        paddingBottom: theme.spacing.md,
    },
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 11,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.md,
    },
    headerTitle: {
        flex: 1,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
        textAlign: 'center',
    },
    scrollContent: {
        paddingTop: 0,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: COLORS.slate[600],
    },
    heroSection: {
        paddingTop: 80,
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: theme.spacing.lg,
    },
    avatarWrapper: {
        marginBottom: theme.spacing.md,
    },
    avatarOuter: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.lg,
    },
    avatarText: {
        color: COLORS.primary.purple,
        fontSize: 42,
        fontWeight: theme.fontWeight.bold,
    },
    patientName: {
        fontSize: 28,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    quickInfoRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    quickInfoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        gap: theme.spacing.xs,
    },
    quickInfoText: {
        color: COLORS.white,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
    },
    contactCard: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.lg,
    },
    cardTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.md,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[500],
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contactValue: {
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
        fontWeight: theme.fontWeight.medium,
    },
    statsSection: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    statCard: {
        flex: 1,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    statIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    statValue: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: 2,
    },
    statLabel: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[600],
        textAlign: 'center',
    },
    section: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
    },
    visitCountBadge: {
        backgroundColor: COLORS.primary.purple,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    visitCountText: {
        color: COLORS.white,
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
    },
    timelineContainer: {
        position: 'relative',
    },
    timelineItem: {
        position: 'relative',
    },
    gapIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.md,
    },
    gapLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.slate[200],
    },
    gapBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.slate[100],
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        gap: 4,
        marginHorizontal: theme.spacing.sm,
    },
    gapText: {
        fontSize: theme.fontSize.xs,
        color: COLORS.slate[600],
        fontWeight: theme.fontWeight.medium,
    },
    emptyCard: {
        padding: theme.spacing.xxl,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[700],
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    emptySubtext: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[500],
        textAlign: 'center',
        lineHeight: 20,
    },
    fabContainer: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.lg,
        left: theme.spacing.lg,
    },
    fab: {
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        ...theme.shadows.lg,
        elevation: 8,
    },
    fabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    fabText: {
        color: COLORS.white,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
});

export default PatientDetailScreen;
