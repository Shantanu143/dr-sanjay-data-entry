import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import { COLORS } from '../constants';
import { theme, commonStyles } from '../styles/theme';

const AddPatientScreen = ({ navigation }) => {
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Patient Management</Text>
                            <View style={styles.subtitleContainer}>
                                <Sparkles size={16} color={COLORS.white} />
                                <Text style={styles.headerSubtitle}> Choose an option to continue</Text>
                            </View>
                        </View>
                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={commonStyles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Register New Patient */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('RegisterPatient')}
                >
                    <GlassCard style={styles.optionCard}>
                        <LinearGradient
                            colors={[...COLORS.gradient.greenTeal, 'rgba(16, 185, 129, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconCircle}
                        >
                            <UserPlus size={40} color={COLORS.primary.green} />
                        </LinearGradient>
                        <Text style={styles.optionTitle}>Register New Patient</Text>
                        <Text style={styles.optionDescription}>
                            Add a new patient to the system with their initial consultation details
                        </Text>
                        <View style={styles.arrow}>
                            <Text style={styles.arrowText}>›</Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>

                {/* Record Revisit */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('RecordRevisit')}
                >
                    <GlassCard style={styles.optionCard}>
                        <LinearGradient
                            colors={[...COLORS.gradient.blueCyan, 'rgba(59, 130, 246, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconCircle}
                        >
                            <RefreshCw size={40} color={COLORS.primary.blue} />
                        </LinearGradient>
                        <Text style={styles.optionTitle}>Record Revisit</Text>
                        <Text style={styles.optionDescription}>
                            Add a follow-up visit for an existing patient
                        </Text>
                        <View style={styles.arrow}>
                            <Text style={styles.arrowText}>›</Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
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
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    headerSubtitle: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    optionCard: {
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    optionTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    optionDescription: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[600],
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    arrow: {
        marginTop: theme.spacing.sm,
    },
    arrowText: {
        fontSize: 32,
        color: COLORS.slate[400],
    },
});

export default AddPatientScreen;
