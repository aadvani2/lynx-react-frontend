import React from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useBlogs } from '../../../hooks/useBlogs';
import {
  BlogList,
  BlogPagination,
  BlogSidebar,
  LoadingState,
  ErrorState
} from './Components';

const BlogsSection: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || undefined;

  // Priority: tag > category (slug)
  // If tag exists, use tag and ignore category (backward compatible)
  // Else if category exists, use it as slug
  // Else, no filter
  const slug = !tag && category ? category : undefined;

  const {
    blogs,
    latestBlogs,
    tags,
    categories,
    isLoading,
    error,
    formatDate,
  } = useBlogs(
    slug || tag
      ? { tag, slug }   // object mode, new behavior
      : undefined       // no filter → /blogs
  );

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        {/* Tag / Category Filter Indicator */}
        {(tag || slug) && (
          <div className="d-flex">
            <div className="card mr-auto bg-soft-primary mb-3" role="alert">
              <div className="card-body p-2 row" data-cues="slideInUp" data-duration="1200" data-disabled="true">
                <div className="col-md-12" data-cue="slideInUp" data-duration="1200" data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  {tag
                    ? <>Showing results for #{tag}.</>
                    : <>Showing results for {slug}.</>
                  }
                  <Link to="/blogs" className="underline-2 ms-3">Clear</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-8 col-xl-9 col-xxl-10 text-start">
            <BlogList
              blogs={blogs}
              onBlogClick={handleBlogClick}
              formatDate={formatDate}
            />
            <BlogPagination />
          </div>
          <BlogSidebar
            latestBlogs={latestBlogs}
            tags={tags}
            categories={categories}
            formatDate={formatDate}
            onBlogClick={handleBlogClick}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
