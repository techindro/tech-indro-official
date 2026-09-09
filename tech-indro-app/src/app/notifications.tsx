/**
 * In-App Notification Center & Daily Streak Reminders — Tech Indro
 * Manages daily streak alerts, live announcements, course updates,
 * and automated practice reminder toggles.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

interface NotificationItem {
  id: string;
  category: 'streak' | 'course' | 'announcement';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionText?: string;
  actionRoute?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    category: 'streak',
    title: '🔥 Keep Your 7-Day Streak Alive!',
    message: 'You have only 4 hours left today to complete your Daily Coding Assessment and preserve your 2,450 XP bonus.',
    time: '2 hours ago',
    isRead: false,
    actionText: 'Solve Daily Quiz',
    actionRoute: '/quiz',
    icon: 'flame',
    iconColor: '#EF4444',
  },
  {
    id: '2',
    category: 'course',
    title: 'Module 3 Live: Gemini Multi-Agent Pipelines',
    message: 'New lab exercise uploaded in Full Stack AI Engineering. Test your code in the IndroLabs runtime.',
    time: '5 hours ago',
    isRead: false,
    actionText: 'Open IndroLabs',
    actionRoute: '/indrolabs',
    icon: 'code-working',
    iconColor: '#8B5CF6',
  },
  {
    id: '3',
    category: 'announcement',
    title: '🚀 TSOC 2026 Fellowship Applications Closing',
    message: 'Over 1,200 developers have applied. Submit your GitHub portfolio before April 10 to qualify for ₹50K stipend.',
    time: 'Yesterday',
    isRead: false,
    actionText: 'Apply for TSOC',
    actionRoute: '/tsoc',
    icon: 'rocket',
    iconColor: '#F59E0B',
  },
  {
    id: '4',
    category: 'streak',
    title: '🏆 Achievement Unlocked: Top 5% Quizzer',
    message: 'Congratulations! Your score in the GATE Robotics test placed you on the National Podium.',
    time: '2 days ago',
    isRead: true,
    actionText: 'View Leaderboard',
    actionRoute: '/leaderboard',
    icon: 'trophy',
    iconColor: '#FFD700',
  },
  {
    id: '5',
    category: 'course',
    title: 'ISRO Space Lab Telemetry Updated',
    message: 'Aditya-L1 halo orbit trajectory simulation now available with live solar flare sensor parameters.',
    time: '3 days ago',
    isRead: true,
    actionText: 'Launch Space Lab',
    actionRoute: '/isro-lab',
    icon: 'planet',
    iconColor: '#38BDF8',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'streak' | 'course' | 'announcement'>('all');

  // Reminder Preferences Toggles
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakFreezeAlert, setStreakFreezeAlert] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    Alert.alert('All Marked as Read', 'All notifications have been updated.');
  };

  const handleActionClick = (item: NotificationItem) => {
    // mark this item read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item.actionRoute) {
      router.push(item.actionRoute as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Top Bar */}
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
        <Text style={[styles.topBarTitle, { color: colors.text }]}>Notifications</Text>

        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark Read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Daily Streak Reminders Control Banner */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingsHeader}>
            <Ionicons name="notifications-outline" size={20} color={colors.primaryLight} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Daily Alert Preferences</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Daily Practice Reminder (8:00 PM)</Text>
              <Text style={styles.switchDesc}>Never break your problem solving habit</Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#334155', true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchDivider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Streak Freeze Emergency Alert</Text>
              <Text style={styles.switchDesc}>Notifies you 2 hours before midnight if inactive</Text>
            </View>
            <Switch
              value={streakFreezeAlert}
              onValueChange={setStreakFreezeAlert}
              trackColor={{ false: '#334155', true: '#EF4444' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'streak', 'course', 'announcement'] as const).map((tab) => {
            const active = activeTab === tab;
            const label =
              tab === 'all'
                ? `All (${notifications.length})`
                : tab === 'streak'
                ? '🔥 Streaks'
                : tab === 'course'
                ? '📚 Courses'
                : '📢 TSOC & News';

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  active && { backgroundColor: colors.primary, borderColor: colors.primaryLight },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: colors.textMuted },
                    active && { color: '#fff', fontWeight: 'bold' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Notifications List */}
        <View style={styles.list}>
          {filteredNotifications.map((item) => (
            <View
              key={item.id}
              style={[
                styles.notifCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                !item.isRead && styles.unreadCard,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconCircle, { backgroundColor: item.iconColor + '22' }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, { color: colors.text }]}>{item.title}</Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
              </View>

              <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>
                {item.message}
              </Text>

              {item.actionText && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleActionClick(item)}
                  >
                    <Text style={styles.actionBtnText}>{item.actionText}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
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
  markReadBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  markReadText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    fontWeight: FontWeight.bold,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  settingsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  settingsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  switchDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  switchDivider: {
    height: 1,
    backgroundColor: '#33415533',
    marginVertical: Spacing.sm,
  },
  filterScroll: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: FontSize.xs,
  },
  list: {
    gap: Spacing.md,
  },
  notifCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: 6,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  notifMessage: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#33415522',
    paddingTop: Spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
});
