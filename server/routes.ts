
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendEmail, generateRegistrationEmailHTML, generateFollowUpEmailHTML } from "./email";
import { format } from "date-fns";

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
      
      // Get event details for email
      const event = await storage.getEvent(input.eventId);
      
      if (event) {
        // Send immediate confirmation email
        const confirmationHTML = generateRegistrationEmailHTML(
          input.name,
          event.title,
          format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a"),
          event.location,
          registration.id
        );
        
        await sendEmail({
          to: input.email,
          subject: `✅ Registration Confirmed - ${event.title}`,
          html: confirmationHTML,
        });
        
        // Schedule follow-up email after 1 hour
        setTimeout(async () => {
          const followUpHTML = generateFollowUpEmailHTML(
            input.name,
            event.title,
            format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a"),
            event.location
          );
          
          await sendEmail({
            to: input.email,
            subject: `⏰ Reminder: ${event.title} is coming up!`,
            html: followUpHTML,
          });
        }, 60 * 60 * 1000); // 1 hour in milliseconds
      }
      
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
      title: "Hackathon 2026",
      description: "A 24-hour coding marathon to build amazing projects.",
      date: new Date("2026-03-15T09:00:00Z"),
      location: "Tech Hub, Downtown"
    });
    
    const event2 = await storage.createEvent({
      title: "AI Workshop",
      description: "Learn the basics of Generative AI and LLMs.",
      date: new Date("2026-01-20T14:00:00Z"),
      location: "Virtual (Zoom)"
    });

    // Add 10 more events
    const additionalEvents = [
      {
        title: "Web Development Bootcamp",
        description: "Master modern web development with React, Node.js and MongoDB. 4-week intensive course.",
        date: new Date("2026-02-10T10:00:00Z"),
        location: "Tech Hub, Downtown"
      },
      {
        title: "Cloud Computing Conference",
        description: "Learn about AWS, Azure, and Google Cloud. Industry experts sharing insights.",
        date: new Date("2026-02-25T09:00:00Z"),
        location: "Convention Center, City Hall"
      },
      {
        title: "Mobile App Development Workshop",
        description: "Build iOS and Android apps with React Native. Hands-on coding session.",
        date: new Date("2026-03-05T14:00:00Z"),
        location: "Virtual (Zoom)"
      },
      {
        title: "Data Science Masterclass",
        description: "Python, Machine Learning, and Data Visualization. Learn from industry experts.",
        date: new Date("2026-03-20T10:00:00Z"),
        location: "Tech Hub, Downtown"
      },
      {
        title: "Cyber Security Summit",
        description: "Understanding threats, protection mechanisms, and best practices in cybersecurity.",
        date: new Date("2026-04-05T09:00:00Z"),
        location: "Convention Center, City Hall"
      },
      {
        title: "DevOps & Kubernetes Workshop",
        description: "Container orchestration, CI/CD pipelines, and cloud deployment strategies.",
        date: new Date("2026-04-15T13:00:00Z"),
        location: "Virtual (Zoom)"
      },
      {
        title: "Blockchain & Crypto Summit",
        description: "Explore blockchain technology, cryptocurrencies, and DeFi applications.",
        date: new Date("2026-05-01T10:00:00Z"),
        location: "Tech Hub, Downtown"
      },
      {
        title: "UI/UX Design Conference",
        description: "Design principles, user research, and creating beautiful digital experiences.",
        date: new Date("2026-05-10T09:00:00Z"),
        location: "Convention Center, City Hall"
      },
      {
        title: "Full Stack JavaScript Bootcamp",
        description: "Learn JavaScript from frontend to backend. Build complete web applications.",
        date: new Date("2026-05-25T10:00:00Z"),
        location: "Virtual (Zoom)"
      },
      {
        title: "Startup & Entrepreneurship Summit",
        description: "Tips and tricks for building successful startups. Networking with founders.",
        date: new Date("2026-06-08T09:00:00Z"),
        location: "Tech Hub, Downtown"
      }
    ];

    for (const eventData of additionalEvents) {
      await storage.createEvent(eventData);
    }

    await storage.createAnnouncement({
      eventId: event1.id,
      title: "Registration Open",
      message: "Registrations for Hackathon 2026 are now open! Sign up early."
    });

    await storage.createRegistration({
      eventId: event1.id,
      name: "John Doe",
      email: "john@example.com"
    });
    
     await storage.createRegistration({
      eventId: event1.id,
      name: "Jane Smith",
      email: "jane@example.com"
    });
    await storage.createRegistration({
      eventId: event1.id,
      name: "shamshad",
      email: "shamshad@example.com"
    });
  }
}
