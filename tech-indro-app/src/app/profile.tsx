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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(user?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(user?.email || 'rahul.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [college, setCollege] = useState('IIT Roorkee / Computer Science');
  const [gradYear, setGradYear] = useState('2026');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile details have been saved successfully.');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out from Tech Indro?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout?.();
          router.replace('/');
        },
      },
    ]);
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Student Profile</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Account settings, achievements & credentials
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.border }]}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Ionicons
              name={isEditing ? 'checkmark-outline' : 'create-outline'}
              size={16}
              color="#ff6b35"
            />
            <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.nameText, { color: colors.text }]}>{name}</Text>
                <Ionicons name="checkmark-circle" size={17} color="#38bdf8" />
              </View>
              <Text style={[styles.roleText, { color: '#ff6b35' }]}>
                Tech Indro Fellow • Cohort 2026
              </Text>
              <Text style={[styles.idText, { color: colors.textMuted }]}>
                Student ID: TI-2026-8841
              </Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={[styles.statsBar, { borderTopColor: colors.border }]}>
            <View style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="flame" size={16} color="#ea580c" />
                <Text style={[styles.statVal, { color: '#ea580c' }]}>14</Text>
              </View>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="sparkles" size={16} color="#10b981" />
                <Text style={[styles.statVal, { color: '#10b981' }]}>520</Text>
              </View>
              <Text style={styles.statLabel}>IndroCoins</Text>
            </View>
            <View style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="checkmark-done" size={16} color="#3b82f6" />
                <Text style={[styles.statVal, { color: '#3b82f6' }]}>64</Text>
              </View>
              <Text style={styles.statLabel}>Problems Solved</Text>
            </View>
            <View style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="ribbon" size={16} color="#a855f7" />
                <Text style={[styles.statVal, { color: '#a855f7' }]}>3</Text>
              </View>
              <Text style={styles.statLabel}>Certificates</Text>
            </View>
          </View>
        </View>

        {/* Editable Information Fields */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{name}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Email Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{email}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{phone}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>College / University</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: colors.text, borderColor: colors.border }]}
                value={college}
                onChangeText={setCollege}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{college}</Text>
            )}
          </View>
        </View>

        {/* Quick Shortcut Hubs */}
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/certificate')}
          >
            <Ionicons name="ribbon-outline" size={20} color="#a855f7" />
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Verified Certificates</Text>
            <Text style={[styles.shortcutDesc, { color: colors.textMuted }]}>View & download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/portfolio-generator' as any)}
          >
            <Ionicons name="globe-outline" size={20} color="#06b6d4" />
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Portfolio Studio</Text>
            <Text style={[styles.shortcutDesc, { color: colors.textMuted }]}>Digital Showcase</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/parent-panel' as any)}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Parent Panel</Text>
            <Text style={[styles.shortcutDesc, { color: colors.textMuted }]}>Track Oversight</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/policy' as any)}
          >
            <Ionicons name="document-text-outline" size={20} color="#64748b" />
            <Text style={[styles.shortcutTitle, { color: colors.text }]}>Policies & Terms</Text>
            <Text style={[styles.shortcutDesc, { color: colors.textMuted }]}>Refunds & Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Sign Out from Tech Indro</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#ff6b35',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '800',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  idText: {
    fontSize: 11,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  fieldGroup: {
    gap: 3,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shortcutCard: {
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  shortcutTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 4,
  },
  shortcutDesc: {
    fontSize: 10.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
