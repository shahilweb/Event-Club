import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useEvents } from "@/hooks/use-events";
import { Calendar, Plus, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: events, isLoading } = useEvents();

  // Simple stats calculation
  const totalEvents = events?.length || 0;
  // This is technically inaccurate without fetching all registrations, 
  // but for MVP dashboard it's a placeholder or requires a specific stats endpoint.
  // We'll keep it simple.

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of your events and registrations.</p>
          </div>
          <Link href="/admin/events/new">
            <Button className="shadow-lg shadow-primary/25">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <h3 className="text-2xl font-bold text-white">{isLoading ? "-" : totalEvents}</h3>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-border bg-card p-6 opacity-60 grayscale cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                <h3 className="text-2xl font-bold text-white">-</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Available in Pro</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Events</h2>
            <Link href="/admin/events">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-border">
                {events?.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="secondary" size="sm">
                        Manage Event
                      </Button>
                    </Link>
                  </div>
                ))}
                {events?.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No events created yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
