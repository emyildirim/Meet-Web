export interface User {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  stream?: MediaStream;
}

export interface Meeting {
  id: string;
  passcode?: string;
  participants: User[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface Settings {
  accountId: string;
  meetingId: string;
  passcode?: string;
  audioInput?: string;
  audioOutput?: string;
  videoInput?: string;
}

export type LayoutType = 'grid' | 'speaker'; 