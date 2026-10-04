/**
 * DuoMascotSelector Component
 * Horizontal buddy picker allowing user to activate custom mentor voices
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MascotId } from '@/types/gamification';
import { MASCOTS } from '@/data/gamifiedLessons';

interface DuoMascotSelectorProps {
  activeMascotKey: MascotId;
  isDark: boolean;
  onSelectMascot: (id: MascotId) => void;
}

export const DuoMascotSelector: React.FC<DuoMascotSelectorProps> = React.memo(
  ({ activeMascotKey, isDark, onSelectMascot }) => {
    return (
      <View style={styles.section}>
        <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Pick Your Companion
        </Text>
        <Text style={styles.subtitle}>Tap a hero to change your mentor voice (Sarvam AI)</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {Object.keys(MASCOTS).map((key) => {
            const m = MASCOTS[key as MascotId];
            const isSelected = m.id === activeMascotKey;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => onSelectMascot(m.id)}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isSelected ? m.accentColor : isDark ? '#374151' : '#E5E7EB',
                    borderWidth: isSelected ? 2.5 : 1.5,
                    borderBottomWidth: isSelected ? 5 : 2,
                    borderBottomColor: isSelected ? m.accentColor : isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <Image source={m.avatar} style={styles.avatar} resizeMode="cover" />
                <Text style={[styles.name, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                  {m.name}
                </Text>
                <Text style={styles.role} numberOfLines={1}>
                  {m.role.split('&')[0]}
                </Text>

                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: m.accentColor }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  scrollList: {
    gap: 10,
    paddingBottom: 10,
  },
  card: {
    width: 105,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
  },
  name: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  role: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
