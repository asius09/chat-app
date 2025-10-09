import { User } from './user.type.js';
import { Message } from './message.type.js';

export interface Chat {
  id: string;
  name?: string;
  description?: string;
  type: ChatType;
  participants: ChatParticipant[];
  lastMessage?: Message;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  settings?: ChatSettings;
  avatarUrl?: string;
  isArchived?: boolean;
  isMuted?: boolean;
}

export interface ChatParticipant {
  userId: string;
  user?: User;
  role: ParticipantRole;
  joinedAt: Date;
  lastReadMessageId?: string;
  isOnline?: boolean;
  permissions?: ParticipantPermissions;
}

export interface ChatSettings {
  allowFileSharing: boolean;
  allowVoiceMessages: boolean;
  allowVideoCalls: boolean;
  messageRetentionDays?: number;
  requireApprovalToJoin: boolean;
  maxParticipants?: number;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canSendFiles: boolean;
  canInviteUsers: boolean;
  canDeleteMessages: boolean;
  canManageChat: boolean;
}

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
  CHANNEL = 'channel'
}

export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member'
}

export interface CreateChatInput {
  name?: string;
  description?: string;
  type: ChatType;
  participantIds: string[];
  settings?: Partial<ChatSettings>;
}

export interface UpdateChatInput {
  name?: string;
  description?: string;
  settings?: Partial<ChatSettings>;
  avatarUrl?: string;
}

export interface AddParticipantInput {
  userId: string;
  role?: ParticipantRole;
}

export interface UpdateParticipantInput {
  role?: ParticipantRole;
  permissions?: Partial<ParticipantPermissions>;
}

export interface ChatInvite {
  id: string;
  chatId: string;
  inviteCode: string;
  createdBy: string;
  expiresAt?: Date;
  maxUses?: number;
  usedCount: number;
  createdAt: Date;
}
