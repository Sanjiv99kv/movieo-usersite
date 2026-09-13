import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { CinebookProvider } from "./store/CinebookProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root was not found in index.html");

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CinebookProvider>
            <App />
          </CinebookProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
