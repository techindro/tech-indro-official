# 📜 TECH INDRO — Developer Rules & Coding Standards (`RULES.md`)

> **Tech Indro Development Guidelines, Security Protocols & Core Engineering Rules**  
> *Essential rules and quality standards to adhere to when modifying existing files or implementing new features.*

---

## 🛑 1. Core Engineering Principles

1. **Do Not Break Existing Functionality**: Never refactor or delete working code without running automated tests or verifying manual regressions. Backward compatibility is mandatory.
2. **Preserve Documentation & Comments**: Keep existing explanatory comments and docstrings intact unless an explicit requirement demands their revision.
3. **Zero Secret Leaks**: Never commit API keys (Razorpay, Gemini, Groq, JWT secrets) into source code. Always reference environment variables via `.env`.
4. **Lightweight Web Footprint**: For `tech-indro-official`, avoid adding heavy external npm packages unless strictly necessary. Native ES6+ and modern CSS guarantee fast loading.
5. **Mobile Native Compliance**: In `tech-indro-app`, follow Expo standards and make use of structured StyleSheet tokens instead of scattered ad-hoc styles.

---

## 💻 2. Language-Specific Standards

### A. JavaScript & Node.js (`server.js`, `main.js`)
- Always encapsulate asynchronous logic in `async/await` blocks with proper `try...catch` handling.
- Always return consistent JSON payloads with `success: true/false` flags and meaningful error descriptions.
- Keep global anti-crash listeners (`process.on('uncaughtException')` and `process.on('unhandledRejection')`) intact.

```javascript
// ✅ Recommended API Route Pattern
app.post('/api/resource', async (req, res) => {
  try {
    const result = await processResource(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[API Error]:', error.message);
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
});
```

### B. TypeScript & React Native (`tech-indro-app`)
- Explicitly define interfaces and type signatures for component props and state (avoid unconstrained `any`).
- Guard platform-specific APIs safely using `Platform.OS`.
- Use `useCallback` and `useMemo` where appropriate to avoid redundant re-renders on low-memory mobile hardware.

### C. CSS & Visual Styling (`style.css`)
- Retrieve all colors through standardized CSS custom properties (`var(--primary-accent)`, `var(--bg-main)`).
- Avoid hardcoding static `#ffffff` or `#000000` color literals to ensure dark and light theme switching remains seamless.
- Design responsive layouts using Flexbox, CSS Grid, and media queries (`@media (max-width: 768px)`).

---

## 🛡️ 3. Security & Anti-Crash Guidelines

1. **Sliding-Window Rate Limits**: Apply rate limiting to all public POST endpoints (authentication, code compiler, and chat routes).
2. **Code Execution Isolation**: Do not run user-supplied code directly on the host machine without sandboxing, memory constraints, and strict execution timeouts.
3. **Input Sanitization**: Escape and validate all incoming inputs to prevent Cross-Site Scripting (XSS) and injection vulnerabilities.

---

## 🌟 4. The 10 Golden Developer Commandments

> 1. **Understand Before Modifying**: Read the full file context and understand data flows before writing code.
> 2. **Never Break Working Systems**: If a component or endpoint functions correctly, keep changes minimal and focused.
> 3. **Protect Credentials**: Keep secrets inside `.env` files and verify that `.gitignore` prevents inadvertent commits.
> 4. **Test Both Themes**: Whenever you build or update a component, preview it in both Dark and Light modes.
> 5. **Verify Mobile Responsiveness**: Preview layouts on smaller viewports (under 400px width) to guarantee that text does not wrap awkwardly or overlap.
> 6. **Human-Friendly Error Messaging**: Display clear, helpful error notifications to students instead of raw stack traces.
> 7. **Clean Git Commit History**: Write concise, descriptive commit messages (e.g., `fix(compiler): enforce 5-second process timeout`).
> 8. **Prevent Infinite Loops**: Always implement termination guards and timeouts in loops and worker tasks.
> 9. **Optimize Asset Sizes**: Compress images and media files before bundling to maintain sub-second page load times.
> 10. **Keep Documentation Updated**: When modifying an architectural element, update these `docs/` files accordingly.
