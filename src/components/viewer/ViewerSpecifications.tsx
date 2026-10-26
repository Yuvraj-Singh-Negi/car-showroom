'use client';

import type { CarDefinition } from '@/types/car';

interface ViewerSpecificationsProps {
  car: CarDefinition;
}

export default function ViewerSpecifications({ car }: ViewerSpecificationsProps) {
  const { specification } = car;

  const rows = [
    { label: 'ENGINE', value: specification.engine },
    { label: 'HORSEPOWER', value: specification.horsepower },
    {
      label: 'ACCELERATION',
      value: `${specification.acceleration} ${specification.accelerationMetric}`,
    },
    {
      label: 'TOP SPEED',
      value: specification.topSpeed,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[12px] md:text-sm font-semibold uppercase tracking-tight text-foreground">
          VEHICLE SPECIFICATIONS
        </h2>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-3">
        {rows.map((row) => {
          const hasData = !/TBD/i.test(row.value);
          return (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-2 pb-2 border-b border-border last:border-b-0"
            >
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {row.label}
              </span>
              <span
                className={[
                  'text-xs font-semibold text-foreground',
                  !hasData ? 'text-muted italic' : '',
                ].join(' ')}
              >
                {row.value}
              </span>
            </div>
          );
        })}
      </div>

      {/TBD/i.test(specification.horsepower) && (
        <p className="text-[10px] md:text-xs text-muted italic">
          Technical figures to be confirmed upon model release.
        </p>
      )}
    </div>
  );
}
