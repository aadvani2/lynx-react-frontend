import React from 'react';

interface FreeServiceCardProps {
  used?: number;
  total?: number;
  onViewDetails?: () => void;
}

const FreeServiceCard: React.FC<FreeServiceCardProps> = ({
  used = 2,
  total = 2,
  onViewDetails
}) => {
  return (
    <ul className="my-account-menu tree-columns free-service-list-customer more-options">
      <li className="bg-pale-aqua">
        <a 
          href="javascript:;" 
          onClick={onViewDetails}
          style={{ cursor: onViewDetails ? 'pointer' : 'default' }}
        >
          <span className="icon"><i className="uil uil-gift" /></span>
          <span className="text">Available Free Emergency Service (Per Year): {used}/{total}</span>
        </a>
      </li>
    </ul>
  );
};

export default FreeServiceCard;
