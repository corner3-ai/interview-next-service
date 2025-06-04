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
    <div className="relative h-[200px] w-[512px] max-w-[90vw] mx-auto">
      <div
        ref={containerRef}
        className="h-full flex flex-col gap-2 overflow-y-auto px-4 py-8 border-gray-200 border-2 rounded-lg"
      >
        {combinedTranscriptions.map((segment) => (
          <div
            id={segment.id}
            key={segment.id}
            className={
              segment.role === "assistant"
                ? "bg-blue-100 border border-blue-200 rounded-lg p-3 self-start max-w-[80%] text-gray-800"
                : "bg-gray-700 border border-gray-600 rounded-lg p-3 self-end max-w-[80%] text-white"
            }
          >
            {segment.text}
          </div>
        ))}
      </div>
    </div>
  )
}
