import React from 'react';
import SystemDocs from './System'; // Import System Docs page as default

// Default export for the /knowledge route, currently showing system docs
const KnowledgeBase: React.FC = () => {
  return <SystemDocs />;
};

export default KnowledgeBase; 