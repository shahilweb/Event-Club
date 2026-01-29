import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Participant Pages
import Home from "@/pages/Home";
import EventsList from "@/pages/EventsList";
import EventRegister from "@/pages/EventRegister";
import StatusCheck from "@/pages/StatusCheck";
import Announcements from "@/pages/Announcements";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import CreateEvent from "@/pages/admin/CreateEvent";
import EventDetails from "@/pages/admin/EventDetails";
import EventsListAdmin from "@/pages/admin/EventsListAdmin";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/events" component={EventsList} />
      <Route path="/events/:id/register" component={EventRegister} />
      <Route path="/status" component={StatusCheck} />
      <Route path="/announcements" component={Announcements} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/events" component={EventsListAdmin} />
      <Route path="/admin/events/new" component={CreateEvent} />
      <Route path="/admin/events/:id" component={EventDetails} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
