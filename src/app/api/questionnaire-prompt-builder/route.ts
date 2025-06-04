import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

// Save to a json file cause time and stuff >_>
// sorry, not sorry
const PROMPT_FILE = path.join(process.cwd(), "prompt.json")

if (!fs.existsSync(PROMPT_FILE)) {
  fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt: "" }))
}

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(PROMPT_FILE, "utf-8"))
    return NextResponse.json({ prompt: data.prompt })
  } catch (error) {
    console.error("GET error reading prompt:", error)
    return NextResponse.json(
      { error: "Failed to read prompt" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    // TODO:maybe add like length check? idk
    if (typeof prompt !== "string") {
      return NextResponse.json(
        { error: "POST error: Prompt must be a string" },
        { status: 400 }
      )
    }

    fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST error saving prompt:", error)
    return NextResponse.json(
      { error: "Failed to save prompt" },
      { status: 500 }
    )
  }
}
