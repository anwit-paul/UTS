import React from 'react';
import { useRouter } from 'expo-router';
import BookingDetailsScreen from '@/screens/BookingDetailsScreen';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <BookingDetailsScreen
      navigation={{
        goBack: () => router.back(),
      }}
    />
  );
}
