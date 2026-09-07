/**
 * Student Dashboard Screen — Tech Indro
 * Personalized learning hub with streaks, progress, enrolled courses, and achievements
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import ThemeToggleBtn from '@/components/ThemeToggleBtn';
import NotificationBell from '@/components/NotificationBell';

const AVATAR_OPTIONS = [
  { id: 'code-slash', label: 'Developer', color: '#4F46E5', bg: '#4F46E522' },
  { id: 'rocket', label: 'Space Hacker', color: '#38BDF8', bg: '#38BDF822' },
  { id: 'flash', label: 'Prodigy', color: '#F59E0B', bg: '#F59E0B22' },
  { id: 'hardware-chip', label: 'AI Engineer', color: '#10B981', bg: '#10B98122' },
  { id: 'school', label: 'Scholar', color: '#8B5CF6', bg: '#8B5CF622' },
  { id: 'shield-checkmark', label: 'Cyber Ninja', color: '#EC4899', bg: '#EC489922' },
];

interface DailyMission {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  route: string;
  icon: string;
}

const INITIAL_MISSIONS: DailyMission[] = [
  { id: '1', title: 'Solve 3 GATE / ISRO Quiz Questions', xp: 50, completed: false, route: '/quiz', icon: 'school' },
  { id: '2', title: 'Ask AI Shikshak a Coding Doubt', xp: 25, completed: false, route: '/ai-mentor', icon: 'chatbubbles' },
  { id: '3', title: 'Launch Thrusters in ISRO Space Lab', xp: 30, completed: true, route: '/isro-lab', icon: 'rocket' },
  { id: '4', title: 'Flip 3 Flashcards in Revision Hub', xp: 20, completed: false, route: '/bookmarks', icon: 'bookmark' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [userName, setUserName] = useState('Indro Scholar');
  const [userEmail, setUserEmail] = useState('student@techindro.com');
  const [collegeName, setCollegeName] = useState('IIT BHU / AKTU');
  const [targetGoal, setTargetGoal] = useState('SIH 2026 Winner');
  const [avatarIcon, setAvatarIcon] = useState('code-slash');
  const [userXp, setUserXp] = useState(2450);

  // 3-Dot Menu State
  const [menuVisible, setMenuVisible] = useState(false);

  // Profile Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempCollege, setTempCollege] = useState(collegeName);
  const [tempGoal, setTempGoal] = useState(targetGoal);
  const [tempAvatar, setTempAvatar] = useState(avatarIcon);

  // Daily Missions
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = (await AsyncStorage.getItem('@tech_indro_user')) || (await AsyncStorage.getItem('user'));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        }

        const profileData = await AsyncStorage.getItem('@tech_indro_user_profile');
        if (profileData) {
          const prof = JSON.parse(profileData);
          if (prof.college) setCollegeName(prof.college);
          if (prof.goal) setTargetGoal(prof.goal);
          if (prof.avatar) setAvatarIcon(prof.avatar);
          if (prof.name) setUserName(prof.name);
        }

        const savedXp = await AsyncStorage.getItem('@user_indro_xp');
        if (savedXp) {
          setUserXp(parseInt(savedXp, 10));
        }

        const savedMissions = await AsyncStorage.getItem('@daily_missions_state');
        if (savedMissions) {
          setMissions(JSON.parse(savedMissions));
        }
      } catch (e) {
        // ignore
      }
    }
    loadUser();
  }, []);

  const openEditModal = () => {
    setTempName(userName);
    setTempCollege(collegeName);
    setTempGoal(targetGoal);
    setTempAvatar(avatarIcon);
    setEditModalVisible(true);
  };

  const saveProfile = async () => {
    try {
      const cleanName = (tempName || userName || 'Indro Scholar').trim().slice(0, 50);
      const cleanCollege = (tempCollege || collegeName || 'IIT BHU / AKTU').trim().slice(0, 80);
      const cleanGoal = (tempGoal || targetGoal || 'SIH 2026 Winner').trim().slice(0, 80);
      const cleanAvatar = tempAvatar || avatarIcon || 'code-slash';

      const updatedProfile = {
        name: cleanName,
        college: cleanCollege,
        goal: cleanGoal,
        avatar: cleanAvatar,
      };
      setUserName(cleanName);
      setCollegeName(cleanCollege);
      setTargetGoal(cleanGoal);
      setAvatarIcon(cleanAvatar);
      await AsyncStorage.setItem('@tech_indro_user_profile', JSON.stringify(updatedProfile));
      setEditModalVisible(false);
    } catch {
      setEditModalVisible(false);
    }
  };

  const toggleMission = async (missionId: string) => {
    const updated = missions.map((m) => {
      if (m.id === missionId) {
        const nextState = !m.completed;
        const xpDelta = nextState ? m.xp : -m.xp;
        const newTotalXp = Math.max(0, userXp + xpDelta);
        setUserXp(newTotalXp);
        AsyncStorage.setItem('@user_indro_xp', newTotalXp.toString());
        return { ...m, completed: nextState };
      }
      return m;
    });

    setMissions(updated);
    await AsyncStorage.setItem('@daily_missions_state', JSON.stringify(updated));
  };

  // Lesson Player State
  const [activeLessonCourse, setActiveLessonCourse] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [activeLessonTab, setActiveLessonTab] = useState<'notes' | 'code'>('notes');

  const openLessonPlayer = (course: any) => {
    setActiveLessonCourse(course);
    setIsPlaying(false);
  };

  const completeCurrentLesson = async () => {
    if (!activeLessonCourse) return;
    const updated = enrolledCourses.map((c) => {
      if (c.id === activeLessonCourse.id) {
        const nextDone = Math.min(c.totalLessons, c.lessonsDone + 1);
        const nextProg = Math.round((nextDone / c.totalLessons) * 100);
        return {
          ...c,
          lessonsDone: nextDone,
          progress: nextProg,
          nextTopic:
            nextDone === c.totalLessons
              ? 'Course Completed! Verified Certificate Ready 🎓'
              : `Module ${Math.floor(nextDone / 4) + 1}: Advanced Industry Architecture`,
        };
      }
      return c;
    });
    setEnrolledCourses(updated);
    await AsyncStorage.setItem('@enrolled_courses', JSON.stringify(updated));

    const newXp = userXp + 25;
    setUserXp(newXp);
    await AsyncStorage.setItem('@user_indro_xp', newXp.toString());

    Alert.alert(
      '🎉 Lesson Completed!',
      'Great work! You earned +25 Indro XP and pushed your course progress forward.',
      [{ text: 'Great!', onPress: () => setActiveLessonCourse(null) }]
    );
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Kya aap sach me logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@tech_indro_user');
          await AsyncStorage.removeItem('user');
          router.replace('/login');
        },
      },
    ]);
  };

  const DEFAULT_COURSES = [
    {
      id: 'fullstack',
      title: 'Full Stack Web & AI Engineering',
      progress: 68,
      lessonsDone: 24,
      totalLessons: 36,
      nextTopic: 'Building Full Stack Gemini Chatbot',
      icon: 'code-slash',
    },
    {
      id: 'robotics',
      title: 'ISRO Space Robotics & Microcontrollers',
      progress: 35,
      lessonsDone: 7,
      totalLessons: 20,
      nextTopic: 'Rover Kinematics in ROS 2',
      icon: 'hardware-chip',
    },
  ];

  const [enrolledCourses, setEnrolledCourses] = useState(DEFAULT_COURSES);

  useEffect(() => {
    async function loadEnrolled() {
      try {
        const stored = await AsyncStorage.getItem('@enrolled_courses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // merge without duplicates
            const combined = [...parsed];
            DEFAULT_COURSES.forEach((dc) => {
              if (!combined.some((c) => c.id === dc.id)) {
                combined.push(dc);
              }
            });
            setEnrolledCourses(combined);
          }
        }
      } catch {
        // ignore
      }
    }
    loadEnrolled();
  }, []);

  const ACHIEVEMENTS = [
    { id: '1', title: '7-Day Streak', icon: 'flame', color: '#EF4444', desc: 'Code daily without break' },
    { id: '2', title: 'Top 5% Quizzer', icon: 'trophy', color: '#FFD700', desc: 'Scored 90%+ in 5 quizzes' },
    { id: '3', title: 'Lab Hacker', icon: 'rocket', color: '#3B82F6', desc: 'Ran 25+ simulations' },
    { id: '4', title: 'Prompt Master', icon: 'sparkles', color: '#8B5CF6', desc: 'AI Mentor collaborator' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { maxWidth: 960, width: '100%', alignSelf: 'center' }]}>
        {/* Top Branding Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, marginBottom: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image
              source={require('@/assets/images/tech-indro-logo.png')}
              style={{ width: 130, height: 32 }}
              resizeMode="contain"
            />
            <View style={{ backgroundColor: colors.primaryDark + '33', paddingHorizontal: 7, paddingVertical: 2, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: colors.primary + '44' }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 }}>LEARNER HUB</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <NotificationBell unreadCount={3} />
            <ThemeToggleBtn />
            <TouchableOpacity style={[styles.menuDotBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={openEditModal}>
            <Ionicons name={(avatarIcon || 'code-slash') as any} size={28} color="#fff" />
            <View style={[styles.editAvatarBadge, { borderColor: colors.card }]}>
              <Ionicons name="pencil" size={10} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
              <TouchableOpacity onPress={openEditModal} style={{ padding: 2 }}>
                <Ionicons name="create-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* College & Goal Badges */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 3 }}>
              <View style={[styles.collegePill, { backgroundColor: isDark ? '#1e3a8a33' : '#dbeafe', borderColor: isDark ? '#3b82f644' : '#93c5fd' }]}>
                <Ionicons name="business-outline" size={11} color={isDark ? '#60a5fa' : '#1d4ed8'} />
                <Text style={[styles.collegePillText, { color: isDark ? '#60a5fa' : '#1d4ed8' }]}>{collegeName}</Text>
              </View>
              <View style={[styles.goalPill, { backgroundColor: isDark ? '#4c1d9533' : '#ede9fe', borderColor: isDark ? '#8b5cf644' : '#c4b5fd' }]}>
                <Text style={[styles.goalPillText, { color: isDark ? '#a78bfa' : '#6d28d9' }]}>{targetGoal}</Text>
              </View>
            </View>

            <Text style={[styles.userTier, { color: colors.primary }]}>
              Level {Math.floor(userXp / 500) + 1} Developer • {userXp.toLocaleString()} XP
            </Text>
          </View>
        </View>

        {/* Streak & XP Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconBadge, { backgroundColor: '#EF444422' }]}>
              <Ionicons name="flame" size={24} color="#EF4444" />
            </View>
            <View>
              <Text style={[styles.statVal, { color: colors.text }]}>7 Days</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Current Streak</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconBadge, { backgroundColor: '#FFD70022' }]}>
              <Ionicons name="flash" size={24} color="#FFD700" />
            </View>
            <View>
              <Text style={[styles.statVal, { color: colors.text }]}>{userXp.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Indro XP</Text>
            </View>
          </View>
        </View>

        {/* Daily Missions & XP Booster Widget */}
        <View style={[styles.missionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.missionsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="trophy" size={18} color="#FFD700" />
              <Text style={[styles.missionsTitle, { color: colors.text }]}>Daily Missions</Text>
              <View style={styles.xpBonusBadge}>
                <Text style={styles.xpBonusText}>+125 XP</Text>
              </View>
            </View>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {missions.filter((m) => m.completed).length}/{missions.length} Done
            </Text>
          </View>

          {missions.map((mission) => (
            <View key={mission.id} style={[styles.missionRow, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.checkbox, { borderColor: colors.textMuted }, mission.completed && styles.checkboxActive]}
                onPress={() => toggleMission(mission.id)}
              >
                {mission.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => router.push(mission.route as any)}
              >
                <Text
                  style={[
                    styles.missionText,
                    { color: colors.text },
                    mission.completed && { textDecorationLine: 'line-through', opacity: 0.6 },
                  ]}
                >
                  {mission.title}
                </Text>
              </TouchableOpacity>

              <View style={styles.missionXpTag}>
                <Text style={styles.missionXpText}>+{mission.xp} XP</Text>
              </View>
            </View>
          ))}
        </View>



        {/* AI Developer Resume & Portfolio Banner */}
        <TouchableOpacity
          style={[styles.courseCard, { backgroundColor: isDark ? '#8B5CF618' : '#F5F3FF', borderColor: isDark ? '#8B5CF655' : '#DDD6FE' }]}
          activeOpacity={0.9}
          onPress={() => router.push('/portfolio')}
        >
          <View style={styles.courseCardTop}>
            <View style={[styles.courseIconBox, { backgroundColor: '#8B5CF622' }]}>
              <Ionicons name="document-text" size={24} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>AI Resume & Portfolio Builder</Text>
                <View style={{ backgroundColor: '#8B5CF633', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#8B5CF6' }}>NEW</Text>
                </View>
              </View>
              <Text style={[styles.courseProgressText, { color: colors.textMuted }]}>
                Auto-generate ATS-ready resume from your lab projects & certificates
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(139,92,246,0.2)', paddingTop: Spacing.sm }}>
            <Text style={{ fontSize: 10, color: colors.textMuted }}>ATS Score: 94/100 • Export PDF</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#8B5CF6' }}>Open Builder</Text>
              <Ionicons name="arrow-forward" size={14} color="#8B5CF6" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Saved Notes & Flashcards Banner */}
        <TouchableOpacity
          style={[styles.courseCard, { backgroundColor: isDark ? '#10B98118' : '#ECFDF5', borderColor: isDark ? '#10B98155' : '#A7F3D0' }]}
          activeOpacity={0.9}
          onPress={() => router.push('/bookmarks')}
        >
          <View style={styles.courseCardTop}>
            <View style={[styles.courseIconBox, { backgroundColor: '#10B98122' }]}>
              <Ionicons name="bookmark" size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>Saved Notes & Bookmarks</Text>
                <View style={{ backgroundColor: '#10B98133', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#10B981' }}>FLASHCARDS</Text>
                </View>
              </View>
              <Text style={[styles.courseProgressText, { color: colors.textMuted }]}>
                Offline revision cards, tricky quiz questions & formulas
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(16,185,129,0.2)', paddingTop: Spacing.sm }}>
            <Text style={{ fontSize: 10, color: colors.textMuted }}>4 Saved Items • Quick Flip Mode</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#10B981' }}>Start Revision</Text>
              <Ionicons name="arrow-forward" size={14} color="#10B981" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Help & Community Hub Banner */}
        <TouchableOpacity
          style={[styles.courseCard, { backgroundColor: isDark ? '#05966918' : '#F0FDF4', borderColor: isDark ? '#05966955' : '#BBF7D0' }]}
          activeOpacity={0.9}
          onPress={() => router.push('/support')}
        >
          <View style={styles.courseCardTop}>
            <View style={[styles.courseIconBox, { backgroundColor: '#05966922' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>24/7 WhatsApp Mentors & Community</Text>
                <View style={{ backgroundColor: '#05966933', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#059669' }}>ONLINE</Text>
                </View>
              </View>
              <Text style={[styles.courseProgressText, { color: colors.textMuted }]}>
                Direct mentor chat, Discord server & 25K+ student groups
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(5,150,105,0.2)', paddingTop: Spacing.sm }}>
            <Text style={{ fontSize: 10, color: colors.textMuted }}>Avg Reply: &lt; 5 mins • FAQ Solutions</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#059669' }}>Get Help</Text>
              <Ionicons name="arrow-forward" size={14} color="#059669" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enrolled Courses */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>My Active Courses</Text>
          <TouchableOpacity onPress={() => router.push('/programs')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Browse All</Text>
          </TouchableOpacity>
        </View>

        {enrolledCourses.map((course) => (
          <View key={course.id} style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.courseCardTop}>
              <View style={[styles.courseIconBox, { backgroundColor: colors.primaryDark }]}>
                <Ionicons name={(course.icon || 'code-slash') as any} size={22} color={colors.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                <Text style={[styles.courseProgressText, { color: colors.textMuted }]}>
                  {course.lessonsDone}/{course.totalLessons} Lessons ({course.progress}%)
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={[styles.courseProgressBarBg, { backgroundColor: isDark ? colors.surfaceAlt : '#E2E8F0' }]}>
              <View
                style={[styles.courseProgressBarFill, { width: `${course.progress}%`, backgroundColor: colors.primary }]}
              />
            </View>

            <View style={styles.nextTopicRow}>
              <Text style={[styles.nextTopicLabel, { color: colors.textMuted }]}>Up Next:</Text>
              <Text style={[styles.nextTopicVal, { color: colors.textSecondary }]} numberOfLines={1}>
                {course.nextTopic}
              </Text>
              <TouchableOpacity
                style={[styles.continueBtn, { backgroundColor: colors.primary }]}
                onPress={() => openLessonPlayer(course)}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.continueBtn, { backgroundColor: '#8B1E2D', marginLeft: 6 }]}
                onPress={() =>
                  router.push({
                    pathname: '/certificate',
                    params: {
                      courseName: course.title,
                      studentName: userName,
                      certId: `TI-${course.id.toUpperCase()}-2026`,
                    },
                  })
                }
              >
                <Ionicons name="ribbon-outline" size={13} color="#FFF" style={{ marginRight: 3 }} />
                <Text style={styles.continueBtnText}>Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Verified Certificates */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Verified Credentials & Honors</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/certificate',
                params: {
                  courseName: 'Full Stack Web & AI Engineering',
                  studentName: userName,
                  certId: 'TI-FSW-2026',
                },
              })
            }
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View Credential</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.courseCard, { borderColor: '#8B1E2D', backgroundColor: isDark ? '#8B1E2D18' : '#FFF5F6' }]}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/certificate',
              params: {
                courseName: 'Full Stack Web & AI Engineering',
                studentName: userName,
                certId: 'TI-FSW-2026',
              },
            })
          }
        >
          <View style={styles.courseCardTop}>
            <View style={[styles.courseIconBox, { backgroundColor: '#8B1E2D22' }]}>
              <Ionicons name="ribbon" size={24} color="#8B1E2D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.courseTitle, { color: colors.text }]}>Full Stack Web & AI Engineering</Text>
              <Text style={[styles.courseProgressText, { color: '#8B1E2D', fontWeight: 'bold' }]}>
                Grade A+ (Distinction) • Verified Official Credential
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(139,30,45,0.2)', paddingTop: Spacing.sm }}>
            <Text style={{ fontSize: 10, color: colors.textMuted }}>ID: TI-FSW-2026 • Verified Credential</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#8B1E2D' }}>View & Download</Text>
              <Ionicons name="arrow-forward" size={14} color="#8B1E2D" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Badges & Achievements */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Unlocked Badges</Text>
        <View style={styles.badgesGrid}>
          {ACHIEVEMENTS.map((item) => (
            <View key={item.id} style={[styles.badgeItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.badgeCircle, { backgroundColor: item.color + '22' }]}>
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              </View>
              <Text style={[styles.badgeItemTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.badgeItemDesc, { color: colors.textMuted }]}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 3-Dot Feature Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Menu Header */}
            <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.menuHeaderTitle, { color: colors.text }]}>All Features</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.menuGrid} showsVerticalScrollIndicator={false}>
              {[
                { icon: 'home', label: 'Home', color: '#6366F1', route: '/' },
                { icon: 'book', label: 'Programs', color: '#EC4899', route: '/programs' },
                { icon: 'sparkles', label: 'AI Shikshak', color: '#FF6B35', route: '/ai-mentor' },
                { icon: 'school', label: 'Test Series', color: '#10B981', route: '/quiz' },
                { icon: 'terminal', label: 'Code Lab', color: '#3B82F6', route: '/indrolabs' },
                { icon: 'rocket', label: 'ISRO Lab', color: '#38BDF8', route: '/isro-lab' },
                { icon: 'people', label: 'TSOC', color: '#F97316', route: '/tsoc' },
                { icon: 'podium', label: 'Leaderboard', color: '#F59E0B', route: '/leaderboard' },
                { icon: 'construct', label: 'AI Tools', color: '#8B5CF6', route: '/ai-tools' },
                { icon: 'bookmark', label: 'Bookmarks', color: '#10B981', route: '/bookmarks' },
                { icon: 'ribbon', label: 'Certificates', color: '#D97706', route: '/certificate' },
                { icon: 'document-text', label: 'Portfolio', color: '#8B5CF6', route: '/portfolio' },
                { icon: 'help-circle', label: 'Support', color: '#059669', route: '/support' },
                { icon: 'person-circle', label: 'Edit Profile', color: '#6366F1', route: '__profile__' },
                { icon: 'log-out-outline', label: 'Logout', color: '#EF4444', route: '__logout__' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, { backgroundColor: isDark ? colors.surfaceAlt : '#F8FAFC', borderColor: colors.border }]}
                  onPress={() => {
                    setMenuVisible(false);
                    if (item.route === '__profile__') {
                      openEditModal();
                    } else if (item.route === '__logout__') {
                      handleLogout();
                    } else {
                      router.push(item.route as any);
                    }
                  }}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: item.color + '1A' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Customize Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Avatar Selector */}
            <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Choose Avatar Persona</Text>
            <View style={styles.avatarSelectorRow}>
              {AVATAR_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.avatarChoiceBtn,
                    { backgroundColor: tempAvatar === opt.id ? opt.bg : (isDark ? colors.surfaceAlt : '#F8FAFC'), borderColor: tempAvatar === opt.id ? colors.primary : colors.border },
                  ]}
                  onPress={() => setTempAvatar(opt.id)}
                >
                  <Ionicons name={opt.id as any} size={22} color={opt.color} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Input */}
            <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: isDark ? colors.surfaceAlt : '#F8FAFC', borderColor: colors.border, color: colors.text }]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="e.g. Vikram Sharma"
              placeholderTextColor={colors.textMuted}
              maxLength={50}
            />

            {/* College Input */}
            <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>College / University</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: isDark ? colors.surfaceAlt : '#F8FAFC', borderColor: colors.border, color: colors.text }]}
              value={tempCollege}
              onChangeText={setTempCollege}
              placeholder="e.g. IIT BHU / AKTU Lucknow"
              placeholderTextColor={colors.textMuted}
              maxLength={80}
            />

            {/* Target Goal Input */}
            <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>Target Ambition / Exam</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: isDark ? colors.surfaceAlt : '#F8FAFC', borderColor: colors.border, color: colors.text }]}
              value={tempGoal}
              onChangeText={setTempGoal}
              placeholder="e.g. Smart India Hackathon 2026 Winner"
              placeholderTextColor={colors.textMuted}
              maxLength={80}
            />

            {/* Actions */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]} onPress={saveProfile}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Interactive Course Lesson Player Modal */}
      <Modal visible={!!activeLessonCourse} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border, maxHeight: '92%', padding: 0, overflow: 'hidden' }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 0 }]}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="play-circle" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.primary }}>
                    LESSON {activeLessonCourse?.lessonsDone ? activeLessonCourse.lessonsDone + 1 : 1} OF {activeLessonCourse?.totalLessons || 36}
                  </Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.text, fontSize: FontSize.md, marginTop: 2 }]} numberOfLines={1}>
                  {activeLessonCourse?.nextTopic || 'Interactive Core Module'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setActiveLessonCourse(null)} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
              {/* Video Player Simulated Screen */}
              <View style={styles.playerScreen}>
                <View style={styles.videoBadgeRow}>
                  <View style={styles.liveTag}>
                    <Text style={styles.liveTagText}>1080p HD</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.speedBtn}
                    onPress={() => {
                      const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                    }}
                  >
                    <Text style={styles.speedBtnText}>{playbackSpeed}</Text>
                  </TouchableOpacity>
                </View>

                {/* Center Play Button */}
                <TouchableOpacity
                  style={[styles.playBigCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                  onPress={() => setIsPlaying(!isPlaying)}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color="#fff"
                    style={{ marginLeft: isPlaying ? 0 : 4 }}
                  />
                </TouchableOpacity>

                {/* Video HUD Timeline */}
                <View style={styles.videoHud}>
                  <View style={styles.timelineBarBg}>
                    <View style={[styles.timelineBarFill, { width: isPlaying ? '58%' : '35%', backgroundColor: colors.primary }]} />
                  </View>
                  <View style={styles.timelineTimes}>
                    <Text style={[styles.timelineTimeText, { color: colors.textMuted }]}>{isPlaying ? '06:42' : '04:15'}</Text>
                    <Text style={[styles.timelineTimeText, { color: colors.textMuted }]}>12:30</Text>
                  </View>
                </View>
              </View>

              {/* Player Audio/Sub Controls */}
              <View style={styles.playerControlsRow}>
                <View style={[styles.trackPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="volume-high-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.trackPillText, { color: colors.textSecondary }]}>Hindi + EN Audio</Text>
                </View>
                <View style={[styles.trackPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="text-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.trackPillText, { color: colors.textSecondary }]}>Subtitles</Text>
                </View>
                <TouchableOpacity
                  style={[styles.trackPill, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push('/indrolabs')}
                >
                  <Ionicons name="terminal-outline" size={14} color="#3B82F6" />
                  <Text style={[styles.trackPillText, { color: '#60A5FA' }]}>Sandbox</Text>
                </TouchableOpacity>
              </View>

              {/* Tabs: Notes vs Code */}
              <View style={[styles.lessonTabSwitchRow, { backgroundColor: isDark ? colors.surfaceAlt : '#F1F5F9', borderColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.lessonTabBtn, activeLessonTab === 'notes' && [styles.lessonTabBtnActive, { backgroundColor: colors.primary }]]}
                  onPress={() => setActiveLessonTab('notes')}
                >
                  <Ionicons
                    name="book-outline"
                    size={14}
                    color={activeLessonTab === 'notes' ? '#fff' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.lessonTabBtnText,
                      { color: colors.textMuted },
                      activeLessonTab === 'notes' && styles.lessonTabBtnTextActive,
                    ]}
                  >
                    Concepts & Notes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.lessonTabBtn, activeLessonTab === 'code' && [styles.lessonTabBtnActive, { backgroundColor: colors.primary }]]}
                  onPress={() => setActiveLessonTab('code')}
                >
                  <Ionicons
                    name="code-slash-outline"
                    size={14}
                    color={activeLessonTab === 'code' ? '#fff' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.lessonTabBtnText,
                      { color: colors.textMuted },
                      activeLessonTab === 'code' && styles.lessonTabBtnTextActive,
                    ]}
                  >
                    Code Snippet
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              {activeLessonTab === 'notes' ? (
                <View style={[styles.lessonNotesBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.lessonNotesHeading, { color: colors.text }]}>Core Takeaways:</Text>
                  <Text style={[styles.lessonNotesBullet, { color: colors.textSecondary }]}>
                    • Integrating streaming AI responses using Gemini 1.5 Pro and Google GenAI SDK.
                  </Text>
                  <Text style={[styles.lessonNotesBullet, { color: colors.textSecondary }]}>
                    • Multi-turn chat session management with state preservation.
                  </Text>
                  <Text style={[styles.lessonNotesBullet, { color: colors.textSecondary }]}>
                    • Speech-to-text audio pipeline for multilingual voice prompts.
                  </Text>
                </View>
              ) : (
                <View style={styles.codeSnippetBox}>
                  <Text style={styles.codeSnippetText}>
                    {`// Streaming Gemini AI Response\nconst chatSession = model.startChat({\n  generationConfig: { temperature: 0.7 },\n  history: conversationHistory,\n});\nconst result = await chatSession.sendMessage(prompt);\nconsole.log(result.response.text());`}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
                <TouchableOpacity
                  style={styles.completeLessonBtn}
                  onPress={completeCurrentLesson}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.completeLessonBtnText}>Mark Complete & Earn +25 XP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.askAiLessonBtn, { backgroundColor: colors.card, borderColor: colors.primary }]}
                  onPress={() => {
                    setActiveLessonCourse(null);
                    router.push('/ai-mentor');
                  }}
                >
                  <Ionicons name="sparkles" size={16} color={colors.primary} />
                  <Text style={[styles.askAiLessonBtnText, { color: colors.primary }]}>Ask AI Shikshak about this Lesson</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  userName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  proBadge: {
    backgroundColor: '#FFD70033',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#FFD700',
  },
  userEmail: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  userTier: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  logoutBtn: {
    padding: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  sectionHeader: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    fontWeight: FontWeight.semibold,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  quickText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  courseCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  courseCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  courseIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  courseProgressText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  courseProgressBarBg: {
    height: 6,
    backgroundColor: Colors.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  courseProgressBarFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  nextTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextTopicLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  nextTopicVal: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  continueBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeItem: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  badgeItemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  badgeItemDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  collegePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B82F622',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#3B82F644',
  },
  collegePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#60A5FA',
  },
  goalPill: {
    backgroundColor: '#8B5CF622',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#8B5CF644',
  },
  goalPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A78BFA',
  },
  missionsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  missionsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  xpBonusBadge: {
    backgroundColor: '#FFD70022',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#FFD70055',
  },
  xpBonusText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  missionText: {
    fontSize: FontSize.xs,
    color: Colors.text,
    fontWeight: '500',
  },
  missionXpTag: {
    backgroundColor: '#10B9811A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  missionXpText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  modalInputLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    color: Colors.text,
    fontSize: FontSize.sm,
  },
  avatarSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  avatarChoiceBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarChoiceSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDark + '44',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalCancelBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  playerScreen: {
    height: 185,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  videoBadgeRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveTag: {
    backgroundColor: 'rgba(239,68,68,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  speedBtn: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#475569',
  },
  speedBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  playBigCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  videoHud: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
  },
  timelineBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  timelineBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  timelineTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineTimeText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  playerControlsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  trackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  trackPillText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  lessonTabSwitchRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  lessonTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  lessonTabBtnActive: {
    backgroundColor: Colors.primary,
  },
  lessonTabBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  lessonTabBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lessonNotesBox: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  lessonNotesHeading: {
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  lessonNotesBullet: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  codeSnippetBox: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeSnippetText: {
    fontFamily: 'monospace',
    fontSize: 10.5,
    color: '#38BDF8',
    lineHeight: 16,
  },
  completeLessonBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    elevation: 3,
  },
  completeLessonBtnText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: '#fff',
  },
  askAiLessonBtn: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  askAiLessonBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
  // 3-Dot Menu Styles
  menuDotBtn: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  menuContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuHeaderTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  menuItemLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
});
