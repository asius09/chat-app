import { z } from 'zod';

export const participantPermissionsSchema = z.object({
  canSendMessages: z.boolean().default(true),
  canSendFiles: z.boolean().default(true),
  canInviteUsers: z.boolean().default(false),
  canDeleteMessages: z.boolean().default(false),
  canManageChat: z.boolean().default(false),
});

export const chatParticipantSchema = z.object({
  userId: z.string(),
  role: z.enum(['owner', 'admin', 'moderator', 'member']),
  joinedAt: z.date(),
  lastReadMessageId: z.string().optional(),
  isOnline: z.boolean().optional(),
  permissions: participantPermissionsSchema.optional(),
});

export const chatSettingsSchema = z.object({
  allowFileSharing: z.boolean().default(true),
  allowVoiceMessages: z.boolean().default(true),
  allowVideoCalls: z.boolean().default(true),
  messageRetentionDays: z.number().positive().optional(),
  requireApprovalToJoin: z.boolean().default(false),
  maxParticipants: z.number().positive().optional(),
});

export const chatSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['direct', 'group', 'channel']),
  participants: z.array(chatParticipantSchema),
  lastMessageAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  settings: chatSettingsSchema.optional(),
  avatarUrl: z.string().url().optional(),
  isArchived: z.boolean().optional(),
  isMuted: z.boolean().optional(),
});

export const createChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['direct', 'group', 'channel']),
  participantIds: z.array(z.string()).min(1, 'At least one participant is required'),
  settings: chatSettingsSchema.partial().optional(),
});

export const updateChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  settings: chatSettingsSchema.partial().optional(),
  avatarUrl: z.string().url().optional(),
});

export const addParticipantSchema = z.object({
  userId: z.string(),
  role: z.enum(['owner', 'admin', 'moderator', 'member']).default('member'),
});

export const updateParticipantSchema = z.object({
  role: z.enum(['owner', 'admin', 'moderator', 'member']).optional(),
  permissions: participantPermissionsSchema.partial().optional(),
});

export const chatInviteSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  inviteCode: z.string(),
  createdBy: z.string(),
  expiresAt: z.date().optional(),
  maxUses: z.number().positive().optional(),
  usedCount: z.number().nonnegative(),
  createdAt: z.date(),
});

export type ChatInput = z.infer<typeof chatSchema>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
export type ChatParticipantInput = z.infer<typeof chatParticipantSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
export type ChatSettingsInput = z.infer<typeof chatSettingsSchema>;
export type ParticipantPermissionsInput = z.infer<typeof participantPermissionsSchema>;
export type ChatInviteInput = z.infer<typeof chatInviteSchema>;
