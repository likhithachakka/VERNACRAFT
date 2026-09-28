import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Award,
  Video,
} from 'lucide-react';
import { AICharacter } from '../components/AICharacter';
import { DynamicAnimationCanvas } from '../components/DynamicAnimationCanvas';
import { DEMO_WATER_CYCLE_LESSON } from '../data/demoData';
import { SpeechService } from '../services/speech';
import confetti from 'canvas-confetti';

interface DemoPageProps {
  onNavigate: (path: string) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isRetryingQuiz, setIsRetryingQuiz] = useState(false);
  const [retrySelectedAnswer, setRetrySelectedAnswer] = useState<number | null>(null);

  const totalSteps = 17;

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying && currentStep < totalSteps) {
      // Pause on interactive steps (like 12 when student makes a mistake or 16 retry)
      if (currentStep === 11 && !isQuizSubmitted) {
        setIsAutoPlaying(false);
      } else if (currentStep === 15 && retrySelectedAnswer === null) {
        setIsAutoPlaying(false);
      } else {
        timer = setTimeout(() => {
          setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
        }, 5500);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoPlaying, currentStep, isQuizSubmitted, retrySelectedAnswer]);

  const stepTitles = [
    '1. Teacher Selects Topic (Water Cycle)',
    '2. Teacher Enters Curriculum Goal',
    '3. AI Context Understanding',
    '4. Grade-Level Simplification (Class 4)',
    '5. Mother-Tongue Vernacular Adaptation',
    '6. Sathi AI Character Manifests',
    '7. Automatic Animation Generation',
    '8. Multi-Scene Audio Narration',
    '9. Student Voice Query: "What is evaporation?"',
    '10. AI Tutor Relatable Analogy in Hindi/Santhali',
    '11. Adaptive Comprehension Quiz',
    '12. Student Makes Misconception Mistake',
    '13. AI Misconception Diagnosis Engine',
    '14. Sathi Adapts with Kitchen Chulha Metaphor',
    '15. Visual Scaffolding & Verification',
    '16. Student Answers Again Correctly!',
    '17. Progress Updated & Mastery Celebrated!',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsAutoPlaying(false);
    setQuizSelectedAnswer(null);
    setIsQuizSubmitted(false);
    setIsRetryingQuiz(false);
    setRetrySelectedAnswer(null);
  };

  const handleFirstQuizSubmit = (answerIdx: number) => {
    setQuizSelectedAnswer(answerIdx);
    setIsQuizSubmitted(true);
    // Proceed to misconception step
    setTimeout(() => {
      setCurrentStep(12);
    }, 1200);
  };

  const handleRetrySubmit = (answerIdx: number) => {
    setRetrySelectedAnswer(answerIdx);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      setCurrentStep(16);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                SIH 2026 Walkthrough
              </span>
              <span className="text-slate-400 text-xs">SIH26042 Live Judge Demonstration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              The 17-Step Vernacraft Learning Cycle
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Experience the full pipeline from teacher classroom input to student vernacular mastery.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
            <button
              id="demo-prev-btn"
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs font-bold transition-all"
            >
              Back
            </button>

            <button
              id="demo-autoplay-btn"
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Auto' : 'Auto Play'}</span>
            </button>

            <button
              id="demo-next-btn"
              type="button"
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs font-bold transition-all"
            >
              Next
            </button>

            <button
              id="demo-reset-btn"
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              title="Restart Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar with 17 Step Indicators */}
        <div className="max-w-7xl mx-auto mt-5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
            <span className="text-emerald-400 font-bold">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="grid grid-cols-17 gap-1 h-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                id={`demo-step-pill-${i + 1}`}
                onClick={() => setCurrentStep(i + 1)}
                className={`h-full rounded-full transition-all ${
                  i + 1 === currentStep
                    ? 'bg-amber-400 ring-2 ring-amber-300/50'
                    : i + 1 < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-800'
                }`}
                title={stepTitles[i]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AnimatePresence mode="wait">
          {/* Step 1 & 2: Teacher Input */}
          {(currentStep === 1 || currentStep === 2) && (
            <motion.div
              key="step-1-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md"
            >
              <div className="flex items-center gap-3 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Step {currentStep}: Teacher Desk
                </span>
                <span>Classroom Curriculum Initiation</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3">
                Teacher Shalini Initiates EVS Lesson: &quot;Water Cycle&quot;
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Class / Grade:</span>
                  <span className="text-slate-800 font-bold text-sm">Class 4 Primary</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Subject:</span>
                  <span className="text-slate-800 font-bold text-sm">Environmental Studies</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Target Language:</span>
                  <span className="text-emerald-700 font-bold text-sm">हिन्दी &amp; ᱥᱟᱱᱛᱟᱲᱤ</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-sm">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                  Teacher Voice / Text Prompt:
                </span>
                <p className="font-semibold text-slate-900 text-base">
                  &ldquo;Explain the water cycle to Class 4 children using local village surroundings in Ormanjhi, Ranchi.&rdquo;
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  id="demo-step1-advance"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <span>Trigger AI Pedagogy Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3, 4, 5: AI Context, Simplification & Vernacular Adaptation */}
          {currentStep >= 3 && currentStep <= 5 && (
            <motion.div
              key="step-3-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Step {currentStep}: AI Vernacular Pedagogy Engine Active</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">
                    1. Curriculum Context Recognized
                  </h3>
                  <p className="text-sm font-semibold text-slate-800">
                    JAC / JCERT Class 4 Chapter 7: &quot;Jal Hai Toh Kal Hai&quot; (Water is Life).
                    Key learning target: Evaporation, Condensation, Precipitation, Collection.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <h3 className="text-xs font-bold uppercase text-indigo-700 mb-1">
                    2. Cognitive Simplification for Age 9
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    Jargon discarded: &quot;Latent heat of vaporization&quot; → Adapted to: &quot;Sunshine warms the village pond just like heat from a chulha stove.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <h3 className="text-xs font-bold uppercase text-emerald-800 mb-1">
                    3. Dual Vernacular Generation (Hindi + Santhali)
                  </h3>
                  <p className="text-sm text-slate-900 font-bold mb-2">
                    हिन्दी: &quot;धूप से नदी का पानी भाप बनकर ऊपर उठता है और ठंडा होकर बादल बन जाता है।&quot;
                  </p>
                  <p className="text-sm text-emerald-950 font-bold">
                    ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki): &quot;ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱛᱮ ᱜᱟᱰᱟ ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹᱜ-ᱟ ᱟᱨ ᱪᱮᱛᱟᱱ ᱨᱮ ᱨᱤᱢᱤᱞ ᱵᱮᱱᱟᱣᱜ-ᱟ᱾&quot;
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="demo-step3-advance"
                  onClick={() => setCurrentStep(6)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Introduce Sathi Teaching Mascot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6, 7, 8: Sathi Character & Automatic Animation Engine */}
          {currentStep >= 6 && currentStep <= 8 && (
            <motion.div
              key="step-6-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0">
                  <AICharacter
                    state="explaining"
                    speechText="Let us watch the magical journey of water right here in Jharkhand!"
                    vernacularSpeechText="ᱫᱮᱞᱟ ᱵᱚ ᱧᱮᱞᱟ ᱟᱵᱚᱣᱟᱜ ᱥᱩᱵᱚᱨᱱᱚᱨᱮᱠᱷᱟ ᱜᱟᱰᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱪᱮᱫ ᱞᱮᱠᱟ ᱥᱮᱨᱢᱟ ᱛᱮ ᱨᱟᱠᱟᱵ-ᱟ!"
                    language="hi"
                    size="md"
                  />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                    Step {currentStep}: Visual Animation Assembly
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2 mb-2">
                    Procedural Multi-Scene Animation Generated
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    The engine automatically mapped the concepts into 5 visual scenes: River Warming → Rising Vapor → Badal Bhai Condensation → Rain over Sal Trees → Pond Collection!
                  </p>
                  <button
                    id="demo-step6-advance"
                    onClick={() => setCurrentStep(9)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Student Voice Interaction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Animation Canvas Running */}
              <DynamicAnimationCanvas project={DEMO_WATER_CYCLE_LESSON.animationProject} activeLanguage="hi" />
            </motion.div>
          )}

          {/* Step 9 & 10: Student Voice Question & AI Tutor Clarification */}
          {(currentStep === 9 || currentStep === 10) && (
            <motion.div
              key="step-9-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Step {currentStep}: Real-Time Vernacular Voice Query</span>
              </div>

              {/* Student Query Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  👦🏽
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-900 block mb-0.5">
                    Birsa (Student, Class 4):
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    &ldquo;Sathi, what is evaporation? I did not understand why the river does not dry up completely.&rdquo;
                  </p>
                </div>
              </div>

              {/* AI Sathi Answer */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-4">
                <AICharacter state="explaining" size="sm" showSpeechBubble={false} />
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                    Sathi AI Pedagogy Response (Simplified Analogy):
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium mb-2">
                    &ldquo;Birsa, think of when mother leaves a wet towel on the courtyard wire under the hot sun. Within 2 hours, it becomes dry! The water did not disappear into nothing; it turned into light, invisible vapor and floated up to prepare the next rain!&rdquo;
                  </p>
                  <p className="text-xs text-emerald-950 font-bold bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ: ᱡᱮᱞᱮᱠᱟ ᱚᱫᱟ ᱞᱩᱜᱽᱲᱤ ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱛᱮ ᱨᱚᱦᱚᱲᱚᱜ-ᱟ, ᱚᱱᱠᱟ ᱜᱮ ᱜᱟᱰᱟ ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹ ᱞᱮᱠᱟ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ᱾
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  id="demo-step9-advance"
                  onClick={() => setCurrentStep(11)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Start Adaptive Comprehension Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 11 & 12: Quiz & Misconception Occurrence */}
          {(currentStep === 11 || currentStep === 12) && (
            <motion.div
              key="step-11-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Step {currentStep}: Adaptive Quiz &amp; Misconception Check</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Question 2 of 4</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 text-base mb-1">
                  What are clouds in the sky actually made of?
                </p>
                <p className="text-xs text-slate-600 mb-4">
                  (आसमान में तैरते बादल वास्तव में किस चीज़ से बने होते हैं?)
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 0, text: 'A) White cotton candy / रुई (Cotton candy)' },
                    { id: 1, text: 'B) Smoke from village kitchens only (सिर्फ चूल्हे का धुआं)' },
                    { id: 2, text: 'C) Billions of tiny cooled water droplets (ठंडी पानी की नन्हीं बूंदें)' },
                    { id: 3, text: 'D) Thick white paint (सफेद रंग)' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      id={`demo-quiz-opt-${option.id}`}
                      type="button"
                      onClick={() => handleFirstQuizSubmit(option.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        quizSelectedAnswer === option.id
                          ? option.id === 2
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                            : 'bg-rose-100 border-rose-500 text-rose-950 font-bold'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{option.text}</span>
                      {quizSelectedAnswer === option.id && option.id === 0 && (
                        <span className="text-xs font-bold text-rose-600 uppercase">Selected (Misconception)</span>
                      )}
                    </button>
                  ))}
                </div>

                {!isQuizSubmitted && (
                  <p className="text-[11px] text-slate-400 mt-3 italic">
                    💡 Click Option A (&quot;Cotton candy&quot;) to trigger the intentional SIH Misconception Diagnostic Demonstration!
                  </p>
                )}
              </div>

              {currentStep === 12 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-rose-800">
                    ⚠️ Misconception Detected: Visual Metaphor Confusion
                  </span>
                  <p>
                    Student selected Option A. The system recognized that the child judged clouds purely by their visual fluffy appearance rather than molecular state.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      id="demo-step12-advance"
                      onClick={() => setCurrentStep(13)}
                      className="px-4 py-2 rounded-xl bg-rose-700 text-white font-bold text-xs"
                    >
                      Diagnose &amp; Adapt Next Step →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 13 & 14 & 15: Misconception Remediation via Chulha Metaphor */}
          {currentStep >= 13 && currentStep <= 15 && (
            <motion.div
              key="step-13-15"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6"
            >
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Step {currentStep}: AI Adaptive Remediation</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <AICharacter
                  state="encouraging"
                  speechText="No problem, Birsa! That is a very common thought because clouds look so soft. Let us look inside a kitchen lid!"
                  vernacularSpeechText="ᱪᱤᱱᱛᱟᱹ ᱨᱮᱱᱟᱜ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱹᱱᱩᱜ-ᱟ! ᱫᱮᱞᱟ ᱪᱩᱞᱦᱟᱹ ᱪᱮᱛᱟᱱ ᱰᱷᱟᱹᱠᱱᱤ ᱨᱮᱱᱟᱜ ᱩᱫᱟᱹᱦᱚᱨᱚᱱ ᱧᱮᱞ ᱢᱮ᱾"
                  size="md"
                />
                <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                  <h4 className="font-bold text-amber-950 text-base">
                    The &quot;Boiling Kettle Lid&quot; Micro-Analogy
                  </h4>
                  <p className="leading-relaxed">
                    When water boils on the chulha, you cannot see cotton or sugar. Yet, when you hold a cold metal plate over the steam, cold drops of water collect on it!
                  </p>
                  <p className="font-bold text-emerald-800">
                    High in the sky, it is freezing cold. The invisible vapor cools and hugs together, forming billions of tiny water droplets. That is what a cloud truly is!
                  </p>
                </div>
              </div>

              {/* Verification Question */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-3">
                  Let us try again: What actually forms clouds when vapor cools?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="demo-retry-opt-wrong"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 opacity-60"
                  >
                    Cotton from trees
                  </button>
                  <button
                    id="demo-retry-opt-correct"
                    onClick={() => handleRetrySubmit(1)}
                    className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition-all text-left flex items-center justify-between"
                  >
                    <span>Tiny cooled water droplets (Condensation)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 16 & 17: Success & Final Progress Update */}
          {currentStep >= 16 && (
            <motion.div
              key="step-16-17"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase">
                Step 17: Learning Loop Complete!
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                Shabash! Concept Mastery Achieved! 🎉
              </h2>

              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                The pedagogical loop successfully adapted to Birsa&apos;s initial misconception, resolved it through an agrarian rural analogy, verified the concept, and awarded XP!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <div>
                  <span className="text-[11px] text-emerald-700 font-bold block">XP Gained</span>
                  <span className="text-xl font-black text-emerald-900">+150 XP</span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-700 font-bold block">Mastery Score</span>
                  <span className="text-xl font-black text-emerald-900">100%</span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-700 font-bold block">Streak</span>
                  <span className="text-xl font-black text-emerald-900">5 Days 🔥</span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-700 font-bold block">Badge Unlocked</span>
                  <span className="text-xl font-black text-emerald-900">Quiz Veera 🏆</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  id="demo-finish-student-btn"
                  onClick={() => onNavigate('/student')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Go to Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="demo-finish-teacher-btn"
                  onClick={() => onNavigate('/teacher')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs"
                >
                  <span>View Teacher Class Analytics</span>
                </button>
                <button
                  id="demo-finish-restart-btn"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Restart Walkthrough
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
