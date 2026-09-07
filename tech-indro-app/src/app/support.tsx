/**
 * Live WhatsApp Support & Student Community Hub — Tech Indro
 * Connect with academic mentors on WhatsApp, join student channels,
 * and browse instant FAQ answers.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

const FAQS = [
  {
    q: 'How do I download my verified certificate?',
    a: 'Go to your Student Dashboard, click on "Verified Credentials & Honors", and tap "Download Certificate". You can also directly add it to your LinkedIn profile with one click.',
  },
  {
    q: 'Can I complete hands-on labs on mobile without a laptop?',
    a: 'Yes! All courses, quizzes, and even the IndroLabs Code Playground and ISRO Virtual Space Lab run natively inside the mobile app on any smartphone.',
  },
  {
    q: 'What is the selection process for TSOC 2026 Fellowship?',
    a: 'Submit your application from the TSOC screen with your GitHub link. Shortlisted applicants are invited for a 15-minute technical conversation and receive 1-on-1 mentorship with ₹50K stipend.',
  },
  {
    q: 'Are the Test Series questions aligned with GATE & ISRO patterns?',
    a: 'Yes, our 4,500+ question bank is curated from official GATE, ISRO ICRB, DRDO, and top product company hiring assessments with MCQ, MSQ, and NAT formats.',
  },
];

const COMMUNITIES = [
  {
    id: 'wa',
    name: 'WhatsApp Student Hub',
    desc: '25,000+ engineers discussing daily code and doubts',
    icon: 'logo-whatsapp',
    color: '#25D366',
    url: 'https://api.whatsapp.com/send?phone=917007896695&text=Hi%20Tech%20Indro%20Team!%20Please%20add%20me%20to%20the%20student%20community.',
  },
  {
    id: 'discord',
    name: 'Discord Dev Server',
    desc: 'Voice coding rooms, hackathons, and bug-solving',
    icon: 'logo-discord',
    color: '#5865F2',
    url: 'https://discord.gg/techindro',
  },
  {
    id: 'telegram',
    name: 'Telegram Career Alerts',
    desc: 'Instant tech internship openings and off-campus drives',
    icon: 'paper-plane',
    color: '#0088CC',
    url: 'https://t.me/techindro',
  },
  {
    id: 'youtube',
    name: 'YouTube Masterclasses',
    desc: 'Free project walkthroughs and ISRO robotics tutorials',
    icon: 'logo-youtube',
    color: '#FF0000',
    url: 'https://youtube.com/@techindro',
  },
];

export default function SupportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleOpenWhatsApp = () => {
    const url = 'https://api.whatsapp.com/send?phone=917007896695&text=Hello%20Tech%20Indro%20Mentors,%20I%20need%20guidance%20with%20my%20learning%20path.';
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp', 'Could not open WhatsApp. You can call +91 7007896695 directly.');
    });
  };

  const handleCall = () => {
    Linking.openURL('tel:+917007896695').catch(() => {
      Alert.alert('Phone', 'Call +91 7007896695');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@techindro.com').catch(() => {
      Alert.alert('Email', 'Send email to support@techindro.com');
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>Help & Community Hub</Text>
        <View style={styles.onlinePill}>
          <View style={styles.greenDot} />
          <Text style={styles.onlineText}>ONLINE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero WhatsApp Direct Card */}
        <View style={styles.whatsappCard}>
          <View style={styles.waCardHeader}>
            <View style={styles.waIconBox}>
              <Ionicons name="logo-whatsapp" size={32} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waCardTitle}>Direct WhatsApp Mentor Desk</Text>
              <Text style={styles.waCardDesc}>
                Chat directly with our academic mentors & technical advisors.
              </Text>
            </View>
          </View>

          <View style={styles.waMetaRow}>
            <View style={styles.waMetaItem}>
              <Ionicons name="time-outline" size={14} color="#D1FAE5" />
              <Text style={styles.waMetaText}>Avg reply: &lt; 5 mins</Text>
            </View>
            <View style={styles.waMetaItem}>
              <Ionicons name="chatbubbles-outline" size={14} color="#D1FAE5" />
              <Text style={styles.waMetaText}>Hinglish & English</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.chatNowBtn} onPress={handleOpenWhatsApp} activeOpacity={0.9}>
            <Ionicons name="logo-whatsapp" size={20} color="#065F46" />
            <Text style={styles.chatNowText}>Start WhatsApp Chat Now</Text>
          </TouchableOpacity>
        </View>

        {/* Student Communities Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Join Developer Communities</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Collaborate with peers, participate in hackathons & find project partners.
        </Text>

        <View style={styles.communityGrid}>
          {COMMUNITIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.communityCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.8}
              onPress={() => Linking.openURL(c.url).catch(() => Alert.alert(c.name, c.desc))}
            >
              <View style={[styles.commIconCircle, { backgroundColor: c.color + '22' }]}>
                <Ionicons name={c.icon as any} size={24} color={c.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.commName, { color: colors.text }]}>{c.name}</Text>
                <Text style={styles.commDesc} numberOfLines={2}>{c.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Accordion */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>
          Frequently Asked Questions
        </Text>

        <View style={styles.faqList}>
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.8}
                onPress={() => setExpandedFaq(isExpanded ? null : idx)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.primaryLight}
                  />
                </View>
                {isExpanded && (
                  <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact Information Card */}
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Tech Indro Headquarters</Text>
          <Text style={styles.contactAddress}>Varanasi, Uttar Pradesh, India • 221005</Text>

          <View style={styles.contactActionRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
              <Ionicons name="call" size={16} color={Colors.primary} />
              <Text style={styles.contactBtnText}>+91 7007896695</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
              <Ionicons name="mail" size={16} color={Colors.primary} />
              <Text style={styles.contactBtnText}>support@techindro.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  topBarTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98122',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  whatsappCard: {
    backgroundColor: '#059669', // Emerald green
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  waCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  waIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waCardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  waCardDesc: {
    fontSize: FontSize.xs,
    color: '#D1FAE5',
    marginTop: 2,
    lineHeight: 16,
  },
  waMetaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.sm,
  },
  waMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waMetaText: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
  },
  chatNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: '#fff',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  chatNowText: {
    color: '#065F46',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  communityGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  commIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  commDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  faqList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  faqCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  faqQuestion: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    flex: 1,
    lineHeight: 18,
  },
  faqAnswer: {
    fontSize: 11,
    lineHeight: 18,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#33415522',
    paddingTop: Spacing.xs,
  },
  contactCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  contactAddress: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: Spacing.md,
  },
  contactActionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ff6b351A',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  contactBtnText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
