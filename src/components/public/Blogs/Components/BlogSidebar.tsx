import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Blog, Category } from './types';
import { useBlogSearch } from '../../../../hooks/useBlogSearch';
import BackendImage from '../../../common/BackendImage/BackendImage';
import imageFailedToLoad from '../../../../assets/Icon/image-failed-to-load.png';

interface BlogSidebarProps {
  latestBlogs?: Blog[];
  tags?: string[];
  categories?: Category[];
  formatDate: (date: string) => string;
  onBlogClick: (slug: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  latestBlogs = [],
  tags = [],
  categories = [],
  formatDate,
  onBlogClick
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const { searchResults, isSearching, searchBlogs, clearSearch } = useBlogSearch();

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput.trim()) {
        searchBlogs(searchInput);
        setShowSuggestions(true);
      } else {
        clearSearch();
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchBlogs, clearSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchBlogs(searchInput);
      setShowSuggestions(true);
    }
  };

  return (
    <aside className="col-lg-4 col-xl-3 col-xxl-2 sidebar mt-5 mt-lg-0 p-3" data-cues="slideInUp" data-duration={600} data-disabled="true">

      <div className="widget" data-cues="slideInUp" data-duration={600} data-cue="slideInUp" data-disabled="true" data-show="true" style={{ animationName: 'slideInUp', animationDuration: '600ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <form ref={searchRef} className="search-form" method="GET" action="javascript:;" autoComplete="off" data-cue="slideInUp" data-duration={600} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '600ms', animationTimingFunction: 'ease', animationDelay: '200ms', animationDirection: 'normal', animationFillMode: 'both' }} onSubmit={handleSearchSubmit}>
          <div className="form-floating mb-0">
            <input
              id="search-form"
              type="text"
              name="search"
              className="form-control"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <label htmlFor="search-form">Search</label>
          </div>
          {showSuggestions && searchInput.trim() && (
            <div id="suggestions-list" className="suggestions-list" style={{ display: 'block', position: 'relative', zIndex: 1000, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {isSearching ? (
                <div className="suggestion-item">
                  <span className="text-muted">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((blog, index) => (
                  <div key={blog.id} className="suggestion-item" data-index={index}>
                    <Link 
                      to={`/blog/${blog.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onBlogClick(blog.slug);
                        setShowSuggestions(false);
                        setSearchInput('');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {blog.title}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="suggestion-item">
                  <span className="text-muted">No results found</span>
                </div>
              )}
            </div>
          )}

        </form>
      </div>


      {/* Recent Posts Widget */}
      <div className="widget" data-cue="slideInUp" data-duration={600} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '600ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <h4 className="widget-title mb-3">Recent Posts</h4>
        <ul className="image-list">
          {latestBlogs.slice(0, 3).map((blog) => (
            <li key={blog.id}>
              <figure className="rounded">
                <a onClick={() => onBlogClick(blog.slug)} style={{ cursor: 'pointer' }}>
                  <BackendImage
                    src={blog.image}
                    alt={blog.title}
                    className="w-100 h-100 object-fit-cover rounded"
                    placeholderText=""
                    placeholderImage={imageFailedToLoad}
                  />
                </a>
              </figure>
              <div className="post-content">
                <p className="mb-1 fs-14 fw-medium">
                  <a
                    className="link-dark"
                    onClick={() => onBlogClick(blog.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    {blog.title}
                  </a>
                </p>
                <ul className="post-meta">
                  <li className="post-date">
                    <i className="uil uil-calendar-alt" />
                    <span className="fs-12">{formatDate(blog.date)}</span>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="widget" data-cue="slideInUp" data-duration={600} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '600ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
          <h4 className="widget-title mb-3">Categories</h4>
          <ul className="unordered-list bullet-primary text-reset">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/blogs/${category.slug}`}>
                  {category.title} ({category.blogs_count})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags Widget */}
      <div className="widget" data-cue="slideInUp" data-duration={600} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '600ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <h4 className="widget-title mb-3">Tags</h4>
        <ul className="list-unstyled tag-list">
          {tags.map((tag, index) => (
            <li key={index}>
              <Link
                to={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="btn btn-soft-ash btn-sm rounded-pill"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default BlogSidebar;
