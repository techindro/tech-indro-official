/**
 * Root Layout — 5-Tab Navigation for Tech Indro App
 * Tabs: Home, Programs, AI Shikshak, Test Series, Dashboard
 * Plus sub-screens: ISRO Lab, IndroLabs, TSOC, Leaderboard, Login, Course Detail, Checkout
 * Wraps entire app in ThemeProvider with dynamic Dark / Light Mode support
 */
import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import NetworkStatusBanner from '@/components/NetworkStatusBanner';

function AppTabs() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = "Tech Indro - India's #1 AI & Robotics Learning Platform";
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.href = '/favicon.png';

      let shortcut: HTMLLinkElement | null = document.querySelector("link[rel~='shortcut']");
      if (!shortcut) {
        shortcut = document.createElement('link');
        shortcut.rel = 'shortcut icon';
        document.head.appendChild(shortcut);
      }
      shortcut.href = '/favicon.ico';
    }
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NetworkStatusBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: isDark ? '#94a3b8' : '#475569',
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: Platform.OS === 'web' ? 62 : 64 + Math.max(insets.bottom, 16),
            paddingBottom: Platform.OS === 'web' ? 4 : Math.max(insets.bottom, 16) + 4,
            paddingTop: 6,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 10,
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: '600',
            lineHeight: 13,
            marginTop: 1,
            marginBottom: 2,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
          },
        }}
      >
        {/* 1. Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={20} color={color} />
            ),
          }}
        />

        {/* 2. Programs */}
        <Tabs.Screen
          name="programs"
          options={{
            title: 'Programs',
            tabBarIcon: ({ color }) => (
              <Ionicons name="book-outline" size={20} color={color} />
            ),
          }}
        />

        {/* 3. AI Mentor */}
        <Tabs.Screen
          name="ai-mentor"
          options={{
            title: 'AI Shikshak',
            tabBarIcon: ({ color }) => (
              <Ionicons name="sparkles" size={20} color={color} />
            ),
          }}
        />

        {/* 4. Quiz / Test Series */}
        <Tabs.Screen
          name="quiz"
          options={{
            title: 'Test Series',
            tabBarIcon: ({ color }) => (
              <Ionicons name="school-outline" size={20} color={color} />
            ),
          }}
        />

        {/* 5. Dashboard */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle-outline" size={20} color={color} />
            ),
          }}
        />

        {/* Hidden feature screens */}
        <Tabs.Screen
          name="login"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="course/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="tsoc"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="isro-lab"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="indrolabs"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="checkout"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="certificate"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="support"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="ai-tools"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="system-design"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="interview-prep"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="code-clash"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    ...Ionicons.font,
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppTabs />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
