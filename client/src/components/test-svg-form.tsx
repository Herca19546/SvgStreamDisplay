import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TestSvgFormProps {
  onSvgSubmit: (svgContent: string) => void;
  isSubmitting: boolean;
}

const TestSvgForm: React.FC<TestSvgFormProps> = ({ onSvgSubmit, isSubmitting }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateSvg = (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setIsValid(null);
      return;
    }
    
    const isValidSvg = trimmedContent.startsWith('<svg') && 
                      trimmedContent.endsWith('</svg>');
    setIsValid(isValidSvg);
    return isValidSvg;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setSvgContent(newContent);
    validateSvg(newContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSvg(svgContent)) {
      onSvgSubmit(svgContent);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900 flex items-center">
        <i className="fas fa-flask text-primary mr-2"></i>
        Test SVG Submission
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="test-svg" className="text-sm font-medium text-gray-700">
              SVG Content
            </Label>
            <Textarea
              id="test-svg"
              rows={6}
              className={`mt-1 font-mono ${isValid === false ? 'border-red-500' : ''}`}
              placeholder="<svg>...</svg>"
              value={svgContent}
              onChange={handleContentChange}
            />
            {isValid === false && (
              <p className="mt-1 text-sm text-red-500">
                Invalid SVG format. Must start with &lt;svg and end with &lt;/svg&gt;
              </p>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-indigo-600"
            disabled={isSubmitting || !isValid}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {isSubmitting ? 'Sending...' : 'Send Test SVG'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestSvgForm;
