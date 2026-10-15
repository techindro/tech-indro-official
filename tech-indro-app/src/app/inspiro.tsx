import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

interface InspiroPost {
  id: string;
  author: string;
  role: string;
  avatarText: string;
  timeAgo: string;
  projectTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  techStack: string[];
  likes: number;
  commentsCount: number;
}

interface PeerChat {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

const FEED_POSTS: InspiroPost[] = [
  {
    id: 'insp-1',
    author: 'Ananya Sharma',
    role: 'Full Stack Fellow @ TSOC',
    avatarText: 'AS',
    timeAgo: '22m ago',
    projectTitle: 'MediConnect: AI-Assisted Telehealth Triage',
    icon: 'rocket-outline',
    description: 'Built with Next.js 15, FastAPI, and Med-PaLM 2 fine-tuned model. Triages emergency cases into RED/YELLOW/GREEN levels under 400ms.',
    techStack: ['Next.js', 'FastAPI', 'PyTorch', 'TailwindCSS'],
    likes: 89,
    commentsCount: 16,
  },
  {
    id: 'insp-2',
    author: 'Vikramaditya Rao',
    role: 'Autonomous Robotics @ IIT Roorkee',
    avatarText: 'VR',
    timeAgo: '2h ago',
    projectTitle: 'RoboRover SLAM 3D Point Cloud Visualizer',
    icon: 'hardware-chip-outline',
    description: 'ROS2 Humble + WebRTC low-latency streaming pipeline running on Raspberry Pi 5 with Intel RealSense D435i.',
    techStack: ['ROS2', 'C++', 'WebRTC', 'Python'],
    likes: 142,
    commentsCount: 28,
  },
];

const PEER_CHATS: PeerChat[] = [
  {
    id: 'peer-1',
    name: 'Ananya Sharma',
    role: 'TSOC Fellow',
    avatarText: 'AS',
    lastMessage: 'Sure, let’s sync on the Kafka consumer lag issue!',
    time: '12:40 PM',
    unread: 2,
    isOnline: true,
  },
  {
    id: 'peer-2',
    name: 'Vikramaditya Rao',
    role: 'Robotics Lead',
    avatarText: 'VR',
    lastMessage: 'Shared the ROS2 node launch file in repo.',
    time: '10:15 AM',
    unread: 0,
    isOnline: true,
  },
  {
    id: 'peer-3',
    name: 'Tanmay Saxena',
    role: 'Systems Engineer',
    avatarText: 'TS',
    lastMessage: 'Are you attending today’s System Design mock session?',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
  },
];

export default function InspiroScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
  const [feedPosts, setFeedPosts] = useState<InspiroPost[]>(FEED_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Active chat state
  const [activeChatPeer, setActiveChatPeer] = useState<PeerChat | null>(null);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'me' | 'peer'; text: string; time: string }[]>([
    { id: 'm1', sender: 'peer', text: 'Hey Rahul! Did you inspect the consumer lag on partition 2?', time: '12:35 PM' },
    { id: 'm2', sender: 'me', text: 'Yes, committing offsets synchronously was blocking the loop. Switched to commitAsync.', time: '12:38 PM' },
    { id: 'm3', sender: 'peer', text: 'Sure, let’s sync on the Kafka consumer lag issue!', time: '12:40 PM' },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  const toggleLike = (id: string) => {
    const isLiked = !!likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !isLiked }));
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      sender: 'me' as const,
      text: newMessageText.trim(),
      time: 'Just now',
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMessageText('');
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
            onPress={() => {
              if (activeChatPeer) {
                setActiveChatPeer(null);
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {activeChatPeer ? activeChatPeer.name : 'Inspiro Network'}
              </Text>
              {activeChatPeer ? (
                <View style={styles.onlinePill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.onlinePillText}>ONLINE</Text>
                </View>
              ) : (
                <View style={styles.badgePill}>
                  <Ionicons name="people" size={11} color="#10b981" />
                  <Text style={styles.badgePillText}>STUDENT SOCIAL</Text>
                </View>
              )}
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              {activeChatPeer
                ? activeChatPeer.role
                : 'Share project showcases & chat peer-to-peer'}
            </Text>
          </View>
        </View>

        {/* Tab switchers if not in individual chat room */}
        {!activeChatPeer && (
          <View style={styles.tabSwitchRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'feed' && styles.tabBtnActive]}
              onPress={() => setActiveTab('feed')}
            >
              <Ionicons
                name="newspaper-outline"
                size={16}
                color={activeTab === 'feed' ? '#ff6b35' : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'feed' ? '#ff6b35' : colors.textMuted },
                ]}
              >
                Project Showcase Feed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'chat' && styles.tabBtnActive]}
              onPress={() => setActiveTab('chat')}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={16}
                color={activeTab === 'chat' ? '#ff6b35' : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === 'chat' ? '#ff6b35' : colors.textMuted },
                ]}
              >
                Peer Chats (3)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main Content */}
      {activeChatPeer ? (
        // Individual Chat Room (WhatsApp style)
        <View style={styles.chatRoomContainer}>
          <ScrollView
            style={styles.chatMessageScroll}
            contentContainerStyle={styles.chatMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    isMe
                      ? [styles.bubbleMe, { backgroundColor: '#ff6b35' }]
                      : [
                          styles.bubblePeer,
                          { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: colors.border },
                        ],
                  ]}
                >
                  <Text style={[styles.bubbleText, { color: isMe ? '#ffffff' : colors.text }]}>
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted },
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Chat Input Bar */}
          <View
            style={[
              styles.chatInputBar,
              {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 12),
              },
            ]}
          >
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Type message to peer engineer..."
              placeholderTextColor={colors.textMuted}
              value={newMessageText}
              onChangeText={setNewMessageText}
            />
            <TouchableOpacity
              style={styles.chatSendBtn}
              onPress={handleSendMessage}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ff6b35', '#ea580c']}
                style={styles.chatSendBtnGradient}
              >
                <Ionicons name="send" size={16} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : activeTab === 'feed' ? (
        // Project Showcase Feed
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedScroll}
        >
          {feedPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            return (
              <View
                key={post.id}
                style={[
                  styles.feedCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.authorRow}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorAvatarText}>{post.avatarText}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.authorName, { color: colors.text }]}>{post.author}</Text>
                    <Text style={[styles.authorRole, { color: colors.textMuted }]}>{post.role}</Text>
                  </View>
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{post.timeAgo}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Ionicons name={post.icon} size={16} color="#ff6b35" />
                  <Text style={[styles.projectTitle, { color: colors.text, marginBottom: 0 }]}>
                    {post.projectTitle}
                  </Text>
                </View>
                <Text style={[styles.projectDesc, { color: colors.textMuted }]}>{post.description}</Text>

                <View style={styles.techStackRow}>
                  {post.techStack.map((tech) => (
                    <View
                      key={tech}
                      style={[
                        styles.techPill,
                        { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
                      ]}
                    >
                      <Text style={[styles.techPillText, { color: colors.text }]}>{tech}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <TouchableOpacity
                    style={styles.footerAction}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={18}
                      color={isLiked ? '#ef4444' : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.footerActionText,
                        { color: isLiked ? '#ef4444' : colors.textMuted },
                      ]}
                    >
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.footerAction}>
                    <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
                    <Text style={[styles.footerActionText, { color: colors.textMuted }]}>
                      {post.commentsCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.footerAction, { marginLeft: 'auto' }]}
                    onPress={() => {
                      setActiveTab('chat');
                    }}
                  >
                    <Ionicons name="paper-plane-outline" size={16} color="#ff6b35" />
                    <Text style={[styles.footerActionText, { color: '#ff6b35', fontWeight: '700' }]}>
                      Collaborate
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        // Peer Chat List
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.peerListScroll}
        >
          {PEER_CHATS.map((peer) => (
            <TouchableOpacity
              key={peer.id}
              style={[
                styles.peerRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setActiveChatPeer(peer)}
              activeOpacity={0.8}
            >
              <View style={styles.peerAvatarBox}>
                <Text style={styles.peerAvatarText}>{peer.avatarText}</Text>
                {peer.isOnline && <View style={styles.peerOnlineIndicator} />}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[styles.peerName, { color: colors.text }]}>{peer.name}</Text>
                  <Text style={[styles.peerTime, { color: colors.textMuted }]}>{peer.time}</Text>
                </View>
                <Text style={[styles.peerRole, { color: colors.textMuted }]}>{peer.role}</Text>
                <Text style={[styles.peerMsg, { color: colors.text }]} numberOfLines={1}>
                  {peer.lastMessage}
                </Text>
              </View>

              {peer.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{peer.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlinePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  tabSwitchRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100,116,139,0.1)',
    marginTop: 6,
    paddingTop: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#ff6b35',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  feedScroll: {
    padding: 16,
    gap: 12,
  },
  feedCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  authorRole: {
    fontSize: 10.5,
  },
  timeText: {
    fontSize: 10,
  },
  projectTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  techStackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  techPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 16,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  peerListScroll: {
    padding: 16,
    gap: 10,
  },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  peerAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  peerAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  peerOnlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  peerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  peerTime: {
    fontSize: 10.5,
  },
  peerRole: {
    fontSize: 11,
    marginBottom: 2,
  },
  peerMsg: {
    fontSize: 12,
    opacity: 0.9,
  },
  unreadBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  chatRoomContainer: {
    flex: 1,
  },
  chatMessageScroll: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    gap: 10,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubblePeer: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTime: {
    fontSize: 9.5,
    marginTop: 4,
    textAlign: 'right',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
  },
  chatSendBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatSendBtnGradient: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
