import { useEvents } from "@/hooks/use-events";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Plus, Calendar, MapPin, Loader2, MoreVertical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EventsListAdmin() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Manage Events</h1>
          <Link href="/admin/events/new">
            <Button className="shadow-lg shadow-primary/25">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <div key={event.id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-lg">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-secondary/50 rounded-lg p-2.5 text-primary">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/events/${event.id}`}>
                          <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                        </Link>
                        {/* Add delete/edit here later */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {event.location}
                  </div>
                  
                  <div className="pt-4 border-t border-border mt-auto flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </span>
                    <Link href={`/admin/events/${event.id}`}>
                      <Button size="sm" variant="ghost" className="hover:text-primary hover:bg-primary/10">
                        Manage <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
