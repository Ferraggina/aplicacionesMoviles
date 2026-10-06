import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppButton({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  secondary: { backgroundColor: 'transparent' },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#0066cc' },
});
