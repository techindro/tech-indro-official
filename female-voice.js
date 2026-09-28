/**
 * Tech Indro Unified Female TTS Voice Resolver
 * Ensures natural, high-clarity Indian/International female voice across all platform features.
 */
(function(window) {
    function getFemaleVoice(preferredLang = 'auto') {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        const isHindiOrIndian = preferredLang === 'hi' || preferredLang === 'bho' || preferredLang === 'hi-IN' || preferredLang === 'en-IN';

        // 1. High-priority Indian Female voices (Natural / Neural / Cloud)
        const indianFemaleNames = [
            'swara', 'neerja', 'veena', 'lekha', 'anjali', 'kalpana', 'priya', 
            'google हिन्दी', 'google hindi', 'heera', 'kavya', 'geeta'
        ];

        // 2. Global Female voice indicators
        const globalFemaleNames = [
            'zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 
            'eva', 'jenny', 'aria', 'sonia', 'female', 'natural female'
        ];

        // Attempt Indian Female voice first if requested
        if (isHindiOrIndian) {
            const indianMatch = voices.find(v => {
                const name = (v.name || '').toLowerCase();
                const lang = (v.lang || '').toLowerCase();
                const isMatchLang = lang.includes('hi') || lang.includes('-in');
                const isFemaleName = indianFemaleNames.some(fn => name.includes(fn)) || name.includes('female');
                return isMatchLang && isFemaleName;
            });
            if (indianMatch) return indianMatch;

            // Fallback Indian voice if name not strictly matched
            const anyIndian = voices.find(v => {
                const lang = (v.lang || '').toLowerCase();
                return lang.includes('hi-in') || lang.includes('hi_in') || (lang.includes('en-in') && !v.name.toLowerCase().includes('male'));
            });
            if (anyIndian) return anyIndian;
        }

        // Global Female Voice match (English / International)
        const femaleMatch = voices.find(v => {
            const name = (v.name || '').toLowerCase();
            return globalFemaleNames.some(fn => name.includes(fn)) || (name.includes('female') && !name.includes('male'));
        });
        if (femaleMatch) return femaleMatch;

        // Default to Google / Microsoft female fallback
        const softFallback = voices.find(v => {
            const name = (v.name || '').toLowerCase();
            return !name.includes('david') && !name.includes('mark') && !name.includes('george') && !name.includes('male');
        });

        return softFallback || voices[0] || null;
    }

    // Expose globally
    window.getTechIndroFemaleVoice = getFemaleVoice;

    // Pre-cache voices when available
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            getFemaleVoice();
        };
    }
})(window);
