import React from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Cpu,
  Video,
  Languages,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Pedagogy &amp; Technology Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Vernacraft Transforms Primary Education
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, research-grounded platform designed to overcome the linguistic and cognitive barrier in mother-tongue based primary education.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Core Philosophy Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
            1. The Core Philosophy: Why Generic Translation Fails
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            In primary schools (Classes 3 to 5), students are at the developmental stage of transitioning from concrete operational thinking to abstract reasoning (Piagetian cognitive development). When complex science or math textbooks are literally translated word-for-word, children are confronted with heavy academic Sanskritized or formalized terminology that has zero grounding in their rural daily lives.
          </p>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5 w-1/4">Feature</th>
                  <th className="p-3.5 w-3/8 text-rose-800 bg-rose-50/50">Generic Machine Translation</th>
                  <th className="p-3.5 w-3/8 text-emerald-800 bg-emerald-50/50">Vernacraft Vernacular Pedagogy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Vocabulary Choice</td>
                  <td className="p-3.5 text-rose-700">Formal academic, Sanskritized lexicon</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">Local spoken colloquial mother-tongue idioms</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Cognitive Load</td>
                  <td className="p-3.5 text-rose-700">High: memorization of ungrounded terms</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">Low: anchored to village ponds, farming, &amp; kitchen</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Visual Engagement</td>
                  <td className="p-3.5 text-rose-700">Static text block only</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">Dynamic procedural multi-scene animation</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Assessment</td>
                  <td className="p-3.5 text-rose-700">Pass/Fail binary scores</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">Misconception diagnosis with adaptive micro-lessons</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Offline Resilience</td>
                  <td className="p-3.5 text-rose-700">Requires high-speed persistent cloud API</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">Cached local storage with low-connectivity support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* The 5 Pillars of Vernacraft */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            2. The 5 Foundational Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Regional Mother-Tongue Registry
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete coverage of Jharkhand languages: Santhali (Ol Chiki), Mundari, Ho, Kurukh, alongside Hindi, Telugu, and English. We explicitly declare capability flags for STT and TTS to maintain truth in technology.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Context-to-Animation Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teachers type a concept, and our engine automatically synthesizes character agents, animated objects (sun, clouds, rain, plants, fractions), camera sequences, and synchronizes vernacular audio narration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                &quot;Sathi&quot; AI Teaching Mascot
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                An expressive visual agent capable of switching emotional states: listening patiently to child voice queries, thinking in mother tongue, explaining with analogies, and celebrating mastery with confetti.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-3">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Adaptive Assessment &amp; Misconception Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than penalizing wrong options, our algorithm detects the psychological misconception behind the choice (e.g., mistaking clouds for cotton candy) and immediately serves targeted visual scaffolding.
              </p>
            </div>
          </div>
        </section>

        {/* Offline & Architecture */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            3. Rural Deployment &amp; Low-Connectivity Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In many rural schools in Dumka, Pakur, or West Singhbhum, internet connectivity is intermittent. Vernacraft is architected with an offline-first storage engine:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Local Asset Cache</span>
              <p className="text-slate-600">All core JCERT syllabus lessons, quizzes, and vocabulary cards remain accessible completely offline.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Low-Bandwidth Mode</span>
              <p className="text-slate-600">Dynamic animations run as lightweight procedural vector SVGs instead of heavy multi-megabyte video files.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Printable Worksheets</span>
              <p className="text-slate-600">Teachers can generate and batch-print bilingual worksheets for zero-device classrooms.</p>
            </div>
          </div>
        </section>

        {/* CTA to Demo */}
        <div className="text-center pt-4">
          <button
            id="how-it-works-try-demo-btn"
            onClick={() => onNavigate('/demo')}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
          >
            <span>Experience the 17-Step Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
