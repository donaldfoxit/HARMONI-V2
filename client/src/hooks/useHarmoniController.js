import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import { fallbackQuestions as localFallbackQuestions, fallbackRiskyQuestions as localFallbackRiskyQuestions } from '../data/fallback-questions';

// --- CONFIGURATION ---
const supabase = createClient(
  'https://mvcavbkzhclnwmrrffpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y2F2Ymt6aGNsbndtcnJmZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDM1MTAsImV4cCI6MjA4NDc3OTUxMH0.o99uK58ebEdk_BI5lzUVkfSlKY3TllHnvMGhXY1_zPQ'
);

// --- HELPER: Smart Shuffle ---
const smartShuffle = (array) => {
  if (!array || !Array.isArray(array)) return [];
  const fixed = array.filter(q => q.fixed);
  const others = array.filter(q => !q.fixed);

  // Fisher-Yates
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }

  return [...fixed, ...others];
};

// --- HELPER: Data Organizer (Main Questions) ---
const organizeQuestions = (rawData) => {
  const organized = { round0: [], round1: [], round2: [], round3: [], round4: [], round5: [], round6: [] };

  if (!rawData) return organized;

  const dataArray = Array.isArray(rawData) ? rawData : Object.values(rawData).flat();

  dataArray.forEach(item => {
    if (!item) return;
    // NORMALIZE: Ensure 'q' property exists regardless of DB column name
    const q = {
      q: item.question || item.q || item.question_text || "Breathe...",
      round: item.round_number ?? item.round ?? 0,
      depth: item.depth || 2,
      fixed: item.fixed || false
    };
    const key = `round${q.round}`;
    if (organized[key]) organized[key].push(q);
    else organized['round0'].push(q);
  });

  Object.keys(organized).forEach(k => {
    organized[k] = smartShuffle(organized[k]);
  });

  return organized;
};

// --- HELPER: Data Normalizer (Risky Questions) ---
const normalizeRisky = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return [];
  return rawData.map(item => ({
    q: item.question || item.q || item.question_text || "What is a truth you've never shared?",
    depth: item.depth || 4,
    intensity: item.intensity || 'high'
  }));
};

// --- EXPORTS: Constants (Restored from Robust Version) ---
export const roundInfo = {
  0: { name: "Warm Welcome", color: "from-amber-100" },
  1: { name: "First Glimpses", color: "from-blue-50" },
  2: { name: "Authentic Self", color: "from-emerald-50" },
  3: { name: "Heart Space", color: "from-rose-50" },
  4: { name: "Dreams & Visions", color: "from-violet-50" },
  5: { name: "Forever Questions", color: "from-indigo-50" },
  6: { name: "Compatibility", color: "from-slate-50" },
};

export const destinations = [
  {
    name: "Moonlit Garden",
    image: "/assets/jonathan-borba-Fa8xXVzkkXc-unsplash.jpg",
    icon: "🌙",
    visual: "✨",
    description: "Quiet magic under stars",
    gradient: "from-indigo-100 to-purple-100",
    darkGradient: "from-indigo-900 to-purple-900",
    theme: "moonlight",
    youtubeId: "LcDjP3cdk0g",
    songName: "Clair de Lune Piano",
    songArtist: "Classical"
  },
  {
    name: "Royal Realm",
    image: "/assets/dilip-poddar-7JboWm-aZr4-unsplash.jpg",
    icon: "👑",
    visual: "🏰",
    description: "Ancient nobility & timeless love",
    gradient: "from-blue-50 to-slate-100",
    darkGradient: "from-blue-900 to-slate-900",
    theme: "mist",
    youtubeId: "8O-1qB-fxjc",
    songName: "Kingdom Sleep Music",
    songArtist: "Relaxation"
  },
  {
    name: "Nature Walk",
    image: "/assets/anneliese-phillips-uv4-vl3liKM-unsplash.jpg",
    icon: "🌲",
    visual: "🍃",
    description: "Nature's gentle embrace",
    gradient: "from-green-100 to-emerald-100",
    darkGradient: "from-green-900 to-emerald-900",
    theme: "woods",
    youtubeId: "MqDODqQO0FI",
    songName: "Forest Nature Sounds",
    songArtist: "Nature Ambience"
  }
];

// --- HOOK START ---
export function useHarmoniController() {
  // 1. STATE INITIALIZATION - Always start with Valid Local Data
  // organizeQuestions ensures structure is correct immediately.
  const [questions, setQuestions] = useState(() => organizeQuestions(localFallbackQuestions));

  const [stage, setStage] = useState("welcome");
  const [destination, setDestination] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Interaction State
  const [showBondingPrompt, setShowBondingPrompt] = useState(false);
  const [currentBondingPrompt, setCurrentBondingPrompt] = useState(null);
  const [showRiskyQuestion, setShowRiskyQuestion] = useState(false);
  const [currentRiskyQuestion, setCurrentRiskyQuestion] = useState(null);
  const [timerDuration, setTimerDuration] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Data State - Initialize with Fallback
  const [riskyQuestions, setRiskyQuestions] = useState(localFallbackRiskyQuestions || []);
  const [bondingPrompts, setBondingPrompts] = useState([]);

  // --- REFS ---
  const questionCounter = useRef(0);
  const nextBondingTarget = useRef(Math.floor(Math.random() * 3) + 2);

  // --- 2. SUPABASE FETCH (The Triple-Layer Fix) ---
  const fetchQuestionsFromSupabase = useCallback(async () => {
    try {
      // A. Questions
      const { data: qData, error: qError } = await supabase.from('questions').select('*');
      // SAFETY LAYER 2: Only update if we get valid, non-empty data
      if (!qError && qData && qData.length > 0) {
        // NORMALIZE: Use organizer to ensure 'q' property exists
        const organized = organizeQuestions(qData);
        setQuestions(organized);
      }

      // B. Bonding Prompts
      const { data: bData } = await supabase.from('bonding_prompts').select('*');
      if (bData && bData.length > 0) {
        setBondingPrompts(bData);
      }

      // C. Risky Questions 
      const { data: rData, error: rError } = await supabase.from('risky_questions').select('*');
      // SAFETY LAYER 2: Check for empty array
      if (!rError && rData && rData.length > 0) {
        // NORMALIZE: Map DB fields to 'q' property
        setRiskyQuestions(normalizeRisky(rData));
      } else {
        console.log("Keeping local risky questions (Supabase empty/fail)");
      }
    } catch (e) {
      console.warn("Supabase load failed, staying on fallback:", e);
    }
  }, []);

  useEffect(() => {
    fetchQuestionsFromSupabase();
  }, [fetchQuestionsFromSupabase]);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStage("complete");
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // --- ACTIONS ---

  const startJourney = () => {
    if (!destination) return alert("Please select a path.");
    if (!timerDuration) return alert("Please set a time.");

    setTimeRemaining(timerDuration * 60);
    setTimerActive(true);
    setStage('journey');
    setAudioPlaying(true);

    questionCounter.current = 0;
    nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
  };

  const handleContinue = () => {
    questionCounter.current += 1;

    if (questionCounter.current >= nextBondingTarget.current) {
      // Bonding
      let prompt = { text: "Look into each other's eyes for 60 seconds." };
      if (bondingPrompts.length > 0) {
        prompt = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
      }
      setCurrentBondingPrompt(prompt);
      setShowBondingPrompt(true);
      questionCounter.current = 0;
      nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
    }
    else {
      // Navigation
      const curRoundKey = `round${currentRound}`;
      const roundQs = questions?.[curRoundKey] || [];

      // Safety Check: If round is empty, skip or end
      if (roundQs.length === 0) {
        console.warn(`Round ${currentRound} is empty!`);
      }

      if (currentQuestion < roundQs.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentRound < 6) {
        setCurrentRound(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setStage("complete");
        setTimerActive(false);
      }

      setProgress(prev => Math.min(prev + 2, 100));
    }
  };

  const handleDareToRisk = () => {
    // SAFETY LAYER 3: Handler Failsafe
    let pool = riskyQuestions;
    if (!pool || pool.length === 0) pool = localFallbackRiskyQuestions;
    if (!pool || pool.length === 0) pool = [{ q: "What is a truth you've never shared?" }];

    const q = pool[Math.floor(Math.random() * pool.length)];
    setCurrentRiskyQuestion(q);
    setShowRiskyQuestion(true);
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe Question Accessor
  const currentRoundQuestions = questions?.[`round${currentRound}`] || [];
  const currentQuestionData = currentRoundQuestions[currentQuestion] || null;

  return {
    gameState: {
      stage, destination, currentRound, currentQuestion,
      currentQuestionData,
      currentRoundQuestions,
      audioPlaying, showBondingPrompt, currentBondingPrompt,
      showRiskyQuestion, currentRiskyQuestion,
      timeRemaining: formatTime(timeRemaining),
      questions,
      questionsAnswered: questionCounter.current // For Risk button progression
    },
    actions: {
      setStage, setDestination, startJourney, handleContinue,
      setAudioPlaying, setShowBondingPrompt, setShowRiskyQuestion,
      handleDareToRisk, setTimerDuration,
      rollDice: () => { }
    },
    data: {
      destinations // Exported from constant
    }
  };
}
export default useHarmoniController;