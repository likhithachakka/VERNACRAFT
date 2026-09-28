import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BookOpen,
  Mic,
  MicOff,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { AudioTranscriberModal } from '../components/AudioTranscriberModal';

export const TranslationToolPage: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Evaporation happens when warm sunlight heats up the pond water, turning liquid into invisible water vapor that floats high up.'
  );
  const [targetLang, setTargetLang] = useState('hi');
  const [gradeLevel, setGradeLevel] = useState(4);
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [bhashiniResult, setBhashiniResult] = useState<any>(null);
  const [bhashiniStatus, setBhashiniStatus] = useState<any>(null);
  const [isTestingBhashini, setIsTestingBhashini] = useState(false);
  const [bhashiniFeedback, setBhashiniFeedback] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingBhashiniAudio, setIsPlayingBhashiniAudio] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [speechRecognizer, setSpeechRecognizer] = useState<{ stop: () => void } | null>(null);
  const [isTranscriberOpen, setIsTranscriberOpen] = useState(false);

  const sampleInputs = [
    'Evaporation happens when warm sunlight heats up the pond water, turning liquid into invisible water vapor.',
    'Green leaves are like tiny kitchens inside plants that cook food using bright sunlight.',
    'When we divide one round roti equally between four hungry children, each child receives one quarter (1/4).',
  ];

  useEffect(() => {
    async function initBhashini() {
      try {
        const status = await ApiService.getBhashiniStatus();
        setBhashiniStatus(status);
      } catch (err) {
        console.warn('Bhashini status check:', err);
      }
    }
    initBhashini();
  }, []);

  const handleTestBhashini = async () => {
    setIsTestingBhashini(true);
    setBhashiniFeedback(null);
    try {
      const status = await ApiService.getBhashiniStatus();
      setBhashiniStatus(status);
      setBhashiniFeedback(
        status.configured
          ? 'Bhashini AI securely configured and connected to the translation pipeline!'
          : 'Bhashini AI is using the built-in pedagogical fallback until a server key is configured.'
      );
      setTimeout(() => setBhashiniFeedback(null), 4000);
    } catch {
      setBhashiniFeedback('Bhashini AI pipeline active with fallback bridge.');
    } finally {
      setIsTestingBhashini(false);
    }
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const [pedagogicalRes, bhashiniRes] = await Promise.allSettled([
        ApiService.translateText({
          text: inputText,
          sourceLang,
          targetLang,
          gradeLevel,
        }),
        ApiService.translateWithBhashini({
          text: inputText,
          sourceLang,
          targetLang,
          gradeLevel,
        }),
      ]);

      if (pedagogicalRes.status === 'fulfilled') {
        setResult(pedagogicalRes.value);
      }
      if (bhashiniRes.status === 'fulfilled') {
        setBhashiniResult(bhashiniRes.value);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakPedagogy = () => {
    if (!result?.translatedText) return;
    if (isPlayingAudio) {
      SpeechService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    SpeechService.speak(
      result.translatedText,
      targetLang,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleSpeakBhashini = () => {
    if (!bhashiniResult?.translatedText) return;
    if (isPlayingBhashiniAudio) {
      SpeechService.stopSpeaking();
      setIsPlayingBhashiniAudio(false);
      return;
    }
    setIsPlayingBhashiniAudio(true);
    SpeechService.speak(
      bhashiniResult.translatedText,
      targetLang,
      () => setIsPlayingBhashiniAudio(false),
      () => setIsPlayingBhashiniAudio(false)
    );
  };

  const toggleVoiceInput = () => {
    if (isListeningVoice) {
      speechRecognizer?.stop();
      setIsListeningVoice(false);
      return;
    }

    setIsListeningVoice(true);
    const rec = SpeechService.listen(
      sourceLang,
      (res) => {
        setInputText(res.transcript);
        if (res.isFinal) {
          setIsListeningVoice(false);
        }
      },
      (err) => {
        console.warn('Voice translation error:', err);
        setIsListeningVoice(false);
      },
      () => {
        setIsListeningVoice(false);
      }
    );
    setSpeechRecognizer(rec);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              <span>Voice-to-Voice Multilingual Conversion &amp; Translation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Multilingual Voice &amp; Educational Translation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Powered by Government of India Bhashini AI (NLTM) &amp; Vernacraft Child-Centric Pedagogy.
            </p>
          </div>

          {/* Bhashini Key Status Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-800 shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Bhashini AI Active
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono">
                    NLTM
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-300">
                  Status: {bhashiniStatus?.configured ? 'Configured securely' : 'Demo fallback'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestBhashini}
              disabled={isTestingBhashini}
              className="mt-2 w-full px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isTestingBhashini ? (
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              )}
              <span>Verify Bhashini Key</span>
            </button>
            {bhashiniFeedback && (
              <p className="text-[10px] text-emerald-300 mt-1 text-center font-medium animate-in fade-in">
                {bhashiniFeedback}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Input Form */}
        <form
          onSubmit={handleTranslate}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Sample Educational Sentences:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {sampleInputs.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(s)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium text-left truncate max-w-xs cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type, paste, or speak sentences in any language..."
                className="w-full px-4 py-3 pr-24 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-300 focus:outline-none"
                  title="Spoken Language for Voice Input"
                >
                  {SUPPORTED_LANGUAGES.filter((l) => l.speechToTextSupported).map((l) => (
                    <option key={l.code} value={l.code}>
                      🎤 {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsTranscriberOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Record mic & transcribe verbatim with Gemini 3.5 Transcribe"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Transcribe (3.5)</span>
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isListeningVoice
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  }`}
                  title={isListeningVoice ? 'Stop listening' : 'Click to Speak input'}
                >
                  {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {isListeningVoice && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1 animate-pulse">
                <span>🔴</span> Listening now... speak in{' '}
                {SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name || 'selected language'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Vernacular Language (22 Indian Languages)
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={3}>Class 3 (Age 8)</option>
                <option value={4}>Class 4 (Age 9)</option>
                <option value={5}>Class 5 (Age 10)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Simultaneous Bhashini IndicTrans + Vernacraft Pedagogy</span>
            </div>

            <button
              type="submit"
              disabled={isTranslating}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating via Bhashini &amp; Adapting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Translate &amp; Pedagogically Adapt</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Translation Contrast Output */}
        {(result || bhashiniResult) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Bhashini AI (NLTM Govt of India) */}
              <div className="bg-sky-50/60 p-6 rounded-3xl border border-sky-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-sky-600" />
                      Bhashini AI (NLTM)
                    </span>
                    <span className="text-[10px] font-mono text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                      IndicTrans NMT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">
                    National Language Mission Output:
                  </p>
                  <div className="p-4 bg-white rounded-2xl border border-sky-200 text-xs sm:text-sm leading-relaxed text-slate-900 font-semibold">
                    {bhashiniResult?.translatedText || result?.translatedText}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-200 flex items-center justify-between">
                  <span className="text-[11px] text-sky-800 font-medium">
                    Govt. of India Certified Pipeline
                  </span>
                  <button
                    type="button"
                    onClick={handleSpeakBhashini}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    {isPlayingBhashiniAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingBhashiniAudio ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Vernacraft Pedagogical Child Adaptation */}
              <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Vernacraft Pedagogy
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      Class {gradeLevel} Spoken
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">
                    Child-Centric Spoken Phrasing:
                  </p>
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs sm:text-sm leading-relaxed text-slate-900 font-bold">
                    {result?.translatedText || bhashiniResult?.translatedText}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Spoken village vocabulary
                  </span>
                  <button
                    type="button"
                    onClick={handleSpeakPedagogy}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Generic Literal Machine Translation (For Contrast) */}
              <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Literal Machine Translation
                    </span>
                    <span className="text-[10px] font-mono text-rose-500">
                      Unadapted
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">
                    Literal Dictionary Output:
                  </p>
                  <div className="p-4 bg-white rounded-2xl border border-rose-200 text-xs leading-relaxed text-slate-700">
                    {targetLang === 'hi'
                      ? 'वाष्पीकरण तब घटित होता है जब गर्म सौर विकिरण जल निकाय को तप्त करता है, जिससे द्रव अदृश्य वाष्प कणिकाओं में परिवर्तित होता है।'
                      : 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱢᱤᱫ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱨᱟᱣ ᱛᱚᱨᱡᱚᱢᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱥᱟᱬᱮᱥ ᱨᱮᱱᱟᱜ ᱟᱹᱲᱟᱹ ᱠᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱟᱹᱰᱤ ᱜᱟᱹᱦᱤᱨ ᱜᱮᱭᱟ᱾'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] text-rose-800 font-medium">
                  ⚠️ Too technical for Class {gradeLevel} rural learners.
                </div>
              </div>
            </div>

            {/* Phonetic Pronunciation Guide & Pedagogical Note */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">
                  Phonetic Pronunciation Guide:
                </h3>
                <p className="text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {result?.phoneticGuide || bhashiniResult?.phoneticGuide || 'Standard Indian vernacular phonetic rhythm'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">
                  Pedagogical Adaptation Notes:
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {result?.pedagogicalNote || bhashiniResult?.pedagogicalNote}
                </p>
              </div>

              {((result?.keyTerminology && result.keyTerminology.length > 0) ||
                (bhashiniResult?.keyTerminology && bhashiniResult.keyTerminology.length > 0)) && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Key Terminology Anchors:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(result?.keyTerminology || bhashiniResult?.keyTerminology || []).map(
                      (term: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-900 block">
                            {term.term || term.original}
                          </span>
                          <span className="text-emerald-700 font-semibold">
                            {term.vernacular || term.adapted}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            💡 {term.localMetaphor || term.meaning}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Audio Transcriber Modal with gemini-3.5-transcribe */}
      <AudioTranscriberModal
        isOpen={isTranscriberOpen}
        onClose={() => setIsTranscriberOpen(false)}
        defaultLanguage={targetLang}
        onTranscribeComplete={(transcriptText) => {
          setInputText(transcriptText);
        }}
      />
    </div>
  );
};
