import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import { useHarmoniController } from './hooks/useHarmoniController';

// Components
import HeroSection from "./components/v3/HeroSection";
import RulesStage from "./components/v3/RulesStage";
import SetupStage from "./components/v3/SetupStage";
import JourneyInterface from "./components/v3/JourneyInterface";
import BondingDiceModal from "./components/v3/BondingDiceModal";
import LoadingScreen from "./components/v3/LoadingScreen";
import AffirmationStage from "./components/v3/AffirmationStage";
import MusicPlayer from "./components/v3/MusicPlayer";
import EntryScreen from "./components/v3/EntryScreen";
import NoiseOverlay from "./components/effects/NoiseOverlay";
import ConnectionScreen from "./components/v3/ConnectionScreen";

const GlowBorder = () => (
  <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-80" />
);

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const lenis = useLenis();
  const { gameState: state, actions, data } = useHarmoniController();

  useEffect(() => {
    if ((state.stage === 'welcome' || state.stage === 'complete') && lenis) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }
  }, [state.stage, lenis]);

  const combinedState = { ...state, destinations: data.destinations };

  // Handle entry - start music 3s after tap
  const handleEntry = () => {
    setHasEntered(true);
    setTimeout(() => setMusicEnabled(true), 3000);
  };

  // Handle rules agreement
  const handleRulesAgreed = () => {
    setRulesAgreed(true);
  };

  // Handle journey initiation with affirmation
  const handleInitiateWithAffirmation = () => {
    setShowAffirmation(true);
  };

  const handleAffirmationComplete = () => {
    setShowAffirmation(false);
    actions.startJourney();
  };

  // Smooth scroll helper
  const scrollToSection = (sectionId) => {
    if (lenis) {
      lenis.scrollTo(`#${sectionId}`, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Entry Screen - First thing user sees */}
      <AnimatePresence mode="wait">
        {!hasEntered && <EntryScreen onEnter={handleEntry} />}
      </AnimatePresence>

      {/* Loading Screen - After entry */}
      <AnimatePresence mode="wait">
        {hasEntered && loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Rules Overlay - Must agree before proceeding */}
      <AnimatePresence mode="wait">
        {hasEntered && !loading && !rulesAgreed && (
          <RulesStage onConfirm={handleRulesAgreed} />
        )}
      </AnimatePresence>

      {/* Affirmation Stage - Shows after setup, before journey */}
      <AnimatePresence mode="wait">
        {showAffirmation && (
          <AffirmationStage onComplete={handleAffirmationComplete} />
        )}
      </AnimatePresence>

      {/* Main App - Only visible after rules agreed */}
      {hasEntered && !loading && rulesAgreed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="main-container relative w-full flex flex-col bg-[#000105] snap-y snap-mandatory"
        >
          <GlowBorder />
          <NoiseOverlay opacity={0.03} />
          <MusicPlayer autoStart={musicEnabled} paused={showAffirmation} />

          {/* SECTION 1: HERO */}
          <section id="hero" className="relative w-full min-h-screen z-30 flex flex-col snap-start">
            <HeroSection onEnter={() => scrollToSection('connection')} />
          </section>

          {/* SECTION 2: CONNECTION - About bonding */}
          <section id="connection" className="relative w-full min-h-screen z-30 snap-start">
            <ConnectionScreen onContinue={() => scrollToSection('setup')} />
          </section>

          {/* SECTION 3: SETUP */}
          <section id="setup" className="relative w-full min-h-screen z-30 bg-[#000105] snap-start">
            <SetupStage
              destinations={data.destinations.slice(0, 3)}
              onSelectDest={actions.setDestination}
              onSelectTime={actions.setTimerDuration}
              onInitiate={handleInitiateWithAffirmation}
            />
          </section>

          {/* GAME OVERLAY - Soft Transitions */}
          <AnimatePresence mode="wait">
            {state.stage === 'journey' && (
              <motion.div
                key="journey-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 z-[999] bg-[#000105]"
              >
                <JourneyInterface
                  data={combinedState}
                  onNext={actions.handleContinue}
                  onHome={() => {
                    actions.setStage('welcome');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  onRisk={actions.handleDareToRisk}
                  onBond={actions.rollDice}
                  actions={actions}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bonding Modal */}
          <AnimatePresence>
            {state.showBondingPrompt && (
              <BondingDiceModal
                prompt={state.currentBondingPrompt || { text: "Hold eye contact for 30 seconds." }}
                onClose={() => actions.setShowBondingPrompt(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}