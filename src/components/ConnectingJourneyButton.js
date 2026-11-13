import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ConnectingJourneyButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>Book Connecting Journey</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: '#0056b3',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#0056b3',
    fontSize: 15,
    fontWeight: '600',
  },
});

