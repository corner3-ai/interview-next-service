'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { cn } from '@/lib/utils';
import { DeviceSelect } from './device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';
import { PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';

export interface AgentControlBarProps extends React.HTMLAttributes<HTMLDivElement>, UseAgentControlBarProps {
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

export function AgentControlBar({
  controls,
  saveUserChoices = true,
  className,
  onDisconnect,
  onDeviceError,
  ...props
}: AgentControlBarProps) {
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const {
    microphoneToggle,
    handleAudioDeviceChange,
    handleDisconnect,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
  });

  const onLeave = async () => {
    setIsDisconnecting(true);
    await handleDisconnect();
    setIsDisconnecting(false);
    onDisconnect?.();
  };

  const onMicrophoneDeviceSelectError = React.useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'bg-background border-bg2 dark:border-separator1 inline-flex rounded-[31px] border p-3 drop-shadow-md/3',
        className
      )}
      {...props}
    >
      <div className="flex flex-row justify-between gap-1">
        <div className="flex gap-1">
          <div className="flex items-center gap-0">
            <TrackToggle
              variant="primary"
              source={Track.Source.Microphone}
              pressed={microphoneToggle.enabled}
              disabled={microphoneToggle.pending}
              onPressedChange={microphoneToggle.toggle}
              className="peer/track group/track relative w-auto pr-3 pl-3 md:rounded-r-none md:border-r-0 md:pr-2"
            >
              {/* Audio visualizer or icon can go here */}
            </TrackToggle>
            <hr className="bg-separator1 peer-data-[state=off]/track:bg-separatorSerious relative z-10 -mr-px hidden h-4 w-px md:block" />
            <DeviceSelect
              size="sm"
              kind="audioinput"
              onMediaDeviceError={onMicrophoneDeviceSelectError}
              onActiveDeviceChange={handleAudioDeviceChange}
              className={cn([
                'pl-2',
                'peer-data-[state=off]/track:text-destructive-foreground',
                'hover:text-fg1 focus:text-fg1',
                'hover:peer-data-[state=off]/track:text-destructive-foreground focus:peer-data-[state=off]/track:text-destructive-foreground',
                'hidden rounded-l-none md:block',
              ])}
            />
          </div>
        </div>
          <button
            className="end-call-btn"
            onClick={onLeave}
            disabled={isDisconnecting}
          >
            <PhoneDisconnectIcon weight="bold" className="end-call-icon" />
            <span className="end-call-text">END CALL</span>
          </button>
      </div>
    </div>
  );
}
