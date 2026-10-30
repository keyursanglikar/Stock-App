import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing } from '../theme/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isAiFlagged?: boolean; // Highlighted Orange if AI confidence < 0.8
  aiConfidence?: number;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isAiFlagged = false,
  aiConfidence,
  rightElement,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {isAiFlagged && (
          <View style={styles.aiTag}>
            <Text style={styles.aiTagText}>
              Review ({(aiConfidence ? Math.round(aiConfidence * 100) : 75)}%)
            </Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.inputWrapper,
          isAiFlagged && styles.inputAiFlagged,
          error ? styles.inputError : null,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...props}
        />
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  aiTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiTagText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: '700',
  },
  inputWrapper: {
    height: 52,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputAiFlagged: {
    borderColor: colors.primary,
    backgroundColor: '#FFFDF9',
    borderWidth: 1.8,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  rightElement: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    marginTop: 4,
  },
});
