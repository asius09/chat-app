export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
