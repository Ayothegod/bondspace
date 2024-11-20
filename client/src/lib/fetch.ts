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

// const logoutUser = () => {
//   return axiosInstance.post("users/logout");
// };

// NOTE: space resource
const createSpace = (name: string) => {
  return axiosInstance.post("/space/", { name });
};

const getSpaceDetails = (spaceId: string) => {
  return axiosInstance.get(`/space/:${spaceId}`);
};

const renameSpace = (spaceId: string) => {
  return axiosInstance.patch(`/space/:${spaceId}`);
};

const endSpace = (spaceId: string) => {
  return axiosInstance.delete(`/space/:${spaceId}`);
};

// NOTE: space participants
const joinSpace = (spaceId: string, participantId: string) => {
  return axiosInstance.post(`/space/:${spaceId}/${participantId}`);
};

const leaveSpace = (spaceId: string, participantId: string) => {
  return axiosInstance.post(`/space/:${spaceId}/${participantId}`);
};

// NOTE: users
const getAvailableUsers = () => {
  return axiosInstance.get("/chat/users");
};

const getUserChats = () => {
  return axiosInstance.get(`/chat`);
};

const createUserChat = (receiverId: string) => {
  return axiosInstance.post(`/chat/c/${receiverId}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return axiosInstance.post(`/chat/group`, data);
};

const getGroupInfo = (chatId: string) => {
  return axiosInstance.get(`/chat/group/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return axiosInstance.patch(`/chat/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return axiosInstance.delete(`/chats/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return axiosInstance.delete(`/chats/remove/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return axiosInstance.post(`chats/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return axiosInstance.delete(`chats/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId: string) => {
  return axiosInstance.get(`/messages/${chatId}`);
};

const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }
  attachments?.map((file) => {
    formData.append("attachments", file);
  });
  return axiosInstance.post(`/chat-app/messages/${chatId}`, formData);
};

const deleteMessage = (chatId: string, messageId: string) => {
  return axiosInstance.delete(`/chat-app/messages/${chatId}/${messageId}`);
};

// Export all the API functions
export {
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  getUserChats,
  // logoutUser,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
  createSpace,
  joinSpace,
  leaveSpace,
  endSpace,
  getSpaceDetails,
  renameSpace,
};

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:3000/api/auth/get-user",
//       {
//         withCredentials: true,
//       }
//     );
//     console.log(response.data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
