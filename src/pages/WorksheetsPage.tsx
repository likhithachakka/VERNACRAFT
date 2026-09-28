import React, { useState, useEffect } from 'react';
import {
  Printer,
  FileSpreadsheet,
  PlusCircle,
  Download,
  Languages,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { Worksheet } from '../types';
import { DEMO_WORKSHEET } from '../data/demoData';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface WorksheetsPageProps {
  onNavigate: (path: string) => void;
}

export const WorksheetsPage: React.FC<WorksheetsPageProps> = () => {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([DEMO_WORKSHEET]);
  const [activeWorksheet, setActiveWorksheet] = useState<Worksheet>(DEMO_WORKSHEET);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicInput, setTopicInput] = useState('Photosynthesis');
  const [targetLang, setTargetLang] = useState('hi');
  const [gradeInput, setGradeInput] = useState(4);

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await ApiService.generateWorksheet({
        topic: topicInput,
        grade: gradeInput,
        subject: 'Environmental Studies',
        primaryLanguage: 'en',
        vernacularLanguage: targetLang,
      });
      setWorksheets([generated, ...worksheets]);
      setActiveWorksheet(generated);
    } catch (err) {
      console.error('Failed to generate worksheet:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 print:bg-white print:p-0">
      {/* Top Header - Hidden when printing */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bilingual Classroom Worksheets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Printable Mother-Tongue Learning Sheets
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Designed for low-resource classrooms where every student can take home a physical bilingual worksheet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="print-worksheet-btn"
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 print:m-0 print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Worksheet Creator & Catalog (Hidden in Print) */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Generate New Card */}
            <form
              onSubmit={handleGenerateNew}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Generate Worksheet</span>
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Topic:
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Class / Grade:
                </label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value={3}>Class 3</option>
                  <option value={4}>Class 4</option>
                  <option value={5}>Class 5</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Vernacular Language:
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isGenerating ? 'Generating...' : '+ Generate Sheet'}
              </button>
            </form>

            {/* Existing Sheets */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">
                Saved Worksheets
              </h3>
              <div className="space-y-2">
                {worksheets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setActiveWorksheet(w)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                      activeWorksheet.id === w.id
                        ? 'border-emerald-500 bg-emerald-50/60 font-bold text-emerald-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">{w.topic}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Class {w.grade} • {w.vernacularLanguage.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: The Printable Document Sheet */}
          <div className="lg:col-span-3">
            <div
              id="printable-worksheet-container"
              className="bg-white rounded-3xl p-8 md:p-12 border-2 border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 font-sans"
            >
              {/* Top School Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <div className="flex items-center justify-between text-xs text-slate-600 uppercase tracking-widest font-mono">
                  <span>JCERT Curriculum Aligned</span>
                  <span>Primary Vernacular Pedagogy</span>
                  <span>Class {activeWorksheet.grade}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 text-center mt-2">
                  GOVERNMENT PRIMARY SCHOOL, ORMANJHI
                </h2>
                <p className="text-center font-bold text-slate-700 text-sm">
                  Topic: {activeWorksheet.topic} ({activeWorksheet.subject})
                </p>

                {/* Fillable Student Info Strip */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-dashed border-slate-300 text-xs font-semibold">
                  <div>
                    <span className="text-slate-500">Student Name: </span>
                    <span className="border-b border-slate-700 inline-block w-36" />
                  </div>
                  <div>
                    <span className="text-slate-500">Roll No: </span>
                    <span className="border-b border-slate-700 inline-block w-16" />
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Date: </span>
                    <span className="border-b border-slate-700 inline-block w-24" />
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  🎯 Learning Objectives:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                  {activeWorksheet.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Sections & Questions */}
              <div className="space-y-8">
                {activeWorksheet.sections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-4">
                    <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {sec.sectionTitle}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {sec.instructions.en} / {sec.instructions.vernacular}
                      </p>
                    </div>

                    <div className="space-y-5 pl-2">
                      {sec.questions.map((q) => (
                        <div key={q.qNumber} className="text-xs space-y-1.5">
                          <div className="font-bold text-slate-900">
                            Q{q.qNumber}. {q.questionTextEn}
                          </div>
                          <div className="font-medium text-emerald-800 italic">
                            ({q.questionTextVernacular})
                          </div>

                          {/* Options if multiple choice */}
                          {q.options && (
                            <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-400" />
                                  <span className="text-slate-800">{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Answer lines if open answer */}
                          {q.answerLines && (
                            <div className="space-y-3 pt-2">
                              {Array.from({ length: q.answerLines }).map((_, lineIdx) => (
                                <div
                                  key={lineIdx}
                                  className="border-b border-dashed border-slate-300 w-full h-4"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Section: Draw & Relate to Village */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 mb-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Creative Activity: Draw &amp; Label in Mother Tongue
                    </h3>
                    <p className="text-xs text-slate-600">
                      Draw a real example from your village and write the names in your mother tongue.
                    </p>
                  </div>
                  <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
                    (Space for Student Drawing &amp; Vernacular Labeling)
                  </div>
                </div>

                {/* Teacher Signature Footer */}
                <div className="pt-8 border-t-2 border-slate-900 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Teacher Signature: ______________</span>
                  <span>Marks / Grade: _________</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
