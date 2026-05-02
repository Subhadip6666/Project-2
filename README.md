# ElectionIQ 🗳️

**ElectionIQ** is a premium, high-fidelity civic education platform designed to make the complexities of electoral processes accessible, engaging, and interactive. Built with a focus on modern motion design and glassmorphic aesthetics, it provides a seamless learning journey from registration to results.

![ElectionIQ Preview](public/preview.png) *(Note: Add your own screenshot here)*

## ✨ Features

- **Interactive 3D Timeline**: A smooth, physics-based coverflow navigation system to explore the election stages.
- **Location-Aware Content**: Dynamically adapts election rules and legal facts based on the selected country (US, India, UK, etc.).
- **AI Chat Assistant**: Powered by AI to answer specific questions about civic processes and local laws.
- **Premium Glassmorphism UI**: High-end visual design with real-time backdrop blurs, dark mode by default, and smooth spring animations.
- **Progress Tracking**: "Mark as Done" functionality to keep track of your civic learning journey.
- **Civic Quiz**: Test your knowledge at the end of the timeline with dynamic feedback.
- **Sticky Navigation**: Fixed header with progress indicator for seamless multi-section browsing.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **API/Backend**: Vercel Serverless Functions
- **Deployment**: Vercel

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/election-iq.git
   ```
2. Navigate to the project directory:
   ```bash
   cd election-iq
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📂 Project Structure

- `src/App.jsx`: Main application logic and component structure.
- `src/index.css`: Core design system and glassmorphic styles.
- `api/`: Vercel serverless functions for chat and quiz feedback.
- `public/`: Static assets and images.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for a more informed democracy.
