export interface TenantContact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

// POST and PUT return TenantDetailsDto directly, without a success wrapper.
export interface TenantDetails extends TenantContact {
  createdAt: string;
}

export interface TenantLease {
  id: string;
  monthlyRent: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  room: {
    id: string;
    roomName: string;
    floorId: string;
  };
}

export interface TenantListItem extends TenantContact {
  activeLeases: TenantLease[];
}

export interface TenantListResponse {
  success: boolean;
  tenants: TenantListItem[];
}

export interface TenantProfile extends TenantDetails {
  updatedAt: string;
  leases: TenantLease[];
}

export interface TenantRequest {
  name: string;
  phone: string;
  email: string | null;
}
