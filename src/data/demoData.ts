import {
  User,
  Lesson,
  Quiz,
  StudentProgress,
  Achievement,
  Worksheet,
} from '../types';

export const DEMO_TEACHER: User = {
  id: 'teacher-shalini-01',
  name: 'Shalini Murmu',
  role: 'teacher',
  avatar: '👩‍🏫',
  primaryLanguage: 'hi',
  school: 'Govt. Model Primary School, Ormanjhi, Ranchi',
  location: 'Jharkhand',
};

export const DEMO_STUDENT: User = {
  id: 'student-birsa-01',
  name: 'Birsa Hembrom',
  role: 'student',
  avatar: '👦🏽',
  primaryLanguage: 'sat',
  grade: 4,
  school: 'Govt. Model Primary School, Ormanjhi, Ranchi',
  location: 'Jharkhand',
};

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-lesson',
    title: 'Pahila Paath (First Lesson)',
    description: 'Completed your very first interactive vernacular lesson.',
    category: 'learning',
    icon: '🌱',
    unlockedAt: '2026-09-15T10:00:00Z',
    progress: 100,
  },
  {
    id: 'ach-voice-explorer',
    title: 'Awaz Yatri (Voice Explorer)',
    description: 'Asked the AI tutor 3 questions using your voice in your mother tongue.',
    category: 'language',
    icon: '🎙️',
    unlockedAt: '2026-09-17T14:30:00Z',
    progress: 100,
  },
  {
    id: 'ach-quiz-master',
    title: 'Pariksha Veera (Quiz Master)',
    description: 'Scored 100% on a science concept check after misconception diagnosis.',
    category: 'quiz',
    icon: '🏆',
    unlockedAt: '2026-09-18T16:20:00Z',
    progress: 100,
  },
  {
    id: 'ach-curious-learner',
    title: 'Khoji Dimag (Curious Learner)',
    description: 'Clicked "I don\'t understand" to unlock an easier village analogy.',
    category: 'learning',
    icon: '💡',
    unlockedAt: '2026-09-18T18:00:00Z',
    progress: 100,
  },
  {
    id: 'ach-jharkhand-heritage',
    title: 'Disom Gayan (Jharkhand Heritage)',
    description: 'Learned science terms in both Santhali Ol Chiki and Hindi.',
    category: 'jharkhand',
    icon: '🏹',
    progress: 75,
  },
  {
    id: 'ach-fraction-chef',
    title: 'Roti Batwara (Fraction Wizard)',
    description: 'Divided traditional rotis into equal quarters without spilling.',
    category: 'learning',
    icon: '🫓',
    progress: 50,
  },
];

export const DEMO_WATER_CYCLE_LESSON: Lesson = {
  id: 'lesson-water-cycle-g4',
  title: 'Jal Chakra: The Eternal Journey of Water',
  grade: 4,
  subject: 'Environmental Studies',
  topic: 'Water Cycle (जल चक्र / ᱫᱟᱜ ᱪᱟᱹᱠᱩᱨ)',
  teachingLanguage: 'en',
  targetLanguage: 'hi',
  isOfflineAvailable: true,
  createdAt: '2026-09-18T09:00:00Z',
  quizId: 'quiz-water-cycle-01',
  pedagogy: {
    conceptBreakdown: [
      '1. Sunshine warms the local pond/river water (Heat Energy).',
      '2. Warm water transforms into invisible steam and floats high up (Evaporation).',
      '3. High in the cold sky, steam hugs together to form fluffy clouds (Condensation).',
      '4. Clouds grow heavy with dark droplets and fall as rain over Jharkhand (Precipitation).',
      '5. Rainwater fills village wells, bandhs, and flows back to Subarnarekha (Collection).',
    ],
    simplifiedExplanation:
      'Imagine your mother boiling rice in the kitchen. When water heats up, steam rises! The sun does the exact same thing to rivers and ponds. That steam turns into clouds, gets cold, and showers rain back on our crops.',
    vernacularExplanation:
      'जैसे माँ चूल्हे पर पानी गर्म करती है तो भाप ऊपर उठती है, ठीक वैसे ही सूरज की धूप नदी-तालाब के पानी को भाप बनाकर आसमान में भेजती है। ऊपर ठंड से यह बादल बनता है और जब बादल भारी होते हैं तो झमाझम बारिश बनकर हमारे खेतों और जोरिया में लौट आते हैं।\n\nᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ (In Santhali): ᱡᱮᱞᱮᱠᱟ ᱟᱭᱳ ᱪᱩᱞᱦᱟᱹ ᱨᱮ ᱫᱟᱜ-ᱮ ᱞᱚᱞᱚᱭᱟ ᱟᱨ ᱦᱟᱹᱣᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ, ᱚᱱᱠᱟ ᱜᱮ ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱛᱮ ᱜᱟᱰᱟ ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹᱜ-ᱟ, ᱨᱤᱢᱤᱞ ᱵᱮᱱᱟᱣᱜ-ᱟ, ᱟᱨ ᱡᱟᱹᱲᱤ ᱫᱟᱜ ᱞᱮᱠᱟᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱦᱤᱡᱩᱜ-ᱟ᱾',
    relatableAnalogy:
      'The Chulha & Ketli Analogy: Just like steam coming out of a boiling kettle hits a cold metal plate and turns back into tiny water droplets, warm rising vapor from the pond hits the cold upper atmosphere and turns into rainclouds!',
    localContextStory:
      'Birsa and his sister Somari were grazing their goats near the Subarnarekha river in Ormanjhi during a sunny afternoon. Birsa wondered, "Where did the rain that fell yesterday go?" Masterji smiled and pointed at the sun: "The sun is drinking a little bit of the river right now through evaporation, only to gift it back to our mango orchard tomorrow as fresh rain!"',
    vocabularyGlossary: [
      {
        english: 'Evaporation',
        vernacular: 'वाष्पीकरण (पानी का भाप बनकर उड़ना)',
        pronunciation: 'Vaash-pee-karan',
        example: 'Water on the wet veranda dries quickly in the afternoon sun.',
      },
      {
        english: 'Condensation',
        vernacular: 'संघनन (भाप का ठंडा होकर बादल बनना)',
        pronunciation: 'Sang-ha-nan',
        example: 'Dew drops appearing on cold grass in the early morning.',
      },
      {
        english: 'Precipitation',
        vernacular: 'वर्षा (आसमान से पानी की बूंदों का गिरना)',
        pronunciation: 'Var-shaa',
        example: 'When the clouds turn dark grey and rain begins to fall.',
      },
      {
        english: 'Collection',
        vernacular: 'संग्रहण (तालाब और कुएं में पानी इकट्ठा होना)',
        pronunciation: 'Sang-ra-han',
        example: 'Our village pokhar filling up with sparkling clean water.',
      },
    ],
  },
  animationProject: {
    id: 'anim-water-cycle-g4',
    topic: 'Water Cycle',
    grade: 4,
    language: 'hi',
    totalDuration: 45,
    provider: 'hybrid',
    summaryNarration:
      'Watch how water travels in a magical loop from the village river up into the sky and returns as rain!',
    scenes: [
      {
        id: 'scene-1',
        title: 'Scene 1: The Sun Heats the River',
        order: 1,
        description:
          'Bright golden sun warms the village river. Gentle heat rays shimmer across the water surface.',
        background: 'sky-river',
        characters: [
          {
            id: 'char-sun',
            name: 'Suraj Mama',
            type: 'sun-character',
            position: { x: 80, y: 18 },
            action: 'glow',
          },
        ],
        objects: [
          {
            id: 'obj-river',
            name: 'River Water',
            type: 'water',
            label: 'River / नदी',
            position: { x: 50, y: 82 },
            animation: 'float',
            color: '#38bdf8',
          },
          {
            id: 'obj-heat-rays',
            name: 'Sunlight Rays',
            type: 'arrow',
            label: 'Warm Sun Rays',
            position: { x: 65, y: 45 },
            animation: 'pulse',
            color: '#fbbf24',
          },
        ],
        narration: [
          {
            language: 'en',
            text: 'First, the golden morning sun shines brightly, gently heating the cool water in our river.',
          },
          {
            language: 'hi',
            text: 'सबसे पहले, चमकीला सूरज अपनी सुनहरी किरणों से नदी और तालाब के पानी को गर्म करता है।',
          },
          {
            language: 'sat',
            text: 'ᱯᱩᱭᱞᱩ ᱨᱮ, ᱥᱤᱸᱜᱤ ᱟᱡᱟᱜ ᱞᱚᱞᱚ ᱛᱟᱨᱟᱥ ᱛᱮ ᱜᱟᱰᱟ ᱫᱟᱜ-ᱮ ᱞᱚᱞᱚᱭᱟ᱾',
          },
        ],
        captions: 'The Sun warms the water bodies (नदी और तालाब का पानी गर्म होता है)',
        duration: 8,
        interactionPoint: {
          question: 'What gives energy to warm the water in the pond?',
          options: ['The Moon', 'The Sun', 'Wind', 'Trees'],
          correctIndex: 1,
          hint: 'Look at the glowing yellow circle in the sky!',
        },
      },
      {
        id: 'scene-2',
        title: 'Scene 2: Evaporation (Water turns to Steam)',
        order: 2,
        description:
          'Warm water molecules turn into invisible vapor droplets that gently float upwards toward the sky.',
        background: 'sky-river',
        characters: [],
        objects: [
          {
            id: 'obj-sun-2',
            name: 'Sun',
            type: 'sun',
            position: { x: 82, y: 15 },
            animation: 'glow',
            color: '#f59e0b',
          },
          {
            id: 'obj-vapor-1',
            name: 'Water Vapor 1',
            type: 'vapor',
            label: 'Evaporating Vapor / वाष्पीकरण',
            position: { x: 30, y: 55 },
            animation: 'evaporate',
            color: '#93c5fd',
          },
          {
            id: 'obj-vapor-2',
            name: 'Water Vapor 2',
            type: 'vapor',
            position: { x: 50, y: 48 },
            animation: 'evaporate',
            color: '#bfdbfe',
          },
          {
            id: 'obj-vapor-3',
            name: 'Water Vapor 3',
            type: 'vapor',
            position: { x: 70, y: 52 },
            animation: 'evaporate',
            color: '#93c5fd',
          },
        ],
        narration: [
          {
            language: 'en',
            text: 'As the water gets warmer, it changes into light, invisible steam and floats up into the sky. This is Evaporation!',
          },
          {
            language: 'hi',
            text: 'जैसे ही पानी गर्म होता है, यह हल्की भाप बनकर आसमान की तरफ ऊपर उठने लगता है। इसे वाष्पीकरण कहते हैं!',
          },
          {
            language: 'sat',
            text: 'ᱫᱟᱜ ᱞᱚᱞᱚ ᱠᱟᱛᱮ ᱦᱟᱹᱣᱟᱹ ᱞᱮᱠᱟ ᱪᱮᱛᱟᱱ ᱥᱮᱨᱢᱟ ᱛᱮ ᱨᱟᱠᱟᱵ-ᱟ᱾ ᱱᱚᱣᱟ ᱜᱮ ᱫᱟᱜ ᱦᱟᱹᱣᱟᱹᱜ ᱠᱟᱱᱟ᱾',
          },
        ],
        captions: 'Evaporation: Liquid water transforms into rising vapor (वाष्पीकरण)',
        duration: 9,
      },
      {
        id: 'scene-3',
        title: 'Scene 3: Condensation (Clouds Form)',
        order: 3,
        description:
          'High in the chilly atmosphere, rising vapor cools down and clusters into puffy, dancing clouds.',
        background: 'sky-river',
        characters: [
          {
            id: 'char-cloud',
            name: 'Badal Bhai',
            type: 'cloud-character',
            position: { x: 45, y: 22 },
            action: 'condense',
          },
        ],
        objects: [
          {
            id: 'obj-cloud-1',
            name: 'Puffy Cloud',
            type: 'cloud',
            label: 'Condensing Cloud / संघनन',
            position: { x: 35, y: 25 },
            animation: 'condense',
            color: '#e2e8f0',
          },
          {
            id: 'obj-cloud-2',
            name: 'Dense Cloud',
            type: 'cloud',
            position: { x: 60, y: 22 },
            animation: 'condense',
            color: '#cbd5e1',
          },
        ],
        narration: [
          {
            language: 'en',
            text: 'High up in the cool sky, billions of tiny steam droplets hug each other and form thick clouds. This is Condensation!',
          },
          {
            language: 'hi',
            text: 'ऊंचे ठंडे आसमान में पहुंचकर ये भाप की नन्ही बूंदें आपस में गले मिलती हैं और मिलकर सुंदर बादल बनाती हैं। इसे संघनन कहते हैं!',
          },
          {
            language: 'sat',
            text: 'ᱪᱮᱛᱟᱱ ᱨᱮᱭᱟᱲ ᱥᱮᱨᱢᱟ ᱨᱮ ᱦᱟᱹᱣᱟᱹ ᱫᱚ ᱢᱤᱫ ᱴᱷᱮᱱ ᱡᱟᱣᱨᱟ ᱠᱟᱛᱮ ᱨᱤᱢᱤᱞ ᱵᱮᱱᱟᱣᱜ-ᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱥᱚᱝᱜᱷᱚᱱᱚᱱ ᱠᱟᱱᱟ᱾',
          },
        ],
        captions: 'Condensation: Vapor cools to form fluffy clouds (संघनन से बादल बनते हैं)',
        duration: 10,
      },
      {
        id: 'scene-4',
        title: 'Scene 4: Precipitation (Rain Falls!)',
        order: 4,
        description:
          'The cloud turns dark blue and heavy. Cool winds blow, and sparkling raindrops shower down over the Sal forest.',
        background: 'sky-river',
        characters: [],
        objects: [
          {
            id: 'obj-dark-cloud',
            name: 'Rain Cloud',
            type: 'cloud',
            position: { x: 50, y: 20 },
            animation: 'pulse',
            color: '#64748b',
          },
          {
            id: 'obj-raindrops',
            name: 'Rainfall',
            type: 'rain',
            label: 'Rain / वर्षा / ᱫᱟᱜ ᱡᱟᱹᱲᱤ',
            position: { x: 50, y: 55 },
            animation: 'rain',
            color: '#38bdf8',
          },
        ],
        narration: [
          {
            language: 'en',
            text: 'When the clouds become too heavy with water, they burst into refreshing rain! This is Precipitation.',
          },
          {
            language: 'hi',
            text: 'जब बादल बहुत भारी हो जाते हैं, तो ठंडी हवा चलते ही झमाझम बारिश होने लगती है! इसे वर्षण या बारिश कहते हैं।',
          },
          {
            language: 'sat',
            text: 'ᱛᱤᱱ ᱨᱮ ᱨᱤᱢᱤᱞ ᱟᱹᱰᱤ ᱦᱟᱢᱟᱞᱚᱜ-ᱟ, ᱩᱱ ᱨᱮ ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱮᱦᱚᱵᱚᱜ-ᱟ᱾',
          },
        ],
        captions: 'Precipitation: Water falls from heavy clouds as rain (वर्षा)',
        duration: 9,
      },
      {
        id: 'scene-5',
        title: 'Scene 5: Collection (The Cycle Repeats)',
        order: 5,
        description:
          'Fresh rainwater fills our ponds, streams, and village wells. The river carries it forward, ready to begin again.',
        background: 'sky-river',
        characters: [
          {
            id: 'char-student',
            name: 'Birsa',
            type: 'student-boy',
            position: { x: 18, y: 75 },
            action: 'celebrate',
          },
        ],
        objects: [
          {
            id: 'obj-lake-full',
            name: 'Full Village Pond',
            type: 'water',
            label: 'Village Pokhar / Bandh',
            position: { x: 50, y: 85 },
            animation: 'float',
            color: '#0284c7',
          },
        ],
        narration: [
          {
            language: 'en',
            text: 'The rainwater collects in village ponds, wells, and rivers. When tomorrow comes, the cycle starts all over again!',
          },
          {
            language: 'hi',
            text: 'यह बारिश का पानी हमारे गांव के पोखरों, कुओं और नदियों में इकट्ठा हो जाता है। और कल यह चक्र फिर से शुरू होगा!',
          },
          {
            language: 'sat',
            text: 'ᱱᱚᱣᱟ ᱫᱟᱜ ᱟᱵᱚᱣᱟᱜ ᱵᱟᱸᱫᱷ, ᱯᱩᱠᱷᱨᱤ ᱟᱨ ᱜᱟᱰᱟ ᱨᱮ ᱡᱟᱣᱨᱟᱜ-ᱟ ᱟᱨ ᱪᱟᱹᱠᱩᱨ ᱞᱮᱠᱟ ᱟᱹᱪᱩᱨ ᱛᱟᱦᱮᱸᱱᱟ᱾',
          },
        ],
        captions: 'Collection: Water returns to Earth and the eternal cycle continues! (संग्रहण)',
        duration: 9,
      },
    ],
  },
};

export const DEMO_PLANTS_LESSON: Lesson = {
  id: 'lesson-plants-g3',
  title: 'How Green Leaves Cook Food',
  grade: 3,
  subject: 'Science',
  topic: 'Plant Nutrition & Leaves (पौधे अपना भोजन कैसे बनाते हैं)',
  teachingLanguage: 'en',
  targetLanguage: 'hi',
  isOfflineAvailable: true,
  createdAt: '2026-09-17T09:00:00Z',
  quizId: 'quiz-plants-01',
  pedagogy: {
    conceptBreakdown: [
      '1. Roots are the straws of the plant that drink water from wet mud.',
      '2. Green leaves have tiny mouths (stomata) that breathe in fresh air.',
      '3. Sunlight acts as the gas stove burner giving energy.',
      '4. Green chlorophyll cooks sugar glucose for sweet fruits and strong stems.',
    ],
    simplifiedExplanation:
      'Leaves are the kitchen of the plant! Just as your home kitchen needs vegetables, water, and heat from the stove, a leaf takes water from roots, carbon dioxide from air, and heat from the sun to cook sweet food.',
    vernacularExplanation:
      'पत्ते पौधे की हरी रसोई होते हैं! जैसे हमारे घर में चूल्हा, पानी और चावल मिलकर भात पकता है, वैसे ही पत्तियां धूप, हवा और मिट्टी के पानी से अपना भोजन बनाती हैं।',
    relatableAnalogy:
      'The Village Rasoi Analogy: Roots bring the water bucket, sunlight is the wooden hearth fire, and green leaves are the earthen cooking pot preparing nourishment for the whole plant!',
    localContextStory:
      'Under the big sacred Sal tree in Ranchi district, Somari noticed how its green leaves always faced towards the morning sunshine. Guruji explained that every leaf was holding out its hands to catch sunbeams to cook breakfast!',
    vocabularyGlossary: [
      {
        english: 'Roots',
        vernacular: 'जड़ (पौधे का पैर और पानी पीने वाला अंग)',
        pronunciation: 'Jad',
        example: 'Deep roots keep the big Banyan tree steady during storms.',
      },
      {
        english: 'Photosynthesis',
        vernacular: 'प्रकाश संश्लेषण (धूप की मदद से भोजन पकाना)',
        pronunciation: 'Pra-kaash Sansh-le-shan',
        example: 'Leaves using bright morning sunshine to grow strong.',
      },
    ],
  },
  animationProject: {
    id: 'anim-plants-g3',
    topic: 'How Plants Make Food',
    grade: 3,
    language: 'hi',
    totalDuration: 30,
    provider: 'hybrid',
    summaryNarration: 'See how a little plant drinks water and catches sunbeams to grow big and strong!',
    scenes: [
      {
        id: 'scene-p1',
        title: 'Roots Drinking Water',
        order: 1,
        description: 'Underground roots absorbing sparkling water droplets from deep soil.',
        background: 'farm',
        characters: [],
        objects: [
          {
            id: 'obj-plant',
            name: 'Young Plant',
            type: 'plant',
            label: 'Roots / जड़ें',
            position: { x: 50, y: 60 },
            animation: 'grow',
            color: '#22c55e',
          },
        ],
        narration: [
          {
            language: 'hi',
            text: 'पौधे की जड़ें मिट्टी के अंदर से पानी और जरूरी खनिज को ऊपर खींचती हैं।',
          },
          {
            language: 'en',
            text: 'Under the ground, thirsty roots drink up water and minerals like tiny drinking straws.',
          },
        ],
        captions: 'Roots absorb water from soil (जड़ें मिट्टी से पानी खींचती हैं)',
        duration: 8,
      },
      {
        id: 'scene-p2',
        title: 'Leaves Catching Sunshine',
        order: 2,
        description: 'Green leaves expand toward bright yellow sunlight while oxygen is released.',
        background: 'farm',
        characters: [],
        objects: [
          {
            id: 'obj-sun',
            name: 'Sun',
            type: 'sun',
            position: { x: 80, y: 15 },
            animation: 'glow',
            color: '#eab308',
          },
          {
            id: 'obj-leaf',
            name: 'Green Leaf',
            type: 'leaf',
            label: 'Kitchen of the Plant / रसोई',
            position: { x: 50, y: 45 },
            animation: 'pulse',
            color: '#16a34a',
          },
        ],
        narration: [
          {
            language: 'hi',
            text: 'हरी पत्तियां धूप की मदद से खाना पकाती हैं और हमारे लिए ताजी हवा छोड़ती हैं!',
          },
          {
            language: 'en',
            text: 'Green leaves take in warm sunshine and give us fresh clean oxygen to breathe!',
          },
        ],
        captions: 'Leaves make food with sunlight (पत्तियां धूप से भोजन बनाती हैं)',
        duration: 9,
      },
    ],
  },
};

export const DEMO_QUIZ_WATER_CYCLE: Quiz = {
  id: 'quiz-water-cycle-01',
  lessonId: 'lesson-water-cycle-g4',
  topic: 'Water Cycle (जल चक्र)',
  grade: 4,
  language: 'hi',
  difficulty: 'adaptive',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'When wet clothes dry in the sun, where does the water go?',
      promptVernacular: 'धूप में सूखने पर गीले कपड़ों का पानी कहाँ चला जाता है?',
      options: [
        'It is swallowed by the ground cloth',
        'It turns into vapor and rises into the air (Evaporation)',
        'It turns into ice',
        'It disappears into nothingness forever',
      ],
      correctAnswer: 1,
      explanation: 'Heat from the sun transforms liquid water into invisible water vapor through evaporation.',
      vernacularExplanation: 'धूप की गर्मी से पानी भाप बनकर हवा में उड़ जाता है। इसे वाष्पीकरण कहते हैं।',
      conceptTested: 'Evaporation (वाष्पीकरण)',
      misconceptionGuidance: {
        '0': 'The cloth does not swallow water; sunshine warms it into invisible steam.',
        '2': 'Water turns to ice only in extreme cold, not under the warm sun!',
        '3': 'Matter is never destroyed; water simply changes form from liquid to gas.',
      },
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      prompt: 'What are clouds in the sky made of?',
      promptVernacular: 'आसमान में तैरते बादल वास्तव में किस चीज़ से बने होते हैं?',
      options: [
        'White cotton candy',
        'Smoke from village kitchens only',
        'Billions of tiny cooled water droplets (Condensation)',
        'Thick white paint',
      ],
      correctAnswer: 2,
      explanation: 'Clouds are formed when rising water vapor cools down and condenses into tiny liquid droplets.',
      vernacularExplanation: 'बादल ठंडी होकर घनी बनी नन्हीं पानी की बूंदों के समूह होते हैं (संघनन)।',
      conceptTested: 'Condensation (संघनन)',
      misconceptionGuidance: {
        '0': 'Clouds look soft like cotton, but they are made of cold water droplets!',
        '1': 'While smoke rises, rainclouds are formed from pure condensed water vapor.',
      },
    },
    {
      id: 'q3',
      type: 'true-false',
      prompt: 'Precipitation means water falling from clouds as rain, drizzle, or hail.',
      promptVernacular: 'वर्षा (Precipitation) का अर्थ है बादलों से पानी का बूंदों के रूप में नीचे गिरना।',
      options: ['True (सही / ᱥᱟᱹᱨᱤ)', 'False (गलत / ᱵᱟᱹᱲᱤᱡ)'],
      correctAnswer: 0,
      explanation: 'Precipitation is any water that falls from the clouds onto the Earth.',
      vernacularExplanation: 'हाँ, जब बादल भारी हो जाते हैं तो बारिश की बूंदें गिरती हैं, जिसे वर्षण कहते हैं।',
      conceptTested: 'Precipitation (वर्षा)',
      misconceptionGuidance: {
        '1': 'Precipitation is the scientific term for rainfall and hail.',
      },
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      prompt: 'Why does the water cycle never run out of water on Earth?',
      promptVernacular: 'पृथ्वी पर जल चक्र का पानी कभी पूरी तरह समाप्त क्यों नहीं होता?',
      options: [
        'Because alien spaceships bring new water every night',
        'Because water continuously recycles in a continuous loop',
        'Because trees create new water from rocks',
        'Because the ocean keeps growing bigger every year',
      ],
      correctAnswer: 1,
      explanation: 'Water continuously moves from Earth to the sky and back in an endless closed cycle.',
      vernacularExplanation: 'क्योंकि पानी एक चक्र (loop) में लगातार घूमता रहता है: जमीन से आसमान, आसमान से जमीन!',
      conceptTested: 'Conservation of Water & The Closed Cycle',
      misconceptionGuidance: {
        '0': 'Earth has contained the same water for millions of years!',
      },
    },
  ],
};

export const DEMO_STUDENT_PROGRESS: StudentProgress = {
  studentId: 'student-birsa-01',
  overallMastery: 78,
  streakDays: 4,
  totalXp: 460,
  level: 3,
  completedLessonIds: ['lesson-plants-g3'],
  subjectMastery: {
    'Environmental Studies': 85,
    Science: 75,
    Mathematics: 68,
    'Language (Hindi/Santhali)': 82,
  },
  strongAreas: [
    'Plant Life & Roots',
    'Local Flora Identification',
    'Oral Storytelling in Santhali',
  ],
  weakAreas: [
    'Distinguishing Evaporation vs Condensation',
    'Fraction representation on number lines',
  ],
  recentAttempts: [
    {
      id: 'att-01',
      studentId: 'student-birsa-01',
      quizId: 'quiz-plants-01',
      answers: { q1: 1, q2: 0, q3: 0 },
      score: 3,
      maxScore: 3,
      understoodConcepts: ['Roots absorb water', 'Leaves need sunlight', 'Chlorophyll role'],
      weakConcepts: [],
      misconceptionsDetected: [],
      adaptedNextActivity: 'Advance to Water Cycle Lesson & Animation',
      timestamp: '2026-09-17T11:20:00Z',
    },
  ],
};

export const DEMO_WORKSHEET: Worksheet = {
  id: 'worksheet-water-cycle-g4',
  grade: 4,
  subject: 'Environmental Studies',
  topic: 'Water Cycle (जल चक्र)',
  primaryLanguage: 'en',
  vernacularLanguage: 'hi',
  learningObjectives: [
    'Identify the 4 stages of the water cycle.',
    'Connect classroom science with local water bodies (nadi, pokhar, bandh).',
    'Write key terms in both English and Mother Tongue.',
  ],
  createdAt: '2026-09-18T10:00:00Z',
  sections: [
    {
      sectionTitle: 'Section A: Vocabulary Match (शब्दावली मिलान)',
      instructions: {
        en: 'Match the English term with its vernacular definition and meaning.',
        vernacular: 'अंग्रेजी शब्द को उसके सही अर्थ और मातृभाषा अनुवाद से मिलाइए।',
      },
      questions: [
        {
          qNumber: 1,
          questionTextEn: 'Evaporation is:',
          questionTextVernacular: 'वाष्पीकरण क्या है?',
          options: [
            'A) Clouds releasing rain (बारिश होना)',
            'B) Liquid water turning into warm vapor by sunlight (धूप से पानी का भाप बनना)',
            'C) Water freezing into ice (बर्फ जमना)',
          ],
          answerKey: 'B',
        },
        {
          qNumber: 2,
          questionTextEn: 'Condensation is:',
          questionTextVernacular: 'संघनन क्या है?',
          options: [
            'A) Vapor cooling down to form fluffy clouds (भाप का ठंडा होकर बादल बनना)',
            'B) Water drying on clothes (कपड़े सूखना)',
            'C) River flowing into ocean (नदी का बहना)',
          ],
          answerKey: 'A',
        },
      ],
    },
    {
      sectionTitle: 'Section B: Short Answer & Local Observation (स्थानीय अवलोकन)',
      instructions: {
        en: 'Answer in 1-2 sentences using your preferred language.',
        vernacular: 'अपनी पसंद की भाषा (हिन्दी/संथाली/मुण्डारी/अंग्रेजी) में 1-2 वाक्यों में उत्तर दीजिए।',
      },
      questions: [
        {
          qNumber: 3,
          questionTextEn: 'Name two places in or around your village where rainwater gets collected.',
          questionTextVernacular: 'अपने गांव या आसपास के ऐसे दो स्थानों के नाम लिखिए जहाँ बारिश का पानी जमा होता है।',
          answerLines: 2,
          answerKey: 'Village Pokhar (तालाब), Bandh (बांध), Well (कुआं), or River (नदी).',
        },
        {
          qNumber: 4,
          questionTextEn: 'Draw or describe what happens when mother covers a boiling pot with a cold lid.',
          questionTextVernacular: 'बताइए जब माँ चूल्हे पर उबलते बर्तन को ढक्कन से ढकती है, तो ढक्कन पर पानी की बूंदें क्यों जमती हैं?',
          answerLines: 3,
          answerKey: 'Steam hits the cold lid and condenses into liquid droplets, just like clouds in the sky!',
        },
      ],
    },
  ],
};
