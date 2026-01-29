import { useAnnouncements } from "@/hooks/use-events";
import { Navbar } from "@/components/Navbar";
import { Bell, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Announcements() {
  const { data: announcements, isLoading, error } = useAnnouncements();

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Latest Updates</h1>
            <p className="text-muted-foreground">Stay tuned with the latest news from organizers.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">Failed to load announcements.</div>
        ) : announcements?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No announcements posted yet.
          </div>
        ) : (
          <div className="relative border-l border-border ml-6 space-y-12">
            {announcements?.map((announcement, i) => (
              <motion.div 
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-[0_0_10px] shadow-primary/50" />
                
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full whitespace-nowrap">
                      {announcement.postedAt && format(new Date(announcement.postedAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {announcement.message}
                  </p>

                  {announcement.event && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-md">
                      <Calendar className="h-3.5 w-3.5" />
                      Re: {announcement.event.title}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
