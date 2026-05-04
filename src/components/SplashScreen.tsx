import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "pulse" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-red/5" />

          {/* Shield + Heartbeat */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
              {/* Glow behind shield */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 30px 5px hsl(187 100% 45% / 0.1)",
                    "0 0 60px 15px hsl(187 100% 45% / 0.25)",
                    "0 0 30px 5px hsl(187 100% 45% / 0.1)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Shield SVG */}
              <motion.svg
                viewBox="0 0 128 128"
                className="w-full h-full relative z-10"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                {/* Shield shape */}
                <motion.path
                  d="M64 8 L112 30 L112 60 C112 90 90 112 64 122 C38 112 16 90 16 60 L16 30 Z"
                  fill="none"
                  stroke="hsl(187 100% 45%)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                <motion.path
                  d="M64 8 L112 30 L112 60 C112 90 90 112 64 122 C38 112 16 90 16 60 L16 30 Z"
                  fill="hsl(187 100% 45% / 0.06)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                />

                {/* Heartbeat line crossing shield */}
                <motion.polyline
                  points="0,65 30,65 40,65 48,45 54,85 60,35 66,90 72,50 78,65 88,65 128,65"
                  fill="none"
                  stroke="hsl(0 100% 62%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                  filter="url(#glow-red)"
                />

                {/* Glow filters */}
                <defs>
                  <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </motion.svg>

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/30"
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
              />
            </div>

            {/* Text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-foreground tracking-wider uppercase mono-text">Neon Watchdog Pro</h1>
              <motion.p
                className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Insider Threat Intelligence
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-0.5 rounded-full bg-border overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(187 100% 45%), hsl(0 100% 62%), hsl(187 100% 45%))" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.6, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              className="text-[10px] mono-text text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.5, 1] }}
              transition={{ delay: 1.2, duration: 1.5 }}
            >
              Initializing ML defense systems...
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
