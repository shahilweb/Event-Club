import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateEventRequest, type CreateRegistrationRequest, type UpdateRegistrationStatusRequest, type CreateAnnouncementRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// ==========================================
// EVENTS HOOKS
// ==========================================

export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [api.events.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.events.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch event");
      return api.events.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateEventRequest) => {
      const res = await fetch(api.events.create.path, {
        method: api.events.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.events.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create event");
      }
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
      toast({ title: "Success", description: "Event created successfully" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

// ==========================================
// REGISTRATION HOOKS
// ==========================================

export function useCreateRegistration() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateRegistrationRequest) => {
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
         if (res.status === 400) {
          const error = api.registrations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to register");
      }
      return api.registrations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Registered!", description: "Your registration has been submitted." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

export function useEventRegistrations(eventId: number) {
  return useQuery({
    queryKey: [api.registrations.listByEvent.path, eventId],
    queryFn: async () => {
      const url = buildUrl(api.registrations.listByEvent.path, { id: eventId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return api.registrations.listByEvent.responses[200].parse(await res.json());
    },
    enabled: !!eventId,
  });
}

export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number } & UpdateRegistrationStatusRequest) => {
      const url = buildUrl(api.registrations.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.registrations.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.registrations.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate all registration lists to be safe, ideally we'd target specific event lists
      queryClient.invalidateQueries({ queryKey: [api.registrations.listByEvent.path] });
      queryClient.invalidateQueries({ queryKey: [api.registrations.checkStatus.path] });
      toast({ title: "Updated", description: `Registration status updated to ${variables.status}` });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}

export function useCheckRegistrationStatus(email: string) {
  return useQuery({
    queryKey: [api.registrations.checkStatus.path, email],
    queryFn: async () => {
      const url = `${api.registrations.checkStatus.path}?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch status");
      return api.registrations.checkStatus.responses[200].parse(await res.json());
    },
    enabled: !!email && email.includes("@"), // Only fetch if valid-ish email
    retry: false,
  });
}

// ==========================================
// ANNOUNCEMENT HOOKS
// ==========================================

export function useAnnouncements() {
  return useQuery({
    queryKey: [api.announcements.list.path],
    queryFn: async () => {
      const res = await fetch(api.announcements.list.path);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return api.announcements.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAnnouncementRequest) => {
      const res = await fetch(api.announcements.create.path, {
        method: api.announcements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
         if (res.status === 400) {
          const error = api.announcements.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create announcement");
      }
      return api.announcements.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] });
      toast({ title: "Posted", description: "Announcement posted successfully" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });
}
