export interface Message {
    id: number;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    room: string;
  };