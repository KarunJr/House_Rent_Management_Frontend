import api from '@/lib/client';
import type {
  TenantDetails,
  TenantListResponse,
  TenantProfile,
  TenantRequest,
} from './tenant.types';
import type { AddTenantFormData } from './tenant.validation';

const toRequest = (data: AddTenantFormData): TenantRequest => ({
  name: data.name.trim(),
  phone: data.phone.trim(),
  email: data.email.trim().toLowerCase() || null,
});

export const getTenantsApi = (signal?: AbortSignal) =>
  api.get<TenantListResponse>('/v1/api/tenant/', { signal });

export const getTenantApi = (id: string, signal?: AbortSignal) =>
  api.get<TenantProfile>(`/v1/api/tenant/${id}`, { signal });

export const addTenantApi = (data: AddTenantFormData) =>
  api.post<TenantDetails>('/v1/api/tenant/', toRequest(data));

export const editTenantApi = (id: string, data: AddTenantFormData) =>
  api.put<TenantDetails>(`/v1/api/tenant/${id}`, toRequest(data));
