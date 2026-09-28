/**
 * Tech Indro Platform - Firebase Configuration Stub
 * Provides graceful fallback initialization so client scripts do not throw unhandled 404 or ReferenceErrors.
 */
(function() {
    window.TECH_INDRO_FIREBASE = {
        initialized: false,
        status: 'standalone_mode',
        auth: null,
        db: null,
        storage: null
    };

    if (typeof window.firebase !== 'undefined' && !window.firebase.apps?.length) {
        try {
            const config = {
                apiKey: "AIzaSyDummyKeyForTechIndroClientApp2026",
                authDomain: "tech-indro.firebaseapp.com",
                projectId: "tech-indro",
                storageBucket: "tech-indro.appspot.com",
                messagingSenderId: "10987654321",
                appId: "1:10987654321:web:abcdef123456"
            };
            window.firebase.initializeApp(config);
            window.TECH_INDRO_FIREBASE.initialized = true;
            window.TECH_INDRO_FIREBASE.status = 'initialized';
        } catch (e) {
            console.info('[Firebase Config] Operating in standalone API mode.');
        }
    }
})();
