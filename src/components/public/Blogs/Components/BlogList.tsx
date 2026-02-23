import React from 'react';
import BlogCard from './BlogCard';
import type { Blog } from './types';

interface BlogListProps {
  blogs: Blog[];
  onBlogClick: (slug: string) => void;
  formatDate: (date: string) => string;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBlogClick,
  formatDate,
}) => {
  return (
    <div className="blog classic-view blog-page-post-list" data-cues="slideInUp" data-duration={600} data-disabled="true">
      {blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            index={index}
            onBlogClick={onBlogClick}
            formatDate={formatDate}
          />
        ))
      ) : (
        <div className="text-center py-5">
          <p>No blogs found.</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
