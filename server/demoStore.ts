import {
  DEMO_TEACHER,
  DEMO_STUDENT,
  DEMO_WATER_CYCLE_LESSON,
  DEMO_PLANTS_LESSON,
  DEMO_QUIZ_WATER_CYCLE,
  DEMO_STUDENT_PROGRESS,
  SAMPLE_ACHIEVEMENTS,
  DEMO_WORKSHEET,
} from '../src/data/demoData';
import { SUPPORTED_LANGUAGES } from '../src/data/languages';
import { CURRICULUM_DATA } from '../src/data/curriculum';
import { Lesson, Quiz, StudentAttempt, Worksheet } from '../src/types';

class Store {
  lessons: Lesson[] = [DEMO_WATER_CYCLE_LESSON, DEMO_PLANTS_LESSON];
  quizzes: Quiz[] = [DEMO_QUIZ_WATER_CYCLE];
  worksheets: Worksheet[] = [DEMO_WORKSHEET];
  studentProgress = { ...DEMO_STUDENT_PROGRESS };
  achievements = [...SAMPLE_ACHIEVEMENTS];
  languages = [...SUPPORTED_LANGUAGES];
  curriculum = [...CURRICULUM_DATA];

  getLessons() {
    return this.lessons;
  }

  getLessonById(id: string) {
    return this.lessons.find((l) => l.id === id);
  }

  addLesson(lesson: Lesson) {
    this.lessons.unshift(lesson);
    return lesson;
  }

  getQuizzes() {
    return this.quizzes;
  }

  getQuizById(id: string) {
    return this.quizzes.find((q) => q.id === id || q.lessonId === id);
  }

  addQuiz(quiz: Quiz) {
    this.quizzes.push(quiz);
    return quiz;
  }

  recordQuizAttempt(attempt: StudentAttempt) {
    this.studentProgress.recentAttempts.unshift(attempt);
    // update XP and mastery
    const points = attempt.score * 50;
    this.studentProgress.totalXp += points;
    if (attempt.score === attempt.maxScore) {
      this.studentProgress.overallMastery = Math.min(100, this.studentProgress.overallMastery + 5);
      const quizMaster = this.achievements.find((a) => a.id === 'ach-quiz-master');
      if (quizMaster) quizMaster.progress = 100;
    }
    return this.studentProgress;
  }

  getStudentProgress() {
    return this.studentProgress;
  }

  getWorksheets() {
    return this.worksheets;
  }

  addWorksheet(ws: Worksheet) {
    this.worksheets.unshift(ws);
    return ws;
  }

  getClassAnalytics() {
    return {
      totalStudents: 34,
      activeToday: 28,
      averageMastery: 76.5,
      completedLessonsCount: 89,
      vernacularEngagement: {
        Hindi: 42,
        Santhali: 36,
        Mundari: 12,
        Ho: 6,
        Kurukh: 4,
      },
      topMisconceptions: [
        {
          concept: 'Evaporation vs Boiling',
          frequency: '42% students initially think water only evaporates at 100°C',
          remedyStatus: 'Resolved via Chulha/Drying Cloths visual analogy',
        },
        {
          concept: 'Cloud Weight',
          frequency: '28% students thought clouds are light smoke rather than heavy water droplets',
          remedyStatus: 'Resolved via Badal Bhai condensation scene',
        },
      ],
      recentStudentActivity: [
        { name: 'Birsa Hembrom', grade: 4, topic: 'Water Cycle', score: '3/4', language: 'Santhali / Hindi', status: 'Mastered' },
        { name: 'Somari Tudu', grade: 4, topic: 'Water Cycle', score: '4/4', language: 'Santhali', status: 'Mastered' },
        { name: 'Mangal Munda', grade: 4, topic: 'Fractions', score: '3/3', language: 'Mundari', status: 'Mastered' },
        { name: 'Anjali Oraon', grade: 3, topic: 'Plant Roots', score: '3/3', language: 'Kurukh', status: 'In Progress' },
      ],
    };
  }
}

export const demoStore = new Store();
