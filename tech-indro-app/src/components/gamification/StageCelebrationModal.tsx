/**
 * StageCelebrationModal Component
 * Modal triggered upon completing all lessons of a stage/tier
 */
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LevelTier, LevelTierId } from '@/types/gamification';
import { LEVEL_TIERS } from '@/data/gamifiedLessons';

interface StageCelebrationModalProps {
  visible: boolean;
  currentTier: LevelTier;
  isDark: boolean;
  onAdvanceToNextTier: (nextTierId: LevelTierId) => void;
  onClose: () => void;
}

export const StageCelebrationModal: React.FC<StageCelebrationModalProps> = React.memo(
  ({ visible, currentTier, isDark, onAdvanceToNextTier, onClose }) => {
    const currentIdx = LEVEL_TIERS.findIndex((t) => t.id === currentTier.id);
    const nextTier =
      currentIdx < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIdx + 1] : null;

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <Image
              source={require('../../../assets/images/characters/motu-patlu-3d.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {currentTier.title} Mastered!
            </Text>

            <Text style={styles.subtitle}>
              Aapne sabhi 10 puzzles complete kar liye! Motu, Patlu aur Furfuri Nagar team aapko salute karti hai!
            </Text>

            <View style={styles.xpRow}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.xpText}>+125 Samosa XP Master Badge</Text>
            </View>

            {nextTier && (
              <TouchableOpacity
                onPress={() => onAdvanceToNextTier(nextTier.id)}
                style={[styles.nextBtn, { backgroundColor: nextTier.color }]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>Advance to {nextTier.title}</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Back to Quest Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  xpText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
