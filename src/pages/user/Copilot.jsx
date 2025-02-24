import React from 'react';
import { getUserId } from 'services/api';

const Copilot = () => {
  return (
    <div style={{ height: '92vh', width: '100%', padding: 0 }}>
      <iframe
        src={`https://honeycomb-pollinator.victoriousbush-67842c2f.eastus.azurecontainerapps.io?user_id=${getUserId()}`}
        // src={`http://localhost:3001?user_id=${getUserId()}`}
        style={{ border: 'none', height: '100%', width: '100%' }}
        title="Copilot Content"
      ></iframe>
    </div>
  );
};

export default Copilot;
