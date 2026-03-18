"use client";

import { useChat } from "./ChatContext";
import Image from "next/image";

export default function ChatBubble() {
  const { setOpen } = useChat();

  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* 🔥 CHISPA GIRANDO */}
      <span className="absolute inset-0 rounded-full animate-spin-slow">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_12px_4px_rgba(255,255,255,0.9)]" />
      </span>

      {/* ✨ ANILLO BLANCO */}
      <span className="absolute inset-[-6px] rounded-full border border-white/40 blur-[1px] shadow-[0_0_25px_rgba(255,255,255,0.35)]" />

      {/* 🟣 BOTÓN */}
      <div
        className="
          relative
          w-14 h-14 rounded-full
          bg-black
          shadow-[0_10px_30px_rgba(0,0,0,0.6)]
          hover:scale-105 transition
          flex items-center justify-center
        "
      >
        <Image
          src="/images/iskra-logo.png"
          alt="Abrir chat"
          width={26}
          height={26}
          className="pointer-events-none"
        />
      </div>
    </button>
  );
}
