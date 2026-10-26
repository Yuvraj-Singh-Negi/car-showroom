'use client';

import { useVehicleActions } from '@/hooks/useVehicleActions';

interface ViewerControlsProps {
  onAnimationUnavailable?: () => void;
}

export default function ViewerControls({ onAnimationUnavailable }: ViewerControlsProps = {}) {
  const { openDoors, toggleLights, startEngine } = useVehicleActions();

  const actions = [
    { label: 'OPEN DOORS', handler: openDoors, hint: 'ANIMATION NOT CONFIGURED' },
    { label: 'TOGGLE LIGHTS', handler: toggleLights, hint: 'CONTROL READY FOR INTEGRATION' },
    { label: 'START ENGINE', handler: startEngine, hint: 'ANIMATION NOT CONFIGURED' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              action.handler();
              onAnimationUnavailable?.();
            }}
            className="flex-1 py-3 px-4 text-[10px] font-medium uppercase tracking-wider border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] md:text-xs text-muted italic">
        Vehicle actions are integration points for future GLB animation clips.
      </p>
    </div>
  );
}
