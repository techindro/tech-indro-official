/**
 * Course Card — reusable component matching website's card design
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import type { Course } from '@/services/api';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export default function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Thumbnail */}
      <Image source={{ uri: course.image }} style={styles.thumbnail} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{course.duration}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.instructor}>
          <Ionicons name="person-outline" size={14} color={Colors.textMuted} />{' '}
          {course.instructor}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        {/* Perks */}
        <View style={styles.perksRow}>
          {course.perks.slice(0, 2).map((perk, i) => (
            <View key={i} style={styles.perkChip}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.perkText} numberOfLines={1}>
                {perk}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom */}
        <View style={styles.bottom}>
          <View style={styles.modulesCount}>
            <Ionicons name="layers-outline" size={16} color={Colors.secondary} />
            <Text style={styles.modulesText}>
              {course.modules.length} Modules
            </Text>
          </View>
          <View style={styles.exploreBtn}>
            <Text style={styles.exploreBtnText}>Explore</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.surface,
  },
  badge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
    marginBottom: Spacing.xs,
    lineHeight: 24,
  },
  instructor: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  perksRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  perkText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: FontWeight.medium,
    maxWidth: 130,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  modulesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modulesText: {
    fontSize: FontSize.sm,
    color: Colors.secondary,
    fontWeight: FontWeight.semibold,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreBtnText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
