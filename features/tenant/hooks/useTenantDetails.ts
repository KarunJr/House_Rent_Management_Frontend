import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { handleError } from '@/helpers/axios.error';
import { getTenantApi } from '../tenant.api';
import type { TenantProfile } from '../tenant.types';

export function useTenantDetails(id: string | undefined) {
  const isFocused = useIsFocused();
  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isFocused) return;
    const controller = new AbortController();
    setTenant(null);
    setError(null);
    setNotFound(false);

    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    async function loadTenant(tenantId: string) {
      try {
        const { data } = await getTenantApi(tenantId, controller.signal);
        if (!controller.signal.aborted) setTenant(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        const failure = handleError(error);
        setNotFound(failure.status === 404);
        setError(failure.message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void loadTenant(id);
    return () => controller.abort();
  }, [id, isFocused, retryCount]);

  return { tenant, isLoading, error, notFound, retry: () => setRetryCount((value) => value + 1) };
}
