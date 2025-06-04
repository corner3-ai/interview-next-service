"use client"

import { CloseIcon } from "@/components/close-icon"
import { NoAgentNotification } from "@/components/no-agent-notification"
import TranscriptionView from "@/components/transcription-view"
import {
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react"
import { Room, RoomEvent } from "livekit-client"
import { useCallback, useEffect, useState } from "react"
import type { ConnectionParams } from "../api/auth/route"

export default function Call() {
  const [room] = useState(new Room())

  const onConnectButtonClicked = useCallback(async () => {
    const response = await fetch("/api/auth")
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to connect")
    }
    const connectionDetailsData: ConnectionParams = await response.json()
    await room.connect(
      connectionDetailsData.serverUrl,
      connectionDetailsData.participantToken
    )
    await room.localParticipant.setMicrophoneEnabled(true)
  }, [room])

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure)

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure)
    }
  }, [room])

  return (
    <div className="flex justify-center items-center h-screen px-10 bg-gradient-to-b from-white to-blue-50">
      <div className="flex flex-col align-center p-5 justify-start w-4/6 mt-5">
        <RoomContext.Provider value={room}>
          <div className="h-full w-full max-w-[1024px] mx-auto">
            <SimpleVoiceAssistant
              onConnectButtonClicked={onConnectButtonClicked}
            />
          </div>
        </RoomContext.Provider>
      </div>
    </div>
  )
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant()

  return (
    <div className="flex flex-col justify-center items-center  w-full px-10 bg-gradient-to-b from-slate-50 to-slate-100">
      {agentState === "disconnected" ? (
        <div className="grid items-center justify-center w-full">
          <button
            className="uppercase px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start Call
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full py-4">
          <div className="flex-1 w-full overflow-hidden">
            <TranscriptionView />
          </div>
          <div className="w-full">
            <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} />
          </div>
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </div>
      )}
    </div>
  )
}

function ControlBar(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant()

  return (
    <div className="relative h-[60px]">
      {agentState === "disconnected" && (
        <button
          className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
          onClick={() => props.onConnectButtonClicked()}
        >
          Start a conversation
        </button>
      )}
      {agentState !== "disconnected" && agentState !== "connecting" && (
        <div className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center">
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </div>
      )}
    </div>
  )
}

function onDeviceFailure(error: Error) {
  console.error(error)
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  )
}
