import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export default function ParentPanelScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [whatsappReportEnabled, setWhatsappReportEnabled] = useState(true);
  const [examAlertsEnabled, setExamAlertsEnabled] = useState(true);
  const [lateNightAlertEnabled, setLateNightAlertEnabled] = useState(false);

  const handleCallMentor = () => {
    Linking.openURL('tel:+917898877688').catch(() => {
      Alert.alert('Helpline', 'Call our Academic Counselor at +91 78988 77688');
    });
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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Parent Oversight Panel</Text>
              <View style={styles.shieldPill}>
                <Ionicons name="shield-checkmark" size={10} color="#16a34a" />
                <Text style={styles.shieldPillText}>ACADEMIC SAFETY</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Monitor real-time student attendance, learning hours & mentor reports
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Student Profile Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.studentHeaderRow}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>RS</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.studentName, { color: colors.text }]}>Rahul Sharma</Text>
              <Text style={[styles.studentBatch, { color: '#ff6b35' }]}>
                MNC Cracker Batch: Full Stack + DSA
              </Text>
              <Text style={[styles.studentMeta, { color: colors.textMuted }]}>
                Enrollment ID: TI-2026-8841 • Mentor: Indranil Roy
              </Text>
            </View>
          </View>
        </View>

        {/* 4 Key Performance Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={20} color="#4f46e5" />
            <Text style={[styles.metricVal, { color: colors.text }]}>48.5 hrs</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Learning Hours</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="trending-up" size={12} color="#16a34a" />
              <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '700' }}>+14% this week</Text>
            </View>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={20} color="#10b981" />
            <Text style={[styles.metricVal, { color: colors.text }]}>96%</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Class Attendance</Text>
            <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '700' }}>14 Days Streak</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#ea580c" />
            <Text style={[styles.metricVal, { color: colors.text }]}>64 Solved</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Coding Problems</Text>
            <Text style={{ fontSize: 10, color: '#ea580c', fontWeight: '700' }}>92% Accuracy</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="ribbon-outline" size={20} color="#f59e0b" />
            <Text style={[styles.metricVal, { color: colors.text }]}>Top 5%</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Cohort Rank</Text>
            <Text style={{ fontSize: 10, color: '#f59e0b', fontWeight: '700' }}>Rank #18 / 420</Text>
          </View>
        </View>

        {/* Live Academic Activity Log */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Learning Timeline</Text>

          <View style={styles.logList}>
            <View style={styles.logItem}>
              <View style={[styles.logDot, { backgroundColor: '#10b981' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.logTitle, { color: colors.text }]}>
                  Completed Lesson 4: Binary Search Trees in C++
                </Text>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>Today, 3:30 PM • 45 mins session</Text>
              </View>
            </View>

            <View style={styles.logItem}>
              <View style={[styles.logDot, { backgroundColor: '#ea580c' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.logTitle, { color: colors.text }]}>
                  AI Shikshak Rohini Doubt Resolution Session
                </Text>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>Today, 1:15 PM • Solved DP Memoization flaw</Text>
              </View>
            </View>

            <View style={styles.logItem}>
              <View style={[styles.logDot, { backgroundColor: '#3b82f6' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.logTitle, { color: colors.text }]}>
                  Daily Byte Bug Hunt Cleared
                </Text>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>Yesterday, 9:20 PM • +50 IndroCoins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parental Notification Toggles */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Parent Notifications & Oversight</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Weekly WhatsApp Progress Report</Text>
              <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>
                Receive a summarized PDF of tests, hours and mentor feedback every Sunday.
              </Text>
            </View>
            <Switch
              value={whatsappReportEnabled}
              onValueChange={setWhatsappReportEnabled}
              trackColor={{ false: '#cbd5e1', true: '#ff6b35' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Assessment & Exam Alerts</Text>
              <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>
                Get instant notification when a mock interview or test series is graded.
              </Text>
            </View>
            <Switch
              value={examAlertsEnabled}
              onValueChange={setExamAlertsEnabled}
              trackColor={{ false: '#cbd5e1', true: '#ff6b35' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>Late-Night Coding Alert</Text>
              <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>
                Alert parents if active session continues past 1:00 AM.
              </Text>
            </View>
            <Switch
              value={lateNightAlertEnabled}
              onValueChange={setLateNightAlertEnabled}
              trackColor={{ false: '#cbd5e1', true: '#ff6b35' }}
            />
          </View>
        </View>

        {/* Request 1:1 Counselor Callback */}
        <TouchableOpacity
          style={styles.callBtn}
          onPress={handleCallMentor}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.callBtnGradient}
          >
            <Ionicons name="call" size={16} color="#ffffff" />
            <Text style={styles.callBtnText}>Request 1:1 Academic Counselor Callback</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shieldPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16a34a',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  studentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
  },
  studentBatch: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  studentMeta: {
    fontSize: 10.5,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  logList: {
    gap: 12,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  logTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 18,
  },
  logTime: {
    fontSize: 10.5,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,116,139,0.1)',
    gap: 12,
  },
  toggleTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  callBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  callBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
