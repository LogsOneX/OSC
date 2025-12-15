import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import NetworkPage from "@/pages/NetworkPage";
import TimelinePage from "@/pages/TimelinePage";
import BreachPage from "@/pages/BreachPage";
import VehiclePage from "@/pages/VehiclePage";
import ReportsPage from "@/pages/ReportsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/network" component={NetworkPage} />
      <Route path="/timeline" component={TimelinePage} />
      <Route path="/breach" component={BreachPage} />
      <Route path="/search/vehicle" component={VehiclePage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/search/:type" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex h-14 items-center gap-4 border-b bg-card px-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  System Online
                </div>
              </header>
              <main className="flex-1 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
