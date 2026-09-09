/**
 * Programs/Courses Listing Screen
 * Matches website's programs.html with search, filters, and course cards
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors, {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/constants/Colors';
import { fetchCourses, type Course } from '@/services/api';
import CourseCard from '@/components/CourseCard';
import HamburgerDrawer from '@/components/HamburgerDrawer';
import { useTheme } from '@/hooks/useTheme';

const FILTERS = [
  { label: 'All', key: 'all' },
  { label: 'Coding & AI', key: 'coding' },
  { label: 'Life & Health', key: 'life' },
  { label: 'Business', key: 'business' },
  { label: 'Communication', key: 'communication' },
];

export default function ProgramsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadCourses = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Filter & Search logic
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter((c) => {
        const t = c.title.toLowerCase() + ' ' + c.description.toLowerCase();
        switch (activeFilter) {
          case 'coding':
            return /coding|ai|machine|python|web|hack|data|dsa|full.?stack|isro|cyber|code|software|devops|vlsi|robotics|sql|app|android|ios|agentic/i.test(t);
          case 'life':
            return /health|fitness|mental|bio|life|gym|yoga|discipline|physical/i.test(t);
          case 'business':
            return /business|startup|marketing|sales|entrepreneur|founder|freelanc/i.test(t);
          case 'communication':
            return /english|communication|hindu|interview|speak|fluency|express|paper|research/i.test(t);
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    return result;
  }, [courses, activeFilter, searchQuery]);

  const renderCourse = ({ item }: { item: Course }) => (
    <CourseCard
      course={item}
      onPress={() =>
        router.push({ pathname: '/course/[id]', params: { id: item.id } })
      }
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'web' ? Spacing.lg : Math.max(insets.top, 40) + 10,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => router.push('/')}>
            <Image
              source={require('@/assets/images/tech-indro-square-logo.png')}
              style={{ width: 34, height: 34, borderRadius: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, letterSpacing: 0.5 }}>TECH INDRO</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary + '33' }}>
              <Ionicons name="sparkles" size={12} color={Colors.primary} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 }}>COURSES & BOOTCAMPS</Text>
            </View>
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
              activeOpacity={0.7}
              accessibilityLabel="Open Navigation Menu"
            >
              <Ionicons name="menu-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explore All Programs</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Everything you need from zero to one. Taught by Multilingual AI Agents!
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search programs (e.g. Machine Learning...)"
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterPill,
                activeFilter === item.key && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter(item.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === item.key && styles.filterPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Course List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Programs...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadCourses()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourse}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadCourses(true)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No programs found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}

      {/* Hamburger Menu Drawer */}
      <HamburgerDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textMain,
    height: '100%',
  },
  clearBtn: {
    padding: Spacing.xs,
  },

  // Filters
  filtersContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filtersScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterPill: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMain,
  },
  filterPillTextActive: {
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.huge,
  },

  // States
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.error,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  retryBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
});
