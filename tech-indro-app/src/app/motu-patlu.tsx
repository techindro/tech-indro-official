/**
 * Motu & Patlu: Gamified Coding Adventure — Tech Indro Mobile
 * Bite-sized interactive puzzles, character companions (Motu, Patlu, Chingam, John),
 * real character voice dialogues powered by Sarvam AI Indic TTS,
 * drag/tap code block ordering, syntax error inspections, and Samosa XP streak.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { playIndicVoice, stopAnyVoice } from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Character Mascots
export interface Mascot {
  id: 'motu' | 'patlu' | 'chingam' | 'john';
  name: string;
  role: string;
  avatar: any;
  voiceSpeaker: string;
  accentColor: string;
  quote: string;
}

const MASCOTS: Record<string, Mascot> = {
  motu: {
    id: 'motu',
    name: 'Motu',
    role: 'Samosa Lover & Coding Hero',
    avatar: require('../../assets/images/characters/motu-character.png'),
    voiceSpeaker: 'arvind',
    accentColor: '#EA580C',
    quote: 'Khaali pet mere dimaag ki batti nahi jalti! Samosa khao aur mast code banao!',
  },
  patlu: {
    id: 'patlu',
    name: 'Patlu',
    role: 'Logic & Algorithm Mastermind',
    avatar: require('../../assets/images/characters/patlu-character.jpg'),
    voiceSpeaker: 'meera',
    accentColor: '#0284C7',
    quote: 'Idea! Coding problem ka smart algorithm mil gaya! Code logic se chalta hai, samose se nahi!',
  },
  chingam: {
    id: 'chingam',
    name: 'Inspector Chingam',
    role: 'Law & Syntax Police',
    avatar: require('../../assets/images/characters/chingam-character.jpg'),
    voiceSpeaker: 'arvind',
    accentColor: '#16A34A',
    quote: 'Chingam ke ilaqe me koi syntax error bach nahi sakta! Law and order in every semicolon!',
  },
  john: {
    id: 'john',
    name: 'John the Don',
    role: 'Furfuri Nagar Bug Buster',
    avatar: require('../../assets/images/characters/john-character.jpg'),
    voiceSpeaker: 'arvind',
    accentColor: '#7C3AED',
    quote: 'John banega sabse bada Coder Don! Dekho kaisa zabardast aur khatarnaak code likha hai!',
  },
};

interface Lesson {
  id: string;
  title: string;
  type: 'arrange' | 'fill_blank' | 'choice';
  prompt: string;
  dialogue: string;
  codeSnippet?: string;
  blocks?: string[];
  correctOrder?: string[];
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'py-1',
    title: 'Say Hello to Python',
    type: 'arrange',
    prompt: 'Arrange the code blocks to print "Hello World" in Python:',
    dialogue: 'Motu says: Khaali pet dimaag nahi chalta, aao screen pe pehla text print karein!',
    blocks: ['print(', '"Hello World"', ')', 'echo', 'console.log'],
    correctOrder: ['print(', '"Hello World"', ')'],
    explanation: 'Python me print() standard function hai screen par output display karne ke liye.',
  },
  {
    id: 'py-2',
    title: 'Storing in Variables',
    type: 'fill_blank',
    prompt: 'Complete the line to store Motu\'s name in a variable:',
    dialogue: 'Patlu says: Variables data store karne ka box hain! Samosa count aur hero name store karo:',
    codeSnippet: '_____ = "Motu"',
    options: ['hero_name', '123', 'print()', 'def'],
    correctAnswer: 'hero_name',
    explanation: 'Python me variables letters ya underscore se shuru hote hain, jaise hero_name.',
  },
  {
    id: 'py-3',
    title: 'Samosa Math Logic',
    type: 'choice',
    prompt: 'What will be the output of this Python code?',
    dialogue: 'Motu needs your help counting party food! Dhyan se calculate karo:',
    codeSnippet: 'samosas = 5\njalebis = 3\nprint(samosas + jalebis)',
    options: ['8', '"samosas + jalebis"', '53', 'Syntax Error'],
    correctAnswer: '8',
    explanation: '5 + 3 = 8. Python integers ko naturally add karta hai!',
  },
  {
    id: 'py-4',
    title: 'Chingam Bug Patrol',
    type: 'choice',
    prompt: 'Which line contains a syntax error in Python?',
    dialogue: 'Inspector Chingam says: Thhaai! Syntax rules todne wale bug ko pakdo!',
    codeSnippet: 'Line 1: print("Welcome")\nLine 2: print("Hello"\nLine 3: score = 100',
    options: ['Line 1', 'Line 2 (Missing closing parenthesis)', 'Line 3'],
    correctAnswer: 'Line 2 (Missing closing parenthesis)',
    explanation: 'Har open bracket "(" ka matching closing bracket ")" hona zaroori hai!',
  },
  {
    id: 'py-5',
    title: 'Boss Battle: John the Don',
    type: 'arrange',
    prompt: 'Assemble code to declare samosas = 10 and print it:',
    dialogue: 'John challenges you: Agar himmat hai toh mera puzzle solve karke dikhao!',
    blocks: ['samosas = 10', 'print(', 'samosas', ')', 'var count'],
    correctOrder: ['samosas = 10', 'print(', 'samosas', ')'],
    explanation: 'Pehle samosas = 10 assign kiya, fir print(samosas) call karke display kiya!',
  },
];

export default function MotuPatluGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [activeMascotKey, setActiveMascotKey] = useState<string>('motu');
  const [streakDays, setStreakDays] = useState(5);
  const [samosaXp, setSamosaXp] = useState(320);
  const [samosas, setSamosas] = useState(5);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Lesson Interactive States
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const activeMascot = MASCOTS[activeMascotKey] || MASCOTS.motu;
  const currentLesson = LESSONS[currentLessonIndex];

  // Load progress from storage
  useEffect(() => {
    (async () => {
      try {
        const savedMascot = await AsyncStorage.getItem('tech_indro_mascot');
        if (savedMascot && MASCOTS[savedMascot]) {
          setActiveMascotKey(savedMascot);
        }
        const savedXp = await AsyncStorage.getItem('tech_indro_samosa_xp');
        if (savedXp) setSamosaXp(parseInt(savedXp, 10));
      } catch (e) {}
    })();
  }, []);

  const handleSelectMascot = (key: string) => {
    setActiveMascotKey(key);
    AsyncStorage.setItem('tech_indro_mascot', key).catch(() => {});
    const m = MASCOTS[key];
    if (m) {
      playIndicVoice({
        text: m.quote,
        language: 'hi',
        speaker: m.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleVoiceDialogue = () => {
    if (isSpeaking) {
      stopAnyVoice();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `${activeMascot.name} says: ${currentLesson.dialogue}`;
    playIndicVoice({
      text: textToSpeak,
      language: 'hi',
      speaker: activeMascot.voiceSpeaker,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Block arrange click handler
  const handleToggleBlock = (block: string) => {
    if (isAnswered) return;
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (isAnswered) return;

    let correct = false;
    if (currentLesson.type === 'arrange') {
      const target = currentLesson.correctOrder || [];
      correct =
        selectedBlocks.length === target.length &&
        selectedBlocks.every((val, idx) => val === target[idx]);
    } else {
      correct = selectedOption === currentLesson.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newXp = samosaXp + 25;
      setSamosaXp(newXp);
      AsyncStorage.setItem('tech_indro_samosa_xp', newXp.toString()).catch(() => {});

      const cheer = `${activeMascot.name} says: Wah kya baat hai! Bilkul sahi jawaab!`;
      playIndicVoice({
        text: cheer,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });

      if (currentLessonIndex === LESSONS.length - 1) {
        setTimeout(() => setCelebrationVisible(true), 1000);
      }
    } else {
      setSamosas(Math.max(0, samosas - 1));
      const hint = `${activeMascot.name} says: Arrey dhyan se socho! Fir se koshish karo!`;
      playIndicVoice({
        text: hint,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < LESSONS.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedBlocks([]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      stopAnyVoice();
      setIsSpeaking(false);
    } else {
      setCelebrationVisible(true);
    }
  };

  const handleResetChallenge = () => {
    setSelectedBlocks([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: isDark ? '#1E293B' : '#EDF2F7' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Motu &amp; Patlu Coding Quest
          </Text>
          <View style={styles.proPill}>
            <Ionicons name="sparkles" size={11} color="#FFF" />
            <Text style={styles.proPillText}>GAMIFIED</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleVoiceDialogue}
          style={[
            styles.soundBtn,
            { backgroundColor: isSpeaking ? '#EA580C' : isDark ? '#1E293B' : '#EDF2F7' },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
            size={20}
            color={isSpeaking ? '#FFF' : isDark ? '#CBD5E1' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Bar */}
        <View style={[styles.statsBar, { backgroundColor: isDark ? '#131D31' : '#FFFFFF' }]}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#EA580C22' }]}>
              <Ionicons name="flame" size={18} color="#EA580C" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{streakDays} Days</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#F59E0B22' }]}>
              <Ionicons name="ribbon" size={18} color="#F59E0B" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{samosaXp} XP</Text>
              <Text style={styles.statLabel}>Coding Points</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#10B98122' }]}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{samosas}/5</Text>
              <Text style={styles.statLabel}>Energy</Text>
            </View>
          </View>
        </View>

        {/* Mascot Picker Station */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Pick Your Coding Buddy
          </Text>
          <Text style={styles.sectionSub}>Tap character to activate custom mentor voice</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mascotList}>
          {Object.keys(MASCOTS).map((key) => {
            const m = MASCOTS[key];
            const isSelected = m.id === activeMascotKey;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => handleSelectMascot(m.id)}
                activeOpacity={0.8}
                style={[
                  styles.mascotCard,
                  {
                    backgroundColor: isDark ? '#131D31' : '#FFFFFF',
                    borderColor: isSelected ? m.accentColor : isDark ? '#1E293B' : '#E2E8F0',
                    borderWidth: isSelected ? 2.5 : 1,
                  },
                ]}
              >
                <Image source={m.avatar} style={styles.mascotAvatar} resizeMode="cover" />
                <Text style={[styles.mascotCardName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {m.name}
                </Text>
                <Text style={styles.mascotCardRole} numberOfLines={1}>
                  {m.role.split('&')[0]}
                </Text>
                {isSelected && (
                  <View style={[styles.mascotActiveDot, { backgroundColor: m.accentColor }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Dialogue Bubble Station */}
        <View
          style={[
            styles.dialogueBox,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFF7ED',
              borderColor: activeMascot.accentColor,
            },
          ]}
        >
          <View style={styles.dialogueHeader}>
            <Image source={activeMascot.avatar} style={styles.dialogueAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.dialogueName, { color: activeMascot.accentColor }]}>
                {activeMascot.name} (Active Companion)
              </Text>
              <Text style={[styles.dialogueText, { color: isDark ? '#F1F5F9' : '#7C2D12' }]}>
                "{currentLesson.dialogue}"
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleVoiceDialogue}
              style={[styles.voicePlayBtn, { backgroundColor: activeMascot.accentColor }]}
              activeOpacity={0.8}
            >
              <Ionicons name={isSpeaking ? 'pause' : 'play'} size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lesson Card */}
        <View
          style={[
            styles.lessonCard,
            {
              backgroundColor: isDark ? '#131D31' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          {/* Progress Header */}
          <View style={styles.lessonProgressRow}>
            <Text style={[styles.lessonBadgeText, { color: activeMascot.accentColor }]}>
              PUZZLE {currentLessonIndex + 1} OF {LESSONS.length}
            </Text>
            <Text style={[styles.lessonTitleText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {currentLesson.title}
            </Text>
          </View>

          <Text style={[styles.promptText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
            {currentLesson.prompt}
          </Text>

          {/* Code Snippet Box (if any) */}
          {currentLesson.codeSnippet && (
            <View style={styles.codeSnippetContainer}>
              <Text style={styles.codeSnippetText}>{currentLesson.codeSnippet}</Text>
            </View>
          )}

          {/* TYPE: ARRANGE CODE BLOCKS */}
          {currentLesson.type === 'arrange' && (
            <View style={styles.puzzleArea}>
              <Text style={styles.subAreaLabel}>Constructed Code Output:</Text>
              <View
                style={[
                  styles.constructedDropzone,
                  {
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  },
                ]}
              >
                {selectedBlocks.length === 0 ? (
                  <Text style={styles.dropzonePlaceholder}>
                    Tap blocks below in the correct sequence...
                  </Text>
                ) : (
                  <View style={styles.assembledBlocksRow}>
                    {selectedBlocks.map((blk, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleToggleBlock(blk)}
                        style={[styles.assembledBlock, { backgroundColor: activeMascot.accentColor }]}
                      >
                        <Text style={styles.assembledBlockText}>{blk}</Text>
                        <Ionicons name="close-circle" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <Text style={styles.subAreaLabel}>Available Blocks:</Text>
              <View style={styles.availableBlocksWrap}>
                {currentLesson.blocks?.map((blk, idx) => {
                  const isUsed = selectedBlocks.includes(blk);
                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={isUsed || isAnswered}
                      onPress={() => handleToggleBlock(blk)}
                      style={[
                        styles.blockPill,
                        {
                          backgroundColor: isUsed
                            ? isDark ? '#1E293B' : '#E2E8F0'
                            : isDark ? '#1E293B' : '#F1F5F9',
                          borderColor: isUsed ? 'transparent' : isDark ? '#475569' : '#CBD5E1',
                          opacity: isUsed ? 0.4 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.blockPillText,
                          { color: isUsed ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F172A' },
                        ]}
                      >
                        {blk}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* TYPE: FILL BLANK & CHOICE */}
          {(currentLesson.type === 'fill_blank' || currentLesson.type === 'choice') && (
            <View style={styles.optionsWrap}>
              {currentLesson.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let optionBg = isDark ? '#1E293B' : '#F8FAFC';
                let optionBorder = isDark ? '#334155' : '#CBD5E1';

                if (isAnswered) {
                  if (opt === currentLesson.correctAnswer) {
                    optionBg = '#10B98122';
                    optionBorder = '#10B981';
                  } else if (isSelected) {
                    optionBg = '#EF444422';
                    optionBorder = '#EF4444';
                  }
                } else if (isSelected) {
                  optionBg = `${activeMascot.accentColor}22`;
                  optionBorder = activeMascot.accentColor;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={isAnswered}
                    onPress={() => setSelectedOption(opt)}
                    style={[styles.optionItem, { backgroundColor: optionBg, borderColor: optionBorder }]}
                  >
                    <View style={styles.optionRadio}>
                      {isSelected ? (
                        <Ionicons
                          name={isAnswered ? (isCorrect ? 'checkmark-circle' : 'close-circle') : 'radio-button-on'}
                          size={20}
                          color={isAnswered ? (isCorrect ? '#10B981' : '#EF4444') : activeMascot.accentColor}
                        />
                      ) : (
                        <Ionicons name="radio-button-off" size={20} color={isDark ? '#475569' : '#94A3B8'} />
                      )}
                    </View>
                    <Text style={[styles.optionText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Result / Explanation Box */}
          {isAnswered && (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: isCorrect ? '#10B98118' : '#EF444418',
                  borderColor: isCorrect ? '#10B981' : '#EF4444',
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'alert-circle'}
                  size={24}
                  color={isCorrect ? '#10B981' : '#EF4444'}
                />
                <Text style={[styles.resultTitle, { color: isCorrect ? '#10B981' : '#EF4444' }]}>
                  {isCorrect ? 'Shaandaar! Correct Answer!' : 'Oops! Galat Answer'}
                </Text>
              </View>
              <Text style={[styles.explanationText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                {currentLesson.explanation}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonActionRow}>
            {!isAnswered ? (
              <TouchableOpacity
                onPress={handleCheckAnswer}
                style={[styles.primaryActionBtn, { backgroundColor: activeMascot.accentColor }]}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done-circle" size={20} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Check Answer</Text>
              </TouchableOpacity>
            ) : isCorrect ? (
              <TouchableOpacity
                onPress={handleNextLesson}
                style={[styles.primaryActionBtn, { backgroundColor: '#10B981' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryActionBtnText}>Next Challenge</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleResetChallenge}
                style={[styles.primaryActionBtn, { backgroundColor: '#EA580C' }]}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Motu & Patlu 3D Spotlight Banner */}
        <View style={[styles.spotlightBanner, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
          <Image
            source={require('../../assets/images/characters/motu-patlu-3d.png')}
            style={styles.spotlightImage}
            resizeMode="contain"
          />
          <View style={styles.spotlightTextWrap}>
            <Text style={[styles.spotlightTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Master Coding in 5 Mins/Day!
            </Text>
            <Text style={styles.spotlightSub}>
              Bite-sized daily quests built for school kids, college students, and tech enthusiasts.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Level Completion Modal */}
      <Modal visible={celebrationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#131D31' : '#FFFFFF' }]}>
            <Image
              source={require('../../assets/images/characters/motu-patlu-3d.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Quest Completed!
            </Text>
            <Text style={styles.modalSub}>
              You crushed all Python challenges with Motu &amp; Patlu! +125 Samosa XP earned!
            </Text>

            <TouchableOpacity
              onPress={() => {
                setCelebrationVisible(false);
                setCurrentLessonIndex(0);
                setSelectedBlocks([]);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              style={[styles.modalBtn, { backgroundColor: '#EA580C' }]}
            >
              <Ionicons name="trophy" size={20} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalBtnText}>Claim Badge &amp; Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCelebrationVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  proPillText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  soundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  mascotList: {
    gap: 12,
    paddingBottom: 16,
  },
  mascotCard: {
    width: 105,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    position: 'relative',
  },
  mascotAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginBottom: 6,
  },
  mascotCardName: {
    fontSize: 13,
    fontWeight: '800',
  },
  mascotCardRole: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  mascotActiveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueBox: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  dialogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  dialogueName: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  dialogueText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  voicePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  lessonProgressRow: {
    marginBottom: 8,
  },
  lessonBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lessonTitleText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  codeSnippetContainer: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  codeSnippetText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38BDF8',
    fontSize: 13.5,
    lineHeight: 20,
  },
  puzzleArea: {
    marginTop: 4,
  },
  subAreaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  constructedDropzone: {
    minHeight: 52,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzonePlaceholder: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  assembledBlocksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assembledBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  assembledBlockText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  availableBlocksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  blockPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  blockPillText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  optionsWrap: {
    gap: 10,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
  },
  optionRadio: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  buttonActionRow: {
    marginTop: 4,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  spotlightBanner: {
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  spotlightImage: {
    width: 90,
    height: 80,
  },
  spotlightTextWrap: {
    flex: 1,
  },
  spotlightTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  spotlightSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  modalImage: {
    width: 140,
    height: 110,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 10,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalCloseBtn: {
    paddingVertical: 6,
  },
  modalCloseBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
