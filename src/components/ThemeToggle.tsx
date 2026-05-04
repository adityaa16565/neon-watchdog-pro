import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-muted transition-colors"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? (
          <Sun className="w-3.5 h-3.5 text-neon-amber" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-primary" />
        )}
      </motion.div>
    </button>
  );
}
