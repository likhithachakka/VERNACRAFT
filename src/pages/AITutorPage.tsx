import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Loader2,
  Languages,
  Sliders,
  Radio,
  FileAudio,
} from 'lucide-react';
import { AICharacter } from '../components/AICharacter';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { AICharacterState } from '../types';
import { getLanguage, SUPPORTED_LANGUAGES } from '../data/languages';
import { LiveVoiceDialog } from '../components/LiveVoiceDialog';
import { AudioTranscriberModal } from '../components/AudioTranscriberModal';

export const AITutorPage: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{
      sender: 'student' | 'sathi';
      text: string;
      vernacularText?: string;
      analogy?: string;
      timestamp: string;
    }>
  >([
    {
      sender: 'sathi',
      text: "Johar Birsa! I am Sathi, your learning friend. What would you like to explore today? You can speak or type in your mother tongue!",
      vernacularText: "ᱡᱚᱦᱟᱨ ᱵᱤᱨᱥᱟ! ᱤᱧ ᱫᱚ ᱥᱟᱛᱷᱤ ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱛᱮᱦᱮᱧ ᱪᱮᱫ ᱵᱚ ᱪᱮᱫᱚᱜ-ᱟ? ᱟᱢᱟᱜ ᱟᱭᱳ ᱟᱲᱟᱝ ᱛᱮ ᱠᱩᱞᱤᱧ ᱢᱮ!",
      timestamp: 'Just now',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('hi');
  const [confusionLevel, setConfusionLevel] = useState<number>(1);
  const [characterState, setCharacterState] = useState<AICharacterState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isTranscriberOpen, setIsTranscriberOpen] = useState(false);

  const activeLangObj = getLanguage(activeLanguage);

  const samplePrompts = [
    'Why does wet clothes dry on the wire in the sun?',
    'Are clouds made of cotton candy or water?',
    'Why do plants need sunlight to make food?',
    'How do we share 1 roti equally among 4 children?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim() || isThinking) return;

    const userMsg = {
      sender: 'student' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);
    setCharacterState('thinking');

    try {
      const response = await ApiService.askTutor({
        studentMessage: messageText,
        currentTopic: 'Nature and Everyday Science',
        grade: 4,
        language: activeLanguage,
        confusionLevel,
      });

      const sathiMsg = {
        sender: 'sathi' as const,
        text: response.tutorSpeech,
        vernacularText: response.vernacularSpeech,
        analogy: response.suggestedAnalogy,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sathiMsg]);
      setCharacterState(response.characterEmotion || 'explaining');

      // Speak response automatically
      SpeechService.speak(
        response.vernacularSpeech || response.tutorSpeech,
        activeLanguage,
        () => setCharacterState('idle'),
        () => setCharacterState('idle')
      );
    } catch (err) {
      console.error('Tutor error:', err);
      setCharacterState('idle');
    } finally {
      setIsThinking(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      speechRecognizer?.stop();
      setIsListening(false);
      setCharacterState('idle');
      return;
    }

    setCharacterState('listening');
    setIsListening(true);

    const rec = SpeechService.listen(
      activeLanguage,
      (result) => {
        setInputVal(result.transcript);
        if (result.isFinal) {
          setIsListening(false);
          setCharacterState('thinking');
          handleSendMessage(result.transcript);
        }
      },
      (error) => {
        console.warn('Voice error:', error);
        setIsListening(false);
        setCharacterState('idle');
      },
      () => {
        setIsListening(false);
        setCharacterState('idle');
      }
    );

    setSpeechRecognizer(rec);
  };

  const handleReplaySpeech = (text: string, index: number) => {
    if (playingMessageIndex === index) {
      SpeechService.stopSpeaking();
      setPlayingMessageIndex(null);
      setCharacterState('idle');
      return;
    }
    SpeechService.stopSpeaking();
    setPlayingMessageIndex(index);
    setCharacterState('explaining');
    SpeechService.speak(
      text,
      activeLanguage,
      () => {
        setPlayingMessageIndex(null);
        setCharacterState('idle');
      },
      () => {
        setPlayingMessageIndex(null);
        setCharacterState('idle');
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Voice &amp; Mother-Tongue Companion</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Bhashini AI NLTM: 16f0...fb76
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Sathi AI Mother-Tongue Tutor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ask any question in your mother tongue. Sathi will explain using everyday village examples!
            </p>
          </div>

          {/* Controls: Language, Live Voice Call, and Confusion Level */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="tutor-live-voice-btn"
              type="button"
              onClick={() => setIsLiveVoiceOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Live Voice Call (gemini-3.8-live)</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="tutor-lang-select"
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Confusion Level Slider Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>How confused do you feel?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {[
              { level: 1, label: 'Curious 🌱', desc: 'Standard story' },
              { level: 2, label: 'A bit confused 🧐', desc: 'Slower with analogy' },
              { level: 3, label: 'Completely stuck! 🆘', desc: 'Village kitchen metaphor' },
            ].map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() => setConfusionLevel(item.level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none ${
                  confusionLevel === item.level
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sathi Mascot & Emotion Status */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-between">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Teaching Mascot
              </span>
              <AICharacter
                state={characterState}
                speechText={
                  characterState === 'thinking'
                    ? 'Connecting your question to a village story...'
                    : characterState === 'listening'
                    ? 'Listening carefully to your voice...'
                    : 'I love curious minds! Ask me anything.'
                }
                language={activeLanguage}
                size="md"
              />
            </div>

            <div className="w-full mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-700">
                🗣️ Spoken Language: {activeLangObj.nativeName}
              </p>
              <p className="text-[11px]">
                {activeLangObj.speechToTextSupported
                  ? '🎤 Native Speech Recognition Active'
                  : 'ℹ️ Visual & Text Supported for this language'}
              </p>
            </div>
          </div>

          {/* Right Column: Chat History & Input */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col h-[520px]">
            {/* Scrollable Conversation */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    m.sender === 'student' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'student'
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200'
                    }`}
                  >
                    {m.sender === 'sathi' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200/70">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <span>Sathi (सार्थी)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleReplaySpeech(m.vernacularText || m.text, i)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-slate-300 shadow-2xs transition-all cursor-pointer"
                          title="Listen with Bhashini Vernacular Voice"
                        >
                          {playingMessageIndex === i ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-600" />
                              <span className="text-rose-600">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-emerald-700" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {m.vernacularText && (
                      <p className="font-bold text-emerald-950 mb-1 leading-snug">
                        {m.vernacularText}
                      </p>
                    )}
                    <p className={m.sender === 'student' ? 'text-white' : 'text-slate-700'}>
                      {m.text}
                    </p>
                    {m.analogy && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 text-xs text-amber-900 font-medium">
                        💡 <span className="font-bold">Everyday Metaphor:</span> {m.analogy}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sathi is thinking in mother tongue...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompt Chips */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar with Mic & Send */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-2 border-t border-slate-100 flex items-center gap-2"
            >
              <button
                id="tutor-mic-btn"
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 border-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title={isListening ? 'Stop listening' : 'Quick listen'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Transcribe Audio with gemini-3.5-transcribe */}
              <button
                id="tutor-transcribe-modal-btn"
                type="button"
                onClick={() => setIsTranscriberOpen(true)}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors cursor-pointer"
                title="Transcribe Voice with Gemini 3.5 Transcribe"
              >
                <FileAudio className="w-4 h-4" />
              </button>

              <input
                id="tutor-chat-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Sathi in English, Hindi, or Mother Tongue..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                id="tutor-send-btn"
                type="submit"
                disabled={!inputVal.trim() || isThinking}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Live Voice Dialog with gemini-3.8-live */}
      <LiveVoiceDialog
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        language={activeLanguage}
        studentName="Birsa"
      />

      {/* Audio Transcriber Modal with gemini-3.5-transcribe */}
      <AudioTranscriberModal
        isOpen={isTranscriberOpen}
        onClose={() => setIsTranscriberOpen(false)}
        defaultLanguage={activeLanguage}
        onTranscribeComplete={(text) => {
          setInputVal(text);
        }}
      />
    </div>
  );
};
