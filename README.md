# ⚙️ D_Bots — Deriv Smart Trading Platform

> A modern, intelligent web trading interface built with **Django + HTMX + WebSockets**, showcasing real-time data engineering and frontend polish.

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Django](https://img.shields.io/badge/Django-4.2-green)
![WebSockets](https://img.shields.io/badge/WebSockets-Async-orange)
![Redis](https://img.shields.io/badge/Redis-Cache-brightgreen)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Made with ❤️ by Kaiser Emanuel](https://img.shields.io/badge/Made_with-❤️_by_Kaiser_Emanuel-red)

---

🌐 **Live Demo:** [kkmaina.onrender.com](https://kkmaina.onrender.com)  
> Experience **real-time chart updates**, **SPA-style navigation**, **theme toggle**, and a **bot simulation dashboard** — all powered by Django Channels.  
> ⚙️ *Note:* The app may take a few seconds to load on first visit due to Render’s free-tier “cold start.”  

💡 This live demo showcases how **Django Channels** enables a fully asynchronous, real-time trading dashboard — combining **WebSocket-driven backend updates** with a **responsive SPA frontend** for a smooth, professional user experience.

---

### 🚀 A modern, intelligent web trading interface built with **Django + HTMX + WebSockets**

This project is a personal showcase of advanced real-time trading architecture...

---

## 🧠 Overview

**D_Bots** provides:
- 🔄 **Real-time WebSocket data streaming** (ticks, candles, balance updates)
- 🤖 **Strategy Bot Builder** using Blockly to dynamically create trading logic  
  → The visual blocks generate Python code automatically, which is processed by the backend (`strategy_processor.py`).
- 📊 **Charting Module** using Lightweight Charts (TradingView-style)  
  → Supports symbol switching, multiple timeframes, and smooth WebSocket updates.
- 🧩 **Persistent SPA-like navigation** powered by HTMX  
- 💾 **Redis-based connection state tracking**  
- 🌗 **Dynamic theme switching** (Light/Dark mode)
- 🔐 **Secure authentication** for demo & real accounts

This project demonstrates professional-grade code architecture suitable for production-level trading platforms.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Django + Django Channels |
| Frontend | HTMX + JavaScript (modular) |
| Visual Bot Builder | Blockly (Google) |
| Real-time Data | WebSockets (Deriv API) |
| State & Caching | Redis |
| Charts | Lightweight Charts (TradingView-style) |
| UI | Tailwind / Custom CSS Themes |

---

## 🧩 Architecture Overview

Below is a high-level overview of how **D_Bots** works internally:

---

### 🧠 Key Architecture Highlights

- **🔁 Persistent WebSocket Architecture**  
  - Frontend connects to Django Channels through a shared consumer.  
  - A `connection_registry` and `subscription_registry` track active WebSocket instances and bot subscriptions.  
  - Each client maintains a **persistent async connection** to both the app and the Deriv API.  
  - All WebSocket handlers are **class-based async** to prevent blocking and support concurrency.

- **🧩 Visual Strategy Builder (Blockly)**  
  - Users can visually build strategies with drag-and-drop blocks.  
  - Blockly auto-generates Python code that is securely sent to the backend.  
  - Strategies can be **saved locally**, **uploaded**, or **reloaded** from storage for editing.

- **📊 Real-Time Market Data Layer**  
  - Managed by `market_subscriber.py` and `strategy_processor.py`.  
  - Handles **ticks**, **candles**, and **symbol subscription management**.  
  - Feeds live data to charts, bots, and UI modules without duplicates.

- **🔐 Secure Token Management**  
  - Tokens transmitted via HTTPS for security.  
  - Encrypted and stored in Redis (handled in `redis_conn.py`).  
  - Decrypted temporarily only when authenticating with Deriv WebSocket.

- **🧠 Redis Integration**  
  - Stores WebSocket states, user metadata, and bot configurations.  
  - Ensures bots can **resume automatically** after reloads.  
  - Prevents multiple bots from subscribing to the same symbol redundantly.

- **🧱 Modular Backend Design**  
  - Organized into small, focused service modules:  
    - `market_subscriber.py` → Handles market subscriptions  
    - `strategy_processor.py` → Executes and manages bot logic  
    - `subscription_registry.py` → Manages active Deriv subscriptions  
    - `redis_conn.py` → Manages secure Redis connections  
  - Promotes maintainability, readability, and clear separation of concerns.

- **🌗 Dynamic Theme & UX**  
  - Light/Dark theme supported via custom CSS variables.  
  - SPA-like navigation using **HTMX**, preserving active sessions and WebSocket state.  
  - Frontend designed for performance and responsiveness.

---

## 🧱 Example System Flow

1. User builds or uploads a bot (Blockly → XML → Python code).  
2. Bot code is sent via WebSocket to the backend.  
3. Backend authenticates with Deriv using secure tokens (from Redis).  
4. Market subscriptions begin through `market_subscriber.py`.  
5. `strategy_processor.py` processes bot logic asynchronously.  
6. Results and chart updates are streamed back in real time via WebSocket.

---

## 🎥 Demo Showcase

*(All GIFs recorded using ShareX at 15 FPS — optimized for smooth playback and small size.)*

Below is a short visual walkthrough showing the key features of the system.

| SPA Navigation (HTMX)                  | Load Bot Workspace                      | Bot Running                            | Live Chart                           | Theme Toggle                         |
|----------------------------------------|-----------------------------------------|----------------------------------------|--------------------------------------|--------------------------------------|
| ![SPA Navigation](static/gifs/SPA_HTMX.gif) | ![Load Bot](static/gifs/load_free_bot.gif) | ![Bot Running](static/gifs/run_bot.gif) | ![Live Chart](static/gifs/charts.gif) | ![Theme Toggle](static/gifs/theme_t.gif) |

---

## ⚡ Getting Started

This repository is designed for **local review by recruiters or collaborators**.  
Sensitive production credentials have been removed and replaced with safe placeholders.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kindake/public_repo.git
cd public_repo
```
---

## 🔑 Authentication for Local Testing (Important)

This project includes a simulated login flow using placeholder (dummy) tokens.

- These dummy tokens do NOT connect to a real Deriv account

- They exist only so recruiters can see:

- the authentication workflow

- the balance UI

- the bot/charts logic

If you (or a reviewer) want to connect to real Deriv data, simply:

1. Log into Deriv
2. Go to: Menu → API Token
3. Create the following:
   - **Demo Token** (required)
   - **Real Token** (optional)
4. Insert these tokens into:
   `/static/js/websocket.js`  
   (Look for the `token1` and `token2` placeholders.)

If help is needed generating tokens or enabling live-data mode, just contact me.

---

## 🧑‍💻 Author

Kaiser Emanuel Kinda  
Showcasing professional Django Channels WebSocket architecture.

📧 Email: kaiserkida@gmail.com  
🌐 Portfolio / Demo Repo: [https://github.com/kindake/deriv-smart-trading](https://github.com/kindake/deriv-smart-trading)  
🐙 GitHub: [@kindake](https://github.com/kindake)

---

## 🪪 License

This project is licensed under the MIT License — you’re free to use, modify, and distribute it with attribution.

---

## 💼 Why This Project Matters

This project demonstrates how I build **production-ready, asynchronous Django systems** with clean architecture and attention to performance.

**Recruiters / Collaborators:**  
If you’d like to see how this architecture can scale or connect to real market APIs (Deriv / Binance), I’d be happy to discuss and demonstrate integration.

📩 Contact: [kaiserkida@gmail.com](mailto:kaiserkida@gmail.com)  
🌐 Portfolio / GitHub: [https://github.com/kindake](https://github.com/kindake)
