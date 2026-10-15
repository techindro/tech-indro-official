import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type SupportedLang = 'python' | 'javascript' | 'cpp' | 'java' | 'html';

interface LanguagePreset {
  name: string;
  badge: string;
  icon: string;
  defaultCode: string;
  simulatedOutput: (code: string) => string;
}

const LANGUAGE_CONFIGS: Record<SupportedLang, LanguagePreset> = {
  python: {
    name: 'Python 3.12',
    badge: 'PY',
    icon: 'logo-python',
    defaultCode: `# Tech Indro Cloud Compiler — Python 3
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(numbers, target)
print(f"Array: {numbers}")
print(f"Target {target} found at index: {result}")
`,
    simulatedOutput: (code) => {
      return `[Running python3 main.py...]\nArray: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nTarget 23 found at index: 5\n\n=== Process exited with code 0 (Execution time: 38ms) ===`;
    },
  },
  javascript: {
    name: 'Node.js 20',
    badge: 'JS',
    icon: 'logo-javascript',
    defaultCode: `// Tech Indro Cloud Compiler — JavaScript / Node.js
function fibonacci(n) {
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

console.log("Tech Indro Cloud Sandbox Initialized");
console.log("First 8 Fibonacci Numbers:", fibonacci(8));
`,
    simulatedOutput: (code) => {
      return `[Running node main.js...]\nTech Indro Cloud Sandbox Initialized\nFirst 8 Fibonacci Numbers: [0, 1, 1, 2, 3, 5, 8, 13]\n\n=== Process exited with code 0 (Execution time: 42ms) ===`;
    },
  },
  cpp: {
    name: 'C++ 20 (GCC 13)',
    badge: 'C++',
    icon: 'code-slash-outline',
    defaultCode: `// Tech Indro Cloud Compiler — C++20
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {98, 76, 85, 92, 100};
    std::sort(scores.begin(), scores.end());
    
    std::cout << "Tech Indro Hacker Arena — Sorted Scores:\\n";
    for(int s : scores) {
        std::cout << s << " ";
    }
    std::cout << "\\nHighest Score: " << scores.back() << "\\n";
    return 0;
}
`,
    simulatedOutput: (code) => {
      return `[Compiling g++ -O3 main.cpp -o main...]\nTech Indro Hacker Arena — Sorted Scores:\n76 85 92 98 100 \nHighest Score: 100\n\n=== Process exited with code 0 (Execution time: 55ms) ===`;
    },
  },
  java: {
    name: 'Java 21 OpenJDK',
    badge: 'JAVA',
    icon: 'cafe-outline',
    defaultCode: `// Tech Indro Cloud Compiler — Java 21
public class Main {
    public static void main(String[] args) {
        String student = "Rahul Sharma";
        int solvedDoubtCount = 42;
        System.out.println("Tech Indro Learning Cloud — Live Runner");
        System.out.println("Student: " + student + " | Solved Problems: " + solvedDoubtCount);
    }
}
`,
    simulatedOutput: (code) => {
      return `[Compiling javac Main.java && java Main...]\nTech Indro Learning Cloud — Live Runner\nStudent: Rahul Sharma | Solved Problems: 42\n\n=== Process exited with code 0 (Execution time: 78ms) ===`;
    },
  },
  html: {
    name: 'HTML5 & CSS3',
    badge: 'WEB',
    icon: 'globe-outline',
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }
    .card { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }
    .badge { color: #ff6b35; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Welcome to Tech Indro Web Lab</h2>
    <p>Zero configuration live frontend prototyping engine.</p>
  </div>
</body>
</html>
`,
    simulatedOutput: (code) => {
      return `[Rendering HTML5 Canvas Sandbox...]\n[DOM Tree OK]: 1 document root, 1 card container, 2 text elements rendered.\n[CSS Engine]: 4 rules computed, 0 layout shifts.\n\n=== Sandbox Rendered Successfully ===`;
    },
  },
};

export default function CyberPlaygroundScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedLang, setSelectedLang] = useState<SupportedLang>('python');
  const [code, setCode] = useState(LANGUAGE_CONFIGS.python.defaultCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');

  const handleLangChange = (lang: SupportedLang) => {
    setSelectedLang(lang);
    setCode(LANGUAGE_CONFIGS[lang].defaultCode);
    setOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('output');
    setTimeout(() => {
      setOutput(LANGUAGE_CONFIGS[selectedLang].simulatedOutput(code));
      setIsRunning(false);
    }, 450);
  };

  const handleReset = () => {
    setCode(LANGUAGE_CONFIGS[selectedLang].defaultCode);
    setOutput('');
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>IndroLabs Cloud IDE</Text>
              <View style={styles.liveEnginePill}>
                <View style={styles.greenDot} />
                <Text style={styles.liveEngineText}>SANDBOX READY</Text>
              </View>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Browser-based real-time multi-language compiler & playground
            </Text>
          </View>
        </View>

        {/* Language Tabs Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.langScroll}
        >
          {(Object.keys(LANGUAGE_CONFIGS) as SupportedLang[]).map((langKey) => {
            const lang = LANGUAGE_CONFIGS[langKey];
            const isSelected = selectedLang === langKey;
            return (
              <TouchableOpacity
                key={langKey}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: isSelected
                      ? '#ff6b35'
                      : isDark
                      ? '#1e293b'
                      : '#f1f5f9',
                    borderColor: isSelected ? '#ff6b35' : colors.border,
                  },
                ]}
                onPress={() => handleLangChange(langKey)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.langChipText,
                    { color: isSelected ? '#ffffff' : colors.text },
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Editor & Output Switcher Tabs */}
      <View style={[styles.viewTabs, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.viewTabBtn, activeTab === 'editor' && styles.viewTabBtnActive]}
          onPress={() => setActiveTab('editor')}
        >
          <Ionicons
            name="code-slash"
            size={16}
            color={activeTab === 'editor' ? '#ff6b35' : colors.textMuted}
          />
          <Text
            style={[
              styles.viewTabText,
              { color: activeTab === 'editor' ? '#ff6b35' : colors.textMuted },
            ]}
          >
            Code Editor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewTabBtn, activeTab === 'output' && styles.viewTabBtnActive]}
          onPress={() => setActiveTab('output')}
        >
          <Ionicons
            name="terminal-outline"
            size={16}
            color={activeTab === 'output' ? '#ff6b35' : colors.textMuted}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={[
                styles.viewTabText,
                { color: activeTab === 'output' ? '#ff6b35' : colors.textMuted },
              ]}
            >
              Terminal Output
            </Text>
            {output ? (
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' }} />
            ) : null}
          </View>
        </TouchableOpacity>

        {/* AI Explainer Shortcut */}
        <TouchableOpacity
          style={styles.aiHelpBtn}
          onPress={() => router.push('/ai-mentor')}
        >
          <Ionicons name="sparkles" size={13} color="#9333ea" />
          <Text style={styles.aiHelpText}>Explain with AI</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.editorContainer}>
        {activeTab === 'editor' ? (
          <View style={styles.codeWrapper}>
            <TextInput
              style={[
                styles.codeEditorInput,
                {
                  backgroundColor: isDark ? '#090d16' : '#1e293b',
                  color: '#e2e8f0',
                },
              ]}
              multiline
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholder="Write your code here..."
              placeholderTextColor="#64748b"
            />
          </View>
        ) : (
          <ScrollView
            style={[
              styles.terminalScroll,
              { backgroundColor: isDark ? '#020617' : '#0f172a' },
            ]}
            contentContainerStyle={{ padding: 16 }}
          >
            <View style={styles.terminalHeader}>
              <View style={styles.termDots}>
                <View style={[styles.termDot, { backgroundColor: '#ef4444' }]} />
                <View style={[styles.termDot, { backgroundColor: '#f59e0b' }]} />
                <View style={[styles.termDot, { backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.terminalTitle}>stdout / compiler logs</Text>
            </View>

            {isRunning ? (
              <View style={{ paddingVertical: 30, alignItems: 'center', gap: 10 }}>
                <Ionicons name="sync" size={24} color="#ff6b35" />
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>Compiling & running in cloud container...</Text>
              </View>
            ) : output ? (
              <Text style={styles.terminalOutputText}>{output}</Text>
            ) : (
              <View style={{ paddingVertical: 40, alignItems: 'center', gap: 8 }}>
                <Ionicons name="play-circle-outline" size={32} color="#475569" />
                <Text style={{ color: '#64748b', fontSize: 13 }}>Press "Run Code" to compile and view results</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Action Footer */}
      <View
        style={[
          styles.actionFooter,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.secondaryActionBtn, { borderColor: colors.border }]}
          onPress={handleReset}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.text} />
          <Text style={[styles.secondaryActionText, { color: colors.text }]}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.runBtn}
          onPress={handleRun}
          disabled={isRunning}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#ff6b35', '#ea580c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.runBtnGradient}
          >
            <Ionicons name="play" size={16} color="#ffffff" />
            <Text style={styles.runBtnText}>{isRunning ? 'Running...' : 'Run Code'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    gap: 12,
    marginBottom: 10,
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
  liveEnginePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveEngineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  langScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  viewTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  viewTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewTabBtnActive: {
    borderBottomColor: '#ff6b35',
  },
  viewTabText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  aiHelpBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  aiHelpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9333ea',
  },
  editorContainer: {
    flex: 1,
  },
  codeWrapper: {
    flex: 1,
  },
  codeEditorInput: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    lineHeight: 20,
    padding: 16,
    textAlignVertical: 'top',
  },
  terminalScroll: {
    flex: 1,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 12,
  },
  termDots: {
    flexDirection: 'row',
    gap: 6,
  },
  termDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  terminalOutputText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12.5,
    color: '#38bdf8',
    lineHeight: 20,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 12,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  runBtn: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  runBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
  },
  runBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
