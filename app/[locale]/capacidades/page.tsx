"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type AnimationPhase = "pending" | "video" | "fade-out" | "complete";

function IntroAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>("pending");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("introSeen")) {
      setPhase("complete");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("complete");
      sessionStorage.setItem("introSeen", "1");
      return;
    }
    setPhase("video");
  }, []);

  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  const handleEnded = useCallback(() => {
    sessionStorage.setItem("introSeen", "1");
    setPhase("fade-out");
  }, []);

  const handleFadeOutEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (phase === "fade-out") setPhase("complete");
    },
    [phase],
  );

  if (phase === "complete") return null;

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={phase === "fade-out" ? handleFadeOutEnd : undefined}
      className={`fixed inset-0 z-9999 bg-black flex items-center justify-center ${phase === "fade-out" ? "transition-transform duration-700 ease-in-out -translate-y-full" : ""}`}
    >
      {phase !== "pending" && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          className="absolute w-full h-full object-cover"
        >
          <source src="/videos/logo.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}

const OMNI_ICONS = [
  "https://www.omc.com/wp-content/uploads/2025/12/Agent-Orchestration-icon.svg",
  "https://www.omc.com/wp-content/uploads/2025/12/AI-Powered-Content-Creation-icon.svg",
  "https://www.omc.com/wp-content/uploads/2025/12/Predictive-Intelligence-icon.svg",
  "https://www.omc.com/wp-content/uploads/2025/12/Intelligence-Infused-Data-icon.svg",
  "https://www.omc.com/wp-content/uploads/2025/12/Outcome-Based-Media-Buying-icon.svg",
  "https://www.omc.com/wp-content/uploads/2025/12/Geo-Optimization-icon.svg",
];

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import topSectionAnimation from "../../../public/animaciones/initial.json";
import orangeCircleLottie from "../../../public/animaciones/circle.json";
import investorsLottie from "../../../public/animaciones/investors.json";

// Lottie necesita cargarse dinámicamente en Next.js para evitar errores de Client-Side mismatch o problemas con el objeto window
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function OrbitAnimation({
  items,
  isMobile,
}: {
  items: string[];
  isMobile: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lottieRef = useRef<any>(null);
  const bordersRef = useRef<(HTMLDivElement | null)[]>([]);
  const isHovered = useRef(false);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5); // Acelera la animación un 50%
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let rotationAngle = 0;
    let targetAngle: number | null = null;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!isHovered.current) {
        // Rotación anti-horaria: 360 grados / 20s = -18 grados x segundo
        rotationAngle -= 30 * (dt / 1000);
        targetAngle = null;
      } else {
        // Al hacer hover, calcular el "snap" (múltiplo de la separación 360/items.length)
        if (targetAngle === null) {
          const step = 360 / items.length;
          targetAngle = Math.round(rotationAngle / step) * step;
        }

        let diff = targetAngle - rotationAngle;
        // Normalizar diferencia entre -180 y 180
        diff = ((diff + 540) % 360) - 180;

        // Acercarse suavemente al centro del Lottie focal (ease-out)
        if (Math.abs(diff) > 0.05) {
          rotationAngle += diff * (dt / 150);
        } else {
          rotationAngle = targetAngle;
        }
      }

      // 1. Gira el contenedor padre por DOM (alta performance)
      if (containerRef.current) {
        containerRef.current.style.transform = `rotate(${rotationAngle}deg)`;
      }

      // 2. Contrarresta el giro en los componentes hijos y recalcula opacidad + blur
      items.forEach((_, index) => {
        const itemEl = itemsRef.current[index];
        const borderEl = bordersRef.current[index];

        // Ángulo absoluto de este elemento orbitando (0° = lado derecho)
        const baseAngle = (index / items.length) * 360;
        let absAngle = (baseAngle + rotationAngle) % 360;
        if (absAngle < 0) absAngle += 360;

        // Focal point logic: 0 deg (right) for desktop, 270 deg (top) for mobile
        const focalAngle = isMobile ? 270 : 0;
        let distToFocal = Math.abs(absAngle - focalAngle);
        if (distToFocal > 180) distToFocal = 360 - distToFocal;

        // Opacidad del borde: en móvil/md aparece arriba (focal) y desaparece abajo.
        // En desktop sigue la lógica original de ocultarse cerca del foco.
        if (borderEl) {
          let borderOpacity = 1;
          if (isMobile) {
            const fadeStart = 90;
            const fadeEnd = 160;
            if (distToFocal > fadeEnd) {
              borderOpacity = 0;
            } else if (distToFocal > fadeStart) {
              const t = (distToFocal - fadeStart) / (fadeEnd - fadeStart);
              borderOpacity = 1 - t;
            } else {
              borderOpacity = 1;
            }
          } else {
            if (distToFocal < 60) {
              borderOpacity = 0;
            } else if (distToFocal < 120) {
              borderOpacity = (distToFocal - 60) / 60;
            } else {
              borderOpacity = 1;
            }
          }
          borderEl.style.opacity = borderOpacity.toString();
        }

        if (itemEl) {
          // Contrarrotación + blur + opacidad
          let textOpacity = 1;
          let blurAmount = 0;

          // Mobile: Disappear near the bottom (distToFocal > 140)
          // Desktop: Disappear near the left (distToFocal > 130)
          const fadeStart = isMobile ? 90 : 70;
          const fadeEnd = isMobile ? 160 : 130;

          if (distToFocal > fadeEnd) {
            textOpacity = 0.0;
            blurAmount = 8;
          } else if (distToFocal > fadeStart) {
            const t = (distToFocal - fadeStart) / (fadeEnd - fadeStart);
            textOpacity = 1 - t;
            blurAmount = t * 8;
          }

          itemEl.style.transform = `rotate(${-rotationAngle}deg)`;
          itemEl.style.opacity = textOpacity.toString();
          itemEl.style.filter =
            blurAmount > 0 ? `blur(${blurAmount}px)` : "none";
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [items.length, isMobile]);

  return (
    <div
      className="group relative w-full aspect-square max-w-[600px] flex items-center justify-center mx-auto cursor-pointer"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      {/* Guías visuales de órbita */}
      <div className="absolute inset-[15%] rounded-full border border-gray-100 transition-all duration-500 group-hover:border-gray-200"></div>

      {/* Contenedor que rota */}
      <div className="absolute inset-0" ref={containerRef}>
        {items.map((item, index) => {
          const angle = (index / items.length) * 360;
          return (
            <div
              key={item}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translate(var(--orbit-radius)) rotate(-${angle}deg) translate(-50%, -50%)`,
              }}
            >
              {/* Elemento que contrarresta la rotación para no quedar de cabeza */}
              <div
                className="shrink-0 flex items-center justify-center"
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
              >
                <a
                  href={`#${item.replace(/\s+/g, "-").toLowerCase()}`}
                  className="group/circle relative flex items-center justify-center rounded-full font-light font-['Cormorant_Garamond',serif] italic text-black transition-all duration-300 decoration-none cursor-pointer text-center leading-none"
                  style={{
                    width: "var(--orbit-circle-size)",
                    height: "var(--orbit-circle-size)",
                    fontSize: "var(--orbit-font-size)",
                  }}
                >
                  {/* Borde dinámico de media luna animado por JS */}
                  <div
                    ref={(el) => {
                      bordersRef.current[index] = el;
                    }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-r-[rgba(100,100,100,0.8)] group-hover/circle:opacity-0 pointer-events-none"
                    style={{
                      borderRightWidth: "2.5px",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 10%, black 40%, black 60%, transparent 90%)",
                      maskImage:
                        "linear-gradient(to bottom, transparent 10%, black 40%, black 60%, transparent 90%)",
                    }}
                  ></div>

                  {/* Borde dinámico de media luna animado por JS */}

                  <span className="relative z-10 w-full px-4 whitespace-pre-line">
                    {item}
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Círculo Focal Lottie en el lado derecho (desktop) o arriba (mobile) */}
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none z-20"
        style={{
          transform: isMobile
            ? `translate(0, calc(-1 * var(--orbit-radius))) translate(-50%, -50%) scale(var(--orbit-lottie-scale, 1.3))`
            : `translate(var(--orbit-radius)) translate(-50%, -50%) scale(var(--orbit-lottie-scale, 1.3))`,
          width: "var(--orbit-circle-size)",
          height: "var(--orbit-circle-size)",
          filter: "none",
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={orangeCircleLottie}
          loop={true}
          style={{ width: "100%", height: "100%", filter: "none" }} // opcional pero útil
        />
      </div>
    </div>
  );
}

function OmniCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("capacidadesPage");
  const translatedCards = t.raw("omni.cards") as {
    title: string;
    body: string;
  }[];

  const cards = [
    { type: "image" as const, title: "", body: "", icon: "" },
    ...translatedCards.map((card, i) => ({
      type: "dark" as const,
      title: card.title,
      body: card.body,
      icon: OMNI_ICONS[i],
    })),
  ];

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  return (
    <div className="mt-12">
      <style>{`[data-omni-scroll]::-webkit-scrollbar{display:none}`}</style>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        data-omni-scroll
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {cards.map((card) =>
          card.type === "image" ? (
            <div
              key="omni-image"
              className="snap-center shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                width: "clamp(320px, 19vw, 420px)",
                height: "clamp(380px, 44vh, 550px)",
                backgroundColor: "#9333EA",
              }}
            >
              <img
                src="/images/iskra-logo.png"
                alt="Iskra"
                className="w-8/12 object-contain"
              />
            </div>
          ) : (
            <div
              key={card.title}
              className="snap-start flex-shrink-0 rounded-2xl bg-black p-9 flex flex-col justify-between"
              style={{
                width: "clamp(320px, 19vw, 420px)",
                height: "clamp(380px, 44vh, 550px)",
              }}
            >
              <div className="flex flex-col h-full">
                <strong className="omni-card-heading font-extrabold tracking-[clamp(-1.32px,-0.11vw,-1.835px)] text-2xl font-sans  text-white">
                  {card.title}
                </strong>
                <div className="w-40 m-auto">
                  <img
                    src={card.icon!}
                    alt={`${card.title} icon`}
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
              </div>
              <p className="omni-card-body font-['Cormorant_Garamond',serif] italic font-light leading-tight text-white text-xl">
                {card.body}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Navigation: Arrows + Pill Dots */}
      <div className="flex items-center justify-between mt-8 gap-6">
        <div className="flex gap-1">
          {/* Prev Arrow */}
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            className="cursor-pointer bg-transparent border-none p-0 rotate-180 transition-opacity hover:opacity-60"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect
                x="31.8198"
                width="45"
                height="45"
                rx="22.5"
                transform="rotate(45 31.8198 0)"
                fill="white"
              />
              <path
                d="M24.1219 32.3334H40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32.3335 24.1218L40.545 32.3334L32.3335 40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Next Arrow */}
          <button
            onClick={() =>
              scrollToIndex(Math.min(cards.length - 1, activeIndex + 1))
            }
            className="cursor-pointer bg-transparent border-none p-0 transition-opacity hover:opacity-60"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect
                x="31.8198"
                width="45"
                height="45"
                rx="22.5"
                transform="rotate(45 31.8198 0)"
                fill="white"
              />
              <path
                d="M24.1219 32.3334H40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32.3335 24.1218L40.545 32.3334L32.3335 40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Pill Indicators */}
        <div className="omni-pill-indicator inline-flex items-center gap-1.75 me-2 lg:me-30 relative">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => scrollToIndex(i)}
              initial={false}
              animate={{
                width: i === activeIndex ? "2.1875rem" : "0.4375rem",
                backgroundColor: i === activeIndex ? "#ffffff" : "#1b1b1b",
              }}
              transition={{
                width: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                backgroundColor: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              className="omni-pill-dot h-1.75 rounded-full cursor-pointer"
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("capacidadesPage");
  const articles = t.raw("whatsNew.articles") as {
    date: string;
    title: string;
  }[];

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  return (
    <div className="mt-12">
      <style>{`
        [data-news-scroll]::-webkit-scrollbar{display:none}
        .news-carousel-card {
          width: var(--news-card-width, clamp(320px, 19vw, 420px));
        }
        @media (min-width: 1024px) and (max-width: 1279px) {
          .news-carousel-card {
            --news-card-width: clamp(300px, 18vw, 400px) !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .news-carousel-container {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 2 !important;
            overflow: visible !important;
          }
          .news-carousel-card {
            --news-card-width: 100% !important;
            border-radius: 2 !important;
          }
        }
      `}</style>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        data-news-scroll
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory news-carousel-container 2xl:justify-center"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {articles.map((article) => (
          <a
            key={article.title}
            href="#"
            className="snap-start shrink-0 group block bg-white rounded-2xl overflow-hidden no-underline text-black relative news-carousel-card"
            style={{
              paddingTop: "clamp(40px, 3.5vw, 50px)",
              paddingLeft: "clamp(25px, 2.5vw, 35px)",
              paddingRight: "clamp(25px, 2.5vw, 35px)",
              paddingBottom: "clamp(60px, 4.5vw, 85px)",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h4
              className="m-0"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(16px, 1vw, 21px)",
                fontWeight: 600,
                lineHeight: "1.3",
                color: "#000",
              }}
            >
              {article.title}
            </h4>

            <span
              className="block absolute text-neutral-500"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(14px, 0.9vw, 18px)",
                fontWeight: 400,
                lineHeight: "140%",
                bottom: "clamp(25px, 2vw, 35px)",
                left: "clamp(25px, 2vw, 35px)",
              }}
            >
              {article.date}
            </span>

            {/* Arrow icon bottom-right */}
            <span
              className="absolute"
              style={{
                bottom: "clamp(25px, 2vw, 35px)",
                right: "clamp(25px, 2vw, 35px)",
                width: "clamp(45px, 3.5vw, 58px)",
                height: "clamp(45px, 3.5vw, 58px)",
                backgroundImage:
                  "url('https://www.omc.com/wp-content/uploads/2026/03/arrow_news2.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </a>
        ))}
      </div>

      {/* Navigation: Arrows + Pill Dots */}
      <div className="flex items-center justify-between mt-8 gap-6 md:hidden">
        <div className="flex gap-1">
          {/* Prev Arrow */}
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            className="cursor-pointer bg-transparent border-none p-0 rotate-180 transition-opacity hover:opacity-60"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect
                x="31.8198"
                width="45"
                height="45"
                rx="22.5"
                transform="rotate(45 31.8198 0)"
                fill="white"
              />
              <path
                d="M24.1219 32.3334H40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32.3335 24.1218L40.545 32.3334L32.3335 40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Next Arrow */}
          <button
            onClick={() =>
              scrollToIndex(Math.min(articles.length - 1, activeIndex + 1))
            }
            className="cursor-pointer bg-transparent border-none p-0 transition-opacity hover:opacity-60"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect
                x="31.8198"
                width="45"
                height="45"
                rx="22.5"
                transform="rotate(45 31.8198 0)"
                fill="white"
              />
              <path
                d="M24.1219 32.3334H40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32.3335 24.1218L40.545 32.3334L32.3335 40.545"
                stroke="black"
                strokeWidth="2.17742"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CapacidadesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations("capacidadesPage");
  const capabilities = t.raw("connectedCapabilities.items") as string[];

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <main className="bg-black overflow-hidden min-h-screen">
      {/* Responsive CSS variables for orbit animation + section overrides */}
      <style>{`
        :root {
          --orbit-radius: clamp(220px, 28vw, 420px);
          --orbit-circle-size: clamp(250px, 21vw, 600px);
          --orbit-font-size: clamp(1.1rem, 2vw, 42px);
          --orbit-lottie-scale: 1.3;
          --investors-lottie-scale: 1;
          --investors-lottie-x: -10%;
          --investors-lottie-y: -8%;
          --investors-lottie-mt: calc(-25vw - 5px);
          --lottie-blur: 8px;
          --blur-clear: 30%;
          --blur-fade: 70%;
        }

        /* Tablet (md) */
        @media (max-width: 1023px) {
          :root {
            --orbit-radius: clamp(260px, 35vw, 430px);
            --orbit-circle-size: clamp(240px, 30vw, 380px);
            --orbit-font-size: clamp(1.2rem, 2.5vw, 1.8rem);
            --orbit-lottie-scale: 1.6;
            --investors-lottie-scale: 0.7;
            --lottie-blur: 6px;
            --blur-clear: 25%;
            --blur-fade: 65%;
          }
        }

        /* High-res Tablet / Small Laptop (lg) */
        @media (min-width: 1024px) and (max-width: 1279px) {
          :root {
            --investors-lottie-scale: 0.85;
            --investors-lottie-x: -18%;
          }
        }

        /* Ultra-wide (2xl) */
        @media (min-width: 1536px) {
          :root {
            --investors-lottie-y: 20%;
            --investors-lottie-mt: calc(-28vw - 5px);
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          :root {
            --orbit-radius: clamp(180px, 40vw, 280px);
            --orbit-circle-size: clamp(160px, 35vw, 240px);
            --orbit-font-size: clamp(1rem, 4vw, 1.4rem);
            --investors-lottie-scale: 1;
            --lottie-blur: 5px;
            --blur-clear: 20%;
            --blur-fade: 55%;
          }
          .investors-section {
            min-height: 100vh !important;
            padding-top: 4rem !important;
            padding-bottom: 6rem !important;
          }
          .omni-section {
            padding-bottom: 6rem !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 479px) {
          :root {
            --orbit-radius: clamp(160px, 50vw, 220px);
            --orbit-circle-size: clamp(140px, 45vw, 180px);
            --orbit-font-size: clamp(14px, 5vw, 18px);
            --lottie-blur: 4px;
            --blur-clear: 15%;
            --blur-fade: 50%;
          }
          .investors-section {
            min-height: 100vh !important;
            padding-top: 3rem !important;
            padding-bottom: 5rem !important;
          }
        }
      `}</style>
      <IntroAnimation />
      <div className="w-full bg-white text-black min-h-screen flex flex-col relative">
        {/* Lottie Animation Background */}
        <div
          className="absolute top-0 -right-1/4 sm:-right-1/6 w-full md:w-full h-screen pointer-events-none flex items-center justify-center z-10 translate-x-[25%] translate-y-[15%] sm:translate-x-[50%] sm:translate-y-[15%] md:-translate-x-[19%] md:translate-y-[15%] lg:translate-x-[15%] lg:translate-y-[0%] xl:translate-y-[15%]"
          style={{
            filter: 'blur(var(--lottie-blur, 8px))',
          }}
        >
          <Lottie
            animationData={topSectionAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full object-cover scale-150 sm:scale-[180%] md:scale-[135%] lg:scale-[100%]"
          />
        </div>

        {/* Main Content Area */}
        <section className="flex flex-col justify-center  w-full min-h-screen lg:h-screen px-6 sm:px-10 md:px-16 lg:px-28 xl:px-56 md:pt-28 xl:pt-32 2xl:pe-0 2xl:ps-40 relative z-20">
          {/* Left Column: Title */}
          <div className=" h-full flex flex-col justify-center">
            <strong className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-black tracking-tighter mb-2 leading-none font-[‘Arial_Black’,sans-serif] 2xl:text-6xl">
              {t("hero.companyName")}
            </strong>
            <p className="text-5xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-8xl font-light tracking-[clamp(-1.32px,-0.11vw,-1.835px)] mb-4 md:mb-6 xl:mb-8 2xl:text-7xl w-10/12 md:w-full font-sans">
              {t("hero.before")}
              <span className="font-[‘Cormorant_Garamond’,serif] italic font-semibold text-5xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl 2xl:text-7xl">
                {" "}
                {t("hero.highlight1")}{" "}
              </span>
              <br className="hidden md:block" />
              {t("hero.middle")}
              <span className="font-[‘Cormorant_Garamond’,serif] italic font-semibold text-5xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl 2xl:text-7xl">
                {" "}
                {t("hero.highlight2")}{" "}
              </span>
              {t("hero.after")}
            </p>

            <div className="w-full xl:w-3/4 grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
              <div className="col-span-1 2xl:max-w-3/4 text-[clamp(16.46px,1.1vw,28px)] font-bold text-neutral-800 leading-none tracking-normal border-b-4 border-black pb-4 md:pb-0">
                {t("hero.tagline")}
              </div>
              <div className="col-span-1 md:col-span-2 w-full md:w-9/12 h-full ms-0 md:ms-10 text-[clamp(16px,0.95vw,26px)] font-medium leading-[1.53]">
                {t("hero.description")}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full min-h-screen pr-6 sm:pr-10 md:pr-24 lg:pr-0 py-20 sm:py-28 md:py-36 lg:py-44 xl:py-52 relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-44 lg:gap-12 xl:gap-16 items-center overflow-visible">
          {/* Left Column (Bottom on Mobile): Animation */}
          <div className="w-full h-full flex items-center justify-center relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] md:translate-x-[8%] lg:-translate-x-[38%] xl:-translate-x-[42%] z-10 pointer-events-auto">
            <OrbitAnimation items={capabilities} isMobile={isMobile} />
          </div>

          {/* Right Column: Text Content Replicating Omnicom */}
          <div className="w-full flex flex-col items-start justify-center gap-4 md:gap-6 relative z-20 pl-6 sm:pl-10 md:pl-16 lg:pl-[15%] lg:max-w-[80%]">
            {/* Label Wrapper (Pill)  */}
            <div className="relative inline-flex items-center justify-start z-10 gap-2 px-4 py-2 mb-2 pr-16 md:pr-24">
              {/* Contenedor de fondo con blur en los bordes */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/90 via-gray-300/60 to-transparent rounded-full blur-[3px] -z-10"></div>

              <div className="w-1.5 h-1.5 bg-black rounded-full relative z-10"></div>
              <p className="font-semibold text-black leading-snug m-0 relative z-10 text-sm md:text-base tracking-wide">
                {t("connectedCapabilities.pill")}
              </p>
            </div>

            {/* Section Heading */}
            <strong className="font-black tracking-[clamp(-1.32px,-0.11vw,-1.835px)] mb-4 md:mb-8 font-sans leading-none text-black m-0 text-4xl sm:text-3xl md:text-4xl lg:text-4xl mt-2 max-w-[90%] lg:max-w-full">
              {t("connectedCapabilities.title")}
            </strong>

            {/* Section Body */}
            <p className="font-['Cormorant_Garamond',serif] italic font-light leading-tight text-gray-900 m-0 text-xl md:text-2xl lg:text-xl max-w-[85%] lg:max-w-full mt-2">
              {t("connectedCapabilities.description")}
            </p>

            {/* Button Wrapper */}
            <a
              href="#"
              className="flex items-start mt-7 cursor-pointer group no-underline"
            >
              <div className="bg-[#1b1b1b] rounded-full px-7 py-5 flex items-center justify-center transition-colors group-hover:bg-black">
                <span className="font-semibold text-white tracking-wide text-center leading-snug text-lg whitespace-pre-line">
                  {t("connectedCapabilities.buttonText")}
                </span>
              </div>
              <div className="bg-[#1b1b1b] rounded-full h-12 w-12 self-start flex items-center justify-center p-1 relative -translate-x-1 transition-colors group-hover:bg-black">
                {/* Arrow Icon Placeholder */}
                <svg
                  className="w-5 h-5 text-white -rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </a>
          </div>
        </section>

        {/* ========================================
             SECTION 03 - OMNI
             ======================================== */}
        <section
          className="w-full min-h-screen pl-6 md:pt-40 sm:pl-10 md:pl-10 lg:pl-32 pr-0 relative z-0 omni-section"
          style={{
            paddingBottom: "12.375rem",
            background: `linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 92.59%), url('https://www.omc.com/wp-content/uploads/2025/11/lines-medium.jpg') lightgray -0.295rem 0 / 114.822% 100% no-repeat`,
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col gap-6">
            {/* Label Wrapper (Pill) */}
            <div className="relative inline-flex items-center justify-start z-10 gap-2 px-4 py-2 mb-2 pr-16 md:pr-24 w-fit">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/90 via-gray-300/60 to-transparent rounded-full blur-[3px] -z-10"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full relative z-10"></div>
              <p className="font-semibold text-black leading-snug m-0 relative z-10 text-sm md:text-base tracking-wide">
                {t("omni.pill")}
              </p>
            </div>

            {/* Header: Title + Description */}
            <div className="flex flex-col md:flex-row lg:flex-row lg:justify-between lg:items-start gap-6 md:gap-0 lg:gap-16 pr-6 sm:pr-10 md:pr-2 lg:pr-20">
              {/* Left: Title */}
              <div className="md:w-7/12 lg:w-6/12">
                <strong className="font-extrabold tracking-[clamp(-1.32px,-0.11vw,-1.835px)] mb-4 md:mb-8 font-sans leading-none text-black m-0 text-2xl sm:text-3xl md:text-4xl lg:text-4xl">
                  {t("omni.title")}
                </strong>
              </div>

              {/* Right: Description */}
              <div className="md:w-5/12 lg:max-w-[40%]">
                <p className="font-['Cormorant_Garamond',serif] italic font-light leading-tight text-gray-900 m-0 text-lg sm:text-xl md:text-md lg:text-xl">
                  {t("omni.description")}
                </p>
              </div>
            </div>

            {/* Cards Carousel */}
            <OmniCarousel />
          </div>
        </section>

        {/* ========================================
             SECTION 04 - INVESTORS
             ======================================== */}
        <section
          className="w-full px-6 sm:px-10 md:px-[10px] md:pt-[50px] md:pb-[10px] lg:pt-[70px] lg:px-30 xl:ps-56 xl:px-0 xl:pe-24 pt-40 pb-60 relative z-0 text-white overflow-visible flex items-start justify-center investors-section"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 15%, rgba(0,0,0,0) 40%), url('https://www.omc.com/wp-content/uploads/2025/11/investors_bg.jpg') no-repeat center center / cover",
            backgroundColor: "#000",
            minHeight: "100vh",
          }}
        >
          <div className="flex flex-col gap-6 w-full max-w-full">
            {/* Label Wrapper (Pill) */}
            <div className="relative inline-flex items-center justify-start z-10 gap-2 px-4 py-3 mb-2 pr-16 md:pr-24 w-fit -mt-[5px]">
              <div className="absolute inset-x-0 inset-y-1 bg-gradient-to-r from-white/60 via-white/30 to-transparent rounded-full blur-[10px] -z-10"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full relative z-10"></div>
              <p className="font-semibold text-white leading-snug m-0 relative z-10 text-sm md:text-base tracking-wide">
                {t("investors.pill")}
              </p>
            </div>

            {/* Header: Title + Description */}
            <div className="flex flex-col md:flex-row lg:justify-between lg:items-start gap-6 md:gap-8 lg:gap-16">
              {/* Left: Title */}
              <div className="md:w-6/12 lg:max-w-[45%]">
                <strong className="font-black tracking-[clamp(-1.32px,-0.11vw,-1.835px)] mb-4 md:mb-8 font-sans leading-none text-white m-0 text-3xl sm:text-3xl md:text-4xl lg:text-4xl">
                  {t("investors.title")}
                </strong>
              </div>

              {/* Right: Description + Button */}
              <div className="md:w-6/12 lg:max-w-[35%] flex flex-col gap-6">
                <p className="font-['Cormorant_Garamond',serif] italic font-light leading-tight text-gray-200 m-0 text-xl md:text-xl">
                  {t("investors.description")}
                </p>

                {/* Button */}
                <a
                  href="https://investor.omc.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start mt-30 sm:mt-4 cursor-pointer group no-underline w-fit"
                >
                  <div className="bg-[#9333EA] rounded-full px-7 py-5 flex items-center justify-center transition-colors group-hover:bg-[#A855F7]">
                    <span className="font-semibold text-white tracking-wide text-center leading-snug text-lg">
                      {t("investors.buttonText")}
                    </span>
                  </div>
                  <div className="bg-[#9333EA] rounded-full h-12 w-12 self-start flex items-center justify-center p-1 relative -translate-x-1 transition-colors group-hover:bg-[#A855F7]">
                    <svg
                      className="w-5 h-5 text-white -rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
             INVESTORS LOTTIE - Straddles sections 04 & 05
             ======================================== */}
        <div
          className="relative z-10 flex justify-start pointer-events-none"
          style={{
            marginTop: "var(--investors-lottie-mt, calc(-25vw - 5px))",
            marginBottom: "-19vw",
          }}
        >
          <div
            className="relative overflow-visible"
            style={{
              width: "clamp(500px, 40vw, 900px)",
              transform: isMobile
                ? `translateX(-35%) translateY(-11%) scale(var(--investors-lottie-scale, 1))`
                : `translateX(var(--investors-lottie-x, -10%)) translateY(var(--investors-lottie-y, -8%)) scale(var(--investors-lottie-scale, 1))`,
              filter:
                "invert(24%) sepia(95%) saturate(5000%) hue-rotate(265deg) brightness(90%) contrast(95%)",
            }}
          >
            <Lottie animationData={investorsLottie} loop={true} />
          </div>
        </div>

        {/* ========================================
             SECTION 05 - WHAT'S NEW
             ======================================== */}
        <section
          className="w-full pt-0 -mt-9 sm:-mt-24 md:-mt-7 md:px-10 lg:px-10 lg:mt-10 2xl:mt-60 relative z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, #EBEAEA 100%)",
            paddingBottom: "6rem",
          }}
        >
          {/* Blur Overlay - Above Lottie (z-10), Below Content (z-30) */}
          <div
            className="absolute inset-x-0 top-0 z-20 pointer-events-none sm:-top-[120px]"
            style={{
              height: "35vw",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, black 0%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, black 0%, transparent 80%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            }}
          ></div>
          <div className="flex flex-col gap-12 relative z-30">
            {/* Header: Title + View All */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10 px-6 sm:px-10 md:px-4 lg:px-5 xl:px-56 2xl:pe-0 2xl:ps-40">
              <h4
                className="m-0 text-black font-black leading-none relative z-30"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "clamp(30px, 3vw, 46px)",
                  letterSpacing: "clamp(-0.6px, -0.06em, -0.92px)",
                  fontWeight: 550,
                  width: "clamp(200px, 40vw, 550px)",
                }}
              >
                {t("whatsNew.title")}
              </h4>

              {/* Button Wrapper */}
              <a
                href="#"
                className="flex items-start mt-7 cursor-pointer group no-underline"
              >
                <div className="bg-[#1b1b1b] rounded-full px-7 py-5 flex items-center justify-center transition-colors group-hover:bg-black">
                  <span className="font-semibold text-white tracking-wide text-center leading-snug text-lg">
                    {t("whatsNew.viewAll")}
                  </span>
                </div>
                <div className="bg-[#1b1b1b] rounded-full h-12 w-12 self-start flex items-center justify-center p-1 relative -translate-x-1 transition-colors group-hover:bg-black">
                  {/* Arrow Icon Placeholder */}
                  <svg
                    className="w-5 h-5 text-white -rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            </div>

            {/* News Articles Carousel */}
            <NewsCarousel />
          </div>
        </section>
      </div>
    </main>
  );
}
