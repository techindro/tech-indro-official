/**
 * ChestRewardModal Component
 * Celebratory popup when claiming milestone chests along the Duolingo path.
 */
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChestRewardModalProps {
  visible: boolean;
  rewardAmount: number;
  isDark: boolean;
  onClose: () => void;
}

export const ChestRewardModal: React.FC<ChestRewardModalProps> = React.memo(
  ({ visible, rewardAmount, isDark, onClose }) => {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="gift" size={54} color="#F59E0B" />
            </View>

            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Treasure Unlocked!
            </Text>

            <Text style={styles.subtitle}>
              Aapne milestone challenge paar kiya! Furfuri Nagar bonus Samosa XP rewarded!
            </Text>

            <View style={styles.xpPill}>
              <Ionicons name="diamond" size={20} color="#1CB0F6" />
              <Text style={styles.xpText}>+{rewardAmount} Samosa XP</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.claimBtn}
              activeOpacity={0.85}
              accessibilityLabel="Claim reward and continue"
            >
              <Text style={styles.claimBtnText}>CLAIM &amp; CONTINUE</Text>
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
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 176, 246, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 18,
  },
  xpText: {
    color: '#1CB0F6',
    fontSize: 15,
    fontWeight: '900',
  },
  claimBtn: {
    backgroundColor: '#F59E0B',
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  claimBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
