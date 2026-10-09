# 🎨 TECH INDRO — Design System & UI/UX Guidelines (`DESIGN.md`)

> **Tech Indro Design System, Theme Tokens & UX Specifications**  
> *A unified design reference covering color palettes, typography, glassmorphism, components, and cross-platform styling.*

---

## 🌈 1. Design Philosophy

Tech Indro is built around a **"Futuristic Cyber-Edu"** aesthetic:
- **High Visual Impact**: Default dark surfaces, neon accent highlights, glassmorphic containers, and subtle glows convey modern engineering and technology excellence.
- **Cognitive Clarity**: Students must remain focused while coding and studying. Layouts feature clean typography, strong contrast ratios, and generous whitespace.
- **Cross-Platform Consistency**: The visual hierarchy, micro-interactions, and feedback patterns remain consistent across both desktop browsers and Android/iOS mobile screens.

---

## 🎨 2. Color Palette & Theme Tokens

### A. Primary Brand Accents
| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `--primary-accent` | `#6366f1` (Neon Indigo) | Primary action buttons, active navigation indicators, focus rings |
| `--primary-hover` | `#4f46e5` (Deep Indigo) | Button hover states and pressed interactions |
| `--secondary-cyan` | `#06b6d4` (Cyber Cyan) | AI Mentor highlights, TSOC tags, code syntax badges |
| `--emerald-success` | `#10b981` (Emerald Green) | Passed tests, compiler success notices, verified payment badges |
| `--amber-warning` | `#f59e0b` (Warm Amber) | Quiz countdown alerts, difficulty ratings, pending reviews |
| `--rose-danger` | `#ef4444` (Vibrant Rose) | Compiler errors, failed submissions, destructive actions |

### B. Dark Mode Tokens (Default Surface)
```css
:root {
  --bg-main: #0b0f19;             /* Deep space black/blue primary background */
  --bg-surface: #111827;          /* Container and card background */
  --bg-surface-elevated: #1f2937;    /* Dropdowns, modals, and tooltips */
  --border-subtle: #374151;        /* Clean separator borders */
  --text-main: #f9fafb;           /* High-contrast primary text */
  --text-muted: #9ca3af;          /* Secondary descriptive text */
  --glass-bg: rgba(17, 24, 39, 0.75); /* Frosted glass cards */
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### C. Light Mode Tokens
```css
[data-theme="light"] {
  --bg-main: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #f1f5f9;
  --border-subtle: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.08);
}
```

---

## 🔤 3. Typography Hierarchy

- **Primary UI Font**: `'Outfit', 'Inter', -apple-system, sans-serif`
- **Monospace Code Font**: `'Fira Code', 'JetBrains Mono', monospace`

### Typography Scales
- **Display 1 (Hero Heading)**: `2.75rem (44px)` — Bold `700`, Line-height `1.2`, Letter-spacing `-0.02em`
- **Heading 1 (Section Header)**: `2.0rem (32px)` — SemiBold `600`
- **Heading 2 (Card Title)**: `1.35rem (21px)` — Medium `500`
- **Body Regular**: `1.0rem (16px)` — Regular `400`, Line-height `1.6`
- **Caption / Metadata**: `0.85rem (13.6px)` — Regular `400`

---

## 🧱 4. Core UI Components

### 1. Glassmorphism Card
```css
.ti-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.ti-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.15);
}
```

### 2. Primary Call-To-Action (CTA) Button
- Border radius: `10px` or `9999px` (Pill button)
- Gradient background: `linear-gradient(135deg, #6366f1, #06b6d4)`
- Micro-interaction: Active tap scale down to `0.97` with smooth ease-out transition.

### 3. Responsive Navigation
- **Desktop**: Sticky top navigation bar with dynamic backdrop blur on page scroll.
- **Mobile**: Floating bottom navigation bar with responsive icon scaling and haptic feedback.

---

## 📱 5. Mobile App (React Native) Guidelines

- **Safe Area Insets**: Every screen strictly wraps components using `react-native-safe-area-context` to avoid notch and navigation bar overlap.
- **Fluid Gestures**: Bottom sheets and interactive swipe dismisses utilize `react-native-gesture-handler` and `react-native-reanimated`.
- **Haptic Feedback**: Key actions (quiz option select, compiler trigger) trigger subtle native haptics.

---

## 💡 6. Plain English Design Summary

> **Key Takeaways for Designers and Developers:**
> 
> 1. **Dark Theme First**: The ecosystem prioritizes dark surfaces because developers and students experience less eye strain during extended coding sessions.
> 2. **Consistent Variables**: Always utilize CSS variables (`var(--primary-accent)`) rather than hardcoding static hex codes so that theme switching works reliably.
> 3. **Glassmorphism**: Visual depth is created using blurred transparent layers and subtle border strokes.
> 4. **Adaptive Layouts**: Every screen must look polished on both budget smartphones (320px width) and large desktop monitors without text truncation or broken alignment.
