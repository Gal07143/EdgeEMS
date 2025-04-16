import React from 'react';
import MeterReadings from './MeterReadings'; // Import existing Readings page as default

// Default export for the /meters route, currently showing readings
const MeterManagement: React.FC = () => {
  return <MeterReadings />;
};

export default MeterManagement; 