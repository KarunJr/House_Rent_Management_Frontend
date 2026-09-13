export interface LeaseDetails {
  id: string;
  roomId: string;
  tenantId: string;
  monthlyRent: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
}

// A successful write remains successful even if refreshing the lists fails.
export interface LeaseSaveResult {
  lease: LeaseDetails;
  refreshFailed: boolean;
}
