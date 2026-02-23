export interface Address {
    id?: number;
    user_id?: number;
    type: string;
    full_address: string;
    block_no: string | null;
    street?: string | null;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Service {
    id: number;
    title: string;
    slug: string;
    image: string;
    description: string; // Added description property
}

export interface Subcategory {
    id: number;
    title: string;
    slug: string;
    image: string;
    services: Service[];
    services_titles: string[];
}

export interface SessionPayload {
    cat_id?: number;
    sub_category_id?: number;
    booked_services?: number[];
    booked_services_title?: string[];
    service_tier_id?: number;
    schedule_time?: string;
    zipcode?: string;
    location?: string;
    latLng?: { lat: number; lng: number } | null;
    sub_category?: string;
    selectedServiceType?: string;
    selected_provider_id?: string;
    // Expiration metadata (added by sessionDataManager)
    _createdAt?: number;
    _expiresAt?: number;
}
