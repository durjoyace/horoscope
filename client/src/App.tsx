import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/context/LanguageContext";

// Create a simplified version for testing
function TestContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 text-black">
      <h1 className="text-3xl font-bold mb-4">HoroscopeHealth - Test Page</h1>
      <p className="text-xl mb-6">If you can see this, the application is rendering correctly.</p>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p>This is a simplified test page to troubleshoot rendering issues.</p>
      </div>
    </div>
  );
}

// Simplified App component for testing
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TestContent />
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;