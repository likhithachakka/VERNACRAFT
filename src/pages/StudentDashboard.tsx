import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Play,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { Lesson, StudentProgress } from '../types';
import { DEMO_STUDENT_PROGRESS } from '../data/demoData';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectLesson,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<StudentProgress>(DEMO_STUDENT_PROGRESS);

  useEffect(() => {
    async function load() {
      const [lList, pData] = await Promise.all([
        ApiService.getLessons(),
        ApiService.getStudentProgress(),
      ]);
      setLessons(lList);
      setProgress(pData);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg border-2 border-amber-300">
              👦🏽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-bold uppercase">
                  Class 4 Primary
                </span>
                <span className="text-emerald-100 text-xs">GPS Ormanjhi, Ranchi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Johar, Birsa Hembrom! 🌾
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Ready to explore nature in your mother tongue today?
              </p>
            </div>
          </div>

          {/* Gamified Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">
                  Streak
                </span>
                <span className="text-base font-black leading-none">
                  {progress.streakDays} Days 🔥
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">
                  Total XP
                </span>
                <span className="text-base font-black leading-none">
                  {progress.totalXp} XP 🏆
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/student/tutor')}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-102"
            >
              <Bot className="w-4 h-4" />
              <span>Talk with Sathi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Quick Access Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('/student/tutor')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
              🤖
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Ask Sathi AI Tutor</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Speak or type in Santhali or Hindi!
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('/student/quiz')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
              ❓
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Adaptive Quiz Challenge</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Earn badges and test your understanding!
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('/student/achievements')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0">
              🏅
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">My Achievements &amp; Badges</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4 badges unlocked so far!
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Lessons Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                My Assigned Lessons
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Stories and animated lessons assigned by Teacher Shalini
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Class 4 EVS &amp; Math
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      Class {lesson.grade} • {lesson.subject}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Offline Ready
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {lesson.pedagogy.vernacularExplanation}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                    💡 <span className="font-bold">Village Analogy:</span> {lesson.pedagogy.relatableAnalogy}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    +50 XP on completion
                  </span>

                  <button
                    id={`student-play-lesson-${lesson.id}`}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onNavigate('/student/quiz');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch &amp; Learn</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
