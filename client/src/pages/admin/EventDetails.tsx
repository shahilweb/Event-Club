import { useEvent, useEventRegistrations, useUpdateRegistrationStatus, useCreateAnnouncement } from "@/hooks/use-events";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { EventQRCode } from "@/components/EventQRCode";
import { Loader2, ArrowLeft, Calendar, MapPin, Check, X, BellPlus, Mail } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EventDetails() {
  const [, params] = useRoute("/admin/events/:id");
  const eventId = params ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: event, isLoading: isEventLoading } = useEvent(eventId);
  const { data: registrations, isLoading: isRegLoading } = useEventRegistrations(eventId);
  const { mutate: updateStatus } = useUpdateRegistrationStatus();
  const { mutate: postAnnouncement, isPending: isPosting } = useCreateAnnouncement();

  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");

  const handlePostAnnouncement = () => {
    if (!announcementTitle || !announcementMsg) {
      toast({ variant: "destructive", title: "Error", description: "Title and message are required" });
      return;
    }

    postAnnouncement({
      eventId,
      title: announcementTitle,
      message: announcementMsg,
    }, {
      onSuccess: () => {
        setAnnouncementOpen(false);
        setAnnouncementTitle("");
        setAnnouncementMsg("");
      }
    });
  };

  if (isEventLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => setLocation("/admin/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-10">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-white mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> {format(new Date(event.date), "MMMM d, yyyy h:mm a")}</span>
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {event.location}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <EventQRCode eventId={eventId} eventTitle={event.title} />
            
            <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/20">
                  <BellPlus className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>New Announcement</DialogTitle>
                <DialogDescription>
                  Notify all participants of {event.title} about updates.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Schedule Change" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    value={announcementMsg}
                    onChange={(e) => setAnnouncementMsg(e.target.value)}
                    placeholder="Type your message here..." 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setAnnouncementOpen(false)}>Cancel</Button>
                <Button onClick={handlePostAnnouncement} disabled={isPosting}>
                  {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                </Button>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Registrations</h2>
            <div className="text-sm text-muted-foreground">
              Total: {registrations?.length || 0}
            </div>
          </div>

          {isRegLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : registrations?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No registrations yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations?.map((reg) => (
                    <TableRow key={reg.id} className="border-border hover:bg-white/5">
                      <TableCell className="font-medium text-white">{reg.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {reg.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {reg.createdAt ? format(new Date(reg.createdAt), "MMM d") : "-"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={reg.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {reg.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
                                onClick={() => updateStatus({ id: reg.id, status: "confirmed" })}
                                title="Confirm"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20"
                                onClick={() => updateStatus({ id: reg.id, status: "rejected" })}
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {reg.status !== "pending" && (
                             <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 text-xs text-muted-foreground"
                                onClick={() => updateStatus({ id: reg.id, status: "pending" })}
                              >
                                Reset
                              </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
