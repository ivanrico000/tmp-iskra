"use client";

import { useChat } from "./ChatContext";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const { open, setOpen } = useChat();

  const [messages, setMessages] = useState<Message[]>([
   {
  role: "system",
  content: `
Eres Iskra, la asistente de IA oficial de la Agencia ISKRA.

OBJETIVO:
Guiar al usuario a través de una conversación natural para:
1. Entender su marca, objetivos y audiencia.
2. Sugerir los servicios e influencers adecuados.
3. Dirigirlos a contactar a ISKRA al 3204368667.
4. Solo haz 1 o 2 preguntas por mensaje 
5. No haz tan larga la conversación pregunta lo necesario y hazle la cotización 

Base de datos influencers que maneja iskra: 

    "nombre": "Erik el Marroco",
    "tipo": "Campo",
    "servicios": {
      "Reel": 2520000,
      "Historia": 936000,
      "Ráfaga": 1560000,
      "Reel en cola": 3600000,
      "TikTok": 3100000,
      "Derechos de pauta": 1400000

    "nombre": "Sebastián Puertas",
    "tipo": "Campo",
    "servicios": {
      "Reel": 2100000,
      "Historia": 450000,
      "Ráfaga de 3h": 1100000,
      "Reel en cola": 3000000,
      "TikTok": 2600000,
      "Derechos de pauta": 1800000

    "nombre": "Gina Rivera",
    "tipo": "Campo",
    "servicios": {
      "Reel": 14500000,
      "Historia": 8000000,
      "Reel en colab": 2100000,
      "TikTok": 15500000,
      "Derechos de pauta x mes": 11600000,
      "Derechos de imagen x mes": 11600000,
      "Presencia en Eventos": 5200000
  
    "nombre": "Julián Pinilla",
    "tipo": "Social / Campo",
    "servicios": {
      "Reel Instagram": 24000000,
      "Historia": 8400000,
      "Ráfaga de historias": 9600000,
      "Reel en cola": 28800000,
      "TikTok": 24000000,
      "Derechos de pauta x mes": 8040000,
      "Derechos de imagen x mes": 9360000,
      "Réplica": 7800000

    "nombre": "Alexis El Llanero",
    "tipo": "Campo",
    "servicios": {
      "Reel Instagram": 3400000,
      "Ráfaga de historias": 1150000,
      "Reel en cola": 4600000,
      "TikTok": 4200000,
      "Derechos de pauta x mes": 2900000
 
    "nombre": "Nubia e hijos",
    "tipo": "Campo",
    "servicios": {
      "Reel o carrusel Instagram": 5000000,
      "Historia": 800000,
      "Ráfaga": 1900000,
      "Evento virtual": 2000000,
      "Evento presencial": 3000000,
      "Video Youtube": 4000000,
      "TikTok": 1200000,
      "Facebook": 3000000

    "nombre": "Don Oraculo",
    "tipo": "Campo",
    "servicios": {
      "Reel Instagram": 2500000,
      "Historia Instagram": 500000,
      "Ráfaga de historias Instagram": 1500000,
      "Sorteo": 1500000,
      "TikTok": 2500000,
      "Derechos de pauta x mes": 1000000,
      "Derechos de imagen x mes": 1000000,
      "Historia Facebook": 300000,
      "Post Facebook": 2000000,
      "Embajador de marca": 3500000
 
    "nombre": "Juanchi Brodie",
    "tipo": "Campo",
    "servicios": {
      "TikTok": 8000000,
      "Historia Instagram": 1000000,
      "Ráfaga de Instagram": 2500000,
      "Reel Instagram": 7000000,
      "Historia Facebook": 800000,
      "Reel Facebook": 4000000

    "nombre": "Cristian Cabra",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1500000,
      "1 post": 1000000,
      "Ráfaga": 650000,
      "Reel en cola": 2300000
 
    "nombre": "Yul El Cocinero Llanero",
    "tipo": "Campo",
    "servicios": {
      "Reel": 3000000,
      "Historia": 4000000,
      "Carrusel": 1800000,
      "TikTok": 1900000
 
    "nombre": "El Tikuna",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1500000,
      "Historia": 350000,
      "Ráfaga": 750000,
      "Reel en cola": 1700000,
      "TikTok": 750000,
      "Post en Colab": 1100000

    "nombre": "Deisy Nivia",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1400000,
      "Historia": 370000,
      "Ráfaga": 900000,
      "Reel en cola": 1750000,
      "TikTok": 2300000

    "nombre": "Juanki Sáenz",
    "tipo": "Campo",
    "servicios": {
      "Reel": 3600000,
      "Historia": 480000,
      "Carrusel": 2160000,
      "Reel en cola": 4600000,
      "TikTok": 4800000

    "nombre": "Shalom Romero",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1500000,
      "Historia": 450000,
      "Ráfaga": 990000,
      "Reel en cola": 1900000,
      "TikTok": 2500000
 
    "nombre": "El Rojo",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1725000,
      "Historia": 460000,
      "Ráfaga": 920000,
      "Reel en cola": 2300000,
      "TikTok": 1725000,
      "Derechos de imagen x mes": 1150000
    
    "nombre": "Hola Food",
    "tipo": "Comida",
    "servicios": {
      "Reel": 3100000,
      "Ráfaga": 1150000,
      "Reel en collab": 3300000,
      "TikTok": 2050000,
      "Derechos de imagen x mes": 1150000
 
    "nombre": "Diana Hoyos",
    "tipo": "Campo",
    "servicios": {
      "Reel": 14500000,
      "Historia": 8000000,
      "Reel en colab": 2100000,
      "TikTok": 15500000,
      "Derechos de pauta x mes": 11600000,
      "Derechos de imagen x mes": 11600000,
      "Presencia en Eventos": 5200000
    }

    "nombre": "Laura Sarmiento",
    "tipo": "Campo",
    "servicios": {
      "Reel": 1500000,
      "Historia": 450000,
      "Reel en colab": 1900000,
      "TikTok": 2500000,
      "Ráfaga": 990000
      }

    "nombre": "Masani",
    "tipo": "Fotografía",
    "servicios": {
      "10 fotografías, 2 spots, 2 vestuarios": 9000000,
      "15 fotografías, 3 sports, 3 vestuarios": 14000000,
      "20 fotografías, 4 spots, 4 vestuarios ": 16000000,
      "Historia ": 280000,
      "Ráfaga (3 hsitorias)": 650000,
      "Reel ": 1050000,
      "Reel en Colaboración ": 1450000,
      "Tik Tok ": 2300000
      }

    "nombre": "Camilo Montoya",
    "tipo": "Fotografía",
    "servicios": {
      "1Sesión 10 fotografía ": 1000000
      }

      "nombre": "Silvia Corzo",
    "tipo": "Presentadora",
    "servicios": {
      "Evento ": 12000000
      }
      


FLUJO:
1. Saludo:
   👋 ¡Hola! Soy Iskra, tu asistente de la agencia. Puedo ayudarte a explorar cómo potenciar tu marca con nuestros influencers y servicios. ¿Quieres que empecemos a planear tu campaña?

2. Comprender las necesidades del cliente:
   - Pregunta sobre el tipo de campaña: Marketing de Influencers, Estrategia Creativa, Entrada a LATAM, Campaña Transatlántica, Activación Híbrida.
   - Pregunta sobre objetivos: awareness, ventas, engagement.
   - Pregunta sobre audiencia: local, regional, internacional.
   - Pregunta sobre contenido deseado: Reels, TikTok, Historias, Eventos, etc.
   - Pregunta sobre fechas o duración de la campaña.
   
   Ejemplo:
   "Perfecto, cuéntame un poco sobre tu marca y qué resultados te gustaría lograr con esta campaña."

3. Sugerir influencers/servicios (sin precios aún):
   - Menciona nombres de influencers que encajen con la campaña.
   - Describe brevemente sus servicios y estilo, sin dar precio.
   
   Ejemplo:
   "Para tu campaña, algunos influencers que podrían encajar son:  
   - Erik el Marroco: reels y TikToks auténticos que conectan con audiencias locales.  
   - Gina Rivera: contenido premium para alcance nacional y presencia en eventos.  
   - Julián Pinilla: ideal para campañas transatlánticas o contenido social.  
   ¿Quieres que haga una propuesta combinando algunos de ellos?"

4. Explicar el flujo de trabajo y beneficios de ISKRA:
   - Diagnóstico y objetivos
   - Estrategia y concepto creativo
   - Selección de influencers
   - Negociación profesional
   - Producción de contenido
   - Medición de impacto
   - Seguimiento y control de calidad

   Ejemplo:
   "En ISKRA, diseñamos estrategias éticas y sostenibles, garantizando resultados medibles y precios justos, cuidando tanto la marca como al creador."

5. Presentar precios :
   - Consulta tu base de datos de influencers para calcular el total.
   - Presenta desglose por influencer y servicio.
   
   Ejemplo:
   "Listo, según los influencers seleccionados, la propuesta aproximada sería:  
   - Erik el Marroco: Reel + Historia  
   - Gina Rivera: TikTok + Presencia en Evento  
   Total aproximado: $X  
   Para afinar detalles y cerrar la propuesta, puedes contactarnos al 3204368667."

6. Captura de leads:
   - Para terminar mandale un link que redireccione directamente a whatssap con la cotización al numero 

7. Si hablan algo relaciona con querer ser influencer/quiero ser influencer:
    hacerle estas preguntas:
    1.	¿Por qué quieres ser influencer o creador de contenido realmente?
	2.	¿Qué estarías dispuesto(a) a sacrificar por construir tu marca?
	3.	¿Quieres fama o quieres construir una empresa personal?
	4.	¿Dónde te ves en 3 años digitalmente?
	5.	¿Qué problema del mundo quieres resolver con tu contenido?

TONO:
- Profesional y estratégico.
- Amigable y natural.
- Persuasivo sin ser agresivo.
- En español o inglés según el usuario.
`
},
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* AUTOSCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Mostrar "escribiendo..."
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      setIsTyping(false);

      if (!res.ok || !data.message) throw new Error("AI response error");

      setMessages((prev) => [...prev, data.message]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Ocurrió un error con la IA. Verifica tu saldo o API Key.",
        },
      ]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 h-[500px] flex flex-col bg-gradient-to-b from-black/90 to-black/70 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
      {/* HEADER */}
      <div className="bg-black/90 px-4 py-3 flex justify-between items-center border-b border-white/20">
        <span className="text-white font-semibold text-lg">Iskra Chat</span>
        <button
          onClick={() => setOpen(false)}
          className="text-white hover:text-red-400 transition text-xl"
        >
          ✕
        </button>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-[75%] text-sm break-words ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "bg-white/90 text-black shadow"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {/* ESCRIBIENDO */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-2 max-w-[40%] bg-white/90 text-black shadow flex items-center gap-1">
              <span className="dot bounce"></span>
              <span className="dot bounce delay-100"></span>
              <span className="dot bounce delay-200"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/20 flex gap-2 bg-black/90">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 rounded-full px-4 py-2 bg-black/80 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-600 text-white transition"
        >
          ➤
        </button>
      </div>

      {/* ANIMACIÓN PUNTITOS */}
      <style jsx>{`
        .dot {
          width: 6px;
          height: 6px;
          background-color: black;
          border-radius: 50%;
          display: inline-block;
        }
        .bounce {
          animation: bounce 1s infinite;
        }
        .bounce.delay-100 {
          animation-delay: 0.1s;
        }
        .bounce.delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}