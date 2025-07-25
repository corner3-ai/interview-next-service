"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MediaTiles } from '@/components/livekit/media-tiles';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import useConnectionDetails from '@/hooks/use-connection-details';

export default function CallPage() {
  const { connectionDetails } = useConnectionDetails();
  const router = useRouter();

  if (!connectionDetails) {
    return <></>;
  }

  return (
    <LiveKitRoom
      token={connectionDetails.participantToken}
      serverUrl={connectionDetails.serverUrl}
      connect={true}
      audio={true}
    >
      <RoomAudioRenderer />
      <main>
        <MediaTiles />
        <div className="fixed right-0 bottom-0 left-0 z-50 px-3 pt-2 pb-3 md:px-12 md:pb-12 flex justify-center">
          <div className="relative z-10">
            <AgentControlBar onDisconnect={() => router.push('/')} />
          </div>
        </div>
      </main>
    </LiveKitRoom>
  );
} 