/**
 * Tech Indro App — Login Screen
 * Instant onboarding with Truecaller 1-tap sheet
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import TechIndroWelcomeAuth from '@/components/TechIndroWelcomeAuth';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TechIndroWelcomeAuth
        isModal={false}
        visible={true}
        onClose={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}
        onSuccess={() => {
          router.replace('/');
        }}
        initialName="Rahul Sharma"
        initialPhone="9876543210"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162456',
  },
});
