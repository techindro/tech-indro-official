/**
 * Code Clash: 1v1 Live Coding Arena — Tech Indro Mobile
 * Real-time algorithmic duels, AI bot sparring, IndroCoins rewards,
 * live execution scoreboard, and tier leaderboards.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Match Challenges
interface ClashChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  description: string;
  starterCode: string;
  testCases: { input: string; expected: string }[];
}

const SAMPLE_CHALLENGE: ClashChallenge = {
  id: 'clash-1',
  title: 'Valid Palindrome String',
  difficulty: 'Easy',
  timeLimit: 300,
  description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return true if s is a palindrome, or false otherwise.',
  starterCode: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
  testCases: [
    { input: '"A man, a plan, a canal: Panama"', expected: 'true' },
    { input: '"race a car"', expected: 'false' },
    { input: '" "', expected: 'true' },
  ],
};

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Aarav Sharma', rating: 2450, tier: 'Grandmaster', wins: 142, coins: 4850, avatar: '👨‍💻' },
  { rank: 2, name: 'Priya Verma', rating: 2310, tier: 'Master', wins: 118, coins: 3920, avatar: '👩‍💻' },
  { rank: 3, name: 'Vikram Patel', rating: 2190, tier: 'Diamond', wins: 94, coins: 3100, avatar: '🚀' },
  { rank: 4, name: 'Ananya Roy', rating: 2040, tier: 'Diamond', wins: 81, coins: 2650, avatar: '⚡' },
  { rank: 5, name: 'You (Oscar_Dev)', rating: 1890, tier: 'Platinum', wins: 56, coins: 1250, avatar: '🐕' },
];

export default function CodeClashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Screen Mode: 'lobby' | 'battle' | 'leaderboard'
  const [viewMode, setViewMode] = useState<'lobby' | 'battle' | 'leaderboard'>('lobby');

  // Battle State
  const [coins, setCoins] = useState<number>(1250);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>(SAMPLE_CHALLENGE.starterCode);
  const [selectedLanguage, setSelectedLanguage] = useState<'JavaScript' | 'Python' | 'C++'>('JavaScript');
  const [testsPassed, setTestsPassed] = useState<number>(0);
  const [rivalProgress, setRivalProgress] = useState<number>(0);
  const [matchResult, setMatchResult] = useState<'won' | 'lost' | null>(null);

  // Timer simulation during battle
  useEffect(() => {
    let timer: any = null;
    if (viewMode === 'battle' && isFighting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        // Simulate rival coding progress
        setRivalProgress((prev) => Math.min(3, prev + (Math.random() > 0.85 ? 1 : 0)));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [viewMode, isFighting, timeLeft]);

  const startDuel = (mode: string) => {
    setTimeLeft(300);
    setTestsPassed(0);
    setRivalProgress(0);
    setMatchResult(null);
    setIsFighting(true);
    setViewMode('battle');
  };

  const handleRunTests = () => {
    setTestsPassed(3);
    setMatchResult('won');
    setIsFighting(false);
    setCoins((c) => c + 100);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'web' ? Spacing.sm : Math.max(insets.top, 38) + 6,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Code Clash Arena</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>1v1 DUEL</Text>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            Live competitive coding & IndroCoins rewards
          </Text>
        </View>

        {/* IndroCoins Pill */}
        <View style={styles.coinsBadge}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinVal}>{coins}</Text>
        </View>
      </View>

      {/* Navigation Pills */}
      <View style={[styles.navTabs, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navTabBtn, viewMode === 'lobby' && { backgroundColor: colors.card }]}
          onPress={() => setViewMode('lobby')}
        >
          <Ionicons name="game-controller-outline" size={16} color={viewMode === 'lobby' ? Colors.primary : colors.textMuted} />
          <Text style={[styles.navTabText, { color: viewMode === 'lobby' ? colors.text : colors.textMuted }]}>
            Duel Lobby
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navTabBtn, viewMode === 'battle' && { backgroundColor: colors.card }]}
          onPress={() => setViewMode('battle')}
        >
          <Ionicons name="flash-outline" size={16} color={viewMode === 'battle' ? Colors.primary : colors.textMuted} />
          <Text style={[styles.navTabText, { color: viewMode === 'battle' ? colors.text : colors.textMuted }]}>
            Active Arena
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navTabBtn, viewMode === 'leaderboard' && { backgroundColor: colors.card }]}
          onPress={() => setViewMode('leaderboard')}
        >
          <Ionicons name="trophy-outline" size={16} color={viewMode === 'leaderboard' ? Colors.primary : colors.textMuted} />
          <Text style={[styles.navTabText, { color: viewMode === 'leaderboard' ? colors.text : colors.textMuted }]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= MODE 1: ARENA LOBBY ================= */}
        {viewMode === 'lobby' && (
          <View>
            {/* Banner */}
            <LinearGradient
              colors={['#ea580c', '#c2410c', '#9a3412']}
              style={styles.lobbyBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.lobbyBannerHeader}>
                <View>
                  <Text style={styles.lobbyBannerTitle}>Compete & Climb</Text>
                  <Text style={styles.lobbyBannerSubtitle}>
                    Solve algorithmic problems head-to-head under time pressure.
                  </Text>
                </View>
                <View style={styles.clashIconCircle}>
                  <Ionicons name="flame" size={28} color="#ffffff" />
                </View>
              </View>

              <View style={styles.matchStatsRow}>
                <View style={styles.matchStatCol}>
                  <Text style={styles.matchStatVal}>56</Text>
                  <Text style={styles.matchStatLbl}>Victories</Text>
                </View>
                <View style={styles.matchStatCol}>
                  <Text style={styles.matchStatVal}>73.4%</Text>
                  <Text style={styles.matchStatLbl}>Win Rate</Text>
                </View>
                <View style={styles.matchStatCol}>
                  <Text style={styles.matchStatVal}>1,890</Text>
                  <Text style={styles.matchStatLbl}>Arena MMR</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Mode Cards */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SELECT BATTLE MODE</Text>

            {/* Mode 1: Ranked 1v1 */}
            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => startDuel('ranked')}
              activeOpacity={0.88}
            >
              <View style={[styles.modeIconBox, { backgroundColor: '#ffedd5' }]}>
                <Ionicons name="people" size={24} color="#ea580c" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>1v1 Ranked Duel</Text>
                  <View style={styles.stakeBadge}>
                    <Text style={styles.stakeBadgeText}>WAGER 50 🪙</Text>
                  </View>
                </View>
                <Text style={[styles.modeDesc, { color: colors.textMuted }]}>
                  Matched with a live coder at your MMR level. Winner takes 100 IndroCoins.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Mode 2: AI Bot Sparring */}
            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => startDuel('bot')}
              activeOpacity={0.88}
            >
              <View style={[styles.modeIconBox, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="hardware-chip" size={24} color="#0284c7" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>Spar with Oscar.Ai Bot</Text>
                  <View style={[styles.stakeBadge, { backgroundColor: '#e0f2fe' }]}>
                    <Text style={[styles.stakeBadgeText, { color: '#0369a1' }]}>FREE PRACTICE</Text>
                  </View>
                </View>
                <Text style={[styles.modeDesc, { color: colors.textMuted }]}>
                  Instant 1v1 against AI code agents. Ideal for warmups without MMR risk.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Mode 3: Daily Speed Sprint */}
            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => startDuel('sprint')}
              activeOpacity={0.88}
            >
              <View style={[styles.modeIconBox, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="stopwatch" size={24} color="#16a34a" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>Daily Speed Sprint</Text>
                  <View style={[styles.stakeBadge, { backgroundColor: '#dcfce7' }]}>
                    <Text style={[styles.stakeBadgeText, { color: '#15803d' }]}>+200 XP</Text>
                  </View>
                </View>
                <Text style={[styles.modeDesc, { color: colors.textMuted }]}>
                  5-minute sprint against global daily algorithm challenge.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= MODE 2: ACTIVE BATTLE ARENA ================= */}
        {viewMode === 'battle' && (
          <View>
            {/* Live Head-to-Head Scoreboard */}
            <View style={[styles.duelCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.duelHeader}>
                <View style={styles.playerCol}>
                  <Text style={styles.playerAvatar}>🐕</Text>
                  <Text style={[styles.playerName, { color: colors.text }]}>You (1890)</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(testsPassed / 3) * 100}%` }]} />
                  </View>
                  <Text style={[styles.testsLabel, { color: Colors.primary }]}>{testsPassed}/3 Tests</Text>
                </View>

                <View style={styles.vsBox}>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.timerPill}>
                    <Ionicons name="time-outline" size={12} color="#ea580c" />
                    <Text style={styles.timerText}>{formatTimer(timeLeft)}</Text>
                  </View>
                </View>

                <View style={styles.playerCol}>
                  <Text style={styles.playerAvatar}>🤖</Text>
                  <Text style={[styles.playerName, { color: colors.text }]}>Oscar.Ai Bot</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(rivalProgress / 3) * 100}%`, backgroundColor: '#0284c7' }]} />
                  </View>
                  <Text style={[styles.testsLabel, { color: '#0284c7' }]}>{rivalProgress}/3 Tests</Text>
                </View>
              </View>

              {/* Match Result Banner */}
              {matchResult === 'won' && (
                <View style={styles.victoryCard}>
                  <Ionicons name="trophy" size={24} color="#ffd700" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.victoryTitle}>VICTORY ACHIEVED! 🎉</Text>
                    <Text style={styles.victorySubtitle}>+100 IndroCoins added to your wallet</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Problem Statement Card */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{SAMPLE_CHALLENGE.title}</Text>
                <View style={styles.diffPill}>
                  <Text style={styles.diffPillText}>{SAMPLE_CHALLENGE.difficulty}</Text>
                </View>
              </View>
              <Text style={[styles.descText, { color: colors.textSecondary }]}>
                {SAMPLE_CHALLENGE.description}
              </Text>

              {/* Language Selector */}
              <View style={styles.langRow}>
                {(['JavaScript', 'Python', 'C++'] as const).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langBtn,
                      { backgroundColor: selectedLanguage === lang ? Colors.primary : colors.card, borderColor: colors.border },
                    ]}
                    onPress={() => setSelectedLanguage(lang)}
                  >
                    <Text style={[styles.langBtnText, { color: selectedLanguage === lang ? '#ffffff' : colors.text }]}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Code Editor Mock */}
              <TextInput
                style={[styles.codeEditor, { backgroundColor: isDark ? '#020617' : '#0f172a', color: '#38bdf8' }]}
                multiline
                numberOfLines={8}
                value={userCode}
                onChangeText={setUserCode}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Execution Actions */}
              <View style={styles.battleActionsRow}>
                <TouchableOpacity style={styles.runBtn} onPress={handleRunTests} activeOpacity={0.85}>
                  <Ionicons name="play" size={16} color="#ffffff" />
                  <Text style={styles.runBtnText}>Run & Submit Tests</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.forfeitBtn, { borderColor: colors.border }]} onPress={() => setViewMode('lobby')}>
                  <Text style={[styles.forfeitBtnText, { color: colors.textMuted }]}>Leave Arena</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ================= MODE 3: ARENA LEADERBOARD ================= */}
        {viewMode === 'leaderboard' && (
          <View>
            <View style={styles.leaderboardHeader}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>GLOBAL ARENA RANKINGS</Text>
              <Text style={[styles.tierSubtitle, { color: colors.textSecondary }]}>
                Top competitive algorithmic duelists
              </Text>
            </View>

            {LEADERBOARD_USERS.map((user) => (
              <View
                key={user.rank}
                style={[
                  styles.rankCard,
                  { backgroundColor: colors.card, borderColor: user.rank === 5 ? Colors.primary : colors.border },
                ]}
              >
                <View style={styles.rankNumberBox}>
                  <Text style={[styles.rankNumberText, { color: user.rank <= 3 ? Colors.primary : colors.textMuted }]}>
                    #{user.rank}
                  </Text>
                </View>

                <Text style={styles.userAvatarEmoji}>{user.avatar}</Text>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.userLeaderName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userLeaderTier, { color: colors.textMuted }]}>
                    {user.tier} • {user.wins} Wins
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.userMMR, { color: Colors.primary }]}>{user.rating} MMR</Text>
                  <Text style={styles.userCoinsLbl}>{user.coins} 🪙</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ea580c',
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 4,
  },
  coinIcon: {
    fontSize: 12,
  },
  coinVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#b45309',
  },
  navTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  navTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  lobbyBanner: {
    padding: 18,
    borderRadius: BorderRadius.lg,
    marginBottom: 18,
  },
  lobbyBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lobbyBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  lobbyBannerSubtitle: {
    fontSize: 12,
    color: '#fed7aa',
    marginTop: 2,
    maxWidth: SCREEN_WIDTH * 0.6,
    lineHeight: 17,
  },
  clashIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  matchStatCol: {
    alignItems: 'center',
  },
  matchStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  matchStatLbl: {
    fontSize: 10.5,
    color: '#fed7aa',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  modeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  stakeBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stakeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
  },
  modeDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  duelCard: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 14,
  },
  duelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerCol: {
    alignItems: 'center',
    width: 90,
  },
  playerAvatar: {
    fontSize: 26,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressBar: {
    width: 70,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  testsLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  vsBox: {
    alignItems: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ea580c',
    marginBottom: 4,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },
  victoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  victoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803d',
  },
  victorySubtitle: {
    fontSize: 11,
    color: '#166534',
  },
  card: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  diffPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  diffPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  descText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  langBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  codeEditor: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 12,
    borderRadius: BorderRadius.md,
    minHeight: 130,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  battleActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  runBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  runBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  forfeitBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  forfeitBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  leaderboardHeader: {
    marginBottom: 12,
  },
  tierSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 8,
  },
  rankNumberBox: {
    width: 28,
  },
  rankNumberText: {
    fontSize: 13,
    fontWeight: '800',
  },
  userAvatarEmoji: {
    fontSize: 20,
    marginLeft: 4,
  },
  userLeaderName: {
    fontSize: 13,
    fontWeight: '700',
  },
  userLeaderTier: {
    fontSize: 10.5,
    marginTop: 1,
  },
  userMMR: {
    fontSize: 13,
    fontWeight: '800',
  },
  userCoinsLbl: {
    fontSize: 11,
    marginTop: 1,
  },
});
