import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import React from "react";
import { Provider, useSelector } from 'react-redux';
import store from '@/store';

// Define RootState type based on your store's state shape
import type { RootState } from '@/store';

function RequireAuth({ children }: { children: JSX.Element }) {
  // Redux token kontrolü
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
}
import Todos from "./pages/Todos";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/todos" element={<RequireAuth><Todos /></RequireAuth>} />
            <Route path="/notes" element={<RequireAuth><Notes /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
