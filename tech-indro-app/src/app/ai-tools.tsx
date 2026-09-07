/**
 * AI Tools Directory Screen — Tech Indro
 * Curated catalog of 40+ AI Developer Tools (Coding, Design, Audio/Video, Productivity, Research)
 * Features live search, category pills, bookmarking to offline revision hub, and external linking.
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

interface AiTool {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  icon: string;
}

const ALL_TOOLS: AiTool[] = require('../../assets/data/ai-tools.json');

function getToolIcon(tool: AiTool): { name: any; color: string; bg: string } {
  const name = tool.name.toLowerCase();
  const cat = tool.category.toLowerCase();
  if (name.includes('cursor') || name.includes('github') || name.includes('code') || cat === 'coding') {
    return { name: 'code-slash', color: '#6366F1', bg: '#6366F122' };
  }
  if (name.includes('design') || name.includes('v0') || name.includes('midjourney') || cat === 'design') {
    return { name: 'color-palette', color: '#EC4899', bg: '#EC489922' };
  }
  if (cat === 'video' || name.includes('sora') || name.includes('runway') || name.includes('pika')) {
    return { name: 'videocam', color: '#EF4444', bg: '#EF444422' };
  }
  if (cat === 'audio' || name.includes('eleven') || name.includes('suno') || name.includes('voice')) {
    return { name: 'musical-notes', color: '#F59E0B', bg: '#F59E0B22' };
  }
  if (cat === 'research' || name.includes('perplexity') || name.includes('scholar') || name.includes('consensus')) {
    return { name: 'flask', color: '#10B981', bg: '#10B98122' };
  }
  if (name.includes('notion') || cat === 'productivity') {
    return { name: 'briefcase', color: '#38BDF8', bg: '#38BDF822' };
  }
  return { name: 'sparkles', color: '#8B5CF6', bg: '#8B5CF622' };
}

const CATEGORIES = [
  { label: 'All', icon: 'apps-outline' },
  { label: 'Coding', icon: 'code-slash-outline' },
  { label: 'Design', icon: 'color-palette-outline' },
  { label: 'Video', icon: 'videocam-outline' },
  { label: 'Audio', icon: 'musical-notes-outline' },
  { label: 'Productivity', icon: 'flash-outline' },
  { label: 'Research', icon: 'flask-outline' },
];

export default function AiToolsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Filter tools by search and category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        activeCategory === 'All' ||
        tool.category.toLowerCase().includes(activeCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Unable to open link', url);
      });
    }
  };

  const handleBookmark = async (tool: AiTool) => {
    try {
      const stored = await AsyncStorage.getItem('@user_bookmarks');
      const bookmarks = stored ? JSON.parse(stored) : [];

      if (bookmarkedIds.includes(tool.id)) {
        const filtered = bookmarks.filter((b: any) => b.id !== tool.id);
        await AsyncStorage.setItem('@user_bookmarks', JSON.stringify(filtered));
        setBookmarkedIds(bookmarkedIds.filter((id) => id !== tool.id));
        return;
      }

      const newBookmark = {
        id: tool.id,
        term: tool.name,
        category: tool.category,
        explanation: tool.description,
        timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      bookmarks.unshift(newBookmark);
      await AsyncStorage.setItem('@user_bookmarks', JSON.stringify(bookmarks));
      setBookmarkedIds([...bookmarkedIds, tool.id]);
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Developer Tools</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Curated directory of 40+ cutting-edge AI stack platforms
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarksShortcutBtn}
          onPress={() => router.push('/bookmarks')}
        >
          <Ionicons name="bookmarks-outline" size={20} color={Colors.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name, category or stack..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isSelected = activeCategory === item.label;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                ]}
                onPress={() => setActiveCategory(item.label)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={14}
                  color={isSelected ? '#fff' : colors.textMuted}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: colors.textSecondary },
                    isSelected && { color: '#fff', fontWeight: 'bold' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results Header */}
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: colors.textMuted }]}>
          Showing {filteredTools.length} of {ALL_TOOLS.length} AI Platforms
        </Text>
        <View style={styles.verifiedTag}>
          <Ionicons name="shield-checkmark" size={12} color="#10B981" />
          <Text style={styles.verifiedText}>Verified Links</Text>
        </View>
      </View>

      {/* Tools List */}
      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSaved = bookmarkedIds.includes(item.id);
          const iconConfig = getToolIcon(item);
          return (
            <View style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.toolTopRow}>
                <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.name} size={22} color={iconConfig.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.toolName, { color: colors.text }]}>{item.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={[styles.toolDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={[styles.toolBottomRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => handleBookmark(item)}
                >
                  <Ionicons
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={15}
                    color={isSaved ? '#10B981' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.saveBtnText,
                      { color: isSaved ? '#10B981' : colors.textMuted },
                    ]}
                  >
                    {isSaved ? 'Saved' : 'Bookmark'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.visitBtn}
                  onPress={() => handleOpenLink(item.link)}
                >
                  <Text style={styles.visitBtnText}>Visit Platform</Text>
                  <Ionicons name="open-outline" size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  bookmarksShortcutBtn: {
    padding: Spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  categoriesContainer: {
    marginVertical: Spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: 11,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B9811A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xs,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  toolCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  toolTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245,158,11,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  categoryBadge: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  toolDesc: {
    fontSize: FontSize.xs,
    lineHeight: 16,
    marginTop: 3,
  },
  toolBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    marginTop: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  saveBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  visitBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  visitBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
});
