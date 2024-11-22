/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Avatar {
  imageURL: string;
}

export interface UserInterface {
  id: string;
  avatar: Avatar;
  username: string;
  email: string;
  fullname?: string;
}

export interface UserProfile {
  id: string;
  avatar: Avatar;
  username: string;
  email: string;
  fullname: string;
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

export interface ChatItemInterface {
  id: string;
  status: boolean;
  createdAt: Date;
  updatedAt: string;

  name: string;
  spaceId: string;

  messages: MessageInterface[];
  participants: UserInterface[];
}

export interface MessageInterface {
  id: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  chatId: string;
  senderId: string;
  sentiment?: string | null;
  sender: {
    id: string;
    username: string;
    email: string;
  };
}
