import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import { fallbackQuestions as localFallbackQuestions, fallbackRiskyQuestions as localFallbackRiskyQuestions } from '../data/fallback-questions';

// Initialize Supabase (Keep existing config)
const supabase = createClient(
  'https://mvcavbkzhclnwmrrffpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y2F2Ymt6aGNsbndtcnJmZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDM1MTAsImV4cCI6MjA4NDc3OTUxMH0.o99uK58ebEdk_BI5lzUVkfSlKY3TllHnvMGhXY1_zPQ'
);

// --- Helper: Shuffle ---
const smartShuffle = (array) => {
  if (!array) return [];
  const fixed = array.filter(q => q.fixed);
  const others = array.filter(q => !q.fixed);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [...fixed, ...others];
};

export const roundInfo = {
  0: { name: "Warm Welcome", color: "from-amber-100" },
  1: { name: "First Glimpses", color: "from-blue-50" },
  2: { name: "Authentic Self", color: "from-emerald-50" },
  3: { name: "Heart Space", color: "from-rose-50" },
  4: { name: "Dreams & Visions", color: "from-violet-50" },
  5: { name: "Forever Questions", color: "from-indigo-50" },
  6: { name: "Compatibility", color: "from-slate-50" },
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

export function useHarmoniController() {
  // --- STATE ---
  const [stage, setStage] = useState("welcome");
  const [destination, setDestination] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(localFallbackQuestions);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Timer State (RESTORED)
  const [timerDuration, setTimerDuration] = useState(null); // Selected minutes
  const [timeRemaining, setTimeRemaining] = useState(null); // Countdown seconds
  const [timerActive, setTimerActive] = useState(false);

  // Interaction State
  const [showBondingPrompt, setShowBondingPrompt] = useState(false);
  const [currentBondingPrompt, setCurrentBondingPrompt] = useState(null);
  const [showRiskyQuestion, setShowRiskyQuestion] = useState(false);
  const [currentRiskyQuestion, setCurrentRiskyQuestion] = useState(null);

  // Data State
  const [bondingPrompts, setBondingPrompts] = useState([]);
  const [riskyQuestions, setRiskyQuestions] = useState([]);

  // --- REFS (LOGIC FIX) ---
  const questionCounter = useRef(0);
  const nextBondingTarget = useRef(Math.floor(Math.random() * 3) + 2);

  // --- 1. DATA LOADING ---
  const fetchQuestionsFromSupabase = useCallback(async () => {
    try {
      setLoading(true);
      const { data: qData, error } = await supabase.from('questions').select('*');

      if (error) throw error;

      if (qData && qData.length > 0) {
        const organized = { round0: [], round1: [], round2: [], round3: [], round4: [], round5: [], round6: [] };
        qData.forEach(q => {
          const key = `round${q.round_number || q.round || 0}`;
          if (organized[key]) organized[key].push(q);
        });
        Object.keys(organized).forEach(key => organized[key] = smartShuffle(organized[key]));
        setQuestions(organized);
      }

      // Load Prompts Parallel
      const { data: bData } = await supabase.from('bonding_prompts').select('*');
      if (bData) setBondingPrompts(bData);

      const { data: rData } = await supabase.from('risky_questions').select('*');
      if (rData) setRiskyQuestions(rData);

    } catch (err) {
      console.warn("Supabase fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestionsFromSupabase();
  }, [fetchQuestionsFromSupabase]);

  // --- 2. TIMER LOGIC (RESTORED) ---
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setStage("complete"); // Time is up!
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
    if (!destination) return;
    if (!timerDuration) {
      alert("Please select a time duration.");
      return;
    }

    // Initialize Timer
    setTimeRemaining(timerDuration * 60); // Convert mins to seconds
    setTimerActive(true);

    setStage('journey');
    setAudioPlaying(true);

    // Reset Logic Counters
    questionCounter.current = 0;
    nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
  };

  const handleContinue = () => {
    // 1. BONDING LOGIC
    questionCounter.current += 1;
    console.log(`🎲 Bonding: ${questionCounter.current} / ${nextBondingTarget.current}`);

    if (questionCounter.current >= nextBondingTarget.current) {
      // Trigger Bonding
      if (bondingPrompts.length > 0) {
        const random = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
        setCurrentBondingPrompt(random);
      }
      setShowBondingPrompt(true);

      // Reset Counter
      questionCounter.current = 0;
      nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
    }
    else {
      // 2. NAVIGATION LOGIC
      const curRoundKey = `round${currentRound}`;
      const roundQs = questions?.[curRoundKey] || [];

      // Safety check if data isn't loaded
      if (roundQs.length === 0) return;

      if (currentQuestion < roundQs.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentRound < 6) {
        setCurrentRound(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setStage("complete"); // End of content
        setTimerActive(false);
      }
      // Progress Bar (Approximate)
      setProgress(prev => Math.min(prev + 2, 100));
    }
  };

  const handleDareToRisk = () => {
    const q = riskyQuestions[Math.floor(Math.random() * riskyQuestions.length)];
    setCurrentRiskyQuestion(q);
    setShowRiskyQuestion(true);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    gameState: {
      stage, destination, currentRound, currentQuestion,
      currentQuestionData: questions?.[`round${currentRound}`]?.[currentQuestion],
      audioPlaying, showBondingPrompt, currentBondingPrompt,
      showRiskyQuestion, currentRiskyQuestion,
      timeRemaining: formatTime(timeRemaining),
      roundInfo,
      questions // Expose for debugging if needed
    },
    actions: {
      setStage, setDestination, startJourney, handleContinue,
      setAudioPlaying, setShowBondingPrompt, setShowRiskyQuestion,
      handleDareToRisk, setTimerDuration,
      rollDice: () => { }
    },
    data: {
      destinations
    }
  };
}
