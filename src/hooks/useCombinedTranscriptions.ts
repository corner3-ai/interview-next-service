// Copied from https://github.com/livekit-examples/voice-assistant-frontend/blob/main/hooks/useCombinedTranscriptions.ts
import {
  useTrackTranscription,
  useVoiceAssistant,
} from "@livekit/components-react"
import { useMemo } from "react"
import useLocalMicTrack from "./useLocalMicTrack"

export default function useCombinedTranscriptions() {
  const { agentTranscriptions } = useVoiceAssistant()

  const micTrackRef = useLocalMicTrack()
  const { segments: userTranscriptions } = useTrackTranscription(micTrackRef)

  const combinedTranscriptions = useMemo(() => {
    return [
      ...agentTranscriptions.map((val) => {
        return { ...val, role: "assistant" }
      }),
      ...userTranscriptions.map((val) => {
        return { ...val, role: "user" }
      }),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
  }, [agentTranscriptions, userTranscriptions])

  return combinedTranscriptions
}
