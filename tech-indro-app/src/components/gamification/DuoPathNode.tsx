/**
 * DuoPathNode Component
 * Represents a single Duolingo 3D stepping stone along the winding S-curve learning path.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LevelTier } from '@/types/gamification';

interface DuoPathNodeProps {
  index: number;
  offset: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  isChest: boolean;
  isChestClaimed: boolean;
  currentTier: LevelTier;
  isDark: boolean;
  onPress: () => void;
}

export const DuoPathNode: React.FC<DuoPathNodeProps> = React.memo(
  ({
    index,
    offset,
    isCompleted,
    isActive,
    isLocked,
    isChest,
    isChestClaimed,
    currentTier,
    isDark,
    onPress,
  }) => {
    return (
      <View style={styles.wrapper}>
        {/* Connector line to previous node */}
        {index > 0 && (
          <View
            style={[
              styles.connector,
              {
                backgroundColor:
                  !isLocked
                    ? currentTier.color
                    : isDark
                    ? '#374151'
                    : '#E5E7EB',
              },
            ]}
          />
        )}

        <View
          style={[
            styles.nodeContainer,
            {
              transform: [{ translateX: offset }],
            },
          ]}
        >
          {/* Floating START Tooltip above active node */}
          {isActive && (
            <View style={styles.tooltipWrap}>
              <View style={[styles.tooltipBadge, { backgroundColor: currentTier.color }]}>
                <Text style={styles.tooltipText}>START</Text>
              </View>
              <View style={[styles.tooltipArrow, { borderTopColor: currentTier.color }]} />
            </View>
          )}

          {/* 3D Stepping Stone Button */}
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.82}
            style={[
              isChest ? styles.chestBtn : styles.circleBtn,
              isCompleted
                ? styles.btnCompleted
                : isActive
                ? [
                    styles.btnActive,
                    {
                      backgroundColor: currentTier.color,
                      borderBottomColor: currentTier.shadowColor,
                    },
                  ]
                : isLocked
                ? isDark
                  ? styles.btnLockedDark
                  : styles.btnLockedLight
                : {},
            ]}
          >
            {isChest ? (
              <Ionicons
                name="gift"
                size={30}
                color={isChestClaimed ? '#FDE68A' : '#FFFFFF'}
              />
            ) : isCompleted ? (
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            ) : isActive ? (
              <Ionicons name="star" size={32} color="#FFFFFF" />
            ) : (
              <Ionicons
                name="lock-closed"
                size={24}
                color={isDark ? '#6B7280' : '#9CA3AF'}
              />
            )}
          </TouchableOpacity>

          <Text
            style={[
              styles.label,
              {
                color: isActive
                  ? isDark
                    ? '#F9FAFB'
                    : '#111827'
                  : isDark
                  ? '#9CA3AF'
                  : '#6B7280',
                fontWeight: isActive ? '800' : '600',
              },
            ]}
            numberOfLines={1}
          >
            {isChest
              ? isChestClaimed
                ? 'Claimed'
                : '+50 XP Chest'
              : `Lesson ${index + 1}`}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
  connector: {
    width: 6,
    height: 24,
    borderRadius: 3,
  },
  nodeContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  tooltipWrap: {
    alignItems: 'center',
    marginBottom: 2,
  },
  tooltipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circleBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
  },
  chestBtn: {
    width: 78,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
    backgroundColor: '#F59E0B',
    borderBottomColor: '#B45309',
  },
  btnCompleted: {
    backgroundColor: '#FFC800',
    borderBottomColor: '#CC9A00',
  },
  btnActive: {
    elevation: 4,
  },
  btnLockedLight: {
    backgroundColor: '#E5E7EB',
    borderBottomColor: '#CBD5E1',
  },
  btnLockedDark: {
    backgroundColor: '#374151',
    borderBottomColor: '#1F2937',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});
