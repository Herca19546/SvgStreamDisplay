import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/ui/code-block";

interface ApiInfoPanelProps {
  onCopyEndpoint: () => void;
}

const ApiInfoPanel: React.FC<ApiInfoPanelProps> = ({ onCopyEndpoint }) => {
  const exampleSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red"/>
</svg>`;

  const handleCopyEndpoint = () => {
    const endpointUrl = `${window.location.origin}/api/svg`;
    navigator.clipboard.writeText(endpointUrl)
      .then(onCopyEndpoint)
      .catch(error => console.error("Failed to copy endpoint:", error));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900 flex items-center">
        <i className="fas fa-code text-primary mr-2"></i>
        API Information
      </h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Endpoint URL</h3>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              POST
            </span>
            <Input 
              type="text" 
              readOnly 
              value="/api/svg" 
              className="rounded-r-md bg-gray-50" 
            />
            <Button 
              className="ml-2 bg-primary hover:bg-indigo-600" 
              size="sm" 
              onClick={handleCopyEndpoint}
            >
              <i className="fas fa-copy"></i>
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Content Type</h3>
          <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">application/svg+xml</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Example Payload</h3>
          <CodeBlock>{exampleSvg}</CodeBlock>
        </div>
      </div>
    </div>
  );
};

export default ApiInfoPanel;
