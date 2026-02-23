export interface Partner {
  id: number;
  service_partner_tier: number;
  title: string;
  image: string;
  link: string;
  is_featured: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface ServicePartnerTier {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  is_default: 'yes' | 'no';
  display_order: number;
  servicetier_ids?: string | null;
  description?: string | null;
  updated_by: number;
  createdAt?: string;
  updatedAt?: string;
  partners: Partner[];
}

export interface GetPartnersResponse {
  status: string;
  message: string;
  result: ServicePartnerTier[];
}

