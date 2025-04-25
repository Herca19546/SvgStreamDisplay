import React from "react";
import { cn } from "@/lib/utils";
import { type ConnectionStatusType } from "@/pages/Home";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'connected':
        return 'bg-success';
      case 'disconnected':
        return 'bg-error';
      case 'waiting':
      default:
        return 'bg-warning';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'waiting':
      default:
        return 'Waiting for connection...';
    }
  };

  return (
    <div className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
      <span 
        className={cn(
          "w-2 h-2 rounded-full mr-2",
          getStatusClasses()
        )}
      ></span>
      <span>{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;
