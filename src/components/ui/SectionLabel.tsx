'use client';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

const SectionLabel = ({ children, className }: SectionLabelProps) => (
  <span
    className={[
      'block text-[10px] md:text-xs font-medium uppercase tracking-[0.16em] text-muted',
      className,
    ].filter(Boolean).join(' ')}
  >
    {children}
  </span>
);

export default SectionLabel;
