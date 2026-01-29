
import { 
  events, registrations, announcements,
  type InsertEvent, type Event,
  type InsertRegistration, type Registration,
  type InsertAnnouncement, type Announcement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Registrations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  getRegistrationsByEmail(email: string): Promise<(Registration & { event: Event })[]>;
  updateRegistrationStatus(id: number, status: "pending" | "confirmed" | "rejected"): Promise<Registration>;

  // Announcements
  getAnnouncements(): Promise<(Announcement & { event: Event | null })[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
}

export class DatabaseStorage implements IStorage {
  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Registrations
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db.insert(registrations).values(registration).returning();
    return newRegistration;
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.eventId, eventId));
  }

  async getRegistrationsByEmail(email: string): Promise<(Registration & { event: Event })[]> {
    // Join with events to show event details to the user
    const rows = await db.select({
      registration: registrations,
      event: events
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.email, email));
    
    return rows.map(row => ({
      ...row.registration,
      event: row.event
    }));
  }

  async updateRegistrationStatus(id: number, status: "pending" | "confirmed" | "rejected"): Promise<Registration> {
    const [updated] = await db.update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .returning();
    return updated;
  }

  // Announcements
  async getAnnouncements(): Promise<(Announcement & { event: Event | null })[]> {
    const rows = await db.select({
      announcement: announcements,
      event: events
    })
    .from(announcements)
    .leftJoin(events, eq(announcements.eventId, events.id))
    .orderBy(desc(announcements.postedAt));

    return rows.map(row => ({
      ...row.announcement,
      event: row.event
    }));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }
}

export const storage = new DatabaseStorage();
