/**
 * LessonModal Component
 * Fullscreen Duolingo interactive challenge modal.
 * Supports arrange code blocks, fill-in-the-blank, and multiple choice questions.
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, Mascot } from '@/types/gamification';

interface LessonModalProps {
  visible: boolean;
  lesson: Lesson;
  activeLessonIndex: number;
  totalLessons: number;
  samosas: number;
  activeMascot: Mascot;
  selectedBlocks: string[];
  selectedOption: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  isSpeaking: boolean;
  isDark: boolean;
  onClose: () => void;
  onVoiceDialogue: () => void;
  onToggleBlock: (block: string) => void;
  onSelectOption: (option: string) => void;
  onCheckAnswer: () => void;
  onNextLesson: () => void;
  onResetChallenge: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = React.memo(
  ({
    visible,
    lesson,
    activeLessonIndex,
    totalLessons,
    samosas,
    activeMascot,
    selectedBlocks,
    selectedOption,
    isAnswered,
    isCorrect,
    isSpeaking,
    isDark,
    onClose,
    onVoiceDialogue,
    onToggleBlock,
    onSelectOption,
    onCheckAnswer,
    onNextLesson,
    onResetChallenge,
  }) => {
    const progressPercent =
      totalLessons > 0 ? ((activeLessonIndex + 1) / totalLessons) * 100 : 0;

    const isCheckDisabled =
      lesson.type === 'arrange'
        ? selectedBlocks.length === 0
        : !selectedOption;

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' },
          ]}
          edges={['top', 'bottom']}
        >
          {/* Top Header Bar */}
          <View
            style={[
              styles.header,
              { borderBottomColor: isDark ? '#1F2937' : '#E5E7EB' },
            ]}
          >
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              accessibilityLabel="Close lesson"
            >
              <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>

            {/* Duolingo Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>

            {/* Lives Counter */}
            <View style={styles.livesRow}>
              <Ionicons name="heart" size={22} color="#FF4B4B" />
              <Text style={styles.livesCount}>{samosas}</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Mascot Dialogue Speech Box */}
            <View
              style={[
                styles.dialogueBox,
                {
                  backgroundColor: isDark ? '#1F2937' : '#FFF7ED',
                  borderColor: activeMascot.accentColor,
                },
              ]}
            >
              <Image source={activeMascot.avatar} style={styles.dialogueAvatar} />
              <View style={styles.dialogueTextWrap}>
                <Text style={[styles.dialogueName, { color: activeMascot.accentColor }]}>
                  {activeMascot.name}
                </Text>
                <Text
                  style={[
                    styles.dialogueText,
                    { color: isDark ? '#F9FAFB' : '#7C2D12' },
                  ]}
                >
                  "{lesson.dialogue}"
                </Text>
              </View>
              <TouchableOpacity
                onPress={onVoiceDialogue}
                style={[styles.voiceBtn, { backgroundColor: activeMascot.accentColor }]}
                activeOpacity={0.8}
                accessibilityLabel="Play dialogue voice"
              >
                <Ionicons
                  name={isSpeaking ? 'pause' : 'volume-high'}
                  size={18}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>

            {/* Prompt */}
            <Text style={[styles.promptTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {lesson.prompt}
            </Text>

            {/* Code Snippet Box (Optional) */}
            {lesson.codeSnippet && (
              <View style={styles.codeSnippetBox}>
                <Text style={styles.codeSnippetText}>{lesson.codeSnippet}</Text>
              </View>
            )}

            {/* Puzzle Type 1: Arrange Code Blocks */}
            {lesson.type === 'arrange' && (
              <View style={styles.arrangeSection}>
                <Text style={styles.sectionSubtitle}>Your Assembled Code:</Text>
                <View
                  style={[
                    styles.dropzone,
                    {
                      borderColor: isDark ? '#374151' : '#CBD5E1',
                      backgroundColor: isDark ? '#111827' : '#F9FAFB',
                    },
                  ]}
                >
                  {selectedBlocks.length === 0 ? (
                    <Text style={styles.dropzonePlaceholder}>
                      Tap available blocks below in proper order...
                    </Text>
                  ) : (
                    <View style={styles.assembledRow}>
                      {selectedBlocks.map((blk, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => onToggleBlock(blk)}
                          style={[styles.assembledChip, { backgroundColor: activeMascot.accentColor }]}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.assembledChipText}>{blk}</Text>
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color="#FFF"
                            style={{ marginLeft: 4 }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Text style={styles.sectionSubtitle}>Available Blocks:</Text>
                <View style={styles.availableRow}>
                  {lesson.blocks?.map((blk, idx) => {
                    const isUsed = selectedBlocks.includes(blk);
                    return (
                      <TouchableOpacity
                        key={idx}
                        disabled={isUsed || isAnswered}
                        onPress={() => onToggleBlock(blk)}
                        activeOpacity={0.75}
                        style={[
                          styles.blockChip,
                          {
                            backgroundColor: isUsed
                              ? isDark
                                ? '#1F2937'
                                : '#E5E7EB'
                              : isDark
                              ? '#1F2937'
                              : '#FFFFFF',
                            borderColor: isUsed
                              ? 'transparent'
                              : isDark
                              ? '#374151'
                              : '#D1D5DB',
                            borderBottomColor: isUsed
                              ? 'transparent'
                              : isDark
                              ? '#111827'
                              : '#9CA3AF',
                            opacity: isUsed ? 0.35 : 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.blockChipText,
                            { color: isUsed ? '#9CA3AF' : isDark ? '#F9FAFB' : '#111827' },
                          ]}
                        >
                          {blk}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Puzzle Type 2 & 3: Fill Blank & Choice */}
            {(lesson.type === 'fill_blank' || lesson.type === 'choice') && (
              <View style={styles.optionsList}>
                {lesson.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let bg = isDark ? '#1F2937' : '#FFFFFF';
                  let border = isDark ? '#374151' : '#E5E7EB';
                  let bottomBorder = isDark ? '#111827' : '#CBD5E1';

                  if (isAnswered) {
                    if (opt === lesson.correctAnswer) {
                      bg = '#DCFCE7';
                      border = '#16A34A';
                      bottomBorder = '#15803D';
                    } else if (isSelected) {
                      bg = '#FEE2E2';
                      border = '#DC2626';
                      bottomBorder = '#991B1B';
                    }
                  } else if (isSelected) {
                    bg = isDark ? '#1E293B' : '#EFF6FF';
                    border = '#3B82F6';
                    bottomBorder = '#1D4ED8';
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={isAnswered}
                      onPress={() => onSelectOption(opt)}
                      activeOpacity={0.8}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: bg,
                          borderColor: border,
                          borderBottomColor: bottomBorder,
                        },
                      ]}
                    >
                      <View style={styles.optionIndexBadge}>
                        <Text style={styles.optionIndexText}>{idx + 1}</Text>
                      </View>
                      <Text
                        style={[
                          styles.optionTitle,
                          { color: isDark ? '#F9FAFB' : '#111827' },
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name={
                            isAnswered
                              ? isCorrect
                                ? 'checkmark-circle'
                                : 'close-circle'
                              : 'radio-button-on'
                          }
                          size={22}
                          color={
                            isAnswered
                              ? isCorrect
                                ? '#16A34A'
                                : '#DC2626'
                              : '#3B82F6'
                          }
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Duolingo Sticky Bottom Action Bar */}
          <View
            style={[
              styles.bottomBar,
              isAnswered && isCorrect
                ? styles.bottomBarSuccess
                : isAnswered && !isCorrect
                ? styles.bottomBarError
                : {
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
                  },
            ]}
          >
            {isAnswered ? (
              <View style={styles.resultBanner}>
                <View style={styles.resultTopRow}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={30}
                    color={isCorrect ? '#16A34A' : '#DC2626'}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.resultHeading,
                        { color: isCorrect ? '#16A34A' : '#DC2626' },
                      ]}
                    >
                      {isCorrect ? 'Shaandaar! Correct Answer!' : 'Oops! Not quite right'}
                    </Text>
                    <Text
                      style={[
                        styles.resultExplanation,
                        { color: isDark ? '#E5E7EB' : '#374151' },
                      ]}
                    >
                      {lesson.explanation}
                    </Text>
                  </View>
                </View>

                {isCorrect ? (
                  <TouchableOpacity
                    onPress={onNextLesson}
                    style={styles.actionBtnSuccess}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionBtnText}>CONTINUE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={onResetChallenge}
                    style={styles.actionBtnError}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionBtnText}>TRY AGAIN</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={onCheckAnswer}
                disabled={isCheckDisabled}
                style={[
                  styles.checkBtn,
                  isCheckDisabled && styles.checkBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.actionBtnText}>CHECK</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 6,
  },
  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  livesCount: {
    color: '#FF4B4B',
    fontSize: 15,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },
  dialogueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  dialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  dialogueTextWrap: {
    flex: 1,
  },
  dialogueName: {
    fontSize: 12,
    fontWeight: '800',
  },
  dialogueText: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 17,
  },
  voiceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 14,
  },
  codeSnippetBox: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  codeSnippetText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38BDF8',
    fontSize: 13,
    lineHeight: 19,
  },
  arrangeSection: {
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 4,
  },
  dropzone: {
    minHeight: 56,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzonePlaceholder: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  assembledRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assembledChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  assembledChipText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  availableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  blockChip: {
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  blockChipText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4.5,
    borderRadius: 14,
    padding: 13,
    gap: 10,
  },
  optionIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  bottomBar: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  bottomBarSuccess: {
    backgroundColor: '#DCFCE7',
    borderTopColor: '#86EFAC',
  },
  bottomBarError: {
    backgroundColor: '#FEE2E2',
    borderTopColor: '#FCA5A5',
  },
  resultBanner: {
    gap: 12,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  resultHeading: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 2,
  },
  resultExplanation: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkBtn: {
    backgroundColor: '#58CC02',
    borderBottomWidth: 5,
    borderBottomColor: '#46A302',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDisabled: {
    backgroundColor: '#E5E7EB',
    borderBottomColor: '#CBD5E1',
    opacity: 0.6,
  },
  actionBtnSuccess: {
    backgroundColor: '#58CC02',
    borderBottomWidth: 5,
    borderBottomColor: '#46A302',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnError: {
    backgroundColor: '#FF4B4B',
    borderBottomWidth: 5,
    borderBottomColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
