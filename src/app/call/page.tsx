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
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col align-center p-5 justify-start w-4/6 ">
        <RoomContext.Provider value={room}>
          <div className="flex h-full w-full max-w-[1024px] mx-auto">
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
    <div className="flex flex-col justify-center items-center w-full px-10 ">
      {agentState === "disconnected" ? (
        <div className="flex items-center justify-center w-full">
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-4xl text-lg font-light hover:bg-blue-600 transition-colors  "
            onClick={() => props.onConnectButtonClicked()}
          >
            Start Call
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-4">
          <div className="w-full overflow-hidden">
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
    <div className="flex justify-center items-center relative h-[60px]">
      {agentState === "disconnected" && (
        <button
          className="uppercase px-4 py-2 text-black rounded-md"
          onClick={() => props.onConnectButtonClicked()}
        >
          Start Call
        </button>
      )}
      {agentState !== "disconnected" && agentState !== "connecting" && (
        <div className="flex w-full h-8 justify-center p-2 border-2 border-gray-200 rounded-lg">
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
