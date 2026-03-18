import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.6,
    });

    // 🔥 PROTECCIÓN CLAVE
    if (!completion?.choices?.[0]?.message) {
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: completion.choices[0].message,
    });

  }  catch (error: unknown) {
  console.error("OpenAI error:", error);

  const message =
    error instanceof Error ? error.message : "Chat error";

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

}
