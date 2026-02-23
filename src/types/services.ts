export interface ServiceSubcategory {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  image: string;
  description: string | null;
  display_order: number;
  status: string;
  seo_title: string;
  seo_description: string | null;
  seo_keywords: string | null;
  updated_by: number;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: number;
  title: string;
  slug: string;
  image?: string; // Make image optional
  description: string;
  color?: string; // Make color optional
  seo_title: string;
  seo_description: string;
  seo_keywords: string | null;
  status: string;
  display_order: number;
  updated_by: number;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  subcategories: ServiceSubcategory[];
}

export interface ServicesApiResponse {
  success: boolean;
  data: {
    page: string;
    seo_title: string;
    seo_desc: string;
    menu: string;
    categories: ServiceCategory[];
  };
}
