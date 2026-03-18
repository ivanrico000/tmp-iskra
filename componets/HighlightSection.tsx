import ScrollReveal from "./ScrollReveal";
import Image from "next/image";
import backgroundImage from "@/public/images/fondo3.jpeg"; // Fondo borroso
import mainImage from "@/public/images/publi-modified.png"; // Imagen principal encima
import { useTranslations } from "next-intl";

export default function HighlightOverlaySection() {
  const t = useTranslations("highlightSection");

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo borrosa */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt="Fondo digital"
          fill
          className="object-cover filter  brightness-75"
          priority
        />
      </div>

      {/* Contenedor central */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 py-24">
        {/* Imagen principal encima */}
        <div className="flex-shrink-0 w-full lg:w-1/2 relative">
          <Image
            src={mainImage}
            alt="Presencia digital"
            width={1200}
            height={800}
            className="rounded-xl shadow-xl object-contain mx-auto"
          />
        </div>

        {/* Texto centrado */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              {t("title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-sm">
              {t("description")}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
