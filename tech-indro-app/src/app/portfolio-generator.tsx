import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type PortfolioTheme = 'cyber' | 'minimal' | 'sunset';

export default function PortfolioGeneratorScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [theme, setTheme] = useState<PortfolioTheme>('cyber');

  // Portfolio data
  const [fullName, setFullName] = useState(user?.name || 'Rahul Sharma');
  const [role, setRole] = useState('Full Stack & AI Engineer');
  const [bio, setBio] = useState('Building resilient distributed systems & generative AI apps. TSOC Fellowship graduate.');
  const [githubUrl, setGithubUrl] = useState('github.com/rahul-sharma-tech');
  const [skills, setSkills] = useState('React, React Native, Node.js, Python, PostgreSQL, Docker, PyTorch');
  
  const [projects, setProjects] = useState([
    {
      name: 'MediConnect AI',
      desc: 'Real-time telemedicine triage assistant with Med-PaLM fine-tuning.',
      tech: 'Next.js, FastAPI, WebRTC',
      stars: '42',
    },
    {
      name: 'Indro Kafka Load Tester',
      desc: 'Simulates 50,000 flash sale concurrent messages with zero partition lag.',
      tech: 'Go, Kafka, Docker',
      stars: '68',
    },
  ]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my verified Tech Indro Engineering Portfolio: https://techindro.com/p/${fullName.toLowerCase().replace(/\s+/g, '-')}`,
      });
    } catch (e) {
      // Ignored
    }
  };

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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Portfolio Studio</Text>
              <View style={styles.studioPill}>
                <Ionicons name="flash" size={10} color="#ff6b35" />
                <Text style={styles.studioPillText}>AUTO-GENERATOR</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Customize, preview & export your verified engineering portfolio
            </Text>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={18} color="#ff6b35" />
          </TouchableOpacity>
        </View>

        {/* View Switcher: Editor vs Live Preview */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'preview' && styles.tabBtnActive]}
            onPress={() => setActiveTab('preview')}
          >
            <Ionicons
              name="eye-outline"
              size={15}
              color={activeTab === 'preview' ? '#ff6b35' : colors.textMuted}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'preview' ? '#ff6b35' : colors.textMuted },
              ]}
            >
              Live Mobile Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'editor' && styles.tabBtnActive]}
            onPress={() => setActiveTab('editor')}
          >
            <Ionicons
              name="create-outline"
              size={15}
              color={activeTab === 'editor' ? '#ff6b35' : colors.textMuted}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'editor' ? '#ff6b35' : colors.textMuted },
              ]}
            >
              Edit Details & Themes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'preview' ? (
          // Live Preview Card
          <View
            style={[
              styles.previewContainer,
              theme === 'cyber' && { backgroundColor: '#090d16', borderColor: '#334155' },
              theme === 'minimal' && { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: colors.border },
              theme === 'sunset' && { backgroundColor: '#18181b', borderColor: '#ea580c' },
            ]}
          >
            {/* Banner Top */}
            <LinearGradient
              colors={
                theme === 'cyber'
                  ? ['#4f46e5', '#06b6d4']
                  : theme === 'sunset'
                  ? ['#ff6b35', '#ea580c']
                  : ['#64748b', '#475569']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bannerGradient}
            />

            <View style={styles.profileSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </Text>
              </View>

              <View style={styles.verifiedRow}>
                <Text style={[styles.previewName, { color: '#ffffff' }]}>{fullName}</Text>
                <Ionicons name="checkmark-circle" size={18} color="#38bdf8" />
              </View>

              <Text style={styles.previewRole}>{role}</Text>
              <Text style={styles.previewBio}>{bio}</Text>

              {/* Social Link Pill */}
              <View style={styles.socialLinkRow}>
                <View style={styles.linkPill}>
                  <Ionicons name="logo-github" size={13} color="#94a3b8" />
                  <Text style={styles.linkPillText}>{githubUrl}</Text>
                </View>
                <View style={[styles.linkPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="shield-checkmark" size={13} color="#10b981" />
                  <Text style={[styles.linkPillText, { color: '#10b981' }]}>TSOC Certified</Text>
                </View>
              </View>
            </View>

            {/* Skills Showcase */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Technical Arsenal</Text>
              <View style={styles.skillsWrap}>
                {skills.split(',').map((s) => (
                  <View key={s.trim()} style={styles.skillBadge}>
                    <Text style={styles.skillBadgeText}>{s.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Featured Projects */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Featured Engineering Projects</Text>
              {projects.map((proj, idx) => (
                <View key={idx} style={styles.projectItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.projName}>{proj.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="star" size={12} color="#f59e0b" />
                      <Text style={styles.projStars}>{proj.stars}</Text>
                    </View>
                  </View>
                  <Text style={styles.projDesc}>{proj.desc}</Text>
                  <Text style={styles.projTech}>{proj.tech}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.exportActionBtn} onPress={handleShare}>
              <LinearGradient
                colors={['#ff6b35', '#ea580c']}
                style={styles.exportGradient}
              >
                <Ionicons name="link-outline" size={16} color="#ffffff" />
                <Text style={styles.exportBtnText}>Copy Verified Portfolio Link</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // Form Editor
          <View style={styles.editorForm}>
            {/* Theme Picker */}
            <Text style={[styles.formLabel, { color: colors.text }]}>Choose Theme Aesthetic</Text>
            <View style={styles.themePickerRow}>
              {[
                { id: 'cyber', label: 'Cyber Tech', color: '#06b6d4' },
                { id: 'sunset', label: 'Sunset Orange', color: '#ff6b35' },
                { id: 'minimal', label: 'Minimal Studio', color: '#64748b' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      borderColor: theme === t.id ? t.color : colors.border,
                      borderWidth: theme === t.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setTheme(t.id as PortfolioTheme)}
                >
                  <View style={[styles.colorDot, { backgroundColor: t.color }]} />
                  <Text style={[styles.themeLabel, { color: colors.text }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 14 }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 10 }]}>Headline / Role</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
              value={role}
              onChangeText={setRole}
            />

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 10 }]}>Bio</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
              multiline
              value={bio}
              onChangeText={setBio}
            />

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 10 }]}>GitHub URL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
              value={githubUrl}
              onChangeText={setGithubUrl}
            />

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 10 }]}>Skills (Comma Separated)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
              value={skills}
              onChangeText={setSkills}
            />

            <TouchableOpacity
              style={styles.savePreviewBtn}
              onPress={() => setActiveTab('preview')}
            >
              <LinearGradient
                colors={['#ff6b35', '#ea580c']}
                style={styles.savePreviewGradient}
              >
                <Ionicons name="eye" size={16} color="#ffffff" />
                <Text style={styles.savePreviewText}>Save & View Live Preview</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
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
  studioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studioPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100,116,139,0.1)',
    paddingTop: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#ff6b35',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  previewContainer: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  bannerGradient: {
    height: 80,
    width: '100%',
  },
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -32,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff6b35',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '800',
  },
  previewRole: {
    fontSize: 13,
    color: '#38bdf8',
    fontWeight: '600',
    marginTop: 2,
  },
  previewBio: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    marginTop: 6,
  },
  socialLinkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  linkPillText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillBadgeText: {
    fontSize: 11,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  projectItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  projName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  projStars: {
    fontSize: 11,
    color: '#f59e0b',
  },
  projDesc: {
    fontSize: 11.5,
    color: '#94a3b8',
    lineHeight: 16,
    marginBottom: 4,
  },
  projTech: {
    fontSize: 10.5,
    color: '#38bdf8',
    fontWeight: '600',
  },
  exportActionBtn: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 8,
    overflow: 'hidden',
  },
  exportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  editorForm: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  themePickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    height: 70,
    textAlignVertical: 'top',
  },
  savePreviewBtn: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 16,
  },
  savePreviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  savePreviewText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
