import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import { Modality } from '@google/genai';
import {
  generatePedagogicalLesson,
  generateContextToAnimation,
  getAITutorResponse,
  translateEducationalText,
  isAIAvailable,
  getAI,
  transcribeAudioWithGemini,
  generateVeoVideo,
  getVeoVideoStatus,
  liveConverseWithGemini,
} from './server/aiService';
import { BhashiniService } from './server/bhashiniService';
import { demoStore } from './server/demoStore';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Vernacraft API',
    aiAvailable: isAIAvailable(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/languages', (req, res) => {
  res.json(demoStore.languages);
});

app.get('/api/curriculum', (req, res) => {
  res.json(demoStore.curriculum);
});

app.get('/api/lessons', (req, res) => {
  res.json(demoStore.getLessons());
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = demoStore.getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  res.json(lesson);
});

app.post('/api/lessons', (req, res) => {
  const lessonData = req.body;
  if (!lessonData.title || !lessonData.topic) {
    return res.status(400).json({ error: 'Title and topic are required' });
  }
  const created = demoStore.addLesson({
    id: 'lesson-' + Date.now(),
    createdAt: new Date().toISOString(),
    isOfflineAvailable: true,
    ...lessonData,
  });
  res.json(created);
});

app.post('/api/ai/pedagogy-explain', async (req, res) => {
  try {
    const { topic, grade = 4, subject = 'Environmental Studies', teachingLanguage = 'en', targetLanguage = 'hi', context } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const result = await generatePedagogicalLesson({
      topic,
      grade: Number(grade),
      subject,
      teachingLanguage,
      targetLanguage,
      context,
    });
    res.json(result);
  } catch (err: any) {
    console.error('Error generating pedagogy:', err);
    res.status(500).json({ error: err.message || 'Failed to generate pedagogy' });
  }
});

app.post('/api/ai/generate-animation', async (req, res) => {
  try {
    const { topic, grade = 4, language = 'hi', customPrompt } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const project = await generateContextToAnimation({
      topic,
      grade: Number(grade),
      language,
      customPrompt,
    });
    res.json(project);
  } catch (err: any) {
    console.error('Error generating animation:', err);
    res.status(500).json({ error: err.message || 'Failed to generate animation' });
  }
});

app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { studentMessage, currentTopic = 'Water Cycle', grade = 4, language = 'hi', confusionLevel = 1 } = req.body;
    if (!studentMessage) {
      return res.status(400).json({ error: 'Student message is required' });
    }
    const tutorResponse = await getAITutorResponse({
      studentMessage,
      currentTopic,
      grade: Number(grade),
      language,
      confusionLevel: Number(confusionLevel),
    });
    res.json({
      ...tutorResponse,
      message: tutorResponse.tutorSpeech,
    });
  } catch (err: any) {
    console.error('Error in tutor chat:', err);
    res.status(500).json({ error: err.message || 'Tutor error' });
  }
});

app.post('/api/ai/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'en', targetLang = 'hi', gradeLevel = 4 } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const translated = await translateEducationalText({
      text,
      sourceLang,
      targetLang,
      gradeLevel: Number(gradeLevel),
    });
    // Enrich with Bhashini engine metadata
    const bhashiniStatus = BhashiniService.getStatus();
    res.json({
      ...translated,
      bhashini: {
        active: bhashiniStatus.configured,
        service: bhashiniStatus.service,
      },
    });
  } catch (err: any) {
    console.error('Error in translation:', err);
    res.status(500).json({ error: err.message || 'Translation error' });
  }
});

// Bhashini AI Specific Endpoints
app.get('/api/bhashini/status', (req, res) => {
  res.json(BhashiniService.getStatus());
});

app.post('/api/bhashini/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'en', targetLang = 'hi', gradeLevel = 4 } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for Bhashini translation' });
    }
    const result = await BhashiniService.translate({
      text,
      sourceLang,
      targetLang,
      gradeLevel: Number(gradeLevel),
    });
    res.json(result);
  } catch (err: any) {
    console.error('Error in Bhashini translation:', err);
    res.status(500).json({ error: err.message || 'Bhashini translation failed' });
  }
});

app.post('/api/bhashini/phonetics', (req, res) => {
  const { text, language = 'hi' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  res.json(BhashiniService.synthesizePhonetics({ text, language }));
});

app.post('/api/bhashini/simplify', (req, res) => {
  const { query, language = 'hi', gradeLevel = 4 } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  res.json(BhashiniService.simplifyConcept({ query, language, gradeLevel }));
});

// Route Aliases & AI Status
app.get('/api/ai/status', (req, res) => {
  res.json({
    geminiAvailable: isAIAvailable(),
    bhashini: BhashiniService.getStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/ai/generate-pedagogy', async (req, res) => {
  try {
    const { topic, grade = 4, subject = 'Environmental Studies', teachingLanguage = 'en', targetLanguage = 'hi', context } = req.body;
    const pedagogy = await generatePedagogicalLesson({
      topic,
      grade: Number(grade),
      subject,
      teachingLanguage,
      targetLanguage,
      context,
    });
    res.json(pedagogy);
  } catch (err: any) {
    console.error('Error generating pedagogy:', err);
    res.status(500).json({ error: err.message || 'Failed to generate pedagogy' });
  }
});

app.get('/api/offline-bundle', (req, res) => {
  const lang = (req.query.lang as string) || 'hi';
  res.json({
    language: lang,
    bundleId: 'bundle-jharkhand-' + lang,
    lessons: demoStore.getLessons(),
    quizzes: demoStore.getQuizzes(),
    cachedAt: new Date().toISOString(),
    bhashiniOfflineGlossary: true,
  });
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = demoStore.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  res.json(quiz);
});

app.post('/api/quiz/submit', (req, res) => {
  try {
    const { studentId = 'student-birsa-01', quizId, answers = {} } = req.body;
    const quiz = demoStore.getQuizById(quizId) || demoStore.getQuizzes()[0];

    let score = 0;
    const understoodConcepts: string[] = [];
    const weakConcepts: string[] = [];
    const misconceptionsDetected: any[] = [];

    quiz.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns !== undefined && String(studentAns) === String(q.correctAnswer)) {
        score++;
        understoodConcepts.push(q.conceptTested);
      } else {
        weakConcepts.push(q.conceptTested);
        const guidance = q.misconceptionGuidance?.[String(studentAns)] || 'Review foundational concept';
        misconceptionsDetected.push({
          questionId: q.id,
          chosenAnswer: studentAns,
          misconception: guidance,
          remedyPedagogy: q.vernacularExplanation,
          visualMetaphor: 'Boiling Kettle Lid & Morning Mist',
        });
      }
    });

    const attempt = {
      id: 'att-' + Date.now(),
      studentId,
      quizId: quiz.id,
      answers,
      score,
      maxScore: quiz.questions.length,
      understoodConcepts,
      weakConcepts,
      misconceptionsDetected,
      adaptedNextActivity:
        score === quiz.questions.length
          ? 'Advance to Next Chapter: Plant Life & Photosynthesis'
          : 'Interactive Micro-Lesson: Chulha Vapor Analogy',
      timestamp: new Date().toISOString(),
    };

    const updatedProgress = demoStore.recordQuizAttempt(attempt);

    res.json({
      attempt,
      progress: updatedProgress,
    });
  } catch (err: any) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ error: err.message || 'Quiz submission failed' });
  }
});

app.get('/api/student/progress', (req, res) => {
  res.json(demoStore.getStudentProgress());
});

app.get('/api/teacher/analytics', (req, res) => {
  res.json(demoStore.getClassAnalytics());
});

// Route Aliases for Teacher & Student Analytics
app.get('/api/analytics/classroom', (req, res) => {
  res.json(demoStore.getClassAnalytics());
});

app.get('/api/students/:id/progress', (req, res) => {
  res.json(demoStore.getStudentProgress());
});

app.post('/api/quizzes/submit', (req, res) => {
  // Delegate directly to submit handler logic
  try {
    const { studentId = 'student-birsa-01', quizId, answers = {} } = req.body;
    const quiz = demoStore.getQuizById(quizId) || demoStore.getQuizzes()[0];
    let score = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] !== undefined && String(answers[q.id]) === String(q.correctAnswer)) score++;
    });
    const attempt = {
      id: 'att-' + Date.now(),
      studentId,
      quizId: quiz.id,
      answers,
      score,
      maxScore: quiz.questions.length,
      understoodConcepts: ['Bhashini Vernacular Tested Concept'],
      weakConcepts: [],
      misconceptionsDetected: [],
      adaptedNextActivity: 'Advance to Next Topic',
      timestamp: new Date().toISOString(),
    };
    const updatedProgress = demoStore.recordQuizAttempt(attempt);
    res.json({ attempt, progress: updatedProgress });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Quiz submit error' });
  }
});

app.get('/api/worksheets', (req, res) => {
  res.json(demoStore.getWorksheets());
});

app.post('/api/worksheet/generate', (req, res) => {
  const { topic, grade = 4, subject = 'Environmental Studies', primaryLanguage = 'en', vernacularLanguage = 'hi' } = req.body;
  const newWorksheet = {
    id: 'worksheet-' + Date.now(),
    grade: Number(grade),
    subject,
    topic,
    primaryLanguage,
    vernacularLanguage,
    learningObjectives: [
      `Understand foundational vocabulary of ${topic} in both languages`,
      `Relate ${topic} to daily village observations`,
      `Practice writing explanations in mother tongue`,
    ],
    sections: [
      {
        sectionTitle: `Section A: Bilingual Vocabulary Matching (${topic})`,
        instructions: {
          en: 'Match each term with its mother tongue counterpart.',
          vernacular: 'प्रत्येक शब्द को उसकी मातृभाषा के सही अर्थ से मिलाएं।',
        },
        questions: [
          {
            qNumber: 1,
            questionTextEn: `What is the primary action in ${topic}?`,
            questionTextVernacular: `${topic} में मुख्य क्रिया क्या है?`,
            options: ['A) Energy absorption', 'B) Natural flow', 'C) Collection'],
            answerKey: 'A',
          },
          {
            qNumber: 2,
            questionTextEn: 'Name one everyday example you see at home.',
            questionTextVernacular: 'घर पर देखा जाने वाला एक उदाहरण बताइए।',
            answerLines: 2,
            answerKey: 'Cooking on hearth or morning dew on leaves.',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  demoStore.addWorksheet(newWorksheet);
  res.json(newWorksheet);
});

app.post('/api/ai/generate-worksheet', (req, res) => {
  const { topic, grade = 4, subject = 'Environmental Studies', primaryLanguage = 'en', vernacularLanguage = 'hi' } = req.body;
  const newWorksheet = {
    id: 'worksheet-' + Date.now(),
    grade: Number(grade),
    subject,
    topic,
    primaryLanguage,
    vernacularLanguage,
    learningObjectives: [
      `Understand foundational vocabulary of ${topic} in both languages`,
      `Relate ${topic} to daily village observations`,
      `Practice writing explanations in mother tongue`,
    ],
    sections: [
      {
        sectionTitle: `Section A: Bilingual Vocabulary Matching (${topic})`,
        instructions: {
          en: 'Match each term with its mother tongue counterpart.',
          vernacular: 'प्रत्येक शब्द को उसकी मातृभाषा के सही अर्थ से मिलाएं।',
        },
        questions: [
          {
            qNumber: 1,
            questionTextEn: `What is the primary action in ${topic}?`,
            questionTextVernacular: `${topic} में मुख्य क्रिया क्या है?`,
            options: ['A) Energy absorption', 'B) Natural flow', 'C) Collection'],
            answerKey: 'A',
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  };
  demoStore.addWorksheet(newWorksheet);
  res.json(newWorksheet);
});

// ==========================================
// VEO VIDEO GENERATION (veo-3.1-fast-generate-preview)
// ==========================================

// Step 1: Start Veo video generation (aspectRatio: '16:9' or '9:16')
app.post('/api/video/generate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt, aspectRatio = '16:9' } = req.body;
    const result = await generateVeoVideo({
      imageBase64,
      mimeType,
      prompt,
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    });
    res.json(result);
  } catch (err: any) {
    console.error('Veo generate error:', err);
    res.status(500).json({ error: err.message || 'Failed to start Veo video generation' });
  }
});

// Step 2: Poll operation status
app.post('/api/video/status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    const status = await getVeoVideoStatus(operationName);
    res.json(status);
  } catch (err: any) {
    console.error('Veo status error:', err);
    res.status(500).json({ error: err.message || 'Failed to check video status' });
  }
});

// Step 3: Stream generated video back to client
app.post('/api/video/download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    const status = await getVeoVideoStatus(operationName);
    if (!status.videoUri) {
      return res.status(404).json({ error: 'Video URI not available yet' });
    }
    const apiKey = process.env.GEMINI_API_KEY || '';
    const videoRes = await fetch(status.videoUri, {
      headers: { 'x-goog-api-key': apiKey },
    });
    if (!videoRes.ok) {
      throw new Error(`Failed to download video: ${videoRes.statusText}`);
    }
    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('Veo download error:', err);
    res.status(500).json({ error: err.message || 'Failed to stream video' });
  }
});

// ==========================================
// AUDIO TRANSCRIPTION (gemini-3.5-transcribe)
// ==========================================
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', languageContext } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 payload is required' });
    }
    const result = await transcribeAudioWithGemini({
      audioBase64,
      mimeType,
      languageContext,
    });
    res.json(result);
  } catch (err: any) {
    console.error('Transcription endpoint error:', err);
    res.status(500).json({ error: err.message || 'Audio transcription failed' });
  }
});

// ==========================================
// VOICE CONVERSATIONS (gemini-3.8-live)
// ==========================================
app.post('/api/ai/live-converse', async (req, res) => {
  try {
    const { userInput, audioBase64, mimeType, systemPrompt, language } = req.body;
    const result = await liveConverseWithGemini({
      userInput,
      audioBase64,
      mimeType,
      systemPrompt,
      language,
    });
    res.json(result);
  } catch (err: any) {
    console.error('Live converse endpoint error:', err);
    res.status(500).json({ error: err.message || 'Live voice conversation failed' });
  }
});

async function startServer() {
  const httpServer = http.createServer(app);

  // Set up WebSocket server for real-time Live API (gemini-3.8-live)
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', async (clientWs: WebSocket) => {
    const ai = getAI();
    if (!ai) {
      clientWs.send(JSON.stringify({ error: 'Gemini API key is required for Live API' }));
      clientWs.close();
      return;
    }

    try {
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'You are Sathi, a warm and encouraging mother-tongue tutor for primary school students in India. You speak simply and support Hindi, Santhali, Telugu, and English. Keep responses joyful, interactive, and brief.',
        },
        callbacks: {
          onmessage: (message: any) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
            if (audio) clientWs.send(JSON.stringify({ audio, text }));
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ closed: true }));
            }
          },
        },
      });

      clientWs.on('message', (data: any) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.text) {
            session.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (err) {
          console.error('Error processing live audio packet:', err);
        }
      });

      clientWs.on('close', () => {
        try {
          session.close();
        } catch (_) {}
      });
    } catch (err: any) {
      console.error('Live connect error:', err);
      clientWs.send(JSON.stringify({ error: err.message || 'Live session initialization failed' }));
      clientWs.close();
    }
  });

  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    if (pathname === '/live' || pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[VERNACRAFT] SIH 2026 Server running on http://0.0.0.0:${PORT} (HTTP & Live WS)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
