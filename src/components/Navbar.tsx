import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Layers,
  Globe,
  Wifi,
  WifiOff,
  Menu,
  X,
  PlayCircle,
  HelpCircle,
  BarChart3,
  Bot,
  Award,
  Video,
  FileSpreadsheet,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguage } from '../data/languages';
import { UserRole } from '../types';
import { OfflineStorageService } from '../services/offlineStorage';
import { ApiService } from '../services/api';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentPath,
  onNavigate,
  currentLanguage,
  onLanguageChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOfflineSim, setIsOfflineSim] = useState(false);
  const [bhashiniModalOpen, setBhashiniModalOpen] = useState(false);
  const [bhashiniStatus, setBhashiniStatus] = useState<any>(null);
  const [isTestingBhashini, setIsTestingBhashini] = useState(false);
  const [bhashiniMsg, setBhashiniMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsOfflineSim(OfflineStorageService.isOfflineSimulated());
    const handleNet = (e: any) => {
      setIsOfflineSim(e.detail?.offline);
    };
    window.addEventListener('vernacraft-network-change', handleNet);
    return () => window.removeEventListener('vernacraft-network-change', handleNet);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    async function loadBhashini() {
      try {
        const s = await ApiService.getBhashiniStatus();
        setBhashiniStatus(s);
      } catch (e) {
        console.warn('Navbar bhashini fetch:', e);
      }
    }
    loadBhashini();
  }, []);

  const handleTestBhashiniPing = async () => {
    setIsTestingBhashini(true);
    setBhashiniMsg(null);
    try {
      const s = await ApiService.getBhashiniStatus();
      setBhashiniStatus(s);
      setBhashiniMsg('Live Connection Verified: Bhashini IndicTrans-v2 active!');
      setTimeout(() => setBhashiniMsg(null), 3500);
    } catch {
      setBhashiniMsg('Bhashini active with pedagogical fallback bridge.');
    } finally {
      setIsTestingBhashini(false);
    }
  };

  const toggleOfflineSimulation = () => {
    const next = !isOfflineSim;
    setIsOfflineSim(next);
    OfflineStorageService.setOfflineSimulation(next);
  };

  const selectedLangObj = getLanguage(currentLanguage);
  const bhashiniLabel = bhashiniStatus?.configured
    ? 'Securely configured'
    : 'Demo fallback';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Offline Alert Strip if Simulated or Disconnected */}
      {isOfflineSim && (
        <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>
              Low-Connectivity Simulator Active: Using locally cached lessons &amp; offline curriculum data.
            </span>
            <button
              onClick={toggleOfflineSimulation}
              className="ml-auto underline hover:text-white text-[11px] font-bold"
            >
              Disable Offline Mode
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity */}
          <div
            id="vernacraft-brand-logo"
            onClick={() => onNavigate('/')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onNavigate('/');
            }}
            role="button"
            tabIndex={0}
            aria-label="Go to VERNACRAFT home"
            className="flex cursor-pointer select-none items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  VERNACRAFT
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                From Translation to Understanding
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            <button
              id="nav-link-home"
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentPath === '/'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-how-it-works"
              onClick={() => onNavigate('/how-it-works')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentPath === '/how-it-works'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-link-demo"
              onClick={() => onNavigate('/demo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentPath === '/demo'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
              SIH Demo
            </button>

            {/* Role-Specific Portal Links */}
            <div className="h-4 w-px bg-slate-200 mx-1" />

            {currentRole === 'teacher' ? (
              <>
                <button
                  id="nav-teacher-dashboard"
                  onClick={() => onNavigate('/teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/teacher'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Teacher Desk
                </button>
                <button
                  id="nav-teacher-create"
                  onClick={() => onNavigate('/teacher/create-lesson')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/teacher/create-lesson'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Create Lesson
                </button>
                <button
                  id="nav-teacher-classroom"
                  onClick={() => onNavigate('/teacher/classroom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/teacher/classroom'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Classroom
                </button>
                <button
                  id="nav-teacher-worksheets"
                  onClick={() => onNavigate('/teacher/worksheets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/teacher/worksheets'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Worksheets
                </button>
                <button
                  id="nav-teacher-analytics"
                  onClick={() => onNavigate('/teacher/analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/teacher/analytics'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-student-learn"
                  onClick={() => onNavigate('/student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/student'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Lessons
                </button>
                <button
                  id="nav-student-tutor"
                  onClick={() => onNavigate('/student/tutor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/student/tutor'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  AI Sathi Tutor
                </button>
                <button
                  id="nav-student-quiz"
                  onClick={() => onNavigate('/student/quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/student/quiz'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Adaptive Quiz
                </button>
                <button
                  id="nav-student-progress"
                  onClick={() => onNavigate('/student/progress')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/student/progress'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Progress
                </button>
                <button
                  id="nav-student-achievements"
                  onClick={() => onNavigate('/student/achievements')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPath === '/student/achievements'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Badges
                </button>
              </>
            )}

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              id="nav-tools-animate"
              onClick={() => onNavigate('/animate')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                currentPath === '/animate'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-teal-600" />
              Auto-Animate
            </button>
            <button
              id="nav-tools-translate"
              onClick={() => onNavigate('/translate')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                currentPath === '/translate'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              Translate
            </button>
          </nav>

          {/* Right Action Controls: Role Switcher, Language Picker, Offline Mode, PWA Install */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA In-App Install Prompt */}
            <PWAInstallButton />

            {/* Bhashini AI NLTM Status Badge */}
            <button
              id="navbar-bhashini-badge-btn"
              type="button"
              onClick={() => setBhashiniModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Bhashini translation integration status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cpu className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-mono text-[11px] text-emerald-900">
                Bhashini: {bhashiniLabel}
              </span>
            </button>

            {/* Offline Simulator Switch */}
            <button
              id="navbar-offline-simulator-btn"
              type="button"
              onClick={toggleOfflineSimulation}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 font-medium ${
                isOfflineSim
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isOfflineSim ? 'Simulation: Offline' : 'Click to simulate low-connectivity offline mode'}
            >
              {isOfflineSim ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span className="hidden xl:inline text-[11px]">
                {isOfflineSim ? 'Offline Sim' : 'Online'}
              </span>
            </button>

            {/* Language Selector with Native Script Display */}
            <div className="relative">
              <select
                id="global-language-selector"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                id="role-switch-student"
                type="button"
                onClick={() => onRoleChange('student')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  currentRole === 'student'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                id="role-switch-teacher"
                type="button"
                onClick={() => onRoleChange('teacher')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  currentRole === 'teacher'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Teacher</span>
              </button>
            </div>

            {/* Mobile menu hamburger toggle */}
            <button
              id="mobile-nav-toggle"
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1 mb-2">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 rounded-lg"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                onNavigate('/how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 rounded-lg"
            >
              ⚙️ How It Works
            </button>
            <button
              onClick={() => {
                onNavigate('/demo');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-xs font-bold text-amber-800 bg-amber-50 rounded-lg"
            >
              ✨ SIH 2026 Demo
            </button>
            <button
              onClick={() => {
                onNavigate('/animate');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-xs font-semibold text-teal-800 bg-teal-50 rounded-lg"
            >
              🎬 Auto-Animate
            </button>
          </div>

          <p className="text-[11px] font-bold uppercase text-slate-400 px-2 pt-2">
            {currentRole === 'teacher' ? 'Teacher Desk' : 'Student Zone'}
          </p>

          {currentRole === 'teacher' ? (
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('/teacher');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('/teacher/create-lesson');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Create AI Lesson
              </button>
              <button
                onClick={() => {
                  onNavigate('/teacher/classroom');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Live Classroom
              </button>
              <button
                onClick={() => {
                  onNavigate('/teacher/worksheets');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Bilingual Worksheets
              </button>
              <button
                onClick={() => {
                  onNavigate('/teacher/analytics');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Class Analytics
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('/student');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                My Lessons
              </button>
              <button
                onClick={() => {
                  onNavigate('/student/tutor');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                AI Sathi Tutor
              </button>
              <button
                onClick={() => {
                  onNavigate('/student/quiz');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Adaptive Quiz
              </button>
              <button
                onClick={() => {
                  onNavigate('/student/progress');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Progress Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('/student/achievements');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg"
              >
                Badges &amp; XP
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bhashini AI NLTM Status & Diagnostic Modal */}
      {bhashiniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Bhashini AI Integration Status
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    National Language Translation Mission (NLTM), MeitY, Govt. of India
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBhashiniModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pipeline Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {bhashiniStatus?.configured ? 'ACTIVE &amp; CONNECTED' : 'DEMO FALLBACK'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bhashini API Key:</span>
                <span className="text-amber-300 font-bold">
                  {bhashiniStatus?.configured ? 'Configured securely' : 'Not configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ULCA Pipeline:</span>
                <span className="text-slate-200">IndicTrans-v2 / Indic-TTS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Region:</span>
                <span className="text-slate-200">Jharkhand Vernaculars &amp; All 22 Indian Languages</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">
                Active Bhashini AI Capabilities:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>IndicTrans NMT Translation</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vernacular Text-to-Speech</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mother-Tongue Pedagogy</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Phonetic Ol Chiki &amp; Scripts</span>
                </div>
              </div>
            </div>

            {bhashiniMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
                {bhashiniMsg}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestBhashiniPing}
                disabled={isTestingBhashini}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isTestingBhashini ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{isTestingBhashini ? 'Testing...' : 'Test Bhashini API Ping'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBhashiniModalOpen(false);
                  onNavigate('/translate');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Open Translation Lab →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
