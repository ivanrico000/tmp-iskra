"use client";

import { useEffect, useState } from "react";
import { useChat } from "./ChatContext";
import { useTranslations } from "next-intl";

/* =========================
   TYPEWRITER COMPONENT
========================= */
function TypewriterText() {
  const t = useTranslations("hero");
  const text = t("description");

  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const speed = isDeleting ? 35 : 55;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(text.slice(0, index + 1));
        setIndex(index + 1);

        if (index + 1 === text.length) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        setDisplayedText(text.slice(0, index - 1));
        setIndex(index - 1);

        if (index <= 0) {
          setIsDeleting(false);
          setIndex(0);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text]);

  return (
    <p className="mt-6 text-base md:text-lg text-white/95">
      {displayedText}
      <span className="ml-1 inline-block w-[2px] h-[1em] bg-white animate-blink align-middle" />
    </p>
  );
}

/* =========================
   HERO
========================= */
export default function Hero() {
  const { setOpen } = useChat();
  const t = useTranslations("hero");

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      {/* 🎥 VIDEO DE FONDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 🌫️ OVERLAY OSCURO PARA LEGIBILIDAD */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENIDO */}
      <div
        className="
          relative z-10 flex h-full items-center justify-center px-6
          text-white font-semibold tracking-wide
          drop-shadow-[0_3px_8px_rgba(0,0,0,1)]
        "
      >
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            {t("title1")}
            <span className="block mt-2">{t("title2")}</span>
          </h1>

          {/* ✨ TYPEWRITER */}
          <TypewriterText />

          {/* 🔘 BOTONES */}
          <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {/* BOTÓN 1 */}
            <button
              onClick={() => setOpen(true)}
              className="group relative flex w-full max-w-xs justify-center rounded-full p-[3px] overflow-hidden sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full spark-border" />
              <span className="relative z-10 w-full rounded-full bg-black/80 px-8 py-3 text-center text-base sm:text-lg font-semibold tracking-wide text-white transition hover:bg-white hover:text-black">
                {t("quote")}
              </span>
            </button>

            {/* BOTÓN 2 */}
            <button
              onClick={() => setOpen(true)}
              className="group relative flex w-full max-w-xs justify-center rounded-full p-[3px] overflow-hidden sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full spark-border" />
              <span className="relative z-10 w-full rounded-full bg-black/80 px-8 py-3 text-center text-base sm:text-lg font-semibold tracking-wide text-white transition hover:bg-white hover:text-black">
                {t("influencer")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
