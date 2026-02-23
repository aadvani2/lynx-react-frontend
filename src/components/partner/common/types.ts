/**
 * Shared types for Partner request components
 */

export interface Category {
  id: number;
  title: string;
  slug?: string;
  image?: string;
  description?: string;
  color?: string;
}

/**
 * Partial category type for flexible category handling
 */
export type CategoryLike = Category | { title?: string; id?: number } | string;

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  dial_code?: string;
  country_code?: string;
  title?: string;
}

/**
 * Partial customer type for flexible customer handling
 */
export type CustomerLike = Customer | { name?: string; id?: number } | string;

/**
 * Base interface for partner requests
 * Different request types may have additional fields
 */
export interface BasePartnerRequest {
  id: number;
  request_id: number;
  category: CategoryLike;
  services_name?: string;
  description?: string;
  tag: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  status: string;
  created_at: string;
  timestamp?: string;
  customer: CustomerLike;
  total?: number;
}

