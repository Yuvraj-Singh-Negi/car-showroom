'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import GalleryExperience from '@/components/gallery/GalleryExperience';
import { defaultCar, cars, isValidModelId } from '@/lib/cars';
import type { CarDefinition } from '@/types/car';

function GalleryInner() {
  const searchParams = useSearchParams();
  const urlModel = searchParams.get('model');

  const initialCar = useState<CarDefinition>(() => {
    if (urlModel && isValidModelId(urlModel)) {
      return cars.find((c) => c.id === urlModel) ?? defaultCar;
    }
    return defaultCar;
  })[0];

  return (
    <div className="w-full h-full">
      <GalleryExperience initialCar={initialCar} />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryInner />
    </Suspense>
  );
}
