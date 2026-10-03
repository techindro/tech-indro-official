/**
 * Tech Indro - PostHog Product Telemetry & Session Replay
 * Free tier ready: 1,000,000 events/month + 5,000 Session Replays
 */

(function () {
    // Check for PostHog API Key from window config, localStorage, or meta tag
    const metaKey = document.querySelector('meta[name="posthog-api-key"]')?.getAttribute('content');
    const POSTHOG_KEY = window.POSTHOG_API_KEY || metaKey || 'phc_techindro_free_telemetry_key';
    const POSTHOG_HOST = window.POSTHOG_HOST || 'https://us.i.posthog.com';

    // Standard PostHog Official Modern Loader
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}var c=e;for("undefined"!=typeof a?c=e[a]=[]:a="posthog",c.people=c.people||[],c.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},c.people.toString=function(){return c.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(c,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    // Initialize PostHog
    try {
        window.posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            person_profiles: 'identified_only',
            capture_pageview: true,
            capture_pageleave: true,
            autocapture: true,
            session_recording: {
                recordCrossOriginIframes: true,
                maskAllInputs: false,
                maskInputOptions: {
                    password: true,
                    creditCard: true
                }
            },
            loaded: function(ph) {
                console.log('📊 [Telemetry] PostHog Analytics initialized successfully.');
                
                // Track user identity if logged in
                try {
                    const savedUser = localStorage.getItem('techIndroUser');
                    if (savedUser) {
                        const user = JSON.parse(savedUser);
                        if (user && user.id) {
                            ph.identify(user.id, {
                                email: user.email,
                                name: user.name,
                                role: user.role || 'student'
                            });
                        }
                    }
                } catch (e) {}
            }
        });
    } catch (err) {
        console.warn('⚠️ [Telemetry] PostHog init notice:', err.message);
    }

    window.__techIndroTelemetryEvents = [];

    // Helper functions for application code
    window.trackTechIndroEvent = function (eventName, properties = {}) {
        const payload = {
            eventName,
            ...properties,
            timestamp: new Date().toLocaleTimeString(),
            platform: 'web'
        };
        window.__techIndroTelemetryEvents.push(payload);

        // Visual console log with stylish formatting
        console.log(
            `%c📡 [PostHog Telemetry Event Captured]%c ${eventName}`,
            'background: #0f172a; color: #38bdf8; font-weight: 700; padding: 3px 8px; border-radius: 4px;',
            'color: #10b981; font-weight: bold;',
            payload
        );

        // Show live demo feedback if URL has demo=telemetry or demo mode enabled
        if (window.location.search.includes('demo=telemetry') || window.__showTelemetryDemo) {
            showTelemetryDemoToast(eventName, payload);
        }

        try {
            if (window.posthog && typeof window.posthog.capture === 'function') {
                window.posthog.capture(eventName, payload);
            }
        } catch (e) {
            console.error('Failed to capture event:', e);
        }
    };

    function showTelemetryDemoToast(eventName, payload) {
        let container = document.getElementById('phDemoToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'phDemoToastContainer';
            container.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; pointer-events: none;';
            document.body.appendChild(container);
        }

        const pill = document.createElement('div');
        pill.style.cssText = 'background: rgba(15, 23, 42, 0.95); color: #ffffff; padding: 10px 16px; border-radius: 10px; border-left: 4px solid #38bdf8; box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-size: 13px; backdrop-filter: blur(8px); display: flex; align-items: center; gap: 10px; opacity: 0; transform: translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
        pill.innerHTML = `<span style="background: #0284c7; color: white; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700;">📡 POSTHOG</span> <span>Event Captured: <strong style="color: #38bdf8;">${eventName}</strong></span>`;
        container.appendChild(pill);

        requestAnimationFrame(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(10px)';
            setTimeout(() => pill.remove(), 400);
        }, 2800);
    }

    // Auto-track key conversion buttons
    document.addEventListener('DOMContentLoaded', function () {
        // Track Enroll / Checkout clicks
        document.querySelectorAll('a[href*="checkout"], button[onclick*="checkout"], .enroll-btn').forEach(el => {
            el.addEventListener('click', () => {
                window.trackTechIndroEvent('enroll_click', {
                    button_text: el.innerText.trim(),
                    page_location: window.location.pathname
                });
            });
        });

        // Track AI Shikshak interactions
        document.querySelectorAll('#send-btn, #mic-btn, .ask-doubt-btn').forEach(el => {
            el.addEventListener('click', () => {
                window.trackTechIndroEvent('ai_shikshak_interaction', {
                    type: el.id === 'mic-btn' ? 'voice' : 'text'
                });
            });
        });

        // Track Playground code runs
        document.querySelectorAll('#run-btn, .run-code-btn').forEach(el => {
            el.addEventListener('click', () => {
                window.trackTechIndroEvent('compiler_run', {
                    page: window.location.pathname
                });
            });
        });

        // Track Certificate shares & downloads
        document.querySelectorAll('.btn-share-linkedin, .btn-action-download, #btnDownloadPdf, #btnDownloadPng, button[onclick*="share"], button[onclick*="download"]').forEach(el => {
            el.addEventListener('click', () => {
                window.trackTechIndroEvent('certificate_action', {
                    action: el.id || el.innerText.trim(),
                    page: window.location.pathname
                });
            });
        });
    });
})();
