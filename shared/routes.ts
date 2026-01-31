import { z } from 'zod';
import { insertCreatorSchema, creators, Brand, insertBrandSchema, insertMessageSchema, messages, notifications, insertNotificationSchema } from './schema';

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
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  creators: {
    list: {
      method: 'GET' as const,
      path: '/api/creators',
      input: z.object({
        search: z.string().optional(),
        niche: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof creators.$inferSelect>()),
      },
    },
    getByHandle: {
      method: 'GET' as const,
      path: '/api/creators/:handle',
      responses: {
        200: z.custom<typeof creators.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/me/creator',
      responses: {
        200: z.custom<typeof creators.$inferSelect>(),
        404: errorSchemas.notFound, // Not a creator yet
        401: errorSchemas.unauthorized,
      },
    },
    updateMe: {
      method: 'POST' as const, // UPSERT basically
      path: '/api/me/creator',
      input: insertCreatorSchema.omit({ userId: true }), // userId comes from session
      responses: {
        200: z.custom<typeof creators.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  brands: {
    me: {
      method: 'GET' as const,
      path: '/api/me/brand',
      responses: {
        200: z.custom<Brand>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    updateMe: {
      method: 'POST' as const,
      path: '/api/me/brand',
      input: insertBrandSchema.omit({ userId: true }),
      responses: {
        200: z.custom<Brand>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  messages: {
    inbox: {
      method: 'GET' as const,
      path: '/api/messages/inbox',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    sent: {
      method: 'GET' as const,
      path: '/api/messages/sent',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/messages',
      input: z.object({
        receiverId: z.string(),
        receiverType: z.string(),
        subject: z.string().min(1),
        content: z.string().min(1),
      }),
      responses: {
        200: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    markRead: {
      method: 'POST' as const,
      path: '/api/messages/:id/read',
      responses: {
        200: z.custom<typeof messages.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications',
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    unreadCount: {
      method: 'GET' as const,
      path: '/api/notifications/unread-count',
      responses: {
        200: z.object({ count: z.number() }),
        401: errorSchemas.unauthorized,
      },
    },
    markRead: {
      method: 'POST' as const,
      path: '/api/notifications/:id/read',
      responses: {
        200: z.custom<typeof notifications.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    markAllRead: {
      method: 'POST' as const,
      path: '/api/notifications/read-all',
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
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

export type CreatorResponse = z.infer<typeof api.creators.getByHandle.responses[200]>;
