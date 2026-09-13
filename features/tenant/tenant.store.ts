import { create } from 'zustand';
import { useRoomStore } from '@/features/room/room.store';
import { addTenantApi, editTenantApi, getTenantsApi } from './tenant.api';
import type { TenantDetails, TenantListItem } from './tenant.types';
import type { AddTenantFormData } from './tenant.validation';

interface TenantStore {
  tenants: TenantListItem[];
  getTenants: (signal?: AbortSignal) => Promise<void>;
  addTenant: (data: AddTenantFormData) => Promise<TenantDetails>;
  editTenant: (id: string, data: AddTenantFormData) => Promise<TenantDetails>;
}

const sortTenants = (tenants: TenantListItem[]) =>
  [...tenants].sort(
    (a, b) =>
      Number(b.activeLeases.length > 0) - Number(a.activeLeases.length > 0) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
  );

export const useTenantStore = create<TenantStore>()((set) => ({
  tenants: [],

  getTenants: async (signal) => {
    const { data } = await getTenantsApi(signal);
    if (!data.success) throw new Error('Unable to load tenants.');
    if (!signal?.aborted) set({ tenants: sortTenants(data.tenants) });
  },

  addTenant: async (data) => {
    const { data: tenant } = await addTenantApi(data);
    set((state) => ({
      tenants: sortTenants([
        ...state.tenants,
        { ...tenant, activeLeases: [] },
      ]),
    }));
    return tenant;
  },

  editTenant: async (id, data) => {
    const { data: tenant } = await editTenantApi(id, data);
    set((state) => ({
      // The save response contains contact details, so retain the existing leases.
      tenants: sortTenants(
        state.tenants.map((item) => (item.id === tenant.id ? { ...item, ...tenant } : item)),
      ),
    }));
    // Room cards also display the tenant's name from their cached active lease.
    useRoomStore.setState((state) => ({
      rooms: state.rooms.map((room) =>
        room.activeLease?.tenant.id === tenant.id
          ? {
              ...room,
              activeLease: { ...room.activeLease, tenant: { id: tenant.id, name: tenant.name } },
            }
          : room,
      ),
    }));
    return tenant;
  },
}));
