import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Video,
  FileSpreadsheet,
  BarChart3,
  Users,
  Award,
  AlertTriangle,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { OfflineStorageService } from '../services/offlineStorage';
import { Lesson } from '../types';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigate,
  onSelectLesson,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [lData, aData] = await Promise.all([
          ApiService.getLessons(),
          ApiService.getClassAnalytics(),
        ]);
        setLessons(lData);
        setAnalytics(aData);
      } catch (err) {
        console.error('Failed to load teacher dashboard data:', err);
        setLessons(OfflineStorageService.getCachedLessons());
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                Teacher Desk
              </span>
              <span className="text-xs text-slate-500">
                Govt. Primary School Ormanjhi, Ranchi (Class 4)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Namaste, Shalini Murmu Ji 🙏
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Here is your vernacular pedagogy cockpit for today&apos;s mother-tongue classroom.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="teacher-create-lesson-cta"
              onClick={() => onNavigate('/teacher/create-lesson')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create AI Lesson</span>
            </button>

            <button
              id="teacher-launch-classroom-cta"
              onClick={() => onNavigate('/teacher/classroom')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Classroom Projector</span>
            </button>

            <button
              id="teacher-worksheet-cta"
              onClick={() => onNavigate('/teacher/worksheets')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>Bilingual Worksheets</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Students Enrolled</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              {analytics?.totalStudents || 34}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">
              28 active in school today
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Avg Mastery Rate</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              {analytics?.averageMastery || 76.5}%
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">
              +18% since vernacular switch
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Lessons Prepared</span>
              <BookOpen className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              {lessons.length || 2}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              100% offline-cached
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Mother Tongues</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">5</span>
            <span className="text-[11px] text-indigo-700 font-bold block mt-1">
              Santhali, Hindi, Mundari, Ho, Kurukh
            </span>
          </div>
        </div>

        {/* Misconception Alert Box */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Class Pedagogical Alert
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                42% of Class 4 students confused &quot;Evaporation&quot; with &quot;Boiling&quot;
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Recommended action: Show the Chulha Steam &amp; Cold Plate visual analogy in today&apos;s classroom session.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/teacher/classroom')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
          >
            Launch Remediation Lesson →
          </button>
        </div>

        {/* Prepared Lessons Catalog */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Prepared Curriculum Lessons
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready for classroom projection or individual student self-study
              </p>
            </div>
            <button
              onClick={() => onNavigate('/teacher/create-lesson')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>+ New Lesson</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      Class {lesson.grade} • {lesson.subject}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {lesson.animationProject.scenes.length} Scenes
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    💡 <span className="font-semibold">Local Analogy:</span> {lesson.pedagogy.relatableAnalogy}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Offline Ready
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectLesson(lesson.id);
                        onNavigate('/teacher/classroom');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Teach Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
