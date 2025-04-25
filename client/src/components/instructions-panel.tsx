import React from "react";

const InstructionsPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900 flex items-center">
        <i className="fas fa-info-circle text-primary mr-2"></i>
        How It Works
      </h2>
      
      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
        <li>Send SVG content to the endpoint using a POST request</li>
        <li>The server validates and processes the SVG</li>
        <li>The page automatically updates to display the received SVG</li>
        <li>All connections use proper content security policies</li>
      </ol>
      
      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mt-2">
        <p><strong>Note:</strong> This implementation is Cloudflare-friendly and handles SVG content safely.</p>
      </div>
    </div>
  );
};

export default InstructionsPanel;
