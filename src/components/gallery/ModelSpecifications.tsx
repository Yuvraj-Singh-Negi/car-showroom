'use client';

import type { CarDefinition } from '@/types/car';

interface ModelSpecificationsProps {
  car: CarDefinition;
}

export default function ModelSpecifications({ car }: ModelSpecificationsProps) {
  const { step, name, specification } = car;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {step} / 03
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-[12px] md:text-sm font-semibold uppercase tracking-tight text-foreground">
          SELECTED MODEL: {name}
        </span>
      </div>

      <div className="h-px bg-border" />

      <ul className="flex flex-col gap-1.5 text-[11px] md:text-[12px] leading-[1.5] text-foreground">
        <li className="flex items-baseline gap-1">
          <span className="text-muted uppercase tracking-[0.1em]">
            {specification.engine}
          </span>
        </li>
        <li className="flex items-baseline gap-1">
          <span className="font-semibold">{specification.horsepower}</span>
        </li>
        <li className="flex items-baseline gap-1">
          <span className="font-semibold">{specification.acceleration}</span>{' '}
          <span className="text-muted uppercase tracking-[0.1em]">
            {specification.accelerationMetric}
          </span>
        </li>
      </ul>
    </div>
  );
}
