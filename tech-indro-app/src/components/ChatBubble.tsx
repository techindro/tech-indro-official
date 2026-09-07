/**
 * ChatBubble component — user & AI message bubbles
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

export interface ChatBubbleProps {
  message: Message | string;
  isUser?: boolean;
  isLoading?: boolean;
}

export default function ChatBubble({ message, isUser: isUserProp, isLoading }: ChatBubbleProps) {
  const isUser = typeof isUserProp === 'boolean'
    ? isUserProp
    : (typeof message === 'object' && message?.role === 'user');

  const textContent = typeof message === 'string' ? message : message?.text || '';
  const timestamp = typeof message === 'object' ? message?.timestamp : undefined;

  if (isLoading) {
    return (
      <View style={[styles.row]}>
        <View style={styles.aiAvatar}>
          <Ionicons name="hardware-chip" size={16} color={Colors.white} />
        </View>
        <View style={[styles.bubble, styles.aiBubble]}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (rawText: string) => {
    if (!rawText) return null;
    const text = String(rawText);
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '');
        return (
          <View key={i} style={styles.codeBlock}>
            <Text style={styles.codeText}>{code.trim()}</Text>
          </View>
        );
      }
      // Bold text
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <Text key={i} style={isUser ? styles.userText : styles.aiText}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return (
                <Text key={j} style={{ fontWeight: FontWeight.bold }}>
                  {bp.slice(2, -2)}
                </Text>
              );
            }
            return bp;
          })}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="hardware-chip" size={16} color={Colors.white} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {renderContent(textContent)}
        {timestamp && (
          <Text style={[styles.timestampText, isUser && styles.userTimestampText]}>
            {timestamp}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  rowUser: {
    flexDirection: 'row-reverse',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  userText: {
    color: Colors.white,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  aiText: {
    color: Colors.text,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestampText: {
    color: 'rgba(255,255,255,0.7)',
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
    opacity: 0.4,
  },
  dot1: { opacity: 0.8 },
  dot2: { opacity: 0.5 },
  dot3: { opacity: 0.3 },
});
