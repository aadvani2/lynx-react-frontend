export interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    dial_code: string;
    country_code: string;
    phone2: string;
    dial_code2: string;
    country_code2: string;
    image: string;
    description: string;
    birth_date: string;
    avg_rating: number;
    status: string;
    availability: number;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    dial_code: string;
    country_code: string;
}

export interface Category {
    id: number;
    title: string;
    slug: string;
    image?: string;
    description?: string;
    color?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
}

export interface Request {
    service_tier_tag: string;
    provider: Member;
    services_name: string;
    id: number;
    request_id: number;
    status: string;
    duration: number;
    customer: Customer;
    member: Member;
    category: Category;
    description: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    contact_person: string;
    phone: string;
    dial_code: string;
    country_code: string;
    created_at: string;
    updated_at: string;
    files?: string; // Add files property
}

export interface RequestDetailsResponse {
    success: boolean;
    request_status: string;
    data: {
        request: Request;
        type: string;
        currentPage: number;
        request_duration: string;
        user_timezone: number;
        status_icon: string;
        message: string;
        cancel_alert_message: string;
        channel_name: string;
        buttons: string[];
        hold_req_msg: string;
    };
}
