import React from 'react';
import DataCleaning from './Cleaning'; // Import Cleaning page as default

// Default export for the /data route, currently showing data cleaning
const DataProcessing: React.FC = () => {
  return <DataCleaning />;
};

export default DataProcessing; 