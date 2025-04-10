
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScanProgress from "./pages/ScanProgress";
import Report from "./pages/Report";
import Stats from "./pages/Stats";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                
                <Route path="/scan/:scanId/progress" element={
                  <RequireAuth>
                    <ScanProgress />
                  </RequireAuth>
                } />
                
                <Route path="/reports/:reportId" element={
                  <RequireAuth>
                    <Report />
                  </RequireAuth>
                } />
                
                <Route path="/stats" element={
                  <RequireAuth>
                    <Stats />
                  </RequireAuth>
                } />
                
                <Route path="/admin" element={
                  <RequireAuth requiredRole="ADMIN">
                    <Admin />
                  </RequireAuth>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
