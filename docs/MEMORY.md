# 🧠 TECH INDRO — Project Memory & Context (`MEMORY.md`)

> **Tech Indro Project Memory, Engineering Decisions & Problem-Solving History**  
> *A historical log of configurations, solved build/runtime issues, and operational decisions that must be preserved.*

---

## 📌 1. Essential Project Facts & Settings

| Item | Value / Configuration | Purpose |
| :--- | :--- | :--- |
| **Project Name** | Tech Indro Website & Ecosystem | Central brand and learning platform |
| **Web Server Port** | `5000` (Fallback: `3000`) | Main Node/Express backend (`server.js`) |
| **RAG / AI Service Port** | `8000` (`rag_service.py`) | Python FastAPI knowledge retrieval engine |
| **Frontend Web** | Vanilla JS, CSS3, HTML5 (PWA) | Located in `tech-indro-official/` |
| **Mobile App** | React Native Expo (SDK 52/53) | Located in `tech-indro-app/` |
| **Payment Gateway** | Razorpay Test & Live API | Course & TSOC enrollment checkouts |
| **State & Cache** | Local JSON Store + Redis fallback | In-memory cache & user data fallback |

---

## 🛠️ 2. Critical Problems Solved & Lessons Learned

### A. Android Build & Native CMake / Worklets Issue
- **Problem**: Local Android builds may encounter C++ CMake compilation errors with `react-native-worklets` and `react-native-reanimated` when NDK versions conflict or Gradle JVM runs out of memory on local development machines.
- **Solution & Permanent Memory**:
  1. `tech-indro-app/android/gradle.properties` has been tuned with dedicated memory:  
     `org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m`
  2. For machines without a full Android Studio / NDK development environment, the recommended method is **EAS Cloud Build** (`eas build -p android --profile preview`), which produces a clean APK in the cloud without consuming local system resources.

### B. Backend Anti-Crash & High-Concurrency Stability
- **Problem**: Malicious or unhandled exceptions (such as infinite while-loops submitted to the compiler or database timeout rejections) previously risked crashing the entire Node.js server process.
- **Solution & Permanent Memory**:
  1. `server.js` implements global exception monitors (`process.on('uncaughtException')` and `process.on('unhandledRejection')`) to log errors without terminating the server.
  2. The code execution runner enforces a strict **5000ms (5 seconds) timeout** and memory cap to cleanly terminate stuck child processes.
  3. A sliding-window rate limiter prevents brute-force abuse and API spamming.

### C. Web Audio Autoplay Policy for AI Shikshak
- **Problem**: Modern web browsers block unprompted audio autoplay until the user explicitly interacts with the document.
- **Solution & Permanent Memory**:
  1. Audio synthesis triggers strictly on user interaction (e.g., clicking "Ask" or "Speak"), activating the browser `AudioContext`.
  2. `female-voice.js` acts as a local fallback using the native `SpeechSynthesis` API whenever external TTS APIs are slow or unreachable.

---

## 🔐 3. Environment Variables Reference

*Security Note: Production secrets must reside strictly within `.env` files and never be committed to git repositories.*

- `PORT`: Server listening port (Default: 5000)
- `JWT_SECRET`: Secret key used for signing and validating session tokens
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay credentials for payment verification
- `GEMINI_API_KEY` / `GROQ_API_KEY`: API keys for AI Shikshak LLM query inference
- `REDIS_URL`: Optional Redis connection string (falls back to local memory if unset)

---

## 💡 4. Plain English Memory Summary

> **Important reminders for ongoing maintenance:**
> 
> 1. **Process Resilience**: `server.js` contains safety wrappers so the backend stays alive even if an individual route throws an error.
> 2. **Mobile APK Generation**: If local compilation has CMake or NDK errors, run `eas build -p android --profile preview` to generate the APK via Expo's cloud build servers.
> 3. **Audio Handling**: Voice responses must always originate from a user gesture to comply with browser audio policies.
> 4. **Credentials**: Keep all tokens and API keys in `.env` and verify that `.gitignore` excludes sensitive files.
