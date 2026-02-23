import React from 'react';
import { Link } from 'react-router-dom';

interface BlogContentProps {
  title: string;
  date: string;
  categoryId?: number;
  description: string;
  tags: string[];
  shareOpen: boolean;
  currentUrl: string;
  onShare: () => void;
  onShareClose: () => void;
  getCategoryName: (categoryId: number) => string;
  formatDate: (iso: string) => string;
}

const BlogContent: React.FC<BlogContentProps> = ({
  title,
  date,
  categoryId,
  description,
  tags,
  shareOpen,
  currentUrl,
  onShare,
  onShareClose,
  getCategoryName,
  formatDate
}) => {
  return (

    <div className="classic-view position-relative" style={{ zIndex: 20 }}>
      <article className="post">
        <div className="mb-5">
          {/* Title */}
          <h2 className="h1 mb-4">{title}</h2>

          {/* Meta */}
          <ul className="list-unstyled d-flex gap-3 text-muted mb-4">
            <li className="post-date">
              <i className="uil uil-calendar-alt"></i>{" "}
              <span>{formatDate(date)}</span>
            </li>
            {typeof categoryId === "number" && (
              <li>
                <i className="uil uil-tag"></i>{" "}
                <span>{getCategoryName(categoryId)}</span>
              </li>
            )}
          </ul>

          {/* Content (HTML) */}
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Footer: tags + share */}
          <div className="post-footer d-md-flex flex-md-row justify-content-md-between align-items-center mt-4">
            {/* Tags */}
            <div>
              <ul className="list-unstyled tag-list mb-0 d-flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t}>
                    <Link
                      to={`/blogs?tag=${encodeURIComponent(t)}`}
                      className="btn btn-soft-ash btn-sm rounded-pill mb-0"
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share */}
            <div className="mb-0 mb-md-2 position-relative">
              <div className="btn-group">
                <button
                  onClick={onShare}
                  className="btn btn-sm btn-red rounded-pill btn-icon btn-icon-start mb-0 me-0"
                  aria-expanded={shareOpen}
                >
                  <i className="uil uil-share-alt"></i> Share
                </button>

                {/* Simple custom dropdown (no Bootstrap JS needed) */}
                {shareOpen && (
                  <div
                    className="dropdown-menu show"
                    style={{ position: "absolute", right: 0, top: "120%" }}
                    onMouseLeave={onShareClose}
                  >
                    <a
                      className="dropdown-item"
                      href={`mailto:?subject=${encodeURIComponent(
                        title
                      )}&body=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="uil uil-envelope"></i> Email
                    </a>
                    <a
                      className="dropdown-item"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        currentUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="uil uil-facebook-f"></i> Facebook
                    </a>
                    <a
                      className="dropdown-item"
                      href={`https://twitter.com/share?url=${encodeURIComponent(
                        currentUrl
                      )}&text=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="uil uil-twitter"></i> Twitter/X
                    </a>
                    <a
                      className="dropdown-item"
                      href={`https://www.instagram.com/`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={onShareClose}
                    >
                      <i className="uil uil-instagram"></i> Instagram
                    </a>
                    <a
                      className="dropdown-item"
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        currentUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="uil uil-linkedin"></i> LinkedIn
                    </a>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogContent;
