# 📝 TECH INDRO — Project Tasks & Roadmap (`TASKS.md`)

> **Tech Indro Active Tasks, Milestone Tracker & Development Roadmap**  
> *A progress tracker listing completed capabilities, ongoing efforts, and upcoming backlog items.*

---

## 🚦 Status Legend
- `[x]` **Completed**: Feature is built, tested, and active in the codebase.
- `[/]` **In Progress**: Actively under implementation or optimization.
- `[ ]` **Pending / Backlog**: Scheduled for future development iterations.

---

## 📚 1. Documentation & Architecture
- [x] Establish centralized `docs/` folder structure
- [x] Document System Architecture in `docs/ARCHITECTURE.md`
- [x] Document UI/UX Design System in `docs/DESIGN.md`
- [x] Document Project Memory & Solved Issues in `docs/MEMORY.md`
- [x] Document Product Requirements & Specifications in `docs/PRD.md` (Including JIVA AI HR & P2P Chat)
- [x] Document Developer Rules & Standards in `docs/RULES.md`
- [x] Setup Milestone Tracker & Roadmap in `docs/TASKS.md`

---

## 🌐 2. Web Platform & Portal Features (`tech-indro-official`)
- [x] Responsive Landing Page with futuristic dark theme & glassmorphic cards (`index.html`)
- [x] Flagship Masterclasses & Courses Catalog (`programs.html`, `courses.json`)
- [x] 24/7 AI Shikshak Voice & Text Doubt Assistant (`shikshak.html`, `shikshak-rohini.html`)
- [x] IndroLabs In-Browser Cloud Compiler for Python, JavaScript, and HTML (`playground.html`)
- [x] Dynamic Certificate Verification & PDF/PNG Download Engine (`certificate.html`)
- [x] Distraction-Free YouTube Masterclass Player with Live IndroLabs Code Sandbox & AI Doubts (`course-details.html`)
- [x] Curated Open Education Attribution System with Direct Creator Channel Links
- [x] TSOC Fellowship showcase & Application portal (`tsoc.html`, `tsoc-apply.html`)
- [x] Interactive Adaptive Test Series & Quizzes (`quiz.html`, `questions.json`)
- [x] **JIVA Autonomous AI HR & Hiring Portal** (`hiring.html`, `jiva-hr.html`)
- [x] **Peer-to-Peer Chat & Community Doubt Hub** (`community.html`) with AI Mentor auto-assist
- [x] Universal Dark / Light Mode Theme Engine (`theme-notifications.js`)
- [ ] Multi-tab file manager inside the IndroLabs compiler
- [ ] Service Worker offline caching for study notes and curriculum outlines

---

## 📱 3. Mobile App (`tech-indro-app`)
- [x] Expo Router file-based tab navigation architecture (`(tabs)/`, `_layout.tsx`)
- [x] Mobile IndroLabs code editor interface (`indrolabs.tsx`)
- [x] Design tokens and Safe Area Inset adaptations for Android and iOS
- [x] Cloud APK build configuration via EAS (`eas.json`, `BUILD_GUIDE.md`)
- [/] Local Android CMake & NDK build memory tuning for `react-native-worklets`
- [ ] Push notification service for Daily Byte challenges
- [ ] Offline quiz practice mode with local storage synchronization

---

## ⚡ 4. Backend & AI Engines (`server.js` & `rag_service.py`)
- [x] Express.js API runtime with enterprise-grade Anti-Crash Protection
- [x] Sliding-window rate limiting engine to prevent DDoS and abuse
- [x] Sandboxed 5-second timeout code execution endpoint (`/api/execute`)
- [x] Razorpay payment verification and checkout lifecycle
- [x] Python FastAPI RAG Service for course content search
- [/] Server-Sent Events (SSE) streaming for real-time AI Shikshak answers
- [ ] Redis cluster integration for distributed session caching

---

## 💡 5. Plain English Maintenance Guide

> **How to maintain and use TASKS.md:**
> 
> - Whenever a new milestone or feature is completed, change its status to `[x]`.
> - If you are currently working on a feature, keep it marked with `[/]`.
> - Add new ideas, feature requests, and bug reports under the relevant category with `[ ]`.
> - This keeps all developers and AI collaborators completely aligned on the current state of the project.
