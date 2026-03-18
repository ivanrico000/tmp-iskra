"use client";

import { NextIntlClientProvider } from "next-intl";

interface ClientProvidersProps {
  children: React.ReactNode;
  messages: Record<string, unknown>;
  locale: string;
}

export default function ClientProviders({
  children,
  messages,
  locale,
}: ClientProvidersProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="America/Bogota"   // 👈 AGREGA ESTA LÍNEA
    >
      {children}
    </NextIntlClientProvider>
  );
}
