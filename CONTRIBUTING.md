
# 🤝 Contributing to Notakto

Welcome, and thank you for considering contributing to **Notakto** — a nostalgic, strategy-focused variant of Tic Tac Toe with multiplayer, AI, and in-game economy support. This guide will help you get started smoothly.
(check FIRST_PR.md if this is your first time contributing to open source)
---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/rakshitg600/notakto-website.git
cd notakto
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
npm run dev
```

> If you're working on **Live Match** features, run the Socket.IO server separately:

```bash
cd notakto-socket-server
npm install
node livematch.js
```

---

## 📦 Project Structure Overview

```
src/
├── app/              # Next.js route-based pages (vsComputer, vsPlayer, liveMatch)
├── modals/           # Modal components for UI flows
├── services/         # Core logic, AI engine, Zustand store, Firebase, etc.
notakto-socket-server/
├── livematch.js/    # Socket.IO live multiplayer server (Node.js)
```

---

## 🧪 Testing

We use **Jest** and **React Testing Library**.

Run all tests:

```bash
npm run test
```

Check coverage:

```bash
npm run test -- --coverage
```

---

## 📁 Contribution Ideas

You can help in many ways:

* 📄 Improve documentation
* 🧠 Optimize AI or game logic
* 💬 Enhance UI/UX (modals, layout, gameboard)
* 🧪 Write or improve test coverage
* 🐛 Fix bugs or handle edge cases
* 🐳 Dockerize app and improve deployment setup

Check the [issues](https://github.com/rakshitg600/notakto-website/issues) tab and milestones for open tasks.

---

## 🧹 Code Style & Guidelines

* Format code with **Prettier**
* Check with `npm run lint` before commits
* Use **TypeScript** — avoid `any`
* Use `camelCase` for variables and `PascalCase` for components
* Favor functional components with hooks
* Keep logic modular and reusable (see `services/` folder)

---

## 🔧 Zustand & Services

* Use separate Zustand stores for coins, XP, player, game, modals, etc.
* Try to reuse logic from `services/logic.ts` and `ai.ts` wherever possible

---

## 🐳 Docker 

To run the application using Docker, use the following command:

```bash
docker-compose up
```
---

## 🙋 We're Happy to Help

Please don’t hesitate to ask questions — seriously. Whether you need help setting up, understanding a file, raising an issue, or fixing a bug — you’re absolutely welcome to reach out.

> I (the maintainer) am genuinely flattered that you're here. I don’t expect you to understand everything at once, and I’m more than happy to explain anything, support you, or help you get started.

If something is confusing, that’s a sign we need to improve it — feel free to open a discussion or comment anywhere.

---

Thanks again for being part of Notakto 🎮

```
