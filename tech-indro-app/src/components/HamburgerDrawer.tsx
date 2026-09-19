import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface HamburgerDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.86, 360);

export default function HamburgerDrawer({ visible, onClose }: HamburgerDrawerProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      // @ts-ignore
      router.push(route);
    }, 150);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Hi Tech Indro Team! I want to know more about Courses, TSOC Fellowship & 1:1 Mentorship.'
    );
    Linking.openURL(`https://wa.me/917898877688?text=${message}`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Backdrop Overlay */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Slide-out Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerPanel,
            {
              width: DRAWER_WIDTH,
              backgroundColor: colors.card,
              borderLeftColor: colors.border,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/tech-indro-square-logo.png')}
                style={styles.logoImg}
                resizeMode="contain"
              />
              <Text style={[styles.brandText, { color: colors.text }]}>TECH INDRO</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
              accessibilityLabel="Close Menu"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Drawer Body Scroll */}
          <ScrollView
            style={styles.drawerScroll}
            contentContainerStyle={styles.drawerScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. SPOTLIGHT SECTION */}
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>SPOTLIGHT</Text>

            {/* Courses / Programs */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: isDark ? '#141c2e' : '#f8fafc', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/programs')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ff6b35', '#f59e0b']}
                style={styles.iconBox}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="book-outline" size={20} color="#ffffff" />
              </LinearGradient>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Courses</Text>
                  <View style={[styles.badgePill, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                    <Text style={[styles.badgePillText, { color: '#ea580c' }]}>Programs</Text>
                  </View>
                </View>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]} numberOfLines={2}>
                  40+ job-oriented tracks in AI, Full Stack & Robotics
                </Text>
              </View>
            </TouchableOpacity>

            {/* About us */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: isDark ? '#141c2e' : '#f8fafc', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/dashboard')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.iconBox}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="information-circle-outline" size={20} color="#ffffff" />
              </LinearGradient>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>About us</Text>
                  <View style={[styles.badgePill, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                    <Text style={[styles.badgePillText, { color: '#2563eb' }]}>Our Story</Text>
                  </View>
                </View>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]} numberOfLines={2}>
                  Vision, pedagogy & ecosystem for future engineers
                </Text>
              </View>
            </TouchableOpacity>

            {/* Contact */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: isDark ? '#141c2e' : '#f8fafc', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/support')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.iconBox}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="call-outline" size={20} color="#ffffff" />
              </LinearGradient>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Contact</Text>
                  <View style={[styles.badgePill, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                    <Text style={[styles.badgePillText, { color: '#16a34a' }]}>24/7 Help</Text>
                  </View>
                </View>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]} numberOfLines={2}>
                  1:1 Mentorship, career counseling & support
                </Text>
              </View>
            </TouchableOpacity>

            {/* 2. PLATFORM TOOLS SECTION */}
            <Text style={[styles.sectionHeading, { color: colors.textMuted, marginTop: 18 }]}>
              EXPLORE ECOSYSTEM
            </Text>

            {/* TSOC Fellowship (Real Vector Icon) */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/tsoc')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="rocket-outline" size={19} color="#8b5cf6" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>TSOC Fellowship</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#8b5cf6' }]}>Cohort 2026</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Tier-1 Open-Source Fellowship
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* IndroLabs */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/indrolabs')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                <Ionicons name="terminal-outline" size={19} color="#06b6d4" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>IndroLabs</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#06b6d4' }]}>Cloud IDE</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Instant in-browser compilers
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* AI Shikshak */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/ai-mentor')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="sparkles-outline" size={19} color="#f59e0b" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>AI Shikshak</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#f59e0b' }]}>24x7 AI</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Snap, voice, or text doubt solver
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Test Series */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/quiz')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="school-outline" size={19} color="#6366f1" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>Test Series</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#6366f1' }]}>Mock Tests</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Weekly live assessments & rankings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* System Design Labs */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/system-design')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(2, 132, 199, 0.15)' }]}>
                <Ionicons name="git-network-outline" size={19} color="#0284c7" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>System Design Labs</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#0284c7' }]}>E2E Flow</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Architecture simulator & load test
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* AI Tools Hub */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/ai-tools')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <Ionicons name="apps-outline" size={19} color="#ec4899" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>AI Tools Hub</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#ec4899' }]}>110+ Tools</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Curated stack for modern builders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Interview Prep Hub */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/interview-prep')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="mic-outline" size={19} color="#10b981" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>Interview Prep Hub</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#10b981' }]}>AI Mock</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  ATS auditor & STAR interview solver
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Code Clash 1v1 Arena */}
            <TouchableOpacity
              style={[
                styles.toolRow,
                { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: colors.border },
              ]}
              onPress={() => handleNavigate('/code-clash')}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconBox, { backgroundColor: 'rgba(234, 88, 12, 0.15)' }]}>
                <Ionicons name="flame-outline" size={19} color="#ea580c" />
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolTitleRow}>
                  <Text style={[styles.toolTitle, { color: colors.text }]}>Code Clash Arena</Text>
                  <Text style={[styles.toolMiniBadge, { color: '#ea580c' }]}>1v1 Battle</Text>
                </View>
                <Text style={[styles.toolDesc, { color: colors.textMuted }]}>
                  Live coding duels & IndroCoins
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* WhatsApp 1:1 Counseling Banner */}
            <TouchableOpacity
              style={styles.counselingCard}
              onPress={handleWhatsApp}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#059669', '#10b981']}
                style={styles.counselingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.counselingContent}>
                  <Ionicons name="logo-whatsapp" size={26} color="#ffffff" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.counselingTitle}>Need Career Guidance?</Text>
                    <Text style={styles.counselingSubtitle}>Chat 1:1 with Senior Mentors Free</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={24} color="#ffffff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.drawerFooter, { borderTopColor: colors.border, backgroundColor: isDark ? '#0b0f19' : '#f8fafc' }]}>
            {user ? (
              <TouchableOpacity
                style={styles.footerUserRow}
                onPress={() => handleNavigate('/dashboard')}
                activeOpacity={0.8}
              >
                <View style={styles.userAvatarBox}>
                  <Text style={styles.userAvatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.userNameText, { color: colors.text }]} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={[styles.userRoleText, { color: colors.textMuted }]} numberOfLines={1}>
                    {user.email || 'Tech Explorer'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => handleNavigate('/login')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#ff6b35', '#ea580c']}
                  style={styles.loginGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="log-in-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.loginBtnText}>Login / Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  drawerPanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeftWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -8, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 24,
      },
      web: {
        boxShadow: '-10px 0 35px rgba(0,0,0,0.25)',
      },
    }),
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImg: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  toolIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolInfo: {
    flex: 1,
    marginLeft: 11,
  },
  toolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  toolTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  toolMiniBadge: {
    fontSize: 10,
    fontWeight: '700',
  },
  toolDesc: {
    fontSize: 11,
  },
  counselingCard: {
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  counselingGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  counselingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counselingTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  counselingSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  drawerFooter: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
  },
  loginBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  userNameText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  userRoleText: {
    fontSize: 11,
  },
});
