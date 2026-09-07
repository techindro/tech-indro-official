/**
 * Leaderboard Screen — Tech Indro
 * Global and weekly developer rankings with top 3 podium, XP points, and badges
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type Period = 'all' | 'weekly' | 'monthly';

const TOP_USERS = [
  { rank: 1, name: 'Aarav Patel', college: 'IIT Bombay', xp: 14250, badge: 'Grandmaster', avatar: 'AP' },
  { rank: 2, name: 'Sneha Roy', college: 'BITS Pilani', xp: 12890, badge: 'Code Ninja', avatar: 'SR' },
  { rank: 3, name: 'Vikram Singh', college: 'DTU Delhi', xp: 11400, badge: 'Lab Veteran', avatar: 'VS' },
  { rank: 4, name: 'Ananya Iyer', college: 'NIT Trichy', xp: 9850, badge: 'Speedster', avatar: 'AI' },
  { rank: 5, name: 'Rohan Deshmukh', college: 'COEP Pune', xp: 8720, badge: 'Bug Hunter', avatar: 'RD' },
  { rank: 6, name: 'Pooja Verma', college: 'IIIT Hyderabad', xp: 7600, badge: 'AI Scholar', avatar: 'PV' },
  { rank: 7, name: 'Karan Mehra', college: 'VIT Vellore', xp: 6940, badge: 'Builder', avatar: 'KM' },
  { rank: 8, name: 'Divya Nair', college: 'CET Trivandrum', xp: 6120, badge: 'Explorer', avatar: 'DN' },
];

export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<Period>('weekly');

  const top1 = TOP_USERS[0];
  const top2 = TOP_USERS[1];
  const top3 = TOP_USERS[2];
  const restUsers = TOP_USERS.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
            <Image
              source={require('@/assets/images/tech-indro-logo.png')}
              style={{ width: 135, height: 32 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary + '44' }}>
              <Ionicons name="medal" size={13} color="#FFD700" />
              <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.primaryLight, letterSpacing: 0.5 }}>GLOBAL RANKS</Text>
            </View>
          </View>
          <Text style={styles.title}>Developer Leaderboard</Text>
          <Text style={styles.subtitle}>
            Compete, solve quizzes, and climb the developer tier!
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(['weekly', 'monthly', 'all'] as Period[]).map((p) => {
            const active = period === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, active && styles.periodBtnActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>
                  {p === 'weekly' ? 'This Week' : p === 'monthly' ? 'This Month' : 'All Time'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* Rank 2 - Silver */}
          <View style={[styles.podiumCol, { marginTop: 28 }]}>
            <View style={[styles.avatarBox, styles.silverBorder]}>
              <Text style={styles.avatarText}>{top2.avatar}</Text>
              <View style={[styles.podiumBadge, { backgroundColor: '#94A3B8' }]}>
                <Text style={styles.podiumBadgeText}>2</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top2.name}</Text>
            <Text style={styles.podiumXP}>{top2.xp} XP</Text>
            <View style={[styles.podiumStep, styles.stepSilver]}>
              <Ionicons name="medal" size={24} color="#94A3B8" />
            </View>
          </View>

          {/* Rank 1 - Gold */}
          <View style={styles.podiumCol}>
            <Ionicons name="trophy" size={28} color="#FFD700" style={{ marginBottom: 4 }} />
            <View style={[styles.avatarBox, styles.goldBorder]}>
              <Text style={styles.avatarText}>{top1.avatar}</Text>
              <View style={[styles.podiumBadge, { backgroundColor: '#FFD700' }]}>
                <Text style={[styles.podiumBadgeText, { color: '#000' }]}>1</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top1.name}</Text>
            <Text style={styles.podiumXP}>{top1.xp} XP</Text>
            <View style={[styles.podiumStep, styles.stepGold]}>
              <Ionicons name="ribbon" size={28} color="#FFD700" />
            </View>
          </View>

          {/* Rank 3 - Bronze */}
          <View style={[styles.podiumCol, { marginTop: 44 }]}>
            <View style={[styles.avatarBox, styles.bronzeBorder]}>
              <Text style={styles.avatarText}>{top3.avatar}</Text>
              <View style={[styles.podiumBadge, { backgroundColor: '#CD7F32' }]}>
                <Text style={styles.podiumBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3.name}</Text>
            <Text style={styles.podiumXP}>{top3.xp} XP</Text>
            <View style={[styles.podiumStep, styles.stepBronze]}>
              <Ionicons name="medal" size={22} color="#CD7F32" />
            </View>
          </View>
        </View>

        {/* Remaining Ranks List */}
        <Text style={styles.sectionTitle}>Global Rankings</Text>
        <View style={styles.rankList}>
          {restUsers.map((user) => (
            <View key={user.rank} style={styles.rankRow}>
              <Text style={styles.rankNumber}>#{user.rank}</Text>
              <View style={styles.smallAvatar}>
                <Text style={styles.smallAvatarText}>{user.avatar}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userCollege}>{user.college} • {user.badge}</Text>
              </View>
              <Text style={styles.userPoints}>{user.xp.toLocaleString()} XP</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky User Rank Banner */}
      <View style={styles.myRankBar}>
        <View style={styles.myRankLeft}>
          <Text style={styles.myRankNum}>#42</Text>
          <View>
            <Text style={styles.myRankTitle}>Aapki Current Rank</Text>
            <Text style={styles.myRankSubtitle}>Next tier: 250 XP to #41</Text>
          </View>
        </View>
        <Text style={styles.myRankPoints}>2,450 XP</Text>
      </View>
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
    paddingBottom: 90,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  badge: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#FFD700',
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  periodBtnActive: {
    backgroundColor: Colors.primary,
  },
  periodBtnText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  periodBtnTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  goldBorder: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  silverBorder: {
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  bronzeBorder: {
    borderWidth: 2,
    borderColor: '#CD7F32',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  podiumName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  podiumXP: {
    fontSize: 10,
    color: Colors.primaryLight,
    fontWeight: FontWeight.semibold,
    marginBottom: 6,
  },
  podiumStep: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  stepGold: {
    height: 80,
    backgroundColor: '#FFD70022',
    borderWidth: 1,
    borderColor: '#FFD70044',
  },
  stepSilver: {
    height: 60,
    backgroundColor: '#94A3B822',
    borderWidth: 1,
    borderColor: '#94A3B844',
  },
  stepBronze: {
    height: 46,
    backgroundColor: '#CD7F3222',
    borderWidth: 1,
    borderColor: '#CD7F3244',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  rankList: {
    gap: Spacing.xs,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  rankNumber: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    width: 28,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  userCollege: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  userPoints: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primaryLight,
  },
  myRankBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  myRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  myRankNum: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#FFD700',
  },
  myRankTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  myRankSubtitle: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  myRankPoints: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
