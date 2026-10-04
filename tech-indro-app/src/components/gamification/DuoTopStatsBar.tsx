/**
 * DuoTopStatsBar Component
 * Displays language track, gold streak flame, diamond gems XP, heart lives, and Pro shield.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DuoTopStatsBarProps {
  streakDays: number;
  samosaXp: number;
  samosas: number;
  isDark: boolean;
  onBack: () => void;
}

export const DuoTopStatsBar: React.FC<DuoTopStatsBarProps> = React.memo(
  ({ streakDays, samosaXp, samosas, isDark, onBack }) => {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.leftGroup}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backBtn, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>

          <View
            style={[
              styles.langPill,
              {
                borderColor: isDark ? '#374151' : '#E5E7EB',
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              },
            ]}
          >
            <Ionicons name="code-slash" size={15} color="#58CC02" />
            <Text style={[styles.langText, { color: isDark ? '#F9FAFB' : '#111827' }]}>Python 3</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* Streak Flame */}
          <View style={[styles.statBadge, styles.streakBg]}>
            <Ionicons name="flame" size={17} color="#FF9600" />
            <Text style={[styles.statValue, { color: '#FF9600' }]}>{streakDays}</Text>
          </View>

          {/* Samosa XP Gems */}
          <View style={[styles.statBadge, styles.gemsBg]}>
            <Ionicons name="diamond" size={16} color="#1CB0F6" />
            <Text style={[styles.statValue, { color: '#1CB0F6' }]}>{samosaXp}</Text>
          </View>

          {/* Lives / Hearts */}
          <View style={[styles.statBadge, styles.heartsBg]}>
            <Ionicons name="heart" size={17} color="#FF4B4B" />
            <Text style={[styles.statValue, { color: '#FF4B4B' }]}>{samosas}</Text>
          </View>

          {/* Super / Pro Shield */}
          <LinearGradient
            colors={['#9333EA', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proShield}
          >
            <Ionicons name="shield" size={13} color="#FFF" />
            <Text style={styles.proShieldText}>PRO</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  langText: {
    fontSize: 13,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  streakBg: {
    backgroundColor: 'rgba(255, 150, 0, 0.12)',
  },
  gemsBg: {
    backgroundColor: 'rgba(28, 176, 246, 0.12)',
  },
  heartsBg: {
    backgroundColor: 'rgba(255, 75, 75, 0.12)',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  proShield: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  proShieldText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
});
