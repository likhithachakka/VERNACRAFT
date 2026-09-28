export type UserRole = 'teacher' | 'student' | 'admin';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  textSupported: boolean;
  translationSupported: boolean;
  speechToTextSupported: boolean;
  textToSpeechSupported: boolean;
  offlineCached: boolean;
  fallbackNotes: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  primaryLanguage: string;
  grade?: number;
  school?: string;
  location?: string;
}

export interface CurriculumNode {
  id: string;
  grade: number;
  subject: string;
  chapter: string;
  topic: string;
  board: string;
  learningObjectives: string[];
  keyConcepts: string[];
  standardVocabulary: {
    term: string;
    definition: string;
    vernacularTranslations: Record<string, string>;
  }[];
}

export interface AnimationObject {
  id: string;
  name: string;
  type: string; // 'sun' | 'cloud' | 'rain' | 'water' | 'plant' | 'pizza' | 'mountain' | 'leaf' | 'cell' | 'arrow' | 'label'
  label?: string;
  position: { x: number; y: number }; // percentage 0-100
  animation: string; // 'float' | 'evaporate' | 'condense' | 'rain' | 'grow' | 'spin' | 'pulse' | 'glow' | 'slice' | 'fall' | 'idle'
  color?: string;
  scale?: number;
}

export interface AnimationCharacter {
  id: string;
  name: string;
  type: string; // 'teacher' | 'student-boy' | 'student-girl' | 'cloud-character' | 'sun-character'
  position: { x: number; y: number };
  action: string;
}

export interface AnimationScene {
  id: string;
  title: string;
  order: number;
  description: string;
  background: string; // 'sky-river' | 'farm' | 'kitchen' | 'classroom' | 'nature' | 'universe' | 'lake' | 'forest'
  characters: AnimationCharacter[];
  objects: AnimationObject[];
  narration: {
    language: string;
    text: string;
  }[];
  dialogue?: string;
  captions: string;
  duration: number; // in seconds
  interactionPoint?: {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
  };
}

export interface AnimationProject {
  id: string;
  topic: string;
  grade: number;
  language: string;
  scenes: AnimationScene[];
  totalDuration: number;
  provider: 'gemini-ai' | 'procedural-svg' | 'hybrid';
  summaryNarration: string;
}

export interface LessonPedagogy {
  conceptBreakdown: string[];
  simplifiedExplanation: string;
  vernacularExplanation: string;
  relatableAnalogy: string;
  localContextStory: string;
  vocabularyGlossary: {
    english: string;
    vernacular: string;
    pronunciation?: string;
    example: string;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  grade: number;
  subject: string;
  topic: string;
  teachingLanguage: string;
  targetLanguage: string;
  pedagogy: LessonPedagogy;
  animationProject: AnimationProject;
  quizId: string;
  createdAt: string;
  isOfflineAvailable: boolean;
}

export type AICharacterState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'explaining'
  | 'asking'
  | 'encouraging'
  | 'celebrating';

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'image-concept';
  prompt: string;
  promptVernacular: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  vernacularExplanation: string;
  conceptTested: string;
  misconceptionGuidance: Record<string, string>;
}

export interface Quiz {
  id: string;
  lessonId: string;
  topic: string;
  grade: number;
  language: string;
  difficulty: 'beginner' | 'adaptive' | 'advanced';
  questions: QuizQuestion[];
}

export interface MisconceptionDiagnosis {
  questionId: string;
  chosenAnswer: string;
  misconception: string;
  remedyPedagogy: string;
  visualMetaphor: string;
}

export interface StudentAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: Record<string, any>;
  score: number;
  maxScore: number;
  understoodConcepts: string[];
  weakConcepts: string[];
  misconceptionsDetected: MisconceptionDiagnosis[];
  adaptedNextActivity: string;
  timestamp: string;
}

export interface StudentProgress {
  studentId: string;
  overallMastery: number; // 0-100
  streakDays: number;
  totalXp: number;
  level: number;
  completedLessonIds: string[];
  subjectMastery: Record<string, number>;
  strongAreas: string[];
  weakAreas: string[];
  recentAttempts: StudentAttempt[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'language' | 'quiz' | 'jharkhand';
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface WorksheetQuestion {
  qNumber: number;
  questionTextEn: string;
  questionTextVernacular: string;
  answerLines?: number;
  options?: string[];
  answerKey: string;
}

export interface WorksheetSection {
  sectionTitle: string;
  instructions: {
    en: string;
    vernacular: string;
  };
  questions: WorksheetQuestion[];
}

export interface Worksheet {
  id: string;
  grade: number;
  subject: string;
  topic: string;
  primaryLanguage: string;
  vernacularLanguage: string;
  learningObjectives: string[];
  sections: WorksheetSection[];
  createdAt: string;
}
