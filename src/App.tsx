import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import Statistics from "./pages/Statistics";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ajouter" element={<AddEntry />} />
          <Route path="/statistiques" element={<Statistics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/historique" element={<History />} />
          <Route path="/objectifs" element={<Goals />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
