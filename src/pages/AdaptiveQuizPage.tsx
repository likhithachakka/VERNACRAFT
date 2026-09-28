import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  Lightbulb,
  Volume2,
  VolumeX,
  Cpu,
  Globe2,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { AICharacter } from '../components/AICharacter';
import { Quiz, QuizQuestion } from '../types';
import { DEMO_QUIZ_WATER_CYCLE } from '../data/demoData';
import confetti from 'canvas-confetti';

interface AdaptiveQuizPageProps {
  quizId?: string;
  onNavigate: (path: string) => void;
}

export const AdaptiveQuizPage: React.FC<AdaptiveQuizPageProps> = ({
  quizId = 'quiz-water-cycle-01',
  onNavigate,
}) => {
  const [quiz, setQuiz] = useState<Quiz>(DEMO_QUIZ_WATER_CYCLE);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [currentSelectedOpt, setCurrentSelectedOpt] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioLang, setActiveAudioLang] = useState('hi');

  useEffect(() => {
    async function load() {
      const q = await ApiService.getQuiz(quizId);
      if (q) setQuiz(q);
    }
    load();
  }, [quizId]);

  const currentQ: QuizQuestion = quiz.questions[currentQIndex] || quiz.questions[0];

  const handleSelectOption = (idx: number) => {
    if (showAnswerFeedback) return;
    setCurrentSelectedOpt(idx);
  };

  const handleSubmitQuestion = () => {
    if (currentSelectedOpt === null) return;

    setShowAnswerFeedback(true);
    const isCorrect = currentSelectedOpt === currentQ.correctAnswer;

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [currentQ.id]: currentSelectedOpt,
    };
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = async () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setCurrentSelectedOpt(null);
      setShowAnswerFeedback(false);
    } else {
      // Quiz complete: submit
      const finalAnswers = {
        ...selectedAnswers,
        ...(currentSelectedOpt !== null ? { [currentQ.id]: currentSelectedOpt } : {}),
      };
      const result = await ApiService.submitQuiz({
        studentId: 'student-birsa-01',
        quizId: quiz.id,
        answers: finalAnswers,
      });
      setAttemptResult(result.attempt);
      setIsCompleted(true);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setCurrentSelectedOpt(null);
    setShowAnswerFeedback(false);
    setIsCompleted(false);
    setAttemptResult(null);
    setIsPlayingAudio(false);
    SpeechService.stopSpeaking();
  };

  const handleReadAloud = () => {
    if (isPlayingAudio) {
      SpeechService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak =
      activeAudioLang === 'en'
        ? currentQ.prompt
        : currentQ.promptVernacular || currentQ.prompt;

    setIsPlayingAudio(true);
    SpeechService.speak(
      textToSpeak,
      activeAudioLang,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const isCurrentCorrect = currentSelectedOpt === currentQ.correctAnswer;
  const misconceptionNote =
    currentSelectedOpt !== null && !isCurrentCorrect
      ? currentQ.misconceptionGuidance?.[String(currentSelectedOpt)] ||
        'Take a moment to relate this to the everyday village example.'
      : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive Mother-Tongue Assessment</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Bhashini Voice NLTM
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Quiz: {quiz.topic}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Voice Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={activeAudioLang}
                onChange={(e) => setActiveAudioLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                title="Select Voice-over Language"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="sat">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="en">English</option>
              </select>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
              {currentQIndex + 1} / {quiz.questions.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!isCompleted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            {/* Question Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
              {quiz.questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-all ${
                    i === currentQIndex
                      ? 'bg-amber-400'
                      : i < currentQIndex
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Concept: {currentQ.conceptTested}</span>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{quiz.difficulty} Level</span>
                  <button
                    type="button"
                    onClick={handleReadAloud}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    title="Listen to question read aloud in mother tongue"
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Stop' : 'Bhashini Voice'}</span>
                  </button>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.prompt}
              </h2>
              {currentQ.promptVernacular && (
                <p className="text-sm font-semibold text-emerald-800 mt-2 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  {currentQ.promptVernacular}
                </p>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-3">
              {(currentQ.options || []).map((opt, idx) => {
                const isSelected = currentSelectedOpt === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let optClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                if (isSelected && !showAnswerFeedback) {
                  optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                } else if (showAnswerFeedback) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                  } else {
                    optClass = 'opacity-40 border-slate-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt}</span>
                    {showAnswerFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {showAnswerFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sathi Misconception or Praise Feedback */}
            {showAnswerFeedback && (
              <div
                className={`p-4 rounded-2xl border ${
                  isCurrentCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AICharacter
                    state={isCurrentCorrect ? 'celebrating' : 'encouraging'}
                    size="sm"
                    showSpeechBubble={false}
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {isCurrentCorrect ? '🎉 Shabash! Correct!' : '💡 Gentle Sathi Hint:'}
                    </span>
                    <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                      {isCurrentCorrect
                        ? currentQ.vernacularExplanation
                        : misconceptionNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex justify-end">
              {!showAnswerFeedback ? (
                <button
                  id="quiz-check-answer-btn"
                  type="button"
                  onClick={handleSubmitQuestion}
                  disabled={currentSelectedOpt === null}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Check My Answer</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="quiz-next-question-btn"
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>
                    {currentQIndex < quiz.questions.length - 1
                      ? 'Next Question →'
                      : 'Finish Quiz & View Score 🎉'}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results Card */
          <div className="bg-white rounded-3xl p-8 border border-emerald-300 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Assessment Complete
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                Great Work, Birsa! 🌟
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                You scored {attemptResult?.score || quiz.questions.length} out of {quiz.questions.length}!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">XP Earned</span>
                <span className="text-base font-black text-emerald-700">
                  +{(attemptResult?.score || 3) * 50} XP
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Streak</span>
                <span className="text-base font-black text-amber-600">5 Days 🔥</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Mastery Status</span>
                <span className="text-base font-black text-indigo-700">Mastered</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('/student')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>Back to Lessons</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
