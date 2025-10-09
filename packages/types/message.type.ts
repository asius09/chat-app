export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  type: MessageType;
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string; // ID of the message being replied to
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
}

export interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
  timestamp: Date;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  SYSTEM = 'system'
}

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video'
}

export interface CreateMessageInput {
  content: string;
  chatId: string;
  type: MessageType;
  replyTo?: string;
  attachments?: Omit<MessageAttachment, 'id'>[];
}

export interface UpdateMessageInput {
  content?: string;
  attachments?: Omit<MessageAttachment, 'id'>[];
}
