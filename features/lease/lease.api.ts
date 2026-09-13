import api from '@/lib/client';
import type { LeaseDetails } from './lease.types';
import type { CreateLeaseFormData, EndLeaseFormData } from './lease.validation';

export const createLeaseApi = (data: CreateLeaseFormData) =>
  api.post<LeaseDetails>('/v1/api/lease/', data);

export const endLeaseApi = (leaseId: string, data: EndLeaseFormData) =>
  api.post<LeaseDetails>(`/v1/api/lease/${leaseId}/end`, data);
