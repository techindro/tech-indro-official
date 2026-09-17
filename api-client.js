// Tech Indro - Enterprise Client SDK & Authentication Layer
// Handles JWT sessions, secure cookie credentials, and RBAC utilities

const API_URL = "/api";

// --- Global Auth Namespace ---
window.TechIndroAuth = {
    getToken() {
        return localStorage.getItem("techIndroToken") || "";
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
        return !!this.getToken() || !!this.getUser();
    },
    getRole() {
        const user = this.getUser();
        return (user && user.role) ? user.role : 'guest';
    },
    setSession(user, token) {
        if (user) localStorage.setItem("techIndroUser", JSON.stringify(user));
        if (token) localStorage.setItem("techIndroToken", token);
        window.dispatchEvent(new CustomEvent("techIndroAuthChange", { detail: { user, token } }));
    },
    clearSession() {
        localStorage.removeItem("techIndroUser");
        localStorage.removeItem("techIndroToken");
        window.dispatchEvent(new CustomEvent("techIndroAuthChange", { detail: { user: null, token: null } }));
    },
    async logout() {
        try {
            await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (e) {}
        this.clearSession();
        window.location.href = "login.html";
    },
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();
        const headers = Object.assign({}, options.headers || {});
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        return fetch(endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include'
        });
    },
    async verifySession() {
        try {
            const res = await this.fetchWithAuth('/auth/me', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.user) {
                    localStorage.setItem("techIndroUser", JSON.stringify(data.user));
                    return data.user;
                }
            } else if (res.status === 401) {
                // Session expired
                this.clearSession();
            }
        } catch (e) {
            console.warn('[TechIndroAuth] Session check offline or skipped:', e.message);
        }
        return this.getUser();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // --- Verify Session in Background ---
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
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.user) {
                    TechIndroAuth.setSession(data.user, data.token);
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
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name, email, password, role: 'student' })
                });

                const data = await response.json();

                if (response.ok && data.user) {
                    TechIndroAuth.setSession(data.user, data.token);
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
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
