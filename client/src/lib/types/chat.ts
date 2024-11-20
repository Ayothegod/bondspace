/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Avatar {
  id: string;
  description: string
  imageURL: string;
}

export interface UserInterface {
  id: string;
  avatar: Avatar
  username: string;
  email: string;
  fullname?: string;
}

export interface APIStatusResponseInterface {
  data: any;
  message: string;
  statusCode: number;
  success?: boolean;
}

export interface SpaceInterface {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: string;

  name: string;
  participants: UserInterface[];
}

export interface ChatListItemInterface {
  id: string;
  gameType: string;
  status: boolean;
  createdAt: Date;
  name: string;
  isGroupGame: boolean;

  lastMessage?: ChatMessageInterface;
  messages: ChatMessageInterface[];
  players: UserInterface[];
  updatedAt: string;
}

export interface ChatMessageInterface {
  id: string;
  sender: Pick<UserInterface, "id"  | "email" | "username">;
  content: string;
  chat: string;
  attachments: {
    url: string;
    id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
