import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Copy,
  Check,
  FileAudio,
  Sparkles,
  Loader2,
  X,
  Volume2,
  Languages,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscribeComplete?: (transcript: string) => void;
  defaultLanguage?: string;
}

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onTranscribeComplete,
  defaultLanguage = 'hi',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [languageContext, setLanguageContext] = useState(defaultLanguage);
  const [copied, setCopied] = useState(false);
  const [transcriptionModel, setTranscriptionModel] = useState<string>('gemini-3.5-transcribe');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  const cleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Mic error:', err);
      setErrorMsg('Microphone access denied or not available. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setTranscript('');
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      setErrorMsg('Please record or upload an audio file first.');
      return;
    }

    setIsTranscribing(true);
    setErrorMsg(null);

    try {
      // Read blob as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const commaIdx = result.indexOf(',');
          const base64Audio = commaIdx !== -1 ? result.slice(commaIdx + 1) : result;
          const mimeType = audioBlob.type || 'audio/webm';

          const res = await ApiService.transcribeAudio(
            base64Audio,
            mimeType,
            `Language: ${languageContext}`
          );

          setTranscript(res.transcript);
          setTranscriptionModel(res.model || 'gemini-3.5-transcribe');
          if (onTranscribeComplete) {
            onTranscribeComplete(res.transcript);
          }
        } catch (err: any) {
          console.error('Transcription error:', err);
          setErrorMsg(err.message || 'Audio transcription failed with gemini-3.5-transcribe');
        } finally {
          setIsTranscribing(false);
        }
      };

      reader.onerror = () => {
        setErrorMsg('Failed to process audio data.');
        setIsTranscribing(false);
      };

      reader.readAsDataURL(audioBlob);
    } catch (err: any) {
      console.error('Transcribe error:', err);
      setErrorMsg(err.message || 'Transcription error occurred');
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm sm:text-base">
                  Audio Transcriber Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Input spoken audio via microphone to transcribe vernacular speech into text
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Language hint */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spoken Mother-Tongue Context:</span>
            </label>
            <select
              value={languageContext}
              onChange={(e) => setLanguageContext(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Recording / Upload Area */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
            {isRecording ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 animate-pulse">
                  <Mic className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-2xl font-mono font-black text-white">
                    00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                  </span>
                  <p className="text-xs text-rose-300 font-semibold mt-1">
                    Recording microphone audio... Speak clearly in your mother tongue!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 mx-auto transition-colors cursor-pointer shadow-lg"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording</span>
                </button>
              </div>
            ) : audioUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Audio Captured Ready</p>
                    <p className="text-[11px] text-slate-400">
                      Duration: {recordingSeconds > 0 ? `${recordingSeconds}s` : 'Recorded Audio'}
                    </p>
                  </div>
                </div>

                <audio src={audioUrl} controls className="w-full h-10 mx-auto max-w-sm" />

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Record</span>
                  </button>
                  <button
                    id="submit-transcribe-btn"
                    type="button"
                    onClick={handleTranscribe}
                    disabled={isTranscribing}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Transcribing with gemini-3.5-transcribe...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Transcribe with Gemini 3.5</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Mic className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Press Start to Record Microphone</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speak words, sentences, or village science questions
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    id="start-mic-record-btn"
                    type="button"
                    onClick={startRecording}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                  <span className="text-xs text-slate-500">or</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileAudio className="w-3.5 h-3.5" />
                    <span>Upload Audio</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Transcript Output Box */}
          {transcript && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verbatim Transcription ({transcriptionModel})</span>
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-white leading-relaxed">
                {transcript}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onTranscribeComplete) onTranscribeComplete(transcript);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Use This Transcript →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
