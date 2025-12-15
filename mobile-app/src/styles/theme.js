import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const theme = {
    colors: COLORS,

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        full: 9999,
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};

// Common styles used across the app
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.slate[50],
    },

    safeArea: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        padding: theme.spacing.md,
    },

    // Glass effect card
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        padding: theme.spacing.md,
        ...theme.shadows.md,
    },

    // Card with hover effect (for lists)
    card: {
        backgroundColor: COLORS.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },

    // Headers
    headerGradient: {
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.xxl,
    },

    headerTitle: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.white,
    },

    headerSubtitle: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: theme.spacing.xs,
    },

    // Text styles
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: COLORS.slate[800],
    },

    subtitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.slate[700],
    },

    body: {
        fontSize: theme.fontSize.md,
        color: COLORS.slate[600],
    },

    caption: {
        fontSize: theme.fontSize.sm,
        color: COLORS.slate[500],
    },

    // Buttons
    button: {
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: COLORS.white,
    },

    // Input fields
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
    },

    inputLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: COLORS.slate[700],
        marginBottom: theme.spacing.xs,
    },

    // Flexbox utilities
    row: {
        flexDirection: 'row',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Spacing utilities
    mt1: { marginTop: theme.spacing.xs },
    mt2: { marginTop: theme.spacing.sm },
    mt3: { marginTop: theme.spacing.md },
    mt4: { marginTop: theme.spacing.lg },

    mb1: { marginBottom: theme.spacing.xs },
    mb2: { marginBottom: theme.spacing.sm },
    mb3: { marginBottom: theme.spacing.md },
    mb4: { marginBottom: theme.spacing.lg },

    mx1: { marginHorizontal: theme.spacing.xs },
    mx2: { marginHorizontal: theme.spacing.sm },
    mx3: { marginHorizontal: theme.spacing.md },
    mx4: { marginHorizontal: theme.spacing.lg },

    my1: { marginVertical: theme.spacing.xs },
    my2: { marginVertical: theme.spacing.sm },
    my3: { marginVertical: theme.spacing.md },
    my4: { marginVertical: theme.spacing.lg },

    p1: { padding: theme.spacing.xs },
    p2: { padding: theme.spacing.sm },
    p3: { padding: theme.spacing.md },
    p4: { padding: theme.spacing.lg },
});
