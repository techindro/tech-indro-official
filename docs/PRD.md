# 📋 TECH INDRO — Product Requirement Document (`PRD.md`)

> **Product Vision, Core Features & System Requirements**  
> *A formal specification outlining target user personas, primary platform modules, and acceptance standards.*

---

## 🎯 1. Product Vision & Mission

**Tech Indro** is built on a clear foundational mission:
> *"To empower students, aspiring developers, and researchers with cutting-edge skills in Artificial Intelligence, Cybersecurity, Full-Stack Engineering, and Robotics from ground zero — with no prerequisites of high-end laptops or expensive hardware."*

### Key Problems Solved:
1. **The Hardware Divide**: High-end programming environments often demand expensive laptops. Tech Indro provides a high-speed cloud compiler (**IndroLabs**) directly inside mobile apps and web browsers.
2. **24/7 Doubt Resolution**: Academic learning often stalls when mentors are unavailable after hours. **AI Shikshak** delivers voice and text-driven problem solving at any hour.
3. **Theory vs. Real-World Execution**: Instead of passive tutorial consumption, Tech Indro engages learners in open-source fellowships (**TSOC**) with active real-world codebases.
4. **Hiring Inefficiencies & Talent Matching**: Candidates face opaque recruitment cycles. **JIVA AI HR** autonomously evaluates technical skill, ATS compatibility, and issues provisional offers instantly.
5. **Isolation in Learning**: Coding alone can lead to frustration. The **Peer-to-Peer Chat & Community Hub** allows students to collaborate, share code, and solve doubts together.

---

## 👥 2. Target User Personas

| Persona | Profile & Context | Needs & Objectives |
| :--- | :--- | :--- |
| **College Developer** | Engineering student with budget smartphone or laptop | Hands-on coding experience, portfolio-ready projects, placement preparation |
| **Tech Beginner / Teen** | School student exploring software engineering | Engaging explanations, voice-guided hints, bite-sized daily practice |
| **Job Seeker & Intern** | Graduate looking for hiring opportunities & internship roles | Autonomous resume screening (JIVA AI HR), direct skill evaluation, hiring offers |
| **Career Switcher** | Working professional transitioning into AI / Cybersecurity | Structured modular curricula, verifiable certifications, self-paced progress |

---

## 🚀 3. Core Feature Specifications

### 🤖 1. AI Shikshak (Rohini & Bittu)
- **Description**: 24/7 conversational AI doubt mentor supporting both spoken voice and text prompt queries.
- **Capabilities**:
  - Code debugging, error explanation, and conceptual hints.
  - Natural understanding of mixed colloquial expressions and technical terminology.
  - Real-time speech synthesis with fallback to native browser voices.

### 💻 2. IndroLabs (Cloud Playground & Compiler)
- **Description**: In-browser and in-app code execution workspace.
- **Supported Languages**: Python 3, JavaScript (Node.js runtime), HTML/CSS/JS frontend preview.
- **Security Safeguards**: Sandboxed child process execution bounded by a 5-second execution limit and strict memory caps.

### 📚 3. Flagship Programs & Masterclasses
- **Curricula**: Generative AI, Full-Stack Web Development, Ethical Hacking & Cyber Defense, Data Structures & Algorithms.
- **Features & Cursa LMS Model**: Curated open education track powered by distraction-free YouTube video masterclasses, embedded creator attribution with direct channel links, per-module completion checkboxes (`Mark Done ✔`), real-time progress bar calculation (0% to 100%), auto-unlocked verified completion certificates, split-screen IndroLabs coding sandbox, and 24/7 AI Shikshak doubt solving.

### 🏆 4. TSOC (Tech Season of Code)
- **Description**: Open-source engineering fellowship connecting learners to production-grade repositories.
- **Featured Projects**: *MOM-OS (Mind-Oriented Machine)*, *GhostPose (Wi-Fi 3D Sensing)*, and *Chitra AI*.
- **Workflow**: Student application -> Mentor assignment -> Pull request contribution -> Verification -> Fellowship recognition.

### 📝 5. Adaptive Test Series & Quizzes
- **Description**: Timed mock examinations with real-time scoring and rank estimation.
- **Features**: Dynamic countdown timers, negative marking support, instant performance breakdown, and leaderboard synchronization.

### 🎓 6. Certificate Verification Engine
- **Description**: Cryptographically verifiable digital credential generator.
- **Features**: Unique Certificate IDs, QR code scanning verification, high-resolution PDF/PNG exports, and one-click LinkedIn sharing.

### 💼 7. JIVA — Autonomous Agentic AI HR (`hiring.html` / `jiva-hr.html`)
- **Description**: The world's first autonomous AI-driven recruiter and talent evaluation engine.
- **Capabilities**:
  - **Resume & CV Parsing**: Instant extraction of candidate technical competencies, projects, and education credentials.
  - **Real ATS Scoring**: Evaluates candidate profile alignment against job descriptions with objective score metrics.
  - **Autonomous Interview Screening**: Dynamic conversational technical screening questions without human scheduling bottlenecks.
  - **Instant Provisional Offer Letters**: Generates formal provisional employment/internship offer letters upon meeting qualifying thresholds.

### 💬 8. Peer-to-Peer Chat & Indro Community Hub (`community.html`)
- **Description**: Collaborative doubt-solving forum and real-time student networking ecosystem.
- **Capabilities**:
  - **Peer-to-Peer Real-Time Discussion**: Students can interact, ask peer-level questions, and discuss project architectures.
  - **Code Snippet Formatter**: Highlighting and markdown support for sharing code bugs directly in chat threads.
  - **Upvoting & Solution Endorsements**: Community members can upvote helpful responses to build peer reputation.
  - **AI Mentor Auto-Assist**: When peers are offline or queries remain unanswered, the AI Mentor automatically steps in to provide comprehensive explanations.

---

## 🛡️ 4. Non-Functional Requirements (NFR)

1. **Performance**: Web First Contentful Paint (FCP) under 1.2 seconds; Mobile app 60 FPS scroll and navigation transitions.
2. **Security**: Enterprise WAF rules, CSRF protection, and sliding-window rate limiters across all public endpoints.
3. **Reliability**: 99.9% platform availability with graceful unhandled exception recovery.
4. **Responsiveness**: Pixel-perfect usability across viewport widths ranging from 320px mobile screens to 4K displays.

---

## 💡 5. Plain English Product Summary

> **Summary of Tech Indro's Core Value & Pillars:**
> 
> - **What is the PRD?**: This document defines what features Tech Indro provides, who it is built for, and how each component delivers value.
> - **The Core Platform Pillars**:
>   1. **AI Shikshak**: An intelligent mentor answering queries in voice and text 24/7.
>   2. **IndroLabs**: A zero-setup cloud compiler that lets students code directly on mobile and web.
>   3. **Courses & TSOC**: Industrial masterclasses and an open-source fellowship program working on real-world repositories.
>   4. **JIVA AI HR**: An autonomous agentic HR system that parses resumes, calculates ATS scores, conducts technical screenings, and generates instant offer letters.
>   5. **Peer-to-Peer Chat & Community Hub**: A collaborative learning space where students chat, exchange solutions, format code snippets, and receive automatic AI mentor assistance.
>   6. **Verifiable Certificates**: Digital credentials with cryptographic QR verification for hiring companies.
