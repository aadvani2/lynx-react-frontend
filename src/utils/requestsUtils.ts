import type { RequestItem } from '../store/requestsStore';

interface RequestsResponseShape {
  requests?: RequestItem[];
  title?: string;
  current_page?: number;
  total?: number;
  per_page?: number;
  last_page?: number;
  type?: string;
  user_timezone?: number;
  data?: RequestsResponseShape | RequestItem[];
}

export function extractRequestsData(raw: unknown): {
  list: RequestItem[];
  meta: {
    title?: string;
    currentPage: number;
    total: number;
    perPage: number;
    lastPage: number
  }
} {
  const defaults = { title: undefined, currentPage: 1, total: 0, perPage: 10, lastPage: 1 } as const;

  if (typeof raw !== 'object' || raw === null) {
    return { list: [], meta: defaults };
  }

  const top = raw as RequestsResponseShape;
  const container: RequestsResponseShape = Array.isArray(top.data)
    ? { requests: top.data }
    : (top.data && typeof top.data === 'object' ? (top.data as RequestsResponseShape) : top);

  const list = Array.isArray(container.requests)
    ? container.requests
    : Array.isArray(container.data)
      ? (container.data as RequestItem[])
      : [];

  const meta = {
    title: container.title,
    currentPage: typeof container.current_page === 'number' ? container.current_page : defaults.currentPage,
    total: typeof container.total === 'number' ? container.total : (Array.isArray(list) ? list.length : defaults.total),
    perPage: typeof container.per_page === 'number' ? container.per_page : defaults.perPage,
    lastPage: typeof container.last_page === 'number' ? container.last_page : defaults.lastPage,
  };

  return { list: Array.isArray(list) ? list : [], meta };
}

export const getRequestTypeTitle = (type: string) => {
  switch (type) {
    case 'pending':
      return 'Pending Requests';
    case 'on hold':
      return 'Active Communication Requests';
    case 'accepted':
      return 'Accepted Requests';
    case 'in process':
      return 'In-Progress Requests';
    case 'completed':
      return 'Completed Requests';
    case 'cancelled':
      return 'Cancelled Requests';
    default:
      return 'My Requests';
  }
};

export const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'badge rounded-pill bg-pending-request text-primary text-uppercase px-3 py-2';
    case 'accepted':
      return 'badge rounded-pill bg-accepted-request text-primary text-uppercase px-3 py-2';
    case 'in process':
      return 'badge rounded-pill bg-process-request text-primary text-uppercase px-3 py-2';
    case 'completed':
      return 'badge rounded-pill bg-completed-request text-primary text-uppercase px-3 py-2';
    case 'cancelled':
      return 'badge rounded-pill bg-cancelled-request text-primary text-uppercase px-3 py-2';
    case 'on hold':
      return 'badge rounded-pill bg-activecommunication-request text-primary text-uppercase px-3 py-2';
    default:
      return 'badge rounded-pill bg-secondary text-white text-uppercase px-3 py-2';
  }
};

export const getServiceName = (category: string) => {
  if (!category || typeof category !== 'string') {
    return 'Unknown Service';
  }
  switch (category.toLowerCase()) {
    case 'indoor':
      return 'Washer';
    case 'exterior':
      return 'Exterior Service';
    case 'lawn-garden':
      return 'Lawn & Garden Service';
    case 'premium':
      return 'Premium Service';
    default:
      return category;
  }
};

export const getAddress = (fullAddress: string) => {
  // Extracting the city, state, and zip from the address (if you need that)
  // You can customize this further if necessary
  const regex = /,\s*([^,]+,\s*[^,]+,\s*\d{5})/;  // Matches city, state, and zip
  const match = fullAddress.match(regex);

  if (match) {
    return match[1];  // Returns 'Dallas, TX 75201'
  }
  
  return fullAddress;  // Fallback if the pattern isn't matched
};