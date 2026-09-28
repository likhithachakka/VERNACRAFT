VERNACRAFT (వెర్నాక్రాఫ్ట్)
AI-Powered Mother Tongue Pedagogy Platform for Primary Education in Jharkhand
![Image](https://img.shields.io/badge/SIH-2026-brightgreen.svg)
![Image](https://img.shields.io/badge/NEP%202020-Clause%204.11-blue.svg)
![Image](https://img.shields.io/badge/Gemini%20API-3.1%20Flash%20%7C%20Live-orange.svg)
![Image](https://img.shields.io/badge/Bhashini-IndicTrans--v2-purple.svg)
![Image](https://img.shields.io/badge/PWA-Offline%20Ready-emerald.svg)
📌 Executive Summary & Problem Context
In the tribal belts of Jharkhand (Dumka, Chaibasa, Gumla, Khunti), over 32 indigenous communities (Santhal, Munda, Ho, Oraon/Kurukh) speak native languages at home. However, state curriculum and textbooks are predominantly printed in standard Hindi or English.
This mismatch creates a severe "Language Shock" in Classes 1 through 5, leading to:
High Primary Dropout Rates: Nearly 44.8% of tribal students fall behind or drop out due to incomprehension.
Teacher-Student Communication Gap: Non-tribal teachers cannot speak or explain science/math in tribal mother tongues.
Flawed Machine Translation: Generic translators (like Google Translate) produce literal dictionary translations lacking pedagogical context or relatable examples.
Rural Connectivity Deficit: Over 60% of rural tribal schools face frequent electricity and 4G internet blackouts.
VERNACRAFT solves this by moving from "Mechanical Translation" to "Deep Conceptual Pedagogy". It leverages Google Gemini AI and Bhashini IndicTrans-v2 to create culturally-grounded explanations (using village analogies like the cooking hearth chulha, village ponds, and farming), voice-guided AI tutoring, real-time smartboard animations, and offline-first printable bilingual worksheets.
🚀 Key Features
1. 🎙️ Sathi AI Voice & Text Tutor
Bidirectional conversational learning companion for young children.
Voice-first design: Primary school children speak naturally into the microphone without needing to type.
Empathetic character states (idle, thinking, explaining, cheering) with real-time text-to-speech audio in indigenous scripts (Santhali Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ, Hindi, Telugu, Mundari, Ho).
2. 👩‍🏫 1-Click Pedagogical Lesson Generator
Teachers select Grade (Class 1–5), Subject (EVS, Science, Math), and Target Vernacular.
Generates 4-step concept breakdowns, local village analogies (e.g., explaining Condensation via a boiling rice pot lid), indigenous stories, and bilingual glossaries.
3. 🖥️ Interactive Classroom Live Mode
Projector and smartboard-optimized high-contrast view for rural classrooms.
Real-time HTML5 Canvas animation engine showing scientific phenomena step-by-step with synchronized vernacular audio narration.
4. 📝 1-Click Printable Bilingual Worksheets
Built for schools without internet or devices.
Auto-generates printable A4 worksheets with bilingual vocabulary matching, everyday life observation questions, and answer keys.
5. 🎯 Adaptive Quiz & Misconception Diagnosis Engine
Goes beyond standard scoring: diagnoses why a student answered incorrectly.
Detects foundational misunderstandings (e.g., confusing evaporation with boiling) and triggers instant vernacular remedial micro-lessons.
6. 📴 100% Offline Rural Classroom Architecture (PWA)
Full Progressive Web App compliance with Service Workers and IndexedDB.
Teachers can pre-cache entire lesson bundles; classroom mode and quizzes run seamlessly even during total network outages.
🏗️ Technical Architecture
code
Code
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (BROWSER / PWA)                    │
│  React 19 + TypeScript + Tailwind CSS                                  │
│  • Voice WebRTC (Microphone Audio Capture)                             │
│  • Dynamic HTML5 Canvas Visualizer                                     │
│  • PWA Service Worker + IndexedDB Offline Sync Cache                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / WebSocket (/live)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    SECURE SERVER LAYER (Node.js / Express)             │
│  • Strict Server-Side Key Proxy (Zero Secret Leakage in Frontend)      │
│  • In-Memory Resilient Demo & Analytics Store                          │
│  • Rate-Limit & Error Fallback Controller                              │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
┌───────────────────▼─────────────┐   ┌─────────────▼────────────────────┐
│         GOOGLE GEMINI AI        │   │        BHASHINI AI MISSION       │
│  • Gemini 3.1 Flash / Flash-Lite│   │  • IndicTrans-v2 Pipeline        │
│  • Gemini 3.8 Live Voice API    │   │  • Phonetic Synthesizer          │
│  • Gemini 3.5 Transcribe        │   │  • Sovereign Indian Language SDK │
└─────────────────────────────────┘   └──────────────────────────────────┘
🌐 Supported Vernaculars & Tribal Languages
Language	Script / Code	Native Representation	Regional Focus
Santhali	Ol Chiki (sat)	ᱥᱟᱱᱛᱟᱲᱤ	Dumka, Santhal Pargana, Chaibasa
Mundari	Mundari / Devanagari (mun)	मुण्डारी	Khunti, Ranchi, West Singhbhum
Ho	Warang Chiti / Devanagari (hoc)	ᱦᱳ / हो	Kolhan Division, Chaibasa
Kurukh (Oraon)	Tolong Siki / Devanagari (kru)	कुड़ुख़	Gumla, Lohardaga, Latehar
Hindi	Devanagari (hi)	हिन्दी	State Lingua Franca
Telugu	Telugu (te)	తెలుగు	Multi-State Tribal Alignment (AP/TS)
English	Latin (en)	English	Primary Curriculum Anchor
🛠️ Project Structure
code
Code
├── dev-dist/                  # Build cache
├── public/                    # Static assets & PWA manifest
│   ├── favicon.svg
│   └── manifest.json
├── server/                    # Backend services
│   ├── aiService.ts           # Google GenAI SDK integration & cascading fallbacks
│   ├── bhashiniService.ts     # Bhashini IndicTrans-v2 bridge
│   └── demoStore.ts           # Curriculum, lesson, quiz, and analytics state
├── src/                       # Frontend application
│   ├── components/            # Reusable UI & Canvas elements
│   │   ├── AICharacter.tsx    # Sathi mascot with emotional states
│   │   ├── DynamicAnimationCanvas.tsx # Visual physics/science animator
│   │   ├── LiveVoiceDialog.tsx # Real-time voice interaction modal
│   │   ├── Navbar.tsx         # Role switcher, vernacular picker, offline toggle
│   │   ├── OfflineIndicator.tsx # Network state badge
│   │   └── PWAInstallButton.tsx # 1-click home screen install
│   ├── data/                  # Multilingual curriculum & demo standards
│   │   ├── curriculum.ts
│   │   ├── demoData.ts
│   │   └── languages.ts
│   ├── pages/                 # Full feature views
│   │   ├── AITutorPage.tsx    # Sathi AI dialogue screen
│   │   ├── AdaptiveQuizPage.tsx # Misconception diagnosis quiz
│   │   ├── AutoAnimateToolPage.tsx # Scene animation generator
│   │   ├── ClassroomPage.tsx  # Projector / Smartboard mode
│   │   ├── CreateLessonPage.tsx # Teacher lesson creation studio
│   │   ├── LandingPage.tsx    # Problem stats & solution overview
│   │   ├── StudentAchievementsPage.tsx # XP & Gamified badges
│   │   ├── StudentDashboard.tsx # Student learning portal
│   │   ├── TeacherAnalyticsPage.tsx # Classroom retention & vernacular metrics
│   │   ├── TeacherDashboard.tsx # Teacher hub
│   │   ├── TranslationToolPage.tsx # Contextual cultural translator
│   │   └── WorksheetsPage.tsx # Printable bilingual worksheet studio
│   ├── services/              # Client API & audio handlers
│   │   ├── api.ts             # API client with automatic offline fallback
│   │   ├── liveAudio.ts       # WebSocket live audio stream
│   │   ├── offlineStorage.ts  # LocalStorage / IndexedDB sync
│   │   └── speech.ts          # Web Speech synthesis wrapper
│   ├── types/                 # TypeScript interfaces & types
│   ├── App.tsx                # Main router & state manager
│   ├── index.css              # Tailwind CSS styles
│   └── main.tsx               # Entry point
├── index.html                 # HTML host document
├── metadata.json              # Applet configuration & permissions
├── package.json               # Dependencies and scripts
├── server.ts                  # Express server entry point & WebSocket handler
├── test_suite.py              # Automated QA test runner
├── tsconfig.json              # TypeScript compiler configuration
└── vite.config.ts             # Vite build settings
🚦 Getting Started & Local Development
Prerequisites
Node.js 18+ or 20+
npm or bun
1. Clone & Install Dependencies
code
Bash
git clone https://github.com/your-repo/vernacraft.git
cd vernacraft
npm install
2. Environment Configuration
Create a .env file in the root directory:
code
Env
# Google Gemini API Key (Get from Google AI Studio: https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Port Configuration
PORT=3000
3. Run Development Server
code
Bash
npm run dev
The application will launch at http://localhost:3000.
4. Build for Production
code
Bash
npm run build
npm start
🧪 Automated Testing & Verification
The repository includes a comprehensive automated QA test suite (test_suite.py) testing all REST endpoints, AI prompts, XSS injection sanitization, Santhali Ol Chiki script handling, and edge cases:
code
Bash
python3 test_suite.py
Automated QA Test Summary:
Functional Tests: 13/13 Passed (Health, Languages, Lessons, AI Pedagogy, Sathi Tutor, Worksheets, Quiz Submit, Analytics)
Input Validation Tests: Passed (Graceful 400s on empty payloads, 12KB large input handling, XSS sanitization)
Security Check: Verified zero API key exposure in client bundles.
📜 Policy & Curriculum Alignment
National Education Policy (NEP 2020) Clause 4.11 – 4.13: Mandates mother tongue as primary instruction medium through Grade 5.
NIPUN Bharat & FLN Mission: Directly targets Foundational Literacy and Numeracy by overcoming language barriers.
Digital India Bhashini Mission: Integrates sovereign AI Indian language models into primary government schools.
Jharkhand JCERT & JEPC: Aligned with primary state curriculum standards for Environmental Studies, General Science, and Mathematics.
👥 Contributors & Contact
Application: Vernacraft
Created for: Smart India Hackathon (SIH) 2026
Contact: likhithachakka3@gmail.com
License: MIT License
