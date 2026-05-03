# ElectionIQ 🗳️

**ElectionIQ** is a premium, high-fidelity civic education platform designed to make the complexities of electoral processes accessible, engaging, and interactive. Built with a focus on modern motion design and glassmorphic aesthetics, it provides a seamless learning journey from registration to results.

![ElectionIQ Preview](public/preview.png) *(Note: Add your own screenshot here)*

## ✨ Features

- **Cinematic Onboarding**: A high-end "Click to Enter" splash screen transitioning into an interactive glass-pill selection flow.
- **3D Animated Globe**: Integrated `cobe` WebGL Earth for a global atmospheric context.
- **Floating AI Assistant**: A persistent, expandable AI Orb that provides instant civic guidance without interrupting the learning flow.
- **Hyperjump Transition**: Dramatic cinematic zoom-in effect when entering the dashboard.
- **Interactive 3D Timeline**: A smooth, physics-based coverflow navigation system to explore election stages.
- **Location-Aware Content**: Dynamically adapts election rules and legal facts based on the selected country (US, India, UK, etc.).
- **Premium Glassmorphism UI**: High-end visual design with real-time backdrop blurs, dark mode by default, and smooth spring animations.
- **Progress Tracking**: "Mark as Done" functionality to keep track of your civic learning journey.
- **Civic Quiz**: Test your knowledge at the end of the timeline with dynamic feedback.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **API/Backend**: Vercel Serverless Functions
- **Deployment**: Google Cloud Run (Containerized) / Vercel (Serverless)

## ☁️ Google Cloud Deployment

This project is optimized for **Google Cloud Run**. 

### 1. Automated Deployment (Cloud Build)
Run the following command to build and deploy automatically using the included `cloudbuild.yaml`:
```bash
gcloud builds submit --config cloudbuild.yaml --substitutions=_PROJECT_ID=$(gcloud config get-value project)
```

### 2. Manual Deployment
If you prefer building locally:
```bash
gcloud run deploy election-iq --source . --platform managed --region us-central1 --allow-unauthenticated
```

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
