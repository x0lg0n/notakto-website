## 🧠 What is Notakto?

**Notakto** is a **misère variant of Tic-Tac-Toe**, where:

* Both players **play as X**.
* The game is played on **one or more Tic-Tac-Toe boards**.
* The **last player to complete a three-in-a-row loses**.
* If you have multiple boards: once a board has a three-in-a-row, it's "dead" (unplayable).
* The game continues on remaining live boards until a player is forced to move on the last active one and loses.

This turns classic Tic-Tac-Toe into a **zero-sum, strategic game** — it's essentially a variation of **misère Nim**.

---

## 🎮 Your Notakto Project Features

You’ve made a robust, full-featured implementation of Notakto using **Next.js** (after migrating from React Native). Here’s a complete list of features and technical details:

---

### ⚙️ Game Mechanics

* **Misère Rule Logic** – Completing the last three-in-a-row results in a loss.
* **Multi-board Play** – Users can play on 1 to 5 boards.
* **Configurable Sizes** – Each board can be up to 5x5.
* **Dead Board Detection** – Boards with a completed line are marked inactive.
* **Live Board Management** – AI or players skip dead boards.

---

### 🎮 Game Modes

1. **Single Player** – Play against AI with 5 difficulty levels.
2. **Two Player (Local)** – Play with a friend on the same device.
3. **Live Multiplayer** – Real-time matches over WebSocket.

---

### 🧠 AI Engine

* Uses **center-weighted heuristics** and **misère Nim strategy**.
* Implements perfect play logic at level 5.
* Easier difficulties add randomness to mimic mistakes.

---

### 🛍️ In-Game Economy

* **Coins** – Earned only by winning. Used for power-ups.
* **XP** – Earned by playing, even on losses. Used for leaderboards.

---

### 🪄 Power-ups

* **Undo Move**
* **Skip Move**

---

### 🌐 Multiplayer (Live Mode)

* Built using `socket.io-client` on the client and Socket.IO on the server.
* Server pairs players, manages rooms, synchronizes moves, and handles disconnects.
* Win conditions are checked on the server using classic Tic Tac Toe pattern checks.

---

### 💾 State Management

* Uses **Zustand** for clean separation

---

### 🔒 Authentication & Database

* Initially used Firebase for:

  * Google Auth
  * Cloud Firestore (coin, XP sync)

---

### 💸 Payments

* Coinbase Commerce integration for buying coins with crypto.

---

### 🎨 UI/UX

* **Retro 8-bit theme**
* Nostalgic sound effects
* Mobile-friendly interface
* Game board animation and interaction built for both mouse and touch

---

### 🚀 Future Features (Planned)

1. Global leaderboard (XP-based)
2. Friend list and “Play with Friends” mode
3. Ads integration with remove-ad purchase
4. Crash analytics, logging, and user tracking
5. GitOps-style CI/CD for auto-deploy
6. Automated test scripts

---

### Reference PPT
https://drive.google.com/file/d/1QHrSHDZumgNIxZhbl5kNWiP2y36SjO0U/view
