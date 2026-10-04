/**
 * DuoMascotBalloon Component
 * Renders an inline character card with dialogue speech bubble and audio play button
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DuoMascotBalloonProps {
  avatar: ImageSourcePropType;
  name: string;
  speech: string;
  accentColor: string;
  voiceText: string;
  voiceSpeaker: string;
  isDark: boolean;
  onPlayVoice: (text: string, speaker: string) => void;
}

export const DuoMascotBalloon: React.FC<DuoMascotBalloonProps> = React.memo(
  ({
    avatar,
    name,
    speech,
    accentColor,
    voiceText,
    voiceSpeaker,
    isDark,
    onPlayVoice,
  }) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderColor: accentColor,
          },
        ]}
      >
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.nameText, { color: accentColor }]}>{name}</Text>
            <TouchableOpacity
              onPress={() => onPlayVoice(voiceText, voiceSpeaker)}
              style={[styles.speakerBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.8}
              accessibilityLabel={`Listen to ${name}`}
            >
              <Ionicons name="volume-high" size={13} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.speechText,
              { color: isDark ? '#E5E7EB' : '#374151' },
            ]}
          >
            "{speech}"
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 14,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    width: SCREEN_WIDTH - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  speakerBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});
