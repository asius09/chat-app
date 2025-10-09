import { z } from 'zod';

export const messageAttachmentSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'file', 'audio', 'video']),
  url: z.string().url(),
  filename: z.string(),
  size: z.number().positive(),
  mimeType: z.string(),
  thumbnailUrl: z.string().url().optional(),
});

export const messageReactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  emoji: z.string(),
  timestamp: z.date(),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Message content cannot be empty'),
  senderId: z.string(),
  chatId: z.string(),
  type: z.enum(['text', 'image', 'file', 'audio', 'video', 'system']),
  timestamp: z.date(),
  editedAt: z.date().optional(),
  replyTo: z.string().optional(),
  attachments: z.array(messageAttachmentSchema).optional(),
  reactions: z.array(messageReactionSchema).optional(),
  isRead: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(4000, 'Message too long'),
  chatId: z.string(),
  type: z.enum(['text', 'image', 'file', 'audio', 'video', 'system']).default('text'),
  replyTo: z.string().optional(),
  attachments: z.array(
    messageAttachmentSchema.omit({ id: true })
  ).optional(),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(4000, 'Message too long').optional(),
  attachments: z.array(
    messageAttachmentSchema.omit({ id: true })
  ).optional(),
});

export const messageReactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type MessageAttachmentInput = z.infer<typeof messageAttachmentSchema>;
export type MessageReactionInput = z.infer<typeof messageReactionSchema>;
