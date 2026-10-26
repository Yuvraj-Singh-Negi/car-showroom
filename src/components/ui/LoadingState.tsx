'use client';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

const LoadingState = ({
  label = 'PREPARING VEHICLE',
  className,
}: LoadingStateProps) => (
  <div
    className={[
      'flex flex-col items-center justify-center gap-2 text-muted uppercase tracking-[0.14em] text-[10px] md:text-xs',
      className,
    ].filter(Boolean).join(' ')}
    role="status"
    aria-live="polite"
  >
    <span className="relative h-3 w-3 rounded-full border-2 border-border border-t-foreground animate-[spin_1s_linear_infinite]">
      <span className="sr-only">Loading</span>
    </span>
    <span>{label}</span>
  </div>
);

export default LoadingState;
