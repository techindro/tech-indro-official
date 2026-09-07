/**
 * NetworkStatusBanner component — Tech Indro
 * Detects online/offline state and alerts users that offline cached courses & quiz are active
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'onLine' in window.navigator) {
      setIsOffline(!window.navigator.onLine);

      const handleOnline = () => {
        setIsOffline(false);
        setDismissed(false);
      };

      const handleOffline = () => {
        setIsOffline(true);
        setDismissed(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Allow manual toggle simulation for testing
  const toggleSimulation = () => {
    setIsOffline(!isOffline);
    setDismissed(false);
  };

  if (!isOffline || dismissed) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-offline" size={16} color="#B45309" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Offline Mode Active</Text>
          <Text style={styles.bannerDesc}>
            No internet detected. Cached courses, test series & bookmarks are available offline.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => setDismissed(true)}>
        <Ionicons name="close" size={18} color="#92400E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7', // Amber alert background
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
  },
  bannerDesc: {
    fontSize: 9.5,
    color: '#B45309',
    marginTop: 1,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
});
