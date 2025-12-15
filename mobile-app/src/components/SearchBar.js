import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { COLORS } from '../constants';

const SearchBar = ({ value, onChangeText, placeholder = 'Search...', style }) => {
    const handleClear = () => {
        onChangeText('');
    };

    return (
        <View style={[styles.container, style]}>
            <Search size={20} color={COLORS.slate[400]} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.slate[400]}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value ? (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <X size={20} color={COLORS.slate[400]} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: theme.spacing.md,
        height: 48,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: COLORS.slate[800],
    },
    clearButton: {
        padding: theme.spacing.xs,
    },
});

export default SearchBar;
