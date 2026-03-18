"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import DownloadButton from "@/componets/DownloadButton";
import { useTranslations } from "next-intl";

/* =======================
    CARRUSEL INFINITO
======================= */
function InfiniteCarousel({
  children,
  reverse = false,
  duration = 40,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="flex gap-10 w-max"
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function ColaboracionesPage() {
  const t = useTranslations("collaborationsPage");
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* =======================
      PARALLAX HERO
  ======================= */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "0%"] : ["0%", "50%"],
  );
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);

  /* =======================
      DATA
  ======================= */
  const creatorsTop = Array.from({ length: 10 }).map(
    (_, i) => `/images/colab-${i + 1}.PNG`,
  );

  const creatorsBottom = Array.from({ length: 11 }).map(
    (_, i) => `/images/colab-${i + 11}.PNG`,
  );

  const brands = [
    { name: "Tiendas Ara", logo: "/marcas/aras.png" },
    { name: "Arroz", logo: "/marcas/arrozz.png" },
    { name: "pollo", logo: "/marcas/pollo.png" },
    { name: "13", logo: "/marcas/13.png" },
    { name: "axa", logo: "/marcas/axa.png" },
    { name: "boyaca", logo: "/marcas/boyacas.png" },
    { name: "banco", logo: "/marcas/banco.png" },
    { name: "coca", logo: "/marcas/coca.png" },
    { name: "IA", logo: "/marcas/IA.png" },
    { name: "mundo", logo: "/marcas/mundo.png" },
    { name: "Tunja", logo: "/marcas/tunjas.png" },
    { name: "Uniminuto", logo: "/marcas/uniminuto.png" },
  ];

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* =======================
          HERO
      ======================= */}
      <section
        ref={heroRef}
        className="relative h-[120vh] w-full overflow-hidden"
      >
        <motion.div
          style={{ y: imageY, willChange: "transform" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/colaboraciones.png"
            alt="Colaboraciones Iskra"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black z-10" />

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px]" />
        </div>

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-20 h-full flex items-center justify-center px-6"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-center">
            {t("title")}
          </h1>
        </motion.div>
      </section>

      {/* =======================
          CONTENIDO
      ======================= */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between mb-32">
          <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>

          <DownloadButton />
        </div>

        {/* =======================
            CARRUSELES
        ======================= */}
        <div className="space-y-24">
          {/* CREADORES TOP */}
          <InfiniteCarousel duration={45}>
            {creatorsTop.map((src, i) => (
              <div
                key={`top-${i}`}
                className="relative w-[160px] h-[220px] sm:w-[220px] sm:h-[300px] rounded-2xl overflow-hidden flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Creador ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </InfiniteCarousel>

          {/* MARCAS */}
          <InfiniteCarousel reverse duration={30}>
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center w-[180px] sm:w-[220px] h-[100px] px-6 flex-shrink-0"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={180}
                  height={80}
                  className="object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </InfiniteCarousel>

          {/* CREADORES BOTTOM */}
          <InfiniteCarousel duration={50}>
            {creatorsBottom.map((src, i) => (
              <div
                key={`bottom-${i}`}
                className="relative w-[160px] h-[220px] sm:w-[220px] sm:h-[300px] rounded-2xl overflow-hidden flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Creador ${i + 11}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </section>
    </main>
  );
}
