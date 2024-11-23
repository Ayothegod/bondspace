/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { APIStatusResponseInterface } from "./types/chat";

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export type NewAxiosResponse = AxiosResponse<APIStatusResponseInterface, any>;

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_SERVER_BASEURI,
  timeout: 12000,
});

export const SocketEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  SOCKET_ERROR_EVENT: "socketError",

  NEW_MESSAGE: "newMessage",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",

  UPDATE_CHAT_NAME_EVENT: "updateChatName",
  JOIN_CHAT_EVENT: "joinChat",

  NEW_SPACE_EVENT: "newSpace",
  JOIN_SPACE_EVENT: "joinSpace",
  LEAVE_SPACE_EVENT: "leaveSpace",
  UPDATE_SPACE_NAME_EVENT: "updateSpaceName",
  END_SPACE: "endSpace",
});

// NOTE: space
export const createSpace = (name: string) => {
  return axiosInstance.post("/space/", { name });
};

export const joinSpace = (spaceId: string, participantId: string) => {
  return axiosInstance.post(`/space/${spaceId}/${participantId}`);
};

export const getSpaceDetails = (spaceId: string) => {
  return axiosInstance.get(`/space/${spaceId}`);
};

export const renameSpaceFunc = (spaceId: string, name: string) => {
  return axiosInstance.patch(`/space/${spaceId}`, { name });
};

export const leaveSpaceFunc = (spaceId: string, participantId: string) => {
  return axiosInstance.delete(`/space/${spaceId}/${participantId}`);
};

//export const endSpaceFunc = (spaceId: string) => {
//   return axiosInstance.delete(`/space/${spaceId}`);
// };

// NOTE: chat
export const getChatsDetails = (spaceId: string) => {
  return axiosInstance.get(`/chat/${spaceId}`);
};

export const updateChatName = (chatId: string, name: string) => {
  return axiosInstance.patch(`/chat/${chatId}`, { name });
};

// NOTE: message
export const getChatMessagesFunc = (spaceId: string) => {
  return axiosInstance.get(`/message/${spaceId}`);
};

export const sendMessageFunc = (chatId: string, content: string) => {
  return axiosInstance.post(`/message/${chatId}`, { content });
};

export const deleteMessageFunc = (chatId: string, messageId: string) => {
  return axiosInstance.delete(`/message/${chatId}/${messageId}`);
};

// NOTE: user
export const getUserProfile = (userId: string) => {
  return axiosInstance.get(`/auth/user/${userId}`);
};

