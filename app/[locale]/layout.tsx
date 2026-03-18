// app/[locale]/layout.tsx

import Navbar from "../../componets/Navbar";
import Footer from "../../componets/Footer";
import { ChatProvider } from "../../componets/ChatContext";
import ChatBot from "../../componets/ChatBot";
import ChatBubble from "../../componets/ChatBubble";
import ClientProviders from "../../componets/ClientProviders";
import { notFound } from "next/navigation";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ ES PROMISE en Next 16
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params; // ✅ AQUI está la clave

  if (!["es", "en"].includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className="bg-black text-white">
        <ClientProviders locale={locale} messages={messages}>
          <ChatProvider>
            <Navbar />
            {children}
            <Footer />
            <ChatBubble />
            <ChatBot />
          </ChatProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
