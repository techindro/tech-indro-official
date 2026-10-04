/**
 * DuoStageNav Component
 * Horizontal navigation pills for filtering between roadmap stages
 */
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LEVEL_TIERS } from '@/data/gamifiedLessons';
import { LevelTierId } from '@/types/gamification';

interface DuoStageNavProps {
  activeTierId: LevelTierId;
  isDark: boolean;
  onSelectTier: (id: LevelTierId) => void;
}

export const DuoStageNav: React.FC<DuoStageNavProps> = React.memo(
  ({ activeTierId, isDark, onSelectTier }) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {LEVEL_TIERS.map((tier) => {
          const isActive = tier.id === activeTierId;
          return (
            <TouchableOpacity
              key={tier.id}
              onPress={() => onSelectTier(tier.id)}
              activeOpacity={0.8}
              style={[
                styles.pill,
                isActive
                  ? {
                      backgroundColor: tier.color,
                      borderColor: tier.color,
                      borderBottomColor: tier.shadowColor,
                    }
                  : {
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                      borderBottomColor: isDark ? '#111827' : '#D1D5DB',
                    },
              ]}
            >
              <Ionicons
                name={tier.iconName}
                size={15}
                color={isActive ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.pillText,
                  { color: isActive ? '#FFFFFF' : isDark ? '#E5E7EB' : '#374151' },
                ]}
              >
                {tier.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 3.5,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
