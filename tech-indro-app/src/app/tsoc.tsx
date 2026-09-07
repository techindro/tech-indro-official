/**
 * TSOC Screen — Tech Indro Summer of Code
 * Elite 3-month open source fellowship with stipends, mentorship, and real projects
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

const TRACKS = [
  {
    id: 'ai',
    title: 'Generative AI & LLMs',
    icon: 'sparkles-outline',
    color: '#8B5CF6',
    desc: 'Build open-source agents, RAG pipelines & multimodal applications.',
  },
  {
    id: 'web3',
    title: 'Systems & Cloud Native',
    icon: 'server-outline',
    color: '#3B82F6',
    desc: 'Rust, Go, Kubernetes operators, and high-performance backend tools.',
  },
  {
    id: 'fullstack',
    title: 'Next-Gen Full Stack',
    icon: 'code-slash-outline',
    color: '#10B981',
    desc: 'Production-ready apps with Next.js 15, React Native, and edge databases.',
  },
  {
    id: 'robotics',
    title: 'Space Tech & Robotics',
    icon: 'rocket-outline',
    color: '#F59E0B',
    desc: 'ROS 2 nodes, satellite image analytics, and autonomous rover algorithms.',
  },
];

const TIMELINE = [
  { step: '01', title: 'Applications Open', date: 'March 15 - April 10', desc: 'Submit your GitHub portfolio and project proposal.' },
  { step: '02', title: 'Cohort Selection', date: 'April 20', desc: 'Top 50 developers selected for interviews.' },
  { step: '03', title: '12-Week Sprint', date: 'May 1 - July 25', desc: 'Direct 1:1 mentorship from Google & ISRO alumni.' },
  { step: '04', title: 'Demo Day & Grants', date: 'August 5', desc: 'Pitch to top tech founders and receive completion stipends.' },
];

export default function TSOCScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('Generative AI & LLMs');
  const [submitted, setSubmitted] = useState(false);

  const handleApply = () => {
    if (!fullName || !email || !github) {
      Alert.alert('Incomplete Form', 'Kripya saari fields bharein (Name, Email, GitHub).');
      return;
    }
    setSubmitted(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setGithub('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4338CA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: Spacing.md }}>
            <Image
              source={require('@/assets/images/tech-indro-logo-white.png')}
              style={{ width: 48, height: 24 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Ionicons name="rocket" size={13} color="#FBBF24" />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FBBF24', letterSpacing: 0.5 }}>BATCH OF 2026</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>TECH INDRO Summer of Code</Text>
          <Text style={styles.heroSubtitle}>
            India’s Premier Open Source Fellowship. Build real high-impact software under world-class engineers.
          </Text>

          <View style={styles.heroPerksRow}>
            <View style={styles.heroPerk}>
              <Text style={styles.heroPerkVal}>₹50K+</Text>
              <Text style={styles.heroPerkLabel}>Stipend Pool</Text>
            </View>
            <View style={styles.heroPerkDivider} />
            <View style={styles.heroPerk}>
              <Text style={styles.heroPerkVal}>12 Wks</Text>
              <Text style={styles.heroPerkLabel}>Hands-on Sprint</Text>
            </View>
            <View style={styles.heroPerkDivider} />
            <View style={styles.heroPerk}>
              <Text style={styles.heroPerkVal}>1-on-1</Text>
              <Text style={styles.heroPerkLabel}>Mentorship</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyNowBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.applyNowText}>Apply For Fellowship</Text>
            <Ionicons name="arrow-forward" size={18} color="#1E1B4B" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Tracks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialized Fellowship Tracks</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the domain where you want to build cutting-edge systems.
          </Text>

          <View style={styles.tracksGrid}>
            {TRACKS.map((t) => (
              <View key={t.id} style={styles.trackCard}>
                <View style={[styles.trackIconCircle, { backgroundColor: t.color + '22' }]}>
                  <Ionicons name={t.icon as any} size={24} color={t.color} />
                </View>
                <Text style={styles.trackTitle}>{t.title}</Text>
                <Text style={styles.trackDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Timeline</Text>
          <View style={styles.timelineList}>
            {TIMELINE.map((item, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineNumberCircle}>
                  <Text style={styles.timelineNumber}>{item.step}</Text>
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineItemTitle}>{item.title}</Text>
                    <Text style={styles.timelineItemDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.timelineItemDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCtaCard}>
          <Text style={styles.bottomCtaTitle}>Ready to accelerate your tech career?</Text>
          <Text style={styles.bottomCtaDesc}>
            Join 1,000+ engineers contributing to production-grade repositories.
          </Text>
          <TouchableOpacity
            style={styles.bottomCtaButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.bottomCtaButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Apply Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>TSOC 2026 Application</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {submitted ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={60} color={Colors.success} />
                <Text style={styles.successTitle}>Application Submitted! 🎉</Text>
                <Text style={styles.successDesc}>
                  Humne aapka application note kar liya hai ({email}). Review team agle 3 dino me email par update karegi.
                </Text>
                <TouchableOpacity style={styles.doneBtn} onPress={handleCloseModal}>
                  <Text style={styles.doneBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={Colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.fieldLabel}>GitHub Profile or Portfolio URL</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="https://github.com/username"
                  placeholderTextColor={Colors.textMuted}
                  value={github}
                  onChangeText={setGithub}
                />

                <Text style={styles.fieldLabel}>Preferred Track</Text>
                <View style={styles.trackChoices}>
                  {TRACKS.map((track) => {
                    const active = selectedTrack === track.title;
                    return (
                      <TouchableOpacity
                        key={track.id}
                        style={[styles.trackChip, active && styles.trackChipActive]}
                        onPress={() => setSelectedTrack(track.title)}
                      >
                        <Text style={[styles.trackChipText, active && styles.trackChipTextActive]}>
                          {track.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.submitModalBtn} onPress={handleApply}>
                  <Text style={styles.submitModalBtnText}>Send Application</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: Spacing.xxl,
  },
  heroGradient: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  badgeRow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  heroPerksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  heroPerk: {
    alignItems: 'center',
    flex: 1,
  },
  heroPerkVal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#FFD700',
  },
  heroPerkLabel: {
    fontSize: FontSize.xs,
    color: '#fff',
    opacity: 0.8,
  },
  heroPerkDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  applyNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FFD700',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  applyNowText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#1E1B4B',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  tracksGrid: {
    gap: Spacing.md,
  },
  trackCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  trackTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  trackDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  timelineList: {
    gap: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timelineNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineNumber: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primaryLight,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineItemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  timelineItemDate: {
    fontSize: 10,
    color: Colors.primaryLight,
    fontWeight: FontWeight.semibold,
  },
  timelineItemDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  bottomCtaCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomCtaTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  bottomCtaDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  bottomCtaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bottomCtaButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  trackChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  trackChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBorder,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  trackChipText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  trackChipTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  submitModalBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  submitModalBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  successDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
});
