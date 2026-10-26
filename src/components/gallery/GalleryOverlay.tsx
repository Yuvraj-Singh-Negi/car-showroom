'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Play, Layers } from 'lucide-react';
import type { CarDefinition } from '@/types/car';
import Button from '@/components/ui/Button';
import ModelSelector from './ModelSelector';
import ModelSpecifications from './ModelSpecifications';

interface GalleryOverlayProps {
  car: CarDefinition;
  selectedId: string;
  status: 'idle' | 'loading' | 'ready' | 'error';
  errorPath: string | null;
  onSelect: (id: string) => void;
  retry?: () => void;
  cars: CarDefinition[];
}

export default function GalleryOverlay({
  car,
  selectedId,
  status,
  errorPath,
  onSelect,
  retry,
  cars,
}: GalleryOverlayProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'exterior' | 'interior' | 'performance'>('exterior');

  const handleEnterViewer = useCallback(() => {
    router.push(`/viewer?model=${car.id}`, { scroll: false });
  }, [router, car.id]);

  const handleCustomize = useCallback(() => {
    router.push(`/configurator?model=${car.id}`, { scroll: false });
  }, [router, car.id]);

  const handleSection = useCallback(
    (section: 'exterior' | 'interior' | 'performance') => {
      setActiveSection(section);
      if (section === 'interior') {
        router.push(`/viewer?model=${car.id}&view=interior`, { scroll: false });
      }
    },
    [router, car.id],
  );

  return (
    <div className="inset-x-0 bottom-0 z-20 p-6 md:p-12 xl:p-16 pointer-events-none">
      {/* Bottom-left: specifications */}
      <div
        className="absolute left-6 md:left-12 bottom-8 md:bottom-12 z-30 pointer-events-auto flex flex-col gap-3 w-full md:w-80"
      >
        <ModelSpecifications car={car} />
      </div>

      {/* Bottom-center: model selector + actions */}
      <div
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-5 w-full max-w-[640px]"
      >
        <ModelSelector
          cars={cars}
          selectedId={selectedId}
          status={status}
          errorPath={errorPath}
          onSelect={onSelect}
          retry={retry}
        />

        <div className="flex items-center gap-3 w-full justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleEnterViewer}
            className="w-full md:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            ENTER 3D VIEWER
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleCustomize}
            className="w-full md:w-auto"
          >
            <Layers className="h-4 w-4 mr-2" />
            CUSTOMIZE SPEC
          </Button>
        </div>

        <div className="flex gap-1 w-full justify-center">
          {([
            { id: 'exterior', label: '01. EXTERIOR' },
            { id: 'interior', label: '02. INTERIOR' },
            { id: 'performance', label: '03. PERFORMANCE' },
          ] as const).map((section) => (
            <button
              key={section.id}
              onClick={() => handleSection(section.id)}
              className={[
                'flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors border-b-2',
                activeSection === section.id
                  ? 'border-foreground text-foreground pb-1'
                  : 'border-transparent text-muted hover:text-foreground',
              ].join(' ')}
              aria-pressed={activeSection === section.id}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
