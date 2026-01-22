import { z } from 'zod';
import { insertCreatorSchema, creators } from './schema';

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
