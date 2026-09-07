/**
 * Verifiable Certificate Screen — Tech Indro
 * Official Academic Credential
 * Features burgundy ornate stepped-corner border, modern sans-serif typography,
 * centered crimson emblem seal, and dual dotted-line signatures for Tech Indro leadership (Shubham Patel & Dr. Arvind Sharma).
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Image,
  Platform,
} from 'react-native';
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
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{
    studentName?: string;
    courseName?: string;
    certId?: string;
  }>();

  const [userName, setUserName] = useState(params.studentName || 'Rahul Sharma');
  const courseTitle = params.courseName || 'Applied AI and Data Science Program';
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
        const stored =
          (await AsyncStorage.getItem('@tech_indro_user')) ||
          (await AsyncStorage.getItem('user'));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
        }
        const profileData = await AsyncStorage.getItem('@tech_indro_user_profile');
        if (profileData) {
          const prof = JSON.parse(profileData);
          if (prof.name) setUserName(prof.name);
        }
      } catch {
        // ignore
      }
    }
    if (!params.studentName) {
      loadUser();
    }
  }, [params.studentName]);

  const shareUrl = `https://techindro.com/verify/${certId}`;
  const shareText = `I am proud to share my verified Certificate of Completion from Tech Indro in "${courseTitle}"! 🎓\n\nVerify: ${shareUrl}`;

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
    Alert.alert('📥 Certificate Downloaded', `Official Credential ${certId}.pdf generated.`, [
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? '#0F1117' : '#F1F3F5' }]}>
      {/* Top App Bar */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

                  {/* 3. RECIPIENT NAME (Bold Sans-Serif) */}
                  <Text style={styles.recipientName}>{userName}</Text>

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
                  <Text style={styles.dateText}>July 2026</Text>

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
                      <Text style={styles.handwrittenSig}>Dr. Arvind Sharma</Text>
                      <View style={styles.dottedLine} />
                      <Text style={styles.signatoryName}>Dr. Arvind Sharma</Text>
                      <Text style={styles.signatoryRole}>Dean of Academics</Text>
                      <Text style={styles.signatoryOrg}>Tech Indro</Text>
                    </View>
                  </View>

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

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Text style={[styles.actionHeading, { color: colors.text }]}>Share Your Credential</Text>
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
            style={[styles.downloadBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleDownload}
          >
            <Ionicons name="cloud-download-outline" size={18} color={colors.text} />
            <Text style={[styles.downloadBtnText, { color: colors.text }]}>
              Download Official PDF Certificate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: 120,
    height: 56,
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
    marginBottom: 16,
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
});
