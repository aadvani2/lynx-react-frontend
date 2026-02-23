import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ApiBlogItem {
  id: number;
  title: string;
  slug: string;
  likes: number;
  category_id: number;
  description: string; // HTML
  image: string | null; // maybe relative path
  date: string;        // "YYYY-MM-DD"
  tags: string;        // "a,b,c"
  seo_title: string;
  seo_description: string | null;
  seo_keywords: string | null;
  status: string;
  updated_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// New API response structure for blog detail
export interface BlogDetailResponse {
  status: string;
  message: string;
  result: ApiBlogItem;
  related_blogs: ApiBlogItem[];
}

interface BlogDetailState {
  // Data
  blog: ApiBlogItem | null;
  relatedBlogs: ApiBlogItem[];
  
  // UI State
  shareOpen: boolean;
  imageError: boolean;
  imageLoading: boolean;
  
  // Actions
  setBlog: (blog: ApiBlogItem | null) => void;
  setRelatedBlogs: (blogs: ApiBlogItem[]) => void;
  setShareOpen: (open: boolean) => void;
  setImageError: (error: boolean) => void;
  setImageLoading: (loading: boolean) => void;
  
  // Computed values
  getTags: () => string[];
  
  // Reset
  reset: () => void;
}

const initialState = {
  blog: null,
  relatedBlogs: [],
  shareOpen: false,
  imageError: false,
  imageLoading: true,
};

export const useBlogDetailStore = create<BlogDetailState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setBlog: (blog) => set({ blog }),
      setRelatedBlogs: (relatedBlogs) => set({ relatedBlogs }),
      setShareOpen: (shareOpen) => set({ shareOpen }),
      setImageError: (imageError) => set({ imageError }),
      setImageLoading: (imageLoading) => set({ imageLoading }),

      // Computed values
      getTags: () => {
        const { blog } = get();
        return blog?.tags ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      },

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'blog-detail-store',
    }
  )
);
