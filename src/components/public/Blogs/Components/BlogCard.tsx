import React from 'react';
import type { Blog } from './types';
import BackendImage from '../../../../components/common/BackendImage/BackendImage';
import { stripHtml } from '../../../../utils/htmlUtils';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  blog: Blog;
  index: number;
  onBlogClick: (slug: string) => void;
  formatDate: (date: string) => string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  index,
  onBlogClick,
  formatDate,
}) => {
  return (
    <article 
      className="post" 
      data-cue="slideInUp" 
      data-duration={600} 
      data-show="true" 
      style={{ 
        animationName: 'slideInUp', 
        animationDuration: '600ms', 
        animationTimingFunction: 'ease', 
        animationDelay: `${index * 200}ms`, 
        animationDirection: 'normal', 
        animationFillMode: 'both' 
      }}
    >
      <div className="card">
        <figure className="card-img-top overlay overlay-1 hover-scale">
          <a onClick={() => onBlogClick(blog.slug)}>
            <BackendImage
              src={blog.image}
              alt={blog.title}
              className={styles.cardImgTop}
              placeholderText="No Image"
            />
            <span className="bg" />
          </a>
          <figcaption>
            <h5 className="from-top mb-0">Read More</h5>
          </figcaption>
        </figure>
        <div className="card-body p-3">
          <div className="post-header">
            <h5 className="post-title mb-0">
              <a 
                className="link-dark" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onBlogClick(blog.slug);
                }}
              >
                {blog.title}
              </a>
            </h5>
          </div>
          <div className="post-content">
            <p>{stripHtml(blog.description)}</p>
          </div>
          <div className="text-end mt-3">
            <button 
              className="btn btn-sm btn-outline-primary rounded-pill"
              onClick={() => onBlogClick(blog.slug)}
            >
              Read More
            </button>
          </div>
        </div>
        <div className="card-footer p-3">
          <ul className="post-meta d-flex mb-0">
            <li className="post-date">
              <i className="uil uil-calendar-alt" />
              <span>{formatDate(blog.date)}</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
