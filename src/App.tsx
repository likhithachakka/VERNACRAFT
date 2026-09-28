import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DemoPage } from './pages/DemoPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { CreateLessonPage } from './pages/CreateLessonPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { WorksheetsPage } from './pages/WorksheetsPage';
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AITutorPage } from './pages/AITutorPage';
import { AdaptiveQuizPage } from './pages/AdaptiveQuizPage';
import { StudentAchievementsPage } from './pages/StudentAchievementsPage';
import { AutoAnimateToolPage } from './pages/AutoAnimateToolPage';
import { TranslationToolPage } from './pages/TranslationToolPage';
import { UserRole, Lesson } from './types';
import { DEMO_WATER_CYCLE_LESSON } from './data/demoData';
import { Sparkles, Globe2, Heart, Bot } from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';

const VALID_PATHS = new Set([
  '/',
  '/how-it-works',
  '/demo',
  '/teacher',
  '/teacher/create-lesson',
  '/teacher/classroom',
  '/teacher/worksheets',
  '/teacher/analytics',
  '/student',
  '/student/progress',
  '/student/tutor',
  '/student/quiz',
  '/student/achievements',
  '/animate',
  '/translate',
]);

const PAGE_TITLES: Record<string, string> = {
  '/': 'VERNACRAFT — Learn in Your Mother Tongue',
  '/how-it-works': 'How VERNACRAFT Works',
  '/demo': 'SIH Demo Walkthrough',
  '/teacher': 'Teacher Desk',
  '/teacher/create-lesson': 'Create an AI Lesson',
  '/teacher/classroom': 'Live Classroom',
  '/teacher/worksheets': 'Bilingual Worksheets',
  '/teacher/analytics': 'Class Analytics',
  '/student': 'My Lessons',
  '/student/progress': 'My Progress',
  '/student/tutor': 'Sathi AI Tutor',
  '/student/quiz': 'Adaptive Quiz',
  '/student/achievements': 'Badges & Achievements',
  '/animate': 'Auto-Animate Lesson',
  '/translate': 'Translation Lab',
};

const getInitialPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return VALID_PATHS.has(path) ? path : '/';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentLanguage, setCurrentLanguage] = useState<string>('hi');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(DEMO_WATER_CYCLE_LESSON.id);

  // Keep browser refresh/back/forward useful for a single-page demo.
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      setCurrentPath(VALID_PATHS.has(path) ? path : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `${PAGE_TITLES[currentPath] ?? 'VERNACRAFT'} | SIH 2026`;
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);

    if (role === 'teacher' && currentPath.startsWith('/student')) {
      handleNavigate('/teacher');
    } else if (role === 'student' && currentPath.startsWith('/teacher')) {
      handleNavigate('/student');
    }
  };

  const handleLessonCreated = (newLesson: Lesson) => {
    setSelectedLessonId(newLesson.id);
    setCurrentPath('/teacher/classroom');
  };

  const renderCurrentView = () => {
    switch (currentPath) {
      case '/':
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onSetRole={(role) => setCurrentRole(role)}
          />
        );
      case '/how-it-works':
        return <HowItWorksPage onNavigate={handleNavigate} />;
      case '/demo':
        return <DemoPage onNavigate={handleNavigate} />;

      // Teacher Portal Routes
      case '/teacher':
        return (
          <TeacherDashboard
            onNavigate={handleNavigate}
            onSelectLesson={(id) => setSelectedLessonId(id)}
          />
        );
      case '/teacher/create-lesson':
        return (
          <CreateLessonPage
            onNavigate={handleNavigate}
            onLessonCreated={handleLessonCreated}
          />
        );
      case '/teacher/classroom':
        return (
          <ClassroomPage
            selectedLessonId={selectedLessonId}
            onNavigate={handleNavigate}
          />
        );
      case '/teacher/worksheets':
        return <WorksheetsPage onNavigate={handleNavigate} />;
      case '/teacher/analytics':
        return <TeacherAnalyticsPage />;

      // Student Portal Routes
      case '/student':
      case '/student/progress':
        return (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectLesson={(id) => setSelectedLessonId(id)}
          />
        );
      case '/student/tutor':
        return <AITutorPage />;
      case '/student/quiz':
        return (
          <AdaptiveQuizPage
            quizId="quiz-water-cycle-01"
            onNavigate={handleNavigate}
          />
        );
      case '/student/achievements':
        return <StudentAchievementsPage onNavigate={handleNavigate} />;

      // Standalone Tools
      case '/animate':
        return <AutoAnimateToolPage />;
      case '/translate':
        return <TranslationToolPage />;

      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onSetRole={(role) => setCurrentRole(role)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      {/* Top Universal Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Main Routed Page Content */}
      <main id="main-content" className="flex-1 pb-24 lg:pb-0">
        {renderCurrentView()}
      </main>

      {/* Floating Sathi Mascot Quick-Launcher (Visible on pages other than Tutor and Demo) */}
      {currentPath !== '/student/tutor' && currentPath !== '/demo' && (
        <aside aria-label="Sathi AI Tutor launcher" className="fixed bottom-24 right-4 z-40 sm:bottom-6 sm:right-6">
          <button
            id="floating-sathi-quick-launch-btn"
            type="button"
            onClick={() => handleNavigate('/student/tutor')}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl transition-all hover:scale-105 border-2 border-white/80 group"
          >
            <Bot className="w-5 h-5 text-amber-300 animate-bounce" />
            <span className="hidden sm:inline">Ask Sathi AI</span>
          </button>
        </aside>
      )}

      {currentPath !== '/' && currentPath !== '/how-it-works' && currentPath !== '/demo' && (
        <MobileBottomNav
          currentRole={currentRole}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                VERNACRAFT
              </p>
              <p className="text-[11px] text-slate-500">
                AI-Powered Mother Tongue Pedagogy • Smart India Hackathon 2026
              </p>
            </div>
          </div>

          {/* Languages supported tag */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-600">
            <span className="text-slate-400">Supported Vernaculars:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">हिन्दी (Hindi)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">ముండారి (Mundari)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">ᱦᱳ (Ho)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">कुड़ुख़ (Kurukh)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">తెలుగు (Telugu)</span>
            <span className="px-2 py-0.5 rounded bg-slate-100">English</span>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span>Built for Primary Education Retention in Jharkhand</span>
          </div>
        </div>
      </footer>

      {/* Global Offline Status & Rural Low-Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
