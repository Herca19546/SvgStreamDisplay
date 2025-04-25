import React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  return (
    <pre className={cn(
      "mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded overflow-x-auto",
      className
    )}>
      <code>{children}</code>
    </pre>
  );
};

export default CodeBlock;
