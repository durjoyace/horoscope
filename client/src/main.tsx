import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";

// Main entry point for the application
createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </UserProvider>
);
