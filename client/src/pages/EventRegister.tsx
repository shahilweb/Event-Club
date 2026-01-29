import { useEvent, useCreateRegistration } from "@/hooks/use-events";
import { useLocation, useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Loader2, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertRegistrationSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Extend schema for form validation
const formSchema = insertRegistrationSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function EventRegister() {
  const [, params] = useRoute("/events/:id/register");
  const eventId = params ? parseInt(params.id) : 0;
  const { data: event, isLoading: isEventLoading } = useEvent(eventId);
  const { mutate: register, isPending: isRegistering, isSuccess } = useCreateRegistration();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      eventId: eventId,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    register(values);
  }

  if (isEventLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
        <Button onClick={() => setLocation("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Event Details Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h2 className="text-xl font-display font-bold text-white mb-4">{event.title}</h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-primary" />
                  {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  {event.location}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="md:col-span-3">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                <p className="text-muted-foreground mb-8">
                  We've received your registration for {event.title}. 
                  You can check your status anytime on the status page.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setLocation("/events")}>
                    Browse More Events
                  </Button>
                  <Button onClick={() => setLocation("/status")}>
                    Check Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <h1 className="text-2xl font-display font-bold text-white mb-2">Secure Your Spot</h1>
                <p className="text-muted-foreground mb-8">Fill out the form below to register for this event.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background/50 h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" type="email" {...field} className="bg-background/50 h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
