/**
 * Offline Study Notes & Bookmarks Screen — Tech Indro
 * Save and organize tricky quiz questions, AI Shikshak code explanations,
 * and personal revision notes with interactive Flashcard mode.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

interface BookmarkItem {
  id: string;
  type: 'question' | 'ai_note' | 'personal_note';
  title: string;
  content: string;
  tag: string;
  date: string;
  extra?: string;
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b1',
    type: 'question',
    title: '[ISRO 2022] CSS text color property',
    content: 'Which CSS property is used to change the text color of an element? Correct Answer: "color". font-color is invalid.',
    tag: 'Web Dev',
    date: 'Yesterday',
    extra: 'GATE/ISRO Exam Repeated Question',
  },
  {
    id: 'b2',
    type: 'ai_note',
    title: 'React Hooks: useState vs useRef',
    content: 'useState triggers re-render when value changes. useRef holds a mutable reference that does NOT re-render the component when updated.',
    tag: 'AI Shikshak',
    date: '2 days ago',
    extra: 'Saved from AI Tutor chat',
  },
  {
    id: 'b3',
    type: 'question',
    title: '[TCS Digital 2023] Degrees of Freedom',
    content: 'How many degrees of freedom does a standard rigid object in 3D space have? Answer: 6 (3 translational + 3 rotational).',
    tag: 'Robotics',
    date: '3 days ago',
    extra: 'High Frequency Interview Question',
  },
  {
    id: 'b4',
    type: 'personal_note',
    title: 'ROS 2 Microcontroller Baud Rate',
    content: 'Always set micro-ROS client agent baud rate to 115200 on ESP32 to prevent serial buffer overflow.',
    tag: 'Lab Notes',
    date: '4 days ago',
    extra: 'Space Lab Tip',
  },
];

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(DEFAULT_BOOKMARKS);
  const [activeTab, setActiveTab] = useState<'all' | 'question' | 'ai_note' | 'personal_note' | 'flashcard'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Personal');

  // Flashcard Mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const stored = await AsyncStorage.getItem('@user_bookmarks');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBookmarks(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
    loadBookmarks();
  }, []);

  const saveToStorage = async (updated: BookmarkItem[]) => {
    setBookmarks(updated);
    try {
      await AsyncStorage.setItem('@user_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('Incomplete Note', 'Please provide a title and note content.');
      return;
    }

    const newItem: BookmarkItem = {
      id: Date.now().toString(),
      type: 'personal_note',
      title: newTitle.trim(),
      content: newContent.trim(),
      tag: newTag,
      date: 'Just now',
      extra: 'Manual Note',
    };

    const updated = [newItem, ...bookmarks];
    saveToStorage(updated);
    setModalVisible(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove Bookmark', 'Are you sure you want to delete this saved note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = bookmarks.filter((b) => b.id !== id);
          saveToStorage(updated);
        },
      },
    ]);
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesTab = activeTab === 'all' || b.type === activeTab;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      {/* Top Header */}
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
        <Text style={[styles.topBarTitle, { color: colors.text }]}>Saved Notes & Bookmarks</Text>

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search saved questions, tags, or concepts..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {(['all', 'question', 'ai_note', 'personal_note', 'flashcard'] as const).map((tab) => {
            const active = activeTab === tab;
            const label =
              tab === 'all'
                ? `All (${bookmarks.length})`
                : tab === 'question'
                ? '📝 Questions'
                : tab === 'ai_note'
                ? '🤖 AI Notes'
                : tab === 'personal_note'
                ? '📌 Notes'
                : '⚡ Flashcard Mode';

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  active && { backgroundColor: colors.primary, borderColor: colors.primaryLight },
                ]}
                onPress={() => {
                  setActiveTab(tab);
                  setIsFlipped(false);
                }}
              >
                <Text
                  style={[
                    styles.tabChipText,
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

        {/* 1. Flashcard Mode */}
        {activeTab === 'flashcard' ? (
          <View style={styles.flashcardContainer}>
            {bookmarks.length === 0 ? (
              <Text style={styles.emptyText}>No bookmarks to revise yet.</Text>
            ) : (
              <View>
                <Text style={[styles.flashcardCounter, { color: colors.textMuted }]}>
                  Card {flashcardIndex + 1} of {bookmarks.length}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.flashcardCard,
                    { backgroundColor: colors.card, borderColor: isFlipped ? colors.primary : colors.border },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setIsFlipped(!isFlipped)}
                >
                  <View style={styles.flashcardTagRow}>
                    <Text style={styles.flashcardTag}>{bookmarks[flashcardIndex].tag}</Text>
                    <Text style={styles.tapToFlipText}>Tap to {isFlipped ? 'Show Question' : 'Reveal Answer'}</Text>
                  </View>

                  <Text style={[styles.flashcardTitle, { color: colors.text }]}>
                    {bookmarks[flashcardIndex].title}
                  </Text>

                  {isFlipped ? (
                    <View style={styles.answerBox}>
                      <Text style={styles.answerLabel}>Explanation / Solution:</Text>
                      <Text style={[styles.answerText, { color: colors.textSecondary }]}>
                        {bookmarks[flashcardIndex].content}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.questionHintBox}>
                      <Ionicons name="help-circle-outline" size={32} color={colors.primaryLight} />
                      <Text style={styles.questionHintText}>Can you answer this concept from memory?</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Flashcard Navigation */}
                <View style={styles.flashcardNavRow}>
                  <TouchableOpacity
                    style={[styles.flashcardNavBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    disabled={flashcardIndex === 0}
                    onPress={() => {
                      setFlashcardIndex((prev) => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                  >
                    <Ionicons name="arrow-back" size={18} color={flashcardIndex === 0 ? colors.textMuted : colors.text} />
                    <Text style={[styles.navBtnText, { color: flashcardIndex === 0 ? colors.textMuted : colors.text }]}>
                      Previous
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.flashcardNavBtn, styles.flashcardNextBtn]}
                    disabled={flashcardIndex === bookmarks.length - 1}
                    onPress={() => {
                      setFlashcardIndex((prev) => Math.min(bookmarks.length - 1, prev + 1));
                      setIsFlipped(false);
                    }}
                  >
                    <Text style={styles.nextBtnText}>Next Card</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          /* 2. Standard Bookmark Cards List */
          <View style={styles.list}>
            {filteredBookmarks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Bookmarks Found</Text>
                <Text style={[styles.emptyStateDesc, { color: colors.textSecondary }]}>
                  Save tricky quiz questions or click "+" to add revision notes.
                </Text>
              </View>
            ) : (
              filteredBookmarks.map((item) => (
                <View
                  key={item.id}
                  style={[styles.bookmarkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.tagPill}>
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                      <Text style={styles.dateText}>{item.date}</Text>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.cardContent, { color: colors.textSecondary }]}>{item.content}</Text>

                  {item.extra && (
                    <View style={styles.extraRow}>
                      <Ionicons name="information-circle-outline" size={14} color={colors.primaryLight} />
                      <Text style={[styles.extraText, { color: colors.primaryLight }]}>{item.extra}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Note Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create Quick Revision Note</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Note Title / Concept</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Docker multi-stage build command"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.fieldLabel}>Category / Tag</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. DevOps, C++, Robotics"
              placeholderTextColor={colors.textMuted}
              value={newTag}
              onChangeText={setNewTag}
            />

            <Text style={styles.fieldLabel}>Explanation / Details</Text>
            <TextInput
              style={[styles.modalTextArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Write summary or key formula to remember..."
              placeholderTextColor={colors.textMuted}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.submitModalBtn} onPress={handleAddNote}>
              <Text style={styles.submitModalText}>Save to Bookmarks</Text>
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
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  tabScroll: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tabChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: FontSize.xs,
  },
  list: {
    gap: Spacing.md,
  },
  bookmarkCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tagPill: {
    backgroundColor: '#8B5CF622',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  tagText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#8B5CF6',
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  cardContent: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginBottom: 6,
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#33415522',
    paddingTop: 6,
    marginTop: 4,
  },
  extraText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyStateTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  emptyStateDesc: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  // Flashcard mode
  flashcardContainer: {
    gap: Spacing.md,
  },
  flashcardCounter: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  flashcardCard: {
    minHeight: 220,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  flashcardTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flashcardTag: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.primaryLight,
    textTransform: 'uppercase',
  },
  tapToFlipText: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  flashcardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  questionHintBox: {
    alignItems: 'center',
    gap: 6,
  },
  questionHintText: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
  },
  answerBox: {
    backgroundColor: '#10B9811A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#10B98144',
  },
  answerLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#10B981',
    marginBottom: 4,
  },
  answerText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  flashcardNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  flashcardNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  flashcardNextBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  navBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  nextBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: Spacing.xl,
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  modalTextArea: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitModalBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  submitModalText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
