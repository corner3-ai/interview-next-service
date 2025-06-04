import React from "react"

export default function QuestionnairePromptBuilder() {
  return (
    <div className="flex justify-start items-center h-screen bg-white">
      <div className="flex flex-col align-center p-5 justify-start">
        <h1 className="text-indigo-400 text-2xl font-bold mb-1">
          Let&apos;s build a prompt
        </h1>
        <h2 className="text-black text-lg font-bold">
          Jot down some questions to prepare for your interview
        </h2>
        <input
          type="text"
          placeholder="Enter your question"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  )
}
