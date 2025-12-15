import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, UserPlus, Calendar, TrendingUp, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import StatCard from '../components/StatCard';
import PatientCard from '../components/PatientCard';
import GradientButton from '../components/GradientButton';
import { COLORS, APP_NAME } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const DashboardScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        newThisMonth: 0,
        todayVisits: 0,
    });
    const [recentPatients, setRecentPatients] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const patientsRes = await api.get('/patients');
            const patients = patientsRes.data.patients || [];

            // Calculate stats
            const now = new Date();
            const thisMonth = patients.filter(p => {
                const createdDate = new Date(p.createdAt);
                return createdDate.getMonth() === now.getMonth() &&
                    createdDate.getFullYear() === now.getFullYear();
            });

            setStats({
                total: patients.length,
                newThisMonth: thisMonth.length,
                todayVisits: 0, // This would need backend support
            });

            // Get recent patients (last 5)
            setRecentPatients(patients.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    return (
        <View style={commonStyles.container}>
            <LinearGradient
                colors={COLORS.gradient.purplePinkBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={logout}>
                            <LogOut size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Welcome, {user?.name || 'Doctor'}</Text>
                            <Text style={styles.headerSubtitle}>{APP_NAME}</Text>
                        </View>
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
                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <StatCard
                        title="Total Patients"
                        value={stats.total.toString()}
                        icon={Users}
                        gradientColors={COLORS.gradient.purplePink}
                    />
                    <StatCard
                        title="New This Month"
                        value={stats.newThisMonth.toString()}
                        icon={TrendingUp}
                        gradientColors={COLORS.gradient.greenTeal}
                    />
                    <StatCard
                        title="Today's Visits"
                        value={stats.todayVisits.toString()}
                        icon={Calendar}
                        gradientColors={COLORS.gradient.blueCyan}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <GradientButton
                        title="Add Patient"
                        icon={<UserPlus size={20} color="white" />}
                        onPress={() => navigation.navigate('AddPatient')}
                        colors={COLORS.gradient.greenTeal}
                        style={styles.actionButton}
                    />
                    <GradientButton
                        title="Manage Patients"
                        icon={<Users size={20} color="white" />}
                        onPress={() => navigation.navigate('ManagePatients')}
                        colors={COLORS.gradient.blueCyan}
                        style={styles.actionButton}
                    />
                </View>

                {/* Recent Patients */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Patients</Text>
                    {recentPatients.length === 0 ? (
                        <Text style={styles.emptyText}>No patients yet</Text>
                    ) : (
                        recentPatients.map((patient) => (
                            <PatientCard
                                key={patient._id}
                                patient={patient}
                                onPress={() => navigation.navigate('PatientDetail', { id: patient._id })}
                            />
                        ))
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
    headerText: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: theme.spacing.xs,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        marginHorizontal: -theme.spacing.xs,
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
    actionButton: {
        marginBottom: theme.spacing.md,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.slate[500],
        fontSize: theme.fontSize.md,
        paddingVertical: theme.spacing.xl,
    },
});

export default DashboardScreen;
