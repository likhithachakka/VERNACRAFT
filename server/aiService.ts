import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export function isAIAvailable(): boolean {
  return getAI() !== null;
}

async function executeWithFallback(
  prompt: string,
  responseMimeType: string = 'application/json'
): Promise<string | undefined> {
  const ai = getAI();
  if (!ai) return undefined;

  const models = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType,
        },
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (err: any) {
      // Gracefully catch quota/rate-limit or high-load errors and continue to next model or local engine
      const msg = err?.message || String(err);
      console.info(`Model ${model} unavailable (${msg.includes('429') ? 'quota rate-limit' : 'temporary load'}). Transitioning to resilient fallback...`);
    }
  }

  return undefined;
}

/**
 * Generate a complete pedagogical lesson plan in mother tongue
 */
export async function generatePedagogicalLesson(params: {
  topic: string;
  grade: number;
  subject: string;
  teachingLanguage: string;
  targetLanguage: string;
  context?: string;
}) {
  const ai = getAI();
  const { topic, grade, subject, targetLanguage } = params;

  if (!ai) {
    return generateFallbackPedagogy(params);
  }

  try {
    const prompt = `You are VERNACRAFT's core pedagogical teaching engine for Smart India Hackathon 2026.
Focus: Mother tongue primary education in Jharkhand and rural India.
Task: Create an age-appropriate, pedagogically sound, vernacular explanation for:
Topic: "${topic}"
Subject: "${subject}"
Grade/Class: Class ${grade} primary students (age ${grade + 5} years)
Target Student Language: "${targetLanguage}"

Remember: TRANSLATION IS NOT LEARNING. You must simplify vocabulary, use relatable local analogies (farming, cooking, chulha, village ponds, traditional food like rotis or madua, nature, local trees), break into 4-5 bite-sized concepts, provide a mother-tongue story, and include key vocabulary.

Return ONLY valid JSON with this exact schema:
{
  "conceptBreakdown": ["Step 1...", "Step 2...", "Step 3...", "Step 4..."],
  "simplifiedExplanation": "Clear, gentle explanation in simple English",
  "vernacularExplanation": "Complete pedagogical explanation in the target language (${targetLanguage}) with warm encouraging tone",
  "relatableAnalogy": "A relatable daily life analogy from village or household life",
  "localContextStory": "A short 3-4 sentence story featuring local rural children discovering this concept",
  "vocabularyGlossary": [
    { "english": "Term", "vernacular": "Translated term with meaning", "pronunciation": "Phonetic guide", "example": "Simple sentence" }
  ]
}`;

    const text = await executeWithFallback(prompt, 'application/json');

    if (text) {
      try {
        return JSON.parse(text);
      } catch (jsonErr) {
        console.warn('Failed to parse pedagogy JSON:', jsonErr);
      }
    }
  } catch (err) {
    console.error('Gemini pedagogy generation error, using fallback:', err);
  }

  return generateFallbackPedagogy(params);
}

/**
 * Automatic Context-to-Animation Engine for ANY educational topic
 */
export async function generateContextToAnimation(params: {
  topic: string;
  grade: number;
  language: string;
  customPrompt?: string;
}) {
  const ai = getAI();
  const { topic, grade, language, customPrompt } = params;

  if (ai) {
    try {
      const prompt = `You are VERNACRAFT's Automatic Context-to-Animation Engine for primary school children (Class ${grade}).
CRITICAL DIRECTIVE: You MUST generate scenes and animations specifically and exclusively about the exact topic: "${topic}".
DO NOT generate generic or unrelated topics (such as Photosynthesis or Water Cycle) unless that is explicitly what was requested.
${customPrompt ? `User's Custom Scenario/Prompt: "${customPrompt}"` : ''}
Language: "${language}"

Dynamically generate an educational multi-scene animation project (3 to 5 scenes) explaining "${topic}".
Identify characters (teacher, student-boy, student-girl, sun-character, cloud-character, etc.), key objects with 2D positions (x: 0-100%, y: 0-100%), and motion actions ('float', 'evaporate', 'condense', 'rain', 'grow', 'pulse', 'glow', 'spin', 'fall', 'slice', 'idle').
Supported background options: "sky-river" | "farm" | "kitchen" | "classroom" | "nature" | "universe" | "wind-farm" | "wind" | "energy".
Supported object types: "sun" | "water" | "cloud" | "rain" | "plant" | "pizza" | "leaf" | "arrow" | "windmill" | "wind" | "generator" | "bulb" | "mountain".
Provide rich narration in both English and ${language}, plus captions and an interactive question point for each scene.

Return ONLY valid JSON matching this schema:
{
  "title": "Specific Animation Title for ${topic}",
  "summaryNarration": "Short 1 sentence summary of how ${topic} works",
  "totalDuration": 35,
  "scenes": [
    {
      "id": "scene-1",
      "title": "Scene 1 title",
      "order": 1,
      "description": "Visual scene description explaining ${topic}",
      "background": "sky-river" | "farm" | "kitchen" | "classroom" | "nature" | "universe" | "wind-farm",
      "characters": [
        { "id": "c1", "name": "Name", "type": "teacher"|"student-boy"|"student-girl"|"sun-character"|"cloud-character", "position": { "x": 20, "y": 70 }, "action": "idle"|"explain"|"cheer" }
      ],
      "objects": [
        { "id": "o1", "name": "Object Name", "type": "sun"|"water"|"cloud"|"rain"|"plant"|"pizza"|"leaf"|"arrow"|"windmill"|"wind"|"generator"|"bulb"|"mountain", "label": "Bilingual label", "position": { "x": 50, "y": 40 }, "animation": "float"|"pulse"|"evaporate"|"grow"|"glow"|"rain"|"spin", "color": "#38bdf8" }
      ],
      "narration": [
        { "language": "en", "text": "English narration line" },
        { "language": "${language}", "text": "Mother tongue narration line" }
      ],
      "captions": "Bilingual caption line",
      "duration": 8,
      "interactionPoint": {
        "question": "Comprehension check question about this step of ${topic}",
        "options": ["Option A", "Option B", "Option C"],
        "correctIndex": 0,
        "hint": "Helpful hint"
      }
    }
  ]
}`;

    const text = await executeWithFallback(prompt, 'application/json');

    if (text) {
      try {
        const parsed = JSON.parse(text);
        return {
          id: 'anim-' + Date.now(),
          topic,
          grade,
          language,
          provider: 'gemini-ai' as const,
          ...parsed,
        };
      } catch (jsonErr) {
        console.warn('Failed to parse AI animation JSON, falling back to algorithmic engine:', jsonErr);
      }
    }
  } catch (err: any) {
    console.warn('AI animation generation encountered unexpected error, using algorithmic fallback:', err);
  }
}

// Robust algorithmic context-to-animation fallback for ANY arbitrary topic
  return generateAlgorithmicAnimation(topic, grade, language);
}

/**
 * AI Vernacular Tutor with adaptive misconception diagnosis
 */
export async function getAITutorResponse(params: {
  studentMessage: string;
  currentTopic: string;
  grade: number;
  language: string;
  confusionLevel?: number; // 1 to 4
}) {
  const ai = getAI();
  const { studentMessage, currentTopic, grade, language, confusionLevel = 1 } = params;

  if (ai) {
    try {
      const isConfusion =
        studentMessage.toLowerCase().includes("don't understand") ||
        studentMessage.toLowerCase().includes('samajh nahi') ||
        studentMessage.toLowerCase().includes('confused') ||
        studentMessage.toLowerCase().includes('bujh') ||
        confusionLevel > 1;

      const prompt = `You are "Sathi", the friendly, affectionate AI Vernacular Tutor for primary students in Jharkhand.
Student is in Class ${grade}.
Current Lesson Topic: "${currentTopic}"
Student said: "${studentMessage}"
Student's Mother Tongue: "${language}"
Confusion Scaffolding Level: ${confusionLevel} (1=Simple, 2=Village Analogy, 3=Direct Mother Tongue, 4=Step-by-step visual guidance).

${
  isConfusion
    ? `CRITICAL PEDAGOGICAL RULE: The student says they do not understand!
DO NOT repeat the original explanation!
Instead:
1. Validate their feelings with warmth ("No worries at all! Let's look at it differently.").
2. Switch to a completely different, tangible village/household analogy (like food, animals, farming, weather).
3. Use simple, warm phrases in ${language}.
4. Ask a tiny, gentle question to check one small part.`
    : `Provide a warm, enthusiastic, concise 2-3 sentence answer suitable for a Class ${grade} child in both simple English and ${language}.`
}

Return JSON:
{
  "tutorSpeech": "What the tutor says to the child (warm, welcoming, simple)",
  "vernacularSpeech": "Translation/adaptation in ${language}",
  "characterEmotion": "explaining" | "encouraging" | "celebrating" | "thinking",
  "suggestedAnalogy": "Brief description of analogy used",
  "recommendedAction": "continue" | "replay_animation" | "try_mini_quiz",
  "checkQuestion": "A small single-part question to test understanding"
}`;

    const text = await executeWithFallback(prompt, 'application/json');

    if (text) {
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        console.warn('JSON parse error in tutor, using fallback:', parseErr);
      }
    }
  } catch (err: any) {
    console.warn('AI Tutor unexpected error, using fallback:', err);
  }
}

return generateFallbackTutorResponse(params);
}

/**
 * Educational Translation Engine preserving age-appropriate pedagogy
 */
export async function translateEducationalText(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  gradeLevel: number;
}) {
  const ai = getAI();
  const { text, sourceLang, targetLang, gradeLevel } = params;

  if (ai) {
    try {
      const prompt = `You are VERNACRAFT's Pedagogical Educational Translator for Indian Languages (Hindi, Santhali, Telugu, Mundari, Ho, Kurukh).
Source text: "${text}"
From: ${sourceLang}
To: ${targetLang}
Target Audience: Primary School Class ${gradeLevel} students.

Rules:
1. This is EDUCATIONAL translation, not literal word-for-word machine translation.
2. Adapt complex jargon into friendly, intuitive mother-tongue terms that a 9-year-old child understands.
3. Provide pronunciation guide where applicable.
4. Add a brief "Pedagogical Note" explaining how the concept was culturally localized.

Return JSON:
{
  "translatedText": "The educational translation in ${targetLang}",
  "phoneticGuide": "Phonetic pronunciation if non-latin script",
  "pedagogicalNote": "Why this specific vernacular phrasing was chosen for children",
  "keyTerminology": [
    { "original": "term", "adapted": "vernacular term", "meaning": "child-friendly meaning" }
  ]
}`;

    let parsed: string | undefined;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      parsed = response.text?.trim();
    } catch (e: any) {
      try {
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        parsed = fallbackResp.text?.trim();
      } catch (e2) {
        console.info('Using local educational linguistic dictionary translation engine.');
      }
    }

    if (parsed) {
      try {
        return JSON.parse(parsed);
      } catch (parseErr) {
        console.warn('JSON parse error in translation, using fallback:', parseErr);
      }
    }
    } catch (err: any) {
      console.warn('AI translation unexpected error, using fallback:', err);
    }
  }

  return generateFallbackTranslation(params);
}

// Fallback generator functions
function generateFallbackPedagogy(params: {
  topic: string;
  grade: number;
  subject: string;
  targetLanguage: string;
}) {
  const { topic, grade, targetLanguage } = params;
  const isHindi = targetLanguage === 'hi';
  const isSanthali = targetLanguage === 'sat';

  return {
    conceptBreakdown: [
      `1. Everyday observation: Where do we notice ${topic} in our daily life?`,
      `2. The Main Secret: Breaking down the core process into simple steps.`,
      `3. Nature at work: How the environment participates without us noticing.`,
      `4. Why it matters: How understanding ${topic} helps us in our village and school.`,
    ],
    simplifiedExplanation: `When we look closely at ${topic}, it is like nature following a beautiful rule book. Just as seeds grow into trees when watered, ${topic} happens step-by-step so life can flourish.`,
    vernacularExplanation: isHindi
      ? `जब हम ${topic} को ध्यान से देखते हैं, तो यह प्रकृति का एक अनोखा नियम है। जैसे मां की रसोई में सब कुछ क्रम से बनता है, ठीक वैसे ही ${topic} भी हमारे चारों ओर घटित होता है ताकि प्रकृति का संतुलन बना रहे।`
      : isSanthali
      ? `${topic} ᱵᱟᱵᱚᱛ ᱟᱵᱚ ᱡᱩᱫᱤ ᱵᱟᱰᱟᱭᱟ, ᱱᱚᱣᱟ ᱫᱚ ᱫᱷᱟᱹᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱢᱟᱨᱟᱝ ᱱᱤᱭᱚᱢ ᱠᱟᱱᱟ᱾ ᱡᱮᱞᱮᱠᱟ ᱫᱟᱨᱮ ᱦᱟᱨᱟᱜ-ᱟ, ᱚᱱᱠᱟ ᱜᱮ ᱱᱚᱣᱟ ᱦᱚᱸ ᱟᱵᱚ ᱥᱩᱨ-ᱥᱩᱯᱩᱨ ᱨᱮ ᱜᱷᱚᱴᱟᱣᱜ-ᱟ᱾`
      : `${topic} is nature's way of nurturing life in our surroundings, step by step.`,
    relatableAnalogy: `The Village Clay Pot (Ghara / Matka) Analogy: Just like cool water seeping through porous clay cools the breeze on a hot summer afternoon, ${topic} works continuously through simple natural connections!`,
    localContextStory: `In a quiet village in Jharkhand, two friends noticed ${topic} during their walk past the Sal trees. Their teacher smiled and explained how their ancestors always respected this natural cycle for rich harvests.`,
    vocabularyGlossary: [
      {
        english: topic,
        vernacular: isHindi ? `${topic} (प्रकृति का चक्र)` : `${topic} (ᱫᱷᱟᱹᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱱᱤᱭᱚᱢ)`,
        pronunciation: 'Topic name',
        example: `We see ${topic} in action every single season.`,
      },
      {
        english: 'Energy / Heat',
        vernacular: isHindi ? 'ऊर्जा / ताप (ताकत)' : 'ᱫᱟᱲᱮ / ᱞᱚᱞᱚ (Dare)',
        pronunciation: 'Oorja',
        example: 'Sunlight provides the warmth to power the process.',
      },
    ],
  };
}

/**
 * Universal dynamic algorithmic scene engine for ANY topic
 */
function generateAlgorithmicAnimation(topic: string, grade: number, language: string) {
  const lower = topic.toLowerCase();

  // Match topic themes
  if (lower.includes('fraction') || lower.includes('pizza') || lower.includes('roti') || lower.includes('math')) {
    return {
      id: 'anim-fractions-' + Date.now(),
      topic,
      grade,
      language,
      totalDuration: 30,
      provider: 'procedural-svg' as const,
      summaryNarration: 'Watch how sharing a whole roti or pizza creates equal, delicious fractions!',
      scenes: [
        {
          id: 'sc-1',
          title: 'Scene 1: One Whole (1)',
          order: 1,
          description: 'A round golden fresh roti resting on the village kitchen platter.',
          background: 'kitchen',
          characters: [{ id: 'c1', name: 'Masterji', type: 'teacher', position: { x: 20, y: 70 }, action: 'explain' }],
          objects: [
            { id: 'o1', name: 'Whole Roti', type: 'pizza', label: '1 Whole (एक पूरा)', position: { x: 50, y: 45 }, animation: 'float', color: '#f59e0b' },
          ],
          narration: [
            { language: 'en', text: 'Here is one whole roti, just taken hot off the chulha.' },
            { language: 'hi', text: 'यह एक पूरी ताज़ी रोटी है, जो अभी-अभी चूल्हे से उतारी गई है।' },
            { language: 'sat', text: 'ᱱᱚᱣᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱝ ᱜᱚᱴᱟ ᱨᱩᱴᱤ ᱠᱟᱱᱟ᱾' }
          ],
          captions: '1 Whole Object (1 पूरा हिस्सा)',
          duration: 7,
        },
        {
          id: 'sc-2',
          title: 'Scene 2: Dividing in Half (1/2)',
          order: 2,
          description: 'The roti is gently sliced down the middle into two equal parts for two hungry friends.',
          background: 'kitchen',
          characters: [],
          objects: [
            { id: 'o2', name: 'Half Slice Left', type: 'pizza', label: '1/2 (आधा)', position: { x: 42, y: 45 }, animation: 'slice', color: '#f59e0b' },
            { id: 'o3', name: 'Half Slice Right', type: 'pizza', label: '1/2 (आधा)', position: { x: 58, y: 45 }, animation: 'slice', color: '#d97706' },
          ],
          narration: [
            { language: 'en', text: 'When cut equally in two, each part is called One Half, or 1 over 2!' },
            { language: 'hi', text: 'जब इसे दो बराबर भागों में बांटा जाता है, तो प्रत्येक भाग को आधा (1/2) कहते हैं।' },
            { language: 'sat', text: 'ᱵᱟᱨ ᱦᱟᱹᱴᱤᱧ ᱨᱮ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱢᱤᱫ ᱦᱟᱹᱴᱤᱧ ᱫᱚ ᱟᱫᱷᱟ (᱑/᱒) ᱵᱚ ᱢᱮᱛᱟᱜ-ᱟ᱾' }
          ],
          captions: 'Half: 1 divided by 2 (1/2 आधा)',
          duration: 8,
          interactionPoint: {
            question: 'If you give 1/2 to your sister and 1/2 to your brother, how much roti is left?',
            options: ['0 (None, all is shared!)', '1 whole roti', 'Half roti'],
            correctIndex: 0,
            hint: 'Two halves make a whole!'
          }
        },
        {
          id: 'sc-3',
          title: 'Scene 3: Four Quarters (1/4)',
          order: 3,
          description: 'Four friends arrive! The roti is divided into 4 equal quarters so everyone gets a fair share.',
          background: 'kitchen',
          characters: [{ id: 'c2', name: 'Birsa', type: 'student-boy', position: { x: 80, y: 70 }, action: 'cheer' }],
          objects: [
            { id: 'q1', name: 'Quarter 1', type: 'pizza', label: '1/4', position: { x: 45, y: 38 }, animation: 'pulse', color: '#fbbf24' },
            { id: 'q2', name: 'Quarter 2', type: 'pizza', label: '1/4', position: { x: 55, y: 38 }, animation: 'pulse', color: '#f59e0b' },
            { id: 'q3', name: 'Quarter 3', type: 'pizza', label: '1/4', position: { x: 45, y: 52 }, animation: 'pulse', color: '#d97706' },
            { id: 'q4', name: 'Quarter 4', type: 'pizza', label: '1/4', position: { x: 55, y: 52 }, animation: 'pulse', color: '#b45309' },
          ],
          narration: [
            { language: 'en', text: 'Four equal shares mean each friend enjoys exactly one-fourth, or 1/4!' },
            { language: 'hi', text: 'चार बराबर हिस्सों में बांटने पर हर बच्चे को एक-चौथाई (1/4) हिस्सा मिलता है।' },
            { language: 'sat', text: 'ᱯᱩᱱ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱑/᱔ ᱦᱟᱹᱴᱤᱧ ᱠᱚ ᱧᱟᱢᱟ᱾' }
          ],
          captions: 'Four Quarters: 1/4 each (एक चौथाई हिस्सा)',
          duration: 8,
        }
      ]
    };
  }

  if (lower.includes('sky') || lower.includes('blue') || lower.includes('light')) {
    return {
      id: 'anim-sky-blue-' + Date.now(),
      topic,
      grade,
      language,
      totalDuration: 28,
      provider: 'procedural-svg' as const,
      summaryNarration: 'Discover how white sunlight scatters blue particles in our atmosphere!',
      scenes: [
        {
          id: 'sc-sb1',
          title: 'Scene 1: The Rainbow inside Sunlight',
          order: 1,
          description: 'White sunlight streams toward Earth containing all colors of the rainbow.',
          background: 'universe',
          characters: [],
          objects: [
            { id: 'sun', name: 'Sun', type: 'sun', position: { x: 20, y: 30 }, animation: 'glow', color: '#f59e0b' },
            { id: 'rays', name: 'Light Spectrum', type: 'arrow', label: 'Sunlight with all colors', position: { x: 50, y: 35 }, animation: 'pulse', color: '#60a5fa' }
          ],
          narration: [
            { language: 'en', text: 'Sunlight looks golden-white, but it actually carries all colors of the rainbow together!' },
            { language: 'hi', text: 'सूरज की धूप हमें सफेद या सुनहरी दिखती है, लेकिन इसमें इंद्रधनुष के सारे सात रंग छिपे होते हैं।' },
            { language: 'sat', text: 'ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱨᱮ ᱮᱭᱟᱭ ᱜᱚᱴᱟᱝ ᱨᱚᱝ ᱩᱠᱩ ᱢᱮᱱᱟᱜ-ᱟ᱾' }
          ],
          captions: 'Sunlight contains all 7 colors of the rainbow (सूर्य का प्रकाश)',
          duration: 8,
        },
        {
          id: 'sc-sb2',
          title: 'Scene 2: Atmosphere Scatters Blue',
          order: 2,
          description: 'Tiny air molecules in the sky scatter short blue waves everywhere, painting the sky blue.',
          background: 'sky-river',
          characters: [{ id: 'stu', name: 'Curious Learner', type: 'student-girl', position: { x: 50, y: 75 }, action: 'cheer' }],
          objects: [
            { id: 'air1', name: 'Air Molecules', type: 'cloud', label: 'Scattering Blue / प्रकीर्णन', position: { x: 50, y: 30 }, animation: 'glow', color: '#38bdf8' }
          ],
          narration: [
            { language: 'en', text: 'Blue light travels in smaller, choppy waves and bounces off air molecules in every direction, filling the sky with blue!' },
            { language: 'hi', text: 'नीले रंग की तरंगें छोटी होती हैं और हवा के कणों से टकराकर चारों तरफ बिखर जाती हैं, जिससे आसमान नीला दिखता है।' },
            { language: 'sat', text: 'ᱞᱤᱞ ᱨᱚᱝ ᱦᱟᱹᱣᱟᱹ ᱨᱮ ᱯᱟᱥᱱᱟᱣ ᱠᱟᱛᱮ ᱥᱮᱨᱢᱟ ᱞᱤᱞ ᱜᱮ ᱧᱮᱞᱚᱜ-ᱟ᱾' }
          ],
          captions: 'Rayleigh Scattering: Blue light bounces everywhere! (आसमान का नीला दिखना)',
          duration: 9,
        }
      ]
    };
  }

  // Wind power plant / windmill / wind energy theme
  if (lower.includes('wind') || lower.includes('turbine') || lower.includes('plant') && lower.includes('power') || lower.includes('electricity')) {
    return {
      id: 'anim-wind-power-' + Date.now(),
      topic,
      grade,
      language,
      totalDuration: 28,
      provider: 'procedural-svg' as const,
      summaryNarration: 'Watch how strong natural winds turn massive turbine blades to generate clean electricity!',
      scenes: [
        {
          id: 'sc-wp1',
          title: 'Scene 1: Natural Wind Energy Across the Hills',
          order: 1,
          description: 'Brisk mountain winds blow across high hills where a giant windmill stands ready.',
          background: 'wind-farm',
          characters: [
            { id: 'c1', name: 'Masterji', type: 'teacher', position: { x: 20, y: 72 }, action: 'explain' }
          ],
          objects: [
            { id: 'w1', name: 'Wind Currents', type: 'wind', label: 'Brisk Wind Currents / पवन ऊर्जा', position: { x: 45, y: 30 }, animation: 'float', color: '#38bdf8' },
            { id: 'wt1', name: 'Windmill Turbine', type: 'windmill', label: 'Wind Turbine / पवन चक्की', position: { x: 75, y: 48 }, animation: 'spin', color: '#ffffff' }
          ],
          narration: [
            { language: 'en', text: 'On high hills and open plains, strong natural breezes carry immense moving kinetic energy!' },
            { language: 'hi', text: 'पहाड़ियों और खुले मैदानों पर बहने वाली तेज हवा में बहुत सारी गतिज ऊर्जा (Kinetic Energy) होती है।' },
            { language: 'sat', text: 'ᱵᱩᱨᱩ ᱟᱨ ᱠᱷᱩᱞᱟᱹ ᱴᱟᱺᱰᱤ ᱨᱮ ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱛᱮᱡ ᱦᱟᱹᱣᱟᱹ ᱨᱮ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱫᱟᱲᱮ ᱛᱟᱦᱮᱸᱱᱟ᱾' }
          ],
          captions: 'Brisk winds carry natural kinetic energy (पवन ऊर्जा)',
          duration: 8,
          interactionPoint: {
            question: 'What gives energy to push the giant windmill blades?',
            options: ['Moving Air (Wind)', 'Water in a bucket', 'Coal smoke'],
            correctIndex: 0,
            hint: 'Feel the cool breeze moving across the landscape!'
          }
        },
        {
          id: 'sc-wp2',
          title: 'Scene 2: Kinetic to Mechanical Energy (Blades Spin)',
          order: 2,
          description: 'The wind rushes against curved aerodynamic blades, turning the rotor shaft smoothly.',
          background: 'wind-farm',
          characters: [],
          objects: [
            { id: 'wt2', name: 'Spinning Turbine', type: 'windmill', label: 'Spinning Blades / घूमते ब्लेड', position: { x: 45, y: 45 }, animation: 'spin', color: '#ffffff' },
            { id: 'gen', name: 'Generator Hub', type: 'generator', label: 'Generator Inside Nacelle', position: { x: 78, y: 50 }, animation: 'pulse', color: '#fbbf24' }
          ],
          narration: [
            { language: 'en', text: 'As wind pushes the blades, they spin a central shaft connected to an electric generator inside!' },
            { language: 'hi', text: 'जैसे ही हवा ब्लेड्स को धक्का देती है, वे घूमने लगते हैं और अंदर लगे जनरेटर को चलाकर बिजली पैदा करते हैं!' },
            { language: 'sat', text: 'ᱦᱟᱹᱣᱟᱹ ᱛᱮ ᱯᱟᱹᱠᱷᱱᱟᱹ ᱟᱹᱪᱩᱨᱚᱜ-ᱟ ᱟᱨ ᱵᱷᱤᱛᱨᱤ ᱨᱮᱱᱟᱜ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱵᱤᱡᱽᱞᱤ-ᱮ ᱵᱮᱱᱟᱣᱟ᱾' }
          ],
          captions: 'Spinning blades power the generator (गति से बिजली बनना)',
          duration: 9,
        },
        {
          id: 'sc-wp3',
          title: 'Scene 3: Clean Green Electricity Lights Homes',
          order: 3,
          description: 'The clean electricity travels down wires to light up bulbs, fans, and school classrooms.',
          background: 'wind-farm',
          characters: [
            { id: 'c2', name: 'Birsa', type: 'student-boy', position: { x: 25, y: 72 }, action: 'cheer' }
          ],
          objects: [
            { id: 'wt3', name: 'Windmill', type: 'windmill', position: { x: 40, y: 45 }, animation: 'spin', color: '#ffffff' },
            { id: 'spk', name: 'Green Power Spark', type: 'arrow', label: 'Clean Power Flow', position: { x: 62, y: 48 }, animation: 'pulse', color: '#fbbf24' },
            { id: 'b1', name: 'Lit Bulb', type: 'bulb', label: 'Lit Home & School / रोशनी', position: { x: 82, y: 40 }, animation: 'glow', color: '#facc15' }
          ],
          narration: [
            { language: 'en', text: 'Clean, pollution-free electricity travels straight to our village homes and classrooms without any smoke!' },
            { language: 'hi', text: 'यह स्वच्छ, प्रदूषण-रहित बिजली बिना किसी धुएं के हमारे गांव के घरों और स्कूल को रोशन करती है!' },
            { language: 'sat', text: 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱷᱟᱨᱪᱟ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱵᱤᱱᱟᱹ ᱫᱷᱩᱶᱟᱹ ᱛᱮ ᱟᱵᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱟᱨ ᱟᱥᱲᱟ ᱡᱩᱞᱟᱣᱟ᱾' }
          ],
          captions: 'Clean green energy powers our classrooms and homes! (स्वच्छ हरित ऊर्जा)',
          duration: 9,
          interactionPoint: {
            question: 'Does a wind power plant create smoke or air pollution?',
            options: ['No, it produces clean green energy!', 'Yes, lots of dark smoke', 'Only in the afternoon'],
            correctIndex: 0,
            hint: 'Wind is 100% natural, clean renewable energy!'
          }
        }
      ]
    };
  }

  // Universal fallback for ANY topic: Generates a 3-scene educational sequence with dynamic objects
  return {
    id: 'anim-universal-' + Date.now(),
    topic,
    grade,
    language,
    totalDuration: 30,
    provider: 'procedural-svg' as const,
    summaryNarration: `An interactive visual exploration of ${topic} tailored for Class ${grade} students.`,
    scenes: [
      {
        id: 'u-sc-1',
        title: `Scene 1: Introduction to ${topic}`,
        order: 1,
        description: `Visualizing the foundational elements of ${topic} in a calm, natural setting.`,
        background: 'nature',
        characters: [{ id: 'uc1', name: 'Masterji', type: 'teacher', position: { x: 25, y: 70 }, action: 'explain' }],
        objects: [
          { id: 'uo1', name: topic, type: 'plant', label: `${topic} (Core Element)`, position: { x: 55, y: 50 }, animation: 'glow', color: '#10b981' },
          { id: 'uo2', name: 'Energy', type: 'sun', position: { x: 80, y: 20 }, animation: 'pulse', color: '#f59e0b' }
        ],
        narration: [
          { language: 'en', text: `Let us explore how ${topic} works right here in our environment!` },
          { language: 'hi', text: `आइए समझें कि ${topic} हमारे दैनिक जीवन और प्रकृति में कैसे काम करता है।` },
          { language: 'sat', text: `ᱫᱮᱞᱟ ᱵᱚ ᱧᱮᱞᱟ ${topic} ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟ᱾` }
        ],
        captions: `Discovering ${topic} step by step`,
        duration: 8,
      },
      {
        id: 'u-sc-2',
        title: `Scene 2: The Core Mechanism`,
        order: 2,
        description: `Watching the energy and natural elements interact to demonstrate ${topic}.`,
        background: 'nature',
        characters: [],
        objects: [
          { id: 'uo3', name: 'Process Flow', type: 'arrow', label: 'Action & Change', position: { x: 50, y: 45 }, animation: 'float', color: '#3b82f6' },
          { id: 'uo4', name: 'Resulting Form', type: 'cloud', label: 'Transformation', position: { x: 65, y: 35 }, animation: 'pulse', color: '#06b6d4' }
        ],
        narration: [
          { language: 'en', text: `Energy flows through the system, transforming materials and creating balance.` },
          { language: 'hi', text: `ऊर्जा और प्रकृति के घटक मिलकर इस क्रिया को पूरा करते हैं।` },
          { language: 'sat', text: `ᱫᱟᱲᱮ ᱟᱨ ᱫᱷᱟᱹᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱡᱤᱱᱤᱥ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱱᱚᱣᱟ ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣᱜ-ᱟ᱾` }
        ],
        captions: `The transformation process in action`,
        duration: 9,
        interactionPoint: {
          question: `Does ${topic} help maintain balance in nature?`,
          options: ['Yes, absolutely!', 'No, not at all', 'Only at night'],
          correctIndex: 0,
          hint: 'Every natural process works in harmony with the environment!'
        }
      },
      {
        id: 'u-sc-3',
        title: `Scene 3: Real Life Understanding`,
        order: 3,
        description: `Celebrating how students can observe this principle in their own village or garden.`,
        background: 'classroom',
        characters: [{ id: 'uc2', name: 'Birsa', type: 'student-boy', position: { x: 30, y: 72 }, action: 'cheer' }],
        objects: [
          { id: 'uo5', name: 'Knowledge Star', type: 'sun', label: 'Mastery & Care', position: { x: 50, y: 30 }, animation: 'glow', color: '#fbbf24' }
        ],
        narration: [
          { language: 'en', text: `Now you know how ${topic} works! Look around your school and village to spot it today.` },
          { language: 'hi', text: `अब आप ${topic} को समझ चुके हैं! आज अपने घर और स्कूल के आसपास इसे पहचानें।` },
          { language: 'sat', text: `ᱱᱤᱛᱚᱜ ᱟᱢ ${topic} ᱵᱟᱰᱟᱭ ᱠᱮᱫᱟᱢ! ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱱᱚᱣᱟ ᱧᱮᱞ ᱢᱮ᱾` }
        ],
        captions: `Understanding complete! (अवधारणा की समझ पूरी)`,
        duration: 8,
      }
    ]
  };
}

function generateFallbackTutorResponse(params: {
  studentMessage: string;
  currentTopic: string;
  grade: number;
  language: string;
  confusionLevel?: number;
}) {
  const { currentTopic, language, confusionLevel = 1 } = params;
  const isHindi = language === 'hi';
  const isSanthali = language === 'sat';

  if (confusionLevel >= 2) {
    return {
      tutorSpeech: `Don't worry at all! Let us use something you see in the village kitchen every single day. Think of a boiling pot of water on the chulha with a lid on top.`,
      vernacularSpeech: isHindi
        ? `बिल्कुल चिंता मत करो! आओ एक बहुत आसान उदाहरण से समझें। जब घर में चूल्हे पर मां पानी या भात उबालती है, तो ढक्कन पर पानी की बूंदें कैसे आ जाती हैं? वही तो ${currentTopic} है!`
        : isSanthali
        ? `ᱟᱞᱚᱢ ᱪᱤᱱᱛᱟᱹᱜ-ᱟ! ᱟᱵᱚ ᱪᱩᱞᱦᱟᱹ ᱨᱮ ᱫᱟᱜ ᱞᱚᱞᱚᱜ ᱚᱠᱛᱚ ᱰᱷᱟᱹᱠᱱᱤ ᱪᱮᱛᱟᱱ ᱨᱮ ᱫᱟᱜ ᱴᱚᱯᱟᱜ ᱡᱟᱣᱨᱟᱜ ᱞᱮᱠᱟ ᱜᱮ ${currentTopic} ᱦᱚᱸ ᱠᱟᱹᱢᱤᱭᱟ᱾`
        : `Think of cooking in the kitchen: steam rises and turns into water droplets. That is the essence of ${currentTopic}!`,
      characterEmotion: 'encouraging',
      suggestedAnalogy: 'Kitchen Chulha & Cold Lid',
      recommendedAction: 'replay_animation',
      checkQuestion: 'When you take a hot cup of tea, do you see steam rising into the air?',
    };
  }

  return {
    tutorSpeech: `Great question! ${currentTopic} is nature's way of recycling water and energy so all living beings have what they need to thrive.`,
    vernacularSpeech: isHindi
      ? `बहुत अच्छा सवाल! ${currentTopic} का मतलब है कि प्रकृति में पानी कभी खत्म नहीं होता, बल्कि घूम-फिर कर हमेशा लौट आता है।`
      : isSanthali
      ? `ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱠᱩᱠᱞᱤ! ${currentTopic} ᱫᱚ ᱫᱟᱜ ᱟᱹᱪᱩᱨ ᱛᱟᱦᱮᱸᱱ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱪᱟᱹᱠᱩᱨ ᱠᱟᱱᱟ᱾`
      : `${currentTopic} means nature continuously recycles resources in an eternal loop.`,
    characterEmotion: 'explaining',
    suggestedAnalogy: 'The Endless Loop',
    recommendedAction: 'continue',
    checkQuestion: 'Does the sun give warmth to help water evaporate?',
  };
}

function generateFallbackTranslation(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  gradeLevel: number;
}) {
  const { text, targetLang } = params;
  if (targetLang === 'hi') {
    return {
      translatedText: text
        .replace(/water cycle/gi, 'जल चक्र')
        .replace(/evaporation/gi, 'वाष्पीकरण (भाप बनना)')
        .replace(/condensation/gi, 'संघनन (बादल बनना)')
        .replace(/precipitation/gi, 'वर्षा (बारिश होना)')
        .replace(/sun/gi, 'सूरज')
        .replace(/clouds/gi, 'बादल')
        .replace(/rain/gi, 'बारिश'),
      phoneticGuide: 'Devanagari phonetics with simple Hindi vocabulary',
      pedagogicalNote: 'Simplified technical terms with relatable vernacular parentheticals.',
      keyTerminology: [
        { original: 'Evaporation', adapted: 'वाष्पीकरण', meaning: 'Liquid changing into rising vapor' }
      ]
    };
  }
  if (targetLang === 'sat') {
    return {
      translatedText: text
        .replace(/water cycle/gi, 'ᱫᱟᱜ ᱪᱟᱹᱠᱩᱨ (Dak Chakur)')
        .replace(/evaporation/gi, 'ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹᱜ (Dak hawag)')
        .replace(/condensation/gi, 'ᱨᱤᱢᱤᱞ ᱵᱮᱱᱟᱣ (Rimil benao)')
        .replace(/precipitation/gi, 'ᱫᱟᱜ ᱡᱟᱹᱲᱤ (Dak jari)'),
      phoneticGuide: 'Ol Chiki script with Roman transliteration for primary schoolers',
      pedagogicalNote: 'Rooted in Santhali agrarian vocabulary of Jharkhand.',
      keyTerminology: [
        { original: 'Evaporation', adapted: 'ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹᱜ', meaning: 'Water vaporizing into air' }
      ]
    };
  }
  return {
    translatedText: text,
    phoneticGuide: 'Standard pronunciation',
    pedagogicalNote: 'Direct child-friendly adaptation.',
    keyTerminology: []
  };
}

/**
 * Audio Transcription using Gemini 3.5 Transcribe (gemini-3.5-transcribe)
 */
export async function transcribeAudioWithGemini(params: {
  audioBase64: string;
  mimeType?: string;
  languageContext?: string;
}): Promise<{ transcript: string; model: string; durationEstimated?: string }> {
  const ai = getAI();
  if (!ai) {
    return {
      transcript: 'Gemini API key is required for live audio transcription.',
      model: 'local-fallback',
    };
  }

  const mimeType = params.mimeType || 'audio/webm';
  const audioPart = {
    inlineData: {
      mimeType,
      data: params.audioBase64,
    },
  };

  try {
    const promptText = params.languageContext
      ? `Transcribe this audio precisely verbatim. Spoken context/language: ${params.languageContext}. Capture vernacular terms accurately.`
      : 'Transcribe this audio verbatim in its original spoken language and script (e.g., Hindi, Santhali, Telugu, Bengali, or English).';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: promptText }],
      },
    });

    const transcript = response.text?.trim() || '';
    return {
      transcript,
      model: 'gemini-3.5-transcribe',
    };
  } catch (err: any) {
    console.error('gemini-3.5-transcribe error:', err);
    throw new Error(err.message || 'Audio transcription failed with gemini-3.5-transcribe');
  }
}

/**
 * Veo Video Generation using model veo-3.1-fast-generate-preview
 * Supports aspect ratios: '16:9' (landscape) or '9:16' (portrait)
 */
export async function generateVeoVideo(params: {
  imageBase64?: string;
  mimeType?: string;
  prompt?: string;
  aspectRatio?: '16:9' | '9:16';
}): Promise<{ operationName: string; model: string; aspectRatio: '16:9' | '9:16' }> {
  const ai = getAI();
  if (!ai) {
    throw new Error('Gemini API key is required for Veo video generation');
  }

  const aspectRatio = params.aspectRatio === '9:16' ? '9:16' : '16:9';
  const prompt =
    params.prompt ||
    'Educational animation depicting scientific concepts with vibrant motion and cinematic lighting.';

  const requestConfig: any = {
    numberOfVideos: 1,
    aspectRatio,
  };

  const requestPayload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: requestConfig,
  };

  if (params.imageBase64) {
    requestPayload.image = {
      imageBytes: params.imageBase64,
      mimeType: params.mimeType || 'image/png',
    };
  }

  try {
    const operation = await ai.models.generateVideos(requestPayload);
    return {
      operationName: operation.name || '',
      model: 'veo-3.1-fast-generate-preview',
      aspectRatio,
    };
  } catch (err: any) {
    console.error('Veo video generation error:', err);
    throw new Error(err.message || 'Failed to generate video with veo-3.1-fast-generate-preview');
  }
}

/**
 * Check status of Veo Video Generation
 */
export async function getVeoVideoStatus(operationName: string): Promise<{
  done: boolean;
  videoUri?: string;
  error?: string;
}> {
  const ai = getAI();
  if (!ai) throw new Error('Gemini API key is required');

  try {
    const { GenerateVideosOperation } = await import('@google/genai');
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;
    const error = (updated as any).error?.message;
    return {
      done: Boolean(updated.done),
      videoUri,
      error,
    };
  } catch (err: any) {
    console.error('Error polling video operation:', err);
    throw err;
  }
}

/**
 * Live Voice Conversation with Gemini 3.8 Live (gemini-3.8-live)
 * Fallback REST endpoint for voice exchange
 */
export async function liveConverseWithGemini(params: {
  userInput?: string;
  audioBase64?: string;
  mimeType?: string;
  systemPrompt?: string;
  language?: string;
}): Promise<{
  responseText: string;
  vernacularResponse?: string;
  audioBase64?: string;
  model: string;
}> {
  const ai = getAI();
  if (!ai) {
    return {
      responseText: 'Johar! I am Sathi. How can I help you today?',
      vernacularResponse: 'ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱥᱟᱛᱷᱤ ᱠᱟᱹᱱᱟᱹᱧ᱾',
      model: 'offline-companion',
    };
  }

  const systemInstruction =
    params.systemPrompt ||
    'You are Sathi, an empathetic mother-tongue tutor for children in India. Keep explanations brief, joyful, and grounded in nature and village metaphors.';

  try {
    const contents: any[] = [];
    if (params.audioBase64) {
      contents.push({
        inlineData: {
          mimeType: params.mimeType || 'audio/webm',
          data: params.audioBase64,
        },
      });
    }
    if (params.userInput) {
      contents.push({ text: params.userInput });
    } else if (contents.length === 0) {
      contents.push({ text: 'Hello Sathi! Tell me an encouraging fact.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-live',
      contents,
      config: {
        systemInstruction,
      },
    });

    const responseText = response.text?.trim() || 'Keep asking questions, young explorer!';
    return {
      responseText,
      model: 'gemini-3.8-live',
    };
  } catch (err: any) {
    console.info('gemini-3.8-live conversational fallback to gemini-3.1-flash-lite:', err.message);
    const fallbackResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: params.userInput || 'Hello Sathi!',
      config: {
        systemInstruction,
      },
    });
    return {
      responseText: fallbackResponse.text?.trim() || 'Johar! I am learning alongside you.',
      model: 'gemini-3.8-live-bridge',
    };
  }
}

