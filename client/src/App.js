import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import { useHarmoniController } from './hooks/useHarmoniController';
import { YouTubePlayer } from './components/audio/YouTubePlayer';

// V3 Components
import HeroSection from "./components/v3/HeroSection";
import RulesStage from "./components/v3/RulesStage";
import SetupStage from "./components/v3/SetupStage";
import JourneyInterface from "./components/v3/JourneyInterface";
import BondingDiceModal from "./components/v3/BondingDiceModal";

// Global Effects
import NoiseOverlay from "./components/effects/NoiseOverlay";

const GlowBorder = () => (
  <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-80" />
);



export default function App() {
  const lenis = useLenis();

  const {
    gameState: state,
    actions,
    data
  } = useHarmoniController();

  // Scroll Reset Logic (Restored)
  useEffect(() => {
    if ((state.stage === 'welcome' || state.stage === 'complete') && lenis) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }
  }, [state.stage, lenis]);

  // Merge destinations
  const combinedState = { ...state, destinations: data.destinations };

  return (
    <div className="main-container relative w-full flex flex-col bg-[#000105]">
      <GlowBorder />
      <NoiseOverlay opacity={0.04} />

      {/* SECTION 1: HERO (Top) */}
      <section id="hero" className="relative w-full min-h-screen z-30 flex flex-col">
        <HeroSection onEnter={() => document.getElementById('rules').scrollIntoView({ behavior: 'smooth' })} />
        {/* Navigation Prompt */}
        <div className="absolute bottom-10 w-full text-center z-50 pointer-events-none">
          <p className="text-xs tracking-[0.5em] opacity-50 animate-pulse text-white">SCROLL TO BEGIN</p>
        </div>
      </section>

      {/* SECTION 2: RULES (Attached directly below Hero) */}
      <section id="rules" className="relative w-full min-h-screen z-30 bg-[#000105]">
        <RulesStage onConfirm={() => document.getElementById('setup').scrollIntoView({ behavior: 'smooth' })} />
      </section>

      {/* SECTION 3: SETUP (Attached directly below Rules) */}
      <section id="setup" className="relative w-full min-h-screen z-30 bg-[#000105]">
        <SetupStage
          destinations={data.destinations.slice(0, 3)}
          onSelectDest={actions.setDestination}
          onSelectTime={actions.setTimerDuration}
          onInitiate={actions.startJourney}
        />
      </section>

      {/* GAME LAYER: Only appears when stage === 'journey' */}
      <AnimatePresence>
        {state.stage === 'journey' && (
          <motion.div
            key="journey-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black"
          >
            <JourneyInterface
              data={combinedState}
              onNext={actions.handleContinue}
              onHome={() => actions.setStage('welcome')}
              onRisk={actions.handleDareToRisk}
              onBond={actions.rollDice}
              actions={actions}
            />
          </motion.div>
        )}

        {state.showBondingPrompt && (
          <BondingDiceModal
            prompt={state.currentBondingPrompt || { text: "Hold eye contact for 30 seconds." }}
            onClose={() => actions.setShowBondingPrompt(false)}
          />
        )}
      </AnimatePresence>

      {
        state.stage === 'complete' && (
          <motion.div className="fixed inset-0 z-[999] bg-black flex items-center justify-center">
            <h1 className="text-5xl font-playfair text-white">Journey Complete</h1>
          </motion.div>
        )
      }

      <div className="fixed bottom-0 left-0 opacity-0 pointer-events-none">
        <YouTubePlayer playing={state.audioPlaying} videoId={state.destination?.youtubeId || "LcDjP3cdk0g"} />
      </div>
    </div >
  );
}