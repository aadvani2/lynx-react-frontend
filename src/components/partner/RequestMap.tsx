import React from 'react';

interface RequestMapProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const RequestMap: React.FC<RequestMapProps> = ({ address, city, state, zipCode }) => {
  // Construct full address for map embedding
  const fullAddress = encodeURIComponent(`${address}, ${city}, ${state}, ${zipCode}`);
  // Google Maps Embed API (no API key required for basic embed)
  const mapSrc = `https://www.google.com/maps?q=${fullAddress}&output=embed`;

  return (
    <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <iframe
        title="Request Location Map"
        src={mapSrc}
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default RequestMap;
