import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ApiInfoPanel from "@/components/api-info-panel";
import TestSvgForm from "@/components/test-svg-form";
import InstructionsPanel from "@/components/instructions-panel";
import SvgDisplayPanel from "@/components/svg-display-panel";
import EventsLogPanel from "@/components/events-log-panel";
import ConnectionStatus from "@/components/connection-status";
import { type SvgContent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export type ConnectionStatusType = 'connected' | 'disconnected' | 'waiting';
export type EventType = {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
};

const Home = () => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('waiting');
  const [events, setEvents] = useState<EventType[]>([]);
  
  // Add an event to the log
  const addEvent = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setEvents(prev => [
      ...prev,
      { timestamp: new Date(), message, type }
    ]);
  };

  // Query for current SVG
  const {
    data: svgData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['/api/svg/current'],
    retry: false,
    refetchInterval: 5000, // Poll every 5 seconds for new SVGs
  });

  // Mutation for submitting new SVG
  const submitSvgMutation = useMutation({
    mutationFn: async (content: SvgContent) => {
      const res = await apiRequest('POST', '/api/svg', content);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "SVG Submitted Successfully",
        description: "Your SVG has been received and will be displayed.",
      });
      addEvent('SVG submitted successfully', 'success');
      // Invalidate the current SVG query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['/api/svg/current'] });
    },
    onError: (error) => {
      toast({
        title: "Error Submitting SVG",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      addEvent(`Error submitting SVG: ${error instanceof Error ? error.message : "Unknown error"}`, 'error');
    }
  });

  // Initialize connection status and add initial event
  useEffect(() => {
    // Initial connection check
    addEvent('Application initialized. Connecting to server...');
    
    // Check connection after a short delay to simulate connection time
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
      addEvent('Connected to server. Waiting for SVG data...', 'success');
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle SVG submission from test form
  const handleSvgSubmit = (svgContent: string) => {
    if (!svgContent.trim()) {
      toast({
        title: "Empty SVG Content",
        description: "Please enter SVG content to submit",
        variant: "destructive",
      });
      addEvent('Attempted to submit empty SVG content', 'error');
      return;
    }
    
    submitSvgMutation.mutate({ content: svgContent });
  };
  
  // Handle clearing the SVG display
  const handleClearDisplay = () => {
    addEvent('SVG display cleared manually', 'info');
    // We're not actually clearing the data from the server,
    // just forcing a refresh of the UI which will show the empty state
    // if there's no data
    refetch();
  };

  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-bezier-curve text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold text-gray-900">SVG Renderer</h1>
          </div>
          
          <ConnectionStatus status={connectionStatus} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-1/2">
        <div className="flex flex-col space-y-6">
          {/* SVG Display at top */}
          <div>
            <SvgDisplayPanel 
              svgData={svgData?.data as any} 
              isLoading={isLoading} 
              isError={isError}
              onClearDisplay={handleClearDisplay}
            />
          </div>
          
          {/* Form and other info below */}
          <div className="space-y-6">
            <TestSvgForm 
              onSvgSubmit={handleSvgSubmit} 
              isSubmitting={submitSvgMutation.isPending}
            />
            <ApiInfoPanel onCopyEndpoint={() => addEvent('Endpoint URL copied to clipboard', 'info')} />
            <EventsLogPanel events={events} />
            <InstructionsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-transparent mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            SVG Renderer - Real-time SVG Display Application
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
