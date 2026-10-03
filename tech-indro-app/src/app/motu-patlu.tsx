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

  const [activeTierId, setActiveTierId] = useState<string>('basic');
  const [activeMascotKey, setActiveMascotKey] = useState<string>('motu');
  const [streakDays, setStreakDays] = useState(5);
  const [samosaXp, setSamosaXp] = useState(320);
  const [samosas, setSamosas] = useState(5);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Lesson Interactive States
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const activeMascot = MASCOTS[activeMascotKey] || MASCOTS.motu;
  const currentTier = LEVEL_TIERS.find((t) => t.id === activeTierId) || LEVEL_TIERS[0];
  const lessons = currentTier.lessons;
  const currentLesson = lessons[currentLessonIndex] || lessons[0];

  // Load progress from storage
  useEffect(() => {
    (async () => {
      try {
        const savedMascot = await AsyncStorage.getItem('tech_indro_mascot');
        if (savedMascot && MASCOTS[savedMascot]) {
          setActiveMascotKey(savedMascot);
        }
        const savedXp = await AsyncStorage.getItem('tech_indro_samosa_xp');
        if (savedXp) setSamosaXp(parseInt(savedXp, 10));
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

  const handleVoiceDialogue = () => {
    if (isSpeaking) {
      stopAnyVoice();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `${activeMascot.name} says: ${currentLesson.dialogue}`;
    playIndicVoice({
      text: textToSpeak,
      language: 'hi',
      speaker: activeMascot.voiceSpeaker,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Block arrange click handler
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
    if (currentLesson.type === 'arrange') {
      const target = currentLesson.correctOrder || [];
      correct =
        selectedBlocks.length === target.length &&
        selectedBlocks.every((val, idx) => val === target[idx]);
    } else {
      correct = selectedOption === currentLesson.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newXp = samosaXp + 25;
      setSamosaXp(newXp);
      AsyncStorage.setItem('tech_indro_samosa_xp', newXp.toString()).catch(() => {});

      const cheer = `${activeMascot.name} says: Wah kya baat hai! Bilkul sahi jawaab!`;
      playIndicVoice({
        text: cheer,
        language: 'hi',
        speaker: activeMascot.voiceSpeaker,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });

      if (currentLessonIndex === lessons.length - 1) {
        setTimeout(() => setCelebrationVisible(true), 1000);
      }
    } else {
      setSamosas(Math.max(0, samosas - 1));
      const hint = `${activeMascot.name} says: Arrey dhyan se socho! Fir se koshish karo!`;
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
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedBlocks([]);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      stopAnyVoice();
      setIsSpeaking(false);
    } else {
      setCelebrationVisible(true);
    }
  };

  const handleResetChallenge = () => {
    setSelectedBlocks([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]} edges={['top']}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: isDark ? '#1E293B' : '#EDF2F7' }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Motu &amp; Patlu Coding Quest
          </Text>
          <View style={styles.proPill}>
            <Ionicons name="sparkles" size={11} color="#FFF" />
            <Text style={styles.proPillText}>GAMIFIED</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleVoiceDialogue}
          style={[
            styles.soundBtn,
            { backgroundColor: isSpeaking ? '#EA580C' : isDark ? '#1E293B' : '#EDF2F7' },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
            size={20}
            color={isSpeaking ? '#FFF' : isDark ? '#CBD5E1' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Bar */}
        <View style={[styles.statsBar, { backgroundColor: isDark ? '#131D31' : '#FFFFFF' }]}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#EA580C22' }]}>
              <Ionicons name="flame" size={18} color="#EA580C" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{streakDays} Days</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#F59E0B22' }]}>
              <Ionicons name="ribbon" size={18} color="#F59E0B" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{samosaXp} XP</Text>
              <Text style={styles.statLabel}>Coding Points</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#10B98122' }]}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{samosas}/5</Text>
              <Text style={styles.statLabel}>Energy</Text>
            </View>
          </View>
        </View>

        {/* Progressive Roadmap Stage Tabs (Basic -> Medium -> Data Science -> AI/ML) */}
        <View style={styles.tierSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Learning Roadmap Stages
            </Text>
            <Text style={styles.sectionSub}>Progress from Python basics to AI &amp; Machine Learning</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tierList}>
            {LEVEL_TIERS.map((tier) => {
              const isActive = tier.id === activeTierId;
              return (
                <TouchableOpacity
                  key={tier.id}
                  onPress={() => {
                    setActiveTierId(tier.id);
                    setCurrentLessonIndex(0);
                    handleResetChallenge();
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.tierCard,
                    {
                      backgroundColor: isActive ? tier.color : isDark ? '#131D31' : '#FFFFFF',
                      borderColor: isActive ? tier.color : isDark ? '#1E293B' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.tierBadgeRow}>
                    <Text style={[styles.tierBadgeText, { color: isActive ? '#FFF' : tier.color }]}>
                      {tier.badge}
                    </Text>
                    <Ionicons name={tier.iconName} size={15} color={isActive ? '#FFF' : tier.color} />
                  </View>
                  <Text style={[styles.tierTitle, { color: isActive ? '#FFF' : isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {tier.title}
                  </Text>
                  <Text style={[styles.tierDesc, { color: isActive ? '#E2E8F0' : '#64748B' }]} numberOfLines={1}>
                    {tier.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Mascot Picker Station */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Pick Your Coding Buddy
          </Text>
          <Text style={styles.sectionSub}>Tap character to activate custom mentor voice</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mascotList}>
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
                    backgroundColor: isDark ? '#131D31' : '#FFFFFF',
                    borderColor: isSelected ? m.accentColor : isDark ? '#1E293B' : '#E2E8F0',
                    borderWidth: isSelected ? 2.5 : 1,
                  },
                ]}
              >
                <Image source={m.avatar} style={styles.mascotAvatar} resizeMode="cover" />
                <Text style={[styles.mascotCardName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {m.name}
                </Text>
                <Text style={styles.mascotCardRole} numberOfLines={1}>
                  {m.role.split('&')[0]}
                </Text>
                {isSelected && (
                  <View style={[styles.mascotActiveDot, { backgroundColor: m.accentColor }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Dialogue Bubble Station */}
        <View
          style={[
            styles.dialogueBox,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFF7ED',
              borderColor: activeMascot.accentColor,
            },
          ]}
        >
          <View style={styles.dialogueHeader}>
            <Image source={activeMascot.avatar} style={styles.dialogueAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.dialogueName, { color: activeMascot.accentColor }]}>
                {activeMascot.name} (Active Companion)
              </Text>
              <Text style={[styles.dialogueText, { color: isDark ? '#F1F5F9' : '#7C2D12' }]}>
                "{currentLesson.dialogue}"
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleVoiceDialogue}
              style={[styles.voicePlayBtn, { backgroundColor: activeMascot.accentColor }]}
              activeOpacity={0.8}
            >
              <Ionicons name={isSpeaking ? 'pause' : 'play'} size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lesson Card */}
        <View
          style={[
            styles.lessonCard,
            {
              backgroundColor: isDark ? '#131D31' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          {/* Progress Header */}
          <View style={styles.lessonProgressRow}>
            <Text style={[styles.lessonBadgeText, { color: activeMascot.accentColor }]}>
              PUZZLE {currentLessonIndex + 1} OF {lessons.length} • {currentTier.badge}
            </Text>
            <Text style={[styles.lessonTitleText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {currentLesson.title}
            </Text>
          </View>

          <Text style={[styles.promptText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
            {currentLesson.prompt}
          </Text>

          {/* Code Snippet Box (if any) */}
          {currentLesson.codeSnippet && (
            <View style={styles.codeSnippetContainer}>
              <Text style={styles.codeSnippetText}>{currentLesson.codeSnippet}</Text>
            </View>
          )}

          {/* TYPE: ARRANGE CODE BLOCKS */}
          {currentLesson.type === 'arrange' && (
            <View style={styles.puzzleArea}>
              <Text style={styles.subAreaLabel}>Constructed Code Output:</Text>
              <View
                style={[
                  styles.constructedDropzone,
                  {
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  },
                ]}
              >
                {selectedBlocks.length === 0 ? (
                  <Text style={styles.dropzonePlaceholder}>
                    Tap blocks below in the correct sequence...
                  </Text>
                ) : (
                  <View style={styles.assembledBlocksRow}>
                    {selectedBlocks.map((blk, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleToggleBlock(blk)}
                        style={[styles.assembledBlock, { backgroundColor: activeMascot.accentColor }]}
                      >
                        <Text style={styles.assembledBlockText}>{blk}</Text>
                        <Ionicons name="close-circle" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <Text style={styles.subAreaLabel}>Available Blocks:</Text>
              <View style={styles.availableBlocksWrap}>
                {currentLesson.blocks?.map((blk, idx) => {
                  const isUsed = selectedBlocks.includes(blk);
                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={isUsed || isAnswered}
                      onPress={() => handleToggleBlock(blk)}
                      style={[
                        styles.blockPill,
                        {
                          backgroundColor: isUsed
                            ? isDark ? '#1E293B' : '#E2E8F0'
                            : isDark ? '#1E293B' : '#F1F5F9',
                          borderColor: isUsed ? 'transparent' : isDark ? '#475569' : '#CBD5E1',
                          opacity: isUsed ? 0.4 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.blockPillText,
                          { color: isUsed ? '#94A3B8' : isDark ? '#F8FAFC' : '#0F172A' },
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

          {/* TYPE: FILL BLANK & CHOICE */}
          {(currentLesson.type === 'fill_blank' || currentLesson.type === 'choice') && (
            <View style={styles.optionsWrap}>
              {currentLesson.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let optionBg = isDark ? '#1E293B' : '#F8FAFC';
                let optionBorder = isDark ? '#334155' : '#CBD5E1';

                if (isAnswered) {
                  if (opt === currentLesson.correctAnswer) {
                    optionBg = '#10B98122';
                    optionBorder = '#10B981';
                  } else if (isSelected) {
                    optionBg = '#EF444422';
                    optionBorder = '#EF4444';
                  }
                } else if (isSelected) {
                  optionBg = `${activeMascot.accentColor}22`;
                  optionBorder = activeMascot.accentColor;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={isAnswered}
                    onPress={() => setSelectedOption(opt)}
                    style={[styles.optionItem, { backgroundColor: optionBg, borderColor: optionBorder }]}
                  >
                    <View style={styles.optionRadio}>
                      {isSelected ? (
                        <Ionicons
                          name={isAnswered ? (isCorrect ? 'checkmark-circle' : 'close-circle') : 'radio-button-on'}
                          size={20}
                          color={isAnswered ? (isCorrect ? '#10B981' : '#EF4444') : activeMascot.accentColor}
                        />
                      ) : (
                        <Ionicons name="radio-button-off" size={20} color={isDark ? '#475569' : '#94A3B8'} />
                      )}
                    </View>
                    <Text style={[styles.optionText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Result / Explanation Box */}
          {isAnswered && (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: isCorrect ? '#10B98118' : '#EF444418',
                  borderColor: isCorrect ? '#10B981' : '#EF4444',
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'alert-circle'}
                  size={24}
                  color={isCorrect ? '#10B981' : '#EF4444'}
                />
                <Text style={[styles.resultTitle, { color: isCorrect ? '#10B981' : '#EF4444' }]}>
                  {isCorrect ? 'Shaandaar! Correct Answer!' : 'Oops! Galat Answer'}
                </Text>
              </View>
              <Text style={[styles.explanationText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                {currentLesson.explanation}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonActionRow}>
            {!isAnswered ? (
              <TouchableOpacity
                onPress={handleCheckAnswer}
                style={[styles.primaryActionBtn, { backgroundColor: activeMascot.accentColor }]}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done-circle" size={20} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Check Answer</Text>
              </TouchableOpacity>
            ) : isCorrect ? (
              <TouchableOpacity
                onPress={handleNextLesson}
                style={[styles.primaryActionBtn, { backgroundColor: '#10B981' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryActionBtnText}>Next Challenge</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleResetChallenge}
                style={[styles.primaryActionBtn, { backgroundColor: '#EA580C' }]}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionBtnText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Motu & Patlu 3D Spotlight Banner */}
        <View style={[styles.spotlightBanner, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
          <Image
            source={require('../../assets/images/characters/motu-patlu-3d.png')}
            style={styles.spotlightImage}
            resizeMode="contain"
          />
          <View style={styles.spotlightTextWrap}>
            <Text style={[styles.spotlightTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Master Coding in 5 Mins/Day!
            </Text>
            <Text style={styles.spotlightSub}>
              Bite-sized daily quests built for school kids, college students, and tech enthusiasts.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Level Completion Modal */}
      <Modal visible={celebrationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#131D31' : '#FFFFFF' }]}>
            <Image
              source={require('../../assets/images/characters/motu-patlu-3d.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {currentTier.title} Completed!
            </Text>
            <Text style={styles.modalSub}>
              You mastered all puzzles in {currentTier.title} with Motu &amp; Patlu! +125 Samosa XP earned!
            </Text>

            {(() => {
              const currentIdx = LEVEL_TIERS.findIndex((t) => t.id === activeTierId);
              const nextTier = currentIdx < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIdx + 1] : null;
              if (nextTier) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCelebrationVisible(false);
                      setActiveTierId(nextTier.id);
                      setCurrentLessonIndex(0);
                      handleResetChallenge();
                    }}
                    style={[styles.modalBtn, { backgroundColor: nextTier.color }]}
                  >
                    <Ionicons name="arrow-forward-circle" size={20} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.modalBtnText}>Advance to {nextTier.title}</Text>
                  </TouchableOpacity>
                );
              }
              return null;
            })()}

            <TouchableOpacity
              onPress={() => {
                setCelebrationVisible(false);
                setCurrentLessonIndex(0);
                handleResetChallenge();
              }}
              style={[styles.modalBtn, { backgroundColor: '#EA580C' }]}
            >
              <Ionicons name="trophy" size={20} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalBtnText}>Claim Badge &amp; Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCelebrationVisible(false)} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  proPillText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  soundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  mascotList: {
    gap: 12,
    paddingBottom: 16,
  },
  mascotCard: {
    width: 105,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    position: 'relative',
  },
  mascotAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginBottom: 6,
  },
  mascotCardName: {
    fontSize: 13,
    fontWeight: '800',
  },
  mascotCardRole: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  mascotActiveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueBox: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  dialogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  dialogueName: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  dialogueText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  voicePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  lessonProgressRow: {
    marginBottom: 8,
  },
  lessonBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lessonTitleText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  codeSnippetContainer: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  codeSnippetText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#38BDF8',
    fontSize: 13.5,
    lineHeight: 20,
  },
  puzzleArea: {
    marginTop: 4,
  },
  subAreaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  constructedDropzone: {
    minHeight: 52,
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
  assembledBlocksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assembledBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  assembledBlockText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  availableBlocksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  blockPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  blockPillText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  optionsWrap: {
    gap: 10,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
  },
  optionRadio: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  buttonActionRow: {
    marginTop: 4,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  spotlightBanner: {
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  spotlightImage: {
    width: 90,
    height: 80,
  },
  spotlightTextWrap: {
    flex: 1,
  },
  spotlightTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  spotlightSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  modalImage: {
    width: 140,
    height: 110,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 10,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalCloseBtn: {
    paddingVertical: 6,
  },
  modalCloseBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  tierSection: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  tierList: {
    gap: 10,
    paddingRight: 16,
  },
  tierCard: {
    width: 175,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  tierDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});
