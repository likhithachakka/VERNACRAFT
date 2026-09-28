import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Video,
  CheckCircle2,
  Loader2,
  Lightbulb,
  FileText,
  Volume2,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { DynamicAnimationCanvas } from '../components/DynamicAnimationCanvas';
import { Lesson } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface CreateLessonPageProps {
  onNavigate: (path: string) => void;
  onLessonCreated: (lesson: Lesson) => void;
}

export const CreateLessonPage: React.FC<CreateLessonPageProps> = ({
  onNavigate,
  onLessonCreated,
}) => {
  const [topic, setTopic] = useState('Seed Germination');
  const [grade, setGrade] = useState(4);
  const [subject, setSubject] = useState('Environmental Studies');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [contextPrompt, setContextPrompt] = useState(
    'Relate this to sowing seeds in the red soil of Chota Nagpur before the monsoon.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPedagogy, setGeneratedPedagogy] = useState<any>(null);
  const [generatedAnimation, setGeneratedAnimation] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const quickTopics = [
    'Seed Germination',
    'Water Cycle',
    'Photosynthesis',
    'Fractions (1/2, 1/4)',
    'Forest Ecosystem of Saranda',
    'Solar System & Seasons',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setGeneratedPedagogy(null);
    setGeneratedAnimation(null);
    setSavedSuccess(false);

    try {
      // Step 1: AI Pedagogy Generation
      const pedagogy = await ApiService.generatePedagogy({
        topic,
        grade,
        subject,
        teachingLanguage: 'en',
        targetLanguage,
        context: contextPrompt,
      });
      setGeneratedPedagogy(pedagogy);

      // Step 2: Context-to-Animation Generation
      const animation = await ApiService.generateAnimation({
        topic,
        grade,
        language: targetLanguage,
        customPrompt: contextPrompt,
      });
      setGeneratedAnimation(animation);
    } catch (err) {
      console.error('Lesson creation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!generatedPedagogy || !generatedAnimation) return;

    const newLesson: Partial<Lesson> = {
      title: `${topic} (Class ${grade})`,
      grade,
      subject,
      topic,
      teachingLanguage: 'en',
      targetLanguage,
      pedagogy: generatedPedagogy,
      animationProject: generatedAnimation,
    };

    const saved = await ApiService.createLesson(newLesson);
    setSavedSuccess(true);
    onLessonCreated(saved);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Vernacular Lesson Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Generate Mother-Tongue Lesson with Dynamic Animation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transform any textbook topic into an intuitive, village-grounded lesson with synchronized multi-scene animations.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Creation Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
        >
          {/* Quick Topic Chips */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Select or Type Educational Concept:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    topic === t
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              id="create-lesson-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Seed Germination, Fractions, Pollination..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          {/* Grade, Subject, Target Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class / Grade Level
              </label>
              <select
                id="create-lesson-grade-select"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={3}>Class 3 (Age 8)</option>
                <option value={4}>Class 4 (Age 9)</option>
                <option value={5}>Class 5 (Age 10)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject
              </label>
              <select
                id="create-lesson-subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Environmental Studies">Environmental Studies (EVS)</option>
                <option value="General Science">General Science</option>
                <option value="Mathematics">Mathematics (Fractions/Geometry)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Vernacular Language
              </label>
              <select
                id="create-lesson-lang-select"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Local Context Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Local Rural / Village Grounding Context (Optional):
            </label>
            <textarea
              id="create-lesson-context-textarea"
              rows={2}
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
              placeholder="e.g. Relate to village farming, monsoon clouds, pond water, or kitchen hearth..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="submit-generate-lesson-btn"
              type="submit"
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Pedagogy &amp; Dynamic Animation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Lesson &amp; Animation</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Showcase */}
        {generatedPedagogy && generatedAnimation && (
          <div className="mt-10 space-y-8">
            {/* Pedagogical Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    AI Pedagogical Blueprint
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    {topic} — Mother-Tongue Teaching Plan
                  </h2>
                </div>
                <button
                  id="save-lesson-to-catalog-btn"
                  onClick={handleSaveLesson}
                  disabled={savedSuccess}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savedSuccess ? 'Saved to Catalog!' : 'Save Lesson'}</span>
                </button>
              </div>

              {/* Vernacular Explanation & Analogy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">
                    Mother-Tongue Explanation ({targetLanguage}):
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {generatedPedagogy.vernacularExplanation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold text-amber-900 block mb-1">
                    💡 Relatable Village Analogy:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {generatedPedagogy.relatableAnalogy}
                  </p>
                </div>
              </div>

              {/* Concept Breakdown Steps */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
                  Concept Sequencing for Class {grade}:
                </h3>
                <div className="space-y-1.5">
                  {generatedPedagogy.conceptBreakdown?.map((step: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2"
                    >
                      <span className="font-bold text-emerald-700">{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glossary */}
              {generatedPedagogy.vocabularyGlossary && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Bilingual Key Vocabulary:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedPedagogy.vocabularyGlossary.map((vocab: any, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-900">{vocab.english}</span>
                        <span className="font-semibold text-emerald-700">{vocab.vernacular}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generated Context-to-Animation Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  Generated Multi-Scene Animation Player
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {generatedAnimation.scenes.length} Interactive Scenes
                </span>
              </div>
              <DynamicAnimationCanvas
                project={generatedAnimation}
                activeLanguage={targetLanguage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
