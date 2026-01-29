import { useState } from "react";
import { useCheckRegistrationStatus } from "@/hooks/use-events";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Loader2, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function StatusCheck() {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  
  const { data: registrations, isLoading, isError } = useCheckRegistrationStatus(searchEmail);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSearchEmail(email);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-4">Check Application Status</h1>
          <p className="text-muted-foreground">
            Enter the email address you used to register to see the status of all your applications.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-12">
          <Input 
            placeholder="Enter your email address..." 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-lg bg-card/50"
          />
          <Button type="submit" size="lg" className="h-12 px-8" disabled={!email}>
            <Search className="h-5 w-5 mr-2" />
            Check
          </Button>
        </form>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="text-center p-8 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
              Something went wrong. Please check your email and try again.
            </div>
          )}

          {!isLoading && registrations && registrations.length === 0 && (
            <div className="text-center p-12 rounded-2xl border border-dashed border-border bg-card/30">
              <p className="text-muted-foreground">No registrations found for this email.</p>
            </div>
          )}

          <AnimatePresence>
            {!isLoading && registrations && registrations.map((reg, i) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-border/80 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{reg.event.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(reg.event.date), "MMMM d, yyyy")}
                    </div>
                  </div>
                  <StatusBadge status={reg.status} className="px-3 py-1 text-sm" />
                </div>
                
                {reg.status === "confirmed" && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center text-sm text-emerald-400">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      You are all set! See you at the event.
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
