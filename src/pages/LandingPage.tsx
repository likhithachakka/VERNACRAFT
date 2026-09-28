import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Volume2,
  Video,
  CheckCircle2,
  Cpu,
  Layers,
  Heart,
  Globe2,
  Zap,
  Play,
  RotateCcw,
  Lightbulb,
  FileSpreadsheet,
  WifiOff,
} from 'lucide-react';
import { AICharacter } from '../components/AICharacter';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSetRole: (role: 'teacher' | 'student') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSetRole }) => {
  const [demoConcept, setDemoConcept] = useState('Water Cycle');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('hi');

  const concepts = [
    { title: 'Water Cycle', subtitle: 'जल चक्र / ᱫᱟᱜ ᱪᱟᱹᱠᱩᱨ', analogy: 'Mother boiling rice: steam hits cold lid & becomes droplets!' },
    { title: 'Plant Leaves (Photosynthesis)', subtitle: 'पौधों की रसोई', analogy: 'Green leaves are the kitchen cooking with sunlight!' },
    { title: 'Fractions (1/2, 1/4)', subtitle: 'रोटी का बंटवारा', analogy: 'Sharing a village roti equally between hungry siblings.' },
  ];

  const currentConceptData = concepts.find((c) => c.title === demoConcept) || concepts[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* SIH 2026 Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-bold tracking-wide mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart India Hackathon 2026 Finalist Prototype</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-emerald-700">SIH26042</span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
            >
              VERNACRAFT
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mt-2">
                “From Translation to Understanding”
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered vernacular learning that teaches children in the language they understand best.
              Designed specifically for Jharkhand&apos;s multilingual tribal and rural primary schools.
            </motion.p>

            {/* Core Principle Callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-5 inline-block px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold"
            >
              ⚠️ Core Principle: <span className="underline decoration-amber-500 font-bold">Translation ≠ Learning</span>.
              Vernacraft breaks down curriculum concepts into relatable village analogies &amp; animations.
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
            >
              <button
                id="hero-btn-start-learning"
                type="button"
                onClick={() => {
                  onSetRole('student');
                  onNavigate('/student');
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-102"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-teacher-dashboard"
                type="button"
                onClick={() => {
                  onSetRole('teacher');
                  onNavigate('/teacher');
                }}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 shadow-xs flex items-center gap-2 transition-all hover:scale-102"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Teacher Dashboard</span>
              </button>

              <button
                id="hero-btn-sih-demo"
                type="button"
                onClick={() => onNavigate('/demo')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-md flex items-center gap-2 transition-all hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Try SIH 2026 Demo</span>
              </button>
            </motion.div>

            {/* Pedagogical Chain Strip */}
            <div className="mt-14 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                The Vernacraft Pedagogy Transformation Loop
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  📚 Teacher Input
                </span>
                <span className="text-emerald-500 font-bold">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                  🧠 AI Pedagogy Engine
                </span>
                <span className="text-emerald-500 font-bold">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 shadow-xs">
                  🗣️ Mother Tongue Adaptation
                </span>
                <span className="text-emerald-500 font-bold">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-xs">
                  🎬 Dynamic Animation
                </span>
                <span className="text-emerald-500 font-bold">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs font-bold">
                  💡 Student Understanding
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pedagogy Engine Live Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Interactive Pedagogy Simulator</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                See How Vernacraft Transforms Concepts into Village Realities
              </h2>
            </div>

            {/* Concept switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {concepts.map((c) => (
                <button
                  key={c.title}
                  id={`landing-concept-btn-${c.title.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => setDemoConcept(c.title)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    demoConcept === c.title
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side: Raw Machine Translation vs Vernacraft Pedagogy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Raw Translator */}
            <div className="rounded-2xl p-5 bg-rose-50/50 border border-rose-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    ❌ Generic Machine Translator
                  </span>
                  <span className="text-[11px] font-mono text-rose-500 font-semibold">
                    Literal Word-by-Word
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Input: &quot;Evaporation occurs when kinetic energy breaks bonds in liquid state.&quot;
                </p>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-slate-700 text-xs leading-relaxed font-serif">
                  {demoConcept === 'Water Cycle' ? (
                    'वाष्पीकरण तब होता है जब गतिज ऊर्जा द्रव अवस्था में अंतराण्विक आकर्षण बंधों को तोड़ती है।'
                  ) : demoConcept === 'Plant Leaves (Photosynthesis)' ? (
                    'प्रकाश संश्लेषण पर्णहरित द्वारा सौर विकिरण के फोटॉन अवशोषण से एटीपी का निर्माण है।'
                  ) : (
                    'भिन्न एक गैर-शून्य पूर्णांक हर पर अंश का विभाजन अनुपात है।'
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 text-[11px] font-medium text-rose-700 flex items-center gap-1.5">
                <span>⚠️ Result:</span>
                <span>A 9-year-old child in Class 4 is intimidated by academic jargon.</span>
              </div>
            </div>

            {/* Vernacraft Pedagogy */}
            <div className="rounded-2xl p-5 bg-emerald-50/60 border border-emerald-300 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Vernacraft Pedagogical Engine
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    Class 4 Village Context
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-slate-800 text-xs leading-relaxed">
                  <p className="font-bold text-emerald-900 mb-1">
                    {currentConceptData.subtitle}
                  </p>
                  <p className="text-slate-700">
                    💡 <span className="font-semibold">Local Analogy:</span> {currentConceptData.analogy}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Result: Child instantly connects concept to daily home experience!
                </span>
                <button
                  onClick={() => onNavigate('/demo')}
                  className="underline hover:text-emerald-950 font-extrabold"
                >
                  See Full Demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Differentiators Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Built for Smart India Hackathon 2026
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Why Vernacraft Is A Complete Pedagogy Platform
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Solving the critical primary education retention crisis in tribal &amp; multilingual belts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vernacular Languages */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold text-xl">
              ᱚᱞ
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Mother-Tongue Native System
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Native support for Jharkhand languages: Santhali (Ol Chiki), Mundari, Ho, Kurukh, Hindi, Telugu, and English with honest capability indicators for speech &amp; text.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-700">
              <span className="px-2 py-0.5 rounded-md bg-slate-100">ᱥᱟᱱᱛᱟᱲᱤ</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">मुण्डारी</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">ᱦᱳ</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">कुड़ुख़</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100">हिन्दी</span>
            </div>
          </div>

          {/* Card 2: Context to Animation Engine */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Automatic Context-to-Animation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enter ANY educational topic—from &quot;Why is the sky blue&quot; to &quot;Fraction pizza&quot;—and the engine dynamically extracts characters, objects, and procedural animations!
            </p>
            <button
              onClick={() => onNavigate('/animate')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Try Any Custom Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Adaptive Assessment */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Misconception Diagnosis &amp; Adaptation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When a child makes a mistake, the AI identifies the exact misconception, adjusts difficulty, and automatically generates a simpler visual explanation.
            </p>
            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              Dynamic Scaffolding Loop
            </span>
          </div>

          {/* Card 4: Sathi AI Character */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              &quot;Sathi&quot; AI Teaching Mascot
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              An expressive, emotional companion with 7 emotional states: listening, thinking, explaining, asking, encouraging, and celebrating with voice.
            </p>
            <span className="text-[11px] font-mono text-indigo-700 font-bold">
              Voice &amp; Multi-lingual Audio
            </span>
          </div>

          {/* Card 5: Bilingual Worksheets */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Bilingual Worksheet Generator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Generate printable, classroom-ready worksheets with questions side-by-side in English and the student&apos;s mother tongue with answer keys.
            </p>
            <button
              onClick={() => onNavigate('/teacher/worksheets')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>View Printable Worksheets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Low-Connectivity & Offline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Offline-Resilient Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              All core lessons, quizzes, and curriculum assets are cached locally. Real AI calls are transparently separated from offline-capable teaching content.
            </p>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Low-Bandwidth Rural Mode
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Experience the 17-Step SIH Demonstration Flow
            </h2>
            <p className="text-emerald-100 text-sm md:text-base mb-8 leading-relaxed">
              Step through our live walkthrough: Teacher input → AI simplification → Hindi/Santhali translation → Sathi character → dynamic animation → audio narration → student confusion handling → adaptive quiz correction!
            </p>
            <button
              id="cta-launch-demo-btn"
              type="button"
              onClick={() => onNavigate('/demo')}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Launch Interactive SIH Demo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
