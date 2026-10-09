// Tech Indro - Enterprise Hardened Client SDK & Authentication Layer
// Security: Zero localStorage token storage (XSS Mitigation), HttpOnly Cookie Sessions, CSRF & 2FA Protection

const API_URL = "/api";

// Auto-purge any legacy sensitive tokens from localStorage to mitigate XSS risks
try {
    localStorage.removeItem("techIndroToken");
    localStorage.removeItem("token");
} catch (e) {}

// --- Global Auth Namespace ---
window.TechIndroAuth = {
    // CSRF Protection: Read Double-Submit CSRF cookie
    getCsrfToken() {
        const match = document.cookie.match(/(^|;\s*)techIndroCsrf=([^;]+)/);
        return match ? decodeURIComponent(match[2]) : "";
    },
    async ensureCsrfToken() {
        let token = this.getCsrfToken();
        if (!token) {
            try {
                const res = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
                const data = await res.json();
                token = data.csrfToken || this.getCsrfToken();
            } catch (e) {}
        }
        return token;
    },
    // Tokens are strictly maintained in HttpOnly, SameSite cookies by the server
    getToken() {
        return ""; // Deprecated: token is held in secure HttpOnly cookie
    },
    getUser() {
        try {
            const userStr = localStorage.getItem("techIndroUser");
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },
    isAuthenticated() {
        return !!this.getUser();
    },
    getRole() {
        const user = this.getUser();
        return (user && user.role) ? user.role : 'guest';
    },
    setSession(user) {
        if (user) {
            // Only store non-sensitive profile information for client rendering
            const safeDisplay = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'student',
                avatar: user.avatar || user.photo || '',
                twoFactorEnabled: !!user.twoFactorEnabled
            };
            localStorage.setItem("techIndroUser", JSON.stringify(safeDisplay));
        }
        window.dispatchEvent(new CustomEvent("techIndroAuthChange", { detail: { user } }));
    },
    clearSession() {
        localStorage.removeItem("techIndroUser");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user");
        localStorage.removeItem("techIndroToken");
        window.dispatchEvent(new CustomEvent("techIndroAuthChange", { detail: { user: null } }));
    },
    async logout() {
        try {
            const csrf = await this.ensureCsrfToken();
            await fetch(`${API_URL}/auth/logout`, { 
                method: 'POST', 
                headers: { 'X-CSRF-Token': csrf },
                credentials: 'include' 
            });
        } catch (e) {}
        this.clearSession();
        window.location.href = "login.html";
    },
    async fetchWithAuth(endpoint, options = {}) {
        const headers = Object.assign({}, options.headers || {});
        const method = (options.method || 'GET').toUpperCase();

        // Enforce CSRF token header on all mutating requests
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            const csrf = await this.ensureCsrfToken();
            if (csrf && !headers['X-CSRF-Token'] && !headers['x-csrf-token']) {
                headers['X-CSRF-Token'] = csrf;
            }
        }

        if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        return fetch(endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include' // Transmit HttpOnly secure authentication cookie
        });
    },
    async verifySession() {
        try {
            const res = await this.fetchWithAuth('/auth/me', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.user) {
                    this.setSession(data.user);
                    return data.user;
                }
            } else if (res.status === 401) {
                this.clearSession();
            }
        } catch (e) {
            console.warn('[TechIndroAuth] Session check offline or skipped:', e.message);
        }
        return this.getUser();
    },
    async updateProfile(profileData) {
        try {
            const res = await this.fetchWithAuth('/auth/profile', {
                method: 'POST',
                body: JSON.stringify(profileData)
            });

            const data = await res.json();
            if (res.ok && data.user) {
                this.setSession(data.user);
                return { success: true, user: data.user, message: data.message };
            } else {
                throw new Error(data.error || 'Failed to update profile on server');
            }
        } catch (err) {
            console.warn('[TechIndroAuth] Profile update error:', err.message);
            throw err;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Ensure CSRF token cookie is synchronized
    TechIndroAuth.ensureCsrfToken();

    // Verify Session in Background
    if (TechIndroAuth.isAuthenticated()) {
        TechIndroAuth.verifySession();
    }

    // --- LOGIN & REGISTER LOGIC ---
    const loginForm = document.getElementById("emailLoginForm") || document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";

            const submitBtn = document.getElementById("loginBtn") || loginForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Authenticating...";
            submitBtn.disabled = true;
            
            try {
                const csrf = await TechIndroAuth.ensureCsrfToken();
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrf
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                // Multi-Factor Authentication Challenge
                if (response.ok && data.require2FA) {
                    const code = prompt("Two-Factor Authentication Required.\nPlease enter your 6-digit Authenticator code:");
                    if (!code) {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        return;
                    }

                    const mfaRes = await fetch(`${API_URL}/auth/2fa/validate-login`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrf
                        },
                        credentials: 'include',
                        body: JSON.stringify({ tempToken: data.tempToken, code: code.trim() })
                    });
                    const mfaData = await mfaRes.json();

                    if (mfaRes.ok && mfaData.user) {
                        TechIndroAuth.setSession(mfaData.user);
                        submitBtn.innerText = "Login Successful!";
                        submitBtn.style.backgroundColor = "#10b981";
                        setTimeout(() => { window.location.href = "dashboard.html"; }, 400);
                        return;
                    } else {
                        alert(mfaData.error || "Invalid 2FA verification code.");
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        return;
                    }
                }

                if (response.ok && data.user) {
                    TechIndroAuth.setSession(data.user);
                    submitBtn.innerText = "Login Successful!";
                    submitBtn.style.backgroundColor = "#10b981";
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 400);
                } else {
                    alert(data.error || "Login failed. Please check your credentials.");
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error("Backend Error:", error);
                alert("Failed to connect to backend server. Please check your network.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("regName");
            const emailInput = document.getElementById("regEmail");
            const passwordInput = document.getElementById("regPassword");

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";

            const submitBtn = document.getElementById("registerBtn") || registerForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Creating Account...";
            submitBtn.disabled = true;
            
            try {
                const csrf = await TechIndroAuth.ensureCsrfToken();
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrf
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name, email, password, role: 'student' })
                });

                const data = await response.json();

                if (response.ok && data.user) {
                    TechIndroAuth.setSession(data.user);
                    submitBtn.innerText = "Account Created!";
                    submitBtn.style.backgroundColor = "#10b981";
                    alert("Account Created! Welcome to Tech Indro.");
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.error || "Registration failed. Please check your details.");
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error("Backend Error:", error);
                alert("Failed to connect to backend server.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            const email = document.getElementById("contactEmail").value;
            const message = document.getElementById("contactMessage").value;

            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending to Database...";
            
            try {
                const csrf = await TechIndroAuth.ensureCsrfToken();
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrf
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok) {
                    contactForm.reset();
                    submitBtn.innerText = "Message Sent to DB!";
                    submitBtn.style.backgroundColor = "var(--secondary, #10b981)";
                    
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = "var(--primary, #ff6b35)";
                    }, 3000);
                } else {
                    alert(data.error || "Submission error");
                    submitBtn.innerText = originalText;
                }
            } catch (error) {
                console.error("Backend Error:", error);
                alert("Failed to connect to backend server. Is it running?");
                submitBtn.innerText = originalText;
            }
        });
    }

    // --- DYNAMIC NAV & LOGOUT ---
    function updateNavUI() {
        const user = TechIndroAuth.getUser();
        if (user) {
            const loginLinks = document.querySelectorAll(".login-btn, [href='login.html']");
            loginLinks.forEach(link => {
                if (link.classList.contains('no-auth-replace')) return;
                link.innerText = "My Dashboard";
                link.href = "dashboard.html";
            });
        }
    }

    updateNavUI();
    window.addEventListener("techIndroAuthChange", updateNavUI);
});
