import React from 'react';
import { Link } from 'react-router-dom';
import BackendImage from '../../../components/common/BackendImage/BackendImage';
import styles from './RelatedBlogs.module.css';

interface RelatedBlog {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  date: string;
  category_id: number;
}

interface RelatedBlogsProps {
  blogs: RelatedBlog[];
  getCategoryName: (categoryId: number) => string;
  formatDate: (iso: string) => string;
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({
  blogs,
  getCategoryName,
  formatDate
}) => {
  if (blogs.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="mb-6 mt-12">You Might Also Like</h2>

      {/* No Swiper dependency: responsive grid with horizontal scroll on mobile */}
      <div
        className="grid-view mb-8"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "30px",
        }}
      >
        {blogs.map((blog) => {
          return (
            <article key={blog.id}>
              <figure className="overlay overlay-1 hover-scale rounded mb-5" style={{ overflow: "hidden" }}>
                <Link to={`/blogs/${blog.slug}`}>
                  <BackendImage
                    src={blog.image}
                    alt={blog.title}
                    className={styles.relatedBlogImage}
                    placeholderText="No Image"
                  />
                  <span className="bg"></span>
                </Link>
                <figcaption>
                  <h5 className="from-top mb-0">Read More</h5>
                </figcaption>
              </figure>

              <div className="post-header">
                <div className="post-category text-line">
                  <Link 
                    to={`/blogs?category=${blog.category_id}`}
                    className="hover"
                    rel="category"
                  >
                    {getCategoryName(blog.category_id)}
                  </Link>
                </div>
                {/* /.post-category */}
                <h3 className="post-title h3 mt-1 mb-3">
                  <Link className="link-dark" to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h3>
              </div>
              {/* /.post-header */}
              <div className="post-footer">
                <ul className="post-meta mb-0">
                  <li className="post-date">
                    <i className="uil uil-calendar-alt"></i>
                    <span>{formatDate(blog.date)}</span>
                  </li>
                </ul>
                {/* /.post-meta */}
              </div>
              {/* /.post-footer */}
            </article>
          );
        })}
      </div>
    </>
  );
};

export default RelatedBlogs;
