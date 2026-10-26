'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ViewerExperience from '@/components/viewer/ViewerExperience';
import { defaultCar, cars, isValidModelId } from '@/lib/cars';
import type { CarDefinition } from '@/types/car';

function ViewerInner() {
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
      <ViewerExperience initialCar={initialCar} />
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={null}>
      <ViewerInner />
    </Suspense>
  );
}
