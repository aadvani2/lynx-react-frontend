import React from 'react';

interface LastUpdatedTextProps {
  text: string;
}

const LastUpdatedText: React.FC<LastUpdatedTextProps> = ({ text }) => {
  return (
    <div className="text-end text-muted mt-2 fs-sm" style={{ fontSize: '0.9em' }}>
      Last updated on {text}
    </div>
  );
};

export default LastUpdatedText;
