import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Users } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import PatientCard from '../components/PatientCard';
import api from '../lib/api';
import { COLORS } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const ManagePatientsScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data.patients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPatients();
        setRefreshing(false);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phoneNo.includes(searchQuery)
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
                        <TouchableOpacity onPress={logout}>
                            <LogOut size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Manage Patients</Text>
                            <Text style={styles.headerSubtitle}>{patients.length} Total Patients</Text>
                        </View>
                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name or phone..."
                />
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PatientCard
                        patient={item}
                        onPress={() => navigation.navigate('PatientDetail', { id: item._id })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Users size={64} color={COLORS.slate[300]} />
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No patients found' : 'No patients yet'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try a different search term' : 'Add your first patient to get started'}
                        </Text>
                    </View>
                }
            />
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
    searchContainer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[600],
        marginTop: theme.spacing.md,
    },
    emptySubtext: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[500],
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
});

export default ManagePatientsScreen;
