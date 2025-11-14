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
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import ThemeProvider from "./components/ThemeProvider"; // Novo Import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider> {/* Envolvendo o aplicativo com o ThemeProvider */}
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota de Login/Index sem o layout principal */}
            <Route path="/" element={<IndexPage />} />
            
            {/* Rotas protegidas/com layout */}
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="fueling" element={<FuelingPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="settings/*" element={<SettingsPage />} /> {/* Adicionado /* para rotas aninhadas */}
            </Route>
            
            {/* Rota Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;