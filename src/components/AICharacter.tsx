import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { AICharacterState } from '../types';
import { SpeechService } from '../services/speech';

interface AICharacterProps {
  state: AICharacterState;
  speechText?: string;
  vernacularSpeechText?: string;
  language?: string;
  onInteracted?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
}

export const AICharacter: React.FC<AICharacterProps> = ({
  state,
  speechText,
  vernacularSpeechText,
  language = 'hi',
  onInteracted,
  size = 'md',
  showSpeechBubble = true,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      SpeechService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = vernacularSpeechText || speechText;
    if (!textToSpeak) return;

    setIsPlayingAudio(true);
    SpeechService.speak(
      textToSpeak,
      language,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 90, height: 90 };
      case 'lg':
        return { width: 170, height: 170 };
      default:
        return { width: 130, height: 130 };
    }
  };

  const { width, height } = getDimensions();

  // Color theme based on state
  const stateColor = {
    idle: '#3b82f6',
    listening: '#10b981',
    thinking: '#8b5cf6',
    explaining: '#f59e0b',
    asking: '#ec4899',
    encouraging: '#06b6d4',
    celebrating: '#eab308',
  }[state] || '#3b82f6';

  const stateLabel = {
    idle: 'Sathi (Ready to help)',
    listening: 'Listening to your voice...',
    thinking: 'Thinking in Mother Tongue...',
    explaining: 'Explaining with an analogy...',
    asking: 'Testing your understanding...',
    encouraging: "You're doing great! Keep going!",
    celebrating: 'Shabash! Concept Mastered! 🎉',
  }[state] || 'Sathi';

  return (
    <div
      id="ai-teaching-character-container"
      onClick={onInteracted}
      className="relative flex flex-col items-center cursor-pointer select-none group"
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (speechText || vernacularSpeechText) && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-3 max-w-xs md:max-w-md bg-white border-2 border-emerald-500/30 shadow-lg rounded-2xl p-4 text-slate-800 text-sm relative z-20"
        >
          {vernacularSpeechText && (
            <p className="font-semibold text-emerald-800 leading-relaxed mb-1.5 text-base">
              {vernacularSpeechText}
            </p>
          )}
          {speechText && (
            <p className="text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-1.5">
              {speechText}
            </p>
          )}

          {/* Audio trigger button */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Sathi AI Pedagogy
            </span>
            <button
              id="ai-character-speech-button"
              type="button"
              onClick={handleSpeak}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors"
              title="Listen to pronunciation"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Listen Voice</span>
                </>
              )}
            </button>
          </div>

          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-emerald-500/30 transform rotate-45" />
        </motion.div>
      )}

      {/* Sathi Character SVG Mascot */}
      <motion.div
        animate={
          state === 'listening'
            ? { scale: [1, 1.06, 1], transition: { repeat: Infinity, duration: 1.6 } }
            : state === 'thinking'
            ? { rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 2 } }
            : state === 'explaining'
            ? { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2.2 } }
            : state === 'celebrating'
            ? { y: [0, -12, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } }
            : { y: [0, -3, 0], transition: { repeat: Infinity, duration: 3.5 } }
        }
        className="relative"
      >
        {/* Halo Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-500"
          style={{ backgroundColor: stateColor }}
        />

        <svg
          width={width}
          height={height}
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-md"
        >
          {/* Outer Ear / Antenna */}
          <circle cx="70" cy="18" r="7" fill={stateColor} />
          <path d="M70 25 V38" stroke={stateColor} strokeWidth="3" strokeLinecap="round" />

          {/* Head Body */}
          <rect
            x="24"
            y="38"
            width="92"
            height="76"
            rx="32"
            fill="#ffffff"
            stroke={stateColor}
            strokeWidth="4"
          />

          {/* Cheeks */}
          <circle cx="38" cy="82" r="7" fill="#fecdd3" opacity="0.8" />
          <circle cx="102" cy="82" r="7" fill="#fecdd3" opacity="0.8" />

          {/* Eyes depending on state */}
          {state === 'thinking' ? (
            <>
              {/* Thinking swirly / looking up eyes */}
              <circle cx="48" cy="66" r="6" fill="#1e293b" />
              <circle cx="92" cy="66" r="6" fill="#1e293b" />
              <path d="M44 58 Q48 54 54 58" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M86 58 Q92 54 98 58" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'celebrating' ? (
            <>
              {/* Happy squinting closed curve eyes */}
              <path d="M42 68 Q49 60 56 68" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <path d="M84 68 Q91 60 98 68" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : state === 'listening' ? (
            <>
              {/* Alert wide attentive eyes */}
              <circle cx="48" cy="68" r="8" fill="#0f172a" />
              <circle cx="92" cy="68" r="8" fill="#0f172a" />
              <circle cx="51" cy="66" r="3" fill="#ffffff" />
              <circle cx="95" cy="66" r="3" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Standard warm friendly eyes */}
              <circle cx="48" cy="68" r="7" fill="#1e293b" />
              <circle cx="92" cy="68" r="7" fill="#1e293b" />
              <circle cx="50" cy="66" r="2.5" fill="#ffffff" />
              <circle cx="94" cy="66" r="2.5" fill="#ffffff" />
            </>
          )}

          {/* Mouth depending on state */}
          {state === 'explaining' ? (
            <ellipse cx="70" cy="88" rx="8" ry="6" fill="#0f172a" />
          ) : state === 'asking' ? (
            <circle cx="70" cy="88" r="5" fill="#0f172a" />
          ) : state === 'celebrating' ? (
            <path
              d="M56 84 Q70 102 84 84 Z"
              fill="#ef4444"
              stroke="#991b1b"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M58 84 Q70 94 82 84"
              stroke="#334155"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Vernacular Tribal Shawl / Stole motif */}
          <path
            d="M36 108 C46 116 94 116 104 108"
            stroke="#059669"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="70" cy="112" r="3.5" fill="#d97706" />
        </svg>

        {/* State Badge Pill */}
        <div
          className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white tracking-wide shadow-sm flex items-center gap-1 mx-auto w-fit"
          style={{ backgroundColor: stateColor }}
        >
          {state === 'asking' && <MessageCircleQuestion className="w-3 h-3" />}
          {stateLabel}
        </div>
      </motion.div>
    </div>
  );
};
