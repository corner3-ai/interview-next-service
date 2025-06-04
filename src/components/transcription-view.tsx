// Copied from https://github.com/livekit-examples/voice-assistant-frontend/blob/main/components/TranscriptionView.tsx
import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions"
import * as React from "react"

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [combinedTranscriptions])

  return (
    <div className="relative h-[400px] w-full max-w-[90vw] mx-auto overflow-y-hidden">
      <div
        ref={containerRef}
        className="
        flex flex-col h-full w-full p-6 border-2 border-indigo-400 rounded-2xl focus:outline-none focus:border-indigo-500 text-gray-700 placeholder-gray-400 bg-white shadow-sm transition-colors overflow-y-auto"
      >
        {combinedTranscriptions.map((segment) => (
          <div
            id={segment.id}
            key={segment.id}
            className={
              segment.role === "assistant"
                ? "bg-blue-100 border border-blue-200 rounded-lg p-3 self-start max-w-[80%] text-gray-800 my-2"
                : "bg-gray-700 border border-gray-600 rounded-lg p-3 self-end max-w-[80%] text-white my-2"
            }
          >
            {segment.text}
          </div>
        ))}
      </div>
    </div>
  )
}
