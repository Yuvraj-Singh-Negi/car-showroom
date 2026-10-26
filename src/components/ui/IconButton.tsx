'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  ariaPressed?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, size = 'md', active = false, ariaPressed, ...props }, ref) {
    const sizes = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-none border border-border bg-background text-foreground transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
          active ? 'bg-foreground text-background border-foreground' : '',
          sizes[size],
          className,
        )}
        aria-pressed={ariaPressed ?? active ? true : undefined}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
