/**
 * AI Shikshak (Rohini) Screen — Tech Indro Mobile
 * Interactive voice & code tutor for students, beginners, and developers.
 * Multi-language support (Hindi, English, Bhojpuri, Hinglish), voice synthesis,
 * preset chips, code copy blocks, and gamified coding points.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { askAiShikshak, playIndicVoice, stopAnyVoice } from '@/services/api';

type LanguageMode = 'auto' | 'hi' | 'en' | 'bhojpuri';

interface ShikshakMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  pointsEarned?: number;
}

const PRESETS = [
  { label: 'FastAPI REST API', prompt: 'FastAPI backend REST API implementation example with code' },
  { label: 'Bhojpuri me Python', prompt: 'Python loop kaise kaam karela Bhojpuri me aasan bhasha me samjhaien' },
  { label: 'Robot Motor Arduino', prompt: 'Robot motor control code in Arduino with L298N driver' },
  { label: 'JavaScript DOM Events', prompt: 'JavaScript DOM event listener code and explanation' },
  { label: 'Binary Search DSA', prompt: 'Binary search algorithm with time complexity and Python implementation' },
];

export default function ShikshakScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [lang, setLang] = useState<LanguageMode>('auto');
  const [messages, setMessages] = useState<ShikshakMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Namaste! Main hoon aapka AI Shikshak Rohini.\n\nAap mujhse Hindi, English ya Bhojpuri me koi bhi coding sawal pooch sakte ho — jaise Python, FastAPI, Robotics, Web Development, ya Math. Har sawal ka real technical solution aur code voice ke sath milega!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [totalPoints, setTotalPoints] = useState(20);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const recognitionRef = useRef<any>(null);

  // Load points & chat from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const pts = await AsyncStorage.getItem('tech_indro_shikshak_points');
        if (pts) setTotalPoints(parseInt(pts, 10));

        const savedChat = await AsyncStorage.getItem('tech_indro_shikshak_history');
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        // Ignore
      }
    })();
  }, []);

  // Save chat & points
  useEffect(() => {
    if (messages.length > 1) {
      AsyncStorage.setItem('tech_indro_shikshak_history', JSON.stringify(messages.slice(-25))).catch(() => {});
    }
  }, [messages]);

  useEffect(() => {
    AsyncStorage.setItem('tech_indro_shikshak_points', totalPoints.toString()).catch(() => {});
  }, [totalPoints]);

  // Clean text for speech synthesis
  const cleanForSpeech = (raw: string): string => {
    return raw
      .replace(/```[\s\S]*?```/g, ' Maine iska aasan code screen par likh diya hai, aap use dekh aur copy kar sakte ho! ')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/[-*•]\s+/g, '')
      .trim();
  };

  // Text-To-Speech powered by Sarvam AI Bulbul v3 Indic voice engine
  const speak = (rawText: string) => {
    if (!voiceEnabled) return;
    const sarvamLang = lang === 'en' ? 'en' : (lang === 'bhojpuri' ? 'bho' : 'hi');
    playIndicVoice({
      text: rawText,
      language: sarvamLang,
      speaker: 'meera',
      pace: 1.0,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    stopAnyVoice();
    setIsSpeaking(false);
  };

  // Speech-To-Text Recognition
  const toggleListening = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      if (isListening) {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'en' ? 'en-US' : 'hi-IN';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } else {
      Alert.alert(
        'Voice Input',
        'Speech-to-text is directly active in Web/Chrome. On mobile, please tap your keyboard microphone icon!'
      );
    }
  };

  const handleCopyCode = async (code: string, blockId: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch (e) {
      // Ignore
    }
    setCopiedCodeId(blockId);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    stopSpeaking();

    const userMsg: ShikshakMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setLoading(true);

    try {
      const history = updated.slice(-6).map((m) => ({
        role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

      const res = await askAiShikshak({
        message: query,
        lang,
        history,
      });

      const replyText = res.reply || 'Arre, formulate karne me dikkat hui. Dobara puchiye!';
      const pts = 10;
      setTotalPoints((prev) => prev + pts);

      const aiMsg: ShikshakMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pointsEarned: pts,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speak(replyText);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          text: 'Network connect nahi ho paya. Kripya thodi der me dobara try karein!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedContent = (raw: string, msgId: string) => {
    // Check for code block regex ```(language)?\n(code)```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\s*([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    let blockCount = 0;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      // Text before code block
      if (match.index > lastIdx) {
        const textSegment = raw.substring(lastIdx, match.index);
        parts.push(
          <Text
            key={`text-${lastIdx}`}
            style={[styles.messageText, { color: isDark ? '#f1f5f9' : '#1e293b' }]}
          >
            {textSegment.trim()}
          </Text>
        );
      }

      const langName = (match[1] || 'CODE').toUpperCase();
      const codeSnippet = match[2].trim();
      const blockId = `${msgId}-block-${blockCount++}`;
      const isCopied = copiedCodeId === blockId;

      parts.push(
        <View
          key={blockId}
          style={[
            styles.codeBlockWrapper,
            { backgroundColor: isDark ? '#090d16' : '#1e293b' },
          ]}
        >
          <View style={styles.codeHeader}>
            <View style={styles.codeHeaderLeft}>
              <Ionicons name="code-slash" size={13} color="#f59e0b" style={{ marginRight: 6 }} />
              <Text style={styles.codeLangText}>{langName}</Text>
            </View>
            <TouchableOpacity
              style={[styles.copyBtn, isCopied && styles.copyBtnSuccess]}
              onPress={() => handleCopyCode(codeSnippet, blockId)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isCopied ? 'checkmark' : 'copy-outline'}
                size={12}
                color="#ffffff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.copyBtnText}>{isCopied ? 'Copied' : 'Copy Code'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.codeText}>{codeSnippet}</Text>
          </ScrollView>
        </View>
      );

      lastIdx = match.index + match[0].length;
    }

    // Remaining text after last code block
    if (lastIdx < raw.length) {
      const remaining = raw.substring(lastIdx);
      parts.push(
        <Text
          key={`text-${lastIdx}`}
          style={[styles.messageText, { color: isDark ? '#f1f5f9' : '#1e293b' }]}
        >
          {remaining.trim()}
        </Text>
      );
    }

    return parts;
  };

  const renderMessageItem = ({ item }: { item: ShikshakMessage }) => {
    const isAi = item.role === 'ai';

    return (
      <View
        style={[
          styles.messageRow,
          isAi ? styles.messageRowAi : styles.messageRowUser,
        ]}
      >
        {isAi && (
          <View style={styles.aiAvatarCircle}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
          </View>
        )}

        <View
          style={[
            styles.bubble,
            isAi
              ? [
                  styles.aiBubble,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#fde68a',
                  },
                ]
              : [
                  styles.userBubble,
                  { backgroundColor: '#ff6b35' },
                ],
          ]}
        >
          {/* AI Header with Sound wave & speaker */}
          {isAi && (
            <View style={styles.aiBubbleTopBar}>
              <View style={styles.aiNameContainer}>
                <Text style={[styles.aiNameText, { color: isDark ? '#f59e0b' : '#b45309' }]}>
                  AI Shikshak (Rohini)
                </Text>
                {isSpeaking && (
                  <View style={styles.waveBars}>
                    <View style={[styles.waveBar, { height: 12 }]} />
                    <View style={[styles.waveBar, { height: 16 }]} />
                    <View style={[styles.waveBar, { height: 10 }]} />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => speak(item.text)}
                style={styles.speakerBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="volume-medium-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <View style={styles.messageContentBox}>
            {isAi ? (
              renderFormattedContent(item.text, item.id)
            ) : (
              <Text style={styles.userMessageText}>{item.text}</Text>
            )}
          </View>

          {/* Points Reward Badge */}
          {isAi && item.pointsEarned ? (
            <View style={styles.rewardBadge}>
              <Ionicons name="star" size={11} color="#d97706" style={{ marginRight: 4 }} />
              <Text style={styles.rewardBadgeText}>
                +{item.pointsEarned} Coding Points! (Total: {totalPoints})
              </Text>
            </View>
          ) : null}

          <Text
            style={[
              styles.timeText,
              { color: isAi ? colors.textMuted : 'rgba(255,255,255,0.75)' },
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.mascotBox}>
            <View style={styles.mascotRing}>
              <Ionicons name="school" size={18} color="#ffffff" />
            </View>
            <View>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]}>AI Shikshak</Text>
                <View style={styles.tagRohini}>
                  <Text style={styles.tagRohiniText}>Rohini Live</Text>
                </View>
              </View>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Kids & Developer AI Voice Tutor
              </Text>
            </View>
          </View>
        </View>

        {/* Right Header: Points & Voice Toggle */}
        <View style={styles.headerRight}>
          <View style={styles.pointsPill}>
            <Ionicons name="sparkles" size={13} color="#f59e0b" style={{ marginRight: 4 }} />
            <Text style={styles.pointsPillText}>{totalPoints} Pts</Text>
          </View>

          <TouchableOpacity
            style={[styles.headerIconBtn, voiceEnabled && styles.headerIconBtnActive]}
            onPress={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={voiceEnabled ? 'volume-high' : 'volume-mute'}
              size={18}
              color={voiceEnabled ? '#ff6b35' : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Switcher Bar */}
      <View style={styles.langBar}>
        <Text style={[styles.langLabel, { color: colors.textMuted }]}>Language:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
          {(['auto', 'hi', 'bhojpuri', 'en'] as LanguageMode[]).map((l) => {
            const active = lang === l;
            const labels: Record<LanguageMode, string> = {
              auto: 'Hinglish / Auto',
              hi: 'हिंदी (Hindi)',
              bhojpuri: 'भोजपुरी (Bhojpuri)',
              en: 'English',
            };
            return (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langChip,
                  active && styles.langChipActive,
                  { borderColor: active ? '#f59e0b' : colors.border },
                ]}
                onPress={() => setLang(l)}
              >
                <Text style={[styles.langChipText, active && styles.langChipTextActive]}>
                  {labels[l]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Nav Shortcut to AI Mentor & AI Tools */}
      <View style={[styles.quickNavBanner, { backgroundColor: isDark ? '#1e293b' : '#fffbeb' }]}>
        <TouchableOpacity
          style={styles.quickNavBtn}
          onPress={() => router.push('/ai-mentor')}
          activeOpacity={0.75}
        >
          <Ionicons name="chatbubbles-outline" size={13} color="#ff6b35" style={{ marginRight: 4 }} />
          <Text style={styles.quickNavText}>24/7 AI Mentor</Text>
        </TouchableOpacity>
        <Text style={{ color: '#cbd5e1' }}>•</Text>
        <TouchableOpacity
          style={styles.quickNavBtn}
          onPress={() => router.push('/ai-tools')}
          activeOpacity={0.75}
        >
          <Ionicons name="construct-outline" size={13} color="#3b82f6" style={{ marginRight: 4 }} />
          <Text style={[styles.quickNavText, { color: '#3b82f6' }]}>50+ AI Tools Hub</Text>
        </TouchableOpacity>
        <Text style={{ color: '#cbd5e1' }}>•</Text>
        <TouchableOpacity
          style={styles.quickNavBtn}
          onPress={() => router.push('/jobs' as any)}
          activeOpacity={0.75}
        >
          <Ionicons name="briefcase-outline" size={13} color="#10b981" style={{ marginRight: 4 }} />
          <Text style={[styles.quickNavText, { color: '#10b981' }]}>Latest Jobs</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Chips */}
      <View style={styles.presetsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
          {PRESETS.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.presetChip,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#fde68a',
                },
              ]}
              onPress={() => handleSend(p.prompt)}
              activeOpacity={0.75}
            >
              <Ionicons name="sparkles-outline" size={11} color="#f59e0b" style={{ marginRight: 5 }} />
              <Text style={[styles.presetChipText, { color: colors.text }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages List */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 50 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.chatHistory}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingIndicator}>
                <View style={styles.aiAvatarCircle}>
                  <Text style={{ fontSize: 18 }}>🤖</Text>
                </View>
                <View
                  style={[
                    styles.typingBubble,
                    { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: colors.border },
                  ]}
                >
                  <ActivityIndicator size="small" color="#f59e0b" />
                  <Text style={[styles.typingText, { color: colors.textMuted }]}>
                    Rohini soch rahi hai aur code taiyar kar rahi hai...
                  </Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          {/* Mic Button */}
          <TouchableOpacity
            style={[
              styles.micBtn,
              isListening && styles.micBtnActive,
            ]}
            onPress={toggleListening}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={
              isListening
                ? 'Sun raha hoon... Boliye!'
                : 'Puchiye koi bhi sawal... ya mic se boliye'
            }
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              { opacity: inputText.trim() ? 1 : 0.6 },
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={17} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  tagRohini: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagRohiniText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  pointsPillText: {
    color: '#d97706',
    fontWeight: '800',
    fontSize: 11.5,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  langLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginRight: 8,
  },
  langScroll: {
    gap: 6,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  langChipActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  langChipTextActive: {
    color: '#b45309',
    fontWeight: '700',
  },
  quickNavBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 8,
  },
  quickNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff6b35',
  },
  presetsWrapper: {
    paddingVertical: 6,
  },
  presetsScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  chatHistory: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
  },
  aiBubble: {
    borderWidth: 1.5,
    borderBottomLeftRadius: 4,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubbleTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiNameText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  waveBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
  },
  speakerBtn: {
    padding: 2,
  },
  messageContentBox: {
    gap: 8,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  codeBlockWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 6,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  codeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLangText: {
    color: '#f59e0b',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  copyBtnSuccess: {
    backgroundColor: '#10b981',
  },
  copyBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38bdf8',
    fontSize: 12,
    padding: 12,
    lineHeight: 18,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  rewardBadgeText: {
    color: '#92400e',
    fontSize: 10.5,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 9.5,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: '#ef4444',
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 90,
    borderRadius: 21,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
