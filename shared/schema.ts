
import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "rejected"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id"), // Nullable for general announcements if needed, but per specs mainly for events
  title: text("title").notNull(),
  message: text("message").notNull(),
  postedAt: timestamp("posted_at").defaultNow(),
});

// === RELATIONS ===

export const registrationsRelations = relations(registrations, ({ one }) => ({
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  event: one(events, {
    fields: [announcements.eventId],
    references: [events.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(registrations),
  announcements: many(announcements),
}));

// === SCHEMAS ===

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, createdAt: true, status: true }); // Status is managed by admin
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, postedAt: true });

// === EXPLICIT TYPES ===

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Request types
export type CreateEventRequest = InsertEvent;
export type CreateRegistrationRequest = InsertRegistration;
export type CreateAnnouncementRequest = InsertAnnouncement;
export type UpdateRegistrationStatusRequest = { status: "pending" | "confirmed" | "rejected" };

