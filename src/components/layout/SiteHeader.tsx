'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';

const navigation = [
  { label: 'MODELS', href: '/gallery' },
  { label: 'CONFIGURATOR', href: '/configurator' },
  { label: 'VIRTUAL TOUR', href: '/viewer' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
] as const;

interface SiteHeaderProps {
  className?: string;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href;
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-40 flex items-center justify-between',
        'px-6 md:px-12 xl:px-16 py-5 md:py-6',
        'pointer-events-auto',
        className,
      ].filter(Boolean).join(' ')}
    >
      <Link
        href="/"
        className="text-foreground text-[18px] md:text-[24px] font-bold uppercase tracking-[0.04em] pointer-events-auto"
      >
        AURA
      </Link>

      <nav className="hidden md:flex items-center gap-8 md:gap-12 pointer-events-auto">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={[
              'text-[11px] md:text-xs font-medium uppercase tracking-[0.14em] transition-colors',
              isActive(item.href)
                ? 'text-foreground'
                : 'text-muted hover:text-foreground',
            ].join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/booking" className="hidden md:inline-flex">
          <Button variant="outline" size="sm">
            BOOK A TEST DRIVE
          </Button>
        </Link>
        <IconButton
          size="sm"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </IconButton>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full z-50 bg-background border-b border-border flex flex-col gap-1 p-6 md:hidden pointer-events-auto"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="w-full block py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-foreground"
              >
                BOOK A TEST DRIVE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
