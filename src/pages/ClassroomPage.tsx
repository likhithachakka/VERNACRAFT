import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  RotateCcw,
  Languages,
  BookOpen,
  Volume2,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { DynamicAnimationCanvas } from '../components/DynamicAnimationCanvas';
import { AICharacter } from '../components/AICharacter';
import { Lesson } from '../types';
import { DEMO_WATER_CYCLE_LESSON } from '../data/demoData';

interface ClassroomPageProps {
  selectedLessonId?: string;
  onNavigate: (path: string) => void;
}

export const ClassroomPage: React.FC<ClassroomPageProps> = ({
  selectedLessonId,
  onNavigate,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([DEMO_WATER_CYCLE_LESSON]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(DEMO_WATER_CYCLE_LESSON);
  const [activeLanguage, setActiveLanguage] = useState('hi');
  const [isWideScreenMode, setIsWideScreenMode] = useState(false);
  const [bhashiniActive, setBhashiniActive] = useState(false);

  useEffect(() => {
    async function load() {
      const list = await ApiService.getLessons();
      if (list && list.length > 0) {
        setLessons(list);
        if (selectedLessonId) {
          const match = list.find((l) => l.id === selectedLessonId);
          if (match) setActiveLesson(match);
        } else {
          setActiveLesson(list[0]);
        }
      }
      try {
        const bStatus = await ApiService.getBhashiniStatus();
        setBhashiniActive(Boolean(bStatus?.configured));
      } catch (_) {}
    }
    load();
  }, [selectedLessonId]);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* Classroom Mode Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Classroom Live Mode
                </span>
                <span className="text-xs text-slate-400">Projector / Smartboard Optimized</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          {/* Lesson & Language Dropdowns & Bhashini Badge */}
          <div className="flex flex-wrap items-center gap-3">
            {bhashiniActive && (
              <div
                title="Bhashini AI National Language Translation Mission connected with active API key"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-800/80 text-[11px] text-emerald-400 font-mono shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bhashini AI: securely configured</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="classroom-lesson-picker"
                value={activeLesson.id}
                onChange={(e) => {
                  const found = lessons.find((l) => l.id === e.target.value);
                  if (found) setActiveLesson(found);
                }}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {lessons.map((l) => (
                  <option key={l.id} value={l.id} className="bg-slate-900 text-white">
                    {l.title} (Class {l.grade})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="classroom-lang-picker"
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                <option value="sat" className="bg-slate-900 text-white">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
              </select>
            </div>

            <button
              onClick={() => setIsWideScreenMode(!isWideScreenMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                isWideScreenMode
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Toggle Projector Theater Full Width Mode"
            >
              <span>{isWideScreenMode ? 'Standard View' : 'Full Smartboard View'}</span>
            </button>

            <button
              onClick={() => onNavigate('/teacher/worksheets')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>Print Worksheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Sathi Stage */}
      <div className={`${isWideScreenMode ? 'max-w-[98%]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 mt-6 transition-all duration-300`}>
        <div className={`grid grid-cols-1 ${isWideScreenMode ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          {/* Main Animation Stage */}
          <div className={isWideScreenMode ? 'w-full' : 'lg:col-span-9'}>
            <DynamicAnimationCanvas
              project={activeLesson.animationProject}
              activeLanguage={activeLanguage}
            />

            {/* Quick Teaching Notes below canvas */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                  💡 Teacher Talking Points &amp; Village Metaphor
                </span>
                <span>Class {activeLesson.grade} Curriculum Anchor</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {activeLesson.pedagogy.relatableAnalogy}
              </p>
              <p className="text-slate-400 italic">
                Local Story: {activeLesson.pedagogy.localContextStory}
              </p>
            </div>
          </div>

          {/* Sathi Classroom Assistant Sidebar */}
          <div className={`bg-slate-950 rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 ${isWideScreenMode ? 'w-full' : 'lg:col-span-3'}`}>
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Sathi Teaching Mascot</span>
              </div>

              <div className="flex justify-center py-2">
                <AICharacter
                  state="explaining"
                  speechText="Ask the class: What happens to a puddle in the schoolyard after the sun comes out?"
                  vernacularSpeechText="ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱩᱞᱤ ᱠᱚᱯᱮ: ᱵᱤᱫᱭᱟᱞᱚᱭ ᱨᱟᱪᱟ ᱨᱮ ᱡᱟᱣᱨᱟ ᱟᱠᱟᱱ ᱫᱟᱜ ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱛᱮ ᱚᱠᱟ ᱥᱮᱫ ᱥᱮᱱᱚᱜ-ᱟ?"
                  language={activeLanguage}
                  size="sm"
                />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">
                  Comprehension Check Question:
                </span>
                <p className="text-slate-200 font-medium">
                  &ldquo;Can anyone point to the water vapor rising in the animation?&rdquo;
                </p>
              </div>
            </div>

            {/* End Session Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => onNavigate('/teacher')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold text-center transition-colors"
              >
                Exit Classroom Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
