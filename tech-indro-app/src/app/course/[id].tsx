/**
 * Course Detail Screen — Dynamic route [id]
 * Shows full course info with modules, resources, and enroll CTA
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors, {
  BorderRadius,
  FontSize,
  FontWeight,
  Spacing,
} from '@/constants/Colors';
import { fetchCourseById, type Course } from '@/services/api';
import { useTheme } from '@/hooks/useTheme';

const RESOURCE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  youtube: 'logo-youtube',
  website: 'globe-outline',
  github: 'logo-github',
  certificate: 'ribbon-outline',
  research: 'document-text-outline',
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  useEffect(() => {
    if (id) loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'Course not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.imageOverlay}
          />
          {/* Top Floating Controls */}
          <View style={{ position: 'absolute', top: 46, left: Spacing.lg, right: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Back Button */}
            <TouchableOpacity
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>

            {/* Official Brand Logo */}
            <View style={{ paddingHorizontal: 4, paddingVertical: 4 }}>
              <Image
                source={require('@/assets/images/tech-indro-logo.png')}
                style={{ width: 90, height: 22 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Duration Badge Bottom Left */}
          <View style={{ position: 'absolute', bottom: 58, left: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.pill, elevation: 3 }}>
            <Ionicons name="time-outline" size={14} color={Colors.primary} />
            <Text style={styles.durationText}>{course.duration}</Text>
          </View>
          <Text style={styles.imageTitle}>{course.title}</Text>
        </View>

        <View style={styles.content}>
          {/* Instructor */}
          <View style={styles.instructorRow}>
            <View style={[styles.instructorAvatar, { backgroundColor: colors.secondary }]}>
              <Ionicons name="hardware-chip" size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={[styles.instructorName, { color: colors.text }]}>{course.instructor}</Text>
              <Text style={[styles.instructorLabel, { color: colors.textMuted }]}>Instructor</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>{course.description}</Text>

          {/* Perks */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>What You'll Get</Text>
          <View style={styles.perksContainer}>
            {course.perks.map((perk, i) => (
              <View key={i} style={styles.perkItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={[styles.perkText, { color: colors.textSecondary }]}>{perk}</Text>
              </View>
            ))}
          </View>

          {/* Modules */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Course Modules ({course.modules.length})
          </Text>
          {course.modules.map((mod, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.moduleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpandedModule(expandedModule === i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={styles.moduleHeader}>
                <View style={styles.moduleNumber}>
                  <Text style={styles.moduleNumberText}>{i + 1}</Text>
                </View>
                <Text style={[styles.moduleTitle, { color: colors.text }]}>{mod.title}</Text>
                <Ionicons
                  name={expandedModule === i ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              {expandedModule === i && (
                <Text style={[styles.moduleDesc, { color: colors.textMuted }]}>{mod.desc}</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Resources */}
          {course.resources && course.resources.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Learning Resources</Text>
              {course.resources.map((res, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.resourceItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => Linking.openURL(res.url)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: colors.primary + '18' }]}>
                    <Ionicons
                      name={RESOURCE_ICONS[res.type] || 'link-outline'}
                      size={18}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={[styles.resourceTitle, { color: colors.text }]} numberOfLines={1}>
                    {res.title}
                  </Text>
                  <Ionicons name="open-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Bottom Spacer for sticky button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Enroll Button */}
      <View style={[styles.enrollContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.enrollBtn}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/checkout',
              params: {
                courseId: course.id,
                title: course.title,
                price: '999',
                instructor: course.instructor,
              },
            })
          }
        >
          <Text style={styles.enrollBtnText}>Enroll Now — ₹999</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.error,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },

  // Image Hero
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  durationText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  imageTitle: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.xl,
    right: Spacing.xl,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    lineHeight: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  // Content
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },

  // Instructor
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
  },
  instructorLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // Description
  description: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },

  // Section Label
  sectionLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },

  // Perks
  perksContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  perkText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    flex: 1,
  },

  // Modules
  moduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  moduleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleNumberText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  moduleTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textMain,
  },
  moduleDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: Spacing.md,
    paddingLeft: 44,
  },

  // Resources
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMain,
  },

  // Enroll
  enrollContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  enrollBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  enrollBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
