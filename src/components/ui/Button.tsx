'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'border border-foreground bg-foreground text-background hover:bg-white hover:text-foreground transition-colors duration-200',
  outline:
    'border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors duration-200',
  text:
    'bg-background text-foreground hover:bg-neutral-100 transition-colors duration-200',
};

const sizes = {
  sm: 'h-8 px-3 text-[10px]',
  md: 'h-10 px-4 text-xs',
  lg: 'h-12 px-6 text-sm',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = 'outline', size = 'md', ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-none font-medium uppercase tracking-wider disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
