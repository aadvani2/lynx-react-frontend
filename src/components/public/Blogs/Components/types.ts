// Blog interface matching the new API response
export interface Blog {
  id: number;
  title: string;
  slug: string;
  likes: number;
  category_id: number;
  description: string;
  image: string | null;
  date: string;
  tags: string;
  seo_title: string;
  seo_description: string | null;
  seo_keywords: string | null;
  status: string;
  updated_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Category interface matching the API response
export interface Category {
  id: number;
  title: string;
  slug: string;
  blogs_count: number;
}
