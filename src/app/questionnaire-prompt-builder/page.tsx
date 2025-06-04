"use client"

import React, { useState } from "react"
import TextField from "@/components/text-field"

export default function QuestionnairePromptBuilder() {
  const [question, setQuestion] = useState("")

  return (
    <div className="flex justify-start items-center h-screen px-10 bg-gradient-to-b from-white to-blue-50">
      <div className="flex flex-col align-center p-5 justify-start w-4/6 mt-5">
        <h1 className="text-indigo-400 text-2xl font-bold mb-1">
          Let&apos;s build a prompt
        </h1>
        <h2 className="text-black text-sm font-light mb-8">
          Write down a question to prepare for your interview
        </h2>

        <TextField
          placeholder="Enter your question"
          value={question}
          onChange={setQuestion}
          multiline={true}
          rows={4}
        />

        <button className="w-full py-2 bg-blue-500 text-white rounded-4xl text-lg font-light hover:bg-blue-600 transition-colors mt-8">
          Continue
        </button>
      </div>
    </div>
  )
}
