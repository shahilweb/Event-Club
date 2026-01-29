import { Link } from "wouter";
import { ArrowRight, Calendar, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <div className="w-full max-w-5xl mx-auto text-center space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-primary-foreground backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Hackathon Season 2024 is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white">
            Manage your <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Events</span>
            <br /> like a Pro.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The all-in-one platform for event registrations, announcements, and management. Designed for modern communities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-12">
          
          <Link href="/events" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-8 text-left transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">I am a Participant</h3>
                <p className="text-muted-foreground mb-6">Browse upcoming events, register instantly, and track your application status.</p>
                <div className="flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                  Explore Events <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/dashboard" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-8 text-left transition-all hover:border-purple-500/50 hover:bg-card/80 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">I am an Admin</h3>
                <p className="text-muted-foreground mb-6">Create new events, manage registrations, post announcements, and oversee operations.</p>
                <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:text-purple-300">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>

        <div className="pt-12 text-sm text-muted-foreground">
          <p>© 2024 EventClub OS. Built for speed and simplicity.</p>
        </div>
      </div>
    </div>
  );
}
