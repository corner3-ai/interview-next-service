"use client"

import {
  RoomAudioRenderer,
  RoomContext,
  useVoiceAssistant,
} from "@livekit/components-react"
import { Room, RoomEvent, ConnectionState } from "livekit-client"
import { useCallback, useEffect, useState, useContext } from "react"
import type { ConnectionParams } from "../api/auth/route"
import { CloseIcon } from "@/components/close-icon"
import { NoAgentNotification } from "@/components/no-agent-notification"
import TranscriptionView from "@/components/transcription-view"
import { useRouter } from "next/navigation"

export default function Call() {
  const [room] = useState(new Room())
  const router = useRouter()

  const onConnectButtonClicked = useCallback(async () => {
    if (room.state === ConnectionState.Connected) {
      await room.disconnect()
    }

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
    room.on(RoomEvent.Disconnected, () => {
      room.state = ConnectionState.Disconnected
      router.push("/")
    })

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure)
      room.off(RoomEvent.Disconnected, () => {})
      if (room.state === ConnectionState.Connected) {
        room.disconnect().catch(console.error)
      }
    }
  }, [room, router])

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
  const { onConnectButtonClicked } = props

  const handleStartCall = useCallback(async () => {
    await onConnectButtonClicked()
  }, [onConnectButtonClicked])

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {agentState === "disconnected" ? (
        <div className="flex items-center justify-center w-full">
          <button
            className="w-full max-w-80 py-2 bg-blue-500 text-white rounded-4xl text-lg font-light hover:bg-blue-600 transition-colors"
            onClick={handleStartCall}
          >
            Join Call
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-4">
          <div className="w-full overflow-hidden">
            <TranscriptionView />
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <ControlBar />
            <RoomAudioRenderer />
          </div>
          <NoAgentNotification state={agentState} />
        </div>
      )}
    </div>
  )
}

function ControlBar() {
  const { state: agentState } = useVoiceAssistant()
  const room = useContext(RoomContext)

  const handleDisconnect = useCallback(async () => {
    if (!room) return
    try {
      await room.disconnect()
    } catch (error) {
      console.error("Error disconnecting:", error)
    }
  }, [room])

  return (
    <div className="flex justify-end items-center relative h-[60px]">
      {agentState !== "disconnected" && agentState !== "connecting" && (
        <div className="flex flex-row w-full h-8 justify-end">
          <button
            onClick={handleDisconnect}
            className=" border-2 border-gray-400 p-2 hover:bg-gray-100 rounded-md transition-colors flex flex-row items-center gap-2"
          >
            <CloseIcon />
            Disconnect
          </button>
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
