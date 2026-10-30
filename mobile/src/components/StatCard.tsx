import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme/colors';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  type = 'primary',
}) => {
  const getAccentColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'danger': return colors.danger;
      default: return colors.primary;
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: getAccentColor() }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
});
