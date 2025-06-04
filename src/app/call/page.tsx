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
import { AnimatePresence, motion } from "framer-motion"
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
    <div
      data-lk-theme="default"
      className="h-screen mt-16 bg-slate-50 overflow-hidden overflow-y-auto"
    >
      <RoomContext.Provider value={room}>
        <div className="h-full w-full max-w-[1024px] mx-auto">
          <SimpleVoiceAssistant
            onConnectButtonClicked={onConnectButtonClicked}
          />
        </div>
      </RoomContext.Provider>
    </div>
  )
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant()

  return (
    <div className="flex justify-center items-center h-full w-full px-10 bg-gradient-to-b from-slate-50 to-slate-100">
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="grid items-center justify-center w-full"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="uppercase px-4 py-2 bg-white text-black rounded-md"
              onClick={() => props.onConnectButtonClicked()}
            >
              Start a conversation
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center gap-4 w-full py-4"
          >
            <div className="flex-1 w-full overflow-hidden">
              <TranscriptionView />
            </div>
            <div className="w-full">
              <ControlBar
                onConnectButtonClicked={props.onConnectButtonClicked}
              />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ControlBar(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant()

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function onDeviceFailure(error: Error) {
  console.error(error)
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  )
}
