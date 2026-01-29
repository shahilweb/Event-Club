
import { z } from 'zod';
import { 
  insertEventSchema, 
  insertRegistrationSchema, 
  insertAnnouncementSchema,
  events,
  registrations,
  announcements
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:id',
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: { // Add delete for cleanup if needed
      method: 'DELETE' as const,
      path: '/api/events/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  registrations: {
    create: {
      method: 'POST' as const,
      path: '/api/registrations',
      input: insertRegistrationSchema,
      responses: {
        201: z.custom<typeof registrations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    listByEvent: {
      method: 'GET' as const,
      path: '/api/events/:id/registrations',
      responses: {
        200: z.array(z.custom<typeof registrations.$inferSelect>()),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/registrations/:id/status',
      input: z.object({ status: z.enum(["pending", "confirmed", "rejected"]) }),
      responses: {
        200: z.custom<typeof registrations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    checkStatus: {
        method: 'GET' as const,
        path: '/api/registrations/status',
        input: z.object({ email: z.string().email() }), // Query param
        responses: {
            200: z.array(z.custom<typeof registrations.$inferSelect & { event: typeof events.$inferSelect }>()), // Enriched with event data
        }
    }
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements',
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect & { event: typeof events.$inferSelect | null }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/announcements',
      input: insertAnnouncementSchema,
      responses: {
        201: z.custom<typeof announcements.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
