import axios from "axios";

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_SERVER_BASEURI,
  timeout: 12000,
});

const logoutUser = () => {
  return axiosInstance.post("/users/logout");
};

const getAvailableUsers = () => {
  return axiosInstance.get("/chat-app/chats/users");
};

const getUserChats = () => {
  return axiosInstance.get(`/chat-app/chats`);
};

const createUserChat = (receiverId: string) => {
  return axiosInstance.post(`/chat-app/chats/c/${receiverId}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return axiosInstance.post(`/chat-app/chats/group`, data);
};

const getGroupInfo = (chatId: string) => {
  return axiosInstance.get(`/chat-app/chats/group/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return axiosInstance.patch(`/chat-app/chats/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return axiosInstance.delete(`/chat-app/chats/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return axiosInstance.delete(`/chat-app/chats/remove/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return axiosInstance.post(`/chat-app/chats/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return axiosInstance.delete(
    `/chat-app/chats/group/${chatId}/${participantId}`
  );
};

const getChatMessages = (chatId: string) => {
  return axiosInstance.get(`/chat-app/messages/${chatId}`);
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
  logoutUser,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
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
