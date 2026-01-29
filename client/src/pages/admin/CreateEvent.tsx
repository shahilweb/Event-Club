import { Navbar } from "@/components/Navbar";
import { useCreateEvent } from "@/hooks/use-events";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

// Zod coerce date handles string input from datetime-local
const formSchema = insertEventSchema.extend({
  date: z.string().transform((str) => new Date(str)), 
});

// Since input type="datetime-local" returns a string, we need a schema that accepts string initially
const inputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
});

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: "",
    },
  });

  function onSubmit(values: z.infer<typeof inputSchema>) {
    createEvent({
      ...values,
      date: new Date(values.date),
    }, {
      onSuccess: () => {
        setLocation("/admin/events");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => setLocation("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-display font-bold text-white">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details to launch a new event.</p>
        </div>

        <Card className="p-8 border-border bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Hackathon 2024" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Convention Center / Online" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the event details, agenda, and prerequisites..." 
                        className="min-h-[150px] bg-background/50 resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/admin/events")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="min-w-[140px]">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
