// Initialize Lucide Icons
lucide.createIcons();

// Universal Right-Side Navigation Drawer System
function ensureNavDrawer() {
    if (document.getElementById('navDrawer')) return;

    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.id = 'drawerOverlay';
    overlay.onclick = () => window.closeNavDrawer && window.closeNavDrawer();

    const drawer = document.createElement('aside');
    drawer.className = 'nav-drawer';
    drawer.id = 'navDrawer';
    drawer.setAttribute('aria-label', 'Main Navigation Drawer');
    drawer.innerHTML = `
        <div class="drawer-header">
            <a href="index.html" class="drawer-brand" onclick="closeNavDrawer()">
                <img src="assets/logo.svg" alt="Tech Indro Logo" class="drawer-logo-img">
                <span class="drawer-brand-text">TECH INDRO</span>
            </a>
            <button class="drawer-close-btn" onclick="closeNavDrawer()" aria-label="Close menu" title="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="drawer-body">
            <div class="drawer-section-title">MAIN NAVIGATION</div>
            <div class="drawer-primary-links">
                <a href="programs.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #ff6b35, #f7931e);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title">Courses</span>
                            <span class="drawer-badge">Explore All</span>
                        </div>
                        <span class="drawer-card-desc">AI, Robotics, Ethical Hacking & Full Stack</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
                <!-- 2. AI Tools Hub (50+ Curated Tools) -->
                <a href="ai-tools.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                            <path d="M5 3v4"></path>
                            <path d="M19 17v4"></path>
                            <path d="M3 5h4"></path>
                            <path d="M17 19h4"></path>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">AI Tools Hub</span>
                            <span class="drawer-badge" style="background: #8b5cf6; color: white;">50+ Tools</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #374151; font-weight: 500;">Best AI tools for coding, design, agents &amp; productivity</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
                <!-- 3. AI Agent (24/7 Autonomous Assistant & Doubt Solver) -->
                <a href="ai-mentor.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #6366f1, #4338ca);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="12" x="3" y="8" rx="2"></rect>
                            <path d="M12 2v6"></path>
                            <circle cx="8.5" cy="14" r="1.5"></circle>
                            <circle cx="15.5" cy="14" r="1.5"></circle>
                            <line x1="8" y1="18" x2="16" y2="18"></line>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">AI Agent</span>
                            <span class="drawer-badge" style="background: #6366f1; color: white;">24/7 Live</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #374151; font-weight: 500;">Autonomous conversational agent for voice doubts &amp; code solutions</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
                <a href="index.html#about" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title">About us</span>
                            <span class="drawer-badge" style="background: #3b82f6;">Our Story</span>
                        </div>
                        <span class="drawer-card-desc">Vision, pedagogy & ecosystem for future leaders</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
                <a href="support.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #10b981, #047857);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title">Contact</span>
                            <span class="drawer-badge live-badge">24/7 Live</span>
                        </div>
                        <span class="drawer-card-desc">Talk to counselors, call & WhatsApp support</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
            </div>

            <!-- Platform Features Section -->
            <div class="drawer-section-title" style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>PLATFORM FEATURES</span>
                <span class="drawer-badge" style="background: linear-gradient(135deg, #ec4899, #f43f5e); font-size: 0.65rem; color: white;">NEW</span>
            </div>
            <div class="drawer-primary-links">
                <!-- 1. Technical Interview Studio -->
                <a href="interview-prep.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #ff6b35, #ea580c);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" x2="12" y1="19" y2="22"></line>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">Technical Interview Studio</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #4b5563; font-weight: 500;">Simulate tech rounds &amp; benchmark resume against ATS algorithms</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>

                <!-- 2. Code Clash (1v1 Arena) -->
                <a href="code-clash.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #ea580c, #c2410c);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">Code Clash Arena</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #4b5563; font-weight: 500;">Live algorithmic duels, test case runner &amp; Elo benchmarks</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>

                <!-- 3. 3D Portfolio & Digital ID -->
                <a href="portfolio-generator.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #0284c7, #0369a1);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">Engineering Portfolio Studio</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #4b5563; font-weight: 500;">Production developer profile builder with verified credentials</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>

                <!-- 4. System Design Canvas -->
                <a href="system-design.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #2563eb, #1e40af);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                            <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                            <rect x="9" y="2" width="6" height="6" rx="1"></rect>
                            <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path>
                            <path d="M12 12V8"></path>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">System Design Canvas</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #4b5563; font-weight: 500;">Interactive distributed architecture canvas &amp; 100k RPS simulator</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>

                <!-- 5. Community & Doubt Hub -->
                <a href="community.html" class="drawer-card" onclick="closeNavDrawer()">
                    <div class="drawer-card-icon" style="background: linear-gradient(135deg, #a855f7, #7e22ce);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <path d="M8 9h8"></path>
                            <path d="M8 13h5"></path>
                        </svg>
                    </div>
                    <div class="drawer-card-info">
                        <div class="drawer-card-title-row">
                            <span class="drawer-card-title" style="color: #111827; font-weight: 700;">Community &amp; Doubt Hub</span>
                            <span class="drawer-badge" style="background: #9333ea; color: white;">Doubt Hub</span>
                        </div>
                        <span class="drawer-card-desc" style="color: #374151; font-weight: 500;">Peer questions &amp; 24/7 AI Mentor instant solutions</span>
                    </div>
                    <svg class="drawer-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
            </div>

            <!-- Core Academic & Practice Tools -->
            <div class="drawer-section-title" style="margin-top: 1.25rem;">MORE PLATFORM TOOLS</div>
            <ul class="drawer-links-list">
                <li>
                    <a href="tsoc.html" onclick="closeNavDrawer()">
                        <span class="drawer-icon-box tsoc-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                            </svg>
                        </span>
                        <span style="font-weight: 600;">TSOC Fellowship</span>
                    </a>
                </li>
                <li>
                    <a href="cyber-playground.html" onclick="closeNavDrawer()">
                        <span class="drawer-icon-box compiler-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="4 17 10 11 4 5"></polyline>
                                <line x1="12" y1="19" x2="20" y2="19"></line>
                            </svg>
                        </span>
                        <span style="font-weight: 600;">IndroLabs Compiler & Labs</span>
                    </a>
                </li>
                <li>
                    <a href="quiz.html" onclick="closeNavDrawer()">
                        <span class="drawer-icon-box test-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <path d="m9 15 2 2 4-4"></path>
                            </svg>
                        </span>
                        <span style="font-weight: 600;">Tech Test Series</span>
                    </a>
                </li>
                <li>
                    <a href="ai-mentor.html" onclick="closeNavDrawer()">
                        <span class="drawer-icon-box bot-icon" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 8V4H8"></path>
                                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                <path d="M2 14h2"></path>
                                <path d="M20 14h2"></path>
                                <path d="M15 13v2"></path>
                                <path d="M9 13v2"></path>
                            </svg>
                        </span>
                        <span style="font-weight: 600;">24/7 AI Agent (Doubt Solver)</span>
                    </a>
                </li>
            </ul>
            <div class="drawer-contact-card">
                <div class="contact-card-header">Need instant admission guidance?</div>
                <p class="contact-card-sub">Directly connect with our academic counselors.</p>
                <div class="contact-action-row">
                    <a href="tel:+917007896695" class="drawer-contact-btn tel-btn">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>+91 7007896695</span>
                    </a>
                    <a href="https://wa.me/917007896695" target="_blank" rel="noopener noreferrer" class="drawer-contact-btn wa-btn">
                        <span>WhatsApp Chat</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="drawer-footer">
            <a href="login.html" class="drawer-login-btn" onclick="closeNavDrawer()">
                <span>Student Login / Sign Up</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            </a>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
}

window.openNavDrawer = function() {
    ensureNavDrawer();
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const btns = document.querySelectorAll('.hamburger-btn, .hamburger');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    btns.forEach(b => b.classList.add('active'));
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
};

window.closeNavDrawer = function() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const btns = document.querySelectorAll('.hamburger-btn, .hamburger');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    btns.forEach(b => b.classList.remove('active'));
    document.body.style.overflow = '';
};

window.toggleNavDrawer = function(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    const now = Date.now();
    if (window._lastDrawerToggle && (now - window._lastDrawerToggle) < 300) {
        return;
    }
    window._lastDrawerToggle = now;

    ensureNavDrawer();
    const drawer = document.getElementById('navDrawer');
    if (!drawer) return;
    if (drawer.classList.contains('active')) {
        window.closeNavDrawer();
    } else {
        window.openNavDrawer();
    }
};

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.hamburger-btn, .hamburger');
    if (btn) {
        if (e.defaultPrevented) return;
        e.preventDefault();
        window.toggleNavDrawer(e);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeNavDrawer();
});
        
// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll animations
const fadeInOnScroll = () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 50) {
            element.classList.add('visible');
        }
    });
};
        
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// User Session Management
document.addEventListener('DOMContentLoaded', () => {
    try {
        const rawUser = localStorage.getItem('techIndroUser');
        if (rawUser) {
            const user = JSON.parse(rawUser);
            const loginBtns = document.querySelectorAll('.login-btn, a[href="login.html"]');
            loginBtns.forEach(btn => {
                if (!btn.closest('#authFooter') && !btn.classList.contains('back-home')) {
                    btn.innerHTML = `Dashboard (${user.name ? user.name.split(' ')[0] : 'Student'})`;
                    btn.href = 'dashboard.html';
                    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    btn.style.color = '#ffffff';
                }
            });
            if (window.lucide) lucide.createIcons();
        }
    } catch(e) {}

    // Auto-mount Cookie Consent Engine if not yet loaded
    if (!window.TechIndroCookies && !document.querySelector('script[src*="cookie-consent.js"]')) {
        const s = document.createElement('script');
        s.src = 'cookie-consent.js';
        s.defer = true;
        document.head.appendChild(s);
    }
});
