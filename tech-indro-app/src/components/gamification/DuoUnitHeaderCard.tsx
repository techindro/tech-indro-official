/**
 * DuoUnitHeaderCard Component
 * 3D raised unit card with stage badge, completed counter, guidebook trigger, and progress bar
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LevelTier } from '@/types/gamification';

interface DuoUnitHeaderCardProps {
  currentTier: LevelTier;
  completedCount: number;
  totalLessons: number;
  onOpenGuidebook: () => void;
}

export const DuoUnitHeaderCard: React.FC<DuoUnitHeaderCardProps> = React.memo(
  ({ currentTier, completedCount, totalLessons, onOpenGuidebook }) => {
    const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: currentTier.color,
            borderBottomColor: currentTier.shadowColor,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{currentTier.badge}</Text>
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{totalLessons} Completed
            </Text>
          </View>

          <TouchableOpacity
            onPress={onOpenGuidebook}
            style={styles.guidebookBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="book-outline" size={15} color="#FFFFFF" />
            <Text style={styles.guidebookBtnText}>GUIDEBOOK</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.titleText}>{currentTier.title}: Quest Map</Text>
        <Text style={styles.descText}>{currentTier.description}</Text>

        {/* Progress Bar Track */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    borderBottomWidth: 6,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '700',
  },
  guidebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  guidebookBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  descText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
});
