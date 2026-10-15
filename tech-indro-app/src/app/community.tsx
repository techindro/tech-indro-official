import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatarText: string;
  timeAgo: string;
  tag: string;
  tagColor: string;
  upvotes: number;
  repliesCount: number;
  hasAiAnswer: boolean;
  aiAnswerSnippet?: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'comm-1',
    title: 'How to handle WebSocket disconnections gracefully in React Native chat apps?',
    content: 'We are building a real-time chat with reconnect backoff. On network switch from Wi-Fi to mobile data, socket state is hanging.',
    author: 'Aakash Verma',
    avatarText: 'AV',
    timeAgo: '15m ago',
    tag: 'React Native',
    tagColor: '#38bdf8',
    upvotes: 24,
    repliesCount: 6,
    hasAiAnswer: true,
    aiAnswerSnippet: 'Use exponential backoff with jitter on reconnect, and listen to NetInfo.addEventListener to re-establish handshakes immediately when interface changes.',
  },
  {
    id: 'comm-2',
    title: 'What is the optimal chunk size and overlap for RAG embeddings with LangChain?',
    content: 'For our college PDF chatbot, chunk size 1000 seems too large and loses context precision. What does Tech Indro recommend?',
    author: 'Sneha Patel',
    avatarText: 'SP',
    timeAgo: '1h ago',
    tag: 'AI / LLM',
    tagColor: '#a855f7',
    upvotes: 41,
    repliesCount: 9,
    hasAiAnswer: true,
    aiAnswerSnippet: 'A chunk size of 400-512 tokens with 50-token overlap along with recursive character splitting provides the best precision-to-recall ratio for technical manuals.',
  },
  {
    id: 'comm-3',
    title: 'Uber Driver Matching system: Redis Geospatial vs Google S2 / H3 hex grid?',
    content: 'In interview prep batch, we were comparing GEOADD vs Uber H3 hex cells for surge pricing and driver proximity queries.',
    author: 'Rohan Deshmukh',
    avatarText: 'RD',
    timeAgo: '3h ago',
    tag: 'System Design',
    tagColor: '#ea580c',
    upvotes: 68,
    repliesCount: 14,
    hasAiAnswer: false,
  },
  {
    id: 'comm-4',
    title: 'Difference between Monotonic Stack vs Two Pointers in Trap Rain Water?',
    content: 'Can someone explain with time/space complexity why two-pointer approach reduces space from O(N) to O(1)?',
    author: 'Priya Sundaram',
    avatarText: 'PS',
    timeAgo: '5h ago',
    tag: 'DSA & Algorithms',
    tagColor: '#10b981',
    upvotes: 35,
    repliesCount: 8,
    hasAiAnswer: true,
    aiAnswerSnippet: 'The two-pointer approach maintains left_max and right_max dynamically, calculating water height based on the strictly limiting wall without needing array storage.',
  },
];

const TAGS = ['All', 'React Native', 'AI / LLM', 'System Design', 'DSA & Algorithms', 'Career'];

export default function CommunityScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [askModalVisible, setAskModalVisible] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('React Native');

  const filteredPosts = posts.filter((p) => {
    const matchesTag = selectedTag === 'All' || p.tag === selectedTag;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const toggleUpvote = (id: string) => {
    const isUpvoted = !!upvotedIds[id];
    setUpvotedIds((prev) => ({ ...prev, [id]: !isUpvoted }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, upvotes: p.upvotes + (isUpvoted ? -1 : 1) } : p
      )
    );
  };

  const handlePostDoubt = () => {
    if (!newTitle.trim()) {
      Alert.alert('Please enter a title for your doubt');
      return;
    }
    const newEntry: CommunityPost = {
      id: `comm-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim() || 'No additional details provided.',
      author: user?.name || 'Rahul Sharma',
      avatarText: 'RS',
      timeAgo: 'Just now',
      tag: newTag,
      tagColor: '#ff6b35',
      upvotes: 1,
      repliesCount: 0,
      hasAiAnswer: true,
      aiAnswerSnippet: 'Tech Indro AI Shikshak is analyzing your question... Initial suggestion: Check your network bindings and state dependencies.',
    };

    setPosts([newEntry, ...posts]);
    setNewTitle('');
    setNewContent('');
    setAskModalVisible(false);
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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Indro Community</Text>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={10} color="#ea580c" />
                <Text style={styles.aiBadgeText}>AI AUTO-ASSIST</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Collaborative engineering forum & peer doubt resolution
            </Text>
          </View>
          <TouchableOpacity
            style={styles.askBtn}
            onPress={() => setAskModalVisible(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#ff6b35', '#ea580c']}
              style={styles.askBtnGradient}
            >
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={styles.askBtnText}>Ask</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9', borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search questions, errors, concepts..."
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

        {/* Tag Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          {TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: isSelected
                      ? '#ff6b35'
                      : isDark
                      ? '#1e293b'
                      : '#f1f5f9',
                    borderColor: isSelected ? '#ff6b35' : colors.border,
                  },
                ]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    { color: isSelected ? '#ffffff' : colors.text },
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
      >
        {filteredPosts.map((post) => {
          const isUpvoted = !!upvotedIds[post.id];
          return (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.postMetaRow}>
                <View style={styles.authorBadge}>
                  <Text style={styles.authorBadgeText}>{post.avatarText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authorName, { color: colors.text }]}>{post.author}</Text>
                  <Text style={[styles.postTime, { color: colors.textMuted }]}>{post.timeAgo}</Text>
                </View>
                <View style={[styles.postTagPill, { backgroundColor: `${post.tagColor}18` }]}>
                  <Text style={[styles.postTagText, { color: post.tagColor }]}>{post.tag}</Text>
                </View>
              </View>

              <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
              <Text style={[styles.postContent, { color: colors.textMuted }]} numberOfLines={3}>
                {post.content}
              </Text>

              {/* AI Auto-Answer Highlight Box */}
              {post.hasAiAnswer && post.aiAnswerSnippet && (
                <View
                  style={[
                    styles.aiSnippetBox,
                    {
                      backgroundColor: isDark ? 'rgba(234, 88, 12, 0.08)' : '#fff7ed',
                      borderColor: isDark ? '#854d0e' : '#fed7aa',
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Ionicons name="sparkles" size={13} color="#ea580c" />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#ea580c' }}>
                      AI Shikshak Instant Solution
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.text, lineHeight: 18 }}>
                    {post.aiAnswerSnippet}
                  </Text>
                </View>
              )}

              {/* Actions Row */}
              <View style={[styles.postActionsRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isUpvoted && { backgroundColor: isDark ? '#2e1808' : '#fff7ed' },
                  ]}
                  onPress={() => toggleUpvote(post.id)}
                >
                  <Ionicons
                    name={isUpvoted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
                    size={18}
                    color={isUpvoted ? '#ea580c' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: isUpvoted ? '#ea580c' : colors.textMuted },
                    ]}
                  >
                    {post.upvotes} Upvotes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.actionText, { color: colors.textMuted }]}>
                    {post.repliesCount} Answers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { marginLeft: 'auto' }]}
                  onPress={() => router.push('/ai-mentor')}
                >
                  <Ionicons name="sparkles-outline" size={15} color="#9333ea" />
                  <Text style={[styles.actionText, { color: '#9333ea', fontWeight: '700' }]}>
                    Ask Rohini
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Ask Doubt Modal */}
      <Modal visible={askModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ask Community & AI</Text>
              <TouchableOpacity onPress={() => setAskModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border },
              ]}
              placeholder="What is your question or error title?"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={[
                styles.modalTextarea,
                { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border },
              ]}
              multiline
              placeholder="Describe the bug, paste code snippet, or explain what you tried..."
              placeholderTextColor={colors.textMuted}
              value={newContent}
              onChangeText={setNewContent}
            />

            <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
              {['React Native', 'AI / LLM', 'System Design', 'DSA & Algorithms'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.tagSelectChip,
                    {
                      backgroundColor: newTag === t ? '#ff6b35' : isDark ? '#1e293b' : '#f1f5f9',
                      borderColor: newTag === t ? '#ff6b35' : colors.border,
                    },
                  ]}
                  onPress={() => setNewTag(t)}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: newTag === t ? '#ffffff' : colors.text,
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handlePostDoubt}>
              <LinearGradient
                colors={['#ff6b35', '#ea580c']}
                style={styles.modalSubmitGradient}
              >
                <Text style={styles.modalSubmitText}>Post to Community & Run AI Auto-Assist</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
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
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  askBtn: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  askBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  askBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
  },
  tagScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  feedScroll: {
    padding: 16,
    gap: 12,
  },
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  postMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  postTime: {
    fontSize: 10.5,
  },
  postTagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  postTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  postTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    lineHeight: 20,
    marginBottom: 6,
  },
  postContent: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  aiSnippetBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    borderRadius: 14,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    marginBottom: 10,
  },
  modalTextarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    height: 100,
    textAlignVertical: 'top',
  },
  tagSelectChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  modalSubmitBtn: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  modalSubmitGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
