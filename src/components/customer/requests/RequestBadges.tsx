import React, { useMemo } from 'react';
import type { RequestCounts } from '../../../store/requestsStore';

interface RequestBadgesProps {
  selectedFilter: string;
  requestCounts: RequestCounts;
  onFilterClick: (status: string) => void;
}

const RequestBadges: React.FC<RequestBadgesProps> = ({
  selectedFilter,
  requestCounts,
  onFilterClick
}) => {
  const getFilterButtonClass = (status: string) => {
    const statusClass =
      {
        accepted: 'bg-accepted-request',
        'on hold': 'bg-activecommunication-request',
        'in process': 'bg-process-request',
        completed: 'bg-completed-request',
        cancelled: 'bg-cancelled-request',
        pending: 'bg-pending-request',
        all: 'btn-soft-ash',
      }[status] || 'btn-soft-ash';

    return `btn rounded-pill btn-sm filter-btn ${statusClass} ${status === selectedFilter ? 'border-primary' : ''
      }`.trim();
  };


  // Calculate total count as sum of all individual status counts
  const totalCount = useMemo(() => {
    return (
      (requestCounts.accepted || 0) +
      (requestCounts['on hold'] || 0) +
      (requestCounts['in process'] || 0) +
      (requestCounts.completed || 0) +
      (requestCounts.cancelled || 0) +
      (requestCounts.pending || 0)
    );
  }, [requestCounts]);

  const badges = [
    { key: 'all', label: 'All', count: requestCounts.all || totalCount },
    { key: 'accepted', label: 'Accepted', count: requestCounts.accepted || 0 },
    { key: 'on hold', label: 'Active Communication', count: requestCounts['on hold'] || 0 },
    { key: 'in process', label: 'In-Process', count: requestCounts['in process'] || 0 },
    { key: 'completed', label: 'Completed', count: requestCounts.completed || 0 },
    { key: 'cancelled', label: 'Cancelled', count: requestCounts.cancelled || 0 },
    { key: 'pending', label: 'Pending', count: requestCounts.pending || 0 }
  ];

  return (
    <div className="filter-button-wrap-main overflow-hidden">
      <div className="filter-button-wrap d-flex gap-2 overflow-x-auto w-100">
        {badges.map(({ key, label, count }) => (
          <div key={key} className="filter-button-box">
            <button
              type="button"
              className={getFilterButtonClass(key)}
              onClick={() => onFilterClick(key)}
            >
              {label} ({count})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestBadges; 