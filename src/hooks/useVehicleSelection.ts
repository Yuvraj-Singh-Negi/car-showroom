'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCarOrFallback, isValidModelId } from '@/lib/cars';

/**
 * Returns the currently selected vehicle and a setter that keeps the
 * selection in sync with the `?model=` URL query parameter.
 *
 * The URL is the source of truth so the selection survives navigation
 * and browser refreshes.
 */
export function useVehicleSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlModel = searchParams.get('model');

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (urlModel && isValidModelId(urlModel)) return urlModel;
    return 'vantage';
  });

  // Synchronise the local selection with the external URL query parameter.
  // This is intentional: the URL is the source of truth for the selected model.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (urlModel && isValidModelId(urlModel) && urlModel !== selectedId) {
      setSelectedId(urlModel);
    } else if (!urlModel || !isValidModelId(urlModel)) {
      setSelectedId('vantage');
    }
  }, [urlModel, selectedId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const car = useMemo(() => getCarOrFallback(selectedId), [selectedId]);

  const selectVehicle = useCallback(
    (id: string) => {
      if (!isValidModelId(id)) return;
      setSelectedId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set('model', id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  return {
    car,
    selectedId,
    selectVehicle,
    carsCount: 3,
  };
}

export type UseVehicleSelection = ReturnType<typeof useVehicleSelection>;
