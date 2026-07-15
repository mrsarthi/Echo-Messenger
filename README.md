# [Echo](https://mrsarthi.github.io/EchoIt-Messenger/) - Technical Specification & User Guide
**A secure, private, and local-first messaging client where you own your cryptographic identity, choose your routing nodes, and control your conversations.**
---
## What is Echo?
Echo is a decentralized messaging tool built to replace centralized, surveillance-prone communication platforms (like WhatsApp, Telegram, or Signal) that force users to register with phone numbers and retain server-side connection logs. 
With Echo, there are **no centralized user accounts, no identity mapping tables, and no permanent cloud message databases.**
### Key Privacy Pillars:
1.  **Self-Sovereign Identity (SSI)**: No phone numbers, emails, or personal identifiers. Registration and authentication are performed entirely client-side using cryptographic signatures from your Ethereum style wallet addresses.
2.  **Zero-Knowledge Ephemeral Routing**: Official signaling relays are blind pipelines. The application decoupled all IP addresses from public keys at the server layer. The relay maintains **zero disk logs** of connection handshakes or message routes, and instantly purges transient memory maps upon socket disconnects.
3.  **Local-First & Encrypted**: Chat histories, contact databases, and key states reside strictly on your physical device (using browser IndexedDB/SQLite wrappers). 
4.  **Custom Relay Choice**: Unlike Signal or WhatsApp, you are not locked into our servers. You can host your own signaling relay and configure the client to connect directly to it, bypassing our infrastructure entirely.
---
## Core Features
-   **Initial Setup Wizard (Privacy Gate)**: On first launch, the client enforces COPPA/GDPR compliance checks (Verify 13+/16+ age), presents a clear warning about ephemeral signaling metadata, and allows users to choose between the **Official Relay** or inputting a **Custom WebSocket Relay URL** (`ws://` or `wss://`).
-   **End-to-End Encryption (E2EE)**: Messages and media are encrypted before transit using a Double-Ratchet key exchange protocol, preventing any relay node from reading payload contents.
-   **Chain Replies (Threaded Messaging)**: Keep conversations contextual by replying directly to specific messages. The client links the new message to the parent message ID, rendering a visual reply chain in the chat screen.
-   **Client-Side Blocking (Safety Controls)**: Protect yourself from harassment without exposing your contact preferences to the server. Blocking a user registers their public key in your local database; all subsequent packets received from that key are discarded instantly at the socket subscription layer.
-   **Optimized Group Read Receipts**: To save client battery and network bandwidth in group chats, read receipts are sent *unicast* directly to the message author instead of broadcasted to the whole group. The author's client then renders read avatars locally.
-   **Mandatory Update Checker**: On startup, the client queries the GitHub Releases API to verify database and protocol schema compatibility. If a newer semantic version is published, the user is prompted to update immediately to prevent session corruption.
-   **Presence & Typing Indicators**: Real-time online status and typing status events are passed ephemerally through active sockets.
---
## How It Works (Under the Hood)
```
 [ Alice Client ]                                   [ Bob Client ]
   |                                                      |
   |-- 1. Derive Keys client-side from wallet seed       |
   |-- 2. Encrypt message payload using Double Ratchet    |
   |                                                      |
   |------ 3. Send Payload to Relay (Target: Bob Key) ----> [Ephem. Relay]
                                                                |
                                             4. Match Socket ID |
                                             5. Forward Packet  |
                                             6. Purge Cache     |
                                                                v
                                                      [ bob derives key ]
                                                      [ decrypts payload ]
```
1.  **Authentication**: When connecting to the relay, the client provides a wallet address and signs a cryptographic challenge. The relay associates `wallet_address -> socket.id` strictly in transient RAM. The client's physical IP address is never stored or mapped.
2.  **Message Routing**: Sockets join rooms named after their lowercased wallet address. Senders emit messages to target rooms. The relay forwards the encrypted buffer to Bob's socket ID and purges the connection transaction instantly.
3.  **Client Filtering**: Bob's client receives the socket message, checks the sender against the local `echo_blocked_addresses` storage, and discards it immediately if blocked. Otherwise, it decrypts the message and renders the parent reference if it is a **Chain Reply**.
