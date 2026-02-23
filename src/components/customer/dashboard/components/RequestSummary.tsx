import React from 'react';

interface DashboardCounts {
  pending: number;
  accepted: number;
  completed: number;
  in_process: number;
  onhold: number;
  cancelled: number;
}

interface RequestSummaryProps {
  counts: DashboardCounts | null;
  onRequestClick: (status: string) => void;
}

const RequestSummary: React.FC<RequestSummaryProps> = ({
  counts,
  onRequestClick
}) => {
  const requestItems = [
    {
      status: 'pending',
      icon: 'uil-stopwatch',
      label: 'Pending Requests',
      count: counts?.pending ?? 0
    },
    {
      status: 'on hold',
      icon: 'uil-clock',
      label: 'Active Communication Requests',
      count: counts?.onhold ?? 0
    },
    {
      status: 'accepted',
      icon: 'uil-check-circle',
      label: 'Accepted Requests',
      count: counts?.accepted ?? 0
    },
    {
      status: 'in process',
      icon: 'uil-chart-line',
      label: 'In-Progress Requests',
      count: counts?.in_process ?? 0
    },
    {
      status: 'completed',
      icon: 'uil-cloud-check',
      label: 'Completed Requests',
      count: counts?.completed ?? 0
    },
    {
      status: 'cancelled',
      icon: 'uil-plus-circle',
      label: 'Cancelled Requests',
      count: counts?.cancelled ?? 0,
      iconClass: 'rotate45'
    }
  ];

  return (
    <>
      <h6>Request Summary</h6>
      <ul className="my-account-menu two-columns row-gap-2">
        {requestItems.map((item) => (
          <li key={item.status} className="mb-0">
            <a href="javascript:;" onClick={() => onRequestClick(item.status)}>
              <span className="icon">
                <i className={`${item.icon} ${item.iconClass || ''}`} />
              </span>
              <span className="text">{item.label} ({item.count})</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RequestSummary;
