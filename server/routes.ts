
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === EVENTS ===
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse({
        ...req.body,
        date: new Date(req.body.date) // Ensure date is parsed correctly
      });
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.events.delete.path, async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.status(204).send();
  });

  // === REGISTRATIONS ===
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      const registration = await storage.createRegistration(input);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.registrations.listByEvent.path, async (req, res) => {
    const registrations = await storage.getRegistrationsByEvent(Number(req.params.id));
    res.json(registrations);
  });

  app.patch(api.registrations.updateStatus.path, async (req, res) => {
    try {
      const { status } = api.registrations.updateStatus.input.parse(req.body);
      const updated = await storage.updateRegistrationStatus(Number(req.params.id), status);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // If record not found, generic error for now, or improve storage to return null
      throw err;
    }
  });

  app.get(api.registrations.checkStatus.path, async (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const registrations = await storage.getRegistrationsByEmail(email);
    res.json(registrations);
  });

  // === ANNOUNCEMENTS ===
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.post(api.announcements.create.path, async (req, res) => {
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement(input);
      res.status(201).json(announcement);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const events = await storage.getEvents();
  if (events.length === 0) {
    const event1 = await storage.createEvent({
      title: "Hackathon 2024",
      description: "A 24-hour coding marathon to build amazing projects.",
      date: new Date("2024-03-15T09:00:00Z"),
      location: "Tech Hub, Downtown"
    });
    
    const event2 = await storage.createEvent({
      title: "AI Workshop",
      description: "Learn the basics of Generative AI and LLMs.",
      date: new Date("2024-03-20T14:00:00Z"),
      location: "Virtual (Zoom)"
    });

    await storage.createAnnouncement({
      eventId: event1.id,
      title: "Registration Open",
      message: "Registrations for Hackathon 2024 are now open! Sign up early."
    });

    await storage.createRegistration({
      eventId: event1.id,
      name: "John Doe",
      email: "john@example.com",
      status: "pending"
    });
    
     await storage.createRegistration({
      eventId: event1.id,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "confirmed"
    });
  }
}
