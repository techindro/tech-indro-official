/**
 * Quiz & Test Series Screen — Tech Indro
 * 4500+ Questions Engine supporting MCQ, MSQ, and NAT with timers, scoring, and review
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import questionsData from '@/data/questions.json';

interface QuestionItem {
  domain: string;
  type: 'MCQ' | 'MSQ' | 'NAT' | string;
  question: string;
  options: string[];
  correct: number | number[] | string;
}

export default function QuizScreen() {
  const allQuestions: QuestionItem[] = questionsData as QuestionItem[];

  // Domains list
  const domains = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => {
      if (q.domain) set.add(q.domain);
    });
    return ['All Domains', ...Array.from(set)];
  }, [allQuestions]);

  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [inQuiz, setInQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins for 10 questions
  const [showResult, setShowResult] = useState(false);

  // Timer
  useEffect(() => {
    let timer: any;
    if (inQuiz && !showResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inQuiz, showResult, timeLeft]);

  const startQuiz = (domain: string) => {
    let pool = allQuestions;
    if (domain !== 'All Domains') {
      pool = allQuestions.filter((q) => q.domain === domain);
    }
    // Pick 10 random questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffled);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(300); // 5 minutes
    setInQuiz(true);
    setShowResult(false);
  };

  const handleSelectOption = (index: number, optIdx: number) => {
    const q = quizQuestions[index];
    if (q.type === 'MCQ') {
      setSelectedAnswers((prev) => ({ ...prev, [index]: optIdx }));
    } else if (q.type === 'MSQ') {
      const current: number[] = prevAnswers(index);
      if (current.includes(optIdx)) {
        setSelectedAnswers((prev) => ({
          ...prev,
          [index]: current.filter((x) => x !== optIdx),
        }));
      } else {
        setSelectedAnswers((prev) => ({
          ...prev,
          [index]: [...current, optIdx],
        }));
      }
    }
  };

  const prevAnswers = (index: number): number[] => {
    return Array.isArray(selectedAnswers[index]) ? selectedAnswers[index] : [];
  };

  const handleNATChange = (val: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const handleSubmitQuiz = () => {
    setShowResult(true);
  };

  // Score calculation
  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === undefined || userAns === null || userAns === '') return;

      if (q.type === 'MCQ') {
        if (userAns === q.correct) score += 1;
      } else if (q.type === 'MSQ') {
        const correctArray = Array.isArray(q.correct) ? [...q.correct].sort() : [];
        const userArray = Array.isArray(userAns) ? [...userAns].sort() : [];
        if (
          correctArray.length === userArray.length &&
          correctArray.every((v, i) => v === userArray[i])
        ) {
          score += 1;
        }
      } else if (q.type === 'NAT') {
        if (
          String(userAns).trim().toLowerCase() === String(q.correct).trim().toLowerCase()
        ) {
          score += 1;
        }
      }
    });
    return score;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. RESULT SCREEN
  if (showResult) {
    const score = calculateScore();
    const pct = Math.round((score / quizQuestions.length) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <View style={styles.resultHeaderCard}>
            <View style={styles.trophyCircle}>
              <Ionicons
                name={pct >= 70 ? 'trophy' : pct >= 40 ? 'ribbon' : 'bulb'}
                size={48}
                color={pct >= 70 ? '#FFD700' : '#8B5CF6'}
              />
            </View>
            <Text style={styles.resultTitle}>
              {pct >= 70 ? 'Shaandaar! 🌟' : pct >= 40 ? 'Good Effort! 👍' : 'Practice More! 📚'}
            </Text>
            <Text style={styles.resultScoreText}>
              Aapka Score: <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>{score}</Text> / {quizQuestions.length} ({pct}%)
            </Text>
          </View>

          {/* Detailed Question Review */}
          <Text style={styles.sectionHeader}>Question Analysis & Explanations</Text>
          {quizQuestions.map((q, idx) => {
            const userAns = selectedAnswers[idx];
            let isCorrect = false;

            if (q.type === 'MCQ') {
              isCorrect = userAns === q.correct;
            } else if (q.type === 'MSQ') {
              const correctArray = Array.isArray(q.correct) ? [...q.correct].sort() : [];
              const userArray = Array.isArray(userAns) ? [...userAns].sort() : [];
              isCorrect =
                correctArray.length === userArray.length &&
                correctArray.every((v, i) => v === userArray[i]);
            } else if (q.type === 'NAT') {
              isCorrect =
                String(userAns).trim().toLowerCase() === String(q.correct).trim().toLowerCase();
            }

            return (
              <View
                key={idx}
                style={[
                  styles.reviewCard,
                  isCorrect ? styles.reviewCardCorrect : styles.reviewCardWrong,
                ]}
              >
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewNumber}>Q{idx + 1} ({q.type})</Text>
                  <View style={[styles.badge, isCorrect ? styles.badgeSuccess : styles.badgeDanger]}>
                    <Text style={styles.badgeText}>
                      {isCorrect ? 'Correct +1' : userAns !== undefined ? 'Incorrect 0' : 'Skipped'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reviewQuestion}>{q.question}</Text>

                {q.type !== 'NAT' ? (
                  <View style={styles.reviewOptionsList}>
                    {q.options.map((opt, oIdx) => {
                      const wasChosen =
                        q.type === 'MCQ'
                          ? userAns === oIdx
                          : Array.isArray(userAns) && userAns.includes(oIdx);
                      const isOptionCorrect =
                        q.type === 'MCQ'
                          ? q.correct === oIdx
                          : Array.isArray(q.correct) && q.correct.includes(oIdx);

                      return (
                        <View
                          key={oIdx}
                          style={[
                            styles.reviewOptionItem,
                            isOptionCorrect && styles.reviewOptionCorrect,
                            wasChosen && !isOptionCorrect && styles.reviewOptionWrong,
                          ]}
                        >
                          <Ionicons
                            name={
                              isOptionCorrect
                                ? 'checkmark-circle'
                                : wasChosen
                                ? 'close-circle'
                                : 'ellipse-outline'
                            }
                            size={16}
                            color={
                              isOptionCorrect
                                ? Colors.success
                                : wasChosen
                                ? Colors.danger
                                : Colors.textMuted
                            }
                          />
                          <Text
                            style={[
                              styles.reviewOptionText,
                              isOptionCorrect && { color: Colors.success, fontWeight: 'bold' },
                            ]}
                          >
                            {opt}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.natReview}>
                    <Text style={styles.natReviewText}>
                      Your Answer: <Text style={{ color: isCorrect ? Colors.success : Colors.danger }}>{userAns || 'None'}</Text>
                    </Text>
                    <Text style={styles.natReviewText}>
                      Correct Answer: <Text style={{ color: Colors.success, fontWeight: 'bold' }}>{String(q.correct)}</Text>
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => startQuiz(selectedDomain)}
            >
              <Ionicons name="reload" size={18} color="#fff" />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backHomeButton}
              onPress={() => setInQuiz(false)}
            >
              <Text style={[styles.buttonText, { color: Colors.text }]}>Back to Topics</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2. ACTIVE QUIZ SCREEN
  if (inQuiz) {
    const currentQ = quizQuestions[currentIndex];
    if (!currentQ) return null;

    return (
      <SafeAreaView style={styles.container}>
        {/* Quiz Top bar */}
        <View style={styles.quizTopBar}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Quit Quiz?', 'Aapki progress save nahi hogi.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Quit', style: 'destructive', onPress: () => setInQuiz(false) },
              ]);
            }}
          >
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={16} color={timeLeft < 60 ? Colors.danger : Colors.text} />
            <Text style={[styles.timerText, timeLeft < 60 && { color: Colors.danger }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          <TouchableOpacity onPress={handleSubmitQuiz}>
            <Text style={styles.submitTopText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.questionScroll}>
          {/* Question Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.qCounter}>
              Question {currentIndex + 1} of {quizQuestions.length}
            </Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{currentQ.type}</Text>
            </View>
          </View>

          <Text style={styles.domainTag}>{currentQ.domain}</Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {/* Options for MCQ / MSQ */}
          {currentQ.type !== 'NAT' ? (
            <View style={styles.optionsList}>
              {currentQ.options.map((option, idx) => {
                const isSelected =
                  currentQ.type === 'MCQ'
                    ? selectedAnswers[currentIndex] === idx
                    : prevAnswers(currentIndex).includes(idx);

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => handleSelectOption(currentIndex, idx)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && (
                        <Ionicons
                          name={currentQ.type === 'MCQ' ? 'ellipse' : 'checkmark'}
                          size={12}
                          color="#fff"
                        />
                      )}
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* NAT Input */
            <View style={styles.natContainer}>
              <Text style={styles.natPrompt}>Enter Numerical / Exact Answer:</Text>
              <TextInput
                style={styles.natInput}
                placeholder="Type answer here..."
                placeholderTextColor={Colors.textMuted}
                value={selectedAnswers[currentIndex] || ''}
                onChangeText={handleNATChange}
                keyboardType="numeric"
              />
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footerNav}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          >
            <Ionicons name="arrow-back" size={18} color={currentIndex === 0 ? Colors.textMuted : Colors.text} />
            <Text style={[styles.navBtnText, currentIndex === 0 && { color: Colors.textMuted }]}>
              Prev
            </Text>
          </TouchableOpacity>

          {currentIndex < quizQuestions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary]}
              onPress={() => setCurrentIndex((prev) => prev + 1)}
            >
              <Text style={styles.navBtnPrimaryText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnSubmit]}
              onPress={handleSubmitQuiz}
            >
              <Text style={styles.navBtnPrimaryText}>Finish Test</Text>
              <Ionicons name="checkmark-done" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // 3. TOPIC / DOMAIN SELECTOR SCREEN
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.selectorScroll}>
        <View style={styles.heroSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
            <Image
              source={require('@/assets/images/tech-indro-logo.png')}
              style={{ width: 44, height: 22 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary + '33' }}>
              <Ionicons name="flash" size={12} color={Colors.primary} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 }}>4500+ QUESTION BANK</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Adaptive Test Series</Text>
          <Text style={styles.heroSubtitle}>
            Practice real GATE, ISRO, DRDO & Tech Interview questions with instant scoring.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Choose Practice Domain</Text>

        <View style={styles.domainGrid}>
          {domains.map((dom, idx) => {
            const isSelected = selectedDomain === dom;
            const count =
              dom === 'All Domains'
                ? allQuestions.length
                : allQuestions.filter((q) => q.domain === dom).length;

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.domainCard, isSelected && styles.domainCardSelected]}
                onPress={() => setSelectedDomain(dom)}
              >
                <View style={styles.domainCardTop}>
                  <Ionicons
                    name={
                      dom.includes('Android')
                        ? 'phone-portrait-outline'
                        : dom.includes('Robotics')
                        ? 'hardware-chip-outline'
                        : dom.includes('DevOps')
                        ? 'cloud-outline'
                        : dom.includes('Web')
                        ? 'globe-outline'
                        : 'code-slash-outline'
                    }
                    size={28}
                    color={isSelected ? Colors.primaryLight : Colors.textSecondary}
                  />
                  <Text style={styles.domainQuestionCount}>{count} Qs</Text>
                </View>
                <Text style={[styles.domainCardTitle, isSelected && styles.domainCardTitleSelected]}>
                  {dom}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={styles.startQuizButton}
          onPress={() => startQuiz(selectedDomain)}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.startQuizButtonText}>
            Start {selectedDomain} Quiz (10 Questions)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  selectorScroll: {
    padding: Spacing.lg,
  },
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroBadge: {
    fontSize: FontSize.xs,
    color: '#FFD700',
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  domainCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  domainCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#8B5CF61A',
  },
  domainCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  domainQuestionCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  domainCardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  domainCardTitleSelected: {
    color: Colors.primaryLight,
  },
  startQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  startQuizButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  // Quiz Active
  quizTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  submitTopText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.cardBorder,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
  },
  questionScroll: {
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  qCounter: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  typeBadge: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    fontWeight: FontWeight.bold,
  },
  domainTag: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  optionsList: {
    gap: Spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  optionItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#8B5CF622',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  optionLabelSelected: {
    color: '#fff',
    fontWeight: FontWeight.medium,
  },
  natContainer: {
    marginTop: Spacing.md,
  },
  natPrompt: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  natInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  navBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  navBtnSubmit: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  navBtnPrimaryText: {
    fontSize: FontSize.md,
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  // Result styles
  resultScroll: {
    padding: Spacing.lg,
  },
  resultHeaderCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  trophyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#8B5CF622',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  resultScoreText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  reviewCardCorrect: {
    borderLeftColor: Colors.success,
  },
  reviewCardWrong: {
    borderLeftColor: Colors.danger,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reviewNumber: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeSuccess: {
    backgroundColor: '#10B98122',
  },
  badgeDanger: {
    backgroundColor: '#EF444422',
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.text,
  },
  reviewQuestion: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reviewOptionsList: {
    gap: Spacing.xs,
  },
  reviewOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  reviewOptionCorrect: {
    backgroundColor: '#10B9811A',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs,
  },
  reviewOptionWrong: {
    backgroundColor: '#EF44441A',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs,
  },
  reviewOptionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  natReview: {
    marginTop: Spacing.xs,
  },
  natReviewText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  resultActions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  backHomeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
});
