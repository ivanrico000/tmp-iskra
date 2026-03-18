"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

type State = "idle" | "loading" | "done";

export default function DownloadButton() {
  const [state, setState] = useState<State>("idle");
  const t = useTranslations("downloadButton");

  const handleClick = () => {
    if (state !== "idle") return;

    setState("loading");

    setTimeout(() => {
      setState("done");

      const link = document.createElement("a");
      link.href = "/portafolio-iskra.pdf";
      link.download = "Portafolio-Iskra.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1700);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="
        relative flex items-center justify-center
        h-14 px-12
        text-sm font-medium tracking-wide
        text-white bg-transparent
        focus:outline-none overflow-hidden
      "
      animate={{
        width: state === "done" ? 56 : "auto",
        borderRadius: state === "done" ? 999 : 14,
        scale: state === "loading" ? 0.97 : 1,
      }}
      transition={{
        borderRadius: { duration: 0.5, ease: "easeInOut" },
        width: { duration: 0.45, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Gradient border */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] p-[1px] bg-gradient-to-br from-purple-400/70 via-fuchsia-500/70 to-purple-600/70">
        <span className="block h-full w-full rounded-[inherit] bg-black/40 backdrop-blur" />
      </span>

      <AnimatePresence mode="wait">
        {/* IDLE */}
        {state === "idle" && (
          <motion.span
            key="idle"
            className="relative z-10 flex items-center gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowDown size={16} />
            {t("downloadPortfolio")}
          </motion.span>
        )}

        {/* LOADING */}
        {state === "loading" && (
          <motion.svg
            key="loading"
            className="absolute z-10"
            width="48"
            height="48"
            viewBox="0 0 100 100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              scale: { duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="276"
              strokeDashoffset="276"
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="grad" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </motion.svg>
        )}

        {/* DONE */}
        {state === "done" && (
          <motion.span
            key="done"
            className="relative z-10 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
          >
            <Check size={20} className="text-purple-400" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
