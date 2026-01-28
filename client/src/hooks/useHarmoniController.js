import { useState, useEffect, useRef } from "react";
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

// --- HELPER: Data Organizer ---
const organizeQuestions = (rawData) => {
  const organized = { round0: [], round1: [], round2: [], round3: [], round4: [], round5: [], round6: [] };

  if (!rawData) return organized;

  // Handle both Array (flat) and Object (already organized) structures
  const dataArray = Array.isArray(rawData) ? rawData :
    Object.values(rawData).flat();

  dataArray.forEach(item => {
    if (!item) return;
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

// --- HOOK START ---
export function useHarmoniController() {
  // 1. STATE INITIALIZATION (The "Breathe" Fix)
  // We run organizeQuestions immediately so data exists on first render.
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

  // Data State - Initialize with Fallback (The Risky Fix)
  // We start with localFallbackRiskyQuestions so it is NEVER empty.
  const [riskyQuestions, setRiskyQuestions] = useState(localFallbackRiskyQuestions || []);
  const [bondingPrompts, setBondingPrompts] = useState([]);

  // --- REFS (The Bonding Fix) ---
  const questionCounter = useRef(0);
  const nextBondingTarget = useRef(Math.floor(Math.random() * 3) + 2);

  // --- 2. SUPABASE FETCH ---
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Questions
        const { data: qData } = await supabase.from('questions').select('*');
        if (qData && qData.length > 0) {
          setQuestions(organizeQuestions(qData));
        }

        // B. Risky (PROPER LOGIC RESTORED)
        // If DB returns data, use it. If not, keep the local list we started with.
        const { data: rData } = await supabase.from('risky_questions').select('*');
        if (rData && rData.length > 0) {
          setRiskyQuestions(rData);
        }
        // Note: We removed the "else { set([]) }" bug. We simply do nothing if it's empty,
        // preserving the localFallbackRiskyQuestions.

        // C. Bonding
        const { data: bData } = await supabase.from('bonding_prompts').select('*');
        if (bData && bData.length > 0) {
          setBondingPrompts(bData);
        }
      } catch (e) {
        // Silent fail is fine because we already loaded fallback data in useState
      }
    };
    initData();
  }, []);

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

    // Reset Refs
    questionCounter.current = 0;
    nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
  };

  const handleContinue = () => {
    // 1. BONDING LOGIC (Ref-based)
    questionCounter.current += 1;

    if (questionCounter.current >= nextBondingTarget.current) {
      // Pick Random Prompt
      let prompt = { text: "Look into each other's eyes for 60 seconds." };
      if (bondingPrompts.length > 0) {
        prompt = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
      }

      setCurrentBondingPrompt(prompt);
      setShowBondingPrompt(true);

      // Reset Logic
      questionCounter.current = 0;
      nextBondingTarget.current = Math.floor(Math.random() * 3) + 2;
    }
    else {
      // 2. NAVIGATION LOGIC
      const curRoundKey = `round${currentRound}`;
      const roundQs = questions?.[curRoundKey] || [];

      if (currentQuestion < roundQs.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentRound < 6) {
        setCurrentRound(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        setStage("complete");
        setTimerActive(false);
      }

      // Update Progress
      setProgress(prev => Math.min(prev + 2, 100));
    }
  };

  const handleDareToRisk = () => {
    // Logic: Pick from the state. Since we fixed initialization and fetching, 
    // 'riskyQuestions' is guaranteed to be a full array (either from DB or Local).
    const pool = riskyQuestions;

    if (pool && pool.length > 0) {
      const q = pool[Math.floor(Math.random() * pool.length)];
      setCurrentRiskyQuestion(q);
      setShowRiskyQuestion(true);
    } else {
      // This should theoretically never happen now, but safe to keep just in case.
      setCurrentRiskyQuestion({ q: "What is a truth you've never shared?" });
      setShowRiskyQuestion(true);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe Question Accessor
  const currentRoundQuestions = questions?.[`round${currentRound}`] || [];
  const currentQuestionData = currentRoundQuestions[currentQuestion] || { q: "Loading..." };

  return {
    gameState: {
      stage, destination, currentRound, currentQuestion,
      currentQuestionData,
      currentRoundQuestions, // Required for UI
      audioPlaying, showBondingPrompt, currentBondingPrompt,
      showRiskyQuestion, currentRiskyQuestion,
      timeRemaining: formatTime(timeRemaining),
      questions
    },
    actions: {
      setStage, setDestination, startJourney, handleContinue,
      setAudioPlaying, setShowBondingPrompt, setShowRiskyQuestion,
      handleDareToRisk, setTimerDuration,
      rollDice: () => { }
    },
    // --- LOCAL ASSETS (Verified) ---
    data: {
      destinations: [
        {
          id: 'moon',
          name: 'Moonlit Garden',
          image: '/assets/jonathan-borba-Fa8xXVzkkXc-unsplash.jpg',
          youtubeId: "LcDjP3cdk0g"
        },
        {
          id: 'royal',
          name: 'Royal Kingdom',
          image: '/assets/noukka-signe-s90wTklH2to-unsplash.jpg',
          youtubeId: "8O-1qB-fxjc"
        },
        {
          id: 'nature',
          name: 'Nature Walk',
          image: 'x,
          youtubeId: "MqDODqQO0FI"
        }
      ]
    }
  };
}
export default useHarmoniController;