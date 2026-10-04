/**
 * Motu & Patlu: Gamified Coding Adventure — Tech Indro Mobile
 * Bite-sized interactive puzzles, character companions (Motu, Patlu, Chingam, John),
 * real character voice dialogues powered by Sarvam AI Indic TTS,
 * drag/tap code block ordering, syntax error inspections, and Samosa XP streak.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { playIndicVoice, stopAnyVoice } from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Character Mascots
export interface Mascot {
  id: 'motu' | 'patlu' | 'chingam' | 'john';
  name: string;
  role: string;
  avatar: any;
  voiceSpeaker: string;
  accentColor: string;
  quote: string;
}

const MASCOTS: Record<string, Mascot> = {
  motu: {
    id: 'motu',
    name: 'Motu',
    role: 'Samosa Lover & Coding Hero',
    avatar: require('../../assets/images/characters/motu-character.png'),
    voiceSpeaker: 'arvind',
    accentColor: '#EA580C',
    quote: 'Khaali pet mere dimaag ki batti nahi jalti! Samosa khao aur mast code banao!',
  },
  patlu: {
    id: 'patlu',
    name: 'Patlu',
    role: 'Logic & Algorithm Mastermind',
    avatar: require('../../assets/images/characters/patlu-character.jpg'),
    voiceSpeaker: 'meera',
    accentColor: '#0284C7',
    quote: 'Idea! Coding problem ka smart algorithm mil gaya! Code logic se chalta hai, samose se nahi!',
  },
  chingam: {
    id: 'chingam',
    name: 'Inspector Chingam',
    role: 'Law & Syntax Police',
    avatar: require('../../assets/images/characters/chingam-character.jpg'),
    voiceSpeaker: 'arvind',
    accentColor: '#16A34A',
    quote: 'Chingam ke ilaqe me koi syntax error bach nahi sakta! Law and order in every semicolon!',
  },
  john: {
    id: 'john',
    name: 'John the Don',
    role: 'Furfuri Nagar Bug Buster',
    avatar: require('../../assets/images/characters/john-character.jpg'),
    voiceSpeaker: 'arvind',
    accentColor: '#7C3AED',
    quote: 'John banega sabse bada Coder Don! Dekho kaisa zabardast aur khatarnaak code likha hai!',
  },
};

interface Lesson {
  id: string;
  title: string;
  type: 'arrange' | 'fill_blank' | 'choice';
  prompt: string;
  dialogue: string;
  codeSnippet?: string;
  blocks?: string[];
  correctOrder?: string[];
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

export interface LevelTier {
  id: 'basic' | 'medium' | 'datascience' | 'aiml';
  title: string;
  badge: string;
  color: string;
  iconName: any;
  description: string;
  lessons: Lesson[];
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    id: 'basic',
    title: 'Basic Python',
    badge: 'STAGE 1 (10 TASKS)',
    color: '#0284C7',
    iconName: 'code-slash',
    description: 'Foundations, Variables, Math, Conditionals, Loops & Functions',
    lessons: [
      {
        id: 'b-1',
        title: 'Say Hello to Python',
        type: 'arrange',
        prompt: 'Arrange the code blocks to print "Hello World" in Python:',
        dialogue: 'Motu says: Khaali pet dimaag nahi chalta, aao screen pe pehla text print karein!',
        blocks: ['print(', '"Hello World"', ')', 'echo', 'console.log'],
        correctOrder: ['print(', '"Hello World"', ')'],
        explanation: 'Python me print() standard function hai screen par output display karne ke liye.',
      },
      {
        id: 'b-2',
        title: 'Storing in Variables',
        type: 'fill_blank',
        prompt: 'Complete the line to store Motu\'s name in a variable:',
        dialogue: 'Patlu says: Variables data store karne ka box hain! Samosa count aur hero name store karo:',
        codeSnippet: '_____ = "Motu"',
        options: ['hero_name', '123', 'print()', 'def'],
        correctAnswer: 'hero_name',
        explanation: 'Python me variables letters ya underscore se shuru hote hain, jaise hero_name.',
      },
      {
        id: 'b-3',
        title: 'Samosa Math Logic',
        type: 'choice',
        prompt: 'What will be the output of this Python code?',
        dialogue: 'Motu needs your help counting party food! Dhyan se calculate karo:',
        codeSnippet: 'samosas = 5\njalebis = 3\nprint(samosas + jalebis)',
        options: ['8', '"samosas + jalebis"', '53', 'Syntax Error'],
        correctAnswer: '8',
        explanation: '5 + 3 = 8. Python integers ko naturally add karta hai!',
      },
      {
        id: 'b-4',
        title: 'Chingam Bug Patrol',
        type: 'choice',
        prompt: 'Which line contains a syntax error in Python?',
        dialogue: 'Inspector Chingam says: Thhaai! Syntax rules todne wale bug ko pakdo!',
        codeSnippet: 'Line 1: print("Welcome")\nLine 2: print("Hello"\nLine 3: score = 100',
        options: ['Line 1', 'Line 2 (Missing closing parenthesis)', 'Line 3'],
        correctAnswer: 'Line 2 (Missing closing parenthesis)',
        explanation: 'Har open bracket "(" ka matching closing bracket ")" hona zaroori hai!',
      },
      {
        id: 'b-5',
        title: 'Conditionals (if-else)',
        type: 'fill_blank',
        prompt: 'Keyword to execute block when condition is True:',
        dialogue: 'Patlu says: Agar samosa count 0 se bada hai, toh Motu khush hoga!',
        codeSnippet: '_____ samosas > 0:\n    print("Motu is happy!")',
        options: ['if', 'when', 'check', 'loop'],
        correctAnswer: 'if',
        explanation: 'Python me "if" statement conditions ko evaluate karne ke liye use hota hai.',
      },
      {
        id: 'b-6',
        title: 'While Loop Countdown',
        type: 'fill_blank',
        prompt: 'Loop keyword that repeats code while a condition is True:',
        dialogue: 'Motu eats samosas until the box is empty:',
        codeSnippet: '_____ samosas > 0:\n    samosas -= 1',
        options: ['while', 'until', 'repeat', 'loop'],
        correctAnswer: 'while',
        explanation: 'while loop condition True rehne tak repeatedly execute hota hai.',
      },
      {
        id: 'b-7',
        title: 'For Loop Range',
        type: 'choice',
        prompt: 'What numbers are printed by for i in range(3)?',
        dialogue: 'Count round numbers in Furfuri Nagar:',
        codeSnippet: 'for i in range(3):\n    print(i)',
        options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3, 2, 1'],
        correctAnswer: '0, 1, 2',
        explanation: 'range(3) produces 0, 1, and 2 (starts at 0 and stops before 3).',
      },
      {
        id: 'b-8',
        title: 'Function Definition (def)',
        type: 'fill_blank',
        prompt: 'Keyword to define a reusable function in Python:',
        dialogue: 'Dr. Jhatka creates a function to prepare samosa energy potion:',
        codeSnippet: '_____ boost_energy(x):\n    return x * 10',
        options: ['def', 'function', 'fn', 'func'],
        correctAnswer: 'def',
        explanation: 'Python me functions "def" keyword se define hote hain.',
      },
      {
        id: 'b-9',
        title: 'Modulo Operator (%)',
        type: 'choice',
        prompt: 'What is the output of 11 % 3 in Python?',
        dialogue: 'Divide samosas and find the leftover remainder:',
        codeSnippet: 'remainder = 11 % 3',
        options: ['2', '3', '3.66', '1'],
        correctAnswer: '2',
        explanation: '11 ko 3 se divide karne par 9 tak poora jata hai, remainder 2 bachta hai.',
      },
      {
        id: 'b-10',
        title: 'Boss Battle: John the Don',
        type: 'arrange',
        prompt: 'Assemble code to declare samosas = 10 and print it:',
        dialogue: 'John challenges you: Agar himmat hai toh mera puzzle solve karke dikhao!',
        blocks: ['samosas = 10\n', 'print(', 'samosas', ')'],
        correctOrder: ['samosas = 10\n', 'print(', 'samosas', ')'],
        explanation: 'Pehle samosas = 10 assign kiya, fir print(samosas) call karke display kiya!',
      },
    ],
  },
  {
    id: 'medium',
    title: 'Python Libraries',
    badge: 'STAGE 2 (10 TASKS)',
    color: '#D97706',
    iconName: 'cube-outline',
    description: 'Lists, Dictionaries, NumPy Arrays & Vector Math',
    lessons: [
      {
        id: 'm-1',
        title: 'Python Lists',
        type: 'arrange',
        prompt: 'Assemble a Python list containing "samosa" and "jalebi":',
        dialogue: 'Motu lists his favorite snacks in Python:',
        blocks: ['menu = [', '"samosa"', ', "jalebi"', ']', 'new Array('],
        correctOrder: ['menu = [', '"samosa"', ', "jalebi"', ']'],
        explanation: 'Square brackets [ ... ] are used to create lists in Python.',
      },
      {
        id: 'm-2',
        title: 'List Append Method',
        type: 'fill_blank',
        prompt: 'Method to add an item to the end of a Python list:',
        dialogue: 'Add one more snack to Motu\'s order list:',
        codeSnippet: 'menu._____("kachori")',
        options: ['append', 'push', 'add', 'insert'],
        correctAnswer: 'append',
        explanation: '.append() adds a new element to the end of a Python list.',
      },
      {
        id: 'm-3',
        title: 'Negative List Index',
        type: 'fill_blank',
        prompt: 'Index used to grab the very last element of a list directly:',
        dialogue: 'Quickly access the last snack on the plate:',
        codeSnippet: 'last_snack = menu[_____]',
        options: ['-1', '0', 'last', 'end'],
        correctAnswer: '-1',
        explanation: 'menu[-1] always retrieves the last element of the list.',
      },
      {
        id: 'm-4',
        title: 'Python Dictionaries',
        type: 'choice',
        prompt: 'How are key-value pairs separated in a Python dictionary?',
        dialogue: 'Store hero profiles with Patlu:',
        codeSnippet: 'hero = {"name": "Motu", "food": "Samosa"}',
        options: [': (Colon)', '= (Equals)', '-> (Arrow)', '- (Hyphen)'],
        correctAnswer: ': (Colon)',
        explanation: 'Dictionaries map keys to values using colons {key: value}.',
      },
      {
        id: 'm-5',
        title: 'Importing NumPy',
        type: 'fill_blank',
        prompt: 'Standard alias used to import NumPy in Python:',
        dialogue: 'Dr. Jhatka prepares high-speed numerical vectors for his rocket!',
        codeSnippet: 'import numpy as _____',
        options: ['np', 'numpy', 'num', 'arr'],
        correctAnswer: 'np',
        explanation: '"np" is the universal industry-standard alias for NumPy in Python.',
      },
      {
        id: 'm-6',
        title: 'NumPy Vectorized Array',
        type: 'arrange',
        prompt: 'Assemble code to create a NumPy array with numbers 10, 20, 30:',
        dialogue: 'Convert normal lists into ultra-fast NumPy arrays!',
        blocks: ['arr = ', 'np.array(', '[10, 20, 30]', ')', 'list('],
        correctOrder: ['arr = ', 'np.array(', '[10, 20, 30]', ')'],
        explanation: 'np.array([10, 20, 30]) creates a 1D vectorized numerical array.',
      },
      {
        id: 'm-7',
        title: 'Matrix Dimensions (Shape)',
        type: 'choice',
        prompt: 'What is the shape of a 2-row, 3-column matrix in NumPy?',
        dialogue: 'Patlu measures the matrix dimensions for Furfuri Nagar map data:',
        codeSnippet: 'grid = np.zeros((2, 3))\nprint(grid.shape)',
        options: ['(2, 3)', '(3, 2)', '6', '(2, 2)'],
        correctAnswer: '(2, 3)',
        explanation: '.shape returns a tuple representing (rows, columns), which is (2, 3).',
      },
      {
        id: 'm-8',
        title: 'Vectorized Broadcasting',
        type: 'choice',
        prompt: 'What is the evaluated output of np.array([1, 2, 3]) + 10?',
        dialogue: 'Dr. Jhatka adds 10 to every element in a single CPU operation:',
        codeSnippet: 'print(np.array([1, 2, 3]) + 10)',
        options: ['[11, 12, 13]', '[1, 2, 3, 10]', 'Error', '[10, 20, 30]'],
        correctAnswer: '[11, 12, 13]',
        explanation: 'NumPy broadcasting automatically applies arithmetic to each element.',
      },
      {
        id: 'm-9',
        title: 'Zero Matrix Allocation',
        type: 'fill_blank',
        prompt: 'NumPy function to initialize a 3x3 matrix filled with zeros:',
        dialogue: 'Allocate clean zero memory for rocket sensors:',
        codeSnippet: 'grid = np._____((3, 3))',
        options: ['zeros', 'empty', 'blank', 'nulls'],
        correctAnswer: 'zeros',
        explanation: 'np.zeros(shape) creates an array filled with 0.0 values.',
      },
      {
        id: 'm-10',
        title: 'Matrix Dot Product',
        type: 'fill_blank',
        prompt: 'NumPy function to compute the matrix dot product multiplication:',
        dialogue: 'Compute matrix transformation vectors with Patlu:',
        codeSnippet: 'result = np._____(matrix_a, matrix_b)',
        options: ['dot', 'mult', 'times', 'prod'],
        correctAnswer: 'dot',
        explanation: 'np.dot(A, B) computes matrix multiplication.',
      },
    ],
  },
  {
    id: 'datascience',
    title: 'Data Science & EDA',
    badge: 'STAGE 3 (10 TASKS)',
    color: '#059669',
    iconName: 'bar-chart-outline',
    description: 'Pandas DataFrames, Data Cleaning & Visual Charts',
    lessons: [
      {
        id: 'ds-1',
        title: 'Importing Pandas',
        type: 'fill_blank',
        prompt: 'Standard universal industry import alias for Pandas:',
        dialogue: 'Initialize the premier data science manipulation library in Python:',
        codeSnippet: 'import pandas as _____',
        options: ['pd', 'pandas', 'p', 'pan'],
        correctAnswer: 'pd',
        explanation: '"pd" is the universal industry standard alias for Pandas.',
      },
      {
        id: 'ds-2',
        title: 'Pandas CSV Reader',
        type: 'fill_blank',
        prompt: 'Pandas function to read a tabular CSV file into a DataFrame:',
        dialogue: 'Inspector Chingam loads criminal records of John into Pandas!',
        codeSnippet: 'df = pd.____("records.csv")',
        options: ['read_csv', 'load_csv', 'open_csv', 'scan'],
        correctAnswer: 'read_csv',
        explanation: 'pd.read_csv() is the standard function to import CSV datasets into Pandas DataFrames.',
      },
      {
        id: 'ds-3',
        title: 'Previewing First Rows',
        type: 'choice',
        prompt: 'Which method displays the first 5 rows of a DataFrame by default?',
        dialogue: 'Take a quick glance at the top of your dataset with Patlu:',
        codeSnippet: 'print(df.head())',
        options: ['df.head()', 'df.top()', 'df.first(5)', 'df.peek()'],
        correctAnswer: 'df.head()',
        explanation: 'df.head(n) returns the first n rows (5 by default).',
      },
      {
        id: 'ds-4',
        title: 'Statistical Summary (.describe)',
        type: 'fill_blank',
        prompt: 'Method that automatically calculates count, mean, std, min, and max:',
        dialogue: 'Generate full statistical summary of bakery sales in 1 line:',
        codeSnippet: 'stats = df._____()',
        options: ['describe', 'summary', 'stats', 'info'],
        correctAnswer: 'describe',
        explanation: 'df.describe() computes 8 descriptive statistics for all numerical columns automatically.',
      },
      {
        id: 'ds-5',
        title: 'Selecting a Column',
        type: 'choice',
        prompt: 'How do you extract the "revenue" column from DataFrame df?',
        dialogue: 'Isolate daily revenue numbers for analysis:',
        codeSnippet: 'rev_series = df["revenue"]',
        options: ['df["revenue"]', 'df.get_column("revenue")', 'df.select("revenue")', 'df->revenue'],
        correctAnswer: 'df["revenue"]',
        explanation: 'df["column_name"] accesses that column as a 1D Pandas Series.',
      },
      {
        id: 'ds-6',
        title: 'Filtering Rows with Mask',
        type: 'arrange',
        prompt: 'Assemble code to filter all rows where samosa sales exceed 100:',
        dialogue: 'Filter the best-selling days using a boolean conditional mask:',
        
        blocks: ['best_days = ', 'df[', 'df["sales"] > 100', ']'],
        correctOrder: ['best_days = ', 'df[', 'df["sales"] > 100', ']'],
        explanation: 'df[df["col"] > val] creates a boolean mask that filters rows.',
      },
      {
        id: 'ds-7',
        title: 'Detecting Missing Nulls',
        type: 'fill_blank',
        prompt: 'Count missing (null/NaN) values in every column of DataFrame:',
        dialogue: 'Find missing entries in the dataset before training models:',
        codeSnippet: 'missing_counts = df.____().sum()',
        options: ['isnull', 'is_empty', 'no_data', 'clean'],
        correctAnswer: 'isnull',
        explanation: 'df.isnull().sum() gives the total count of null values column-wise.',
      },
      {
        id: 'ds-8',
        title: 'Imputing Missing Values',
        type: 'choice',
        prompt: 'Which Pandas method fills missing NaN values with the mean?',
        dialogue: 'Patlu fills missing prices smartly without deleting records:',
        codeSnippet: 'df["price"] = df["price"].fillna(df["price"].mean())',
        options: ['fillna', 'dropna', 'replace_zero', 'remove'],
        correctAnswer: 'fillna',
        explanation: '.fillna(val) replaces null NaN values with your calculated replacement.',
      },
      {
        id: 'ds-9',
        title: 'GroupBy Aggregation',
        type: 'choice',
        prompt: 'How do you calculate total sales grouped by store branch in Pandas?',
        dialogue: 'Find which Furfuri Nagar branch sells the most samosas:',
        codeSnippet: 'df.groupby("branch")["sales"].sum()',
        options: [
          'df.groupby("branch")["sales"].sum()',
          'df.group_by("branch").aggregate("sales")',
          'df.split("branch").sum()',
          'select sum(sales) group by branch'
        ],
        correctAnswer: 'df.groupby("branch")["sales"].sum()',
        explanation: 'df.groupby("col1")["col2"].sum() groups records and computes the sum.',
      },
      {
        id: 'ds-10',
        title: 'Matplotlib Visualization',
        type: 'fill_blank',
        prompt: 'Command required to display the rendered chart on screen:',
        dialogue: 'Show the completed sales graph to Motu & Patlu!',
        codeSnippet: 'plt.bar(flavors, sales)\nplt._____()',
        options: ['show', 'render', 'display', 'view'],
        correctAnswer: 'show',
        explanation: 'plt.show() opens the graphic window displaying the plot.',
      },
    ],
  },
  {
    id: 'aiml',
    title: 'AI & Machine Learning',
    badge: 'STAGE 4 (10 TASKS)',
    color: '#7C3AED',
    iconName: 'hardware-chip-outline',
    description: 'Scikit-learn, Decision Trees, Neural Nets & GenAI',
    lessons: [
      {
        id: 'ai-1',
        title: 'Train-Test Data Split',
        type: 'choice',
        prompt: 'Why do ML engineers split data into Train (80%) and Test (20%)?',
        dialogue: 'Patlu explains the Golden Rule of Machine Learning:',
        codeSnippet: 'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)',
        options: [
          'To test model on unseen data and prevent overfitting',
          'To make CPU fan run slower',
          'Because Python cannot load all rows at once',
        ],
        correctAnswer: 'To test model on unseen data and prevent overfitting',
        explanation: 'Testing on unseen data proves whether the model actually generalized patterns!',
      },
      {
        id: 'ai-2',
        title: 'Importing train_test_split',
        type: 'arrange',
        prompt: 'Assemble code to import train_test_split from scikit-learn:',
        dialogue: 'Dr. Jhatka sets up his machine learning experiment workbench:',
        blocks: ['from sklearn.model_selection import ', 'train_test_split', 'import ml_split'],
        correctOrder: ['from sklearn.model_selection import ', 'train_test_split'],
        explanation: 'train_test_split lives inside the sklearn.model_selection module.',
      },
      {
        id: 'ai-3',
        title: 'Training ML Regressor',
        type: 'arrange',
        prompt: 'Assemble sequence to train a Linear Regression model in scikit-learn:',
        dialogue: 'Predict tomorrow\'s samosa orders using Machine Learning!',
        blocks: ['model = LinearRegression()\n', 'model.fit(X_train, y_train)\n', 'preds = model.predict(X_test)'],
        correctOrder: ['model = LinearRegression()\n', 'model.fit(X_train, y_train)\n', 'preds = model.predict(X_test)'],
        explanation: 'First initialize model, call .fit() to train weights, then .predict() to make inferences!',
      },
      {
        id: 'ai-4',
        title: 'Model Fit Method',
        type: 'fill_blank',
        prompt: 'Scikit-learn method used to train an algorithm on training features & labels:',
        dialogue: 'Train the model weights on historical samosa sales data:',
        codeSnippet: 'model._____(X_train, y_train)',
        options: ['fit', 'train', 'learn', 'run'],
        correctAnswer: 'fit',
        explanation: '.fit(X, y) estimates the parameters/weights of the estimator.',
      },
      {
        id: 'ai-5',
        title: 'Model Predict Method',
        type: 'fill_blank',
        prompt: 'Method used on a trained model to forecast predictions on new test data:',
        dialogue: 'Forecast tomorrow\'s customer footfall with Patlu:',
        codeSnippet: 'predictions = model._____(X_test)',
        options: ['predict', 'forecast', 'test', 'infer'],
        correctAnswer: 'predict',
        explanation: '.predict(X) computes model predictions for the input samples.',
      },
      {
        id: 'ai-6',
        title: 'Decision Tree Classifier',
        type: 'fill_blank',
        prompt: 'Class used to construct tree-based decision classification in Scikit-Learn:',
        dialogue: 'Inspector Chingam uses a Decision Tree to identify suspects!',
        codeSnippet: 'clf = _____(max_depth=5)\nclf.fit(X, y)',
        options: ['DecisionTreeClassifier', 'TreeModel', 'ClassifyTree', 'Forest'],
        correctAnswer: 'DecisionTreeClassifier',
        explanation: 'DecisionTreeClassifier is scikit-learn\'s core decision tree estimator.',
      },
      {
        id: 'ai-7',
        title: 'Model Accuracy Evaluation',
        type: 'choice',
        prompt: 'If model predicted 90 correct answers out of 100 test samples, accuracy is:',
        dialogue: 'Dr. Jhatka evaluates the classification accuracy of his robot:',
        codeSnippet: 'accuracy = correct_predictions / total_samples',
        options: ['90% (0.90)', '10%', '100%', '81%'],
        correctAnswer: '90% (0.90)',
        explanation: 'Accuracy = 90 / 100 = 0.90 or 90%.',
      },
      {
        id: 'ai-8',
        title: 'Neural Network Non-Linearity',
        type: 'choice',
        prompt: 'Why do Artificial Neural Networks (Deep Learning) use activation functions like ReLU?',
        dialogue: 'Patlu reveals how Artificial Brains solve complex non-linear problems:',
        codeSnippet: 'output = relu(weights * inputs + bias)',
        options: [
          'To introduce non-linearity so networks can learn complex patterns beyond simple lines',
          'To cool down the GPU fans during matrix multiplication',
          'To erase weights from computer memory',
          'To round numbers to integers'
        ],
        correctAnswer: 'To introduce non-linearity so networks can learn complex patterns beyond simple lines',
        explanation: 'Without non-linear activation functions like ReLU, stacked neural layers collapse into a single linear equation!',
      },
      {
        id: 'ai-9',
        title: 'Weights and Biases',
        type: 'choice',
        prompt: 'What are the two primary learnable parameters in an artificial neuron?',
        dialogue: 'Dr. Jhatka tunes the synaptic parameters of his neural net:',
        codeSnippet: 'z = w * x + b',
        options: ['Weights (w) and Bias (b)', 'RAM and ROM', 'Monitor and Keyboard', 'Width and Height'],
        correctAnswer: 'Weights (w) and Bias (b)',
        explanation: 'Neurons learn scalar weights (slopes) and biases (intercepts) to fit training data.',
      },
      {
        id: 'ai-10',
        title: 'GenAI LLM System Role',
        type: 'fill_blank',
        prompt: 'The role assigned to an LLM to control its teacher persona:',
        dialogue: 'Build an autonomous Motu & Patlu AI coding mentor bot!',
        codeSnippet: 'messages = [\n    {"role": "_____", "content": "You are Motu, friendly coding teacher"},\n    {"role": "user", "content": "Teach me loops!"}\n]',
        options: ['system', 'bot', 'admin', 'root'],
        correctAnswer: 'system',
        explanation: 'The "system" prompt configures the identity, boundaries, and persona of modern LLMs.',
      },
    ],
  },
];

export default function MotuPatluGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Selected Stage / Tier (Basic, Medium, Data Science, AI/ML)
  const [activeTierId, setActiveTierId] = useState<string>('basic');
  const [activeMascotKey, setActiveMascotKey] = useState<string>('motu');

  // Gamified Stats
  const [streakDays, setStreakDays] = useState(5);
  const [samosaXp, setSamosaXp] = useState(320);
  const [samosas, setSamosas] = useState(5); // Hearts / Lives

  // Progress tracking: unlocked index per stage
  const [unlockedByTier, setUnlockedByTier] = useState<Record<string, number>>({
    basic: 0,
    medium: 0,
    datascience: 0,
    aiml: 0,
  });

  // Chests claimed
  const [claimedChests, setClaimedChests] = useState<Record<string, boolean>>({});

  // Active Lesson Modal
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Lesson Interactive State
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Modals
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [guidebookVisible, setGuidebookVisible] = useState(false);
  const [chestModalVisible, setChestModalVisible] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(50);

  const activeMascot = MASCOTS[activeMascotKey] || MASCOTS.motu;
  const currentTier = LEVEL_TIERS.find((t) => t.id === activeTierId) || LEVEL_TIERS[0];
  const lessons = currentTier.lessons;
  const unlockedIndex = unlockedByTier[activeTierId] ?? 0;
  const playingLesson = lessons[activeLessonIndex] || lessons[0];

  // Load progress on mount
  useEffect(() => {
    (async () => {
      try {
        const savedMascot = await AsyncStorage.getItem('tech_indro_mascot');
        if (savedMascot && MASCOTS[savedMascot]) {
          setActiveMascotKey(savedMascot);
        }
        const savedXp = await AsyncStorage.getItem('tech_indro_samosa_xp');
        if (savedXp) setSamosaXp(parseInt(savedXp, 10));

        const savedProgress = await AsyncStorage.getItem('tech_indro_tier_progress');
        if (savedProgress) {
          setUnlockedByTier((prev) => ({ ...prev, ...JSON.parse(savedProgress) }));
        }

        const savedChests = await AsyncStorage.getItem('tech_indro_claimed_chests');
        if (savedChests) {
          setClaimedChests(JSON.parse(savedChests));
        }
      } catch (e) {}
    })();
  }, []);

  const handleSelectMascot = (key: string) => {
    setActiveMascotKey(key);
    AsyncStorage.setItem('tech_indro_mascot', key).catch(() => {});
    const m = MASCOTS[key];
    if (m) {
      playIndicVoice({
        text: m.quote,
        language: 'hi',
        speaker: m.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleVoiceDialogue = (customText?: string, speaker?: string) => {
    if (isSpeaking) {
      stopAnyVoice();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = customText || `${activeMascot.name} says: ${playingLesson.dialogue}`;
    playIndicVoice({
      text: textToSpeak,
      language: 'hi',
      speaker: speaker || activeMascot.voiceSpeaker,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Open Lesson Modal
  const handleOpenLesson = (index: number) => {
    if (index > unlockedIndex) {
      Alert.alert(
        'Lesson Locked',
        'Pichle puzzles complete karo ya active challenge khelo to unlock this step!',
        [{ text: 'Theek Hai' }]
      );
      return;
    }
    setActiveLessonIndex(index);
    setSelectedBlocks([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setLessonModalVisible(true);
    stopAnyVoice();
    setIsSpeaking(false);
  };

  // Chest Click
  const handleOpenChest = (index: number) => {
    const chestKey = `${activeTierId}_chest_${index}`;
    if (index > unlockedIndex) {
      Alert.alert('Chest Locked', 'Is milestone chest tak pahuchne ke liye pehle ke lessons complete karo!');
      return;
    }
    if (claimedChests[chestKey]) {
      Alert.alert('Already Claimed', 'Aapne ye Samosa XP treasure pehle hi claim kar liya hai!');
      return;
    }
    setRewardAmount(50);
    setChestModalVisible(true);
    const newChests = { ...claimedChests, [chestKey]: true };
    setClaimedChests(newChests);
    AsyncStorage.setItem('tech_indro_claimed_chests', JSON.stringify(newChests)).catch(() => {});
    const newXp = samosaXp + 50;
    setSamosaXp(newXp);
    AsyncStorage.setItem('tech_indro_samosa_xp', newXp.toString()).catch(() => {});
  };

  // Toggle Block in Arrange
  const handleToggleBlock = (block: string) => {
    if (isAnswered) return;
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (isAnswered) return;

    let correct = false;
    if (playingLesson.type === 'arrange') {
      const target = playingLesson.correctOrder || [];
      correct =
        selectedBlocks.length === target.length &&
        selectedBlocks.every((val, idx) => val === target[idx]);
    } else {
      correct = selectedOption === playingLesson.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newXp = samosaXp + 25;
      setSamosaXp(newXp);
      AsyncStorage.setItem('tech_indro_samosa_xp', newXp.toString()).catch(() => {});

      // Unlock next lesson if this was the active one
      if (activeLessonIndex === unlockedIndex && unlockedIndex < lessons.length - 1) {
        const nextUnlocked = unlockedIndex + 1;
        const newProgress = { ...unlockedByTier, [activeTierId]: nextUnlocked };
        setUnlockedByTier(newProgress);
        AsyncStorage.setItem('tech_indro_tier_progress', JSON.stringify(newProgress)).catch(() => {});
      }

      const cheer = `${activeMascot.name} says: Wah kya baat hai! Bilkul sahi jawaab!`;
      playIndicVoice({
        text: cheer,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });

      if (activeLessonIndex === lessons.length - 1) {
        setTimeout(() => {
          setLessonModalVisible(false);
          setCelebrationVisible(true);
        }, 1200);
      }
    } else {
      setSamosas((prev) => Math.max(0, prev - 1));
      const hint = `${activeMascot.name} says: Arrey dhyan se socho! Fir se try karo!`;
      playIndicVoice({
        text: hint,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setSelectedBlocks([]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      stopAnyVoice();
      setIsSpeaking(false);
    } else {
      setLessonModalVisible(false);
      setCelebrationVisible(true);
    }
  };

  const handleResetChallenge = () => {
    setSelectedBlocks([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Duolingo winding S-curve horizontal offsets
  const PATH_OFFSETS = [0, -44, -58, -32, 12, 50, 58, 28, -16, 0];

  const completedCount = Math.min(lessons.length, unlockedIndex);
  const progressRatio = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F7F9FA' }]} edges={['top']}>
      {/* 1. DUOLINGO TOP STATS BAR */}
      <View style={[styles.duoHeader, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderBottomColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
        <View style={styles.duoHeaderLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backCircleBtn, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>

          <View style={[styles.langChip, { borderColor: isDark ? '#374151' : '#E5E7EB', backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="code-slash" size={15} color="#58CC02" />
            <Text style={[styles.langChipText, { color: isDark ? '#F9FAFB' : '#111827' }]}>Python 3</Text>
          </View>
        </View>

        <View style={styles.duoStatsRow}>
          {/* Streak */}
          <View style={[styles.statBadge, styles.streakBadge]}>
            <Ionicons name="flame" size={17} color="#FF9600" />
            <Text style={[styles.statBadgeText, { color: '#FF9600' }]}>{streakDays}</Text>
          </View>

          {/* Samosa XP / Gems */}
          <View style={[styles.statBadge, styles.gemsBadge]}>
            <Ionicons name="diamond" size={16} color="#1CB0F6" />
            <Text style={[styles.statBadgeText, { color: '#1CB0F6' }]}>{samosaXp}</Text>
          </View>

          {/* Hearts / Lives */}
          <View style={[styles.statBadge, styles.heartsBadge]}>
            <Ionicons name="heart" size={17} color="#FF4B4B" />
            <Text style={[styles.statBadgeText, { color: '#FF4B4B' }]}>{samosas}</Text>
          </View>

          {/* Pro Shield */}
          <LinearGradient
            colors={['#9333EA', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proShieldBadge}
          >
            <Ionicons name="shield" size={13} color="#FFF" />
            <Text style={styles.proShieldText}>PRO</Text>
          </LinearGradient>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. DUOLINGO STAGE NAV PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stageNavScroll}
        >
          {LEVEL_TIERS.map((tier) => {
            const isActive = tier.id === activeTierId;
            return (
              <TouchableOpacity
                key={tier.id}
                onPress={() => setActiveTierId(tier.id)}
                activeOpacity={0.8}
                style={[
                  styles.stageNavPill,
                  isActive
                    ? [styles.stageNavPillActive, { backgroundColor: tier.color, borderColor: tier.color }]
                    : [
                        styles.stageNavPillInactive,
                        {
                          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                          borderColor: isDark ? '#374151' : '#E5E7EB',
                        },
                      ],
                ]}
              >
                <Ionicons
                  name={tier.iconName}
                  size={15}
                  color={isActive ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.stageNavPillText,
                    { color: isActive ? '#FFFFFF' : isDark ? '#E5E7EB' : '#374151' },
                  ]}
                >
                  {tier.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 3. DUOLINGO UNIT 3D BANNER CARD */}
        <View
          style={[
            styles.unitCard,
            {
              backgroundColor: currentTier.color,
              borderBottomColor:
                currentTier.id === 'basic'
                  ? '#0369A1'
                  : currentTier.id === 'medium'
                  ? '#B45309'
                  : currentTier.id === 'datascience'
                  ? '#047857'
                  : '#6D28D9',
            },
          ]}
        >
          <View style={styles.unitCardTop}>
            <View style={styles.unitBadgeRow}>
              <View style={styles.unitBadgePill}>
                <Text style={styles.unitBadgePillText}>{currentTier.badge}</Text>
              </View>
              <Text style={styles.unitProgressText}>
                {completedCount}/{lessons.length} Completed
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setGuidebookVisible(true)}
              style={styles.guidebookBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="book-outline" size={15} color="#FFFFFF" />
              <Text style={styles.guidebookBtnText}>GUIDEBOOK</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.unitTitleText}>{currentTier.title}: Quest Map</Text>
          <Text style={styles.unitDescText}>{currentTier.description}</Text>

          {/* Unit Progress Bar */}
          <View style={styles.unitProgressBarTrack}>
            <View style={[styles.unitProgressBarFill, { width: `${progressRatio}%` }]} />
          </View>
        </View>

        {/* 4. DUOLINGO S-CURVE WINDING LEARNING PATH */}
        <View style={styles.pathArea}>
          {lessons.map((lesson, idx) => {
            const isCompleted = idx < unlockedIndex;
            const isActive = idx === unlockedIndex;
            const isLocked = idx > unlockedIndex;
            const isChest = idx === 4 || idx === 9; // Milestone Chests at node 5 and 10
            const chestKey = `${activeTierId}_chest_${idx}`;
            const isChestClaimed = claimedChests[chestKey];
            const offset = PATH_OFFSETS[idx % PATH_OFFSETS.length];

            // Render inline character dialog after node 2, 5, 8
            const showMotuBalloon = idx === 2;
            const showPatluBalloon = idx === 5;
            const showChingamBalloon = idx === 8;

            return (
              <View key={lesson.id} style={styles.pathStepWrapper}>
                {/* Connecting Path Line to next node */}
                {idx > 0 && (
                  <View
                    style={[
                      styles.pathConnectorLine,
                      {
                        backgroundColor:
                          idx <= unlockedIndex
                            ? currentTier.color
                            : isDark
                            ? '#374151'
                            : '#E5E7EB',
                      },
                    ]}
                  />
                )}

                {/* Stepping Stone Node */}
                <View
                  style={[
                    styles.nodeContainer,
                    {
                      transform: [{ translateX: offset }],
                    },
                  ]}
                >
                  {/* Floating "START" Tooltip above active node */}
                  {isActive && (
                    <View style={styles.startTooltipContainer}>
                      <View style={[styles.startTooltipBadge, { backgroundColor: currentTier.color }]}>
                        <Text style={styles.startTooltipText}>START</Text>
                      </View>
                      <View
                        style={[
                          styles.startTooltipArrow,
                          { borderTopColor: currentTier.color },
                        ]}
                      />
                    </View>
                  )}

                  {/* 3D Stepping Stone Button */}
                  <TouchableOpacity
                    onPress={() => (isChest ? handleOpenChest(idx) : handleOpenLesson(idx))}
                    activeOpacity={0.82}
                    style={[
                      isChest ? styles.chestNodeBtn : styles.circleNodeBtn,
                      isCompleted
                        ? styles.nodeBtnCompleted
                        : isActive
                        ? [styles.nodeBtnActive, { backgroundColor: currentTier.color }]
                        : isLocked
                        ? isDark
                          ? styles.nodeBtnLockedDark
                          : styles.nodeBtnLockedLight
                        : {},
                    ]}
                  >
                    {isChest ? (
                      <Ionicons
                        name="gift"
                        size={30}
                        color={isChestClaimed ? '#FDE68A' : '#FFFFFF'}
                      />
                    ) : isCompleted ? (
                      <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                    ) : isActive ? (
                      <Ionicons name="star" size={32} color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name="lock-closed"
                        size={24}
                        color={isDark ? '#6B7280' : '#9CA3AF'}
                      />
                    )}
                  </TouchableOpacity>

                  {/* Node label */}
                  <Text
                    style={[
                      styles.nodeLabelText,
                      {
                        color: isActive
                          ? isDark
                            ? '#F9FAFB'
                            : '#111827'
                          : isDark
                          ? '#9CA3AF'
                          : '#6B7280',
                        fontWeight: isActive ? '800' : '600',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {isChest ? (isChestClaimed ? 'Claimed' : '+50 XP Chest') : `Lesson ${idx + 1}`}
                  </Text>
                </View>

                {/* Inline Character Dialogue Balloon: Motu */}
                {showMotuBalloon && (
                  <View
                    style={[
                      styles.characterBalloonCard,
                      {
                        backgroundColor: isDark ? '#1F2937' : '#FFF7ED',
                        borderColor: '#EA580C',
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/characters/motu-character.png')}
                      style={styles.characterBalloonAvatar}
                    />
                    <View style={styles.characterBalloonContent}>
                      <View style={styles.characterBalloonNameRow}>
                        <Text style={[styles.characterBalloonName, { color: '#EA580C' }]}>
                          Motu (Coding Hero)
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleVoiceDialogue(
                              'Khaali pet mere dimaag ki batti nahi jalti! Samosa khao aur mast code banao!',
                              'arvind'
                            )
                          }
                          style={[styles.miniSpeakerBtn, { backgroundColor: '#EA580C' }]}
                        >
                          <Ionicons name="volume-high" size={13} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          styles.characterBalloonSpeech,
                          { color: isDark ? '#E5E7EB' : '#7C2D12' },
                        ]}
                      >
                        "Khaali pet dimaag nahi chalta! Jaldi se variable aur math logic puzzles solve karo!"
                      </Text>
                    </View>
                  </View>
                )}

                {/* Inline Character Dialogue Balloon: Patlu */}
                {showPatluBalloon && (
                  <View
                    style={[
                      styles.characterBalloonCard,
                      {
                        backgroundColor: isDark ? '#1F2937' : '#F0F9FF',
                        borderColor: '#0284C7',
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/characters/patlu-character.jpg')}
                      style={styles.characterBalloonAvatar}
                    />
                    <View style={styles.characterBalloonContent}>
                      <View style={styles.characterBalloonNameRow}>
                        <Text style={[styles.characterBalloonName, { color: '#0284C7' }]}>
                          Patlu (Logic Master)
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleVoiceDialogue(
                              'Idea! Coding problem ka smart algorithm mil gaya! Code logic se chalta hai!',
                              'meera'
                            )
                          }
                          style={[styles.miniSpeakerBtn, { backgroundColor: '#0284C7' }]}
                        >
                          <Ionicons name="volume-high" size={13} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          styles.characterBalloonSpeech,
                          { color: isDark ? '#E5E7EB' : '#0369A1' },
                        ]}
                      >
                        "Smart algorithm se har problem solve hoti hai! Loops aur conditions par focus rakho!"
                      </Text>
                    </View>
                  </View>
                )}

                {/* Inline Character Dialogue Balloon: Chingam */}
                {showChingamBalloon && (
                  <View
                    style={[
                      styles.characterBalloonCard,
                      {
                        backgroundColor: isDark ? '#1F2937' : '#F0FDF4',
                        borderColor: '#16A34A',
                      },
                    ]}
                  >
                    <Image
                      source={require('../../assets/images/characters/chingam-character.jpg')}
                      style={styles.characterBalloonAvatar}
                    />
                    <View style={styles.characterBalloonContent}>
                      <View style={styles.characterBalloonNameRow}>
                        <Text style={[styles.characterBalloonName, { color: '#16A34A' }]}>
                          Inspector Chingam
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleVoiceDialogue(
                              'Chingam ke ilaqe me koi syntax error bach nahi sakta!',
                              'arvind'
                            )
                          }
                          style={[styles.miniSpeakerBtn, { backgroundColor: '#16A34A' }]}
                        >
                          <Ionicons name="volume-high" size={13} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          styles.characterBalloonSpeech,
                          { color: isDark ? '#E5E7EB' : '#15803D' },
                        ]}
                      >
                        "Syntax police on duty! Closing parenthesis aur quotes ka dhyan rakhein!"
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* 5. PICK YOUR CODING BUDDY (Mascot Switcher) */}
        <View style={styles.mascotSection}>
          <Text style={[styles.mascotSectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            Pick Your Companion
          </Text>
          <Text style={styles.mascotSectionSub}>
            Tap a hero to change your mentor voice (Sarvam AI)
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mascotRow}>
            {Object.keys(MASCOTS).map((key) => {
              const m = MASCOTS[key];
              const isSelected = m.id === activeMascotKey;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => handleSelectMascot(m.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.mascotCard,
                    {
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isSelected ? m.accentColor : isDark ? '#374151' : '#E5E7EB',
                      borderWidth: isSelected ? 2.5 : 1.5,
                      borderBottomWidth: isSelected ? 5 : 2,
                      borderBottomColor: isSelected ? m.accentColor : isDark ? '#374151' : '#E5E7EB',
                    },
                  ]}
                >
                  <Image source={m.avatar} style={styles.mascotAvatar} resizeMode="cover" />
                  <Text style={[styles.mascotName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                    {m.name}
                  </Text>
                  <Text style={styles.mascotRole} numberOfLines={1}>
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

        {/* 6. DUOLINGO JUMP-IN CALLOUT */}
        <View style={[styles.jumpInBanner, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
          <Image
            source={require('../../assets/images/characters/motu-patlu-3d.png')}
            style={styles.jumpInImage}
            resizeMode="contain"
          />
          <View style={styles.jumpInInfo}>
            <Text style={[styles.jumpInTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Ready for Lesson {unlockedIndex + 1}?
            </Text>
            <Text style={styles.jumpInSub}>
              {lessons[unlockedIndex]?.title || 'Continue your coding streak!'}
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenLesson(unlockedIndex)}
              style={[styles.jumpInBtn, { backgroundColor: currentTier.color }]}
              activeOpacity={0.85}
            >
              <Text style={styles.jumpInBtnText}>START LESSON</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 7. DUOLINGO INTERACTIVE LESSON MODAL */}
      <Modal visible={lessonModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView
          style={[styles.lessonModalContainer, { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' }]}
          edges={['top', 'bottom']}
        >
          {/* Modal Header */}
          <View style={[styles.modalNavHeader, { borderBottomColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
            <TouchableOpacity
              onPress={() => setLessonModalVisible(false)}
              style={styles.modalCloseCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>

            {/* Duolingo Progress Bar */}
            <View style={styles.modalProgressTrack}>
              <View
                style={[
                  styles.modalProgressFill,
                  {
                    width: `${((activeLessonIndex + 1) / lessons.length) * 100}%`,
                  },
                ]}
              />
            </View>

            {/* Lives */}
            <View style={styles.modalLivesRow}>
              <Ionicons name="heart" size={22} color="#FF4B4B" />
              <Text style={styles.modalLivesCount}>{samosas}</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.lessonModalScroll} showsVerticalScrollIndicator={false}>
            {/* Mascot Dialogue Header */}
            <View
              style={[
                styles.modalDialogueBubble,
                {
                  backgroundColor: isDark ? '#1F2937' : '#FFF7ED',
                  borderColor: activeMascot.accentColor,
                },
              ]}
            >
              <Image source={activeMascot.avatar} style={styles.modalDialogueAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalDialogueName, { color: activeMascot.accentColor }]}>
                  {activeMascot.name}
                </Text>
                <Text style={[styles.modalDialogueText, { color: isDark ? '#F9FAFB' : '#7C2D12' }]}>
                  "{playingLesson.dialogue}"
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleVoiceDialogue()}
                style={[styles.modalVoiceBtn, { backgroundColor: activeMascot.accentColor }]}
                activeOpacity={0.8}
              >
                <Ionicons name={isSpeaking ? 'pause' : 'volume-high'} size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Question Prompt */}
            <Text style={[styles.modalPromptTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {playingLesson.prompt}
            </Text>

            {/* Code Snippet Box (if applicable) */}
            {playingLesson.codeSnippet && (
              <View style={styles.modalCodeBox}>
                <Text style={styles.modalCodeText}>{playingLesson.codeSnippet}</Text>
              </View>
            )}

            {/* Interactive Type 1: Arrange Blocks */}
            {playingLesson.type === 'arrange' && (
              <View style={styles.arrangeSection}>
                <Text style={styles.areaSubtitle}>Your Assembled Code:</Text>
                <View
                  style={[
                    styles.dropzoneBox,
                    {
                      borderColor: isDark ? '#374151' : '#CBD5E1',
                      backgroundColor: isDark ? '#111827' : '#F9FAFB',
                    },
                  ]}
                >
                  {selectedBlocks.length === 0 ? (
                    <Text style={styles.dropzoneHelpText}>
                      Tap available blocks below in proper order...
                    </Text>
                  ) : (
                    <View style={styles.assembledChipsRow}>
                      {selectedBlocks.map((blk, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleToggleBlock(blk)}
                          style={[styles.assembledChip, { backgroundColor: activeMascot.accentColor }]}
                        >
                          <Text style={styles.assembledChipText}>{blk}</Text>
                          <Ionicons name="close-circle" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Text style={styles.areaSubtitle}>Available Blocks:</Text>
                <View style={styles.availableChipsRow}>
                  {playingLesson.blocks?.map((blk, idx) => {
                    const isUsed = selectedBlocks.includes(blk);
                    return (
                      <TouchableOpacity
                        key={idx}
                        disabled={isUsed || isAnswered}
                        onPress={() => handleToggleBlock(blk)}
                        style={[
                          styles.blockChip3D,
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

            {/* Interactive Type 2 & 3: Fill Blanks & Choice */}
            {(playingLesson.type === 'fill_blank' || playingLesson.type === 'choice') && (
              <View style={styles.optionsList}>
                {playingLesson.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let bg = isDark ? '#1F2937' : '#FFFFFF';
                  let border = isDark ? '#374151' : '#E5E7EB';
                  let bottomBorder = isDark ? '#111827' : '#CBD5E1';

                  if (isAnswered) {
                    if (opt === playingLesson.correctAnswer) {
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
                      onPress={() => setSelectedOption(opt)}
                      activeOpacity={0.8}
                      style={[
                        styles.optionCard3D,
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
                          styles.optionTitleText,
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

          {/* DUOLINGO STICKY BOTTOM RESULT / ACTION BAR */}
          <View
            style={[
              styles.modalBottomBar,
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
              <View style={styles.resultBannerInner}>
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
                      {playingLesson.explanation}
                    </Text>
                  </View>
                </View>

                {isCorrect ? (
                  <TouchableOpacity
                    onPress={handleNextLesson}
                    style={styles.duoActionBtnSuccess}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.duoActionBtnText}>CONTINUE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleResetChallenge}
                    style={styles.duoActionBtnError}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.duoActionBtnText}>TRY AGAIN</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleCheckAnswer}
                disabled={
                  playingLesson.type === 'arrange'
                    ? selectedBlocks.length === 0
                    : !selectedOption
                }
                style={[
                  styles.duoCheckBtn,
                  (playingLesson.type === 'arrange'
                    ? selectedBlocks.length === 0
                    : !selectedOption) && styles.duoCheckBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.duoActionBtnText}>CHECK</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* 8. TREASURE CHEST MODAL */}
      <Modal visible={chestModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.chestRewardCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.chestBigIconBadge}>
              <Ionicons name="gift" size={54} color="#F59E0B" />
            </View>
            <Text style={[styles.chestRewardTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Treasure Unlocked!
            </Text>
            <Text style={styles.chestRewardSub}>
              Aapne milestone challenge paar kiya! Furfuri Nagar bonus Samosa XP rewarded!
            </Text>

            <View style={styles.chestXpPill}>
              <Ionicons name="diamond" size={20} color="#1CB0F6" />
              <Text style={styles.chestXpText}>+{rewardAmount} Samosa XP</Text>
            </View>

            <TouchableOpacity
              onPress={() => setChestModalVisible(false)}
              style={styles.chestClaimBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.chestClaimBtnText}>CLAIM &amp; CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 9. STAGE GUIDEBOOK MODAL */}
      <Modal visible={guidebookVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView
          style={[styles.guidebookContainer, { backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' }]}
        >
          <View style={[styles.modalNavHeader, { borderBottomColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
            <TouchableOpacity
              onPress={() => setGuidebookVisible(false)}
              style={styles.modalCloseCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
            <Text style={[styles.guidebookNavTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {currentTier.title} Guidebook
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={styles.guidebookScroll}>
            <View style={[styles.guidebookHero, { backgroundColor: currentTier.color }]}>
              <Ionicons name={currentTier.iconName} size={36} color="#FFF" />
              <Text style={styles.guidebookHeroTitle}>{currentTier.title} Cheatsheet</Text>
              <Text style={styles.guidebookHeroSub}>{currentTier.description}</Text>
            </View>

            <View style={styles.guidebookBody}>
              <Text style={[styles.guidebookSectionHeader, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Key Syntax &amp; Rules
              </Text>

              <View
                style={[
                  styles.syntaxCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' },
                ]}
              >
                <Text style={styles.syntaxCardTitle}>1. Output &amp; Variables</Text>
                <Text style={styles.syntaxCardCode}>print("Hello World"){"\n"}hero_name = "Motu"</Text>
                <Text style={styles.syntaxCardDesc}>
                  Use print() to output data to the screen. Variable names must start with a letter or underscore.
                </Text>
              </View>

              <View
                style={[
                  styles.syntaxCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' },
                ]}
              >
                <Text style={styles.syntaxCardTitle}>2. Conditionals (if-else)</Text>
                <Text style={styles.syntaxCardCode}>if samosas &gt; 0:{"\n"}    print("Happy Motu!")</Text>
                <Text style={styles.syntaxCardDesc}>
                  Python uses 4 spaces (indentation) to define code blocks inside if, for, while, and def statements.
                </Text>
              </View>

              <View
                style={[
                  styles.syntaxCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB', borderColor: isDark ? '#374151' : '#E5E7EB' },
                ]}
              >
                <Text style={styles.syntaxCardTitle}>3. Functions</Text>
                <Text style={styles.syntaxCardCode}>def boost_energy(x):{"\n"}    return x * 10</Text>
                <Text style={styles.syntaxCardDesc}>
                  Define reusable functions with the "def" keyword and return values using "return".
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 10. STAGE CELEBRATION MODAL */}
      <Modal visible={celebrationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.celebrationCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Image
              source={require('../../assets/images/characters/motu-patlu-3d.png')}
              style={styles.celebrationImg}
              resizeMode="contain"
            />
            <Text style={[styles.celebrationTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              {currentTier.title} Mastered!
            </Text>
            <Text style={styles.celebrationSub}>
              Aapne sabhi 10 puzzles complete kar liye! Motu, Patlu aur Furfuri Nagar team aapko salute karti hai!
            </Text>

            <View style={styles.celebrationXpRow}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.celebrationXpText}>+125 Samosa XP Master Badge</Text>
            </View>

            {(() => {
              const currentIdx = LEVEL_TIERS.findIndex((t) => t.id === activeTierId);
              const nextTier = currentIdx < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIdx + 1] : null;
              if (nextTier) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCelebrationVisible(false);
                      setActiveTierId(nextTier.id);
                    }}
                    style={[styles.celebrationNextBtn, { backgroundColor: nextTier.color }]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.celebrationNextBtnText}>Advance to {nextTier.title}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                  </TouchableOpacity>
                );
              }
              return null;
            })()}

            <TouchableOpacity
              onPress={() => setCelebrationVisible(false)}
              style={styles.celebrationCloseBtn}
            >
              <Text style={styles.celebrationCloseText}>Back to Quest Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // 1. Top Duolingo Bar
  duoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  duoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  duoStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 150, 0, 0.12)',
  },
  gemsBadge: {
    backgroundColor: 'rgba(28, 176, 246, 0.12)',
  },
  heartsBadge: {
    backgroundColor: 'rgba(255, 75, 75, 0.12)',
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  proShieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  proShieldText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  scrollContent: {
    paddingBottom: 60,
  },

  // 2. Stage Nav Pills
  stageNavScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  stageNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 3,
  },
  stageNavPillActive: {},
  stageNavPillInactive: {},
  stageNavPillText: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  // 3. Duolingo Unit Card Header
  unitCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    borderBottomWidth: 6,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  unitCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  unitBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  unitBadgePillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  unitProgressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '700',
  },
  guidebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  guidebookBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  unitTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  unitDescText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 12,
  },
  unitProgressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  unitProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },

  // 4. Winding Path Area
  pathArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pathStepWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  pathConnectorLine: {
    width: 6,
    height: 24,
    borderRadius: 3,
  },
  nodeContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  startTooltipContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  startTooltipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  startTooltipText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  startTooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circleNodeBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
  },
  chestNodeBtn: {
    width: 78,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
    backgroundColor: '#F59E0B',
    borderBottomColor: '#B45309',
  },
  nodeBtnCompleted: {
    backgroundColor: '#FFC800',
    borderBottomColor: '#CC9A00',
  },
  nodeBtnActive: {
    borderBottomColor: '#0369A1',
    elevation: 4,
  },
  nodeBtnLockedLight: {
    backgroundColor: '#E5E7EB',
    borderBottomColor: '#CBD5E1',
  },
  nodeBtnLockedDark: {
    backgroundColor: '#374151',
    borderBottomColor: '#1F2937',
  },
  nodeLabelText: {
    fontSize: 11,
    marginTop: 4,
  },

  // Character Dialogue Balloons along Path
  characterBalloonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 14,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    width: SCREEN_WIDTH - 40,
  },
  characterBalloonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  characterBalloonContent: {
    flex: 1,
  },
  characterBalloonNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  characterBalloonName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  miniSpeakerBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterBalloonSpeech: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // 5. Mascot Switcher Section
  mascotSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  mascotSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  mascotSectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  mascotRow: {
    gap: 10,
    paddingBottom: 10,
  },
  mascotCard: {
    width: 105,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    position: 'relative',
  },
  mascotAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
  },
  mascotName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  mascotRole: {
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

  // 6. Duolingo Jump-In Banner
  jumpInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  jumpInImage: {
    width: 80,
    height: 70,
  },
  jumpInInfo: {
    flex: 1,
  },
  jumpInTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    marginBottom: 2,
  },
  jumpInSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
  },
  jumpInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  jumpInBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // 7. Interactive Lesson Modal
  lessonModalContainer: {
    flex: 1,
  },
  modalNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalCloseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProgressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 6,
  },
  modalLivesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalLivesCount: {
    color: '#FF4B4B',
    fontSize: 15,
    fontWeight: '900',
  },
  lessonModalScroll: {
    padding: 18,
    paddingBottom: 120,
  },
  modalDialogueBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  modalDialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  modalDialogueName: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalDialogueText: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 17,
  },
  modalVoiceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPromptTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 14,
  },
  modalCodeBox: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38BDF8',
    fontSize: 13,
    lineHeight: 19,
  },
  arrangeSection: {
    marginTop: 4,
  },
  areaSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 4,
  },
  dropzoneBox: {
    minHeight: 56,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzoneHelpText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  assembledChipsRow: {
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
  availableChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  blockChip3D: {
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
  optionCard3D: {
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
  optionTitleText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },

  // Modal Bottom Bar & Duolingo 3D Buttons
  modalBottomBar: {
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
  resultBannerInner: {
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
  duoCheckBtn: {
    backgroundColor: '#58CC02',
    borderBottomWidth: 5,
    borderBottomColor: '#46A302',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duoCheckBtnDisabled: {
    backgroundColor: '#E5E7EB',
    borderBottomColor: '#CBD5E1',
    opacity: 0.6,
  },
  duoActionBtnSuccess: {
    backgroundColor: '#58CC02',
    borderBottomWidth: 5,
    borderBottomColor: '#46A302',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duoActionBtnError: {
    backgroundColor: '#FF4B4B',
    borderBottomWidth: 5,
    borderBottomColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duoActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // 8. Chest Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chestRewardCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  chestBigIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chestRewardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  chestRewardSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  chestXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 176, 246, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 18,
  },
  chestXpText: {
    color: '#1CB0F6',
    fontSize: 15,
    fontWeight: '900',
  },
  chestClaimBtn: {
    backgroundColor: '#F59E0B',
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
    borderRadius: 12,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  chestClaimBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // 9. Guidebook Modal
  guidebookContainer: {
    flex: 1,
  },
  guidebookNavTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  guidebookScroll: {
    padding: 18,
    paddingBottom: 40,
  },
  guidebookHero: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  guidebookHeroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  guidebookHeroSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
  },
  guidebookBody: {
    gap: 14,
  },
  guidebookSectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  syntaxCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
  },
  syntaxCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 4,
  },
  syntaxCardCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#EA580C',
    fontSize: 12.5,
    backgroundColor: 'rgba(0,0,0,0.04)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  syntaxCardDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },

  // 10. Stage Celebration Modal
  celebrationCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  celebrationImg: {
    width: 140,
    height: 100,
    marginBottom: 10,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  celebrationSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  celebrationXpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  celebrationXpText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
  },
  celebrationNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  celebrationNextBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  celebrationCloseBtn: {
    paddingVertical: 8,
  },
  celebrationCloseText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
});

