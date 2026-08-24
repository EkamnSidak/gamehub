# Draw a Perfect Circle & Precision Suite 🎯

A sleek, physics-infused precision micro-game suite and infinite discovery laboratory built with React, TypeScript, Tailwind CSS, HTML5 Canvas, and Gemini AI.

> **Developed by Sidakpreet & Ekamdeep**

---

## 🎮 Included Game Challenges

1. **⭕ Draw a Perfect Circle**
   - Draw a circle in a single continuous stroke.
   - Real-time gesture tracking computes radius variance, centroid stability, and gap closure penalty to score accuracy from 0.0% to 100.0%.
   - Instant visual breakdown with reference circle overlays and dynamic verdict badges.

2. **🧪 Infinite Craft**
   - Combine elements on an open canvas to discover hundreds of emergent recipes.
   - Powered by an AI-assisted alchemy backend with in-memory caching and first discovery tracking.
   - Quick element search, filtering, and instant sharing of discovered discoveries.

3. **📏 The Straight Line**
   - Draw the straightest possible single stroke across any angle.
   - Precision scoring checks linear regression variance, directional deviation, and wobble micro-jitters.

4. **⏱️ The Second**
   - Test your internal biological clock.
   - Press and hold or tap to stop the clock at exactly **1.000s**.
   - Millisecond-level feedback and timing calibration graphs.

5. **🎯 The Middle**
   - Pinpoint the exact visual midpoint or geometric centroid of dynamic polygons, arcs, and abstract shapes across 10 progressive rounds.

6. **🎨 The Color**
   - Test your optical color discrimination.
   - Fine-tune RGB and HSL sliders to match target swatches under varied luminosity conditions.

7. **⬛ The Square**
   - Draw a closed four-sided polygon and evaluate 90° corner perpendicularity, side aspect ratios, and edge straightness.

---

## ✨ Key Features

- **📱 Fully Responsive Canvas Engine**: Native `ResizeObserver` lifecycle management with high-DPI retina display scaling for mobile phones, tablets, and desktops.
- **📊 Master Stats Passport**: Tracks personal bests, total games played, average accuracy indices, and unlocked badges across all 7 challenge modes.
- **🔊 Dynamic Web Audio FX**: Built-in procedural sound synthesizer delivering haptic audio clicks, whooshes, chimes, and fanfare without external audio assets.
- **🎨 Multi-Theme System**: Seamless switching between Warm Paper, Neon Cyber, Pastel Mint, and Dark Mode palettes.
- **🚀 Web Share & Stickers**: Instant score sharing with fallback clipboard support and social copy generation.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/)
- **Graphics & Visuals**: HTML5 Canvas, [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Backend / API Proxy**: [Express](https://expressjs.com/), [Node.js](https://nodejs.org/), [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Tooling & Build**: [Vite](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [tsx](https://github.com/privatenumber/tsx)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/draw-a-perfect-circle.git
   cd draw-a-perfect-circle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for Infinite Craft AI expansions):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment

To generate a production-ready build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

---

## 👥 Credits & Authors

- **Developed by**: Sidakpreet & Ekamdeep
- **License**: MIT
