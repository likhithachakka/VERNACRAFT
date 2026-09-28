import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { ApiService } from '../services/api';

export const TeacherAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await ApiService.getClassAnalytics();
      setAnalytics(data);
    }
    load();
  }, []);

  const topicsMastery = [
    { topic: 'Water Cycle & Evaporation', mastery: 92, status: 'Mastered' },
    { topic: 'Plant Food & Photosynthesis', mastery: 78, status: 'Good Progress' },
    { topic: 'Fractions (Village Roti Sharing)', mastery: 64, status: 'Needs Support' },
    { topic: 'Seed Germination & Soil', mastery: 85, status: 'Mastered' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Learning Analytics &amp; Pedagogy Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Class 4 Learning &amp; Misconception Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time insights on curriculum retention, vernacular engagement, and diagnostic misconceptions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Class Average</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">76.5%</span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">
              +18% from Baseline
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Students Assessed</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">28 / 34</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              82% participation
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Identified Misconceptions</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">3</span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">
              2 resolved via Sathi
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Offline Lessons</span>
            <span className="text-2xl font-black text-teal-600 mt-1 block">100%</span>
            <span className="text-[11px] text-teal-700 font-bold block mt-1">
              Sync complete
            </span>
          </div>
        </div>

        {/* Two-Column Analytics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Mastery Progress Bars */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Curriculum Topic Mastery Rates</span>
              <span className="text-xs text-slate-400 font-normal">Class 4 EVS &amp; Math</span>
            </h3>

            <div className="space-y-4">
              {topicsMastery.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.topic}</span>
                    <span className="text-emerald-700 font-bold">{item.mastery}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.mastery >= 80
                          ? 'bg-emerald-500'
                          : item.mastery >= 65
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mother Tongue Usage Distribution */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Vernacular Language Engagement</span>
              <span className="text-xs text-slate-400 font-normal">Mother Tongue Demographics</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'हिन्दी (Hindi)', percent: 42, color: 'bg-emerald-500' },
                { name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali - Ol Chiki)', percent: 36, color: 'bg-teal-500' },
                { name: 'मुण्डारी (Mundari)', percent: 12, color: 'bg-indigo-500' },
                { name: 'ᱦᱳ (Ho)', percent: 6, color: 'bg-amber-500' },
                { name: 'कुड़ुख़ (Kurukh)', percent: 4, color: 'bg-rose-500' },
              ].map((lang, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                    <span className="font-semibold text-slate-800">{lang.name}</span>
                  </div>
                  <span className="font-bold text-slate-600">{lang.percent}%</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              💡 <span className="font-semibold">Observation:</span> 58% of learners engage primarily in indigenous tribal mother tongues (Santhali, Mundari, Ho, Kurukh).
            </div>
          </div>
        </div>

        {/* Misconception Diagnostic Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Diagnosed Class Misconceptions &amp; Auto-Remedies</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Tested Concept</th>
                  <th className="p-3">Detected Misconception</th>
                  <th className="p-3">Class Frequency</th>
                  <th className="p-3">Vernacular Remedy Applied</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Cloud Formation</td>
                  <td className="p-3">Thought clouds are made of cotton / smoke</td>
                  <td className="p-3 font-bold text-amber-700">42% initially</td>
                  <td className="p-3">Boiling Chulha Pot &amp; Cold Metal Lid Analogy</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Resolved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Plant Feeding</td>
                  <td className="p-3">Assumed plants eat dirt from soil like food</td>
                  <td className="p-3 font-bold text-amber-700">31%</td>
                  <td className="p-3">Green Leaf Kitchen Analogy</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Resolved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Fractions (1/4)</td>
                  <td className="p-3">Thought 1/4 is bigger than 1/2 because 4 &gt; 2</td>
                  <td className="p-3 font-bold text-rose-700">54%</td>
                  <td className="p-3">Sharing Roti between 2 vs 4 hungry siblings</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      In Progress
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
