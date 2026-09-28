import { getLanguage } from '../data/languages';

// Web Speech API interface definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;

  private static fallbackTimer: any = null;

  /**
   * Speak text in supported languages
   */
  static speak(
    text: string,
    langCode: string,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    this.stopSpeaking();

    const lang = getLanguage(langCode);

    if (!this.synth) {
      onError?.(new Error('Speech synthesis not supported in this browser.'));
      return false;
    }

    if (!lang.textToSpeechSupported) {
      // Graceful fallback: Do not fake support!
      console.info(
        `[Vernacraft Audio] Native TTS not supported for ${lang.name}. Providing visual caption fallback.`
      );
      // Execute onEnd after reading time calculation
      const readingDurationMs = Math.min(6000, Math.max(2000, text.length * 70));
      this.fallbackTimer = setTimeout(() => {
        this.fallbackTimer = null;
        try {
          onEnd?.();
        } catch (_) {}
      }, readingDurationMs);
      return false;
    }

    try {
      this.synth.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);

      // Map language code to standard BCP 47 locales
      const localeMap: Record<string, string> = {
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        or: 'or-IN',
        pa: 'pa-IN',
        es: 'es-ES',
        fr: 'fr-FR',
        en: 'en-IN',
      };

      const targetLocale = localeMap[langCode] || `${langCode}-IN`;
      utterance.lang = targetLocale;

      // Check available voices in current browser to select best matching voice
      if (typeof window !== 'undefined' && this.synth.getVoices) {
        const voices = this.synth.getVoices();
        const matchingVoice = voices.find(
          (v) =>
            v.lang.toLowerCase() === targetLocale.toLowerCase() ||
            v.lang.toLowerCase().startsWith(langCode.toLowerCase())
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.pitch = 1.0;
      utterance.rate = 0.92;

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        onError?.(e);
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
      onError?.(e);
      return false;
    }
  }

  static stopSpeaking() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
  }

  /**
   * Listen using Web Speech Recognition
   */
  static listen(
    langCode: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): { stop: () => void } {
    const lang = getLanguage(langCode);

    if (!lang.speechToTextSupported) {
      onError(
        `Speech recognition is not natively available for ${lang.name} in current web standards. Please type or choose bilingual prompt buttons.`
      );
      return { stop: () => {} };
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Microphone speech recognition is not supported in this browser.');
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const localeMap: Record<string, string> = {
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        or: 'or-IN',
        pa: 'pa-IN',
        es: 'es-ES',
        fr: 'fr-FR',
        en: 'en-IN',
      };

      recognition.lang = localeMap[langCode] || `${langCode}-IN`;

      recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult({ transcript, isFinal });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : `Speech error: ${event.error}`);
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
        },
      };
    } catch (e: any) {
      onError(e.message || 'Failed to start microphone');
      return { stop: () => {} };
    }
  }
}
