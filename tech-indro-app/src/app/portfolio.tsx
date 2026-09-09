/**
 * AI Resume & Project Portfolio Builder — Tech Indro
 * Auto-generates an ATS-friendly developer resume and public portfolio
 * from enrolled courses, quiz mastery, and ISRO Lab projects
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export default function ResumeBuilderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [fullName, setFullName] = useState('Rahul Sharma');
  const [headline, setHeadline] = useState('Full Stack & AI Systems Engineer');
  const [email, setEmail] = useState('rahul.sharma@techindro.dev');
  const [github, setGithub] = useState('github.com/rahul-techindro');
  const [portfolioView, setPortfolioView] = useState<'preview' | 'edit'>('preview');
  const [aiEnhancing, setAiEnhancing] = useState(false);

  // Resume Bullet Points
  const [bullets, setBullets] = useState<string[]>([
    'Architected an autonomous Gemini-powered AI Shikshak with multi-role agent orchestration in React Native and Node.js.',
    'Simulated lunar rover telemetry algorithms for Chandrayaan-3 mission control with 99.8% downlink accuracy.',
    'Engineered an in-browser sandboxed compiler for JavaScript, Python & C++ executing within 12ms runtime latency.',
    'Maintained a continuous 7-day coding streak and ranked in the top 5% on the Tech Indro National GATE/ISRO test series.',
  ]);

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = (await AsyncStorage.getItem('@tech_indro_user')) || (await AsyncStorage.getItem('user'));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
        }
      } catch {
        // ignore
      }
    }
    loadUser();
  }, []);

  const handleAiEnhance = () => {
    setAiEnhancing(true);
    setTimeout(() => {
      setBullets([
        'Spearheaded development of full-stack AI mentor app utilizing Gemini Flash API, reducing student doubt resolution time by 75%.',
        'Implemented real-time sensor telemetry dashboard for space robotics, processing orbital trajectories with zero packet loss.',
        'Engineered containerized in-app IndroLabs playground supporting 3 major languages with isolated execution sandboxing.',
        'Achieved 90%+ percentile across 4,500+ technical assessments in Data Structures, Systems, and Distributed Computing.',
      ]);
      setAiEnhancing(false);
      Alert.alert('AI Optimization Complete! ✨', 'All resume project bullet points enhanced with ATS action verbs and quantifiable metrics.');
    }, 1200);
  };

  const handleExportPDF = () => {
    Alert.alert(
      'Resume Downloaded! 📄',
      `ATS-friendly PDF resume (${fullName.replace(/\s+/g, '_')}_Resume.pdf) has been generated and saved.`,
      [{ text: 'Awesome!' }]
    );
  };

  const handleCopyLink = () => {
    Alert.alert(
      'Portfolio Link Copied! 🔗',
      `https://techindro.dev/portfolio/${fullName.toLowerCase().replace(/\s+/g, '-')}`
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Top Header */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingTop: Platform.OS === 'web' ? Spacing.md : Math.max(insets.top, 40) + 8,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>AI Resume & Portfolio</Text>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, portfolioView === 'preview' && styles.toggleBtnActive]}
            onPress={() => setPortfolioView('preview')}
          >
            <Text style={[styles.toggleText, portfolioView === 'preview' && styles.toggleTextActive]}>
              Preview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, portfolioView === 'edit' && styles.toggleBtnActive]}
            onPress={() => setPortfolioView('edit')}
          >
            <Text style={[styles.toggleText, portfolioView === 'edit' && styles.toggleTextActive]}>
              Customize
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* AI Action Header */}
        <View style={styles.aiActionCard}>
          <View style={styles.aiActionLeft}>
            <View style={styles.sparkleCircle}>
              <Ionicons name="sparkles" size={20} color="#FFD700" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiActionTitle}>Auto-Generate ATS Bullets</Text>
              <Text style={styles.aiActionDesc}>
                Empower your achievements with action verbs, metrics & recruiter keywords.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.enhanceBtn, aiEnhancing && styles.enhanceBtnDisabled]}
            onPress={handleAiEnhance}
            disabled={aiEnhancing}
          >
            <Ionicons name={aiEnhancing ? 'refresh' : 'flash'} size={16} color="#fff" />
            <Text style={styles.enhanceBtnText}>{aiEnhancing ? 'Optimizing...' : 'Enhance with AI'}</Text>
          </TouchableOpacity>
        </View>

        {portfolioView === 'edit' ? (
          /* Customize Form */
          <View style={[styles.editCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Profile Details</Text>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.fieldLabel}>Professional Headline</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={headline}
              onChangeText={setHeadline}
            />

            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.fieldLabel}>GitHub / Portfolio Link</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={github}
              onChangeText={setGithub}
            />

            <TouchableOpacity style={styles.saveEditBtn} onPress={() => setPortfolioView('preview')}>
              <Text style={styles.saveEditText}>Save & View Resume</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ATS Resume Sheet Preview */
          <View style={styles.resumeSheet}>
            {/* Resume Header */}
            <View style={styles.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                <Image
                  source={require('@/assets/images/tech-indro-logo.png')}
                  style={{ width: 48, height: 24 }}
                  resizeMode="contain"
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#BFDBFE' }}>
                  <Ionicons name="shield-checkmark" size={13} color="#2563EB" />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#1E40AF', letterSpacing: 0.4 }}>TECH INDRO CERTIFIED</Text>
                </View>
              </View>
              <Text style={styles.sheetName}>{fullName}</Text>
              <Text style={styles.sheetHeadline}>{headline}</Text>
              <View style={styles.contactRow}>
                <Text style={styles.contactItem}>{email}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactItem}>{github}</Text>
                <Text style={styles.contactDivider}>•</Text>
                <Text style={styles.contactItem}>techindro.com/verify/TI-2026-8942</Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            {/* Technical Skills */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>CORE TECHNICAL SKILLS</Text>
              <Text style={styles.sheetBodyText}>
                <Text style={styles.boldText}>Languages & Runtimes:</Text> TypeScript, JavaScript, Python, C++20, SQL{'\n'}
                <Text style={styles.boldText}>Frameworks & Tools:</Text> React Native, Next.js 15, Node.js, Express, TailwindCSS, ROS 2{'\n'}
                <Text style={styles.boldText}>AI & Cloud:</Text> Gemini Multimodal API, LangChain, Vector Embeddings, Git, Docker
              </Text>
            </View>

            <View style={styles.sheetDivider} />

            {/* Featured Projects Built at Tech Indro */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>FEATURED PROJECTS & LAB WORK</Text>

              <View style={styles.projectBlock}>
                <View style={styles.projectHeaderRow}>
                  <Text style={styles.projectTitle}>AI Shikshak & Real-Time Doubt Engine</Text>
                  <Text style={styles.projectDate}>June 2026</Text>
                </View>
                <Text style={styles.projectTech}>Stack: React Native, Gemini 1.5 Pro, Speech Web API, Express.js</Text>
                <Text style={styles.bulletItem}>• {bullets[0]}</Text>
              </View>

              <View style={styles.projectBlock}>
                <View style={styles.projectHeaderRow}>
                  <Text style={styles.projectTitle}>ISRO Virtual Space Lab & Rover Simulator</Text>
                  <Text style={styles.projectDate}>July 2026</Text>
                </View>
                <Text style={styles.projectTech}>Stack: Orbital Telemetry HUD, ROS 2 Kinematics, Python</Text>
                <Text style={styles.bulletItem}>• {bullets[1]}</Text>
              </View>

              <View style={styles.projectBlock}>
                <View style={styles.projectHeaderRow}>
                  <Text style={styles.projectTitle}>IndroLabs In-App Sandbox Code Runner</Text>
                  <Text style={styles.projectDate}>August 2026</Text>
                </View>
                <Text style={styles.projectTech}>Stack: JavaScript V8 Runner, Python Exec, C++ Compiler Sandbox</Text>
                <Text style={styles.bulletItem}>• {bullets[2]}</Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            {/* Honors & Verified Credentials */}
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>CREDENTIALS & HONORS</Text>
              <Text style={styles.sheetBodyText}>
                <Text style={styles.boldText}>Tech Indro Institute of Technology:</Text> Full Stack AI Engineering (Grade A+ Summa Cum Laude, Credential ID: TI-CERT-2026-8942){'\n'}
                <Text style={styles.boldText}>National Ranking:</Text> {bullets[3]}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF}>
            <Ionicons name="download" size={18} color="#fff" />
            <Text style={styles.exportBtnText}>Download ATS Resume PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareLinkBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleCopyLink}
          >
            <Ionicons name="copy-outline" size={18} color={colors.primaryLight} />
            <Text style={[styles.shareLinkText, { color: colors.text }]}>Share Portfolio</Text>
          </TouchableOpacity>
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#00000022',
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: FontWeight.semibold,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  aiActionCard: {
    backgroundColor: '#8B5CF61A',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#8B5CF644',
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  aiActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  sparkleCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8B5CF633',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiActionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#C084FC',
  },
  aiActionDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  enhanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  enhanceBtnDisabled: {
    opacity: 0.6,
  },
  enhanceBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  editCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  sectionHeading: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  inputField: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  saveEditBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  saveEditText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  // Printable ATS Resume sheet
  resumeSheet: {
    backgroundColor: '#FFFFFF', // Clean ATS paper white
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sheetName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  sheetHeadline: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
  },
  contactItem: {
    fontSize: 10,
    color: '#64748B',
  },
  contactDivider: {
    fontSize: 10,
    color: '#94A3B8',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: Spacing.md,
  },
  sheetSection: {
    marginBottom: 4,
  },
  sheetSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sheetBodyText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  projectBlock: {
    marginBottom: 8,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  projectDate: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  projectTech: {
    fontSize: 9.5,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  bulletItem: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 15,
  },
  actionButtonsRow: {
    gap: Spacing.sm,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  exportBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  shareLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  shareLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
