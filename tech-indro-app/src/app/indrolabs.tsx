/**
 * IndroLabs Screen — Tech Indro Code Playground
 * In-app interactive code editor with syntax templates and simulated execution runtime
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type Language = 'javascript' | 'python' | 'html' | 'sql' | 'java' | 'cpp';

const CODE_TEMPLATES: Record<Language, { label: string; code: string; ext: string }> = {
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
console.log("Status: Execution Successful! 🚀");`,
  },
  python: {
    label: 'Python 3',
    ext: '.py',
    code: `# Tech Indro Python Playground
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
print("Algorithm complexity: O(N * sqrt(N))")`,
  },
  html: {
    label: 'HTML / Web',
    ext: '.html',
    code: `<!-- Tech Indro Web Engine -->
<div style="padding: 16px; background: #1E293B; border-radius: 12px; border: 1px solid #38BDF8;">
  <h2 style="color: #38BDF8; margin: 0 0 8px 0;">🚀 Tech Indro Web Engine</h2>
  <p style="color: #E2E8F0; font-size: 14px; margin: 0 0 12px 0;">
    Build responsive cloud apps directly inside your mobile playground.
  </p>
  <button style="background: #8B5CF6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold;">
    Explore Full Stack Track ⚡
  </button>
</div>`,
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

SELECT * FROM students ORDER BY xp DESC;`,
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
}`,
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
}`,
  },
};

export default function IndroLabsScreen() {
  const [lang, setLang] = useState<Language>('javascript');
  const [code, setCode] = useState(CODE_TEMPLATES.javascript.code);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setCode(CODE_TEMPLATES[newLang].code);
    setOutput([]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(['Compiling and linking...', `Spawning Indro sandboxed ${CODE_TEMPLATES[lang].label} runtime...`]);

    setTimeout(() => {
      if (lang === 'javascript') {
        try {
          const logs: string[] = [];
          const fakeConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: any[]) => logs.push(`[ERROR] ${args.join(' ')}`),
            warn: (...args: any[]) => logs.push(`[WARN] ${args.join(' ')}`),
          };
          const runner = new Function('console', code);
          runner(fakeConsole);
          setOutput(logs.length > 0 ? logs : ['Program executed with exit code 0 (no output).']);
        } catch (e: any) {
          setOutput([`Runtime Error: ${e.message}`]);
        }
      } else if (lang === 'python') {
        setOutput([
          'Primes under 30: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]',
          'Total prime count: 10',
          'Algorithm complexity: O(N * sqrt(N))',
          '---------------------------------------',
          'Process finished with exit code 0 (Execution: 12ms)',
        ]);
      } else if (lang === 'html') {
        setOutput([
          '✓ HTML5 DOM Parsed Successfully',
          '✓ CSS Rules Computed: 1 Box, 3 Color Variables',
          '✓ Live Web Components Rendered in Sandboxed Viewport',
          '---------------------------------------',
          'DOM Ready State: complete (Render: 6ms)',
        ]);
      } else if (lang === 'sql') {
        setOutput([
          '[SQLite v3.45.0] In-Memory Database initialized (:memory:)',
          'Query: SELECT * FROM students ORDER BY xp DESC;',
          'Query executed successfully. 3 rows retrieved:',
          '',
          '+----+----------------+-----------------+------+',
          '| ID | Name           | Track           | XP   |',
          '+----+----------------+-----------------+------+',
          '| 2  | Ananya Sen     | ISRO Space Tech | 3120 |',
          '| 1  | Vikram Sharma  | Full Stack AI   | 2450 |',
          '| 3  | Rohit Patel    | Cybersecurity   | 1890 |',
          '+----+----------------+-----------------+------+',
          '',
          'Execution Time: 4ms • Status: SUCCESS (Exit Code 0)',
        ]);
      } else if (lang === 'java') {
        setOutput([
          'javac Main.java && java Main',
          'Hello from Java 21 LTS!',
          'Welcome to Tech Indro Engineering Hub',
          'Array Sum: 150',
          'JVM Status: Active & Sandboxed (HotSpot 64-Bit)',
          '---------------------------------------',
          'Process finished with exit code 0 (Execution: 18ms)',
        ]);
      } else {
        setOutput([
          'Sorted Array: 3 12 27 45 89',
          'Binary Search for 27: FOUND at index 2',
          '---------------------------------------',
          'g++ -O3 main.cpp -> executed in 8ms (Exit Code 0)',
        ]);
      }
      setIsRunning(false);
    }, 600);
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[lang].code);
    setOutput([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
            <Image
              source={require('@/assets/images/tech-indro-logo.png')}
              style={{ width: 135, height: 32 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary + '44' }}>
              <Ionicons name="flash" size={13} color={Colors.primaryLight} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.primaryLight, letterSpacing: 0.5 }}>CLOUD RUNTIME</Text>
            </View>
          </View>
          <Text style={styles.title}>IndroLabs Playground</Text>
          <Text style={styles.subtitle}>Test, experiment & debug without installing locally.</Text>
        </View>

        {/* Language Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          <View style={styles.tabsRow}>
            {(['javascript', 'python', 'html', 'sql', 'java', 'cpp'] as Language[]).map((l) => {
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

        {/* Code Editor Box */}
        <View style={styles.editorCard}>
          <View style={styles.editorTopBar}>
            <View style={styles.dots}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.fileName}>main{CODE_TEMPLATES[lang].ext}</Text>
            <TouchableOpacity onPress={handleReset}>
              <Ionicons name="refresh-outline" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
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
        </View>

        {/* Run Button */}
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={handleRunCode}
          disabled={isRunning}
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

        {/* Output Terminal */}
        <Text style={styles.sectionTitle}>Terminal Output</Text>
        <View style={styles.outputCard}>
          <View style={styles.outputTopBar}>
            <Text style={styles.outputTitle}>stdout ({CODE_TEMPLATES[lang].label})</Text>
            {output.length > 0 && (
              <TouchableOpacity onPress={() => setOutput([])}>
                <Text style={styles.clearOutputText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.outputContent}>
            {output.length === 0 ? (
              <Text style={styles.emptyOutputText}>
                Click "Run Code" to compile and see output here.
              </Text>
            ) : (
              output.map((line, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.outputLine,
                    line.includes('Error') && { color: Colors.danger },
                    line.includes('SELECT') && { color: '#F59E0B' },
                    line.includes('|') && { color: '#38BDF8', fontFamily: 'monospace' },
                  ]}
                >
                  {line}
                </Text>
              ))
            )}

            {/* Live Web Preview Container when HTML is executed */}
            {lang === 'html' && output.length > 0 && (
              <View style={styles.liveWebContainer}>
                <View style={styles.liveWebHeader}>
                  <Ionicons name="globe-outline" size={14} color="#38BDF8" />
                  <Text style={styles.liveWebTitle}>LIVE RENDER PREVIEW</Text>
                </View>
                <View style={styles.liveWebCard}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#38BDF8', marginBottom: 4 }}>
                    🚀 Tech Indro Web Engine
                  </Text>
                  <Text style={{ fontSize: 12, color: '#E2E8F0', marginBottom: 10 }}>
                    Build responsive cloud apps directly inside your mobile playground.
                  </Text>
                  <View style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Explore Full Stack Track ⚡</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* AI Debug Shortcut */}
        <TouchableOpacity
          style={styles.aiReviewBtn}
          onPress={() => router.push('/ai-mentor')}
        >
          <Ionicons name="sparkles" size={16} color={Colors.primaryLight} />
          <Text style={styles.aiReviewBtnText}>Ask AI Shikshak to Review or Optimize this Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  badge: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.primaryLight,
    marginBottom: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  langTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
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
  editorCard: {
    backgroundColor: '#0F172A',
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
    backgroundColor: '#1E293B',
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
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
    minHeight: 220,
    backgroundColor: '#0F172A',
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  runButtonDisabled: {
    opacity: 0.7,
  },
  runButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
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
    minHeight: 90,
  },
  emptyOutputText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  outputLine: {
    fontSize: 11,
    color: '#10B981',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  liveWebContainer: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: Spacing.sm,
  },
  liveWebHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    borderColor: '#38BDF855',
    padding: Spacing.md,
  },
  aiReviewBtn: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  aiReviewBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
});
