'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ViewerCanvas from './ViewerCanvas';
import ViewerSpecifications from './ViewerSpecifications';
import CameraControls from './CameraControls';
import ViewerControls from './ViewerControls';
import RotationIndicator from './RotationIndicator';
import LoadingState from '@/components/ui/LoadingState';
import Button from '@/components/ui/Button';
import { useCameraZoom } from '@/hooks/useCameraZoom';
import { getCarOrFallback, isValidModelId } from '@/lib/cars';
import type { CarDefinition } from '@/types/car';
import type { VehicleViewMode } from './ViewerCanvas';

interface ViewerExperienceProps {
  initialCar: CarDefinition;
}

export default function ViewerExperience({ initialCar }: ViewerExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlModel = searchParams.get('model');
  const [car] = useState<CarDefinition>(
    urlModel && isValidModelId(urlModel) ? getCarOrFallback(urlModel) : initialCar,
  );
  const [viewMode, setViewMode] = useState<VehicleViewMode>(
    (searchParams.get('view') as VehicleViewMode) ?? 'exterior',
  );

  const {
    distance,
    isAtMin,
    isAtMax,
    zoomIn,
    zoomOut,
    bindCamera,
    bindControls,
  } = useCameraZoom({
    minDistance: 3.5,
    maxDistance: 12,
    step: 0.5,
    defaultDistance: 7,
  });

  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorPath, setErrorPath] = useState<string | null>(null);

  const handleViewChange = useCallback(
    (mode: VehicleViewMode) => {
      setViewMode(mode);
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', mode);
      if (car.id) params.set('model', car.id);
      router.replace(`/viewer?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, car.id],
  );

  const handleRetry = useCallback(() => {
    setLoadStatus('loading');
    setErrorPath(null);
  }, []);

  const returnToGallery = () => {
    router.push(`/gallery?model=${car.id}`, { scroll: false });
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <header className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 md:py-6 pointer-events-auto">
        <Link
          href="/gallery"
          onClick={returnToGallery}
          className="inline-flex items-center gap-2 text-[14px] md:text-lg font-bold uppercase tracking-[0.04em] text-foreground hover:text-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          RETURN TO GALLERY
        </Link>
        <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted">
          {car.step} / 03 &middot; {car.name}
        </div>
      </header>

      <main className="flex-1 relative">
        <ViewerCanvas
          model={car}
          viewMode={viewMode}
          bindCamera={bindCamera}
          bindControls={bindControls}
        />

        {/* Left: specifications panel */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 z-30 w-full md:w-56 pointer-events-auto"
        >
          <ViewerSpecifications car={car} />
        </div>

        {/* Right: camera controls */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-30 w-full md:w-60 pointer-events-auto"
        >
          <CameraControls
            viewMode={viewMode}
            setViewMode={handleViewChange}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            isAtMin={isAtMin}
            isAtMax={isAtMax}
            distance={distance}
          />
        </div>

        {/* Loading / error overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
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
                <p className="text-[11px] md:text-sm text-muted">{errorPath}</p>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  RETRY
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom center: vehicle controls + rotation indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-6 w-full max-w-[600px]"
      >
        <ViewerControls />
        <RotationIndicator />
      </div>
    </div>
  );
}
