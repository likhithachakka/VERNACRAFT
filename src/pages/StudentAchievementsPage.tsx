import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { StudentProgress } from '../types';
import { DEMO_STUDENT_PROGRESS } from '../data/demoData';

interface StudentAchievementsPageProps {
  onNavigate: (path: string) => void;
}

export const StudentAchievementsPage: React.FC<StudentAchievementsPageProps> = ({
  onNavigate,
}) => {
  const [progress, setProgress] = useState<StudentProgress>(DEMO_STUDENT_PROGRESS);

  useEffect(() => {
    async function load() {
      const data = await ApiService.getStudentProgress();
      if (data) setProgress(data);
    }
    load();
  }, []);

  const allBadges = [
    {
      id: 'badge-water-hero',
      title: 'Water Cycle Master 💧',
      description: 'Understood evaporation and condensation using the Chulha analogy.',
      unlocked: true,
      earnedDate: 'Yesterday',
    },
    {
      id: 'badge-quiz-veera',
      title: 'Quiz Veera 🏆',
      description: 'Completed 5 adaptive comprehension quizzes in mother tongue.',
      unlocked: true,
      earnedDate: 'Today',
    },
    {
      id: 'badge-streak-5',
      title: '5-Day Learning Flame 🔥',
      description: 'Learned with Sathi five days in a row.',
      unlocked: true,
      earnedDate: '3 days ago',
    },
    {
      id: 'badge-plant-life',
      title: 'Young Botanist 🌿',
      description: 'Explored how green leaves make food through the plant kitchen lesson.',
      unlocked: true,
      earnedDate: 'Last week',
    },
    {
      id: 'badge-fraction-wizard',
      title: 'Village Roti Mathematician 🍕',
      description: 'Mastered 1/2, 1/4 and 1/8 fractions through village sharing.',
      unlocked: false,
      requirement: 'Complete Fractions Quiz with &gt; 80% score',
    },
    {
      id: 'badge-polyglot-explorer',
      title: 'Mother Tongue Scholar 📜',
      description: 'Explored lessons in both Santhali Ol Chiki and Hindi.',
      unlocked: false,
      requirement: 'Study lessons in 2 different mother tongues',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 text-xs font-black uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Birsa&apos;s Honors &amp; Badges</span>
            </div>
            <h1 className="text-3xl font-black text-slate-950">
              Achievements &amp; Learning XP
            </h1>
            <p className="text-xs sm:text-sm text-amber-950 mt-1 font-semibold">
              Every lesson you understand in your mother tongue unlocks shiny badges!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/40">
            <span className="text-3xl">🏅</span>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-950 block">
                Current Level
              </span>
              <span className="text-xl font-black text-slate-950">
                Level 4: Young Naturalist
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* XP Progress Bar towards Next Level */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Experience Points</span>
              <h3 className="text-lg font-black text-slate-900">
                {progress.totalXp} / 500 XP to Level 5
              </h3>
            </div>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              70% to Next Rank
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
              style={{ width: `${(progress.totalXp / 500) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {allBadges.map((b) => (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-white border-amber-300 shadow-xs hover:shadow-md'
                  : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{b.unlocked ? '🎖️' : '🔒'}</span>
                  {b.unlocked ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Unlocked {b.earnedDate}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Locked
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.description}
                </p>
              </div>

              {!b.unlocked && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                  Target: {b.requirement}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/student')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <span>Continue Learning Lessons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
