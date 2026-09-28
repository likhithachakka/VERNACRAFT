import { Lesson, Quiz, StudentAttempt, StudentProgress, Worksheet } from '../types';
import { OfflineStorageService } from './offlineStorage';
import {
  DEMO_WATER_CYCLE_LESSON,
  DEMO_PLANTS_LESSON,
  DEMO_QUIZ_WATER_CYCLE,
  DEMO_STUDENT_PROGRESS,
  DEMO_WORKSHEET,
} from '../data/demoData';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { CURRICULUM_DATA } from '../data/curriculum';

export class ApiService {
  private static isOffline(): boolean {
    return (
      (typeof navigator !== 'undefined' && !navigator.onLine) ||
      OfflineStorageService.isOfflineSimulated()
    );
  }

  static async getLanguages() {
    if (this.isOffline()) {
      return SUPPORTED_LANGUAGES;
    }
    try {
      const res = await fetch('/api/languages');
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return SUPPORTED_LANGUAGES;
    }
  }

  static async getCurriculum() {
    if (this.isOffline()) {
      return CURRICULUM_DATA;
    }
    try {
      const res = await fetch('/api/curriculum');
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return CURRICULUM_DATA;
    }
  }

  static async getLessons(): Promise<Lesson[]> {
    if (this.isOffline()) {
      return OfflineStorageService.getCachedLessons();
    }
    try {
      const res = await fetch('/api/lessons');
      if (!res.ok) throw new Error('API error');
      const lessons = await res.json();
      OfflineStorageService.cacheLessons(lessons);
      return lessons;
    } catch {
      return OfflineStorageService.getCachedLessons();
    }
  }

  static async getLessonById(id: string): Promise<Lesson> {
    const cached = OfflineStorageService.getCachedLessons().find((l) => l.id === id);
    if (this.isOffline() && cached) {
      return cached;
    }
    try {
      const res = await fetch(`/api/lessons/${id}`);
      if (!res.ok) throw new Error('Lesson not found');
      const lesson = await res.json();
      OfflineStorageService.cacheLesson(lesson);
      return lesson;
    } catch {
      return cached || DEMO_WATER_CYCLE_LESSON;
    }
  }

  static async createLesson(data: Partial<Lesson>): Promise<Lesson> {
    if (this.isOffline()) {
      const offlineLesson: Lesson = {
        id: 'lesson-offline-' + Date.now(),
        title: data.title || 'Offline Lesson',
        grade: data.grade || 4,
        subject: data.subject || 'Environmental Studies',
        topic: data.topic || 'General Topic',
        teachingLanguage: data.teachingLanguage || 'en',
        targetLanguage: data.targetLanguage || 'hi',
        pedagogy: data.pedagogy || DEMO_WATER_CYCLE_LESSON.pedagogy,
        animationProject: data.animationProject || DEMO_WATER_CYCLE_LESSON.animationProject,
        quizId: 'quiz-' + Date.now(),
        createdAt: new Date().toISOString(),
        isOfflineAvailable: true,
      };
      OfflineStorageService.cacheLesson(offlineLesson);
      return offlineLesson;
    }

    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create lesson');
    const created = await res.json();
    OfflineStorageService.cacheLesson(created);
    return created;
  }

  static async generatePedagogy(payload: {
    topic: string;
    grade: number;
    subject: string;
    teachingLanguage: string;
    targetLanguage: string;
    context?: string;
  }) {
    if (this.isOffline()) {
      // Return rich localized curriculum fallback
      return {
        conceptBreakdown: [
          `1. Observation: Where do children in Jharkhand observe ${payload.topic}?`,
          `2. Core Mechanism: How ${payload.topic} functions in nature step-by-step.`,
          `3. Local Connection: Relating to village ponds, fields, and changing seasons.`,
          `4. Key Takeaway: What we learn from ${payload.topic}.`,
        ],
        simplifiedExplanation: `This concept of ${payload.topic} is like an automatic village system where every natural part works together.`,
        vernacularExplanation:
          payload.targetLanguage === 'hi'
            ? `${payload.topic} को समझना बहुत आसान है। जैसे हमारे गांव के पोखर और खेतों में पानी और धूप का चक्र चलता है, वैसे ही यह भी प्रकृति का एक अटूट हिस्सा है।`
            : `${payload.topic} ᱫᱚ ᱟᱵᱚ ᱫᱷᱟᱹᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱢᱟᱨᱟᱝ ᱱᱤᱭᱚᱢ ᱠᱟᱱᱟ᱾ ᱡᱮᱞᱮᱠᱟ ᱫᱟᱜ ᱟᱹᱪᱩᱨ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱱᱠᱟ ᱜᱮ ᱱᱚᱣᱟ ᱦᱚᱸ ᱠᱟᱹᱢᱤᱭᱟ᱾`,
        relatableAnalogy: 'The Earthen Chulha and Cold Lid: Steam condenses into water drops when cold air touches it.',
        localContextStory: `Birsa and his classmates walked near Ormanjhi and discovered ${payload.topic} in real life under the guidance of Masterji.`,
        vocabularyGlossary: [
          { english: payload.topic, vernacular: `${payload.topic} (अवधारणा)`, example: 'Observed during school science walk.' },
        ],
      };
    }

    const res = await fetch('/api/ai/pedagogy-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate pedagogy');
    return await res.json();
  }

  static async generateAnimation(payload: {
    topic: string;
    grade: number;
    language: string;
    customPrompt?: string;
  }) {
    if (!this.isOffline()) {
      try {
        const res = await fetch('/api/ai/generate-animation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('API animation fetch failed, falling back to local procedural generator:', e);
      }
    }

    // Client-side topic-aware procedural fallback so ANY topic works reliably even offline
    const lower = payload.topic.toLowerCase();
    if (lower.includes('wind') || lower.includes('turbine') || lower.includes('plant') || lower.includes('electricity')) {
      return {
        id: 'anim-wind-client-' + Date.now(),
        topic: payload.topic,
        grade: payload.grade,
        language: payload.language,
        totalDuration: 28,
        provider: 'procedural-svg',
        summaryNarration: 'Watch how strong natural winds turn massive turbine blades to generate clean electricity!',
        scenes: [
          {
            id: 'sc-c-wp1',
            title: 'Scene 1: Natural Wind Energy Across the Hills',
            order: 1,
            description: 'Brisk mountain winds blow across high hills where a giant windmill stands ready.',
            background: 'wind-farm',
            characters: [
              { id: 'c1', name: 'Masterji', type: 'teacher', position: { x: 20, y: 72 }, action: 'explain' }
            ],
            objects: [
              { id: 'w1', name: 'Wind Currents', type: 'wind', label: 'Brisk Wind Currents / पवन ऊर्जा', position: { x: 45, y: 30 }, animation: 'float', color: '#38bdf8' },
              { id: 'wt1', name: 'Windmill Turbine', type: 'windmill', label: 'Wind Turbine / पवन चक्की', position: { x: 75, y: 48 }, animation: 'spin', color: '#ffffff' }
            ],
            narration: [
              { language: 'en', text: 'On high hills and open plains, strong natural breezes carry immense moving kinetic energy!' },
              { language: 'hi', text: 'पहाड़ियों और खुले मैदानों पर बहने वाली तेज हवा में बहुत सारी गतिज ऊर्जा (Kinetic Energy) होती है।' },
              { language: 'sat', text: 'ᱵᱩᱨᱩ ᱟᱨ ᱠᱷᱩᱞᱟᱹ ᱴᱟᱺᱰᱤ ᱨᱮ ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱛᱮᱡ ᱦᱟᱹᱣᱟᱹ ᱨᱮ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱫᱟᱲᱮ ᱛᱟᱦᱮᱸᱱᱟ᱾' }
            ],
            captions: 'Brisk winds carry natural kinetic energy (पवन ऊर्जा)',
            duration: 8,
            interactionPoint: {
              question: 'What gives energy to push the giant windmill blades?',
              options: ['Moving Air (Wind)', 'Water in a bucket', 'Coal smoke'],
              correctIndex: 0,
              hint: 'Feel the cool breeze moving across the landscape!'
            }
          },
          {
            id: 'sc-c-wp2',
            title: 'Scene 2: Kinetic to Mechanical Energy (Blades Spin)',
            order: 2,
            description: 'The wind rushes against curved aerodynamic blades, turning the rotor shaft smoothly.',
            background: 'wind-farm',
            characters: [],
            objects: [
              { id: 'wt2', name: 'Spinning Turbine', type: 'windmill', label: 'Spinning Blades / घूमते ब्लेड', position: { x: 45, y: 45 }, animation: 'spin', color: '#ffffff' },
              { id: 'gen', name: 'Generator Hub', type: 'generator', label: 'Generator Inside Nacelle', position: { x: 78, y: 50 }, animation: 'pulse', color: '#fbbf24' }
            ],
            narration: [
              { language: 'en', text: 'As wind pushes the blades, they spin a central shaft connected to an electric generator inside!' },
              { language: 'hi', text: 'जैसे ही हवा ब्लेड्स को धक्का देती है, वे घूमने लगते हैं और अंदर लगे जनरेटर को चलाकर बिजली पैदा करते हैं!' },
              { language: 'sat', text: 'ᱦᱟᱹᱣᱟᱹ ᱛᱮ ᱯᱟᱹᱠᱷᱱᱟᱹ ᱟᱹᱪᱩᱨᱚᱜ-ᱟ ᱟᱨ ᱵᱷᱤᱛᱨᱤ ᱨᱮᱱᱟᱜ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱵᱤᱡᱽᱞᱤ-ᱮ ᱵᱮᱱᱟᱣᱟ᱾' }
            ],
            captions: 'Spinning blades power the generator (गति से बिजली बनना)',
            duration: 9,
          },
          {
            id: 'sc-c-wp3',
            title: 'Scene 3: Clean Green Electricity Lights Homes',
            order: 3,
            description: 'The clean electricity travels down wires to light up bulbs, fans, and school classrooms.',
            background: 'wind-farm',
            characters: [
              { id: 'c2', name: 'Birsa', type: 'student-boy', position: { x: 25, y: 72 }, action: 'cheer' }
            ],
            objects: [
              { id: 'wt3', name: 'Windmill', type: 'windmill', position: { x: 40, y: 45 }, animation: 'spin', color: '#ffffff' },
              { id: 'spk', name: 'Green Power Spark', type: 'arrow', label: 'Clean Power Flow', position: { x: 62, y: 48 }, animation: 'pulse', color: '#fbbf24' },
              { id: 'b1', name: 'Lit Bulb', type: 'bulb', label: 'Lit Home & School / रोशनी', position: { x: 82, y: 40 }, animation: 'glow', color: '#facc15' }
            ],
            narration: [
              { language: 'en', text: 'Clean, pollution-free electricity travels straight to our village homes and classrooms without any smoke!' },
              { language: 'hi', text: 'यह स्वच्छ, प्रदूषण-रहित बिजली बिना किसी धुएं के हमारे गांव के घरों और स्कूल को रोशन करती है!' },
              { language: 'sat', text: 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱷᱟᱨᱪᱟ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱵᱤᱱᱟᱹ ᱫᱷᱩᱶᱟᱹ ᱛᱮ ᱟᱵᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱟᱨ ᱟᱥᱲᱟ ᱡᱩᱞᱟᱣᱟ᱾' }
            ],
            captions: 'Clean green energy powers our classrooms and homes! (स्वच्छ हरित ऊर्जा)',
            duration: 9,
            interactionPoint: {
              question: 'Does a wind power plant create smoke or air pollution?',
              options: ['No, it produces clean green energy!', 'Yes, lots of dark smoke', 'Only in the afternoon'],
              correctIndex: 0,
              hint: 'Wind is 100% natural, clean renewable energy!'
            }
          }
        ]
      };
    }

    if (lower.includes('water') || lower.includes('rain')) {
      return DEMO_WATER_CYCLE_LESSON.animationProject;
    }

    // Universal procedural fallback for ANY other topic
    return {
      id: 'anim-client-gen-' + Date.now(),
      topic: payload.topic,
      grade: payload.grade,
      language: payload.language,
      totalDuration: 28,
      provider: 'procedural-svg',
      summaryNarration: `An interactive visual exploration of ${payload.topic} tailored for Class ${payload.grade} students.`,
      scenes: [
        {
          id: 'sc-gen-1',
          title: `Scene 1: Introduction to ${payload.topic}`,
          order: 1,
          description: `Visualizing the foundational elements of ${payload.topic} in nature.`,
          background: 'nature',
          characters: [{ id: 'gc1', name: 'Masterji', type: 'teacher', position: { x: 25, y: 70 }, action: 'explain' }],
          objects: [
            { id: 'go1', name: payload.topic, type: 'plant', label: `${payload.topic} (Core Element)`, position: { x: 55, y: 50 }, animation: 'glow', color: '#10b981' },
            { id: 'go2', name: 'Energy', type: 'sun', position: { x: 80, y: 20 }, animation: 'pulse', color: '#f59e0b' }
          ],
          narration: [
            { language: 'en', text: `Let us explore how ${payload.topic} works right here in our environment!` },
            { language: 'hi', text: `आइए समझें कि ${payload.topic} हमारे दैनिक जीवन और प्रकृति में कैसे काम करता है।` },
            { language: 'sat', text: `ᱫᱮᱞᱟ ᱵᱚ ᱧᱮᱞᱟ ${payload.topic} ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟ᱾` }
          ],
          captions: `Discovering ${payload.topic} step by step`,
          duration: 8,
        },
        {
          id: 'sc-gen-2',
          title: `Scene 2: How ${payload.topic} Functions`,
          order: 2,
          description: `Observing the transformation and active process of ${payload.topic}.`,
          background: 'nature',
          characters: [],
          objects: [
            { id: 'go3', name: 'Dynamic Flow', type: 'arrow', label: 'Active Process', position: { x: 50, y: 45 }, animation: 'float', color: '#3b82f6' },
            { id: 'go4', name: 'Natural Balance', type: 'cloud', label: 'Harmony', position: { x: 65, y: 35 }, animation: 'pulse', color: '#06b6d4' }
          ],
          narration: [
            { language: 'en', text: `Notice how all elements coordinate together to make ${payload.topic} happen smoothly.` },
            { language: 'hi', text: `देखिए कैसे सभी घटक मिलकर ${payload.topic} की प्रक्रिया को पूरा करते हैं।` },
            { language: 'sat', text: `ᱡᱚᱛᱚ ᱡᱤᱱᱤᱥ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱱᱚᱣᱟ ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣᱜ-ᱟ᱾` }
          ],
          captions: `The mechanism of ${payload.topic} in action`,
          duration: 9,
          interactionPoint: {
            question: `Does ${payload.topic} create harmony and balance in our environment?`,
            options: ['Yes, absolutely!', 'No, not at all', 'Only at night'],
            correctIndex: 0,
            hint: 'Natural processes work in balance with our world!'
          }
        },
        {
          id: 'sc-gen-3',
          title: `Scene 3: Real Life Understanding of ${payload.topic}`,
          order: 3,
          description: `Connecting ${payload.topic} to practical daily observations.`,
          background: 'classroom',
          characters: [{ id: 'gc2', name: 'Birsa', type: 'student-boy', position: { x: 30, y: 72 }, action: 'cheer' }],
          objects: [
            { id: 'go5', name: 'Mastery Light', type: 'sun', label: 'Mastery & Understanding', position: { x: 50, y: 30 }, animation: 'glow', color: '#fbbf24' }
          ],
          narration: [
            { language: 'en', text: `Now you know how ${payload.topic} works! Look around your village and school to observe it today.` },
            { language: 'hi', text: `अब आप ${payload.topic} को अच्छी तरह समझ चुके हैं! आज अपने आसपास इसे ध्यान से देखें।` },
            { language: 'sat', text: `ᱱᱤᱛᱚᱜ ᱟᱢ ${payload.topic} ᱵᱟᱰᱟᱭ ᱠᱮᱫᱟᱢ! ᱟᱢᱟᱜ ᱟᱥᱲᱟ ᱟᱨ ᱟᱹᱛᱩ ᱨᱮ ᱱᱚᱣᱟ ᱧᱮᱞ ᱢᱮ᱾` }
          ],
          captions: `Mastery and real life application of ${payload.topic}`,
          duration: 9,
        }
      ]
    };
  }

  static async askTutor(payload: {
    studentMessage: string;
    currentTopic: string;
    grade: number;
    language: string;
    confusionLevel?: number;
  }) {
    if (this.isOffline()) {
      return {
        tutorSpeech:
          payload.confusionLevel && payload.confusionLevel > 1
            ? "No worries at all! Let's think of cooking rice at home. When mother puts a lid on boiling water, steam turns into droplets on the lid!"
            : `Great question about ${payload.currentTopic}! It works like a cycle that never stops in our village.`,
        vernacularSpeech:
          payload.language === 'hi'
            ? 'बिल्कुल चिंता मत करो! जैसे चूल्हे पर ढक्कन पर भाप से पानी की बूंदें बनती हैं, वैसे ही यह भी काम करता है।'
            : 'ᱟᱞᱚᱢ ᱪᱤᱱᱛᱟᱹᱜ-ᱟ! ᱪᱩᱞᱦᱟᱹ ᱪᱮᱛᱟᱱ ᱰᱷᱟᱹᱠᱱᱤ ᱨᱮ ᱫᱟᱜ ᱴᱚᱯᱟᱜ ᱡᱟᱣᱨᱟᱜ ᱞᱮᱠᱟ ᱜᱮ ᱱᱚᱣᱟ ᱦᱚᱸ ᱠᱟᱹᱢᱤᱭᱟ᱾',
        characterEmotion: 'encouraging',
        suggestedAnalogy: 'Boiling Pot Lid',
        recommendedAction: 'continue',
        checkQuestion: 'Have you seen steam rising from a hot cup of tea?',
      };
    }
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Tutor query failed');
    return await res.json();
  }

  static async translateText(payload: {
    text: string;
    sourceLang: string;
    targetLang: string;
    gradeLevel: number;
  }) {
    if (this.isOffline()) {
      return {
        translatedText: `[Offline Translation]: ${payload.text}`,
        phoneticGuide: 'Phonetic script guide available in online mode',
        pedagogicalNote: 'Offline mode: Cached vocabulary match applied.',
        keyTerminology: [],
      };
    }
    const res = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Translation failed');
    return await res.json();
  }

  static async getBhashiniStatus() {
    if (this.isOffline()) {
      return {
        status: 'cached',
        configured: false,
        service: 'Bhashini AI (National Language Translation Mission - NLTM)',
        supportedLanguages: [],
        capabilities: ['Vernacular Translation', 'Offline Dictionary Fallback'],
      };
    }
    try {
      const res = await fetch('/api/bhashini/status');
      if (!res.ok) throw new Error('Failed to fetch Bhashini status');
      return await res.json();
    } catch {
      return {
        status: 'fallback',
        configured: false,
        service: 'Bhashini AI (National Language Translation Mission)',
        supportedLanguages: [],
      };
    }
  }

  static async translateWithBhashini(payload: {
    text: string;
    sourceLang: string;
    targetLang: string;
    gradeLevel?: number;
  }) {
    if (this.isOffline()) {
      return {
        translatedText: `[Offline Bhashini]: ${payload.text}`,
        sourceLang: payload.sourceLang,
        targetLang: payload.targetLang,
        provider: 'bhashini-offline-engine',
        apiKeyConfigured: true,
        pedagogicalNote: 'Offline cached translation applied.',
        keyTerminology: [],
      };
    }
    const res = await fetch('/api/bhashini/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Bhashini translation request failed');
    return await res.json();
  }

  static async getQuiz(quizId: string): Promise<Quiz> {
    if (this.isOffline()) {
      return OfflineStorageService.getCachedQuiz(quizId) || DEMO_QUIZ_WATER_CYCLE;
    }
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (!res.ok) throw new Error('Quiz not found');
      return await res.json();
    } catch {
      return DEMO_QUIZ_WATER_CYCLE;
    }
  }

  static async submitQuiz(payload: {
    studentId: string;
    quizId: string;
    answers: Record<string, any>;
  }) {
    if (this.isOffline()) {
      // Local scoring
      const quiz = DEMO_QUIZ_WATER_CYCLE;
      let score = 0;
      quiz.questions.forEach((q) => {
        if (String(payload.answers[q.id]) === String(q.correctAnswer)) score++;
      });
      const attempt: StudentAttempt = {
        id: 'att-local-' + Date.now(),
        studentId: payload.studentId,
        quizId: payload.quizId,
        answers: payload.answers,
        score,
        maxScore: quiz.questions.length,
        understoodConcepts: ['Evaporation basics'],
        weakConcepts: score < quiz.questions.length ? ['Condensation'] : [],
        misconceptionsDetected:
          score < quiz.questions.length
            ? [
                {
                  questionId: 'q2',
                  chosenAnswer: '0',
                  misconception: 'Cloud is not made of cotton candy, but water droplets!',
                  remedyPedagogy: 'Clouds are billions of cooled water droplets.',
                  visualMetaphor: 'Cold metal lid collecting steam drops.',
                },
              ]
            : [],
        adaptedNextActivity: 'Review Chulha Analogy Lesson',
        timestamp: new Date().toISOString(),
      };
      const currentProgress = OfflineStorageService.getCachedProgress();
      currentProgress.recentAttempts.unshift(attempt);
      currentProgress.totalXp += score * 50;
      OfflineStorageService.saveProgress(currentProgress);
      return { attempt, progress: currentProgress };
    }

    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    const data = await res.json();
    OfflineStorageService.saveProgress(data.progress);
    return data;
  }

  static async getStudentProgress(): Promise<StudentProgress> {
    if (this.isOffline()) {
      return OfflineStorageService.getCachedProgress();
    }
    try {
      const res = await fetch('/api/student/progress');
      if (!res.ok) throw new Error('Progress fetch failed');
      const progress = await res.json();
      OfflineStorageService.saveProgress(progress);
      return progress;
    } catch {
      return OfflineStorageService.getCachedProgress();
    }
  }

  static async getClassAnalytics() {
    if (this.isOffline()) {
      return {
        totalStudents: 34,
        activeToday: 28,
        averageMastery: 76.5,
        completedLessonsCount: 89,
        vernacularEngagement: { Hindi: 42, Santhali: 36, Mundari: 12, Ho: 6, Kurukh: 4 },
        topMisconceptions: [
          { concept: 'Evaporation vs Boiling', frequency: '42% students initially', remedyStatus: 'Resolved via Chulha analogy' },
        ],
        recentStudentActivity: [
          { name: 'Birsa Hembrom', grade: 4, topic: 'Water Cycle', score: '3/4', language: 'Santhali / Hindi', status: 'Mastered' },
        ],
      };
    }
    try {
      const res = await fetch('/api/teacher/analytics');
      if (!res.ok) throw new Error('Analytics failed');
      return await res.json();
    } catch {
      return {
        totalStudents: 34,
        activeToday: 28,
        averageMastery: 76.5,
        completedLessonsCount: 89,
        vernacularEngagement: { Hindi: 42, Santhali: 36, Mundari: 12, Ho: 6, Kurukh: 4 },
        topMisconceptions: [],
        recentStudentActivity: [],
      };
    }
  }

  static async generateWorksheet(payload: {
    topic: string;
    grade: number;
    subject: string;
    primaryLanguage: string;
    vernacularLanguage: string;
  }): Promise<Worksheet> {
    if (this.isOffline()) {
      return DEMO_WORKSHEET;
    }
    const res = await fetch('/api/worksheet/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate worksheet');
    return await res.json();
  }

  // ==========================================
  // AUDIO TRANSCRIPTION (gemini-3.5-transcribe)
  // ==========================================
  static async transcribeAudio(
    audioBase64: string,
    mimeType: string = 'audio/webm',
    languageContext?: string
  ): Promise<{ transcript: string; model: string }> {
    if (this.isOffline()) {
      return {
        transcript: 'Water warms up under the sun and changes into rising vapor.',
        model: 'offline-cached-transcriber',
      };
    }
    const res = await fetch('/api/ai/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType, languageContext }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to transcribe audio');
    }
    return await res.json();
  }

  // ==========================================
  // VEO VIDEO GENERATION (veo-3.1-fast-generate-preview)
  // ==========================================
  static async generateVeoVideo(params: {
    imageBase64?: string;
    mimeType?: string;
    prompt?: string;
    aspectRatio?: '16:9' | '9:16';
  }): Promise<{ operationName: string; model: string; aspectRatio: '16:9' | '9:16' }> {
    if (this.isOffline()) {
      return {
        operationName: 'models/veo-3.1-fast-generate-preview/operations/offline-demo-op',
        model: 'veo-3.1-fast-generate-preview',
        aspectRatio: params.aspectRatio || '16:9',
      };
    }
    const res = await fetch('/api/video/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start Veo video generation');
    }
    return await res.json();
  }

  static async getVeoVideoStatus(operationName: string): Promise<{
    done: boolean;
    videoUri?: string;
    error?: string;
  }> {
    if (this.isOffline()) {
      return { done: true, videoUri: 'offline-video-uri' };
    }
    const res = await fetch('/api/video/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to check Veo video status');
    }
    return await res.json();
  }

  static async downloadVeoVideoBlob(operationName: string): Promise<Blob> {
    const res = await fetch('/api/video/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName }),
    });
    if (!res.ok) {
      throw new Error('Failed to download generated video');
    }
    return await res.blob();
  }

  // ==========================================
  // LIVE VOICE CONVERSATION (gemini-3.8-live)
  // ==========================================
  static async liveConverse(params: {
    userInput?: string;
    audioBase64?: string;
    mimeType?: string;
    systemPrompt?: string;
    language?: string;
  }): Promise<{
    responseText: string;
    vernacularResponse?: string;
    audioBase64?: string;
    model: string;
  }> {
    if (this.isOffline()) {
      return {
        responseText: 'Johar! I am Sathi. How can I help you explore science today?',
        vernacularResponse: 'ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱥᱟᱛᱷᱤ ᱠᱟᱹᱱᱟᱹᱧ᱾',
        model: 'offline-companion',
      };
    }
    const res = await fetch('/api/ai/live-converse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Live conversation request failed');
    }
    return await res.json();
  }
}

