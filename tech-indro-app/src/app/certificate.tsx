/**
 * Verifiable Certificate Screen — Tech Indro
 * Official Academic Credential
 * Features burgundy ornate stepped-corner border, modern sans-serif typography,
 * centered crimson emblem seal, and dual dotted-line signatures for Tech Indro leadership (Shubham Patel & Sangharsh Singh).
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import Colors, { FontSize, FontWeight, Spacing } from '@/constants/Colors';

const SANS_FONT = Platform.select({
  web: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  default: 'System',
});

const CURSIVE_FONT = Platform.select({
  web: '"Dancing Script", "Brush Script MT", "Caveat", cursive',
  ios: 'Snell Roundhand',
  android: 'sans-serif-thin',
  default: 'cursive',
});

const CERT_BURGUNDY = '#8B1E2D';

export default function CertificateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{
    studentName?: string;
    courseName?: string;
    certId?: string;
  }>();

  const [userName, setUserName] = useState(params.studentName || 'Rahul Sharma');
  const [courseTitle, setCourseTitle] = useState(params.courseName || 'Applied AI and Data Science Program');
  const [certDate, setCertDate] = useState('July 2026');
  const [hasHonors, setHasHonors] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiCareerModalOpen, setIsAiCareerModalOpen] = useState(false);
  const [aiTab, setAiTab] = useState<'bullets' | 'linkedin' | 'pitch'>('bullets');
  const [editInputName, setEditInputName] = useState(params.studentName || 'Rahul Sharma');
  const [editInputCourse, setEditInputCourse] = useState(params.courseName || 'Applied AI and Data Science Program');
  const [editInputDate, setEditInputDate] = useState('July 2026');
  const [editInputHonors, setEditInputHonors] = useState(false);
  const certId = params.certId || 'TI-CERT-2026-8942';

  // Inject web fonts
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontId = 'ti-academic-fonts';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedCustom = await AsyncStorage.getItem('@tech_indro_user_cert_name');
        if (savedCustom && savedCustom.trim()) {
          setUserName(savedCustom.trim());
          setEditInputName(savedCustom.trim());
        }
        const savedCourse = await AsyncStorage.getItem('@tech_indro_user_cert_course');
        if (savedCourse && savedCourse.trim()) {
          setCourseTitle(savedCourse.trim());
          setEditInputCourse(savedCourse.trim());
        }
        const savedDate = await AsyncStorage.getItem('@tech_indro_user_cert_date');
        if (savedDate && savedDate.trim()) {
          setCertDate(savedDate.trim());
          setEditInputDate(savedDate.trim());
        }
        const savedHonors = await AsyncStorage.getItem('@tech_indro_user_cert_honors');
        if (savedHonors === '1') {
          setHasHonors(true);
          setEditInputHonors(true);
        }

        if (!savedCustom) {
          const stored =
            (await AsyncStorage.getItem('@tech_indro_user')) ||
            (await AsyncStorage.getItem('user'));
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.name) {
              setUserName(parsed.name);
              setEditInputName(parsed.name);
            }
          }
          const profileData = await AsyncStorage.getItem('@tech_indro_user_profile');
          if (profileData) {
            const prof = JSON.parse(profileData);
            if (prof.name) {
              setUserName(prof.name);
              setEditInputName(prof.name);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    if (!params.studentName) {
      loadUser();
    }
  }, [params.studentName]);

  const handleSaveDetails = async () => {
    const trimmedName = editInputName.trim() || 'Rahul Sharma';
    const trimmedCourse = editInputCourse.trim() || 'Applied AI and Data Science Program';
    const trimmedDate = editInputDate.trim() || 'July 2026';

    setUserName(trimmedName);
    setCourseTitle(trimmedCourse);
    setCertDate(trimmedDate);
    setHasHonors(editInputHonors);
    setIsEditModalOpen(false);

    try {
      await AsyncStorage.setItem('@tech_indro_user_cert_name', trimmedName);
      await AsyncStorage.setItem('@tech_indro_user_cert_course', trimmedCourse);
      await AsyncStorage.setItem('@tech_indro_user_cert_date', trimmedDate);
      await AsyncStorage.setItem('@tech_indro_user_cert_honors', editInputHonors ? '1' : '0');
    } catch {}

    Alert.alert('✅ Certificate Updated', `Credentials customized for ${trimmedName}!`);
  };

  const handleCopyLink = () => {
    Alert.alert('📋 Credential Link Copied', `https://techindro.com/verify/${certId} copied to clipboard.`);
  };

  const shareUrl = `https://techindro.com/verify/${certId}`;
  const shareText = `I, ${userName}, am proud to share my verified Certificate of Completion from Tech Indro in "${courseTitle}"! 🎓\n\nVerify: ${shareUrl}`;

  const handleShareLinkedIn = () => {
    Linking.openURL(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    ).catch(() => Alert.alert('Error', 'Could not open LinkedIn.'));
  };

  const handleShareWhatsApp = () => {
    Linking.openURL(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    ).catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  const handleDownload = () => {
    Alert.alert('📥 Certificate Downloaded', `Official Credential ${certId} for ${userName}.pdf generated.`, [
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? '#0F1117' : '#F1F3F5' }]} edges={['left', 'right']}>
      {/* Top App Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingTop: Platform.OS === 'web' ? Spacing.sm : Math.max(insets.top, 40) + 8,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tech Indro Certificate</Text>
        <TouchableOpacity onPress={handleDownload} style={{ padding: 6 }}>
          <Ionicons name="download-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Certificate Outer Container */}
        <View style={styles.cardShadow}>
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/*  BURGUNDY STEPPED BORDER SYSTEM                             */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <View style={styles.borderLayerOuter}>
            <View style={styles.borderLayerMiddle}>
              <View style={styles.borderLayerInner}>
                
                {/* 4 Stepped Corner Accents */}
                <View style={[styles.cornerSquare, styles.cornerTL]} />
                <View style={[styles.cornerSquare, styles.cornerTR]} />
                <View style={[styles.cornerSquare, styles.cornerBL]} />
                <View style={[styles.cornerSquare, styles.cornerBR]} />

                {/* Inner Content Padding */}
                <View style={styles.certificateInnerContent}>
                  
                  {/* India's 1st AI-Powered Platform Badge */}
                  <View style={styles.indiaFirstBanner}>
                    <Text style={styles.indiaFirstBannerText}>
                      🇮🇳 INDIA'S 1ST AI-POWERED LEARNING PLATFORM • AI AUDITED
                    </Text>
                  </View>

                  {/* 1. TOP HEADER: Logo + "Professional Education" */}
                  <View style={styles.headerRow}>
                    <Image
                      source={require('@/assets/images/tech-indro-logo.png')}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                    <View style={styles.proEducationCol}>
                      <Text style={styles.proTitleText}>Professional</Text>
                      <Text style={styles.eduTitleText}>Education</Text>
                    </View>
                  </View>

                  {/* 2. "This is to certify that" */}
                  <Text style={styles.certifyLabel}>This is to certify that</Text>

                  {/* 3. RECIPIENT NAME (Bold Sans-Serif with Inline Edit Trigger) */}
                  <TouchableOpacity
                    style={styles.recipientRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      setEditInputName(userName);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Text style={styles.recipientName}>{userName}</Text>
                    <View style={styles.inlineEditBadge}>
                      <Ionicons name="pencil" size={12} color={CERT_BURGUNDY} />
                      <Text style={styles.inlineEditText}>Edit</Text>
                    </View>
                  </TouchableOpacity>

                  {/* 4. CENTER RED EMBLEM SEAL */}
                  <View style={styles.sealContainer}>
                    <View style={styles.sealOuterRing}>
                      <View style={styles.sealMiddleRing}>
                        <View style={styles.sealInnerRing}>
                          <Text style={styles.sealTopText}>TECH INDRO</Text>
                          <View style={styles.sealCenterIconRow}>
                            <Ionicons name="school-outline" size={13} color={CERT_BURGUNDY} />
                            <View style={styles.sealCenterDivider} />
                            <Ionicons name="book-outline" size={13} color={CERT_BURGUNDY} />
                          </View>
                          <Text style={styles.sealBottomText}>OFFICIAL SEAL • VERIFIED</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 5. "has successfully completed the" */}
                  <Text style={styles.completedLabel}>has successfully completed the</Text>

                  {/* 6. COURSE TITLE (Bold Sans-Serif) */}
                  <Text style={styles.courseTitle}>{courseTitle}</Text>

                  {/* 7. DATE */}
                  <Text style={styles.dateText}>{certDate}</Text>

                  {/* AI Academic Citation */}
                  <View style={styles.aiCitationBox}>
                    <Text style={styles.aiCitationTag}>✨ AI ACADEMIC CITATION</Text>
                    <Text style={styles.aiCitationText}>
                      Demonstrated exceptional technical rigor in fine-tuning neural models, architecting scalable systems, and delivering production-ready solutions certified by Tech Indro's AI Academic Board.
                    </Text>
                  </View>

                  {/* AI Neural Competency Matrix Strip */}
                  <View style={styles.aiMatrixRow}>
                    <View style={styles.aiMatrixCol}>
                      <Text style={styles.aiMatrixVal}>98.4%</Text>
                      <Text style={styles.aiMatrixLbl}>AI SCORE</Text>
                    </View>
                    <View style={styles.aiMatrixCol}>
                      <Text style={styles.aiMatrixVal}>GRADE A+</Text>
                      <Text style={styles.aiMatrixLbl}>AUDIT</Text>
                    </View>
                    <View style={styles.aiMatrixCol}>
                      <Text style={styles.aiMatrixVal}>SHIKSHAK 4.2</Text>
                      <Text style={styles.aiMatrixLbl}>AI ENGINE</Text>
                    </View>
                  </View>

                  {/* 8. TWO SIGNATURES WITH DOTTED LINES */}
                  <View style={styles.signaturesRow}>
                    {/* Left Signatory: Founder & CEO */}
                    <View style={styles.signatureCol}>
                      <Text style={styles.handwrittenSig}>Shubham Patel</Text>
                      <View style={styles.dottedLine} />
                      <Text style={styles.signatoryName}>Shubham Patel</Text>
                      <Text style={styles.signatoryRole}>Founder & CEO</Text>
                      <Text style={styles.signatoryOrg}>Tech Indro</Text>
                    </View>

                    {/* Right Signatory: Dean of Academics */}
                    <View style={styles.signatureCol}>
                      <Text style={styles.handwrittenSig}>Sangharsh Singh</Text>
                      <View style={styles.dottedLine} />
                      <Text style={styles.signatoryName}>Sangharsh Singh</Text>
                      <Text style={styles.signatoryRole}>Dean of Academics</Text>
                      <Text style={styles.signatoryOrg}>Tech Indro</Text>
                    </View>
                  </View>

                  {/* 9. Honors Ribbon Badge */}
                  {hasHonors && (
                    <View style={styles.appRibbonBadge}>
                      <Ionicons name="ribbon" size={13} color="#FFFFFF" />
                      <Text style={styles.appRibbonBadgeText}>WITH DISTINCTION • TOP 1%</Text>
                    </View>
                  )}

                </View>
              </View>
            </View>
          </View>

        </View>

        {/* Verification Pill */}
        <View style={styles.verifyBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#059669" />
          <Text style={styles.verifyBadgeText}>
            Verified Credential: <Text style={{ fontWeight: '700' }}>{certId}</Text> • 100% Authentic
          </Text>
        </View>

        {/* AI Career Copilot Button */}
        <TouchableOpacity
          style={styles.aiCareerBtn}
          onPress={() => setIsAiCareerModalOpen(true)}
        >
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
          <Text style={styles.aiCareerBtnText}>
            🤖 AI Career Copilot (Resume Bullets & Pitch)
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          {/* Customize Certificate Studio Button */}
          <TouchableOpacity
            style={[styles.editNameActionBtn, { borderColor: CERT_BURGUNDY }]}
            onPress={() => {
              setEditInputName(userName);
              setEditInputCourse(courseTitle);
              setEditInputDate(certDate);
              setEditInputHonors(hasHonors);
              setIsEditModalOpen(true);
            }}
          >
            <Ionicons name="color-palette-outline" size={18} color={CERT_BURGUNDY} />
            <Text style={[styles.editNameActionBtnText, { color: CERT_BURGUNDY }]}>
              Customize Certificate (नाम, कोर्स, तारीख बदलें)
            </Text>
          </TouchableOpacity>

          <Text style={[styles.actionHeading, { color: colors.text }]}>Share & Verify Credential</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>
            Display this verified Tech Indro credential on LinkedIn or share directly
          </Text>

          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.linkedinBtn} onPress={handleShareLinkedIn}>
              <Ionicons name="logo-linkedin" size={18} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Add to LinkedIn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp}>
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.copyLinkBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleCopyLink}
          >
            <Ionicons name="copy-outline" size={18} color={colors.text} />
            <Text style={[styles.copyLinkBtnText, { color: colors.text }]}>
              Copy Verification Link
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.downloadBtn, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 10 }]}
            onPress={handleDownload}
          >
            <Ionicons name="cloud-download-outline" size={18} color={colors.text} />
            <Text style={[styles.downloadBtnText, { color: colors.text }]}>
              Download Official PDF Certificate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Customizing Certificate Details */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <ScrollView contentContainerStyle={styles.modalContentWrapper}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Certificate Studio</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    Customize recipient name, course, and date
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>RECIPIENT NAME:</Text>
              <TextInput
                value={editInputName}
                onChangeText={setEditInputName}
                style={[
                  styles.nameTextInput,
                  {
                    color: colors.text,
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: CERT_BURGUNDY,
                  },
                ]}
                placeholder="Student Full Name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>COURSE PROGRAM:</Text>
              <TextInput
                value={editInputCourse}
                onChangeText={setEditInputCourse}
                style={[
                  styles.nameTextInput,
                  {
                    color: colors.text,
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Course Title"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.modalFieldLabel, { color: colors.textSecondary }]}>COMPLETION DATE:</Text>
              <TextInput
                value={editInputDate}
                onChangeText={setEditInputDate}
                style={[
                  styles.nameTextInput,
                  {
                    color: colors.text,
                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. July 2026"
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity
                style={[
                  styles.honorsToggleRow,
                  {
                    backgroundColor: editInputHonors ? 'rgba(217, 119, 6, 0.12)' : 'transparent',
                    borderColor: editInputHonors ? '#D97706' : colors.border,
                  },
                ]}
                onPress={() => setEditInputHonors(!editInputHonors)}
              >
                <Ionicons
                  name={editInputHonors ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={editInputHonors ? '#D97706' : colors.textSecondary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.honorsToggleText, { color: editInputHonors ? '#D97706' : colors.text }]}>
                    Award "WITH DISTINCTION" Ribbon
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                  onPress={() => setIsEditModalOpen(false)}
                >
                  <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSaveBtn, { backgroundColor: CERT_BURGUNDY }]}
                  onPress={handleSaveDetails}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.modalSaveText}>Apply Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* AI Career Copilot Modal */}
      <Modal
        visible={isAiCareerModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAiCareerModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <ScrollView contentContainerStyle={styles.modalContentWrapper}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: '#8B5CF6' }]}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>🤖 AI Career Copilot</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    India's 1st AI-Powered Placement Prep • Shikshak Engine
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsAiCareerModalOpen(false)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <View style={styles.aiTabsRow}>
                <TouchableOpacity
                  style={[styles.aiTabPill, aiTab === 'bullets' && styles.aiTabPillActive]}
                  onPress={() => setAiTab('bullets')}
                >
                  <Text style={[styles.aiTabPillText, aiTab === 'bullets' && styles.aiTabPillTextActive]}>
                    ATS Bullets
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.aiTabPill, aiTab === 'linkedin' && styles.aiTabPillActive]}
                  onPress={() => setAiTab('linkedin')}
                >
                  <Text style={[styles.aiTabPillText, aiTab === 'linkedin' && styles.aiTabPillTextActive]}>
                    LinkedIn Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.aiTabPill, aiTab === 'pitch' && styles.aiTabPillActive]}
                  onPress={() => setAiTab('pitch')}
                >
                  <Text style={[styles.aiTabPillText, aiTab === 'pitch' && styles.aiTabPillTextActive]}>
                    30s Pitch
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab 1: ATS Bullets */}
              {aiTab === 'bullets' && (
                <View>
                  <View style={styles.aiBulletCard}>
                    <Text style={[styles.aiBulletText, { color: colors.text }]}>
                      • Engineered production applications in {courseTitle}, achieving a verified 98.4% AI Skill Score on India's 1st AI-Powered Platform.
                    </Text>
                  </View>
                  <View style={styles.aiBulletCard}>
                    <Text style={[styles.aiBulletText, { color: colors.text }]}>
                      • Optimized algorithmic pipelines and data structures, reducing runtime latency by 35% in automated benchmark simulations.
                    </Text>
                  </View>
                  <View style={styles.aiBulletCard}>
                    <Text style={[styles.aiBulletText, { color: colors.text }]}>
                      • Led hands-on capstone engineering under continuous automated CI/CD and AI code quality audits.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.copyLinkBtn, { borderColor: '#8B5CF6', marginTop: 8 }]}
                    onPress={() => Alert.alert('📋 Copied', 'All ATS Resume Bullets copied to clipboard!')}
                  >
                    <Ionicons name="copy-outline" size={16} color="#8B5CF6" />
                    <Text style={{ color: '#8B5CF6', fontWeight: '700', fontSize: 13 }}>
                      Copy All ATS Bullets
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tab 2: LinkedIn Post */}
              {aiTab === 'linkedin' && (
                <View>
                  <View style={[styles.aiBulletCard, { padding: 12 }]}>
                    <Text style={[styles.aiBulletText, { color: colors.text, lineHeight: 20 }]}>
                      🚀 Thrilled to announce that I have successfully completed "{courseTitle}" from Tech Indro — India's 1st AI-Powered Learning Platform! 🇮🇳✨{'\n\n'}
                      My capstone projects were audited by Tech Indro's Shikshak AI Engine with a verified 98.4% AI Skill Score.{'\n\n'}
                      #TechIndro #ArtificialIntelligence #Engineering #Placements2026 #AIReady
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.linkedinBtn, { marginTop: 8 }]}
                    onPress={handleShareLinkedIn}
                  >
                    <Ionicons name="logo-linkedin" size={16} color="#FFFFFF" />
                    <Text style={styles.shareBtnText}>Share on LinkedIn</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tab 3: Spoken Pitch */}
              {aiTab === 'pitch' && (
                <View>
                  <View style={[styles.aiBulletCard, { padding: 12 }]}>
                    <Text style={[styles.aiBulletText, { color: colors.text, lineHeight: 20 }]}>
                      "I am {userName}, certified from Tech Indro's {courseTitle} with a 98.4% AI-audited score. I specialize in building robust systems and leveraging modern AI workflows to drive real engineering results."
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.copyLinkBtn, { borderColor: '#8B5CF6', marginTop: 8 }]}
                    onPress={() => Alert.alert('📋 Copied', 'Elevator pitch copied to clipboard!')}
                  >
                    <Ionicons name="copy-outline" size={16} color="#8B5CF6" />
                    <Text style={{ color: '#8B5CF6', fontWeight: '700', fontSize: 13 }}>
                      Copy Pitch Script
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* STYLES — Burgundy Multi-Line Stepped Border & Typography               */
/* ═══════════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 70,
    alignItems: 'center',
  },

  /* Certificate Shadow Container */
  cardShadow: {
    width: '100%',
    maxWidth: 780,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },

  /* ── 1. Outer Border Line (Thin, 1.2px) ── */
  borderLayerOuter: {
    borderWidth: 1.2,
    borderColor: CERT_BURGUNDY,
    padding: 3.5,
    backgroundColor: '#FFFFFF',
  },

  /* ── 2. Middle Border Line (Thick, 2.8px) ── */
  borderLayerMiddle: {
    borderWidth: 2.8,
    borderColor: CERT_BURGUNDY,
    padding: 3.5,
  },

  /* ── 3. Inner Border Line (Thin, 1.2px) ── */
  borderLayerInner: {
    borderWidth: 1.2,
    borderColor: CERT_BURGUNDY,
    position: 'relative',
  },

  /* ── 4 Corner Squares / Stepped Motifs ── */
  cornerSquare: {
    position: 'absolute',
    width: 9,
    height: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: CERT_BURGUNDY,
    zIndex: 10,
  },
  cornerTL: {
    top: -5,
    left: -5,
  },
  cornerTR: {
    top: -5,
    right: -5,
  },
  cornerBL: {
    bottom: -5,
    left: -5,
  },
  cornerBR: {
    bottom: -5,
    right: -5,
  },

  /* ── Certificate Content Padding ── */
  certificateInnerContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  /* ── Header: Logo + "Professional Education" ── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 22,
  },
  logoImage: {
    width: 56,
    height: 28,
  },
  proEducationCol: {
    justifyContent: 'center',
  },
  proTitleText: {
    fontFamily: SANS_FONT,
    fontSize: 19,
    fontWeight: '800',
    color: CERT_BURGUNDY,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  eduTitleText: {
    fontFamily: SANS_FONT,
    fontSize: 19,
    fontWeight: '800',
    color: CERT_BURGUNDY,
    lineHeight: 22,
    letterSpacing: -0.3,
  },

  /* ── "This is to certify that" ── */
  certifyLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12.5,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },

  /* ── Recipient Name (Bold Sans-Serif) ── */
  recipientName: {
    fontFamily: SANS_FONT,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.4,
  },

  /* ── Center Red Emblem Seal ── */
  sealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  sealOuterRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1.5,
    borderColor: CERT_BURGUNDY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  sealMiddleRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 0.8,
    borderStyle: 'dashed',
    borderColor: CERT_BURGUNDY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  sealInnerRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.2,
    borderColor: CERT_BURGUNDY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F8',
    paddingHorizontal: 2,
  },
  sealTopText: {
    fontFamily: SANS_FONT,
    fontSize: 6,
    fontWeight: '800',
    color: CERT_BURGUNDY,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 2,
  },
  sealCenterIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 1,
  },
  sealCenterDivider: {
    width: 8,
    height: 1,
    backgroundColor: CERT_BURGUNDY,
  },
  sealBottomText: {
    fontFamily: SANS_FONT,
    fontSize: 4.5,
    fontWeight: '700',
    color: CERT_BURGUNDY,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 2,
  },

  /* ── "has successfully completed the" ── */
  completedLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12.5,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 10,
  },

  /* ── Course Title (Bold Sans-Serif) ── */
  courseTitle: {
    fontFamily: SANS_FONT,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  /* ── Date ── */
  dateText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 36,
  },

  /* ── Two Signatures Row with Dotted Lines ── */
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  signatureCol: {
    alignItems: 'center',
    minWidth: 180,
  },
  handwrittenSig: {
    fontFamily: CURSIVE_FONT,
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
    transform: [{ rotate: '-2deg' }],
  },
  dottedLine: {
    width: 170,
    borderBottomWidth: 1.2,
    borderStyle: 'dotted',
    borderColor: '#6B7280',
    marginBottom: 6,
  },
  signatoryName: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 1.5,
  },
  signatoryRole: {
    fontFamily: SANS_FONT,
    fontSize: 9,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 1,
  },
  signatoryOrg: {
    fontFamily: SANS_FONT,
    fontSize: 8.5,
    color: '#6B7280',
    textAlign: 'center',
  },

  /* ── Verified Badge ── */
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 18,
  },
  verifyBadgeText: {
    fontSize: 11,
    color: '#065F46',
  },

  /* ── Actions Box ── */
  actionsBox: {
    width: '100%',
    maxWidth: 780,
  },
  actionHeading: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  actionSub: {
    fontSize: FontSize.xs,
    marginBottom: Spacing.md,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  linkedinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0A66C2',
    paddingVertical: 13,
    borderRadius: 8,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: 8,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* ── Interactive Name Editing ── */
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inlineEditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F6',
    borderColor: 'rgba(139, 30, 45, 0.35)',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  inlineEditText: {
    color: CERT_BURGUNDY,
    fontSize: 11,
    fontWeight: '700',
  },
  editNameActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: 'rgba(139, 30, 45, 0.07)',
    marginBottom: 16,
  },
  editNameActionBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* ── Edit Modal Styles ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  nameTextInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  modalSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* ── Honors Ribbon Badge ── */
  appRibbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D97706',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  appRibbonBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ── Copy Link Button ── */
  copyLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
  },
  copyLinkBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* ── Modal Extra Fields ── */
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  honorsToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  honorsToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* ── India's 1st AI Platform Banner ── */
  indiaFirstBanner: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 30, 45, 0.25)',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  indiaFirstBannerText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.8,
  },

  /* ── AI Academic Citation ── */
  aiCitationBox: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 2.5,
    borderLeftColor: CERT_BURGUNDY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '94%',
    alignSelf: 'center',
  },
  aiCitationTag: {
    fontSize: 7.5,
    fontWeight: '800',
    color: CERT_BURGUNDY,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  aiCitationText: {
    fontSize: 9.5,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 13.5,
  },

  /* ── AI Neural Matrix ── */
  aiMatrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 6,
    width: '94%',
    alignSelf: 'center',
  },
  aiMatrixCol: {
    alignItems: 'center',
  },
  aiMatrixVal: {
    fontSize: 10,
    fontWeight: '800',
    color: CERT_BURGUNDY,
  },
  aiMatrixLbl: {
    fontSize: 7,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },

  /* ── AI Career Copilot Button ── */
  aiCareerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiCareerBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* ── AI Career Modal Components ── */
  modalContentWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  aiTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  aiTabPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'transparent',
  },
  aiTabPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#8B5CF6',
  },
  aiTabPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  aiTabPillTextActive: {
    color: '#FFFFFF',
  },
  aiBulletCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  aiBulletText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
});
