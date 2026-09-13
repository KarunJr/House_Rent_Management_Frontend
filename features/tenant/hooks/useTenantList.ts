import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { handleError } from '@/helpers/axios.error';
import { useTenantStore } from '../tenant.store';

export function useTenantList() {
  const isFocused = useIsFocused();
  const tenants = useTenantStore((state) => state.tenants);
  const getTenants = useTenantStore((state) => state.getTenants);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isFocused) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    void getTenants(controller.signal)
      .catch((error) => {
        if (!controller.signal.aborted) setError(handleError(error).message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [getTenants, isFocused, retryCount]);

  return { tenants, isLoading, error, retry: () => setRetryCount((value) => value + 1) };
}
