import ScrollReveal from "./ScrollReveal";
import { useTranslations } from "next-intl";

export default function Capacidades() {
  const t = useTranslations("capacidadesSection");

  return (
    <section
      id="capacidades"
      className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-widest text-purple-400">
              {t("subtitle")}
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
              {t("title")}
            </h2>
          </div>
        </ScrollReveal>

        {/* TARJETAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={100}>
            <div className="group rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-purple-900/40 hover:border-purple-500/50 backdrop-blur-sm h-full flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-semibold mx-auto">
                1
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {t("cards.0.title")}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                {t("cards.0.description")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="group rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-purple-900/40 hover:border-purple-500/50 backdrop-blur-sm h-full flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-semibold mx-auto">
                2
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {t("cards.1.title")}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                {t("cards.1.description")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="group rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-purple-900/40 hover:border-purple-500/50 backdrop-blur-sm h-full flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-semibold mx-auto">
                3
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {t("cards.2.title")}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                {t("cards.2.description")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="group rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-purple-900/40 hover:border-purple-500/50 backdrop-blur-sm h-full flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-semibold mx-auto">
                4
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {t("cards.3.title")}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                {t("cards.3.description")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
