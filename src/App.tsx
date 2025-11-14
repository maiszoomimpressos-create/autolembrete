import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import DashboardPage from "./pages/DashboardPage";
import MaintenancePage from "./pages/MaintenancePage";
import FuelingPage from "./pages/FuelingPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import MasterAdminPage from "./pages/MasterAdminPage";
import AlertsPage from "./pages/AlertsPage"; // Novo Import
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import ThemeProvider from "./components/ThemeProvider";
import SessionContextProvider from "./components/SessionContextProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SessionContextProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota de Login/Index sem o layout principal */}
              <Route path="/" element={<IndexPage />} />
              
              {/* Rotas protegidas/com layout */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="maintenance" element={<MaintenancePage />} />
                  <Route path="fueling" element={<FuelingPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="alerts" element={<AlertsPage />} /> {/* Nova Rota */}
                  <Route path="settings/*" element={<SettingsPage />} />
                </Route>
              </Route>
              
              {/* Rota de Admin Master (Protegida e restrita a administradores) */}
              {/* Esta rota precisa do AppLayout, mas o MasterAdminPage gerencia suas próprias sub-rotas */}
              <Route path="/" element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/" element={<AppLayout />}>
                    {/* Usamos /* para indicar que MasterAdminPage gerencia rotas aninhadas */}
                    <Route path="master-admin/*" element={<MasterAdminPage />} /> 
                </Route>
              </Route>
              
              {/* Rota Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;