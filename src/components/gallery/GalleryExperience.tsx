'use client';

import { Suspense, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GalleryCanvas from './GalleryCanvas';
import GalleryOverlay from './GalleryOverlay';
import LoadingState from '@/components/ui/LoadingState';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import { useVehicleSelection } from '@/hooks/useVehicleSelection';
import { cars } from '@/lib/cars';
import type { CarDefinition } from '@/types/car';

interface GalleryExperienceProps {
  initialCar?: CarDefinition;
}

export default function GalleryExperience({ initialCar }: GalleryExperienceProps) {
  const { car, selectedId, selectVehicle } = useVehicleSelection();

  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorPath, setErrorPath] = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string) => {
      setLoadStatus('loading');
      selectVehicle(id);
    },
    [selectVehicle],
  );

  const handleRetry = useCallback(() => {
    setLoadStatus('loading');
    setErrorPath(null);
  }, []);

  // Fall back to the server-provided initial car when the URL has no
  // valid model, so the prop is not dead code.
  const activeCar = initialCar ?? car;

  return (
    <div className="relative w-full min-h-screen">
      {/* 3D stage fills the viewport behind the fixed header. */}
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={null}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full"
          >
            <GalleryCanvas model={activeCar} />
          </motion.div>
        </Suspense>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {loadStatus === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto flex flex-col items-center gap-2"
            >
              <LoadingState label="PREPARING VEHICLE" />
            </motion.div>
          )}
          {loadStatus === 'error' && errorPath && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto flex flex-col items-center gap-3 text-center"
            >
              <SectionLabel>VEHICLE MODEL UNAVAILABLE</SectionLabel>
              <p className="text-[11px] md:text-sm text-muted">{errorPath}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                RETRY
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GalleryOverlay
        car={activeCar}
        selectedId={selectedId}
        status={loadStatus}
        errorPath={errorPath}
        onSelect={handleSelect}
        retry={handleRetry}
        cars={cars}
      />
    </div>
  );
}
