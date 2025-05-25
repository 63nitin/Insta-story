export interface User {
  name: string;
  avatarUrl: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  duration?: number; // Duration in milliseconds
}
