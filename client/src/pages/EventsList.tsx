import { useEvents } from "@/hooks/use-events";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function EventsList() {
  const { data: events, isLoading, error } = useEvents();

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover hackathons, workshops, and meetups. Join the community and level up your skills.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
            Failed to load events. Please try again later.
          </div>
        ) : events?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-dashed border-border bg-card/50">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-foreground">No events found</h3>
            <p className="text-muted-foreground mt-2">Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Placeholder Image Area - Could be dynamic later */}
                <div className="h-48 bg-gradient-to-br from-secondary to-background p-6 flex items-end relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold border border-white/10 mb-2">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                    {event.location}
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {event.description}
                  </p>

                  <Link href={`/events/${event.id}/register`} className="w-full">
                    <button className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center group-hover:ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
