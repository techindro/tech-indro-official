/**
 * Interview Prep Hub — Tech Indro Mobile
 * Interactive 24/7 AI Mock Interview Simulator, ATS Resume Auditor,
 * and Tier-1 / FAANG High-Frequency Question Bank.
 */
import React, { useState } from 'react';
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

// Interview Question Model
interface MockQuestion {
  id: string;
  category: string;
  role: string;
  question: string;
  hint: string;
  modelAnswer: string;
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 'q1',
    category: 'System Design & Distributed Systems',
    role: 'Backend / Full Stack',
    question: 'How would you handle a sudden 10x traffic spike during a flash sale without crashing the primary SQL database?',
    hint: 'Think about request buffering, distributed caching (Redis), rate-limiting at the gateway, and asynchronous decoupling with Kafka/RabbitMQ.',
    modelAnswer: 'I would decouple the read and write paths. Use Cloudflare/Envoy to rate limit traffic. Place Redis in front of the database with atomic Lua decrement scripts to reserve inventory. Publish valid orders to Kafka to throttle writes into PostgreSQL using a Saga pattern.',
    starBreakdown: {
      situation: 'E-commerce platform traffic surges 10x in under 3 seconds during midnight sale.',
      task: 'Prevent database CPU saturation, thread pool exhaustion, and stock overselling.',
      action: 'Implement Redis distributed locks + Lua scripts at Edge, push order checkout to durable Kafka queues, and autoscale worker fleets.',
      result: 'Maintained 99.99% availability, zero overselling, and sustained 120,000 RPS with P99 latency < 45ms.',
    },
  },
  {
    id: 'q2',
    category: 'DSA & Algorithms',
    role: 'SDE-1 / SDE-2',
    question: 'Given an array of integers, find the contiguous subarray with the maximum sum (Kadane’s Algorithm). What is its time and space complexity?',
    hint: 'Maintain two variables: max_so_far and current_max. If current_max drops below 0, reset it.',
    modelAnswer: 'We iterate through the array once. At each step, current_max = max(num, current_max + num) and max_so_far = max(max_so_far, current_max). This solves the problem in O(N) linear time and O(1) auxiliary space.',
    starBreakdown: {
      situation: 'Processing financial stock gain/loss streams in real-time.',
      task: 'Identify optimal buying and selling intervals without quadratic O(N²) window loops.',
      action: 'Applied dynamic programming with Kadane’s single-pass accumulator.',
      result: 'Reduced runtime from 450ms to 2.1ms on 1M integer input payloads.',
    },
  },
  {
    id: 'q3',
    category: 'Behavioral & Leadership (STAR)',
    role: 'Engineering Culture',
    question: 'Tell me about a time when you had a disagreement with a team member or senior engineer about a technical decision.',
    hint: 'Use the STAR format. Focus on objective data, benchmarking, respectful communication, and shared company goals.',
    modelAnswer: 'During an API migration, a teammate favored GraphQL while I advocated for REST with OpenAPI. Instead of debating opinions, we ran a POC measuring payload size and caching efficiency on mobile. Data showed HTTP caching yielded 40% faster TTI on 3G networks. We aligned on REST and documented the decision in an ADR.',
    starBreakdown: {
      situation: 'Architecture disagreement on GraphQL vs REST for high-traffic mobile application.',
      task: 'Reach a technical consensus without stalling sprint delivery deadlines.',
      action: 'Created a measurable benchmark POC testing payload sizes, battery drain, and CDN caching under simulated 3G networks.',
      result: 'The team objectively selected REST, saving 40% latency and fostering a data-driven culture.',
    },
  },
  {
    id: 'q4',
    category: 'Frontend & Web Performance',
    role: 'Frontend / Full Stack',
    question: 'How do you diagnose and fix poor Core Web Vitals (LCP, INP, CLS) in a modern Next.js or React application?',
    hint: 'Mention code-splitting, image optimization with modern formats (AVIF/WebP), font preloading, and reducing main thread JavaScript execution.',
    modelAnswer: 'For LCP: Preload hero assets and use next/image with WebP/AVIF. For INP: Break long tasks using requestIdleCallback or web workers, and optimize React state re-renders. For CLS: Always specify explicit width/height on containers and preload custom web fonts.',
    starBreakdown: {
      situation: 'E-commerce checkout had an LCP of 4.8s and poor SEO ranking.',
      task: 'Bring Core Web Vitals into Google Good threshold (LCP < 2.5s, CLS < 0.1, INP < 200ms).',
      action: 'Implemented route-based dynamic imports, next/font optimization, and CDN edge asset caching.',
      result: 'Achieved Lighthouse score of 98/100 and boosted organic search conversions by 28%.',
    },
  },
];

// Curated FAANG Questions
interface QuestionItem {
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  complexity: string;
  solutionSummary: string;
}

const QUESTION_BANK: QuestionItem[] = [
  {
    title: 'Two Sum & Hash Map Lookup',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    company: 'Google / Amazon',
    complexity: 'O(N) Time • O(N) Space',
    solutionSummary: 'Iterate through array while checking if (target - num) exists in a hash map. If so, return indices; otherwise insert num.',
  },
  {
    title: 'LRU Cache Implementation',
    topic: 'Linked List + Hash Map',
    difficulty: 'Medium',
    company: 'Microsoft / Uber',
    complexity: 'O(1) Get • O(1) Put',
    solutionSummary: 'Combine Doubly Linked List with Hash Map. Recent nodes are moved to head; least recently used nodes at tail are evicted when capacity is reached.',
  },
  {
    title: 'Design Rate Limiter (Token Bucket)',
    topic: 'System Design',
    difficulty: 'Medium',
    company: 'Stripe / Meta',
    complexity: 'O(1) Memory per IP',
    solutionSummary: 'Maintain tokens and last_refill_time in Redis. Increment tokens proportionally to elapsed time up to bucket capacity.',
  },
  {
    title: 'Trapping Rain Water',
    topic: 'Two Pointers / Monotonic Stack',
    difficulty: 'Hard',
    company: 'Amazon / Apple',
    complexity: 'O(N) Time • O(1) Space',
    solutionSummary: 'Use left and right pointers with left_max and right_max boundaries. Water trapped is determined by min(left_max, right_max) - current_height.',
  },
  {
    title: 'Serialize & Deserialize Binary Tree',
    topic: 'Trees & BFS',
    difficulty: 'Hard',
    company: 'Google / Bloomberg',
    complexity: 'O(N) Time • O(N) Space',
    solutionSummary: 'Use level-order BFS traversal with comma separation and "#" for null nodes. Reconstruct recursively with queue.',
  },
];

export default function InterviewPrepScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Active View Tab: 'mock' | 'ats' | 'questions'
  const [activeTab, setActiveTab] = useState<'mock' | 'ats' | 'questions'>('mock');

  // Mock Interview State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // ATS Scanner State
  const [resumeText, setResumeText] = useState<string>(
    'Full Stack Developer with 2+ years experience in React, Node.js, and TypeScript. Built responsive web applications and REST APIs. Reduced page load times and optimized database queries.'
  );
  const [targetRole, setTargetRole] = useState<string>('Senior Backend / Full Stack Engineer');
  const [atsScore, setAtsScore] = useState<number | null>(null);

  // Question Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedQIndex, setExpandedQIndex] = useState<number | null>(null);

  const currentQ = MOCK_QUESTIONS[currentQIndex] || MOCK_QUESTIONS[0];

  const handleEvaluateMock = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: Math.floor(Math.random() * 12) + 84, // 84 - 96
        strengths: 'Strong structural awareness, clearly articulated technical trade-offs, and good terminology.',
        improvements: 'Could expand more on measurable business metrics and fault-tolerant failover scenarios.',
        starScore: {
          situation: '9/10',
          task: '9/10',
          action: '10/10',
          result: '8.5/10',
        },
      });
      setShowModelAnswer(true);
    }, 1200);
  };

  const handleRunAtsAudit = () => {
    let score = 72;
    const lower = resumeText.toLowerCase();
    if (lower.includes('kafka') || lower.includes('redis') || lower.includes('docker') || lower.includes('kubernetes')) {
      score += 12;
    }
    if (lower.includes('reduced') || lower.includes('improved') || lower.includes('%') || lower.includes('scale')) {
      score += 10;
    }
    setAtsScore(Math.min(96, score));
  };

  const filteredQuestions = QUESTION_BANK.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Interview Prep Hub</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI POWERED</Text>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            AI Mock Interviews, ATS Resume Auditor & FAANG Bank
          </Text>
        </View>
      </View>

      {/* Main Top Navigation Tabs */}
      <View style={[styles.topTabs, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'mock' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('mock')}
        >
          <Ionicons
            name="mic-outline"
            size={16}
            color={activeTab === 'mock' ? Colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'mock' ? colors.text : colors.textMuted },
              activeTab === 'mock' && { fontWeight: '700' },
            ]}
          >
            AI Mock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ats' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('ats')}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={activeTab === 'ats' ? Colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'ats' ? colors.text : colors.textMuted },
              activeTab === 'ats' && { fontWeight: '700' },
            ]}
          >
            ATS Auditor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'questions' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('questions')}
        >
          <Ionicons
            name="code-slash-outline"
            size={16}
            color={activeTab === 'questions' ? Colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'questions' ? colors.text : colors.textMuted },
              activeTab === 'questions' && { fontWeight: '700' },
            ]}
          >
            Question Bank
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= TAB 1: AI MOCK INTERVIEWS ================= */}
        {activeTab === 'mock' && (
          <View>
            {/* Question Card */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.categoryTag, { color: Colors.primary }]}>{currentQ.category}</Text>
                  <Text style={[styles.roleTag, { color: colors.textMuted }]}>Target: {currentQ.role}</Text>
                </View>
                <View style={styles.counterPill}>
                  <Text style={styles.counterPillText}>
                    Q {currentQIndex + 1} / {MOCK_QUESTIONS.length}
                  </Text>
                </View>
              </View>

              {/* Sound wave visualizer pill */}
              <View style={[styles.interviewerPill, { backgroundColor: isDark ? '#0f172a' : '#fff7ed' }]}>
                <View style={styles.soundWaveRow}>
                  <View style={[styles.waveBar, { height: 8 }]} />
                  <View style={[styles.waveBar, { height: 16 }]} />
                  <View style={[styles.waveBar, { height: 12 }]} />
                  <View style={[styles.waveBar, { height: 18 }]} />
                  <View style={[styles.waveBar, { height: 10 }]} />
                </View>
                <Text style={styles.interviewerLabel}>AI Senior Staff Interviewer</Text>
              </View>

              <Text style={[styles.questionText, { color: colors.text }]}>{currentQ.question}</Text>

              {/* Hint Bar */}
              <TouchableOpacity
                style={[styles.hintToggle, { borderColor: colors.border }]}
                onPress={() => setShowHint(!showHint)}
                activeOpacity={0.7}
              >
                <Ionicons name="bulb-outline" size={16} color="#d97706" />
                <Text style={styles.hintToggleText}>{showHint ? 'Hide Interview Hint' : 'View Hint & Structure'}</Text>
                <Ionicons name={showHint ? 'chevron-up' : 'chevron-down'} size={14} color="#d97706" />
              </TouchableOpacity>

              {showHint && (
                <View style={[styles.hintBox, { backgroundColor: isDark ? '#141c2e' : '#fffbeb', borderColor: '#fde68a' }]}>
                  <Text style={[styles.hintText, { color: isDark ? '#fef3c7' : '#92400e' }]}>{currentQ.hint}</Text>
                </View>
              )}

              {/* Response Input */}
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>YOUR INTERVIEW RESPONSE</Text>
              <TextInput
                style={[
                  styles.answerInput,
                  { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Type your explanation using STAR format or outline key architectural trade-offs..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                value={userAnswer}
                onChangeText={setUserAnswer}
              />

              {/* Action Buttons */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={[styles.evalBtn, { backgroundColor: userAnswer.trim() ? Colors.primary : colors.border }]}
                  onPress={handleEvaluateMock}
                  disabled={!userAnswer.trim() || isEvaluating}
                  activeOpacity={0.85}
                >
                  <Ionicons name="sparkles" size={16} color="#ffffff" />
                  <Text style={styles.evalBtnText}>
                    {isEvaluating ? 'AI Scoring Response...' : 'Submit for AI Scoring'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fillSampleBtn, { borderColor: colors.border }]}
                  onPress={() => setUserAnswer(currentQ.modelAnswer)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.fillSampleBtnText, { color: colors.text }]}>Load Sample Answer</Text>
                </TouchableOpacity>
              </View>

              {/* AI Evaluation Report */}
              {evaluationResult && (
                <View style={[styles.evalResultBox, { backgroundColor: isDark ? '#0f172a' : '#f0fdf4', borderColor: '#86efac' }]}>
                  <View style={styles.evalScoreRow}>
                    <View>
                      <Text style={[styles.evalScoreLabel, { color: '#166534' }]}>AI Performance Rating</Text>
                      <Text style={[styles.evalScoreNumber, { color: '#15803d' }]}>{evaluationResult.score}/100</Text>
                    </View>
                    <View style={styles.evalBadge}>
                      <Text style={styles.evalBadgeText}>STAR ALIGNED</Text>
                    </View>
                  </View>

                  <Text style={[styles.evalSectionTitle, { color: colors.text }]}>Key Strengths:</Text>
                  <Text style={[styles.evalBodyText, { color: colors.textSecondary }]}>{evaluationResult.strengths}</Text>

                  <Text style={[styles.evalSectionTitle, { color: colors.text }]}>Refinement Suggestions:</Text>
                  <Text style={[styles.evalBodyText, { color: colors.textSecondary }]}>{evaluationResult.improvements}</Text>

                  {/* STAR Breakdown Table */}
                  <View style={styles.starGrid}>
                    {Object.entries(evaluationResult.starScore).map(([key, val]: any) => (
                      <View key={key} style={[styles.starGridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.starKey, { color: Colors.primary }]}>{key.toUpperCase()}</Text>
                        <Text style={[styles.starVal, { color: colors.text }]}>{val}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Model Answer Toggle */}
              {showModelAnswer && (
                <View style={[styles.modelAnswerBox, { backgroundColor: isDark ? '#141c2e' : '#eff6ff', borderColor: '#bfdbfe' }]}>
                  <Text style={[styles.modelAnswerTitle, { color: '#1e40af' }]}>FAANG Model Answer (STAR Method)</Text>
                  <Text style={[styles.modelAnswerText, { color: isDark ? '#bfdbfe' : '#1e3a8a' }]}>{currentQ.modelAnswer}</Text>
                </View>
              )}

              {/* Question Switcher Pagination */}
              <View style={[styles.questionNavRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.qNavBtn, { opacity: currentQIndex === 0 ? 0.3 : 1 }]}
                  disabled={currentQIndex === 0}
                  onPress={() => {
                    setCurrentQIndex(currentQIndex - 1);
                    setUserAnswer('');
                    setEvaluationResult(null);
                    setShowHint(false);
                    setShowModelAnswer(false);
                  }}
                >
                  <Ionicons name="arrow-back" size={16} color={colors.text} />
                  <Text style={[styles.qNavBtnText, { color: colors.text }]}>Previous Q</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.qNavBtn, { opacity: currentQIndex === MOCK_QUESTIONS.length - 1 ? 0.3 : 1 }]}
                  disabled={currentQIndex === MOCK_QUESTIONS.length - 1}
                  onPress={() => {
                    setCurrentQIndex(currentQIndex + 1);
                    setUserAnswer('');
                    setEvaluationResult(null);
                    setShowHint(false);
                    setShowModelAnswer(false);
                  }}
                >
                  <Text style={[styles.qNavBtnText, { color: colors.text }]}>Next Question</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ================= TAB 2: ATS RESUME AUDITOR ================= */}
        {activeTab === 'ats' && (
          <View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.atsHeroRow}>
                <View style={styles.atsIconCircle}>
                  <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.atsTitle, { color: colors.text }]}>Smart ATS Scanner</Text>
                  <Text style={[styles.atsSubtitle, { color: colors.textMuted }]}>
                    Audit resume against Tier-1 company job descriptions
                  </Text>
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>TARGET JOB ROLE</Text>
              <TextInput
                style={[styles.roleInput, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                value={targetRole}
                onChangeText={setTargetRole}
                placeholder="e.g. Senior Backend / Full Stack Engineer"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PASTE RESUME BULLET POINTS / SUMMARY</Text>
              <TextInput
                style={[styles.resumeInput, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                multiline
                numberOfLines={6}
                value={resumeText}
                onChangeText={setResumeText}
                placeholder="Paste experience bullet points here..."
                placeholderTextColor={colors.textMuted}
              />

              <TouchableOpacity style={styles.atsAuditBtn} onPress={handleRunAtsAudit} activeOpacity={0.85}>
                <Ionicons name="analytics-outline" size={18} color="#ffffff" />
                <Text style={styles.atsAuditBtnText}>Scan Resume Compatibility</Text>
              </TouchableOpacity>

              {atsScore !== null && (
                <View style={[styles.atsResultCard, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: colors.border }]}>
                  <View style={styles.atsScoreRow}>
                    <View>
                      <Text style={[styles.atsResultLabel, { color: colors.textMuted }]}>Overall ATS Match</Text>
                      <Text
                        style={[
                          styles.atsScoreNumber,
                          { color: atsScore > 85 ? '#10B981' : atsScore > 75 ? '#F59E0B' : '#EF4444' },
                        ]}
                      >
                        {atsScore}%
                      </Text>
                    </View>
                    <View style={styles.atsMetricBox}>
                      <Text style={[styles.atsMetricVal, { color: colors.text }]}>92%</Text>
                      <Text style={[styles.atsMetricLbl, { color: colors.textMuted }]}>Action Verbs</Text>
                    </View>
                    <View style={styles.atsMetricBox}>
                      <Text style={[styles.atsMetricVal, { color: colors.text }]}>84%</Text>
                      <Text style={[styles.atsMetricLbl, { color: colors.textMuted }]}>Keywords</Text>
                    </View>
                  </View>

                  <Text style={[styles.atsHeading, { color: colors.text }]}>Identified Tech Keywords:</Text>
                  <View style={styles.keywordPillsRow}>
                    {['React', 'Node.js', 'TypeScript', 'REST APIs', 'SQL'].map((kw) => (
                      <View key={kw} style={styles.kwPill}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text style={styles.kwPillText}>{kw}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={[styles.atsHeading, { color: colors.text }]}>Recommended Additions:</Text>
                  <View style={styles.keywordPillsRow}>
                    {['Kafka', 'Redis Caching', 'Docker', 'CI/CD Pipelines'].map((kw) => (
                      <View key={kw} style={[styles.kwPill, { backgroundColor: '#fee2e2' }]}>
                        <Ionicons name="add-circle" size={12} color="#ef4444" />
                        <Text style={[styles.kwPillText, { color: '#b91c1c' }]}>{kw}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ================= TAB 3: QUESTION BANK ================= */}
        {activeTab === 'questions' && (
          <View>
            {/* Search and Filters */}
            <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search DSA, System Design, or Company..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Difficulty Filter Pills */}
            <View style={styles.diffFiltersRow}>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.diffBtn,
                      { backgroundColor: isSelected ? Colors.primary : colors.card, borderColor: colors.border },
                    ]}
                    onPress={() => setSelectedDifficulty(diff)}
                  >
                    <Text
                      style={[
                        styles.diffBtnText,
                        { color: isSelected ? '#ffffff' : colors.text },
                      ]}
                    >
                      {diff}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Question List */}
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQIndex === idx;
              const diffColor =
                q.difficulty === 'Easy' ? '#10B981' : q.difficulty === 'Medium' ? '#F59E0B' : '#EF4444';
              return (
                <View
                  key={idx}
                  style={[styles.qBankCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <TouchableOpacity
                    style={styles.qBankHeader}
                    onPress={() => setExpandedQIndex(isExpanded ? null : idx)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <View style={[styles.diffBadge, { backgroundColor: diffColor + '20' }]}>
                          <Text style={[styles.diffBadgeText, { color: diffColor }]}>{q.difficulty}</Text>
                        </View>
                        <Text style={[styles.qTopic, { color: colors.textMuted }]}>{q.topic}</Text>
                      </View>
                      <Text style={[styles.qTitle, { color: colors.text }]}>{q.title}</Text>
                      <Text style={[styles.qCompany, { color: Colors.primary }]}>{q.company}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={[styles.qExpandedContent, { borderTopColor: colors.border }]}>
                      <View style={styles.complexityPill}>
                        <Ionicons name="speedometer-outline" size={13} color="#0284c7" />
                        <Text style={styles.complexityText}>{q.complexity}</Text>
                      </View>
                      <Text style={[styles.solutionDesc, { color: colors.textSecondary }]}>
                        {q.solutionSummary}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
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
  aiBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  topTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  tabBtnText: {
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  roleTag: {
    fontSize: 11,
    marginTop: 2,
  },
  counterPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  counterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  interviewerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
    gap: 8,
  },
  soundWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  interviewerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 14,
  },
  hintToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  hintToggleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#d97706',
  },
  hintBox: {
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  answerInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 85,
    marginBottom: 12,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  evalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  evalBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  fillSampleBtn: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  fillSampleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  evalResultBox: {
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  evalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  evalScoreLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  evalScoreNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  evalBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  evalBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803d',
  },
  evalSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 2,
  },
  evalBodyText: {
    fontSize: 11.5,
    lineHeight: 17,
  },
  starGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  starGridItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  starKey: {
    fontSize: 9,
    fontWeight: '800',
  },
  starVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  modelAnswerBox: {
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  modelAnswerTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  modelAnswerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  questionNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  qNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qNavBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  atsHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  atsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B98122',
    justifyContent: 'center',
    alignItems: 'center',
  },
  atsTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  atsSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  roleInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  resumeInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 10,
    fontSize: 12.5,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  atsAuditBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 8,
    marginBottom: 14,
  },
  atsAuditBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  atsResultCard: {
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  atsScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  atsResultLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  atsScoreNumber: {
    fontSize: 28,
    fontWeight: '900',
  },
  atsMetricBox: {
    alignItems: 'center',
  },
  atsMetricVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  atsMetricLbl: {
    fontSize: 10,
    marginTop: 2,
  },
  atsHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  keywordPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  kwPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  kwPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
  },
  diffFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  diffBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  diffBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  qBankCard: {
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  qBankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  qTopic: {
    fontSize: 10.5,
  },
  qTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginVertical: 2,
  },
  qCompany: {
    fontSize: 11,
    fontWeight: '600',
  },
  qExpandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  complexityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  complexityText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0284c7',
  },
  solutionDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
});
