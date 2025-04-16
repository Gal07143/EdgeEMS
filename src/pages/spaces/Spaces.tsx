import React from 'react';
import SpaceEfficiency from './SpaceEfficiency'; // Import existing Efficiency page as default

// Default export for the /spaces route, currently showing efficiency
const SpaceManagement: React.FC = () => {
  return <SpaceEfficiency />;
};

export default SpaceManagement; 