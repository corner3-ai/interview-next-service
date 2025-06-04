"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TextField from "@/components/text-field"

export default function QuestionnairePromptBuilder() {
  const [question, setQuestion] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Get the prompt if we do have one already
  useEffect(() => {
    fetch("/api/questionnaire-prompt-builder")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to load prompt")
        }
        return res.json()
      })
      .then((data) => setQuestion(data.prompt))
      .catch((error) => {
        console.error("Error loading prompt:", error)
        setError(error.message)
      })
  }, [])

  const handleSave = async () => {
    if (!question.trim()) {
      setError("You've left me empty handed ")
      return
    }

    setIsSaving(true)
    setError(null)
    // Temporarily save the question for smoother user experience before we clear it
    const questionToSave = question
    setQuestion("")

    try {
      const response = await fetch("/api/questionnaire-prompt-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: questionToSave }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save prompt")
      }
      router.push("/call")
    } catch (error) {
      console.error("Error saving prompt:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save prompt. Please try again."
      )
      setQuestion(questionToSave)
    } finally {
      setIsSaving(false)
    }
  }

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
          placeholder="e.g. How would you feel as a replacement for Kermit the frog?"
          value={question}
          onChange={(value) => {
            setQuestion(value)
            setError(null)
          }}
          multiline={true}
          rows={4}
        />

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-2 bg-blue-500 text-white rounded-4xl text-lg font-light hover:bg-blue-600 transition-colors mt-8 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  )
}
