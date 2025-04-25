import React, { useEffect, useRef } from "react";
import { type EventType } from "@/pages/Home";
import { cn } from "@/lib/utils";

interface EventsLogPanelProps {
  events: EventType[];
}

const EventsLogPanel: React.FC<EventsLogPanelProps> = ({ events }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [events]);
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // Get message class based on type
  const getMessageClass = (type: 'info' | 'error' | 'success'): string => {
    switch(type) {
      case 'error':
        return 'text-error';
      case 'success':
        return 'text-success';
      case 'info':
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
        <i className="fas fa-history text-primary mr-2"></i>
        Events Log
      </h2>
      
      <div 
        ref={logContainerRef}
        className="max-h-[200px] overflow-y-auto text-sm font-mono bg-gray-50 p-3 rounded"
      >
        {events.length === 0 ? (
          <div className="py-1 text-gray-400">No events yet</div>
        ) : (
          events.map((event, index) => (
            <div key={index} className="py-1 border-b border-gray-100 flex">
              <span className="text-gray-400 mr-2 flex-shrink-0">
                [{formatTime(event.timestamp)}]
              </span>
              <span className={cn(getMessageClass(event.type))}>
                {event.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsLogPanel;
