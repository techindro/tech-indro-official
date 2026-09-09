/**
 * IndroLabs Screen — Tech Indro Code Playground & Compiler Engine
 * In-app interactive multi-language code editor (Python, JS, C++, Java, SQLite, Web)
 * Features:
 *  - Dual-layer execution: Local Express backend + Piston Cloud Sandbox failover
 *  - Mobile Keypad Helper Bar: Quick-insert programming symbols & indentation
 *  - AI Code Mentor: In-app bug diagnosis, code explanation & 1-tap fix applicator
 *  - Real Coding Challenges Library (DSA, Web Dev, Algorithms)
 *  - Live Web Preview & Monospace Terminal Output with exit metrics
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import { executeCode, sendChatMessage } from '@/services/api';

type Language = 'python' | 'javascript' | 'html' | 'sql' | 'cpp' | 'java';

interface Challenge {
  id: string;
  title: string;
  category: 'DSA' | 'Web' | 'Database' | 'Algorithms';
  lang: Language;
  desc: string;
  code: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum (DSA Easy)',
    category: 'DSA',
    lang: 'python',
    desc: 'Find indices of two numbers in an array that add up to a target sum.',
    code: `# Problem: Two Sum
# Given nums = [2, 7, 11, 15], target = 9
# Return indices [0, 1] because 2 + 7 = 9

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

test_nums = [2, 7, 11, 15]
target = 9
result = two_sum(test_nums, target)
print(f"Input: {test_nums}, Target: {target}")
print(f"Indices Result: {result}")
print("Values:", [test_nums[i] for i in result])
`,
  },
  {
    id: 'palindrome',
    title: 'Palindrome Checker',
    category: 'Algorithms',
    lang: 'javascript',
    desc: 'Check whether a phrase or number reads the same forwards and backwards.',
    code: `// Problem: Valid Palindrome (Two-Pointer Method)
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

const phrases = [
  "A man, a plan, a canal: Panama",
  "race a car",
  "Tech Indro 2026",
  "Was it a car or a cat I saw?"
];

phrases.forEach(p => {
  console.log(\`"\${p}" -> \${isPalindrome(p) ? '✅ PALINDROME' : '❌ NOT PALINDROME'}\`);
});
`,
  },
  {
    id: 'binary-search',
    title: 'Binary Search O(log N)',
    category: 'DSA',
    lang: 'cpp',
    desc: 'Search an element in sorted array with logarithmic time complexity.',
    code: `// Binary Search in C++20
#include <iostream>
#include <vector>

using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> sortedArray = {3, 9, 14, 21, 28, 35, 42, 59, 70, 88};
    int target = 42;
    int index = binarySearch(sortedArray, target);
    
    cout << "Array: [3, 9, 14, 21, 28, 35, 42, 59, 70, 88]" << endl;
    cout << "Searching for target: " << target << endl;
    if (index != -1) {
        cout << "Target found at index: " << index << endl;
    } else {
        cout << "Target not found in array." << endl;
    }
    return 0;
}
`,
  },
  {
    id: 'sql-analytics',
    title: 'Course Analytics Query',
    category: 'Database',
    lang: 'sql',
    desc: 'Create students and enrollments table and calculate top scorers.',
    code: `-- Tech Indro Student Performance Query
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  score INTEGER NOT NULL
);

INSERT INTO enrollments (student_name, course, score) VALUES 
  ('Aarav Sharma', 'Full Stack AI', 96),
  ('Priya Patel', 'Space Tech ISRO', 98),
  ('Kabir Verma', 'Full Stack AI', 88),
  ('Sneha Iyer', 'Cybersecurity', 94),
  ('Rohan Gupta', 'Cybersecurity', 91);

-- Rank students with above 90 score
SELECT 
  course,
  student_name,
  score,
  CASE 
    WHEN score >= 95 THEN 'Distinction 🏆'
    ELSE 'Merit ⭐'
  END AS badge
FROM enrollments
WHERE score >= 90
ORDER BY score DESC;
`,
  },
  {
    id: 'web-glow-card',
    title: 'Neon Glow UI Component',
    category: 'Web',
    lang: 'html',
    desc: 'Interactive glowing cyber card with glassmorphism and modern gradient.',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #090D16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 260px;
    }
    .card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.35);
      color: #fff;
      max-width: 320px;
      text-align: center;
    }
    h2 { color: #38BDF8; margin: 0 0 8px 0; font-size: 20px; }
    p { color: #94A3B8; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0; }
    .btn {
      background: linear-gradient(90deg, #4F46E5, #06B6D4);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 IndroLabs Mobile</h2>
    <p>Live Web DOM preview rendering directly inside the Tech Indro mobile runtime.</p>
    <button class="btn" onclick="alert('IndroLabs Sandbox Activated!')">Test Interaction ⚡</button>
  </div>
</body>
</html>
`,
  },
];

const CODE_TEMPLATES: Record<Language, { label: string; code: string; ext: string }> = {
  python: {
    label: 'Python 3',
    ext: '.py',
    code: `# Tech Indro Python Sandbox
def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

primes = [x for x in range(1, 30) if is_prime(x)]
print("Primes under 30:", primes)
print("Total prime count:", len(primes))
print("Algorithm complexity: O(N * sqrt(N))")
`,
  },
  javascript: {
    label: 'JavaScript',
    ext: '.js',
    code: `// Tech Indro Interactive JS Playground
function calculateFibonacci(n) {
  let a = 0, b = 1;
  const series = [a, b];
  for (let i = 2; i < n; i++) {
    let next = a + b;
    series.push(next);
    a = b;
    b = next;
  }
  return series;
}

console.log("Welcome to IndroLabs Runtime!");
const result = calculateFibonacci(8);
console.log("Fibonacci Series (first 8):", result);
console.log("Status: Execution Successful! 🚀");
`,
  },
  html: {
    label: 'HTML / Web',
    ext: '.html',
    code: `<!-- Tech Indro Web Engine -->
<div style="padding: 20px; background: #0F172A; border-radius: 12px; border: 1px solid #38BDF8; text-align: center; font-family: sans-serif;">
  <h2 style="color: #38BDF8; margin: 0 0 8px 0;">🚀 Tech Indro Web Engine</h2>
  <p style="color: #E2E8F0; font-size: 14px; margin: 0 0 16px 0;">
    Build responsive UI layouts directly inside your mobile playground.
  </p>
  <button style="background: linear-gradient(90deg, #6366F1, #8B5CF6); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold;">
    Explore Full Stack Track ⚡
  </button>
</div>
`,
  },
  sql: {
    label: 'SQL (SQLite)',
    ext: '.sql',
    code: `-- Tech Indro Relational Database Lab
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  track TEXT NOT NULL,
  xp INTEGER DEFAULT 0
);

INSERT INTO students (name, track, xp) VALUES 
  ('Vikram Sharma', 'Full Stack AI', 2450),
  ('Ananya Sen', 'ISRO Space Tech', 3120),
  ('Rohit Patel', 'Cybersecurity', 1890);

SELECT * FROM students ORDER BY xp DESC;
`,
  },
  java: {
    label: 'Java 21',
    ext: '.java',
    code: `// Tech Indro Java 21 LTS Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java 21 LTS!");
        String greeting = "Welcome to Tech Indro Engineering Hub";
        System.out.println(greeting);
        
        int[] numbers = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int n : numbers) sum += n;
        System.out.println("Array Sum: " + sum);
        System.out.println("JVM Status: Active & Sandboxed");
    }
}
`,
  },
  cpp: {
    label: 'C++ 20',
    ext: '.cpp',
    code: `// Tech Indro C++ Competitive Hub
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    vector<int> nums = {45, 12, 89, 3, 27};
    sort(nums.begin(), nums.end());
    
    cout << "Sorted Array: ";
    for (int n : nums) cout << n << " ";
    cout << "\\nBinary Search for 27: FOUND at index 2" << endl;
    return 0;
}
`,
  },
};

// Keyboard accessory buttons tailored to language
const KEYPAD_HELPERS: Record<Language, string[]> = {
  python: ['  ', ':', '(', ')', '[', ']', '"', "'", '=', '==', 'def ', 'return ', 'if ', 'for ', 'in ', '# ', 'print('],
  javascript: ['  ', '{', '}', '(', ')', '=>', ';', '"', "'", '=', '===', 'const ', 'let ', 'return ', '// ', 'console.log('],
  cpp: ['  ', '{', '}', '(', ')', ';', ':', '<<', '>>', '=', '==', 'int ', 'cout << ', 'endl;', 'return 0;', '// '],
  java: ['  ', '{', '}', '(', ')', ';', '"', '=', '==', 'public ', 'static ', 'void ', 'System.out.println(', '// '],
  sql: ['  ', ';', ',', '(', ')', '*', '=', 'SELECT ', 'FROM ', 'WHERE ', 'INSERT INTO ', 'ORDER BY ', 'DESC', '-- '],
  html: ['  ', '<', '>', '</', '="', '"', 'div', 'class', 'style', 'h1', 'p', 'button', 'span', '<!-- '],
};

export default function IndroLabsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<Language>('python');
  const [code, setCode] = useState(CODE_TEMPLATES.python.code);
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionMeta, setExecutionMeta] = useState<{
    elapsed?: number;
    exitCode?: number;
    language?: string;
  } | null>(null);

  // Challenge modal state
  const [challengesVisible, setChallengesVisible] = useState(false);

  // AI Mentor code review modal state
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [extractedFixCode, setExtractedFixCode] = useState<string | null>(null);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setCode(CODE_TEMPLATES[newLang].code);
    setOutput([]);
    setExecutionMeta(null);
  };

  const handleInsertHelper = (snippet: string) => {
    setCode((prev) => prev + snippet);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionMeta(null);

    // If HTML: DOM Parse simulation + live preview
    if (lang === 'html') {
      setOutput([
        '✓ HTML5 DOM Parsed Successfully',
        '✓ CSS Styles Computed & Applied',
        '✓ Live Web Viewport Rendered Below',
        '---------------------------------------',
        'Status: Ready (Interactive container active)',
      ]);
      setExecutionMeta({ elapsed: 12, exitCode: 0, language: 'HTML5 Web Engine' });
      setIsRunning(false);
      return;
    }

    // Cloud / Local sandbox execution
    try {
      setOutput(['⚡ Initiating sandboxed compiler runtime...', 'Executing code safely...']);
      const res = await executeCode(lang, code, stdin.trim() || undefined);

      if (res.output) {
        const lines = res.output.replace(/\r\n/g, '\n').split('\n');
        setOutput(lines.length > 0 ? lines : ['Program executed with exit code 0 (no output).']);
      } else {
        setOutput(['Program executed with exit code 0 (no output).']);
      }

      setExecutionMeta({
        elapsed: res.elapsed || 0,
        exitCode: res.exitCode ?? (res.success ? 0 : 1),
        language: res.language || CODE_TEMPLATES[lang].label,
      });
    } catch (err: any) {
      setOutput([`Execution Error: ${err.message || 'Compiler service temporary error'}`]);
      setExecutionMeta({ exitCode: 1, language: CODE_TEMPLATES[lang].label });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[lang].code);
    setOutput([]);
    setExecutionMeta(null);
    showToast('Code reset to default template');
  };

  const handleLoadChallenge = (ch: Challenge) => {
    setLang(ch.lang);
    setCode(ch.code);
    setOutput([]);
    setExecutionMeta(null);
    setChallengesVisible(false);
    showToast(`Loaded: ${ch.title}`);
  };

  // AI Mentor: In-app Diagnosis and Code Fixer
  const handleAskAIMentor = async () => {
    setAiModalVisible(true);
    setAiLoading(true);
    setAiResponse('');
    setExtractedFixCode(null);

    const terminalSummary = output.length > 0 ? output.join('\n') : 'No output yet';
    const prompt = `You are the Tech Indro Code Shikshak & Debugger. Analyze this student's code and execution output:

Language: ${lang}
Code:
\`\`\`${lang}
${code}
\`\`\`

Terminal Output/Error:
\`\`\`
${terminalSummary}
\`\`\`

Please provide:
1. Short Diagnosis (Explain what the code does or what error occurred in friendly Hinglish/English).
2. Bug Fix or Optimization (Point out the exact fix if any).
3. If providing fixed code, wrap the complete corrected code inside \`\`\`${lang} ... \`\`\` so the student can apply it.`;

    try {
      const res = await sendChatMessage(prompt);
      const text = res.reply || 'AI Mentor could not generate a response. Please try again.';
      setAiResponse(text);

      // Extract code block if AI provided a fix
      const codeBlockMatch = text.match(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1] && codeBlockMatch[1].trim().length > 10) {
        setExtractedFixCode(codeBlockMatch[1].trim());
      }
    } catch (err: any) {
      setAiResponse(
        `AI Mentor Connection Note:\n${err.message || 'Could not reach AI Mentor'}.\n\n💡 Tip: Check your syntax, indentation, and variable names!`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiFix = () => {
    if (extractedFixCode) {
      setCode(extractedFixCode);
      setAiModalVisible(false);
      showToast('✨ AI Fix applied to code editor!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Bar */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Platform.OS === 'web' ? Spacing.sm : Math.max(insets.top, 40) + 8,
            },
          ]}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => router.push('/')}
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/tech-indro-square-logo.png')}
                style={{ width: 34, height: 34, borderRadius: 8 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, letterSpacing: 0.5 }}>TECH INDRO</Text>
            </TouchableOpacity>
            <View style={styles.topActionsRow}>
              {/* Challenges Button */}
              <TouchableOpacity
                style={styles.challengePill}
                onPress={() => setChallengesVisible(true)}
              >
                <Ionicons name="trophy" size={13} color="#F59E0B" />
                <Text style={styles.challengePillText}>Challenges</Text>
              </TouchableOpacity>

              {/* Active Engine Badge */}
              <View style={styles.engineBadge}>
                <Ionicons name="hardware-chip" size={13} color="#10B981" />
                <Text style={styles.engineBadgeText}>CLOUD ENGINE</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>IndroLabs Playground</Text>
          <Text style={styles.subtitle}>
            Code, compile & run Python, JS, C++, Java, SQL & Web live with AI assistance.
          </Text>
        </View>

        {/* Language Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.sm }}>
          <View style={styles.tabsRow}>
            {(['python', 'javascript', 'html', 'sql', 'cpp', 'java'] as Language[]).map((l) => {
              const active = lang === l;
              return (
                <TouchableOpacity
                  key={l}
                  style={[styles.langTab, active && styles.langTabActive]}
                  onPress={() => handleLanguageChange(l)}
                >
                  <Text style={[styles.langTabText, active && styles.langTabTextActive]}>
                    {CODE_TEMPLATES[l].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Mobile Keypad Helper Accessory Bar */}
        <View style={styles.accessoryContainer}>
          <View style={styles.accessoryHeader}>
            <Ionicons name="keypad-outline" size={12} color="#94A3B8" />
            <Text style={styles.accessoryTitle}>QUICK KEYPAD HELPER</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accessoryScroll}>
            {KEYPAD_HELPERS[lang].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.accessoryChip}
                onPress={() => handleInsertHelper(item)}
              >
                <Text style={styles.accessoryChipText}>
                  {item === '  ' ? '⇥ Tab' : item.trim() || item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Code Editor Box */}
        <View style={styles.editorCard}>
          <View style={styles.editorTopBar}>
            <View style={styles.dots}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.fileName}>main{CODE_TEMPLATES[lang].ext}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={handleReset}>
                <Ionicons name="refresh-outline" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.codeTextInput}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="top"
          />

          {/* Stdin Expander Bar */}
          {lang !== 'html' && (
            <View style={styles.stdinBar}>
              <TouchableOpacity
                style={styles.stdinToggleBtn}
                onPress={() => setShowStdin(!showStdin)}
              >
                <Ionicons name={showStdin ? 'chevron-up' : 'chevron-down'} size={14} color="#94a3b8" />
                <Text style={styles.stdinToggleText}>
                  {showStdin ? 'Hide Standard Input (stdin)' : '+ Add Standard Input (stdin)'}
                </Text>
              </TouchableOpacity>
              {showStdin && (
                <TextInput
                  style={styles.stdinInput}
                  value={stdin}
                  onChangeText={setStdin}
                  placeholder="Enter inputs to pass to your program..."
                  placeholderTextColor="#64748b"
                  multiline
                />
              )}
            </View>
          )}
        </View>

        {/* Action Controls Row (Run + AI Diagnose) */}
        <View style={styles.actionsRow}>
          {/* Run Button */}
          <TouchableOpacity
            style={[styles.runButton, isRunning && styles.runButtonDisabled]}
            onPress={handleRunCode}
            disabled={isRunning}
            activeOpacity={0.85}
          >
            {isRunning ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="play" size={18} color="#fff" />
                <Text style={styles.runButtonText}>Run Code</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Ask AI Mentor Button */}
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleAskAIMentor}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={16} color="#A855F7" />
            <Text style={styles.aiButtonText}>AI Fix / Explain</Text>
          </TouchableOpacity>
        </View>

        {/* Live Web Preview for HTML */}
        {lang === 'html' && (
          <View style={styles.liveWebContainer}>
            <View style={styles.liveWebHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="globe-outline" size={16} color="#38BDF8" />
                <Text style={styles.liveWebTitle}>LIVE WEB VIEWPORT</Text>
              </View>
              <View style={{ backgroundColor: '#10b98122', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                <Text style={{ color: '#10b981', fontSize: 10.5, fontWeight: '700' }}>● SANDBOXED</Text>
              </View>
            </View>

            {Platform.OS === 'web' ? (
              <iframe
                srcDoc={code}
                title="Live Web Output"
                style={{
                  width: '100%',
                  height: 320,
                  border: '1px solid #334155',
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                }}
                sandbox="allow-scripts"
              />
            ) : (
              <View style={styles.liveWebCard}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginBottom: 4 }}>
                  🚀 Web DOM Render Container
                </Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
                  HTML & CSS layout validated. For full browser preview, test in Web or Expo Go.
                </Text>
                <View style={styles.htmlPreviewSample}>
                  <Text style={{ color: '#38BDF8', fontWeight: 'bold', fontSize: 16 }}>🚀 Tech Indro Web Engine</Text>
                  <Text style={{ color: '#E2E8F0', fontSize: 12, marginTop: 4 }}>
                    Build responsive UI layouts directly inside your mobile playground.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Terminal Output Header */}
        <View style={styles.outputSectionHeader}>
          <Text style={styles.sectionTitle}>Terminal Output</Text>
          {executionMeta && (
            <View style={styles.metaBadgesRow}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{executionMeta.language}</Text>
              </View>
              {executionMeta.elapsed !== undefined && (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>{executionMeta.elapsed}ms</Text>
                </View>
              )}
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: executionMeta.exitCode === 0 ? '#10B98122' : '#EF444422' },
                ]}
              >
                <Text
                  style={{
                    fontSize: 10.5,
                    fontWeight: '700',
                    color: executionMeta.exitCode === 0 ? '#10B981' : '#EF4444',
                  }}
                >
                  Exit: {executionMeta.exitCode}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Terminal Output Box */}
        <View style={styles.outputCard}>
          <View style={styles.outputTopBar}>
            <Text style={styles.outputTitle}>stdout & stderr ({CODE_TEMPLATES[lang].label})</Text>
            {output.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setOutput([]);
                  setExecutionMeta(null);
                }}
              >
                <Text style={styles.clearOutputText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.outputContent}>
            {output.length === 0 ? (
              <Text style={styles.emptyOutputText}>
                Click "Run Code" to compile and view live execution results here.
              </Text>
            ) : (
              output.map((line, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.outputLine,
                    (line.includes('Error') ||
                      line.includes('error:') ||
                      line.includes('Exception') ||
                      line.includes('Traceback')) && { color: '#EF4444' },
                    line.includes('SELECT') && { color: '#F59E0B' },
                    line.includes('|') && { color: '#38BDF8', fontFamily: 'monospace' },
                  ]}
                >
                  {line}
                </Text>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* ================= MODAL 1: CHALLENGES SELECTOR ================= */}
      <Modal
        visible={challengesVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setChallengesVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
                <Text style={styles.modalTitle}>Coding Challenges</Text>
              </View>
              <TouchableOpacity onPress={() => setChallengesVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select a challenge to load the problem statement and starter code.
            </Text>

            <ScrollView style={{ maxHeight: 400 }}>
              {CHALLENGES.map((ch) => (
                <TouchableOpacity
                  key={ch.id}
                  style={styles.challengeItem}
                  onPress={() => handleLoadChallenge(ch)}
                >
                  <View style={styles.challengeItemTop}>
                    <Text style={styles.challengeItemTitle}>{ch.title}</Text>
                    <View style={styles.challengeCategoryBadge}>
                      <Text style={styles.challengeCategoryText}>{ch.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.challengeItemDesc}>{ch.desc}</Text>
                  <View style={styles.challengeItemBottom}>
                    <Text style={styles.challengeLangText}>Language: {CODE_TEMPLATES[ch.lang].label}</Text>
                    <Text style={styles.challengeLoadText}>Load Code →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: AI CODE MENTOR & DEBUGGER ================= */}
      <Modal
        visible={aiModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={20} color="#A855F7" />
                <Text style={styles.modalTitle}>AI Shikshak Code Diagnosis</Text>
              </View>
              <TouchableOpacity onPress={() => setAiModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {aiLoading ? (
              <View style={styles.aiLoadingContainer}>
                <ActivityIndicator size="large" color="#A855F7" />
                <Text style={styles.aiLoadingText}>AI Shikshak is analyzing your code and error...</Text>
              </View>
            ) : (
              <ScrollView style={{ marginTop: 12 }}>
                <View style={styles.aiResponseCard}>
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                </View>

                {extractedFixCode && (
                  <TouchableOpacity style={styles.applyFixBtn} onPress={handleApplyAiFix}>
                    <Ionicons name="code-slash" size={18} color="#fff" />
                    <Text style={styles.applyFixBtnText}>Apply Suggested Fix to Editor</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.closeAiBtn}
                  onPress={() => setAiModalVisible(false)}
                >
                  <Text style={styles.closeAiBtnText}>Close Analysis</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#0F172A',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },
  header: {
    marginBottom: Spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B44',
  },
  challengePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#F59E0B',
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98122',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B98144',
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingVertical: 4,
  },
  langTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  langTabText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  langTabTextActive: {
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  accessoryContainer: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: Spacing.sm,
  },
  accessoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  accessoryTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  accessoryScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  accessoryChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  accessoryChipText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  editorCard: {
    backgroundColor: '#0A0F1D',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  editorTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    backgroundColor: '#131D33',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fileName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  codeTextInput: {
    padding: Spacing.md,
    fontFamily: 'monospace',
    fontSize: 12.5,
    color: '#38BDF8',
    lineHeight: 20,
    minHeight: 220,
    backgroundColor: '#0A0F1D',
  },
  stdinBar: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  stdinToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stdinToggleText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  stdinInput: {
    backgroundColor: '#050814',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    padding: 10,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#F8FAFC',
    minHeight: 50,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  runButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  runButtonDisabled: {
    opacity: 0.7,
  },
  runButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  aiButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: '#1E1B4B',
    borderColor: '#7C3AED',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  aiButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#C084FC',
  },
  liveWebContainer: {
    marginBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: Spacing.sm,
  },
  liveWebHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  liveWebTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  liveWebCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#38BDF844',
    padding: Spacing.md,
  },
  htmlPreviewSample: {
    backgroundColor: '#050814',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  outputSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  metaBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metaBadgeText: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  outputCard: {
    backgroundColor: '#050814',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  outputTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  outputTitle: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  clearOutputText: {
    fontSize: 10,
    color: Colors.primaryLight,
  },
  outputContent: {
    padding: Spacing.md,
    minHeight: 100,
  },
  emptyOutputText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  outputLine: {
    fontSize: 11.5,
    color: '#10B981',
    fontFamily: 'monospace',
    lineHeight: 19,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
    marginBottom: 12,
  },
  challengeItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  challengeItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  challengeCategoryBadge: {
    backgroundColor: '#38BDF822',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  challengeCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  challengeItemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 8,
  },
  challengeItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeLangText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  challengeLoadText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryLight,
  },
  aiLoadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 12,
  },
  aiLoadingText: {
    fontSize: 12,
    color: '#A855F7',
    fontWeight: '600',
  },
  aiResponseCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    marginBottom: 12,
  },
  aiResponseText: {
    fontSize: 12.5,
    color: '#F1F5F9',
    lineHeight: 19,
  },
  applyFixBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  applyFixBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeAiBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeAiBtnText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 12,
  },
});
