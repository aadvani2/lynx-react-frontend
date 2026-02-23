import React from 'react';
import type { NotificationItem } from '../../../../types/notifications';

type Props = {
  item: NotificationItem;
  onOpen: () => void;
};

const NotificationCard: React.FC<Props> = ({
  item,
  onOpen
}) => {
  const notificationMessage = item.message;
  const notificationTimestamp = item.created_at
    ? new Date(item.created_at).toLocaleString()
    : 'N/A';

  return (
    <div className="col-12 col-md-12 col-lg-12 col-xl-6 row mx-0" key={item.id}>
      <a className="card lift requestItem notification-list w-100 px-0" onClick={onOpen} role="button" tabIndex={0}>
        <div className="card-body p-3">
          <p className="mb-1">{notificationMessage}</p>
          <p className="fs-sm text-secondary mb-0">{notificationTimestamp}</p>
        </div>
      </a>
    </div>
  );
};

export default NotificationCard;
