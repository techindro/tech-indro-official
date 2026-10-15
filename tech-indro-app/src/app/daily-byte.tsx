import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

interface DailyChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  codeSnippet: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const TODAY_CHALLENGE: DailyChallenge = {
  id: 'byte-2026-10-15',
  title: 'Async State Closure Trap in React',
  difficulty: 'Medium',
  category: 'Frontend & System Reliability',
  codeSnippet: `function CounterComponent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      // Production Bug: Stale closure
      setCount(count + 1);
    }, 2000);
  };

  return <button onClick={handleClick}>Clicked {count}</button>;
}`,
  question: 'If a user rapidly clicks this button 4 times within 1 second, what will the counter display after 2 seconds?',
  options: [
    {
      id: 'opt-1',
      text: 'Count will become 4 because all clicks are queued sequentially.',
      isCorrect: false,
      explanation: 'Incorrect. Because setTimeout captures the stale "count = 0" from the initial render for all 4 callbacks.',
    },
    {
      id: 'opt-2',
      text: 'Count will become 1 because all 4 callbacks overwrite state with (0 + 1).',
      isCorrect: true,
      explanation: 'Correct! Due to stale closures, every invocation uses the initial snapshot count = 0. To fix this, use functional updates: setCount(prev => prev + 1).',
    },
    {
      id: 'opt-3',
      text: 'React throws a ConcurrentMode race condition error.',
      isCorrect: false,
      explanation: 'Incorrect. React does not throw an error, it silently applies the stale update.',
    },
    {
      id: 'opt-4',
      text: 'Count will become 0 as the timer gets garbage collected.',
      isCorrect: false,
      explanation: 'Incorrect. Timers maintain references and will execute normally.',
    },
  ],
};

export default function DailyByteScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [streakCount, setStreakCount] = useState(14);
  const [coins, setCoins] = useState(520);
  const [streakFreezes, setStreakFreezes] = useState(2);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const currentOption = TODAY_CHALLENGE.options.find((o) => o.id === selectedOption);
  const isCorrect = currentOption?.isCorrect ?? false;

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswerSubmitted(true);
    if (TODAY_CHALLENGE.options.find((o) => o.id === selectedOption)?.isCorrect) {
      setStreakCount((prev) => prev + 1);
      setCoins((prev) => prev + 50);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Tech Byte</Text>
              <View style={styles.todayPill}>
                <Text style={styles.todayPillText}>OCT 15 EDITION</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              1-Minute Bug Hunt: Squash real production flaws & protect your streak
            </Text>
          </View>
        </View>

        {/* Stats Row: Streak, Coins, Freeze */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: isDark ? '#1e1b4b' : '#fff7ed', borderColor: '#fdba74' }]}>
            <Ionicons name="flame" size={20} color="#ea580c" />
            <View>
              <Text style={[styles.statVal, { color: '#ea580c' }]}>{streakCount} Days</Text>
              <Text style={styles.statLabel}>Active Streak</Text>
            </View>
          </View>

          <View style={[styles.statBox, { backgroundColor: isDark ? '#142a3e' : '#f0fdf4', borderColor: '#86efac' }]}>
            <Ionicons name="sparkles" size={18} color="#16a34a" />
            <View>
              <Text style={[styles.statVal, { color: '#16a34a' }]}>{coins} Coins</Text>
              <Text style={styles.statLabel}>IndroCoins</Text>
            </View>
          </View>

          <View style={[styles.statBox, { backgroundColor: isDark ? '#082f49' : '#f0f9ff', borderColor: '#7dd3fc' }]}>
            <Ionicons name="snow-outline" size={18} color="#0284c7" />
            <View>
              <Text style={[styles.statVal, { color: '#0284c7' }]}>{streakFreezes} left</Text>
              <Text style={styles.statLabel}>Streak Freeze</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Challenge Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.difficultyPill}>
                <Text style={styles.difficultyText}>{TODAY_CHALLENGE.difficulty}</Text>
              </View>
              <Text style={[styles.categoryText, { color: colors.textMuted }]}>
                {TODAY_CHALLENGE.category}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={14} color="#f59e0b" />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#f59e0b' }}>60s Hunt</Text>
            </View>
          </View>

          <Text style={[styles.challengeTitle, { color: colors.text }]}>
            {TODAY_CHALLENGE.title}
          </Text>

          {/* Code Snippet Box */}
          <View style={[styles.codeBox, { backgroundColor: isDark ? '#020617' : '#0f172a' }]}>
            <View style={styles.codeHeader}>
              <View style={styles.codeDots}>
                <View style={[styles.codeDot, { backgroundColor: '#ef4444' }]} />
                <View style={[styles.codeDot, { backgroundColor: '#f59e0b' }]} />
                <View style={[styles.codeDot, { backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.codeFilename}>CounterComponent.tsx</Text>
            </View>
            <Text style={styles.codeText}>{TODAY_CHALLENGE.codeSnippet}</Text>
          </View>

          <Text style={[styles.questionText, { color: colors.text }]}>
            {TODAY_CHALLENGE.question}
          </Text>

          {/* Options */}
          <View style={styles.optionsList}>
            {TODAY_CHALLENGE.options.map((opt, index) => {
              const isSelected = selectedOption === opt.id;
              let optBorder = colors.border;
              let optBg = isDark ? '#1e293b' : '#f8fafc';

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  optBorder = '#10b981';
                  optBg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5';
                } else if (isSelected && !opt.isCorrect) {
                  optBorder = '#ef4444';
                  optBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2';
                }
              } else if (isSelected) {
                optBorder = '#ff6b35';
                optBg = isDark ? 'rgba(255, 107, 53, 0.12)' : '#fff7ed';
              }

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionItem,
                    {
                      borderColor: optBorder,
                      backgroundColor: optBg,
                    },
                  ]}
                  onPress={() => !isAnswerSubmitted && setSelectedOption(opt.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.optBadge,
                      {
                        backgroundColor: isSelected ? '#ff6b35' : isDark ? '#334155' : '#e2e8f0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optBadgeText,
                        { color: isSelected ? '#ffffff' : colors.text },
                      ]}
                    >
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[styles.optText, { color: colors.text }]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation Box when submitted */}
          {isAnswerSubmitted && (
            <View
              style={[
                styles.feedbackBox,
                {
                  backgroundColor: isCorrect
                    ? isDark
                      ? 'rgba(16, 185, 129, 0.1)'
                      : '#ecfdf5'
                    : isDark
                    ? 'rgba(239, 68, 68, 0.1)'
                    : '#fef2f2',
                  borderColor: isCorrect ? '#10b981' : '#ef4444',
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={isCorrect ? '#10b981' : '#ef4444'}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '800',
                    color: isCorrect ? '#10b981' : '#ef4444',
                  }}
                >
                  {isCorrect ? 'Awesome! Bug Squashed (+50 IndroCoins)' : 'Not quite right, check the reasoning:'}
                </Text>
              </View>
              <Text style={{ fontSize: 12.5, color: colors.text, lineHeight: 19 }}>
                {currentOption?.explanation}
              </Text>
            </View>
          )}

          {/* Submit Action */}
          {!isAnswerSubmitted ? (
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { opacity: selectedOption ? 1 : 0.5 },
              ]}
              disabled={!selectedOption}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#ff6b35', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtnGradient}
              >
                <Ionicons name="flash" size={16} color="#ffffff" />
                <Text style={styles.submitBtnText}>Submit & Check Answer</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.askAiBtn}
              onPress={() => router.push('/ai-mentor')}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={16} color="#9333ea" />
              <Text style={styles.askAiBtnText}>Discuss Deeply with AI Shikshak</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Weekly Streaks Calendar Dots */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.calendarTitle, { color: colors.text }]}>This Week's Activity</Text>
          <View style={styles.dotsRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const isPast = idx < 4; // Mon-Thu completed
              const isToday = idx === 4; // Friday
              return (
                <View key={day} style={{ alignItems: 'center', gap: 6 }}>
                  <View
                    style={[
                      styles.dayDot,
                      {
                        backgroundColor: isPast || (isToday && isAnswerSubmitted)
                          ? '#ff6b35'
                          : isDark
                          ? '#1e293b'
                          : '#e2e8f0',
                        borderWidth: isToday ? 2 : 0,
                        borderColor: '#ea580c',
                      },
                    ]}
                  >
                    {(isPast || (isToday && isAnswerSubmitted)) && (
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    )}
                  </View>
                  <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '600' }}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
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
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
  todayPill: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ff6b35',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  difficultyPill: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ea580c',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  codeBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 6,
  },
  codeDots: {
    flexDirection: 'row',
    gap: 5,
  },
  codeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  codeFilename: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeText: {
    color: '#38bdf8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  questionText: {
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
    marginBottom: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  optBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  optText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  feedbackBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  submitBtn: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  askAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderWidth: 1,
    borderColor: '#9333ea',
  },
  askAiBtnText: {
    color: '#9333ea',
    fontSize: 13,
    fontWeight: '700',
  },
  calendarCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
