'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarDefinition } from '@/types/car';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import LoadingState from '@/components/ui/LoadingState';
import SectionLabel from '@/components/ui/SectionLabel';

interface ModelSelectorProps {
  cars: CarDefinition[];
  selectedId: string;
  status: 'idle' | 'loading' | 'ready' | 'error';
  errorPath: string | null;
  onSelect: (id: string) => void;
  retry?: () => void;
}

export default function ModelSelector({
  cars,
  selectedId,
  status,
  errorPath,
  onSelect,
  retry,
}: ModelSelectorProps) {
  const index = cars.findIndex((c) => c.id === selectedId);
  const car = cars[index] ?? cars[0];
  const prev = cars[(index - 1 + cars.length) % cars.length];
  const next = cars[(index + 1) % cars.length];

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <SectionLabel>VEHICLE MODEL UNAVAILABLE</SectionLabel>
        <p className="text-[11px] md:text-sm text-muted">{errorPath}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            RETRY
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SectionLabel>SELECTED MODEL</SectionLabel>
        <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-foreground">
          {car.step} / 03
        </div>
      </div>

      <div className="relative h-[120px] md:h-[150px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={car.id}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <IconButton
              size="sm"
              onClick={() => onSelect(prev.id)}
              aria-label={`Select previous model ${prev.name}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>

            <div
              className="text-[14px] md:text-xl font-semibold uppercase tracking-tight text-foreground"
              aria-live="polite"
            >
              {car.name}
            </div>

            <IconButton
              size="sm"
              onClick={() => onSelect(next.id)}
              aria-label={`Select next model ${next.name}`}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </motion.div>
        </AnimatePresence>
      </div>

      {status === 'loading' ? (
        <LoadingState label="PREPARING VEHICLE" />
      ) : (
        <div className="flex flex-col gap-1 text-[11px] md:text-[12px] leading-[1.5] text-foreground">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold">{car.specification.horsepower}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold">{car.specification.acceleration}</span>{' '}
            <span className="text-muted uppercase tracking-[0.1em]">
              {car.specification.accelerationMetric}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
