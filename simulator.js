/**
 * Echo Messenger - Front-End Interactions and Performance observers
 * Vanilla JS logic for tab routing, simulated wallet claims, live network data loops, and scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ROUTING & TAB NAVIGATION
    // ==========================================
    const landingView = document.getElementById('landing-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    const navLogoLink = document.getElementById('nav-logo-link');
    const linkFeatures = document.getElementById('link-features');
    const linkPreview = document.getElementById('link-preview');
    const linkProtocol = document.getElementById('link-protocol');
    const linkNetwork = document.getElementById('link-network');
    const footerNetLink = document.getElementById('footer-net-link');

    const landingLinks = [navLogoLink, linkFeatures, linkPreview, linkProtocol];

    function switchToTab(tabName) {
        if (tabName === 'dashboard') {
            landingView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            
            // Update Active Navigation Styles
            linkNetwork.className = "text-primary font-bold border-b-2 border-primary pb-1 font-mono text-xs uppercase tracking-wider";
            [linkFeatures, linkPreview, linkProtocol].forEach(link => {
                link.className = "text-zinc-muted font-medium hover:text-primary transition-colors duration-200 font-mono text-xs uppercase tracking-wider";
            });
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            dashboardView.classList.add('hidden');
            landingView.classList.remove('hidden');
            
            // Revert Navigation Styles
            linkNetwork.className = "text-zinc-muted font-medium hover:text-primary transition-colors duration-200 font-mono text-xs uppercase tracking-wider";
        }
    }

    function handleRouting() {
        const hash = window.location.hash;
        if (hash === '#network') {
            switchToTab('dashboard');
        } else {
            switchToTab('landing');
            if (hash && hash !== '#home') {
                const targetEl = document.getElementById(hash.substring(1));
                if (targetEl) {
                    // Slight delay to ensure tab-view visibility reflow is complete
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            }
        }
    }

    // Direct Click Interceptors to prevent double scroll jumps
    linkNetwork.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'network';
    });

    footerNetLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'network';
    });

    landingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHash = link.getAttribute('href');
            if (window.location.hash === '#network') {
                e.preventDefault();
                switchToTab('landing');
                window.location.hash = targetHash;
            }
        });
    });

    window.addEventListener('hashchange', handleRouting);
    // Initialize routing on first load
    handleRouting();


    // ==========================================
    // 2. WALLET CONNECTION STATE SIMULATOR
    // ==========================================
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    let isWalletConnected = false;

    connectWalletBtn.addEventListener('click', () => {
        isWalletConnected = !isWalletConnected;
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        
        if (isWalletConnected) {
            connectWalletBtn.textContent = "0x71c...f89a";
            connectWalletBtn.className = "border border-primary text-primary font-bold px-4 py-2 rounded active:scale-95 transition-transform duration-150 font-mono text-xs uppercase tracking-wider";
            appendLog(`[${timestamp}] <span class="text-primary">USER_WALLET_CONNECTED</span>: Secp256k1 signature resolved. Username claims enabled.`);
        } else {
            connectWalletBtn.textContent = "Connect Wallet";
            connectWalletBtn.className = "bg-primary text-background font-bold px-4 py-2 rounded active:scale-95 transition-transform duration-150 font-mono text-xs uppercase tracking-wider";
            appendLog(`[${timestamp}] <span class="text-error-red">USER_WALLET_DISCONNECTED</span>: Session closed.`);
        }
    });


    // ==========================================
    // 3. LIVE LOGGER & METRICS SIMULATOR
    // ==========================================
    const terminal = document.getElementById('terminal');
    const visLatency = document.getElementById('vis-latency');
    const visLoss = document.getElementById('vis-loss');
    const metricNodes = document.getElementById('metric-nodes');

    const echoLogs = [
        "PEER_0x7b... HANDSHAKE_SUCCESS [X25519 DH]",
        "ENCRYPTION_ROTATION: Double Ratchet key cycle complete",
        "RELAY_BYPASS: Direct P2P tunnel socket connected",
        "SIGNALING_LOOKUP: Resolved 'satoshi' -> 0x82a1...",
        "SQLITE_ENCLAVE_SYNC: Syncing local message store (epoch 1403)",
        "XSALSA20_DECRYPT: Encrypted payload resolved successfully",
        "EPHEMERAL_RELAY: NAT restrictions - routing via relay_node_04"
    ];

    function appendLog(htmlContent) {
        if (!terminal) return;
        const logEntry = document.createElement('div');
        logEntry.className = 'text-zinc-muted';
        logEntry.innerHTML = htmlContent;
        terminal.appendChild(logEntry);
        terminal.scrollTop = terminal.scrollHeight;
        
        if (terminal.children.length > 50) {
            terminal.removeChild(terminal.children[0]);
        }
    }

    let logIdx = 0;
    setInterval(() => {
        if (document.getElementById('dashboard-view').classList.contains('hidden')) return;
        
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const logMsg = echoLogs[logIdx];
        
        let styledMsg = logMsg;
        if (logMsg.includes("PEER_0x")) {
            styledMsg = logMsg.replace("PEER_0x7b...", '<span class="text-primary">PEER_0x7b...</span>');
        } else if (logMsg.includes("ERROR") || logMsg.includes("NAT")) {
            styledMsg = `<span class="text-error-red">${logMsg}</span>`;
        } else if (logMsg.includes("ROTATION")) {
            styledMsg = `<span class="text-white">${logMsg}</span>`;
        }

        appendLog(`<span class="text-zinc-muted">[${timestamp}]</span> ${styledMsg}`);
        logIdx = (logIdx + 1) % echoLogs.length;
    }, 3000);

    // Fluctuate stats
    setInterval(() => {
        if (document.getElementById('dashboard-view').classList.contains('hidden')) return;

        // Fluctuating Latency
        const latency = Math.floor(Math.random() * 8) + 9; // 9ms to 16ms
        visLatency.textContent = `${latency}ms`;

        // Fluctuating Loss
        const loss = (Math.random() * 0.0003 + 0.0001).toFixed(4);
        visLoss.textContent = `${loss}%`;

        // Fluctuating active node count
        const activeNodes = Math.floor(Math.random() * 8) + 1398;
        metricNodes.textContent = activeNodes.toLocaleString();
    }, 4000);


    // ==========================================
    // 4. INTERACTIVE NODE MATRIX GENERATOR
    // ==========================================
    const nodeMatrixGrid = document.getElementById('node-matrix-grid');
    if (nodeMatrixGrid) {
        nodeMatrixGrid.innerHTML = ''; // Clear hardcoded mockup grid
        
        for (let i = 1; i <= 24; i++) {
            const isRelay = i % 7 === 0; // Simulate 3 relays out of 24 nodes
            const nodeEl = document.createElement('div');
            
            nodeEl.className = isRelay
                ? "aspect-square bg-surface-container border border-error-red/40 relative group cursor-pointer hover:bg-error-red/20 transition-all duration-300 flex items-center justify-center overflow-hidden rounded"
                : "aspect-square bg-surface-container border border-zinc-border relative group cursor-pointer hover:bg-primary/20 transition-all duration-300 flex items-center justify-center overflow-hidden rounded";
            
            const nodeLabel = isRelay ? `R${i}` : `N${i}`;
            const labelClass = isRelay ? "text-error-red font-mono text-xs" : "text-white font-mono text-xs";
            
            const randomLatency = Math.floor(Math.random() * 12) + 3;
            const hexId = `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase()}`;

            nodeEl.innerHTML = `
                <span class="${labelClass} group-hover:scale-125 transition-transform">${nodeLabel}</span>
                <div class="absolute inset-0 bg-surface-container p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none flex flex-col justify-center">
                    <div class="text-[8px] font-mono text-primary font-bold">ID: ${hexId}</div>
                    <div class="text-[8px] font-mono text-white">PING: ${randomLatency}ms</div>
                    <div class="text-[8px] font-mono text-zinc-muted truncate">${isRelay ? 'RELAY_NODE' : 'P2P_SOCKET'}</div>
                </div>
            `;
            
            nodeMatrixGrid.appendChild(nodeEl);
        }
    }


    // ==========================================
    // 5. INTERACTION BUTTON HANDLERS
    // ==========================================
    const refreshBtn = document.getElementById('dashboard-refresh-btn');
    const exportBtn = document.getElementById('dashboard-export-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
            appendLog(`[${timestamp}] <span class="text-white">&gt; MANUAL_REFRESH: Redrawing visualizer grid...</span>`);
            const svgPaths = document.querySelectorAll('#live-visualizer-svg path');
            svgPaths.forEach(path => {
                path.style.stroke = 'var(--accent-primary)';
                path.style.opacity = '1';
                setTimeout(() => {
                    path.style.stroke = '';
                    path.style.opacity = '';
                }, 800);
            });
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
            appendLog(`[${timestamp}] <span class="text-white">&gt; EXPORT_LOGS: Dumping network logs package...</span>`);
            alert("Export complete. 50 entries compiled to console output.");
        });
    }


    // ==========================================
    // 6. SCROLL REVEALS (IntersectionObserver)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                
                if (entry.target.classList.contains('protocol-visual-card')) {
                    const paths = entry.target.querySelectorAll('path');
                    paths.forEach(path => {
                        path.classList.add('draw-path');
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate, .clip-reveal, .feature-card').forEach(el => {
        observer.observe(el);
    });

    // Cursor light sweep for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // ==========================================
    // 7. CRYPTOGRAPHIC SANDBOX SIMULATOR
    // ==========================================
    const sandboxInputAlice = document.getElementById('sandbox-input');
    const sandboxSendBtnAlice = document.getElementById('sandbox-send-btn');
    const sandboxInputBob = document.getElementById('sandbox-input-bob');
    const sandboxSendBtnBob = document.getElementById('sandbox-send-btn-bob');

    const aliceChatFeed = document.getElementById('alice-chat-feed');
    const bobChatFeed = document.getElementById('bob-chat-feed');
    const sandboxPacket = document.getElementById('sandbox-packet');
    
    const sandboxRelayNode = document.getElementById('sandbox-relay-node');
    const sandboxRelayBuffer = document.getElementById('sandbox-relay-buffer');
    const sandboxRelayStatus = document.getElementById('sandbox-relay-status');
    const sandboxRelayPayload = document.getElementById('sandbox-relay-payload');
    const sandboxTelemetryTag = document.getElementById('sandbox-telemetry-tag');
    const sandboxRelayLogPanel = document.getElementById('sandbox-relay-log-panel');

    let firstMessage = true;

    function handleSend(sender) {
        const inputEl = sender === 'alice' ? sandboxInputAlice : sandboxInputBob;
        const msgText = inputEl.value.trim();
        if (!msgText) return;

        // Lock all controls
        sandboxInputAlice.disabled = true;
        sandboxSendBtnAlice.disabled = true;
        sandboxInputBob.disabled = true;
        sandboxSendBtnBob.disabled = true;

        sandboxTelemetryTag.textContent = "Deriving Keys...";
        sandboxTelemetryTag.className = "text-[9px] font-mono text-white uppercase animate-pulse";

        if (firstMessage) {
            aliceChatFeed.innerHTML = '';
            bobChatFeed.innerHTML = '';
            firstMessage = false;
        }

        // Add outgoing bubble to sender's feed
        const senderFeed = sender === 'alice' ? aliceChatFeed : bobChatFeed;
        const outBubble = document.createElement('div');
        outBubble.className = 'bg-primary/10 border border-primary/20 text-white rounded px-2.5 py-1 text-xs max-w-[85%] self-end break-words font-mono transition-all duration-300';
        outBubble.textContent = msgText;
        senderFeed.appendChild(outBubble);
        senderFeed.scrollTop = senderFeed.scrollHeight;

        // Generate ciphertext
        const ciphertext = '0x' + Array.from({length: Math.min(msgText.length * 2, 28)}, () => Math.floor(Math.random()*16).toString(16)).join('');

        // Encryption Scramble
        let scrambleCount = 0;
        const scrambleInterval = setInterval(() => {
            outBubble.textContent = Array.from({length: msgText.length}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');
            scrambleCount++;
            
            if (scrambleCount > 12) {
                clearInterval(scrambleInterval);
                outBubble.textContent = ciphertext;
                outBubble.className = 'bg-zinc-border/30 border border-zinc-border text-zinc-muted rounded px-2.5 py-1 text-[10px] max-w-[85%] self-end break-all font-mono';
                
                // Trigger transport
                startTransport(ciphertext, msgText, sender);
            }
        }, 60);
    }

    function startTransport(ciphertext, originalMsg, sender) {
        sandboxTelemetryTag.textContent = "Uploading Payload...";
        
        // Reset packet start position depending on direction
        const startCx = sender === 'alice' ? '40' : '360';
        const midCx = '200';
        const endCx = sender === 'alice' ? '360' : '40';

        sandboxPacket.classList.remove('hidden');
        sandboxPacket.setAttribute('cx', startCx);
        sandboxPacket.setAttribute('cy', '40');
        
        // CSS transition cx to Relay
        setTimeout(() => {
            sandboxPacket.style.transition = 'cx 1.0s linear';
            sandboxPacket.setAttribute('cx', midCx);
        }, 50);

        // Arrive at Relay
        setTimeout(() => {
            sandboxTelemetryTag.textContent = "Relay Holding Buffer";
            sandboxRelayBuffer.textContent = "1";
            sandboxRelayStatus.textContent = "EPHEMERAL_HOLD (IN MEMORY)";
            sandboxRelayStatus.className = "text-primary font-bold animate-pulse";
            sandboxRelayPayload.innerHTML = `<span class="text-primary font-bold">${ciphertext}</span>`;
            sandboxRelayPayload.classList.remove('italic');

            // Flash Relay border
            sandboxRelayLogPanel.style.borderColor = 'var(--accent-primary)';
            sandboxRelayNode.style.borderColor = 'var(--accent-primary)';

            // Hold for 800ms, then transport to receiver
            setTimeout(() => {
                startReceiverTransport(ciphertext, originalMsg, sender, endCx);
            }, 800);
        }, 1050);
    }

    function startReceiverTransport(ciphertext, originalMsg, sender, endCx) {
        sandboxTelemetryTag.textContent = "Downloading Payload...";
        sandboxPacket.setAttribute('cx', endCx);

        // Arrive at Receiver
        setTimeout(() => {
            sandboxPacket.classList.add('hidden');
            sandboxTelemetryTag.textContent = "Decrypting Enclave...";

            // Create receiver incoming bubble
            const receiverFeed = sender === 'alice' ? bobChatFeed : aliceChatFeed;
            const incBubble = document.createElement('div');
            incBubble.className = 'bg-zinc-border/30 border border-zinc-border text-zinc-muted rounded px-2.5 py-1 text-[10px] max-w-[85%] self-start break-all font-mono';
            incBubble.textContent = ciphertext;
            receiverFeed.appendChild(incBubble);
            receiverFeed.scrollTop = receiverFeed.scrollHeight;

            // Decryption Scramble Animation
            let decryptCount = 0;
            const decryptInterval = setInterval(() => {
                incBubble.textContent = Array.from({length: originalMsg.length}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');
                decryptCount++;
                
                if (decryptCount > 12) {
                    clearInterval(decryptInterval);
                    incBubble.textContent = originalMsg;
                    incBubble.className = 'bg-primary/10 border border-primary/20 text-white rounded px-2.5 py-1 text-xs max-w-[85%] self-start break-words font-body';
                    
                    // Simultaneously: Purge Server DB!
                    purgeRelayServer(sender === 'alice' ? sandboxInputAlice : sandboxInputBob);
                }
            }, 60);
        }, 1050);
    }

    function purgeRelayServer(activeInput) {
        sandboxTelemetryTag.textContent = "PURGING_RAM_BUFFER";
        sandboxTelemetryTag.className = "text-[9px] font-mono text-error-red uppercase animate-pulse";

        // Flash server logs red
        sandboxRelayLogPanel.style.borderColor = '#ef4444';
        sandboxRelayNode.style.borderColor = '#ef4444';
        sandboxRelayStatus.textContent = "PURGING RECORD...";
        sandboxRelayStatus.className = "text-error-red font-bold animate-pulse";

        setTimeout(() => {
            // Server database completely cleared!
            sandboxRelayBuffer.textContent = "0";
            sandboxRelayStatus.textContent = "CLEAR (0 RETAINED LOGS)";
            sandboxRelayStatus.className = "text-primary font-bold";
            sandboxRelayPayload.textContent = `No packets detected in memory.`;
            sandboxRelayPayload.className = "text-zinc-muted font-normal italic";
            
            // Revert border styles
            sandboxRelayLogPanel.style.borderColor = '';
            sandboxRelayNode.style.borderColor = '';

            sandboxTelemetryTag.textContent = "System Idle";
            sandboxTelemetryTag.className = "text-[9px] font-mono text-primary uppercase";

            // Unlock all controls
            sandboxInputAlice.disabled = false;
            sandboxSendBtnAlice.disabled = false;
            sandboxInputBob.disabled = false;
            sandboxSendBtnBob.disabled = false;

            activeInput.value = '';
            activeInput.focus();
        }, 1200);
    }

    // Attach listeners
    if (sandboxSendBtnAlice && sandboxInputAlice) {
        sandboxSendBtnAlice.addEventListener('click', () => handleSend('alice'));
        sandboxInputAlice.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !sandboxSendBtnAlice.disabled) {
                handleSend('alice');
            }
        });
    }

    if (sandboxSendBtnBob && sandboxInputBob) {
        sandboxSendBtnBob.addEventListener('click', () => handleSend('bob'));
        sandboxInputBob.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !sandboxSendBtnBob.disabled) {
                handleSend('bob');
            }
        });
    }

});
