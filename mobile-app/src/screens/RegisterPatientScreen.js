import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone, Calendar as CalendarIcon, MapPin, FileText, Stethoscope, ClipboardList } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import api from '../lib/api';
import { COLORS } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const RegisterPatientScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNo: '',
        age: '',
        gender: 'Male',
        address: '',
        caseTaking: '',
        diagnosis: '',
        protocol: '',
        consent: true,
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phoneNo || !formData.age) {
            Alert.alert('Error', 'Please fill in all required fields (Name, Phone, Age)');
            return;
        }

        setLoading(true);
        try {
            await api.post('/patients', {
                ...formData,
                age: parseInt(formData.age),
            });
            Alert.alert('Success', 'Patient registered successfully', [
                { text: 'OK', onPress: () => navigation.navigate('ManagePatients') }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to register patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <LinearGradient
                colors={COLORS.gradient.greenTeal}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Register New Patient</Text>
                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

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
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name *</Text>
                            <View style={styles.inputWrapper}>
                                <User size={20} color={COLORS.slate[500]} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter patient name"
                                    value={formData.name}
                                    onChangeText={(value) => handleChange('name', value)}
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number *</Text>
                            <View style={styles.inputWrapper}>
                                <Phone size={20} color={COLORS.slate[500]} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter phone number"
                                    value={formData.phoneNo}
                                    onChangeText={(value) => handleChange('phoneNo', value)}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Age & Gender */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                                <Text style={styles.label}>Age *</Text>
                                <View style={styles.inputWrapper}>
                                    <CalendarIcon size={20} color={COLORS.slate[500]} style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Age"
                                        value={formData.age}
                                        onChangeText={(value) => handleChange('age', value)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Gender *</Text>
                                <View style={styles.genderContainer}>
                                    {['Male', 'Female', 'Other'].map((gender) => (
                                        <TouchableOpacity
                                            key={gender}
                                            style={[
                                                styles.genderButton,
                                                formData.gender === gender && styles.genderButtonActive
                                            ]}
                                            onPress={() => handleChange('gender', gender)}
                                        >
                                            <Text style={[
                                                styles.genderText,
                                                formData.gender === gender && styles.genderTextActive
                                            ]}>
                                                {gender}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Address */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <View style={styles.inputWrapper}>
                                <MapPin size={20} color={COLORS.slate[500]} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChangeText={(value) => handleChange('address', value)}
                                    multiline
                                />
                            </View>
                        </View>
                    </GlassCard>

                    <GlassCard style={styles.card}>
                        <Text style={styles.sectionTitle}>Medical Information</Text>

                        {/* Case Taking */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Case Taking / Initial Symptoms</Text>
                            <View style={styles.inputWrapper}>
                                <FileText size={20} color={COLORS.slate[500]} style={styles.icon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Describe initial symptoms..."
                                    value={formData.caseTaking}
                                    onChangeText={(value) => handleChange('caseTaking', value)}
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
                                    value={formData.diagnosis}
                                    onChangeText={(value) => handleChange('diagnosis', value)}
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
                                    value={formData.protocol}
                                    onChangeText={(value) => handleChange('protocol', value)}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </GlassCard>

                    <GradientButton
                        title="Register Patient"
                        onPress={handleSubmit}
                        loading={loading}
                        colors={COLORS.gradient.greenTeal}
                        style={styles.submitButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.md,
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
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: theme.spacing.md,
        minHeight: 48,
    },
    icon: {
        marginRight: theme.spacing.sm,
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
    row: {
        flexDirection: 'row',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    genderButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
    },
    genderButtonActive: {
        backgroundColor: COLORS.primary.green,
        borderColor: COLORS.primary.green,
    },
    genderText: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[700],
    },
    genderTextActive: {
        color: COLORS.white,
        fontWeight: theme.fontWeight.semibold,
    },
    submitButton: {
        marginBottom: theme.spacing.xl,
    },
});

export default RegisterPatientScreen;
