import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Languages,
} from 'lucide-react';
import { AnimationProject, AnimationScene, AnimationObject, AnimationCharacter } from '../types';
import { SpeechService } from '../services/speech';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import confetti from 'canvas-confetti';

interface DynamicAnimationCanvasProps {
  project: AnimationProject;
  activeLanguage?: string;
  onSceneComplete?: (sceneIndex: number) => void;
  onProjectComplete?: () => void;
}

export const DynamicAnimationCanvas: React.FC<DynamicAnimationCanvasProps> = ({
  project,
  activeLanguage = 'hi',
  onSceneComplete,
  onProjectComplete,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(activeLanguage);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe scene lookup with bound protection
  const totalScenes = project?.scenes?.length || 0;
  const safeIndex = totalScenes > 0 ? Math.min(Math.max(0, currentSceneIndex), totalScenes - 1) : 0;
  const scene: AnimationScene = (project?.scenes && project.scenes[safeIndex]) || {
    id: 'empty-scene',
    title: 'Loading Scene',
    duration: 5,
    background: 'village-field',
    objects: [],
    characters: [],
    narration: [{ language: selectedLanguage, text: 'Preparing lesson animation...' }],
    captions: 'Preparing lesson animation...',
  };

  // Narration text for active language
  const narrationObj =
    scene.narration?.find((n) => n.language === selectedLanguage) ||
    scene.narration?.find((n) => n.language === 'en') ||
    scene.narration?.[0];

  const currentNarration = narrationObj?.text || scene.captions || '';

  // Sync selected language if prop changes (only if different)
  useEffect(() => {
    setSelectedLanguage((prev) => (prev !== activeLanguage ? activeLanguage : prev));
  }, [activeLanguage]);

  // Reset to first scene when a different animation project is loaded
  useEffect(() => {
    setCurrentSceneIndex(0);
    setIsPlaying(true);
    setSelectedAnswerIndex(null);
    setShowFeedback(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (answerTimeoutRef.current) {
      clearTimeout(answerTimeoutRef.current);
      answerTimeoutRef.current = null;
    }
  }, [project.id]);

  const handleNextScene = () => {
    setCurrentSceneIndex((prevIdx) => {
      const maxIdx = (project.scenes?.length || 1) - 1;
      if (prevIdx < maxIdx) {
        const nextIdx = prevIdx + 1;
        onSceneComplete?.(prevIdx);
        return nextIdx;
      } else {
        setIsPlaying(false);
        onProjectComplete?.();
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        } catch (_) {}
        return prevIdx;
      }
    });
  };

  // Audio narration and auto-advance timer on scene change
  useEffect(() => {
    SpeechService.stopSpeaking();
    setSelectedAnswerIndex(null);
    setShowFeedback(false);

    if (isPlaying && !isAudioMuted && currentNarration) {
      SpeechService.speak(
        currentNarration,
        selectedLanguage,
        () => {},
        () => {}
      );
    }

    // Clear any previous auto-advance timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Auto-advance scene timer if not paused at interaction point
    if (isPlaying && !scene?.interactionPoint) {
      const durationMs = Math.max(3000, (scene?.duration || 8) * 1000);
      timerRef.current = setTimeout(() => {
        handleNextScene();
      }, durationMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current);
        answerTimeoutRef.current = null;
      }
      SpeechService.stopSpeaking();
    };
  }, [safeIndex, isPlaying, isAudioMuted, selectedLanguage, scene?.id, project.id]);

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleRestart = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (answerTimeoutRef.current) {
      clearTimeout(answerTimeoutRef.current);
      answerTimeoutRef.current = null;
    }
    setCurrentSceneIndex(0);
    setIsPlaying(true);
    setSelectedAnswerIndex(null);
    setShowFeedback(false);
  };

  const handleAnswerClick = (idx: number) => {
    setSelectedAnswerIndex(idx);
    setShowFeedback(true);
    const isCorrect = idx === scene.interactionPoint?.correctIndex;
    if (isCorrect) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (_) {}
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current);
      }
      answerTimeoutRef.current = setTimeout(() => {
        handleNextScene();
      }, 2500);
    }
  };

  // Background visual themes
  const renderBackground = (bg: string) => {
    switch (bg) {
      case 'sky-river':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 overflow-hidden">
            {/* Distant Hills of Jharkhand (Parasnath/Chota Nagpur) */}
            <svg
              className="absolute bottom-16 left-0 right-0 w-full h-36 opacity-40"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,200 L0,110 Q200,40 400,120 T800,90 Q900,60 1000,100 L1000,200 Z"
                fill="#047857"
              />
            </svg>
            {/* River Subarnarekha */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-24"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 C250,90 450,10 700,60 C850,90 950,40 1000,50 L1000,120 L0,120 Z"
                fill="#0284c7"
                opacity="0.85"
              />
              <path
                d="M0,70 C300,30 600,100 1000,60 L1000,120 L0,120 Z"
                fill="#38bdf8"
                opacity="0.6"
              />
            </svg>
          </div>
        );
      case 'farm':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-emerald-100 to-emerald-300 overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-32"
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
            >
              <rect x="0" y="40" width="1000" height="80" fill="#78350f" opacity="0.8" />
              <path
                d="M0,40 Q250,10 500,40 T1000,40 L1000,120 L0,120 Z"
                fill="#15803d"
              />
            </svg>
          </div>
        );
      case 'kitchen':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-200 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-amber-800/20 border-t-4 border-amber-800/40" />
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-48 h-10 bg-stone-300 rounded-t-lg shadow-inner" />
          </div>
        );
      case 'universe':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0)_1px)] bg-[size:24px_24px] opacity-30" />
          </div>
        );
      case 'wind-farm':
      case 'wind':
      case 'energy':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-300 overflow-hidden">
            {/* Rolling green hills for wind farms */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-44 opacity-80"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,200 L0,120 Q200,60 450,110 T850,70 Q950,50 1000,90 L1000,200 Z"
                fill="#15803d"
              />
              <path
                d="M0,200 L0,150 Q300,100 650,160 Q850,120 1000,140 L1000,200 Z"
                fill="#166534"
              />
            </svg>
            {/* Gentle wind lines in the sky */}
            <div className="absolute top-12 left-0 right-0 flex flex-col gap-6 opacity-30 pointer-events-none">
              <div className="h-0.5 bg-white/70 w-3/4 rounded-full animate-pulse ml-8" />
              <div className="h-0.5 bg-white/70 w-1/2 rounded-full animate-pulse ml-32" />
              <div className="h-0.5 bg-white/70 w-2/3 rounded-full animate-pulse ml-16" />
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200" />
        );
    }
  };

  // Render dynamic animated objects
  const renderObject = (obj: AnimationObject) => {
    const { id, type, label, position, animation, color = '#3b82f6' } = obj;

    const animVariant = {
      evaporate: {
        y: [0, -70],
        opacity: [0.3, 1, 0.2],
        scale: [0.8, 1.3],
        transition: { repeat: Infinity, duration: 3.2, ease: 'easeOut' },
      },
      condense: {
        scale: [0.95, 1.08, 0.95],
        opacity: [0.8, 1, 0.8],
        transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
      },
      rain: {
        y: [0, 90],
        opacity: [0, 1, 0],
        transition: { repeat: Infinity, duration: 1.4, ease: 'linear' },
      },
      float: {
        y: [-4, 4, -4],
        transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
      },
      grow: {
        scale: [0.85, 1.1, 1],
        transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
      },
      pulse: {
        scale: [0.95, 1.1, 0.95],
        transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
      },
      glow: {
        filter: ['drop-shadow(0 0 4px #fbbf24)', 'drop-shadow(0 0 16px #f59e0b)', 'drop-shadow(0 0 4px #fbbf24)'],
        transition: { repeat: Infinity, duration: 2.5 },
      },
      spin: {
        rotate: [0, 360],
        transition: { repeat: Infinity, duration: 8, ease: 'linear' },
      },
      slice: {
        x: id.includes('Left') ? [-6, 0] : [6, 0],
        transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
      },
      idle: {},
    }[animation] || { y: [-3, 3, -3], transition: { repeat: Infinity, duration: 3 } };

    return (
      <motion.div
        key={id}
        animate={animVariant as any}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute flex flex-col items-center select-none pointer-events-none z-10"
      >
        {/* Object Visual Representation */}
        {type === 'sun' && (
          <svg width="74" height="74" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="28" fill="#f59e0b" />
            <circle cx="50" cy="50" r="22" fill="#fbbf24" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="50"
                y1="12"
                x2="50"
                y2="4"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        )}

        {type === 'cloud' && (
          <svg width="110" height="65" viewBox="0 0 120 70" fill={color}>
            <path
              d="M25,55 A20,20 0 0,1 45,25 A25,25 0 0,1 85,25 A20,20 0 0,1 105,55 Z"
              fill={color}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          </svg>
        )}

        {type === 'rain' && (
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((r) => (
              <motion.div
                key={r}
                animate={{ y: [0, 80], opacity: [0, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9 + r * 0.15,
                  delay: r * 0.2,
                  ease: 'linear',
                }}
                className="w-1.5 h-6 bg-sky-500 rounded-full"
              />
            ))}
          </div>
        )}

        {type === 'vapor' && (
          <div className="flex flex-col items-center">
            <svg width="34" height="40" viewBox="0 0 40 50" fill="none">
              <path
                d="M15 45 Q 25 35 15 25 T 15 5"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
            </svg>
          </div>
        )}

        {type === 'plant' && (
          <svg width="70" height="90" viewBox="0 0 80 100" fill="none">
            {/* Stem */}
            <path d="M40 95 L40 45" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
            {/* Leaves */}
            <path d="M40 65 Q15 60 20 40 Q35 48 40 65" fill="#22c55e" />
            <path d="M40 55 Q65 50 60 30 Q45 38 40 55" fill="#16a34a" />
            {/* Flower / Bud */}
            <circle cx="40" cy="38" r="9" fill="#facc15" />
          </svg>
        )}

        {type === 'leaf' && (
          <svg width="60" height="50" viewBox="0 0 60 50" fill={color}>
            <path
              d="M10 25 Q30 5 50 25 Q30 45 10 25"
              fill={color}
              stroke="#15803d"
              strokeWidth="2"
            />
            <line x1="10" y1="25" x2="48" y2="25" stroke="#15803d" strokeWidth="1.5" />
          </svg>
        )}

        {type === 'pizza' && (
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-amber-300 shadow-md flex items-center justify-center font-bold text-amber-900 text-xs">
              {label || '1/2'}
            </div>
          </div>
        )}

        {type === 'water' && (
          <div className="px-5 py-2 rounded-full bg-sky-500/80 backdrop-blur-sm text-white text-xs font-semibold shadow-md">
            💧 {label || 'Water Body'}
          </div>
        )}

        {type === 'arrow' && (
          <div className="flex items-center gap-1 bg-amber-400/90 text-amber-950 px-3 py-1 rounded-full text-xs font-bold shadow-md">
            <span>⚡</span>
            <span>{label}</span>
          </div>
        )}

        {type === 'windmill' && (
          <div className="relative flex flex-col items-center">
            {/* Spinning Blades */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
              className="w-24 h-24 relative flex items-center justify-center -mb-8 z-10"
            >
              {/* Rotor Hub */}
              <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-white shadow-xs z-20" />
              {/* Blade 1 */}
              <div className="absolute top-0 w-3 h-12 bg-white/95 rounded-t-full border border-slate-300 shadow-xs origin-bottom transform -translate-y-2" />
              {/* Blade 2 */}
              <div className="absolute bottom-0 w-3 h-12 bg-white/95 rounded-t-full border border-slate-300 shadow-xs origin-bottom transform rotate-120 -translate-y-2" />
              {/* Blade 3 */}
              <div className="absolute bottom-0 w-3 h-12 bg-white/95 rounded-t-full border border-slate-300 shadow-xs origin-bottom transform rotate-240 -translate-y-2" />
            </motion.div>
            {/* Turbine Tower */}
            <svg width="40" height="85" viewBox="0 0 40 85" fill="none" className="z-0">
              <polygon points="17,0 23,0 28,85 12,85" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="12" y1="85" x2="28" y2="85" stroke="#64748b" strokeWidth="3" />
            </svg>
          </div>
        )}

        {type === 'wind' && (
          <div className="flex flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
              <motion.svg
                key={i}
                width="70"
                height="16"
                viewBox="0 0 70 16"
                fill="none"
                animate={{ x: [-8, 8, -8], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8 + i * 0.3, ease: 'easeInOut' }}
              >
                <path
                  d="M5 8 Q 30 2 45 8 T 65 8"
                  stroke={color || '#38bdf8'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            ))}
          </div>
        )}

        {type === 'generator' && (
          <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-400 text-white shadow-lg flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 text-xs animate-spin">
              ⚙️
            </div>
            <div className="text-left">
              <p className="text-[11px] font-extrabold text-amber-300">Generator / जनरेटर</p>
              <p className="text-[9px] text-slate-300">Kinetic ➔ Electric</p>
            </div>
          </div>
        )}

        {type === 'bulb' && (
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [0.95, 1.1, 0.95], filter: ['drop-shadow(0 0 6px #facc15)', 'drop-shadow(0 0 18px #eab308)', 'drop-shadow(0 0 6px #facc15)'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-12 h-12 rounded-full bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-xl shadow-md"
            >
              💡
            </motion.div>
            <div className="w-4 h-2 bg-slate-400 rounded-b-xs" />
          </div>
        )}

        {type === 'mountain' && (
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
            <polygon points="50,5 95,60 5,60" fill="#047857" opacity="0.85" />
            <polygon points="50,5 65,22 50,26 35,22" fill="#e2e8f0" />
          </svg>
        )}

        {/* Optional Label */}
        {label && type !== 'pizza' && type !== 'water' && type !== 'arrow' && (
          <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[11px] font-medium tracking-wide shadow whitespace-nowrap">
            {label}
          </span>
        )}
      </motion.div>
    );
  };

  // Render character on canvas
  const renderCharacter = (char: AnimationCharacter) => {
    return (
      <motion.div
        key={char.id}
        animate={
          char.action === 'celebrate'
            ? { y: [0, -14, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1 } }
            : { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2.6 } }
        }
        style={{
          left: `${char.position.x}%`,
          top: `${char.position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute flex flex-col items-center select-none z-20 pointer-events-none"
      >
        <div className="relative">
          {char.type === 'sun-character' ? (
            <div className="w-16 h-16 rounded-full bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-lg">
              ☀️
            </div>
          ) : char.type === 'cloud-character' ? (
            <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-md text-xl">
              ☁️
            </div>
          ) : char.type === 'teacher' ? (
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white border-2 border-white shadow-lg flex items-center justify-center text-2xl">
              👩‍🏫
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-amber-600 text-white border-2 border-white shadow-lg flex items-center justify-center text-2xl">
              👦🏽
            </div>
          )}
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-full bg-white/95 text-slate-800 text-[10px] font-bold shadow-sm border border-slate-200">
          {char.name}
        </span>
      </motion.div>
    );
  };

  return (
    <div
      id="automatic-animation-engine-canvas"
      className="relative flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 backdrop-blur-md text-white border-b border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            Vernacraft Auto-Animation Engine
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">|</span>
          <h3 className="text-sm font-medium text-white truncate max-w-xs md:max-w-md">
            {scene.title}
          </h3>
        </div>

        {/* Language selector in canvas */}
        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="animation-narration-language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>

          <button
            id="animation-audio-mute-toggle"
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isAudioMuted
                ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isAudioMuted ? 'Unmute narration' : 'Mute narration'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Stage & Question Side-by-Side Area */}
      <div
        className={`w-full bg-slate-950 ${
          scene.interactionPoint ? 'grid grid-cols-1 lg:grid-cols-12 items-stretch' : ''
        } transition-all duration-300`}
      >
        {/* Left / Primary: Animated Video Canvas */}
        <div
          className={`relative ${
            scene.interactionPoint
              ? 'lg:col-span-7 xl:col-span-7 h-[360px] md:h-[440px] lg:h-[480px] border-b lg:border-b-0 lg:border-r border-slate-800'
              : 'w-full h-[360px] md:h-[440px]'
          } overflow-hidden bg-slate-950 flex flex-col justify-end`}
        >
          {/* Rendered Background */}
          {renderBackground(scene.background)}

          {/* Render Objects */}
          {scene.objects.map(renderObject)}

          {/* Render Characters */}
          {scene.characters.map(renderCharacter)}

          {/* Video Scene Tag when side-by-side with question */}
          {scene.interactionPoint && (
            <div className="absolute top-3 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Animated Video (Scene {safeIndex + 1})
              </span>
            </div>
          )}

          {/* Captions Floating Banner - Inside Video Canvas */}
          <div className="relative bottom-0 inset-x-0 p-3 sm:p-4 z-20 mt-auto pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 border border-slate-700/80 shadow-lg pointer-events-auto">
              <p className="text-xs sm:text-sm font-medium text-emerald-300 leading-relaxed">
                {currentNarration}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive In-Scene Question (Side-by-Side, Zero Overlap!) */}
        {scene.interactionPoint && (
          <div
            id="interactive-scene-question-panel"
            className="lg:col-span-5 xl:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[480px] z-20 border-t lg:border-t-0 border-slate-800"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Quick Check (समझ की जांच)</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Side-by-Side Question
                </span>
              </div>

              <h4 className="text-white font-bold text-sm sm:text-base md:text-lg mb-3.5 leading-snug">
                {scene.interactionPoint.question}
              </h4>

              <div className="space-y-2.5">
                {scene.interactionPoint.options.map((opt, idx) => {
                  const isSelected = selectedAnswerIndex === idx;
                  const isCorrect = idx === scene.interactionPoint?.correctIndex;

                  let btnStyle =
                    'bg-slate-800/90 hover:bg-slate-750 hover:border-slate-600 border-slate-700 text-slate-200 hover:text-white';
                  if (showFeedback && isSelected) {
                    btnStyle = isCorrect
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold ring-2 ring-emerald-500/50'
                      : 'bg-rose-950/90 border-rose-500 text-rose-200 font-medium ring-2 ring-rose-500/50';
                  }

                  return (
                    <button
                      key={idx}
                      id={`scene-option-btn-${idx}`}
                      type="button"
                      onClick={() => handleAnswerClick(idx)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-xs sm:text-sm border transition-all flex items-center justify-between gap-3 shadow-xs cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {showFeedback && isSelected && (
                        <span className="shrink-0 ml-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                  {selectedAnswerIndex === scene.interactionPoint.correctIndex ? (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 font-medium flex items-center gap-2 shadow-xs">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Shabash! Correct answer! Advancing to the next scene...</span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200">
                      <p className="font-bold text-rose-300 mb-0.5">Need a hint?</p>
                      <p className="text-slate-300">💡 {scene.interactionPoint.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls inside Question Panel */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Select answer to progress
              </span>
              <button
                type="button"
                onClick={handleNextScene}
                className="text-slate-400 hover:text-emerald-300 underline font-medium text-[11px] transition-colors cursor-pointer"
              >
                Skip Question &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Controls */}
      <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-3 z-30">
        {/* Progress Bar & Scene markers */}
        <div className="flex items-center gap-2 w-full md:w-1/2">
          {project.scenes.map((s, idx) => (
            <button
              key={s.id}
              id={`timeline-scene-step-${idx}`}
              type="button"
              onClick={() => setCurrentSceneIndex(idx)}
              className={`h-2 rounded-full transition-all flex-1 ${
                idx === currentSceneIndex
                  ? 'bg-emerald-400'
                  : idx < currentSceneIndex
                  ? 'bg-emerald-700'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to Scene ${idx + 1}: ${s.title}`}
            />
          ))}
          <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap ml-2">
            {currentSceneIndex + 1} / {project.scenes.length}
          </span>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="anim-prev-btn"
            type="button"
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            title="Previous scene"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            id="anim-play-pause-btn"
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            id="anim-next-btn"
            type="button"
            onClick={handleNextScene}
            disabled={currentSceneIndex === project.scenes.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            title="Next scene"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            id="anim-restart-btn"
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
