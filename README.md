# Echo
**A secure, private, and decentralized messaging application where you own your identity and your conversations.**
---
## What is Echo?
Imagine a chat app like WhatsApp or Telegram, but without a big tech company sitting in the middle reading your messages, tracking your metadata, or owning your account database. 
With Echo:
- **No phone numbers or emails needed.** You register with your crypto wallet and identify yourself using a secure Ethereum style address.
- **True Privacy.** Every message is locked (End-to-End Encrypted) before it leaves your device. Only the intended recipient can unlock and read it.
- **No Central Server.** Your messages travel directly from your device to your peer's device. Your conversations are not stored on a company's cloud server forever. *(We only use a temporary relay if a direct connection is not possible, but even then, the relay cannot read your encrypted messages!)*
---
## Key Features
*   **Self-Sovereign Identity**: Sign in securely by providing a cryptographic signature from your crypto wallet. There is no password database to be hacked or leaked.
*   **Immutable Usernames**: Choose a custom username when registering your key bundles. Usernames are permanently tied to your Ethereum style address on the signalling directory.
*   **End-to-End Encryption (E2EE)**: Messages and media are encrypted in transit using a double-ratchet key exchange protocol. 
*   **Local-First Database**: Your message history and sessions are stored in an encrypted database stored locally on your device. You have absolute ownership of your data.
*   **Real-Time Presence & Status**: Online status indicators show when your contacts are active, and WhatsApp-style bouncing-dots typing indicators show when peers are typing.
*   **Optimized Group Read Receipts**: Read receipts are sent directly only to the sender of the message. This saves battery and network bandwidth while allowing active reader avatars to render under group messages.
*   **Media Sharing**: Share images securely with your contacts, fully encrypted in transit.
---
## How It Works (For Users)
1.  **Register your Account**: 
    Open the application and sign in by authenticating with your crypto wallet signature. Choose a username (usernames are permanent and cannot be changed later).
2.  **Add Contacts**: 
    Copy your Ethereum style address from the profile menu and share it with your friends. Send your address or username to your friends so they can add you to their contacts.
3.  **Start Chatting**: 
    Start messaging! Messages are transmitted securely using direct peer-to-peer technology.
4.  **Group Chats**: 
    Create secure groups, invite your contacts, and message together with full encryption.
5.  **Media Sharing**: 
    Send and receive encrypted images.
---
## Future Roadmap
*   **Embedded Federated MQTT Broker**: Allow desktop users to host their own routing nodes, completely eliminating reliance on centralized relays for users who prefer to route their own traffic.
