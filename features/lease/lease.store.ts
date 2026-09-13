import { create } from 'zustand';
import { useRoomStore } from '@/features/room/room.store';
import { useTenantStore } from '@/features/tenant/tenant.store';
import { createLeaseApi, endLeaseApi } from './lease.api';
import type { LeaseSaveResult } from './lease.types';
import type { CreateLeaseFormData, EndLeaseFormData } from './lease.validation';

interface LeaseStore {
  createLease: (data: CreateLeaseFormData) => Promise<LeaseSaveResult>;
  endLease: (leaseId: string, data: EndLeaseFormData) => Promise<LeaseSaveResult>;
}

async function refreshLeaseLists() {
  const results = await Promise.allSettled([
    useRoomStore.getState().getRoom(),
    useTenantStore.getState().getTenants(),
  ]);
  return results.some((result) => result.status === 'rejected');
}

export const useLeaseStore = create<LeaseStore>()(() => ({
  createLease: async (data) => {
    const { data: lease } = await createLeaseApi(data);
    const refreshFailed = await refreshLeaseLists();
    return { lease, refreshFailed };
  },
  endLease: async (leaseId, data) => {
    const { data: lease } = await endLeaseApi(leaseId, data);
    const refreshFailed = await refreshLeaseLists();
    return { lease, refreshFailed };
  },
}));
