"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useChat } from "./ChatContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setOpen } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navbar");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [pathname]);

  const handleNavClick = (id) => {
    const homePath = `/${locale}`;

    if (pathname !== homePath) {
      router.push(`${homePath}#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const switchLocale = () => {
    const newLocale = locale === "es" ? "en" : "es";

    const segments = pathname.split("/");
    segments[1] = newLocale; // reemplaza el locale

    const newPath = segments.join("/");

    router.push(newPath);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* 🌊 FONDO GALAXIA (BLUR) */}
      {scrolled && (
        <div
          className="absolute inset-0 animate-liquid"
          style={{
            zIndex: 1,
            background: `
              radial-gradient(circle at 20% 30%, rgba(180,120,255,0.45), transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(120,80,220,0.35), transparent 55%),
              radial-gradient(circle at 50% 70%, rgba(90,40,150,0.35), transparent 65%),
              linear-gradient(120deg, #12001c, #2a063f, #12001c)
            `,
            filter: "blur(50px)",
          }}
        />
      )}

      {/* 🌫️ NEBULOSA */}
      {scrolled && (
        <div
          className="absolute inset-0 animate-nebula"
          style={{
            zIndex: 2,
            backgroundImage: `
              radial-gradient(circle at 30% 40%, rgba(200,140,255,0.35), transparent 55%),
              radial-gradient(circle at 70% 60%, rgba(150,100,255,0.25), transparent 60%)
            `,
            filter: "blur(30px)",
          }}
        />
      )}

      {/* ⭐ ESTRELLAS SUAVES · DESORDENADAS · BORROSAS */}
      {scrolled && (
        <div
          className="absolute inset-0 animate-stars pointer-events-none"
          style={{
            zIndex: 4,
            backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 1px, transparent 2px),
        radial-gradient(circle at 30% 70%, rgba(255,255,255,0.6) 1px, transparent 2px),
        radial-gradient(circle at 55% 40%, rgba(255,255,255,0.5) 1px, transparent 2px),
        radial-gradient(circle at 80% 60%, rgba(255,255,255,0.7) 1px, transparent 2px),
        radial-gradient(circle at 65% 15%, rgba(255,255,255,0.4) 1px, transparent 2px)
      `,
            backgroundSize: "180px 180px",
            opacity: 0.8,
            filter: "blur(1.5px)",
          }}
        />
      )}

      {/* 🧊 VIDRIO (MUY SUAVE, NO TAPA ESTRELLAS) */}
      {scrolled && (
        <div
          className="absolute inset-0 bg-black/10 backdrop-blur-sm"
          style={{ zIndex: 3 }}
        />
      )}

      {/* CONTENIDO */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-2 flex items-center min-h-[64px]">
        {/* LOGO */}
        <div className="flex-1">
          <Link href={`/${locale}`}>
            <Image
              src="/images/iskra-logo.png"
              alt="ISKRA"
              width={140}
              height={45}
              priority
              className="object-contain cursor-pointer ml-2"
            />
          </Link>
        </div>

        {/* MENÚ */}
        <ul
          className="
    hidden md:flex gap-8
    text-white font-semibold text-[15px] tracking-wide
    drop-shadow-[0_3px_8px_rgba(0,0,0,1)]
  "
        >
          <li
            onClick={() => handleNavClick("inicio")}
            className="cursor-pointer hover:text-white transition"
          >
            {t("home")}
          </li>
          <li className="hover:text-white transition">
            <Link href={`/${locale}/capacidades`}>{t("capabilities")}</Link>
          </li>
          <li
            onClick={() => handleNavClick("por-que-elegirnos")}
            className="cursor-pointer hover:text-white transition"
          >
            {t("whyChooseUs")}
          </li>

          <li
            onClick={() => {
              handleNavClick("nuestro-equipo");
              setMenuOpen(false);
            }}
            className="cursor-pointer hover:opacity-80"
          >
            {t("team")}
          </li>

          <li
            onClick={() => handleNavClick("nuestro-metodo")}
            className="cursor-pointer hover:text-white transition"
          >
            {t("ourMethod")}
          </li>

          <li className="hover:text-white transition">
            <Link href={`/${locale}/servicios`}>{t("services")}</Link>
          </li>

          <li className="hover:text-white transition">
            <Link href={`/${locale}/colaboraciones`}>{t("caseStudies")}</Link>
          </li>
        </ul>
        {/* ☰ BOTÓN MOBILE */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* BOTÓN */}
        <div className="flex-1 flex justify-end gap-4">
          <button
            onClick={switchLocale}
            className="relative inline-flex rounded-full p-[2px] overflow-hidden group"
          >
            <span className="absolute inset-0 rounded-full spark-border" />
            <span className="relative z-10 rounded-full bg-black/80 px-4 py-2 text-sm text-white font-medium tracking-wide hover:bg-white hover:text-black transition">
              {locale.toUpperCase()}
            </span>
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative inline-flex rounded-full p-[2px] overflow-hidden group"
          >
            <span className="absolute inset-0 rounded-full spark-border" />
            <span className="relative z-10 rounded-full bg-black/80 px-6 py-2 text-sm text-white font-medium tracking-wide hover:bg-white hover:text-black transition">
              {t("quote")}
            </span>
          </button>
        </div>
      </nav>
      {/* 📱 MENÚ MOBILE */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full z-40">
          <div className="mx-4 mt-4 rounded-2xl bg-black/80 backdrop-blur-lg p-6 text-white space-y-6 shadow-xl">
            <p
              onClick={() => {
                handleNavClick("inicio");
                setMenuOpen(false);
              }}
              className="cursor-pointer hover:opacity-80"
            >
              {t("home")}
            </p>

            <Link
              href={`/${locale}/capacidades`}
              onClick={() => setMenuOpen(false)}
              className="block hover:opacity-80"
            >
              {t("capabilities")}
            </Link>

            <p
              onClick={() => {
                handleNavClick("por-que-elegirnos");
                setMenuOpen(false);
              }}
              className="cursor-pointer hover:opacity-80"
            >
              {t("whyChooseUs")}
            </p>

            <p
              onClick={() => {
                handleNavClick("nuestro-equipo");
                setMenuOpen(false);
              }}
              className="cursor-pointer hover:opacity-80"
            >
              {t("team")}
            </p>

            <p
              onClick={() => {
                handleNavClick("nuestro-metodo");
                setMenuOpen(false);
              }}
              className="cursor-pointer hover:opacity-80"
            >
              {t("ourMethod")}
            </p>

            <Link
              href={`/${locale}/servicios`}
              onClick={() => setMenuOpen(false)}
              className="block hover:opacity-80"
            >
              {t("services")}
            </Link>

            <Link
              href={`/${locale}/colaboraciones`}
              onClick={() => setMenuOpen(false)}
              className="block hover:opacity-80"
            >
              {t("caseStudies")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
