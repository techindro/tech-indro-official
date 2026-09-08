/**
 * Tech Indro — Homepage Screen
 * Matches the website's index.html visual flow
 */
import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  Image,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors, {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/constants/Colors';
import ThemeToggleBtn from '@/components/ThemeToggleBtn';
import NotificationBell from '@/components/NotificationBell';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

// ===================== DATA =====================

const TRUST_BADGES = [
  { icon: 'sparkles-outline' as const, label: "India's First AI Platform" },
  { icon: 'layers-outline' as const, label: 'Project-Based Curriculum' },
  { icon: 'briefcase-outline' as const, label: 'Job Oriented Skills' },
  { icon: 'globe-outline' as const, label: 'Learn Anything, Anywhere' },
];

const LEARNING_PATHS = [
  {
    icon: 'code-slash-outline' as const,
    title: 'Coding & Development',
    desc: 'AI, Full-Stack Web Dev, Open Source, and Data Structures.',
    color: '#4f46e5',
    bgColor: 'rgba(79, 70, 229, 0.1)',
  },
  {
    icon: 'fitness-outline' as const,
    title: 'Life & Health',
    desc: 'Physical Fitness, Mental Resilience, and Bio-hacking.',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
  },
  {
    icon: 'trending-up-outline' as const,
    title: 'Business & Startups',
    desc: 'Sales, Marketing, Entrepreneurship, and Pitching.',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: 'chatbubbles-outline' as const,
    title: 'Communication Skills',
    desc: 'English Fluency, The Hindu Analysis, and Interviews.',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
];

const LIVE_BATCHES = [
  {
    title: 'MNC Cracker Batch',
    subtitle: 'Zero to One: Placements',
    date: '15 Aug',
    badge: 'STARTING SOON',
    badgeColor: '#ef4444',
    desc: 'Target Top Product-Based Companies. Full Stack + DSA + CS Core.',
    gradient: ['#4f46e5', '#7c3aed'] as const,
  },
  {
    title: 'Alpha SIH Batch',
    subtitle: 'Hackathon Winners Program',
    date: 'Ongoing',
    badge: 'ENROLLING',
    badgeColor: '#10b981',
    desc: 'Crack Smart India Hackathon & build massive ISRO Projects.',
    gradient: ['#059669', '#10b981'] as const,
  },
  {
    title: "Founder's Batch",
    subtitle: '0-to-1 Entrepreneurship',
    date: 'Next Week',
    badge: 'POPULAR',
    badgeColor: '#f59e0b',
    desc: 'Master Sales, Digital Marketing, and building a startup from scratch.',
    gradient: ['#d97706', '#f59e0b'] as const,
  },
];

const FEATURES = [
  { icon: 'code-working-outline' as const, color: '#4F46E5', title: 'Project-Based\nLearning', desc: 'Learn by building real-world projects for your portfolio' },
  { icon: 'school-outline' as const, color: '#8B5CF6', title: 'Expert\nMentorship', desc: 'Guidance from industry experts and professionals' },
  { icon: 'library-outline' as const, color: '#3B82F6', title: 'Comprehensive\nCurriculum', desc: 'Courses designed to match current job market demands' },
  { icon: 'ribbon-outline' as const, color: '#10B981', title: 'Career\nSupport', desc: 'Resume building, interview prep, and placement assistance' },
];

// ===================== COMPONENT =====================

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  const mainScrollRef = useRef<ScrollView>(null);
  const [featuresY, setFeaturesY] = useState(0);
  const [demoModalVisible, setDemoModalVisible] = useState(false);

  const scrollToFeatures = () => {
    if (featuresY > 0 && mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ y: Math.max(0, featuresY - 70), animated: true });
    } else {
      router.push('/ai-mentor');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ===== TOP NAVBAR (Clean, Exactly Matching Website) ===== */}
      <View style={[styles.topNavbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {/* Main Brand & Actions Row */}
        <View style={styles.topNavMainRow}>
          <TouchableOpacity style={styles.topNavLogoRow} onPress={() => router.push('/')}>
            <Image
              source={isDark ? require('@/assets/images/tech-indro-logo-white.png') : require('@/assets/images/tech-indro-logo.png')}
              style={styles.topNavLogoImg}
              resizeMode="contain"
            />
            <Text style={[styles.topNavLogoText, { color: colors.text }]}>TECH INDRO</Text>
          </TouchableOpacity>

          {/* Desktop Nav Links (Inline 5 Links: Programs, TSOC, IndroLabs, Features, Test Series) */}
          {isDesktop && (
            <View style={styles.desktopNavLinksRow}>
              <TouchableOpacity onPress={() => router.push('/programs')} style={styles.navLinkItem}>
                <Text style={[styles.navLinkText, { color: colors.text }]}>Programs</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/tsoc')} style={styles.navLinkItem}>
                <Text style={[styles.navLinkText, { color: colors.text }]}>TSOC</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/indrolabs')} style={styles.navLinkItem}>
                <Text style={[styles.navLinkText, { color: colors.text }]}>IndroLabs</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={scrollToFeatures} style={styles.navLinkItem}>
                <Text style={[styles.navLinkText, { color: colors.text }]}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/quiz')} style={styles.navLinkItem}>
                <Text style={[styles.navLinkText, { color: colors.text }]}>Test Series</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.topNavRightActions}>
            <TouchableOpacity
              style={styles.navAuthBtn}
              onPress={() => router.push(user ? '/dashboard' : '/login')}
              activeOpacity={0.85}
            >
              <Ionicons name={user ? 'person' : 'log-in-outline'} size={14} color="#ffffff" />
              <Text style={styles.navAuthBtnText}>{user ? user.name.split(' ')[0] : 'Login / Sign Up'}</Text>
            </TouchableOpacity>
            <NotificationBell unreadCount={3} />
            <ThemeToggleBtn />
          </View>
        </View>

        {/* Mobile Nav Links Row - Only the 5 specified links */}
        {!isDesktop ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topNavScrollContainer}
            style={[styles.topNavScrollView, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }]}
          >
            <TouchableOpacity onPress={() => router.push('/programs')} style={styles.navLinkItem}>
              <Text style={[styles.navLinkText, { color: colors.text }]}>Programs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/tsoc')} style={styles.navLinkItem}>
              <Text style={[styles.navLinkText, { color: colors.text }]}>TSOC</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/indrolabs')} style={styles.navLinkItem}>
              <Text style={[styles.navLinkText, { color: colors.text }]}>IndroLabs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={scrollToFeatures} style={styles.navLinkItem}>
              <Text style={[styles.navLinkText, { color: colors.text }]}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/quiz')} style={styles.navLinkItem}>
              <Text style={[styles.navLinkText, { color: colors.text }]}>Test Series</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : null}
      </View>

      <ScrollView ref={mainScrollRef} showsVerticalScrollIndicator={false} bounces={false}>
        {/* ===== HERO SECTION ===== */}
        <LinearGradient
          colors={['#5B68DF', '#6C5CE7', '#764BA2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroContainer}>
            {/* Left Column: Hero Text & CTAs */}
            <View style={styles.heroLeftCol}>
              <Text style={styles.heroTitle}>
                India's First{' '}
                <Text style={styles.heroHighlight}>AI-Powered</Text>
                {' '}Learning Platform
              </Text>

              <Text style={styles.heroSubtitle}>
                Master in-demand tech skills from scratch. Guided by 24/7 personal AI assistants.{' '}
                <Text style={{ fontWeight: '700', color: '#ffffff' }}>
                  Built for everyone — no laptop or tech background required.
                </Text>
              </Text>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>1.2L+</Text>
                  <Text style={styles.statLabel}>Learners</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>AI Mentors</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>4.8★</Text>
                  <Text style={styles.statLabel}>Student Rating</Text>
                </View>
              </View>

              {/* CTA Buttons */}
              <View style={styles.heroCTA}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => router.push('/programs')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryBtnText}>🚀 Start Learning Free</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => router.push('/programs')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryBtnText}>View All Programs</Text>
                </TouchableOpacity>
              </View>

              {/* Trust Rating Line */}
              <View style={styles.heroTrustLine}>
                <Text style={styles.heroTrustText}>★ 4.9/5 Rating  |  🎯 100% Job Assistance  |  📱 Learn on Mobile</Text>
              </View>
            </View>

            {/* Right Column: Demo Class Video Card (1:1 with Screenshot 1) */}
            <View style={styles.heroRightCol}>
              <TouchableOpacity
                style={styles.demoClassCard}
                onPress={() => setDemoModalVisible(true)}
                activeOpacity={0.88}
              >
                <View style={styles.demoPlayInnerCircle}>
                  <Ionicons name="play" size={28} color="#ffffff" style={{ marginLeft: 3 }} />
                </View>
                <Text style={styles.demoClassTitle}>Watch Demo Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* ===== DEMO CLASS MODAL PLAYER ===== */}
        <Modal visible={demoModalVisible} transparent animationType="slide">
          <View style={styles.demoModalOverlay}>
            <View style={styles.demoModalBox}>
              <View style={styles.demoModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Image
                    source={require('@/assets/images/tech-indro-logo.png')}
                    style={{ width: 40, height: 20 }}
                    resizeMode="contain"
                  />
                  <View style={{ backgroundColor: '#EF444422', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#EF4444' }}>LIVE PREVIEW</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setDemoModalVisible(false)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={24} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.demoVideoScreen}>
                <LinearGradient
                  colors={['#0F172A', '#1E293B']}
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <View style={styles.demoPlayBigBtn}>
                    <Ionicons name="play" size={32} color="#ffffff" style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, marginTop: 12 }}>
                    Lesson 1: Introduction to AI & Robotics
                  </Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>
                    Lecturer: Indranil Roy • 12:45 Mins • 1080p Full HD
                  </Text>

                  {/* Progress bar mock */}
                  <View style={{ width: '85%', height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 18, overflow: 'hidden' }}>
                    <View style={{ width: '42%', height: '100%', backgroundColor: '#ff6b35' }} />
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.demoModalFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.text }}>Liked the lecture?</Text>
                  <Text style={{ fontSize: 12, color: Colors.textMuted }}>Get 100+ lessons, assignments & real certificates.</Text>
                </View>
                <TouchableOpacity
                  style={styles.demoModalEnrollBtn}
                  onPress={() => {
                    setDemoModalVisible(false);
                    router.push('/programs');
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Browse Courses</Text>
                  <Ionicons name="arrow-forward" size={15} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ===== TRUST BADGES ===== */}
        <View style={styles.trustSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trustScroll}>
            {TRUST_BADGES.map((badge, i) => (
              <View key={i} style={styles.trustItem}>
                <View style={styles.trustIcon}>
                  <Ionicons name={badge.icon} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.trustLabel}>{badge.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ===== LEARNING PATHS (Features Target) ===== */}
        <View style={styles.section} onLayout={(e) => setFeaturesY(e.nativeEvent.layout.y)}>
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>DISCOVER PATHWAYS</Text>
          </View>
          <Text style={styles.sectionTitle}>Choose Your{'\n'}Learning Path</Text>
          <Text style={styles.sectionSubtitle}>
            Master highly-demanded technologies that shape tomorrow.
          </Text>

          <View style={styles.pathsGrid}>
            {LEARNING_PATHS.map((path, i) => (
              <TouchableOpacity
                key={i}
                style={styles.pathCard}
                onPress={() => router.push('/programs')}
                activeOpacity={0.9}
              >
                <View style={[styles.pathIcon, { backgroundColor: path.bgColor }]}>
                  <Ionicons name={path.icon} size={28} color={path.color} />
                </View>
                <Text style={styles.pathTitle}>{path.title}</Text>
                <Text style={styles.pathDesc}>{path.desc}</Text>
                <View style={styles.pathArrow}>
                  <Text style={[styles.pathArrowText, { color: path.color }]}>
                    EXPLORE PATH
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={path.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== LIVE BATCHES ===== */}
        <View style={[styles.section, { backgroundColor: Colors.white }]}>
          <View style={[styles.sectionPill, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]}>
            <Text style={[styles.sectionPillText, { color: '#4f46e5' }]}>LIVE COHORTS</Text>
          </View>
          <Text style={styles.sectionTitle}>Live AI-Guided{'\n'}Platform</Text>
          <Text style={styles.sectionSubtitle}>
            Join thousands learning in real-time with advanced AI Mentors.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.batchScroll}
            snapToInterval={width * 0.8 + Spacing.lg}
            decelerationRate="fast"
          >
            {LIVE_BATCHES.map((batch, i) => (
              <TouchableOpacity key={i} style={styles.batchCard} activeOpacity={0.9}>
                <LinearGradient
                  colors={[...batch.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.batchHeader}
                >
                  <View style={[styles.batchBadge]}>
                    <Text style={[styles.batchBadgeText, { color: batch.badgeColor }]}>
                      {batch.badge}
                    </Text>
                  </View>
                  <Text style={styles.batchTitle}>{batch.title}</Text>
                </LinearGradient>
                <View style={styles.batchContent}>
                  <Text style={styles.batchSubtitle}>{batch.subtitle}</Text>
                  <View style={styles.batchMeta}>
                    <View style={styles.batchMetaItem}>
                      <Ionicons name="calendar-outline" size={16} color={Colors.info} />
                      <Text style={styles.batchMetaText}>{batch.date}</Text>
                    </View>
                    <View style={styles.batchMetaItem}>
                      <Ionicons name="hardware-chip-outline" size={16} color={Colors.info} />
                      <Text style={styles.batchMetaText}>AI Mentor</Text>
                    </View>
                  </View>
                  <Text style={styles.batchDesc}>{batch.desc}</Text>
                  <TouchableOpacity style={styles.batchBtn} onPress={() => router.push('/programs')}>
                    <Text style={styles.batchBtnText}>Explore Batch</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===== WHY CHOOSE TECH INDRO ===== */}
        <View style={[styles.section, { backgroundColor: Colors.surface }]}>
          <Text style={styles.sectionTitle}>Why Choose{'\n'}Tech Indro?</Text>
          <Text style={styles.sectionSubtitle}>
            The complete learning ecosystem for future tech leaders
          </Text>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: feat.color + '18' }]}>
                  <Ionicons name={feat.icon} size={28} color={feat.color} />
                </View>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== INNOVATION HUBS & LABS ===== */}
        <View style={styles.section}>
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>INNOVATION HUBS</Text>
          </View>
          <Text style={styles.sectionTitle}>Next-Gen Labs &{'\n'}Fellowships</Text>
          <Text style={styles.sectionSubtitle}>
            Beyond traditional courses — experiment with real space robotics, in-browser runtimes & open source fellowships.
          </Text>

          <View style={styles.pathsGrid}>
            <TouchableOpacity
              style={styles.pathCard}
              onPress={() => router.push('/isro-lab')}
              activeOpacity={0.9}
            >
              <View style={[styles.pathIcon, { backgroundColor: '#38BDF822' }]}>
                <Ionicons name="planet-outline" size={28} color="#38BDF8" />
              </View>
              <Text style={styles.pathTitle}>ISRO Space Lab</Text>
              <Text style={styles.pathDesc}>
                Simulate lunar rover telemetry, Chandrayaan-3 & orbital physics.
              </Text>
              <View style={styles.pathArrow}>
                <Text style={[styles.pathArrowText, { color: '#38BDF8' }]}>LAUNCH MISSION</Text>
                <Ionicons name="arrow-forward" size={16} color="#38BDF8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pathCard}
              onPress={() => router.push('/indrolabs')}
              activeOpacity={0.9}
            >
              <View style={[styles.pathIcon, { backgroundColor: '#8B5CF622' }]}>
                <Ionicons name="terminal-outline" size={28} color="#8B5CF6" />
              </View>
              <Text style={styles.pathTitle}>IndroLabs Runtime</Text>
              <Text style={styles.pathDesc}>
                Cloud code playground for JS, Python & C++ with instant console execution.
              </Text>
              <View style={styles.pathArrow}>
                <Text style={[styles.pathArrowText, { color: '#8B5CF6' }]}>OPEN PLAYGROUND</Text>
                <Ionicons name="arrow-forward" size={16} color="#8B5CF6" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pathCard}
              onPress={() => router.push('/tsoc')}
              activeOpacity={0.9}
            >
              <View style={[styles.pathIcon, { backgroundColor: '#F59E0B22' }]}>
                <Ionicons name="rocket-outline" size={28} color="#F59E0B" />
              </View>
              <Text style={styles.pathTitle}>TSOC Fellowship</Text>
              <Text style={styles.pathDesc}>
                Tech Indro Summer of Code with ₹50,000+ stipend & 1:1 mentorship.
              </Text>
              <View style={styles.pathArrow}>
                <Text style={[styles.pathArrowText, { color: '#F59E0B' }]}>APPLY FOR BATCH</Text>
                <Ionicons name="arrow-forward" size={16} color="#F59E0B" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pathCard}
              onPress={() => router.push('/leaderboard')}
              activeOpacity={0.9}
            >
              <View style={[styles.pathIcon, { backgroundColor: '#10B98122' }]}>
                <Ionicons name="podium-outline" size={28} color="#10B981" />
              </View>
              <Text style={styles.pathTitle}>Global Leaderboard</Text>
              <Text style={styles.pathDesc}>
                Compete with 50,000+ developers across India for top ranks & rewards.
              </Text>
              <View style={styles.pathArrow}>
                <Text style={[styles.pathArrowText, { color: '#10B981' }]}>VIEW RANKINGS</Text>
                <Ionicons name="arrow-forward" size={16} color="#10B981" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pathCard}
              onPress={() => router.push('/ai-tools')}
              activeOpacity={0.9}
            >
              <View style={[styles.pathIcon, { backgroundColor: '#EC489922' }]}>
                <Ionicons name="hardware-chip-outline" size={28} color="#EC4899" />
              </View>
              <Text style={styles.pathTitle}>AI Tools & Stack Hub</Text>
              <Text style={styles.pathDesc}>
                Explore 40+ curated AI developer platforms for Coding, UI Generation & Research.
              </Text>
              <View style={styles.pathArrow}>
                <Text style={[styles.pathArrowText, { color: '#EC4899' }]}>EXPLORE STACK</Text>
                <Ionicons name="arrow-forward" size={16} color="#EC4899" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== AI DOUBT SOLVER BANNER (Exact Match with Screenshot) ===== */}
        <View style={styles.section}>
          <View style={styles.advDoubtContainer}>
            {/* Left Content */}
            <View style={styles.advDoubtLeft}>
              <View style={styles.advDoubtBadge}>
                <Text style={styles.advDoubtBadgeText}>24X7 AVAILABLE</Text>
              </View>

              <Text style={styles.advDoubtTitle}>
                Stuck with a Doubt?{'\n'}Don't wait.
              </Text>

              <Text style={styles.advDoubtDesc}>
                Click a photo, type it, or just ask by voice. Our AI Mentor will instantly explain the core concepts step-by-step in Hindi, English, or 50+ other languages.
              </Text>

              <TouchableOpacity
                style={styles.advDoubtBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/ai-mentor')}
              >
                <Ionicons name="camera-outline" size={19} color="#ffffff" />
                <Text style={styles.advDoubtBtnText}>Ask Your Doubt Now</Text>
              </TouchableOpacity>
            </View>

            {/* Right Visual with Floating Bubbles */}
            <View style={styles.advDoubtVisual}>
              {/* Dashed circular orbit background */}
              <View style={styles.dashedOrbitCircle} />

              {/* Big White Center Glowing Circle */}
              <View style={styles.glowingCenterCircle}>
                <Ionicons name="chatbubbles" size={38} color="#4F46E5" />
              </View>

              {/* Bubble 1: Physics? (Top Right) */}
              <View style={[styles.floatingBubble, styles.bubblePhysics]}>
                <Ionicons name="help-circle-outline" size={17} color="#EF4444" />
                <Text style={[styles.bubbleText, { color: '#EF4444' }]}>Physics?</Text>
              </View>

              {/* Bubble 2: Startup Idea? (Middle Left) */}
              <View style={[styles.floatingBubble, styles.bubbleStartup]}>
                <Ionicons name="bulb-outline" size={17} color="#F59E0B" />
                <Text style={[styles.bubbleText, { color: '#F59E0B' }]}>Startup Idea?</Text>
              </View>

              {/* Bubble 3: Python Bug? (Bottom Left) */}
              <View style={[styles.floatingBubble, styles.bubblePython]}>
                <Ionicons name="code-slash-outline" size={17} color="#10B981" />
                <Text style={[styles.bubbleText, { color: '#10B981' }]}>Python Bug?</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===== FOUNDER QUOTE ===== */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <View style={styles.quoteAccent} />
            <Text style={styles.quoteSymbol}>"</Text>
            <Text style={styles.quoteText}>
              AI is not replacing humans, it's augmenting capabilities. Together, humans and AI can achieve the impossible.
            </Text>
            <View style={styles.quoteAuthor}>
              <View style={styles.quoteAvatar}>
                <Text style={{ color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18 }}>SP</Text>
              </View>
              <View>
                <Text style={styles.quoteAuthorName}>Shubham Patel</Text>
                <Text style={styles.quoteAuthorRole}>Founder & CEO, Tech Indro</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===== BOTTOM CTA (Exact Match with Screenshot 2) ===== */}
        <LinearGradient
          colors={['#5B68DF', '#6C5CE7', '#764BA2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bottomCTA}
        >
          <Text style={styles.ctaTitle}>Ready to Launch Your Tech Career?</Text>
          <Text style={styles.ctaSubtitle}>
            Join India's most trusted AI & Robotics learning platform today
          </Text>
          <View style={styles.bottomCtaBtnsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Start Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/support')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Talk to Counselor</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ===== 4-COLUMN FOOTER (Exact Match with Screenshot) ===== */}
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <View style={styles.footerGrid}>
              {/* Column 1: Brand & App Badges */}
              <View style={[styles.footerCol, styles.footerBrandCol]}>
                <View style={styles.footerBrandRow}>
                  <Image
                    source={require('@/assets/images/tech-indro-logo-white.png')}
                    style={{ width: 44, height: 22 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.footerBrandTitle}>TECH INDRO</Text>
                </View>

                <Text style={styles.footerBrandDesc}>
                  India's most loved AI & Robotics learning platform. Empowering students with industry-relevant skills.
                </Text>

                {/* Google Play & App Store Badges */}
                <View style={styles.appBadgesRow}>
                  {/* Google Play Button */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://play.google.com')}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg' }}
                      style={{ height: 40, width: 135 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* App Store Button */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://apple.com')}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg' }}
                      style={{ height: 40, width: 120 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Column 2: Popular Programs */}
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>Popular Programs</Text>
                <View style={styles.footerLinkList}>
                  <TouchableOpacity onPress={() => router.push('/programs')}>
                    <Text style={styles.footerLinkItemText}>Ethical Hacking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/programs')}>
                    <Text style={styles.footerLinkItemText}>Data Science & AI</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/isro-lab')}>
                    <Text style={styles.footerLinkItemText}>ISRO Space Lab</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/indrolabs')}>
                    <Text style={styles.footerLinkItemText}>Cyber Playground</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/quiz')}>
                    <Text style={styles.footerLinkItemText}>Tech Test Series</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Column 3: Company */}
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>Company</Text>
                <View style={styles.footerLinkList}>
                  <TouchableOpacity onPress={() => router.push('/programs')}>
                    <Text style={styles.footerLinkItemText}>About Us</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => router.push('/tsoc')}>
                    <Text style={styles.footerLinkItemText}>Careers</Text>
                    <View style={styles.hiringBadge}>
                      <Text style={styles.hiringBadgeText}>Hiring</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/leaderboard')}>
                    <Text style={styles.footerLinkItemText}>Success Stories</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/ai-mentor')}>
                    <Text style={styles.footerLinkItemText}>Become a Mentor</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/support')}>
                    <Text style={styles.footerLinkItemText}>Contact Us</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Column 4: Get in Touch */}
              <View style={styles.footerCol}>
                <Text style={styles.footerColTitle}>Get in Touch</Text>
                <View style={styles.footerLinkList}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                    onPress={() => Linking.openURL('mailto:support@techindro.com')}
                  >
                    <Ionicons name="mail-outline" size={17} color="#ff6b35" />
                    <Text style={styles.footerLinkItemText}>support@techindro.com</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                    onPress={() => Linking.openURL('tel:+917007896695')}
                  >
                    <Ionicons name="call-outline" size={17} color="#ff6b35" />
                    <Text style={styles.footerLinkItemText}>+91 7007896695</Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="location-outline" size={17} color="#ff6b35" />
                    <Text style={styles.footerLinkItemText}>Tech Indro HQ, Varanasi</Text>
                  </View>
                </View>

                {/* Social Round Buttons */}
                <View style={styles.footerSocialIconsRow}>
                  <TouchableOpacity
                    style={styles.footerCircleSocialBtn}
                    onPress={() => Linking.openURL('https://youtube.com/@Indrolabs')}
                  >
                    <Ionicons name="logo-youtube" size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerCircleSocialBtn}
                    onPress={() => Linking.openURL('https://linkedin.com')}
                  >
                    <Ionicons name="logo-linkedin" size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerCircleSocialBtn}
                    onPress={() => Linking.openURL('https://instagram.com')}
                  >
                    <Ionicons name="logo-instagram" size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerCircleSocialBtn}
                    onPress={() => Linking.openURL('https://github.com')}
                  >
                    <Ionicons name="logo-github" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bottom Bar */}
            <View style={styles.footerBottom}>
              <Text style={styles.footerCopy}>© 2026 Tech Indro. All Rights Reserved.</Text>
              <View style={styles.footerLegalRow}>
                <TouchableOpacity onPress={() => router.push('/support')}>
                  <Text style={styles.footerLegalText}>Terms & Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/support')}>
                  <Text style={styles.footerLegalText}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/support')}>
                  <Text style={styles.footerLegalText}>Refund Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===== FLOATING HELP CHATBOT WIDGET (from Screenshot 1) ===== */}
      <View style={styles.floatingHelpWidget}>
        <TouchableOpacity
          style={styles.floatingHelpRow}
          onPress={() => router.push('/ai-mentor')}
          activeOpacity={0.9}
        >
          <View style={styles.floatingHelpPill}>
            <Text style={styles.floatingHelpText}>Need Help? Chat with us!</Text>
          </View>
          <View style={styles.floatingHelpCircle}>
            <Ionicons name="school" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===================== STYLES =====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Top White Navbar (Responsive & Clean)
  topNavbar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  topNavMainRow: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  topNavLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topNavLogoImg: {
    width: 44,
    height: 22,
  },
  topNavLogoText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  desktopNavLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navLinkItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  topNavRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  navAuthBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  topNavScrollView: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
    paddingTop: 6,
  },
  topNavScrollContainer: {
    paddingHorizontal: Spacing.lg,
    gap: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },

  // Hero Section
  hero: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: Spacing.xl,
  },
  heroContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 36,
  },
  heroLeftCol: {
    flex: 1.1,
    minWidth: 320,
  },
  heroRightCol: {
    flex: 0.9,
    minWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 52,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  heroHighlight: {
    color: '#FFD700',
    fontWeight: '900',
  },
  heroSubtitle: {
    fontSize: 15.5,
    color: '#E0E7FF',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    maxWidth: 520,
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  heroCTA: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  heroTrustLine: {
    marginTop: Spacing.xs,
  },
  heroTrustText: {
    fontSize: 13,
    color: '#E0E7FF',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  primaryBtn: {
    backgroundColor: '#ff6b35',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 8,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 8,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  bottomCtaBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },

  // Floating Help Widget (from Screenshot 1)
  floatingHelpWidget: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999,
  },
  floatingHelpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingHelpPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingHelpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  floatingHelpCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  // Demo Class Hero Card (from website index.html)
  demoClassCard: {
    width: '100%',
    maxWidth: 440,
    height: 260,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  demoPlayInnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: Spacing.md,
  },
  demoClassTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  demoClassSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11.5,
    textAlign: 'center',
  },

  // Demo Class Modal Player
  demoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  demoModalBox: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  demoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  demoVideoScreen: {
    width: '100%',
    height: 220,
    backgroundColor: '#0F172A',
  },
  demoPlayBigBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  demoModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
  },
  demoModalEnrollBtn: {
    backgroundColor: '#ff6b35',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    elevation: 3,
  },

  // Trust Section
  trustSection: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  trustScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.huge,
    backgroundColor: Colors.surface,
  },
  sectionPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.lg,
  },
  sectionPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },

  // Learning Paths
  pathsGrid: {
    gap: Spacing.lg,
  },
  pathCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  pathIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  pathTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.sm,
  },
  pathDesc: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  pathArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  pathArrowText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Live Batches
  batchScroll: {
    paddingRight: Spacing.xl,
    gap: Spacing.lg,
  },
  batchCard: {
    width: width * 0.8,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  batchHeader: {
    height: 140,
    justifyContent: 'flex-end',
    padding: Spacing.xl,
  },
  batchBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  batchBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  batchTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  batchContent: {
    padding: Spacing.xl,
  },
  batchSubtitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.md,
  },
  batchMeta: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.md,
  },
  batchMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batchMetaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  batchDesc: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  batchBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  batchBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
  },

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  featureItem: {
    width: (width - Spacing.xl * 2 - Spacing.lg) / 2,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  featureTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  featureDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Advanced AI Doubt Solver Section (Matching Website Screenshot 1:1)
  advDoubtContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 28,
    padding: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
    flexWrap: 'wrap',
    gap: Spacing.xl,
  },
  advDoubtLeft: {
    flex: 1,
    minWidth: 280,
    zIndex: 2,
  },
  advDoubtBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  advDoubtBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1.2,
  },
  advDoubtTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
    marginBottom: Spacing.md,
    letterSpacing: -0.8,
  },
  advDoubtDesc: {
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    maxWidth: 480,
  },
  advDoubtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4338CA',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 6,
  },
  advDoubtBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14.5,
  },

  // Right Visual & Floating Bubbles
  advDoubtVisual: {
    width: 290,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  dashedOrbitCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderStyle: 'dashed',
  },
  glowingCenterCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  floatingBubble: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bubblePhysics: {
    top: 10,
    right: 6,
  },
  bubbleStartup: {
    left: -10,
    top: '40%',
  },
  bubblePython: {
    bottom: 12,
    left: 4,
  },

  // Founder Quote
  quoteCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xxl + 4,
    padding: Spacing.xxl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
    overflow: 'hidden',
  },
  quoteAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '200%',
    backgroundColor: Colors.primary,
  },
  quoteSymbol: {
    fontSize: 48,
    color: Colors.primary,
    fontFamily: 'serif',
    fontWeight: FontWeight.bold,
    lineHeight: 50,
    marginBottom: Spacing.sm,
  },
  quoteText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
    lineHeight: 30,
    marginBottom: Spacing.xxl,
    letterSpacing: -0.3,
  },
  quoteAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quoteAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quoteAuthorName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
  },
  quoteAuthorRole: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 2,
  },

  // Bottom CTA
  bottomCTA: {
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  ctaSubtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },

  // Footer
  footer: {
    backgroundColor: '#1e293b',
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  footerContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
    marginBottom: 40,
  },
  footerCol: {
    minWidth: 180,
    flex: 1,
  },
  footerBrandCol: {
    minWidth: 260,
    maxWidth: 320,
    flex: 1.2,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  footerBrandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  footerBrandDesc: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  appBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  footerColTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  footerLinkList: {
    gap: 13,
  },
  footerLinkItemText: {
    color: '#cbd5e1',
    fontSize: 14.5,
    lineHeight: 22,
  },
  hiringBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hiringBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  footerSocialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
  },
  footerCircleSocialBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  footerCopy: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footerLegalRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  footerLegalText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
