import React from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import { AgentTile } from './agent-tile';

export function MediaTiles() {
  const { state: agentState, audioTrack: agentAudioTrack } = useVoiceAssistant();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-8 bottom-32 z-50 md:top-12 md:bottom-40">
      <div className="relative mx-auto h-full max-w-2xl px-4 md:px-0">
        <div className="h-full w-full grid place-content-center">
          {agentAudioTrack && (
            <AgentTile
              state={agentState}
              audioTrack={agentAudioTrack}
              className="h-auto w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
