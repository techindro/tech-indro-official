/**
 * GuidebookModal Component
 * Displays stage-specific syntax reference, key concepts, and tips
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LevelTier } from '@/types/gamification';

interface GuidebookModalProps {
  visible: boolean;
  currentTier: LevelTier;
  isDark: boolean;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = React.memo(
  ({ visible, currentTier, isDark, onClose }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: isDark ? '#1F2937' : '#E5E7EB' },
            ]}
          >
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              accessibilityLabel="Close guidebook"
            >
              <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {currentTier.title} Guidebook
            </Text>

            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Hero Header */}
            <View style={[styles.heroCard, { backgroundColor: currentTier.color }]}>
              <Ionicons name={currentTier.iconName} size={36} color="#FFF" />
              <Text style={styles.heroTitle}>{currentTier.title} Cheatsheet</Text>
              <Text style={styles.heroSubtitle}>{currentTier.description}</Text>
            </View>

            <View style={styles.body}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Key Syntax &amp; Rules
              </Text>

              <View
                style={[
                  styles.syntaxCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={styles.syntaxTitle}>1. Output &amp; Variables</Text>
                <Text style={styles.syntaxCode}>
                  print("Hello World"){"\n"}hero_name = "Motu"
                </Text>
                <Text style={styles.syntaxDesc}>
                  Use print() to output data to the screen. Variable names must start with a letter or underscore.
                </Text>
              </View>

              <View
                style={[
                  styles.syntaxCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={styles.syntaxTitle}>2. Conditionals (if-else)</Text>
                <Text style={styles.syntaxCode}>
                  if samosas &gt; 0:{"\n"}    print("Happy Motu!")
                </Text>
                <Text style={styles.syntaxDesc}>
                  Python uses 4 spaces (indentation) to define code blocks inside if, for, while, and def statements.
                </Text>
              </View>

              <View
                style={[
                  styles.syntaxCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={styles.syntaxTitle}>3. Functions</Text>
                <Text style={styles.syntaxCode}>
                  def boost_energy(x):{"\n"}    return x * 10
                </Text>
                <Text style={styles.syntaxDesc}>
                  Define reusable functions with the "def" keyword and return values using "return".
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
  },
  body: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  syntaxCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
  },
  syntaxTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 4,
  },
  syntaxCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#EA580C',
    fontSize: 12.5,
    backgroundColor: 'rgba(0,0,0,0.04)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  syntaxDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
});
