import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type PolicyTab = 'privacy' | 'terms' | 'refund';

export default function PolicyScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<PolicyTab>('privacy');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'web' ? 12 : Math.max(insets.top, 20) + 8,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Legal & Transparency Hub
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Terms of Service, Student Privacy & 100% Refund Guarantee
            </Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabsRow}>
          {[
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'refund', label: '100% Refund Policy' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isSelected
                      ? '#ff6b35'
                      : isDark
                      ? '#1e293b'
                      : '#f1f5f9',
                    borderColor: isSelected ? '#ff6b35' : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.id as PolicyTab)}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    { color: isSelected ? '#ffffff' : colors.text },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'privacy' && (
          <View style={[styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.policyTitleRow}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#10b981" />
              <Text style={[styles.policySectionHeading, { color: colors.text }]}>Student Privacy Policy</Text>
            </View>
            <Text style={[styles.effectiveDate, { color: colors.textMuted }]}>Effective Date: October 2026</Text>

            <Text style={[styles.paragraph, { color: colors.text }]}>
              Tech Indro ("we", "our", or "us") is committed to safeguarding student data and ensuring absolute confidentiality for all users of our web and mobile applications.
            </Text>

            <Text style={[styles.subHeading, { color: colors.text }]}>1. Information We Collect</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              We collect user-provided details (Name, Email, Mobile number) strictly to provision course credentials, issue verified certificates, and track student progress. We do not sell, rent, or lease personal information to any third-party marketing brokers.
            </Text>

            <Text style={[styles.subHeading, { color: colors.text }]}>2. AI Code Processing Security</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Code snippets entered in IndroLabs Cloud Playground or shared with AI Shikshak / Bittu are processed inside sandboxed containers with TLS 1.3 encryption. Proprietary student project code is never used to train public foundational models.
            </Text>
          </View>
        )}

        {activeTab === 'terms' && (
          <View style={[styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.policyTitleRow}>
              <Ionicons name="document-text-outline" size={22} color="#3b82f6" />
              <Text style={[styles.policySectionHeading, { color: colors.text }]}>Terms of Service</Text>
            </View>
            <Text style={[styles.effectiveDate, { color: colors.textMuted }]}>Last Updated: October 2026</Text>

            <Text style={[styles.subHeading, { color: colors.text }]}>1. Course Access & License</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Upon enrolling in a Tech Indro course or cohort, students receive lifetime or scheduled access to curriculum videos, cloud sandboxes, and community discussion channels. Account credentials must remain private to a single student.
            </Text>

            <Text style={[styles.subHeading, { color: colors.text }]}>2. Code of Conduct</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              All learners agree to foster a supportive, respectful environment in Community Doubts and Code Clash arenas. Harassment, spam, or malicious code injection into sandboxes will result in immediate termination of platform privileges.
            </Text>
          </View>
        )}

        {activeTab === 'refund' && (
          <View style={[styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.policyTitleRow}>
              <Ionicons name="cash-outline" size={22} color="#ea580c" />
              <Text style={[styles.policySectionHeading, { color: colors.text }]}>100% Money-Back Guarantee</Text>
            </View>
            <Text style={[styles.effectiveDate, { color: colors.textMuted }]}>Unconditional 7-Day Guarantee</Text>

            <View style={styles.highlightBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
              <Text style={styles.highlightBadgeText}>Zero Questions Asked Refund Policy</Text>
            </View>

            <Text style={[styles.paragraph, { color: colors.text }]}>
              We are confident in the quality of Tech Indro's project-based curriculum and AI mentors. If you enroll in any paid program and feel it does not meet your expectations, simply email support@techindro.com or message our WhatsApp helpline within 7 days of enrollment.
            </Text>

            <Text style={[styles.subHeading, { color: colors.text }]}>How Refunds are Processed</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Refunds are credited directly to the original payment source (UPI, Credit/Debit Card, Netbanking) via Razorpay within 3–5 business days.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  policyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
  },
  policyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policySectionHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  effectiveDate: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 12.5,
    lineHeight: 20,
    opacity: 0.9,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  highlightBadgeText: {
    color: '#16a34a',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
