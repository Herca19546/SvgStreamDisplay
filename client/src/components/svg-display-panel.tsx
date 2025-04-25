import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { sanitizeSvg, extractSvgMetadata } from "@/lib/svg-utils";
import { type Svg } from "@shared/schema";

interface SvgDisplayPanelProps {
  svgData?: Svg;
  isLoading: boolean;
  isError: boolean;
  onClearDisplay: () => void;
}

const SvgDisplayPanel: React.FC<SvgDisplayPanelProps> = ({ 
  svgData, 
  isLoading, 
  isError,
  onClearDisplay 
}) => {
  const [sanitizedSvg, setSanitizedSvg] = useState<string>("");
  
  // When SVG data changes, sanitize it
  useEffect(() => {
    if (svgData?.content) {
      setSanitizedSvg(sanitizeSvg(svgData.content));
    } else {
      setSanitizedSvg("");
    }
  }, [svgData]);

  // Format the last update time
  const getLastUpdateText = (): string => {
    if (!svgData?.createdAt) return "Last update: Never";
    
    const createdDate = new Date(svgData.createdAt);
    return `Last update: ${formatDistanceToNow(createdDate, { addSuffix: true })}`;
  };

  // Get formatted dimensions
  const getDimensions = (): string => {
    if (!svgData) return "-";
    const { width, height } = svgData;
    
    if (width !== undefined && height !== undefined) {
      return `${width} × ${height}`;
    }
    return "auto";
  };
  
  // Get formatted size
  const getSize = (): string => {
    if (!svgData?.size) return "-";
    
    return svgData.size < 1024 
      ? `${svgData.size} bytes` 
      : `${(svgData.size / 1024).toFixed(1)} KB`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <i className="fas fa-eye text-primary mr-2"></i>
            SVG Display
          </h2>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-4 min-h-[400px] flex items-center justify-center">
          <Skeleton className="w-32 h-32 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <i className="fas fa-eye text-primary mr-2"></i>
          SVG Display
        </h2>
        
        <div className="flex space-x-2 items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <i className="fas fa-clock mr-1"></i>
            {getLastUpdateText()}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearDisplay}
            className="text-xs"
          >
            <i className="fas fa-trash-alt mr-1"></i>
            Clear
          </Button>
        </div>
      </div>
      
      {/* SVG Display Area */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg bg-transparent flex items-center justify-center p-4 min-h-[400px]">
        {sanitizedSvg ? (
          <div 
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
          />
        ) : (
          <div className="text-center py-12 px-4">
            <i className="fas fa-image text-gray-300 text-5xl mb-4"></i>
            <h3 className="text-sm font-medium text-gray-900">No SVG Received Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isError 
                ? "Error loading SVG. Please try again later." 
                : "Send an SVG to the API endpoint to see it displayed here"}
            </p>
          </div>
        )}
      </div>
      
      {/* SVG Metadata */}
      {svgData && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">SVG Metadata</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Dimensions</span>
              <span className="font-medium">{getDimensions()}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">File Size</span>
              <span className="font-medium">{getSize()}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Elements</span>
              <span className="font-medium">{svgData.elementCount || "-"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SvgDisplayPanel;
