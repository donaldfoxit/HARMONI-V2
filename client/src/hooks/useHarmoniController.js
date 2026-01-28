import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import { fallbackQuestions as localFallbackQuestions, fallbackRiskyQuestions as localFallbackRiskyQuestions } from '../data/fallback-questions';

// Initialize Supabase client
const supabase = createClient(
  'https://mvcavbkzhclnwmrrffpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y2F2Ymt6aGNsbndtcnJmZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDM1MTAsImV4cCI6MjA4NDc3OTUxMH0.o99uK58ebEdk_BI5lzUVkfSlKY3TllHnvMGhXY1_zPQ'
);

// --- Helper Functions ---
const smartShuffle = (array) => {
  if (!array) return [];
  const fixed = array.filter(q => q.fixed);
  const depth1 = array.filter(q => q.depth === 1 && !q.fixed);
  const depth2 = array.filter(q => q.depth === 2);
  const depth3 = array.filter(q => q.depth === 3);

  const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const shuffled1 = shuffle(depth1);
  const shuffled2 = shuffle(depth2);
  const shuffled3 = shuffle(depth3);

  const result = [...fixed];
  const maxLen = Math.max(shuffled1.length, shuffled2.length, shuffled3.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < shuffled1.length) result.push(shuffled1[i]);
    if (i < shuffled2.length) result.push(shuffled2[i]);
    if (i < shuffled3.length) result.push(shuffled3[i]);
  }

  return result;
};

// Session persistence helpers
let sessionState = null;
const saveSession = (session) => {
  try {
    sessionState = session;
  } catch (e) {
    console.error('Failed to save session:', e);
  }
};
const loadSession = () => sessionState;
const clearSession = () => { sessionState = null; };

const getRandomBondingInterval = () => Math.floor(Math.random() * 4) + 2;

// --- Constants ---
export const roundInfo = {
  0: { name: "Warm Welcome", color: "from-amber-100 to-orange-50", darkColor: "from-amber-900 to-orange-800", desc: "Let's get comfortable" },
  1: { name: "First Glimpses", color: "from-blue-50 to-cyan-50", darkColor: "from-blue-900 to-cyan-800", desc: "Seeing each other" },
  2: { name: "Authentic Self", color: "from-emerald-50 to-teal-50", darkColor: "from-emerald-900 to-teal-800", desc: "Who you truly are" },
  3: { name: "Heart Space", color: "from-rose-50 to-pink-50", darkColor: "from-rose-900 to-pink-800", desc: "How you love" },
  4: { name: "Dreams & Visions", color: "from-violet-50 to-purple-50", darkColor: "from-violet-900 to-purple-800", desc: "Where you're headed" },
  5: { name: "Forever Questions", color: "from-indigo-50 to-blue-50", darkColor: "from-indigo-900 to-blue-800", desc: "What commitment means" },
  6: { name: "Compatibility", color: "from-slate-50 to-gray-50", darkColor: "from-slate-900 to-gray-800", desc: "Do your worlds align?" },
};

export const destinations = [
  {
    name: "Moonlit Garden",
    icon: "🌙",
    visual: "✨",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
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
    icon: "👑",
    visual: "🏰",
    image: "https://images.unsplash.com/photo-1596276850239-216694e9d505?auto=format&fit=crop&w=1000&q=80",
    description: "Ancient nobility & timeless love",
    gradient: "from-blue-50 to-slate-100",
    darkGradient: "from-blue-900 to-slate-900",
    theme: "mist",
    youtubeId: "8O-1qB-fxjc",
    songName: "Kingdom Sleep Music",
    songArtist: "Relaxation"
  },
  {
    name: "Forest Walk",
    icon: "🌲",
    visual: "🍃",
    image: "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&w=1000&q=80",
    description: "Nature's gentle embrace",
    gradient: "from-green-100 to-emerald-100",
    darkGradient: "from-green-900 to-emerald-900",
    theme: "woods",
    youtubeId: "MqDODqQO0FI",
    songName: "Forest Nature Sounds",
    songArtist: "Nature Ambience"
  },
  {
    name: "City Night",
    icon: "🌃",
    visual: "🏙️",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop",
    description: "Urban intimacy & lights",
    gradient: "from-slate-100 to-blue-100",
    darkGradient: "from-slate-900 to-blue-900",
    theme: "night",
    youtubeId: "qQVAKjBcP-E",
    songName: "City Night Jazz",
    songArtist: "Jazz Relaxation"
  },
  {
    name: "Cozy Hearth", // Moved down
    icon: "🔥",
    visual: "🕯️",
    image: "https://images.unsplash.com/photo-1542296332-2e44929562ad?q=80&w=2788&auto=format&fit=crop",
    description: "Warm fireside talks",
    gradient: "from-orange-100 to-amber-100",
    darkGradient: "from-orange-900 to-amber-900",
    theme: "hearth",
    youtubeId: "zxl_e35dP5k",
    songName: "Fireplace Ambience",
    songArtist: "Ambient"
  },
  {
    name: "Golden Dawn",
    icon: "🌅",
    visual: "☀️",
    image: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?q=80&w=2940&auto=format&fit=crop",
    description: "New beginnings together",
    gradient: "from-amber-100 to-yellow-100",
    darkGradient: "from-amber-900 to-yellow-900",
    theme: "dawn",
    youtubeId: "2Z4m40lBfE0",
    songName: "Morning Meditation",
    songArtist: "Peaceful Music"
  },
  {
    name: "Aurora Dreams",
    icon: "🌌",
    visual: "💫",
    image: "https://images.unsplash.com/photo-1531366916337-5d07148b85d8?q=80&w=2940&auto=format&fit=crop",
    description: "Cosmic connection",
    gradient: "from-violet-100 to-pink-100",
    darkGradient: "from-violet-900 to-pink-900",
    theme: "aurora",
    youtubeId: "jgpJVI3tZgw",
    songName: "Aurora Ambient",
    songArtist: "Cosmic Music"
  },
  {
    name: "Zen Temple",
    icon: "🏯",
    visual: "🌸",
    image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?q=80&w=2787&auto=format&fit=crop",
    description: "Peaceful mindful space",
    gradient: "from-rose-100 to-pink-100",
    darkGradient: "from-rose-900 to-pink-900",
    theme: "zen",
    youtubeId: "sYqZ6RfVqpE",
    songName: "Zen Meditation",
    songArtist: "Peaceful Silence"
  }
];

// --- The Hook ---
export function useHarmoniController() {
  const [stage, setStage] = useState("welcome");
  const [destination, setDestination] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [deepLevel, setDeepLevel] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showBondingPrompt, setShowBondingPrompt] = useState(false);
  const [currentBondingPrompt, setCurrentBondingPrompt] = useState(null);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ q: "", round: 0, depth: 2 });
  const [timerDuration, setTimerDuration] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showRiskyQuestion, setShowRiskyQuestion] = useState(false);
  const [currentRiskyQuestion, setCurrentRiskyQuestion] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [riskyQuestions, setRiskyQuestions] = useState([]);
  const [bondingPrompts, setBondingPrompts] = useState([]);
  const [nextBondingPromptAt, setNextBondingPromptAt] = useState(getRandomBondingInterval());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOGIC RESTORATION: Progress-Based Bonding
  const [questionsSinceLastBond, setQuestionsSinceLastBond] = useState(0);
  const [bondingTarget, setBondingTarget] = useState(3);


  // --- Logic Functions ---

  const fetchQuestionsFromSupabase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching questions from Supabase...');

      // Fetch all questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*');

      if (questionsError) {
        console.error('❌ Questions error:', questionsError);
        throw questionsError;
      }

      // Fetch risky questions
      const { data: riskyData, error: riskyError } = await supabase
        .from('risky_questions')
        .select('*');

      if (riskyError) {
        console.error('❌ Risky questions error:', riskyError);
        setRiskyQuestions(localFallbackRiskyQuestions);
      } else {
        const mappedRisky = riskyData?.map(item => ({
          q: item.question || item.q,
          depth: item.depth || 4,
          intensity: item.intensity || "high"
        })) || [];
        setRiskyQuestions(mappedRisky.length > 0 ? mappedRisky : localFallbackRiskyQuestions);
      }

      // Fetch bonding prompts
      const { data: bondingData, error: bondingError } = await supabase
        .from('bonding_prompts')
        .select('*');

      if (bondingError) {
        console.error('❌ Bonding prompts error:', bondingError);
      } else {
        setBondingPrompts(bondingData || []);
      }

      // Organize questions
      const organizedQuestions = {
        round0: [], round1: [], round2: [], round3: [], round4: [], round5: [], round6: [],
      };

      let validQuestionsCount = 0;
      if (questionsData && questionsData.length > 0) {
        questionsData.forEach(item => {
          const q = {
            q: item.question || item.q || item.question_text,
            round: item.round_number !== undefined ? item.round_number : (item.round !== undefined ? item.round : 0),
            depth: item.depth || item.depth_level || 2,
            fixed: item.fixed || item.is_fixed || false,
            category: item.category || "default"
          };
          const roundNum = (q.round !== undefined && q.round !== null) ? q.round : 0;
          const roundKey = `round${roundNum}`;

          if (organizedQuestions[roundKey]) {
            organizedQuestions[roundKey].push(q);
            validQuestionsCount++;
          } else {
            organizedQuestions['round0'].push(q);
            validQuestionsCount++;
          }
        });
      }

      if (validQuestionsCount === 0) {
        console.warn('⚠️ No valid questions found. Using fallback data.');
        setQuestions({
          round0: smartShuffle([...localFallbackQuestions.round0, ...(customQuestions || []).filter(q => q.round === 0)]),
          round1: smartShuffle([...localFallbackQuestions.round1, ...(customQuestions || []).filter(q => q.round === 1)]),
          round2: smartShuffle([...localFallbackQuestions.round2, ...(customQuestions || []).filter(q => q.round === 2)]),
          round3: smartShuffle([...localFallbackQuestions.round3, ...(customQuestions || []).filter(q => q.round === 3)]),
          round4: smartShuffle([...localFallbackQuestions.round4, ...(customQuestions || []).filter(q => q.round === 4)]),
          round5: smartShuffle([...localFallbackQuestions.round5, ...(customQuestions || []).filter(q => q.round === 5)]),
          round6: smartShuffle([...localFallbackQuestions.round6, ...(customQuestions || []).filter(q => q.round === 6)]),
        });
      } else {
        const shuffledQuestions = {
          round0: smartShuffle([...organizedQuestions.round0, ...(customQuestions || []).filter(q => q.round === 0)]),
          round1: smartShuffle([...organizedQuestions.round1, ...(customQuestions || []).filter(q => q.round === 1)]),
          round2: smartShuffle([...organizedQuestions.round2, ...(customQuestions || []).filter(q => q.round === 2)]),
          round3: smartShuffle([...organizedQuestions.round3, ...(customQuestions || []).filter(q => q.round === 3)]),
          round4: smartShuffle([...organizedQuestions.round4, ...(customQuestions || []).filter(q => q.round === 4)]),
          round5: smartShuffle([...organizedQuestions.round5, ...(customQuestions || []).filter(q => q.round === 5)]),
          round6: smartShuffle([...organizedQuestions.round6, ...(customQuestions || []).filter(q => q.round === 6)]),
        };
        setQuestions(shuffledQuestions);
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      setError(error.message);
      setLoading(false);
      // Fallback on error
      setQuestions({
        round0: smartShuffle([...localFallbackQuestions.round0]),
        round1: smartShuffle([...localFallbackQuestions.round1]),
        round2: smartShuffle([...localFallbackQuestions.round2]),
        round3: smartShuffle([...localFallbackQuestions.round3]),
        round4: smartShuffle([...localFallbackQuestions.round4]),
        round5: smartShuffle([...localFallbackQuestions.round5]),
        round6: smartShuffle([...localFallbackQuestions.round6]),
      });
    }
  }, [customQuestions]); // dependency on customQuestions to re-shuffle if needed

  // --- Effects ---

  // Load session & fetch questions
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      setStage(savedSession.stage);
      setDestination(savedSession.destination);
      setCurrentRound(savedSession.currentRound);
      setCurrentQuestion(savedSession.currentQuestion);
      setProgress(savedSession.progress);
      setAnswers(savedSession.answers);
      setCustomQuestions(savedSession.customQuestions || []);
      setDeepLevel(savedSession.deepLevel);
      setTimerDuration(savedSession.timerDuration);
      setTimeRemaining(savedSession.timeRemaining);
      setTimerActive(savedSession.timerActive);
      setAnsweredCount(savedSession.answeredCount || 0);
      setSessionLoaded(true);

      if (savedSession.stage === 'journey') {
        setAudioPlaying(true);
      }
    }
    fetchQuestionsFromSupabase();
  }, [fetchQuestionsFromSupabase]);

  // Save session effect
  useEffect(() => {
    if (sessionLoaded) {
      const session = {
        stage, destination, currentRound, currentQuestion, progress,
        answers, customQuestions, deepLevel, timerDuration, timeRemaining,
        timerActive, answeredCount, lastUpdated: Date.now()
      };
      saveSession(session);
    }
  }, [stage, destination, currentRound, currentQuestion, progress, answers,
    customQuestions, deepLevel, timerDuration, timeRemaining, timerActive,
    answeredCount, sessionLoaded]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeRemaining === 0 && timerActive) {
      setStage("complete");
      setTimerActive(false);
      clearSession();
    }
  }, [timerActive, timeRemaining]);

  // Audio Auto-play interaction
  useEffect(() => {
    if (stage === "journey" && !audioInitialized) {
      const handleFirstInteraction = () => {
        setAudioPlaying(true);
        setAudioInitialized(true);
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [stage, audioInitialized]);

  // Timer-based bonding logic removed in favor of progress-based logic



  // --- Actions ---

  const getRoundKey = (round) => `round${round}`;
  const currentRoundQuestions = questions?.[getRoundKey(currentRound)] || [];
  const totalQuestionsInRound = currentRoundQuestions.length;

  const handleContinue = () => {
    // playClick(); // Assumed helper function or omitted if not imported

    // A. Check for Bonding Trigger
    const nextCount = questionsSinceLastBond + 1;

    // If we hit the random target (e.g., 3 questions), triggers the Dice
    if (nextCount >= bondingTarget) {
      console.log("🎲 Bonding Target Hit! Triggering Dice.");

      // Ensure prompt exists before showing
      if ((!currentBondingPrompt || currentBondingPrompt.text === "Look into each other's eyes for 60 seconds.") && bondingPrompts.length > 0) {
        const randomPrompt = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
        setCurrentBondingPrompt(randomPrompt);
      }

      setShowBondingPrompt(true); // Open the Modal
      // playChime(); 

      // Reset counters for the NEXT time
      setQuestionsSinceLastBond(0);
      // Set new random target between 2 and 5
      setBondingTarget(Math.floor(Math.random() * (5 - 2 + 1) + 2));
    } else {
      // Just increment and keep going
      setQuestionsSinceLastBond(nextCount);
    }

    // B. Existing Navigation Logic
    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    if (currentQuestion < totalQuestionsInRound - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentRound < 6) {
      setCurrentRound(currentRound + 1);
      setCurrentQuestion(0);
    } else {
      setStage("complete");
      clearSession();
    }
  };

  const handleDareToRisk = () => {
    const randomRiskyQuestion = riskyQuestions[Math.floor(Math.random() * riskyQuestions.length)];
    setCurrentRiskyQuestion(randomRiskyQuestion);
    setShowRiskyQuestion(true);
  };

  const handleRiskyResponse = (answered) => {
    if (answered) {
      setDeepLevel(deepLevel + 20);
      setProgress(progress + 20);
    }
    setShowRiskyQuestion(false);

    // Logic duped from handleContinue roughly
    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    if (newAnsweredCount === nextBondingPromptAt) {
      setShowDiceRoll(true);
      setNextBondingPromptAt(newAnsweredCount + getRandomBondingInterval());
    }

    if (currentQuestion < totalQuestionsInRound - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentRound < 6) {
      setCurrentRound(currentRound + 1);
      setCurrentQuestion(0);
    } else {
      setStage("complete");
      clearSession();
    }
  };

  const rollDice = () => {
    setShowDiceRoll(false);
    const randomPrompt = bondingPrompts[Math.floor(Math.random() * bondingPrompts.length)];
    setCurrentBondingPrompt(randomPrompt);
    setShowBondingPrompt(true);
    setTimeout(() => setShowBondingPrompt(false), 10000);
  };

  const addQuestion = () => {
    if (newQuestion.q.trim()) {
      const questionObj = {
        q: newQuestion.q,
        round: newQuestion.round,
        depth: parseInt(newQuestion.depth),
        category: "custom",
      };
      const updatedCustom = [...customQuestions, questionObj];
      setCustomQuestions(updatedCustom);
      setNewQuestion({ q: "", round: 0, depth: 2 });
      setShowAddQuestion(false);
      // Logic for merging is handled in fetchQuestions via useCallback dependency on customQuestions, 
      // BUT simpler way is to trigger re-fetch or manual merge.
      // Since fetchQuestions depends on [customQuestions], it should re-run and re-organize.
    }
  };

  const removeQuestion = (index) => {
    const updatedCustom = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedCustom);
  };

  const startJourney = () => {
    if (!destination || timerDuration === null) {
      alert("Please select both a destination and set a timer!");
      return;
    }
    setTimeRemaining(timerDuration * 60);
    setTimerActive(true);
    setStage('journey');
    setSessionLoaded(true);
    setAnsweredCount(0);
    setTimeout(() => {
      setAudioPlaying(true);
      setAudioInitialized(true);
    }, 100);
  };

  const resetJourney = () => {
    setStage('welcome');
    setCurrentRound(0);
    setCurrentQuestion(0);
    setProgress(0);
    setDeepLevel(0);
    setAnsweredCount(0);
    setAnswers([]);
    setDestination(null);
    setTimerDuration(null);
    setTimeRemaining(null);
    setTimerActive(false);
    fetchQuestionsFromSupabase();
    setAudioPlaying(false);
    setAudioInitialized(false);
    setShowRiskyQuestion(false);
    setShowDiceRoll(false);
    setShowBondingPrompt(false);
    clearSession();
  };

  const toggleAudio = () => setAudioPlaying(!audioPlaying);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    gameState: {
      stage, destination, currentRound, currentQuestion, progress, answers, questions,
      deepLevel, audioPlaying, audioInitialized, showBondingPrompt,
      currentBondingPrompt: currentBondingPrompt || { text: "Look into each other's eyes for 60 seconds." },
      customQuestions, showAddQuestion, newQuestion, timerDuration, timeRemaining,
      timerActive, showDiceRoll, darkMode, showRiskyQuestion, currentRiskyQuestion,
      sessionLoaded, answeredCount, riskyQuestions, bondingPrompts, loading, error,
      currentRoundQuestions, totalQuestionsInRound, roundInfo
    },
    actions: {
      setStage, setDestination, setDarkMode, setShowAddQuestion, setNewQuestion,
      setTimerDuration, startJourney, resetJourney, toggleAudio, handleContinue,
      handleDareToRisk, handleRiskyResponse, rollDice, addQuestion, removeQuestion,
      formatTime, setAudioPlaying, setShowDiceRoll, setShowBondingPrompt, setShowRiskyQuestion
    },
    data: {
      destinations,
      roundInfo
    }
  };
}
export default useHarmoniController;
