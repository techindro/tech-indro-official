/**
 * AI Mentor Screen — Tech Indro
 * Interactive AI Tutor powered by Gemini API with role customization, smart suggestions,
 * and Voice AI (Speech-to-Text mic and Text-to-Speech audio reader in Hindi & English)
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
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import ChatBubble, { Message } from '@/components/ChatBubble';
import { sendChatMessage } from '@/services/api';

type MentorRole = 'tutor' | 'reviewer' | 'career';
type VoiceLang = 'hi-IN' | 'en-US';

const ROLES: { id: MentorRole; label: string; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
  { id: 'tutor', label: 'AI Tutor', icon: 'school-outline', desc: 'Concept explanations & doubts' },
  { id: 'reviewer', label: 'Code Review', icon: 'code-slash-outline', desc: 'Debugging & optimization' },
  { id: 'career', label: 'Career Guide', icon: 'briefcase-outline', desc: 'Roadmaps & interview prep' },
];

const SUGGESTIONS = [
  'Explain React Hooks in simple Hindi',
  'How do I start DSA in C++?',
  'Review this Python function for bugs',
  'What should I learn for Full Stack in 2026?',
  'What is Redux vs Context API?',
];

export default function AIMentorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<MentorRole>('tutor');
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Namaste! 🙏 Mai hoon **Tech Indro AI Mentor**.\n\nAap mujhse coding doubts, concepts, ya career roadmap ke baare me pooch sakte hain. **Mic button** daba kar bol kar bhi pooch sakte hain!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const recognitionRef = useRef<any>(null);

  // Clean Markdown for Audio Speech
  const cleanMarkdownForSpeech = (text: string): string => {
    return text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#[#]*\s*(.*)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .trim();
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleaned = cleanMarkdownForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = voiceLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle Speech Recognition
  const handleToggleMic = () => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = voiceLang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          // auto send spoken query
          handleSend(transcript);
        };

        recognition.onerror = (e: any) => {
          setIsListening(false);
          if (e.error !== 'no-speech') {
            Alert.alert('Microphone', `Voice recognition error: ${e.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    } else {
      // Browser / platform without webkitSpeechRecognition
      Alert.alert(
        'Speech Recognition',
        'Voice input is supported in Chrome, Edge, and Android WebView. Please allow microphone permissions or type your question.'
      );
    }
  };

  // Load chat history from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('tech_indro_mentor_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        // Fallback silently if storage unavailable
      }
    })();
  }, []);

  // Save chat history to AsyncStorage
  useEffect(() => {
    if (messages.length > 1) {
      AsyncStorage.setItem('tech_indro_mentor_chat_history', JSON.stringify(messages.slice(-30))).catch(() => {});
    }
  }, [messages]);

  const getSystemInstruction = (currentRole: MentorRole) => {
    const basePersona = `You are Tech Indro AI, a senior developer tutor at Tech Indro (India's premier learning platform).
You explain in a natural, warm, and friendly Hinglish mix (Hindi + English).
Give practical code examples with clean syntax, debug code step-by-step, and create structured learning roadmaps.
Always be encouraging, highly technical, yet beginner-friendly.`;

    switch (currentRole) {
      case 'reviewer':
        return `${basePersona}
[TOOL: codeReview active]: Focus on code review, finding bugs, optimizing algorithmic complexity, and giving fixed code with clear explanation.`;
      case 'career':
        return `${basePersona}
[TOOL: generateRoadmap active]: Focus on career guidance, technical interviews, and structured learning roadmaps (weeks, milestones, projects).`;
      default:
        return `${basePersona}
[TOOL: explainConcept active]: Explain complex programming concepts simply with intuitive real-world analogies and beginner mental models.`;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInputText('');
    setLoading(true);

    const history = updated.slice(-6).map((m) => ({
      role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.text }],
    }));

    try {
      const response = await sendChatMessage(
        query,
        history,
        getSystemInstruction(role)
      );

      const replyText = response.reply || response.response || (response as any)?.message || 'Mujhe samajh nahi aaya, kripya thoda aur vistaar se batayein.';
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (autoSpeak) {
        speakText(replyText);
      }
    } catch {
      const fallbackReply = generateFallbackReply(query, role);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (autoSpeak) {
        speakText(fallbackReply);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackReply = (query: string, currentRole: MentorRole): string => {
    const q = query.toLowerCase();
    if (q.includes('react') || q.includes('hook')) {
      return `### React Hooks Samajhte Hain ⚛️\n\nReact Hooks functional components me state aur lifecycle methods use karne dete hain.\n\n\`\`\`javascript\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Clicked: {count}</button>;\n}\n\`\`\`\n\n**Common Hooks:**\n- \`useState\`: State manage karne ke liye\n- \`useEffect\`: Side effects (data fetching, subscriptions)\n- \`useRef\`: Mutable DOM references`;
    }
    if (q.includes('dsa') || q.includes('c++')) {
      return `### DSA Roadmap in C++ 🚀\n\n1. **Language Basics:** Pointers, STL (Vector, Map, Set, Queue, Stack)\n2. **Array & String:** Two Pointers, Sliding Window\n3. **Recursion & Backtracking**\n4. **Trees & Graphs:** BFS, DFS, Dijkstra\n5. **Dynamic Programming:** 1D, 2D memoization\n\n*Tip:* Daily 2 LeetCode problems solve karo consistent rahne ke liye!`;
    }
    return `Dhanyawad aapke sawaal ke liye! (${currentRole.toUpperCase()} Mode)\n\nAapne poocha: *"${query}"*\n\nTech Indro par hum is topic ko practical real-world projects ke saath sikhate hain. Koi specific doubt ho toh bilkul poochein!`;
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-new',
        role: 'ai',
        text: `Swagat hai! (${ROLES.find((r) => r.id === role)?.label} mode active hai). Aap kya seekhna chahte hain?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'web' ? Spacing.md : Math.max(insets.top, 40) + 8,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.push('/')}
          activeOpacity={0.7}
        >
          <Image
            source={require('@/assets/images/tech-indro-square-logo.png')}
            style={{ width: 34, height: 34, borderRadius: 8, marginRight: 8 }}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitle}>AI Shikshak</Text>
            <Text style={styles.headerSubtitle}>24/7 Intelligence</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {/* Voice Language Toggle */}
          <TouchableOpacity
            style={styles.langToggleBtn}
            onPress={() => setVoiceLang(voiceLang === 'hi-IN' ? 'en-US' : 'hi-IN')}
          >
            <Text style={styles.langToggleText}>
              {voiceLang === 'hi-IN' ? '🇮🇳 Hindi' : '🌐 EN'}
            </Text>
          </TouchableOpacity>

          {/* Auto Speak Toggle */}
          <TouchableOpacity
            style={[styles.audioToggleBtn, autoSpeak && styles.audioToggleBtnActive]}
            onPress={() => {
              if (isSpeaking) {
                stopSpeaking();
              }
              setAutoSpeak(!autoSpeak);
            }}
          >
            <Ionicons
              name={autoSpeak ? 'volume-high' : 'volume-mute'}
              size={18}
              color={autoSpeak ? '#fff' : Colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearBtn} onPress={handleClearChat}>
            <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Picker */}
      <View style={styles.roleContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleScroll}>
          {ROLES.map((r) => {
            const active = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleChip, active && styles.roleChipActive]}
                onPress={() => {
                  setRole(r.id);
                  stopSpeaking();
                }}
              >
                <Ionicons
                  name={r.icon}
                  size={14}
                  color={active ? '#fff' : Colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Listening Banner */}
      {isListening && (
        <View style={styles.listeningBanner}>
          <Ionicons name="mic" size={18} color="#EF4444" />
          <Text style={styles.listeningText}>
            Aapki aawaz sun raha hu ({voiceLang === 'hi-IN' ? 'Hindi/Hinglish' : 'English'})... Bolo!
          </Text>
          <TouchableOpacity onPress={() => setIsListening(false)}>
            <Ionicons name="close-circle" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageRowWrapper}>
              <ChatBubble message={item} />
              {item.role === 'ai' && (
                <TouchableOpacity
                  style={styles.speakMessageBtn}
                  onPress={() => speakText(item.text)}
                >
                  <Ionicons name="volume-medium-outline" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.typingText}>AI Mentor soch raha hai...</Text>
              </View>
            ) : null
          }
        />

        {/* Quick Suggestion Chips (only if 2 or fewer messages) */}
        {messages.length <= 2 && (
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionTitle}>💡 Suggested Questions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
              {SUGGESTIONS.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => handleSend(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Bar with Mic Button */}
        <View style={styles.inputContainer}>
          {/* Voice Input Button */}
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonListening]}
            onPress={handleToggleMic}
          >
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={20}
              color={isListening ? '#fff' : Colors.primaryLight}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={isListening ? 'Listening... Bolte rahiye' : 'Poochiye ya mic par click karein...'}
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={600}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (inputText.trim() && !loading) {
                handleSend();
              }
            }}
            onKeyPress={(e: any) => {
              if (Platform.OS === 'web' && e.nativeEvent?.key === 'Enter' && !e.nativeEvent?.shiftKey) {
                e.preventDefault?.();
                if (inputText.trim() && !loading) {
                  handleSend();
                }
              }
            }}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
            accessibilityLabel="Send message"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name="send"
                size={18}
                color={inputText.trim() ? '#fff' : Colors.textMuted}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  botIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  langToggleBtn: {
    backgroundColor: Colors.cardBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langToggleText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  audioToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  audioToggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  clearBtn: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  roleContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.xs,
  },
  roleScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBorder,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  roleChipText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  roleChipTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  listeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EF444422',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EF444444',
  },
  listeningText: {
    fontSize: FontSize.xs,
    color: '#EF4444',
    fontWeight: FontWeight.bold,
  },
  chatArea: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  messageRowWrapper: {
    position: 'relative',
  },
  speakMessageBtn: {
    position: 'absolute',
    left: 44,
    bottom: -6,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  typingText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  suggestionContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  suggestionTitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  suggestionsScroll: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  suggestionChip: {
    backgroundColor: Colors.cardBorder,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  micButtonListening: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.cardBorder,
  },
});
