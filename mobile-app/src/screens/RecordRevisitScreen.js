import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar as CalendarIcon, Activity, Stethoscope, ClipboardList, FileText, DollarSign, CreditCard, Banknote } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SearchBar from '../components/SearchBar';
import PatientCard from '../components/PatientCard';
import api from '../lib/api';
import { COLORS } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const RecordRevisitScreen = ({ navigation, route }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(route.params?.patient || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [visitData, setVisitData] = useState({
        visitDate: new Date().toISOString().split('T')[0],
        symptoms: '',
        diagnosis: '',
        protocol: '',
        notes: '',
        payment: {
            doctorFees: '',
            status: 'Unpaid',
            method: 'Not Paid',
            transactionId: '',
        },
    });

    useEffect(() => {
        if (route.params?.patient) {
            setSelectedPatient(route.params.patient);
        }
        fetchPatients();
    }, [route.params?.patient]);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data.patients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            Alert.alert('Error', 'Failed to load patients');
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phoneNo.includes(searchQuery)
    );

    const handleVisitChange = (field, value) => {
        if (field.startsWith('payment.')) {
            const paymentField = field.split('.')[1];
            setVisitData({
                ...visitData,
                payment: {
                    ...visitData.payment,
                    [paymentField]: value,
                },
            });
        } else {
            setVisitData({ ...visitData, [field]: value });
        }
    };

    const handleSubmit = async () => {
        if (!visitData.visitDate) {
            Alert.alert('Error', 'Please select a visit date');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/patients/${selectedPatient._id}/visits`, visitData);
            Alert.alert('Success', 'Visit recorded successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('PatientDetail', { id: selectedPatient._id })
                }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to record visit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <LinearGradient
                colors={COLORS.gradient.blueCyan}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => selectedPatient ? setSelectedPatient(null) : navigation.goBack()}>
                            <ArrowLeft size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Record Revisit</Text>
                            <Text style={styles.headerSubtitle}>
                                {selectedPatient ? `Adding visit for ${selectedPatient.name}` : 'Select a patient'}
                            </Text>
                        </View>
                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {!selectedPatient ? (
                // Patient Selection
                <View style={{ flex: 1 }}>
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
                                onPress={setSelectedPatient}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No patients found</Text>
                        }
                    />
                </View>
            ) : (
                // Visit Form
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={commonStyles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <GlassCard style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.sectionTitle}>Visit Details</Text>
                                <TouchableOpacity onPress={() => setSelectedPatient(null)}>
                                    <Text style={styles.changeButton}>Change Patient</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Visit Date */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Visit Date *</Text>
                                <View style={styles.inputWrapper}>
                                    <CalendarIcon size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        value={visitData.visitDate}
                                        onChangeText={(value) => handleVisitChange('visitDate', value)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                            </View>

                            {/* Symptoms */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Symptoms</Text>
                                <View style={styles.inputWrapper}>
                                    <Activity size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Describe patient symptoms..."
                                        value={visitData.symptoms}
                                        onChangeText={(value) => handleVisitChange('symptoms', value)}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* Diagnosis */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Diagnosis</Text>
                                <View style={styles.inputWrapper}>
                                    <Stethoscope size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Enter diagnosis..."
                                        value={visitData.diagnosis}
                                        onChangeText={(value) => handleVisitChange('diagnosis', value)}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* Protocol */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Treatment Protocol</Text>
                                <View style={styles.inputWrapper}>
                                    <ClipboardList size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Enter treatment protocol..."
                                        value={visitData.protocol}
                                        onChangeText={(value) => handleVisitChange('protocol', value)}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* Notes */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Additional Notes</Text>
                                <View style={styles.inputWrapper}>
                                    <FileText size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Any additional notes..."
                                        value={visitData.notes}
                                        onChangeText={(value) => handleVisitChange('notes', value)}
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        </GlassCard>

                        {/* Payment Information Card */}
                        <GlassCard style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.sectionTitle}>Payment Information</Text>
                            </View>

                            {/* Doctor Fees */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Doctor Fees (₹)</Text>
                                <View style={styles.inputWrapper}>
                                    <Banknote size={20} color={COLORS.primary.green} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter amount"
                                        value={visitData.payment.doctorFees}
                                        onChangeText={(value) => handleVisitChange('payment.doctorFees', value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Payment Status */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Payment Status</Text>
                                <View style={styles.pickerWrapper}>
                                    <DollarSign size={20} color={COLORS.primary.green} style={styles.icon} />
                                    <View style={styles.pickerContainer}>
                                        <TouchableOpacity
                                            style={styles.pickerButton}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Payment Status',
                                                    'Select payment status',
                                                    [
                                                        {
                                                            text: 'Unpaid',
                                                            onPress: () => handleVisitChange('payment.status', 'Unpaid')
                                                        },
                                                        {
                                                            text: 'Paid',
                                                            onPress: () => handleVisitChange('payment.status', 'Paid')
                                                        },
                                                        { text: 'Cancel', style: 'cancel' }
                                                    ]
                                                );
                                            }}
                                        >
                                            <Text style={styles.pickerText}>
                                                {visitData.payment.status || 'Select status'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Payment Method */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Payment Method</Text>
                                <View style={styles.pickerWrapper}>
                                    <CreditCard size={20} color={COLORS.primary.green} style={styles.icon} />
                                    <View style={styles.pickerContainer}>
                                        <TouchableOpacity
                                            style={styles.pickerButton}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Payment Method',
                                                    'Select payment method',
                                                    [
                                                        {
                                                            text: 'UPI',
                                                            onPress: () => handleVisitChange('payment.method', 'UPI')
                                                        },
                                                        {
                                                            text: 'Card',
                                                            onPress: () => handleVisitChange('payment.method', 'Card')
                                                        },
                                                        {
                                                            text: 'Cash',
                                                            onPress: () => handleVisitChange('payment.method', 'Cash')
                                                        },
                                                        {
                                                            text: 'Not Paid',
                                                            onPress: () => handleVisitChange('payment.method', 'Not Paid')
                                                        },
                                                        { text: 'Cancel', style: 'cancel' }
                                                    ]
                                                );
                                            }}
                                        >
                                            <Text style={styles.pickerText}>
                                                {visitData.payment.method || 'Select method'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Transaction ID */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Transaction ID (Optional)</Text>
                                <View style={styles.inputWrapper}>
                                    <FileText size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter transaction ID"
                                        value={visitData.payment.transactionId}
                                        onChangeText={(value) => handleVisitChange('payment.transactionId', value)}
                                    />
                                </View>
                            </View>
                        </GlassCard>

                        <GradientButton
                            title="Record Visit"
                            onPress={handleSubmit}
                            loading={loading}
                            colors={COLORS.gradient.blueCyan}
                            style={styles.submitButton}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
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
    headerTextContainer: {
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
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.slate[500],
        fontSize: theme.fontSize.md,
        paddingVertical: theme.spacing.xl,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    card: {
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
    },
    changeButton: {
        fontSize: theme.fontSize.sm,
        color: COLORS.primary.blue,
        fontWeight: theme.fontWeight.semibold,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: COLORS.slate[700],
        marginBottom: theme.spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: theme.spacing.md,
        minHeight: 48,
    },
    icon: {
        marginRight: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
        paddingVertical: theme.spacing.sm,
    },
    textArea: {
        minHeight: 100,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: theme.spacing.md,
        minHeight: 48,
    },
    pickerContainer: {
        flex: 1,
    },
    pickerButton: {
        paddingVertical: theme.spacing.sm,
    },
    pickerText: {
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
    },
    submitButton: {
        marginBottom: theme.spacing.xl,
    },
});

export default RecordRevisitScreen;
