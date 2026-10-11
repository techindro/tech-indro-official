const fs = require('fs');
const path = require('path');

const inspiroPath = path.resolve(__dirname, '..', 'inspiro.html');
let code = fs.readFileSync(inspiroPath, 'utf8');

// 1. Replace openStoryNotice definition to open full-screen story viewer
code = code.replace(
    /function openStoryNotice\(name\) \{[\s\S]*?\}/,
    `function openStoryNotice(name) {
            const idx = STORIES_DATA.findIndex(s => s.name.toLowerCase().includes(name.toLowerCase()));
            openStoryViewer(idx >= 0 ? idx : 0);
        }`
);

// 2. Enhance stories list in renderStories to include Ananya and Arjun
code = code.replace(
    `const stories = [
                { name: myProfile.name.split(' ')[0], avatar: myProfile.avatar, tag: "Your Story", isMe: true },
                { name: "Priya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", tag: "FDE VPC" },
                { name: "Rohan", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80", tag: "Kafka" },
                { name: "Bittu", avatar: "assets/motu-character.jpg", tag: "Streak" },
                { name: "Satyam", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", tag: "Cyber" }
            ];`,
    `const stories = [
                { name: myProfile.name.split(' ')[0], avatar: myProfile.avatar, tag: "Your Story", isMe: true },
                { name: "Priya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", tag: "FDE VPC" },
                { name: "Rohan", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80", tag: "Kafka" },
                { name: "Ananya", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80", tag: "PyTorch" },
                { name: "Arjun", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", tag: "SRE Cloud" },
                { name: "Bittu", avatar: "assets/motu-character.jpg", tag: "Streak" }
            ];`
);

// 3. Enhance appendMessageBubble to render Voice Notes, Call logs, and Live Animated Checks
const newAppendBubble = `function appendMessageBubble(msg) {
            const canvas = document.getElementById('chatMessagesCanvas');
            const isMe = msg.senderId === 'me';
            const msgId = msg.id || ('m_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));

            // Case A: Call Log Message
            if (msg.text && msg.text.startsWith('📞')) {
                const callHtml = \`
                    <div style="align-self: center; background: rgba(0,0,0,0.06); [data-theme=dark] & { background: rgba(255,255,255,0.06); } padding: 6px 16px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: inline-flex; align-items: center; gap: 8px; margin: 4px 0;">
                        <span>\${msg.text}</span>
                    </div>
                \`;
                canvas.insertAdjacentHTML('beforeend', callHtml);
                return;
            }

            // Case B: Voice Note Bubble
            const isVoice = msg.isVoice || (msg.text && msg.text.includes('[Voice Note'));
            let bubbleContent = '';

            if (isVoice) {
                const duration = msg.duration || 12;
                bubbleContent = \`
                    <div class="voice-note-bubble">
                        <button class="voice-play-btn" onclick="togglePlayVoiceNote(this, \${duration})">
                            <i data-lucide="play" style="width: 16px; height: 16px; margin-left: 2px;"></i>
                        </button>
                        <div class="voice-waveform-container">
                            <div class="voice-wave-bars">
                                <span style="height: 35%;"></span>
                                <span style="height: 75%;"></span>
                                <span style="height: 95%;"></span>
                                <span style="height: 45%;"></span>
                                <span style="height: 100%;"></span>
                                <span style="height: 60%;"></span>
                                <span style="height: 85%;"></span>
                                <span style="height: 40%;"></span>
                                <span style="height: 90%;"></span>
                                <span style="height: 65%;"></span>
                                <span style="height: 45%;"></span>
                            </div>
                            <div class="voice-duration-label">0:\${String(duration).padStart(2, '0')}</div>
                        </div>
                        <img src="\${isMe ? myProfile.avatar : (activePeer ? activePeer.avatar : 'assets/logo.svg')}" class="voice-peer-badge" alt="Avatar">
                    </div>
                \`;
            } else {
                bubbleContent = \`
                    <div>\${msg.text}</div>
                    \${msg.isCode ? \`<div class="msg-code-container"><code>\${escapeHtml(msg.codeContent || msg.text)}</code></div>\` : ''}
                \`;
            }

            const checkSvg = \`
                <svg id="tick_\${msgId}" style="width: 14px; height: 14px; color: #94a3b8; display: inline-block; vertical-align: middle; transition: color 0.3s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 7 17l-5-5"></path>
                    <path id="doubleTick_\${msgId}" d="m22 10-7.5 7.5L13 16"></path>
                </svg>
            \`;

            const bubbleHtml = \`
                <div class="msg-bubble-wrap \${isMe ? 'outgoing' : 'incoming'}">
                    <div class="msg-bubble">
                        \${bubbleContent}
                        <div class="msg-meta-row">
                            <span>\${msg.timestamp}</span>
                            \${isMe ? checkSvg : ''}
                        </div>
                    </div>
                </div>
            \`;

            canvas.insertAdjacentHTML('beforeend', bubbleHtml);
            if (window.lucide) lucide.createIcons();

            // Progress ticks for outgoing message: Delivered in 500ms, Read in 1.4s
            if (isMe) {
                setTimeout(() => {
                    const tickEl = document.getElementById(\`tick_\${msgId}\`);
                    if (tickEl) tickEl.style.color = '#38bdf8'; // Turn blue (read receipt)
                }, 1400);
            }
        }`;

code = code.replace(/function appendMessageBubble\(msg\) \{[\s\S]*?canvas\.insertAdjacentHTML\('beforeend', bubbleHtml\);\s*\}/, newAppendBubble);

// 4. Update sendChatMessage to play audio sound
code = code.replace(
    `appendMessageBubble({ senderId: 'me', text, timestamp: timeStr });
            scrollChatToBottom();`,
    `appendMessageBubble({ senderId: 'me', text, timestamp: timeStr });
            scrollChatToBottom();
            playSendPop();`
);

code = code.replace(
    `if (data.scheduledReply) {
                            appendMessageBubble(data.scheduledReply);
                            scrollChatToBottom();
                        }`,
    `if (data.scheduledReply) {
                            appendMessageBubble(data.scheduledReply);
                            scrollChatToBottom();
                            playReceiveChime();
                        }`
);

// 5. Enhance renderFeedPosts to add "Run Code" and multi-reactions
code = code.replace(
    `<button class="copy-code-btn" onclick="copySnippetCode(this)">
                                <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copy
                            </button>`,
    `<div style="display: flex; gap: 6px;">
                                <button class="tool-btn" onclick="runPostCode('\${post.id}', this)" style="padding: 3px 8px; font-size: 0.72rem; color: #22c55e; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.1);">
                                    <i data-lucide="play" style="width: 11px; height: 11px;"></i> Run Code
                                </button>
                                <button class="copy-code-btn" onclick="copySnippetCode(this)">
                                    <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copy
                                </button>
                            </div>`
);

code = code.replace(
    `<div class="post-btn-group">
                            <button class="post-action-btn \${post.isLiked ? 'liked' : ''}" onclick="toggleLikePost('\${post.id}')">
                                <i data-lucide="heart" style="width: 16px; height: 16px;"></i> <span id="likes_\${post.id}">\${post.likes}</span>
                            </button>`,
    `<div class="post-btn-group" style="position: relative;">
                            <div class="reactions-picker-menu">
                                <button class="reaction-item-btn" onclick="reactToPost('\${post.id}', '❤️')">❤️</button>
                                <button class="reaction-item-btn" onclick="reactToPost('\${post.id}', '🚀')">🚀</button>
                                <button class="reaction-item-btn" onclick="reactToPost('\${post.id}', '💡')">💡</button>
                                <button class="reaction-item-btn" onclick="reactToPost('\${post.id}', '🔥')">🔥</button>
                            </div>
                            <button class="post-action-btn \${post.isLiked ? 'liked' : ''}" onclick="toggleLikePost('\${post.id}')">
                                <i data-lucide="heart" style="width: 16px; height: 16px;"></i> <span id="likes_\${post.id}">\${post.likes}</span>
                            </button>`
);

// Add run code drawer right after post.codeSnippet
code = code.replace(
    `<code>\${escapeHtml(post.codeSnippet)}</code>
                        </div>`,
    `<code>\${escapeHtml(post.codeSnippet)}</code>
                        </div>
                        <div class="run-code-drawer" id="runDrawer_\${post.id}"></div>`
);

fs.writeFileSync(inspiroPath, code, 'utf8');
console.log('Successfully polished Inspiro features!');
