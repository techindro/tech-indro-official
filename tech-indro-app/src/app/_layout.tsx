/**
 * Root Layout — 5-Tab Navigation for Tech Indro App
 * Tabs: Home, Programs, AI Shikshak, Test Series, Dashboard
 * Plus sub-screens: ISRO Lab, IndroLabs, TSOC, Leaderboard, Login, Course Detail, Checkout
 * Wraps entire app in ThemeProvider with dynamic Dark / Light Mode support
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import NetworkStatusBanner from '@/components/NetworkStatusBanner';

function AppTabs() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NetworkStatusBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 62,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 10,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}
      >
        {/* 1. Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size - 2} color={color} />
            ),
          }}
        />

        {/* 2. Programs */}
        <Tabs.Screen
          name="programs"
          options={{
            title: 'Programs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size - 2} color={color} />
            ),
          }}
        />

        {/* 3. AI Mentor */}
        <Tabs.Screen
          name="ai-mentor"
          options={{
            title: 'AI Shikshak',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles" size={size - 2} color={color} />
            ),
          }}
        />

        {/* 4. Quiz / Test Series */}
        <Tabs.Screen
          name="quiz"
          options={{
            title: 'Test Series',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school-outline" size={size - 2} color={color} />
            ),
          }}
        />

        {/* 5. Dashboard */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size - 2} color={color} />
            ),
          }}
        />

        {/* Hidden feature screens */}
        <Tabs.Screen
          name="login"
          options={{
            href: null,
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
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppTabs />
    </ThemeProvider>
  );
}
