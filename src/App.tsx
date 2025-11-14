import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import DashboardPage from "./pages/DashboardPage";
import MaintenancePage from "./pages/MaintenancePage";
import FuelingPage from "./pages/FuelingPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import MasterAdminPage from "./pages/MasterAdminPage";
import AlertsPage from "./pages/AlertsPage";
import PriceComparisonPage from "./pages/PriceComparisonPage"; // Novo Import
import NotFound from "./pages/NotFound";
import MainHeader from "./components/MainHeader";
import ThemeProvider from "./components/ThemeProvider";
import SessionContextProvider from "./components/SessionContextProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingActionButton from "./components/FloatingActionButton"; // Novo Import

const queryClient = new QueryClient();

// Novo componente de Layout para rotas protegidas
const ProtectedLayout = () => (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <MainHeader />
        {/* Conteúdo Principal */}
        <main className="flex-grow overflow-y-auto">
            <Outlet />
        </main>
        {/* Botão de Ação Flutuante */}
        <FloatingActionButton />
    </div>
);

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
                <Route path="/" element={<ProtectedLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="maintenance" element={<MaintenancePage />} />
                  <Route path="fueling" element={<FuelingPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="settings/*" element={<SettingsPage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="prices" element={<PriceComparisonPage />} /> {/* Nova Rota */}
                </Route>
              </Route>
              
              {/* Rota de Admin Master (Protegida e restrita a administradores) */}
              <Route path="/" element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/" element={<ProtectedLayout />}>
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