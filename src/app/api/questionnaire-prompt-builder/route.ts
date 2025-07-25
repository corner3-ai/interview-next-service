let currentPrompt = "";

import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PROMPT } from '../../../prompt';

export async function GET() {
  if (!currentPrompt) {
    return NextResponse.json({ prompt: INITIAL_PROMPT });
  }
  return NextResponse.json({ prompt: currentPrompt });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (typeof data.prompt === "string" && data.prompt !== "") {
    currentPrompt = data.prompt;
    return NextResponse.json({ success: true, prompt: currentPrompt });
  } else {
    return NextResponse.json({ success: false, error: "Invalid prompt" }, { status: 400 });
  }
} 