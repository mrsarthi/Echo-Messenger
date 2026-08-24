# [EchoIt](https://mrsarthi.github.io/EchoIt-Messenger/) — download & user guide

**A local-first, end-to-end encrypted messenger. Messages go straight from your
device to your friend's, and no server holds your history.**

This repository hosts the download page and the release builds. The application
source lives separately.

---

## Download

Latest release: **[v0.1.0 — first beta](https://github.com/mrsarthi/EchoIt-Messenger/releases/latest)**

| Platform | File |
| :--- | :--- |
| **Windows** | `EchoIt_0.1.0_x64-setup.exe` (installer), or the `.msi` |
| **Android** | `EchoIt_0.1.0_android_aarch64.apk` — 64-bit ARM, which is nearly every phone made since about 2018 |

On Android you will need to allow installing from an unknown source. The build
is signed, so later updates install over the top and keep your messages.

---

## What is EchoIt?

A messenger for ordinary people who would rather their conversations were not
sitting on someone else's server. There is no account, no phone number and no
email: your identity is created on your device and backed by a twelve-word
recovery phrase that only you hold.

Messages travel directly between the two devices in a conversation, encrypted
end to end. **No server stores your message history.**

### Adding someone takes both people

You add their connection ticket, they add yours. Until both halves are done
nothing can be delivered — and the app tells you which state you are in rather
than pretending otherwise.

One consequence worth knowing: **whoever adds second can message first.** The
other side's message box unlocks when the first message arrives.

### Blocking

Blocking is local to your device. A blocked peer's messages are discarded on
arrival, and they are never told. Note that blocking does not undo anything they
sent you before.

---

## What this build does not do yet

Stated plainly, because finding out later is worse:

- **Messages move while both apps are open.** If your friend's phone is asleep
  in a pocket, your message waits rather than arriving. Delivery to a
  backgrounded phone is not built yet.
- **Your chat history is not encrypted on disk.** Someone with access to an
  unlocked device could read it. Keep a lock screen or password on.
- **No groups, no read receipts, no delivery ticks, no typing indicators.**
- **If setup fails there is no in-app way to start over.** Unlikely, but if you
  get stuck at the setup screen please report it rather than fighting it.

---

## About the connection

Two phones have no fixed address, so something has to introduce them. EchoIt
uses a **connection helper** for that. It learns your device's public key, your
IP address and roughly when you are online, and it **cannot read your
messages**. Once the introduction is made, messages go straight between the two
devices. If a direct path cannot be established the helper passes the encrypted
messages along instead — still unable to read them.

In this release that helper is the public infrastructure operated by
[Number 0](https://n0.computer), who make the networking library EchoIt is built
on. We do not run it and receive nothing from it, which also means we cannot
make promises about what it keeps. Running our own is planned.

EchoIt also asks GitHub once a day whether a newer version is available. That
request carries nothing about you or your conversations, though GitHub can see
an IP address and roughly when the app was opened. You can turn it off in
Settings and check for new versions yourself.

---

## Your recovery phrase

Write down the twelve words. They are the only way to recover your identity on a
new device, and they restore **who you are, not your message history**. Nobody
holds a copy of either — not us, not anyone. If you lose both the device and the
phrase, that identity is gone.

---

## Reporting problems

Please include what you did, what you expected, and what happened. If a message
did not arrive, say whether **both apps were open at the time** — that single
detail is the most useful thing in a report.
