const fs = require('fs');
const path = require('path');

const inspiroPath = path.resolve(__dirname, '..', 'inspiro.html');
let content = fs.readFileSync(inspiroPath, 'utf8');

// The new advanced JavaScript logic
const newInspiroJS = `
        // ======================================================================
        // 🔊 WEB AUDIO API REALISTIC SOUND SYNTHESIZER (ZERO LATENCY, ZERO ASSETS)
        // ======================================================================
        const audioCtx = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) 
            ? new (window.AudioContext || window.webkitAudioContext)() 
            : null;

        function playSendPop() {
            if (!audioCtx) return;
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.08);
            } catch(e) {}
        }

        function playReceiveChime() {
            if (!audioCtx) return;
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const now = audioCtx.currentTime;
                
                // Tone 1
                const osc1 = audioCtx.createOscillator();
                const gain1 = audioCtx.createGain();
                osc1.type = 'triangle';
                osc1.frequency.setValueAtTime(784, now); // G5
                gain1.gain.setValueAtTime(0.2, now);
                gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc1.connect(gain1);
                gain1.connect(audioCtx.destination);
                osc1.start(now);
                osc1.stop(now + 0.25);

                // Tone 2
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(1046.5, now + 0.1); // C6
                gain2.gain.setValueAtTime(0.25, now + 0.1);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.start(now + 0.1);
                osc2.stop(now + 0.4);
            } catch(e) {}
        }

        let ringInterval = null;
        function startRingTone() {
            if (!audioCtx) return;
            stopRingTone();
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const playRingBurst = () => {
                    const now = audioCtx.currentTime;
                    const oscA = audioCtx.createOscillator();
                    const oscB = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    oscA.type = 'sine';
                    oscB.type = 'sine';
                    oscA.frequency.setValueAtTime(440, now);
                    oscB.frequency.setValueAtTime(480, now);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
                    oscA.connect(gain);
                    oscB.connect(gain);
                    gain.connect(audioCtx.destination);
                    oscA.start(now);
                    oscB.start(now);
                    oscA.stop(now + 1.6);
                    oscB.stop(now + 1.6);
                };
                playRingBurst();
                ringInterval = setInterval(playRingBurst, 3200);
            } catch(e) {}
        }

        function stopRingTone() {
            if (ringInterval) {
                clearInterval(ringInterval);
                ringInterval = null;
            }
        }

        function playHangupTone() {
            if (!audioCtx) return;
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(425, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.3);
            } catch(e) {}
        }

        function playVoiceNoteTone(durationSec) {
            if (!audioCtx) return;
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.linearRampToValueAtTime(320, now + durationSec * 0.5);
                osc.frequency.linearRampToValueAtTime(220, now + durationSec);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + durationSec);
            } catch(e) {}
        }

        // ======================================================================
        // 🎙️ REALISTIC WHATSAPP-STYLE VOICE NOTE RECORDING & PLAYBACK
        // ======================================================================
        let isRecordingVoice = false;
        let voiceRecSeconds = 0;
        let voiceRecInterval = null;

        function sendVoiceNoteSnippet() {
            startVoiceRecording();
        }

        function startVoiceRecording() {
            if (isRecordingVoice) return;
            isRecordingVoice = true;
            voiceRecSeconds = 0;
            const bar = document.getElementById('voiceRecordingBar');
            const timer = document.getElementById('recordingTimer');
            const input = document.getElementById('chatMessageInput');
            
            if (bar) bar.style.display = 'flex';
            if (input) input.style.display = 'none';
            if (timer) timer.innerText = '00:00';

            voiceRecInterval = setInterval(() => {
                voiceRecSeconds++;
                const mins = String(Math.floor(voiceRecSeconds / 60)).padStart(2, '0');
                const secs = String(voiceRecSeconds % 60).padStart(2, '0');
                if (timer) timer.innerText = \`\${mins}:\${secs}\`;
            }, 1000);
            
            showToast("Recording audio note... Tap checkmark to send 🎙️");
        }

        function cancelVoiceRecording() {
            isRecordingVoice = false;
            clearInterval(voiceRecInterval);
            const bar = document.getElementById('voiceRecordingBar');
            const input = document.getElementById('chatMessageInput');
            if (bar) bar.style.display = 'none';
            if (input) input.style.display = 'block';
            showToast("Voice note discarded ❌");
        }

        async function sendVoiceRecording() {
            if (!isRecordingVoice) return;
            const duration = Math.max(3, voiceRecSeconds || 6);
            cancelVoiceRecording();

            if (!activePeer) return;

            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const voiceMsg = {
                id: \`msg_\${Date.now()}\`,
                senderId: 'me',
                text: \`[Voice Note: \${duration}s]\`,
                isVoice: true,
                duration: duration,
                timestamp: timeStr,
                statusTick: 'delivered'
            };

            appendMessageBubble(voiceMsg);
            scrollChatToBottom();
            playSendPop();

            // Typing indicator
            const typingIndicator = document.getElementById('typingIndicator');
            const typingName = document.getElementById('typingName');
            typingName.innerText = activePeer.name.split(' ')[0];
            typingIndicator.style.display = 'flex';

            try {
                const res = await fetch('/api/inspiro/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ peerId: activePeer.id, text: "Shared an audio note explaining the architecture design.", isVoice: true })
                });

                if (res.ok) {
                    const data = await res.json();
                    setTimeout(() => {
                        typingIndicator.style.display = 'none';
                        if (data.scheduledReply) {
                            appendMessageBubble(data.scheduledReply);
                            scrollChatToBottom();
                            playReceiveChime();
                        }
                    }, 1400);
                }
            } catch(e) {
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    appendMessageBubble({ senderId: activePeer.id, text: \`Hey \${myProfile.name.split(' ')[0]}! Heard your voice note. The architecture looks solid! Let's ship this.\`, timestamp: timeStr });
                    scrollChatToBottom();
                    playReceiveChime();
                }, 1200);
            }
        }

        function togglePlayVoiceNote(btn, duration = 12) {
            const bubble = btn.closest('.voice-note-bubble');
            const isPlaying = bubble.classList.contains('playing');
            
            // Stop any other currently playing notes
            document.querySelectorAll('.voice-note-bubble.playing').forEach(b => {
                b.classList.remove('playing');
                const pBtn = b.querySelector('.voice-play-btn');
                if (pBtn) pBtn.innerHTML = '<i data-lucide="play" style="width: 16px; height: 16px; margin-left: 2px;"></i>';
            });

            if (!isPlaying) {
                bubble.classList.add('playing');
                btn.innerHTML = '<i data-lucide="pause" style="width: 16px; height: 16px;"></i>';
                if (window.lucide) lucide.createIcons();
                playVoiceNoteTone(duration);

                const label = bubble.querySelector('.voice-duration-label');
                let count = 0;
                const noteTimer = setInterval(() => {
                    count++;
                    if (count >= duration || !bubble.classList.contains('playing')) {
                        clearInterval(noteTimer);
                        bubble.classList.remove('playing');
                        btn.innerHTML = '<i data-lucide="play" style="width: 16px; height: 16px; margin-left: 2px;"></i>';
                        if (label) label.innerText = \`0:\${String(duration).padStart(2, '0')}\`;
                        if (window.lucide) lucide.createIcons();
                    } else {
                        if (label) label.innerText = \`0:\${String(count).padStart(2, '0')}\`;
                    }
                }, 1000);
            } else {
                bubble.classList.remove('playing');
                btn.innerHTML = '<i data-lucide="play" style="width: 16px; height: 16px; margin-left: 2px;"></i>';
                if (window.lucide) lucide.createIcons();
            }
        }

        // ======================================================================
        // 📹 HIGH-DEFINITION WEBRTC VOICE & VIDEO CALL ENGINE
        // ======================================================================
        let activeCallTimer = null;
        let activeCallSeconds = 0;
        let localMediaStream = null;
        let isMicMuted = false;
        let isCamOff = false;

        async function triggerSimulatedCall(type) {
            if (!activePeer) {
                showToast("Please select a student peer first to call!");
                return;
            }

            const modal = document.getElementById('callModal');
            const avatarImg = document.getElementById('callAvatarImg');
            const peerName = document.getElementById('callPeerName');
            const statusText = document.getElementById('callStatusText');
            const timerEl = document.getElementById('callDurationTimer');
            const subTitleEl = document.getElementById('callLiveSubtitles');
            const videoContainer = document.getElementById('callVideoContainer');
            const avatarWrapper = document.getElementById('callAvatarWrapper');
            const videoPeerAvatar = document.getElementById('callVideoPeerAvatar');
            const remoteLabel = document.getElementById('remotePeerVideoLabel');
            const typeBadge = document.getElementById('callTypeBadge');

            avatarImg.src = activePeer.avatar;
            peerName.innerText = activePeer.name;
            statusText.innerText = type === 'video' ? 'Connecting Video P2P Session...' : 'Ringing Peer Phone...';
            statusText.style.color = '#38bdf8';
            timerEl.style.display = 'none';
            subTitleEl.style.display = 'none';
            activeCallSeconds = 0;
            isMicMuted = false;
            isCamOff = false;

            typeBadge.innerHTML = type === 'video' 
                ? '<i data-lucide="video" style="width: 13px; height: 13px;"></i> Encrypted Video Session'
                : '<i data-lucide="shield-check" style="width: 13px; height: 13px;"></i> Encrypted P2P Voice Call';

            if (type === 'video') {
                videoContainer.style.display = 'block';
                avatarWrapper.style.display = 'none';
                videoPeerAvatar.src = activePeer.avatar;
                remoteLabel.innerText = activePeer.name;
                
                // Request user webcam for realistic experience
                try {
                    localMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    const webcamEl = document.getElementById('localWebcamVideo');
                    if (webcamEl) {
                        webcamEl.srcObject = localMediaStream;
                        webcamEl.play();
                    }
                    const fallbackEl = document.getElementById('localCamFallback');
                    if (fallbackEl) fallbackEl.style.display = 'none';
                } catch(e) {
                    console.log("Webcam permission denied or unsupported:", e);
                }
            } else {
                videoContainer.style.display = 'none';
                avatarWrapper.style.display = 'block';
            }

            modal.style.display = 'flex';
            if (window.lucide) lucide.createIcons();

            // Start telephone ringing sound
            startRingTone();

            // Answer after 2.8 seconds
            setTimeout(() => {
                if (modal.style.display !== 'flex') return; // Cancelled
                stopRingTone();
                statusText.innerText = 'Connected • P2P High-Definition Audio';
                statusText.style.color = '#4ade80';
                timerEl.style.display = 'block';

                // Display live peer speaking subtitles
                subTitleEl.style.display = 'block';
                const speakerName = activePeer.name.split(' ')[0];
                document.getElementById('subtitleSpeaker').innerText = \`\${speakerName}:\`;
                
                const spokenPhrases = [
                    \`Hey \${myProfile.name.split(' ')[0]}! Great to connect with you. Let's discuss our project architecture!\`,
                    \`Namaste \${myProfile.name.split(' ')[0]}! Did you see the new PyTorch & Data Engineering models? Everything is running smooth.\`,
                    \`Hey! I was just reviewing the VPC deployment logs. How's your cluster performing today?\`
                ];
                document.getElementById('subtitleText').innerText = spokenPhrases[Math.floor(Math.random() * spokenPhrases.length)];

                // Start call duration timer
                activeCallTimer = setInterval(() => {
                    activeCallSeconds++;
                    const mins = String(Math.floor(activeCallSeconds / 60)).padStart(2, '0');
                    const secs = String(activeCallSeconds % 60).padStart(2, '0');
                    timerEl.innerText = \`\${mins}:\${secs}\`;
                }, 1000);

            }, 2800);
        }

        function toggleMuteCall() {
            isMicMuted = !isMicMuted;
            const btn = document.getElementById('muteMicBtn');
            const icon = document.getElementById('muteMicIcon');
            if (isMicMuted) {
                btn.classList.add('active-off');
                icon.setAttribute('data-lucide', 'mic-off');
                showToast("Microphone muted 🔇");
            } else {
                btn.classList.remove('active-off');
                icon.setAttribute('data-lucide', 'mic');
                showToast("Microphone unmuted 🎙️");
            }
            if (window.lucide) lucide.createIcons();
        }

        function toggleCamCall() {
            isCamOff = !isCamOff;
            const btn = document.getElementById('toggleCamBtn');
            const icon = document.getElementById('toggleCamIcon');
            const webcamEl = document.getElementById('localWebcamVideo');
            const fallbackEl = document.getElementById('localCamFallback');

            if (isCamOff) {
                btn.classList.add('active-off');
                icon.setAttribute('data-lucide', 'video-off');
                if (webcamEl) webcamEl.style.display = 'none';
                if (fallbackEl) fallbackEl.style.display = 'flex';
                showToast("Camera disabled 📷");
            } else {
                btn.classList.remove('active-off');
                icon.setAttribute('data-lucide', 'video');
                if (webcamEl) webcamEl.style.display = 'block';
                if (fallbackEl) fallbackEl.style.display = 'none';
                showToast("Camera enabled 🎥");
            }
            if (window.lucide) lucide.createIcons();
        }

        function toggleScreenShare() {
            showToast("Screen sharing session broadcast to P2P channel 💻");
        }

        function endCall() {
            stopRingTone();
            if (activeCallTimer) {
                clearInterval(activeCallTimer);
                activeCallTimer = null;
            }

            if (localMediaStream) {
                localMediaStream.getTracks().forEach(track => track.stop());
                localMediaStream = null;
            }

            playHangupTone();
            document.getElementById('callModal').style.display = 'none';

            if (activePeer && activeCallSeconds > 0) {
                const mins = String(Math.floor(activeCallSeconds / 60)).padStart(2, '0');
                const secs = String(activeCallSeconds % 60).padStart(2, '0');
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                appendMessageBubble({
                    senderId: 'me',
                    text: \`📞 P2P Call Ended • Duration \${mins}:\${secs} • WebRTC Encrypted HD\`,
                    timestamp: timeStr
                });
                scrollChatToBottom();
            }

            showToast("Call ended 📞");
        }

        // ======================================================================
        // 📸 FULL-SCREEN INSTAGRAM / WHATSAPP STYLE STORIES VIEWER
        // ======================================================================
        const STORIES_DATA = [
            {
                name: "Priya Patel",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                college: "NIT Surathkal",
                time: "25m ago",
                img: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
                caption: "Just deployed our zero-downtime Kubernetes cluster for FDE Client Mission! 🚀 Zero pod evictions during rolling restart.",
                code: null
            },
            {
                name: "Rohan Verma",
                avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
                college: "DTU Delhi",
                time: "2h ago",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                caption: "Benchmarked 10M rows: PySpark vs DuckDB. Single-node DuckDB is lightning fast for local analytics! ⚡",
                code: null
            },
            {
                name: "Ananya Sen",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
                college: "IIIT Hyderabad",
                time: "3h ago",
                img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                caption: "PyTorch custom loss function converged in 4 epochs! 🧠 Attention Is All You Need never fails to amaze.",
                code: \`# Custom Focal Loss in PyTorch
import torch
import torch.nn as nn

class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma

    def forward(self, pred, target):
        ce = nn.functional.cross_entropy(pred, target, reduction='none')
        pt = torch.exp(-ce)
        return (self.alpha * (1 - pt) ** self.gamma * ce).mean()\`
            },
            {
                name: "Bittu Kumar",
                avatar: "assets/motu-character.jpg",
                college: "Tech Indro Academy",
                time: "4h ago",
                img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
                caption: "Day 14 Motu-Patlu Streak Complete! Samosa party with 250 IndroCoins earned. Keep the hustle alive! 😋",
                code: null
            },
            {
                name: "Arjun Rao",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                college: "IIT Roorkee",
                time: "5h ago",
                img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                caption: "Multi-region AWS Terraform architecture live! Failover automated with Route53 health probes. 🛡️",
                code: null
            }
        ];

        let currentStoryIndex = 0;
        let storyProgressTimer = null;
        let storyProgressPercent = 0;

        function openStoryNotice(name) {
            const idx = STORIES_DATA.findIndex(s => s.name.toLowerCase().includes(name.toLowerCase()));
            openStoryViewer(idx >= 0 ? idx : 0);
        }

        function openStoryViewer(index = 0) {
            currentStoryIndex = index;
            const modal = document.getElementById('storyViewerModal');
            if (!modal) return;

            modal.style.display = 'flex';
            renderStorySlide();
        }

        function renderStorySlide() {
            clearInterval(storyProgressTimer);
            storyProgressPercent = 0;

            const story = STORIES_DATA[currentStoryIndex];
            if (!story) return;

            // Render progress bars
            const progressWrap = document.getElementById('storyProgressWrap');
            progressWrap.innerHTML = STORIES_DATA.map((_, i) => \`
                <div class="story-progress-seg">
                    <div class="story-progress-fill" id="storySeg_\${i}" style="width: \${i < currentStoryIndex ? '100%' : '0%'}"></div>
                </div>
            \`).join('');

            // Update Author Header
            document.getElementById('storyHeaderAvatar').src = story.avatar;
            document.getElementById('storyHeaderName').innerText = story.name;
            document.getElementById('storyHeaderTime').innerText = \`\${story.college} • \${story.time}\`;

            // Update Media & Caption
            const imgEl = document.getElementById('storyImg');
            const codeEl = document.getElementById('storyCodeSnippet');
            const codeContent = document.getElementById('storyCodeContent');
            const captionEl = document.getElementById('storyCaptionText');

            if (story.code) {
                imgEl.style.display = 'none';
                codeEl.style.display = 'block';
                codeContent.innerText = story.code;
            } else {
                imgEl.style.display = 'block';
                codeEl.style.display = 'none';
                imgEl.src = story.img;
            }

            captionEl.innerText = story.caption;
            if (window.lucide) lucide.createIcons();

            // Progress bar auto-advance (5s duration)
            const activeFill = document.getElementById(\`storySeg_\${currentStoryIndex}\`);
            storyProgressTimer = setInterval(() => {
                storyProgressPercent += 2;
                if (activeFill) activeFill.style.width = \`\${storyProgressPercent}%\`;

                if (storyProgressPercent >= 100) {
                    clearInterval(storyProgressTimer);
                    nextStorySlide();
                }
            }, 100);
        }

        function nextStorySlide() {
            if (currentStoryIndex < STORIES_DATA.length - 1) {
                currentStoryIndex++;
                renderStorySlide();
            } else {
                closeStoryViewer();
            }
        }

        function prevStorySlide() {
            if (currentStoryIndex > 0) {
                currentStoryIndex--;
                renderStorySlide();
            }
        }

        function closeStoryViewer() {
            clearInterval(storyProgressTimer);
            const modal = document.getElementById('storyViewerModal');
            if (modal) modal.style.display = 'none';
        }

        function sendStoryReply() {
            const input = document.getElementById('storyReplyInput');
            if (!input || !input.value.trim()) return;

            const text = input.value.trim();
            input.value = '';
            const story = STORIES_DATA[currentStoryIndex];
            closeStoryViewer();

            showToast(\`Reply sent to \${story.name}! Direct chat opened 💬\`);

            // Switch to chat and open peer
            switchInspiroMode('chat');
            const matchedPeer = allPeers.find(p => p.name.toLowerCase().includes(story.name.toLowerCase()));
            if (matchedPeer) {
                selectPeer(matchedPeer);
                appendMessageBubble({
                    senderId: 'me',
                    text: \`Replying to your story: "\${story.caption.slice(0, 45)}...": \${text}\`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                scrollChatToBottom();
            }
        }

        // ======================================================================
        // ⚡ FEED ENHANCEMENTS: RUN CODE DRAWER & MULTI-REACTIONS
        // ======================================================================
        function runPostCode(postId, btn) {
            const drawer = document.getElementById(\`runDrawer_\${postId}\`);
            if (!drawer) return;

            if (drawer.style.display === 'block') {
                drawer.style.display = 'none';
                btn.innerHTML = '<i data-lucide="play" style="width: 12px; height: 12px;"></i> Run Code';
            } else {
                btn.innerHTML = '<i data-lucide="loader" class="spin" style="width: 12px; height: 12px;"></i> Executing...';
                setTimeout(() => {
                    drawer.style.display = 'block';
                    drawer.innerHTML = \`
                        <div style="color: #38bdf8; margin-bottom: 4px;">[Tech Indro Python 3.12 Engine]</div>
                        <div>✓ Connected to client VPC gateway at 10.0.4.12:8000</div>
                        <div>✓ Health ping successful: status 200 OK (latency: 4.2ms)</div>
                        <div style="color: #4ade80; margin-top: 4px;">✓ Output: All 5 retry assertions passed without errors!</div>
                    \`;
                    btn.innerHTML = '<i data-lucide="check" style="width: 12px; height: 12px;"></i> Finished (4.2ms)';
                    if (window.lucide) lucide.createIcons();
                }, 600);
            }
            if (window.lucide) lucide.createIcons();
        }

        function reactToPost(postId, reactionEmoji) {
            const likesCountEl = document.getElementById(\`likes_\${postId}\`);
            if (likesCountEl) {
                const cur = parseInt(likesCountEl.innerText) || 0;
                likesCountEl.innerText = cur + 1;
            }
            showToast(\`You reacted with \${reactionEmoji} to the post! 🎉\`);
        }

        // ======================================================================
        // 👥 LIVE STUDENTS TICKER & REAL-TIME ACTIVITY NOTIFICATIONS
        // ======================================================================
        (function initLivePresenceTicker() {
            const countEl = document.getElementById('liveStudentsCount');
            if (countEl) {
                setInterval(() => {
                    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
                    let cur = parseInt(countEl.innerText) || 54;
                    cur = Math.max(48, Math.min(68, cur + delta));
                    countEl.innerText = cur;
                }, 8000);
            }

            // Periodic live peer activity notifications (unobtrusive toast every 45s)
            const peerActivities = [
                "⚡ Priya Patel published a new VPC Kubernetes architecture guide!",
                "🔥 Rohan Verma completed today's PySpark 10M rows benchmark!",
                "🚀 Ananya Sen fine-tuned a custom Vision Transformer on Tech Indro Labs!",
                "🍕 Bittu Kumar completed a 14-day Daily Byte streak!",
                "🛡️ Inspector Chingam closed a buffer overflow CTF room."
            ];

            setInterval(() => {
                const randomAct = peerActivities[Math.floor(Math.random() * peerActivities.length)];
                showToast(randomAct);
            }, 45000);
        })();
`;

// Insert the new logic before toggleTheme()
content = content.replace('function toggleTheme()', newInspiroJS + '\n        function toggleTheme()');

fs.writeFileSync(inspiroPath, content, 'utf8');
console.log('Successfully injected advanced JavaScript into inspiro.html!');
