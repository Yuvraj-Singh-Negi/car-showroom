'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { defaultCar, cars, isValidModelId } from '@/lib/cars';
import type { CarDefinition } from '@/types/car';
import Button from '@/components/ui/Button';

function ConfiguratorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlModel = searchParams.get('model');

  const initialCar = useState<CarDefinition>(() => {
    if (urlModel && isValidModelId(urlModel)) {
      return cars.find((c) => c.id === urlModel) ?? defaultCar;
    }
    return defaultCar;
  })[0];

  return (
    <div className="w-full h-full flex flex-col">
      <header className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 md:py-6 pointer-events-auto">
        <Link
          href="/gallery"
          onClick={() => router.push(`/gallery?model=${initialCar.id}`, { scroll: false })}
          className="inline-flex items-center gap-2 text-[14px] md:text-lg font-bold uppercase tracking-[0.04em] text-foreground hover:text-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          RETURN TO GALLERY
        </Link>
        <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted">
          CONFIGURATOR &middot; {initialCar.step} / 03 &middot; {initialCar.name}
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="max-w-[720px] w-full text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold uppercase tracking-tight text-foreground mb-6">
            CUSTOMIZE SPEC
          </h1>
          <p className="text-[12px] md:text-lg text-muted mb-10 leading-relaxed">
            Configuration options for the <span className="text-foreground font-medium">{initialCar.name}</span>{' '}
            are being developed. Select your vehicle and return to the gallery to enter the 3D viewer.
          </p>

          <div className="border border-border bg-background p-6 md:p-10">
            <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.16em] text-muted mb-4">
              SELECTED VEHICLE
            </div>
            <div className="text-[20px] md:text-[24px] font-semibold uppercase tracking-tight text-foreground mb-6">
              {initialCar.name}
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <dt className="text-[10px] md:text-xs uppercase tracking-[0.12em] text-muted">
                  ENGINE
                </dt>
                <dd className="text-[12px] md:text-sm text-foreground">
                  {initialCar.specification.engine}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] md:text-xs uppercase tracking-[0.12em] text-muted">
                  HORSEPOWER
                </dt>
                <dd className="text-[12px] md:text-sm text-foreground">
                  {initialCar.specification.horsepower}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-[11px] md:text-sm text-muted italic">
              Additional exterior colour, wheel, and trim configuration
              controls will be integrated here as they become available.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() =>
                router.push(`/viewer?model=${initialCar.id}`, { scroll: false })
              }
            >
              ENTER 3D VIEWER
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() =>
                router.push(`/gallery?model=${initialCar.id}`, { scroll: false })
              }
            >
              RETURN TO GALLERY
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConfiguratorPage() {
  return <Suspense fallback={null}><ConfiguratorInner /></Suspense>;
}
