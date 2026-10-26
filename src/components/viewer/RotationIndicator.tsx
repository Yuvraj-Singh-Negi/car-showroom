'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Minimal rotation axis indicator. A thin horizontal line with a central
 * marker and optional subtle pulsing cue, communicating that horizontal
 * dragging rotates the vehicle. It is deliberately subordinate to the
 * vehicle and the action buttons.
 */
export default function RotationIndicator() {
  const [active, setActive] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // Subtle animated cue only when not reduced motion.
    if (typeof matchMedia === 'undefined') return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let t = 0;
    const loop = () => {
      t += 0.02;
      setActive(Math.sin(t) > 0);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-1">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-px h-full bg-border" />
        <div
          className={[
            'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
            'w-2 h-2 rounded-full bg-foreground transition-colors duration-200',
            active ? 'bg-foreground scale-110' : 'bg-muted',
          ].join(' ')}
        />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-foreground" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-foreground" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
        360&deg; ROTATION
      </span>
    </div>
  );
}
