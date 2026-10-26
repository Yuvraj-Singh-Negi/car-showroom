'use client';

import type { VehicleViewMode } from './ViewerCanvas';
import IconButton from '@/components/ui/IconButton';
import SectionLabel from '@/components/ui/SectionLabel';
import { Plus, Minus } from 'lucide-react';

interface CameraControlsProps {
  viewMode: VehicleViewMode;
  setViewMode: (mode: VehicleViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isAtMin: boolean;
  isAtMax: boolean;
  distance: number;
}

const VIEW_MODES: Array<{ id: VehicleViewMode; label: string }> = [
  { id: 'exterior', label: 'EXTERIOR' },
  { id: 'interior', label: 'INTERIOR' },
  { id: 'close-up', label: 'CLOSE-UP' },
];

export default function CameraControls({
  viewMode,
  setViewMode,
  onZoomIn,
  onZoomOut,
  isAtMin,
  isAtMax,
  distance,
}: CameraControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2">
        <SectionLabel>CAMERA</SectionLabel>
        <div className="flex items-center justify-between">
          <IconButton
            size="sm"
            onClick={onZoomOut}
            disabled={isAtMin}
            aria-label="Zoom out"
            aria-disabled={isAtMin}
            title={isAtMin ? 'Minimum zoom reached' : undefined}
          >
            <Minus className="h-4 w-4" />
          </IconButton>
          <span className="text-[10px] font-medium text-muted">{distance.toFixed(1)}m</span>
          <IconButton
            size="sm"
            onClick={onZoomIn}
            disabled={isAtMax}
            aria-label="Zoom in"
            aria-disabled={isAtMax}
            title={isAtMax ? 'Maximum zoom reached' : undefined}
          >
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <SectionLabel>VIEW MODE</SectionLabel>
        <div className="flex gap-1">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={[
                'flex-1 py-2 px-3 text-[10px] font-medium uppercase tracking-wider transition-colors border rounded-none',
                viewMode === mode.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted hover:text-foreground',
              ].join(' ')}
              aria-pressed={viewMode === mode.id}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
