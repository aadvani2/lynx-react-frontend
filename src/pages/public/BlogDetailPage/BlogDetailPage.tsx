// src/pages/blogs/BlogDetailPage.tsx
import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { servicesService } from "../../../services/generalServices/servicesService";
import { useServices } from "../../../hooks/useServices";
import { getBackendImageUrl } from "../../../utils/urlUtils";
import { useBlogDetailStore } from "../../../store/blogDetailStore";
import BlogHeader from "../../../components/public/BlogDetails/BlogHeader";
import BlogContent from "../../../components/public/BlogDetails/BlogContent";
import RelatedBlogs from "../../../components/public/BlogDetails/RelatedBlogs";
import BackendImage from "../../../components/common/BackendImage/BackendImage";
import styles from './BlogDetailPage.module.css';

import type { BlogDetailResponse } from "../../../store/blogDetailStore";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { categories } = useServices(); // Get service categories for blog categories

  // Store state and actions
  const {
    blog,
    relatedBlogs,
    shareOpen,
    setBlog,
    setRelatedBlogs,
    setShareOpen,
    getTags,
    reset
  } = useBlogDetailStore();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        return;
      }
      try {
        // New API response structure
        const response: BlogDetailResponse = await servicesService.getBlogBySlug(slug);
        
        if (response && response.status === "1" && response.result) {
          setBlog(response.result);
          setRelatedBlogs(response.related_blogs || []);
        } else {
          setBlog(null);
          setRelatedBlogs([]);
        }
      } catch (e) {
        console.error("Blog load error:", e);
        setBlog(null);
        setRelatedBlogs([]);
      }
    };
    fetchBlog();
  }, [slug, setBlog, setRelatedBlogs]);

  // Reset store when component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Get computed values from store
  const tags = getTags();

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : `Category #${categoryId}`;
  };

  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : "";

  const onShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.seo_description || blog.title,
          url: currentUrl,
        });
      } catch {
        /* ignore */
      }
    } else {
      setShareOpen(!shareOpen);
    }
  };

  // Get image URL for SEO meta tags
  const img = blog?.image ? getBackendImageUrl(blog.image) : '';

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>{blog ? (blog.seo_title || blog.title) : 'Blog Not Found'} - Lynx</title>
        <meta name="description" content={blog ? (blog.seo_description || blog.title) : 'Blog not found'} />
        <meta name="keywords" content={blog ? (blog.seo_keywords || blog.tags) : ''} />
        <meta property="og:title" content={blog ? (blog.seo_title || blog.title) : 'Blog Not Found'} />
        <meta property="og:description" content={blog ? (blog.seo_description || blog.title) : 'Blog not found'} />
        <meta property="og:image" content={img} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog ? (blog.seo_title || blog.title) : 'Blog Not Found'} />
        <meta name="twitter:description" content={blog ? (blog.seo_description || blog.title) : 'Blog not found'} />
        <meta name="twitter:image" content={img} />
      </head>

      {/* Header Section - Always Shows */}
      <BlogHeader title={blog ? blog.title : 'Blog Not Found'} />

      <section className="wrapper bg-light">
        <div className="container pt-6 pb-10">

          <div className="row gx-md-5 gy-5">
            <div className="col-lg-12">
              <div className="blog single">
                {!blog ? (
                  <div className="card-body">
                    <div className="classic-view position-relative" style={{ zIndex: 20 }}>
                      <article className="post">
                        <div className="mb-5">
                          <h2 className="h1 mb-4">We couldn't find the blog post you're looking for.</h2>
                          <p className="lead mb-4">The blog post may have been moved, deleted, or the URL might be incorrect.</p>
                          <Link to="/blogs" className="btn btn-primary">
                            <i className="uil uil-arrow-left me-2"></i>
                            Back to All Blogs
                          </Link>
                        </div>
                      </article>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hero Image Section */}
                    <div className="row">
                      <div className="col-xxl-9 mx-auto">
                        <figure 
                          className={`card-img rounded mb-md-0 mb-5 position-relative overflow-hidden ${styles.blogHeroImage}`}
                        >
                          <BackendImage
                            src={blog?.image}
                            alt={blog?.title || 'Blog image'}
                            className="w-100 h-100 object-fit-cover"
                            placeholderText="No Image"
                            loading="eager"
                            fetchPriority="high"
                          />
                        </figure>
                      </div>
                    </div>

                    <div className="card-body">    {/* Main Content Section */}
                      <BlogContent
                        title={blog.title}
                        date={blog.date}
                        categoryId={blog.category_id}
                        description={blog.description}
                        tags={tags}
                        shareOpen={shareOpen}
                        currentUrl={currentUrl}
                        onShare={onShare}
                        onShareClose={() => setShareOpen(false)}
                        getCategoryName={getCategoryName}
                        formatDate={formatDate}
                      />

                      {/* Related Blogs Section */}
                      <RelatedBlogs
                        blogs={relatedBlogs}
                        getCategoryName={getCategoryName}
                        formatDate={formatDate}
                      />
                    </div>

                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailPage;
