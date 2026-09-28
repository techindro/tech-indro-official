/**
 * Latest Tech Jobs & Internships Screen — Tech Indro Mobile
 * Real-time tech job opportunities, industry internships, and IIT/IISc research fellowships
 * with tier filtering (FAANG, HFT, Startups, Labs), search, and 1-tap direct apply.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { getJobs, Job } from '@/services/api';

type OpportunityType = '' | 'job' | 'internship' | 'research-internship';

interface TierOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TIERS: TierOption[] = [
  { id: '', label: 'All Tiers', icon: 'layers-outline' },
  { id: 'research-institutes', label: 'IITs & IISc Labs', icon: 'flask-outline' },
  { id: 'faang', label: 'FAANG & Big Tech', icon: 'logo-google' },
  { id: 'hft-quant', label: 'HFT & Quant', icon: 'trending-up-outline' },
  { id: 'tier-1-product', label: 'Tier-1 Product', icon: 'cube-outline' },
  { id: 'startups', label: 'High-Growth Startups', icon: 'rocket-outline' },
];

const LOCATIONS = ['All', 'Remote', 'Bengaluru', 'Hyderabad', 'Delhi NCR', 'Pune', 'Mumbai'];

export default function JobsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<OpportunityType>('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set());

  // Load saved bookmarks
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('tech_indro_bookmarked_jobs');
        if (saved) {
          const list: string[] = JSON.parse(saved);
          setBookmarkedJobIds(new Set(list));
        }
      } catch (e) {
        // Ignore
      }
    })();
  }, []);

  const toggleBookmark = async (jobId: string) => {
    const next = new Set(bookmarkedJobIds);
    if (next.has(jobId)) {
      next.delete(jobId);
    } else {
      next.add(jobId);
    }
    setBookmarkedJobIds(next);
    try {
      await AsyncStorage.setItem(
        'tech_indro_bookmarked_jobs',
        JSON.stringify(Array.from(next))
      );
    } catch (e) {
      // Ignore
    }
  };

  const fetchJobList = useCallback(async () => {
    try {
      const res = await getJobs({
        type: selectedType || undefined,
        tier: selectedTier || undefined,
        location: selectedLocation === 'All' ? undefined : selectedLocation,
        search: searchQuery.trim() || undefined,
        limit: 30,
      });
      setJobs(res.jobs || []);
    } catch (err) {
      // Fallback handled in service
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedType, selectedTier, selectedLocation, searchQuery]);

  useEffect(() => {
    setLoading(true);
    const delayTimer = setTimeout(() => {
      fetchJobList();
    }, 250);
    return () => clearTimeout(delayTimer);
  }, [fetchJobList]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobList();
  };

  const handleApply = async (url: string, title: string) => {
    if (!url || url === '#') {
      Alert.alert('Notice', `Application details for ${title} will be active shortly.`);
      return;
    }
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (e) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const handleShare = async (job: Job) => {
    try {
      await Share.share({
        title: job.title,
        message: `Check out this open tech role at ${job.company}: "${job.title}" (${job.salary || 'Competitive Salary'}). Apply here: ${job.url || 'https://tech-indro-official.vercel.app'}`,
      });
    } catch (e) {
      // Ignore
    }
  };

  const getOppBadge = (type?: string, oppType?: string) => {
    if (oppType === 'research-internship' || (type || '').toLowerCase().includes('research')) {
      return { label: 'Research Fellowship', bg: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', icon: 'flask' as const };
    }
    if (oppType === 'internship' || (type || '').toLowerCase().includes('intern')) {
      return { label: 'Internship', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', icon: 'school' as const };
    }
    return { label: 'Full-Time Job', bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', icon: 'briefcase' as const };
  };

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'faang':
        return 'FAANG / Tier-0';
      case 'hft-quant':
        return 'HFT & Quant';
      case 'research-institutes':
        return 'IISc / IIT Lab';
      case 'startups':
        return 'High Growth';
      case 'tier-1-product':
        return 'Tier-1 Product';
      default:
        return 'Verified Tech';
    }
  };

  const filteredJobs = jobs;

  const renderJobCard = ({ item }: { item: Job }) => {
    const opp = getOppBadge(item.type, item.opportunityType);
    const isBookmarked = bookmarkedJobIds.has(item.id || item.title);

    return (
      <View
        style={[
          styles.jobCard,
          {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0',
          },
        ]}
      >
        {/* Top Meta: Badges & Bookmark */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.badgeCluster}>
            <View style={[styles.oppBadge, { backgroundColor: opp.bg }]}>
              <Ionicons name={opp.icon} size={11} color={opp.color} style={{ marginRight: 4 }} />
              <Text style={[styles.oppBadgeText, { color: opp.color }]}>{opp.label}</Text>
            </View>
            {item.companyTier && (
              <View style={[styles.tierBadge, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
                <Text style={[styles.tierBadgeText, { color: colors.textMuted }]}>
                  {getTierLabel(item.companyTier)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionCluster}>
            <TouchableOpacity
              onPress={() => handleShare(item)}
              style={styles.iconBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-social-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleBookmark(item.id || item.title)}
              style={styles.iconBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#ff6b35' : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title & Company info */}
        <View style={styles.titleRow}>
          <View
            style={[
              styles.avatarBox,
              {
                backgroundColor: isDark ? '#334155' : '#f8fafc',
                borderColor: isDark ? '#475569' : '#e2e8f0',
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {item.company.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.companyRow}>
              <Text style={[styles.companyName, { color: colors.textMuted }]}>
                {item.company}
              </Text>
              <Ionicons name="checkmark-circle" size={13} color="#3b82f6" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>

        {/* Highlights: Salary & Location */}
        <View style={styles.detailsRow}>
          {item.salary ? (
            <View style={[styles.pill, { backgroundColor: isDark ? '#064e3b' : '#ecfdf5' }]}>
              <Ionicons name="cash-outline" size={13} color="#059669" style={{ marginRight: 4 }} />
              <Text style={[styles.pillText, { color: '#059669', fontWeight: '700' }]}>
                {item.salary}
              </Text>
            </View>
          ) : null}

          <View style={[styles.pill, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
            <Text style={[styles.pillText, { color: colors.textMuted }]}>{item.location}</Text>
          </View>
        </View>

        {/* Snippet Description */}
        {item.snippet ? (
          <Text style={[styles.snippetText, { color: isDark ? '#94a3b8' : '#475569' }]} numberOfLines={3}>
            {item.snippet}
          </Text>
        ) : null}

        {/* Footer Apply CTA */}
        <View style={styles.cardFooter}>
          <Text style={[styles.postedTimeText, { color: colors.textMuted }]}>
            {item.postedAt ? `Posted ${new Date(item.postedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : 'Actively Hiring'}
          </Text>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => handleApply(item.url, item.title)}
            activeOpacity={0.85}
          >
            <Text style={styles.applyBtnText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Tech Jobs</Text>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Verified Roles & Research Internships
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onRefresh}
          style={[styles.refreshIconBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search roles, labs, skills, or companies..."
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Opportunity Type Tab Bar */}
      <View style={styles.typeTabsWrapper}>
        <TouchableOpacity
          style={[
            styles.typeTab,
            selectedType === '' && styles.typeTabActive,
            { borderColor: selectedType === '' ? '#ff6b35' : colors.border },
          ]}
          onPress={() => setSelectedType('')}
        >
          <Text style={[styles.typeTabText, selectedType === '' && styles.typeTabTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTab,
            selectedType === 'job' && styles.typeTabActive,
            { borderColor: selectedType === 'job' ? '#ff6b35' : colors.border },
          ]}
          onPress={() => setSelectedType('job')}
        >
          <Ionicons
            name="briefcase-outline"
            size={13}
            color={selectedType === 'job' ? '#ff6b35' : colors.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.typeTabText, selectedType === 'job' && styles.typeTabTextActive]}>
            Full-Time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTab,
            selectedType === 'internship' && styles.typeTabActive,
            { borderColor: selectedType === 'internship' ? '#ff6b35' : colors.border },
          ]}
          onPress={() => setSelectedType('internship')}
        >
          <Ionicons
            name="school-outline"
            size={13}
            color={selectedType === 'internship' ? '#ff6b35' : colors.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.typeTabText, selectedType === 'internship' && styles.typeTabTextActive]}>
            Industry Interns
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTab,
            selectedType === 'research-internship' && styles.typeTabActive,
            { borderColor: selectedType === 'research-internship' ? '#7c3aed' : colors.border },
          ]}
          onPress={() => setSelectedType('research-internship')}
        >
          <Ionicons
            name="flask-outline"
            size={13}
            color={selectedType === 'research-internship' ? '#7c3aed' : colors.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.typeTabText,
              selectedType === 'research-internship' && { color: '#7c3aed', fontWeight: '700' },
            ]}
          >
            IIT/IISc Research
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Tier Filters (Horizontal Scroll) */}
      <View style={styles.tierScrollWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TIERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tierListContent}
          renderItem={({ item }) => {
            const active = selectedTier === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.tierChip,
                  active && styles.tierChipActive,
                  {
                    backgroundColor: active
                      ? isDark
                        ? '#3b82f6'
                        : '#ff6b35'
                      : isDark
                      ? '#1e293b'
                      : '#f1f5f9',
                    borderColor: active ? 'transparent' : colors.border,
                  },
                ]}
                onPress={() => setSelectedTier(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon}
                  size={12}
                  color={active ? '#ffffff' : colors.textMuted}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.tierChipText,
                    active && styles.tierChipTextActive,
                    { color: active ? '#ffffff' : colors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Location Filter Pills */}
      <View style={styles.locationScrollWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={LOCATIONS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.locationListContent}
          renderItem={({ item }) => {
            const active = selectedLocation === item;
            return (
              <TouchableOpacity
                style={[
                  styles.locationPill,
                  active && styles.locationPillActive,
                  { borderColor: active ? '#ff6b35' : colors.border },
                ]}
                onPress={() => setSelectedLocation(item)}
              >
                <Text
                  style={[
                    styles.locationPillText,
                    { color: active ? '#ff6b35' : colors.textMuted },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main Jobs List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Fetching latest tech openings & fellowships...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item, index) => item.id || `${item.title}-${index}`}
          renderItem={renderJobCard}
          contentContainerStyle={[
            styles.jobsListContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff6b35']}
              tintColor="#ff6b35"
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeaderMeta}>
              <Text style={[styles.resultsCountText, { color: colors.textMuted }]}>
                {filteredJobs.length} active opportunities found
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1e293b' : '#fee2e2' }]}>
                <Ionicons name="briefcase-outline" size={36} color="#ef4444" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No openings found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Try clearing your search query or selecting a different opportunity filter.
              </Text>
              <TouchableOpacity
                style={styles.resetFiltersBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedType('');
                  setSelectedTier('');
                  setSelectedLocation('All');
                }}
              >
                <Text style={styles.resetFiltersBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11.5,
    marginTop: 1,
  },
  refreshIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
  },
  typeTabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeTabActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
  },
  typeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  typeTabTextActive: {
    color: '#ff6b35',
    fontWeight: '700',
  },
  tierScrollWrapper: {
    marginVertical: 4,
  },
  tierListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tierChipActive: {},
  tierChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  tierChipTextActive: {
    fontWeight: '700',
  },
  locationScrollWrapper: {
    marginBottom: 8,
  },
  locationListContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  locationPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationPillActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
  jobsListContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
  },
  listHeaderMeta: {
    marginBottom: 8,
  },
  resultsCountText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  jobCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  oppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  oppBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11.5,
  },
  snippetText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    paddingTop: 12,
  },
  postedTimeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetFiltersBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetFiltersBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
