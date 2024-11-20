/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/context/useSocketContext";
import { getChatMessages, getUserChats } from "@/lib/fetch";
import { fetcher, LocalStorage } from "@/lib/hook/useUtility";
import { ChatListItemInterface, ChatMessageInterface } from "@/lib/types/chat";
import { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import { ChatItem } from "@/components/sections/chat/ChatItem";
import { useChatStore } from "@/lib/store/stateStore";

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_DELETE_EVENT = "messageDeleted";

export default function Play() {
  const { allChats, setChats, creatingChat } = useChatStore();
  const { socket } = useSocket();
  const { toast } = useToast();

  const currentChat = useRef<ChatListItemInterface | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [messages, setMessages] = useState<ChatMessageInterface[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );

  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);

  const [message, setMessage] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // DONE:
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface
  ) => {
    const chatToUpdate = allChats.find((chat) => chat.id === chatToUpdateId)!;

    chatToUpdate.lastMessage = message;

    chatToUpdate.updatedAt = message?.updatedAt;

    setChats("updateChatLastMessage", chatToUpdate);
  };

  // DONE:
  const updateChatLastMessageOnDeletion = async (
    chatToUpdateId: string, //ChatId to find the chat
    message: ChatMessageInterface //The deleted message
  ) => {
    const chatToUpdate = allChats.find((chat) => chat.id === chatToUpdateId)!;

    if (chatToUpdate.lastMessage?.id === message.id) {
      const { error, isLoading, data } = await fetcher(
        async () => await getChatMessages(chatToUpdateId)
      );

      if (error) {
        return toast({
          description: `${error}`,
          variant: "destructive",
        });
      }

      setLoadingChats(isLoading)
      chatToUpdate.lastMessage = data?.data;
      setChats("updateChat", ...allChats);
    }
  };

  // DONE:
  const getChats = async () => {
    const { error, data, isLoading } = await fetcher(async () => await getUserChats());

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setLoadingChats(isLoading)
    // console.log("All user chat:", data?.data);
    setChats("updateChat", undefined, data?.data);
  };

  // DONE:
  const getMessages = async () => {
    if (!currentChat.current?.id)
      return toast({
        description: `No chat is selected`,
        variant: "destructive",
      });

    if (!socket)
      return toast({
        description: `Socket not available`,
        variant: "destructive",
      });

    // Emit an event to join the current chat
    socket.emit(JOIN_CHAT_EVENT, currentChat.current?.id);

    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?.id)
    );

    // Make an async request to fetch chat messages for the current chat
    setLoadingMessages(true);
    const { error, isLoading, data } = await fetcher(
      async () => await getChatMessages(currentChat.current?.id || "")
    );
    setLoadingMessages(false);

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setMessages(data?.data || []);
  };

  // PENDING:
  const sendChatMessage = async () => {
    if (!currentChat.current?.id || !socket) return;

    // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    socket.emit(STOP_TYPING_EVENT, currentChat.current?.id);

    // Use the requestHandler to send the message and handle potential response or error
    // await requestHandler(
    //   // Try to send the chat message with the given message and attached files
    //   async () =>
    //     await sendMessage(
    //       currentChat.current?._id || "", // Chat ID or empty string if not available
    //       message, // Actual text message
    //       attachedFiles // Any attached files
    //     ),
    //   null,
    //   // On successful message sending, clear the message input and attached files, then update the UI
    //   (res) => {
    //     setMessage(""); // Clear the message input
    //     setAttachedFiles([]); // Clear the list of attached files
    //     setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
    //     updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in the chat
    //   },

    //   // If there's an error during the message sending process, raise an alert
    //   alert
    // );
  };

  // PENDING:
  const deleteChatMessage = async (message: ChatMessageInterface) => {
    //ONClick delete the message and reload the chat when deleteMessage socket gives any response in chat.tsx
    //use request handler to prevent any errors
    // await requestHandler(
    //   async () => await deleteMessage(message.chat, message._id),
    //   null,
    //   (res) => {
    //     setMessages((prev) => prev.filter((msg) => msg._id !== res.data._id));
    //     updateChatLastMessageOnDeletion(message.chat, message);
    //   },
    //   alert
    // );
  };

  // PENDING:
  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the message state with the current input value
    setMessage(e.target.value);

    // If socket doesn't exist or isn't connected, exit the function
    if (!socket || !isConnected) return;

    // Check if the user isn't already set as typing
    if (!selfTyping) {
      // Set the user as typing
      setSelfTyping(true);

      // Emit a typing event to the server for the current chat
      socket.emit(TYPING_EVENT, currentChat.current?.id);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(STOP_TYPING_EVENT, currentChat.current?.id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  // DONE:
  const onConnect = () => {
    setIsConnected(true);
  };

  // DONE:
  const onDisconnect = () => {
    setIsConnected(false);
  };

  // DONE:
  const handleOnSocketTyping = (chatId: string) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(true);
  };

  // DONE:
  const handleOnSocketStopTyping = (chatId: string) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(false);
  };

  // DONE:
  const onMessageDelete = (message: ChatMessageInterface) => {
    if (message?.chat !== currentChat.current?.id) {
      setUnreadMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    }

    updateChatLastMessageOnDeletion(message.chat, message);
  };

  // DONE:
  const onMessageReceived = (message: ChatMessageInterface) => {
    // Check if the received message belongs to the currently active chat
    if (message?.chat !== currentChat.current?.id) {
      // If not, update the list of unread messages
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      // If it belongs to the current chat, update the messages list for the active chat
      setMessages((prev) => [message, ...prev]);
    }

    updateChatLastMessage(message.chat || "", message);
  };

  // DONE:
  const onNewChat = (chat: ChatListItemInterface) => {
    // console.log("New chat", chat);

    setChats("addChat", chat);
  };

  // DONE:
  const onChatLeave = (chat: ChatListItemInterface) => {
    if (chat.id === currentChat.current?.id) {
      currentChat.current = null;
      LocalStorage.remove("currentChat");
    }

    setChats("filterChat", chat);
  };

  // DONE:
  const onGroupNameChange = (chat: ChatListItemInterface) => {
    if (chat.id === currentChat.current?.id) {
      currentChat.current = chat;

      // Save the updated chat details to local storage
      LocalStorage.set("currentChat", chat);
    }

    setChats("groupNameChange", chat);
  };

  useEffect(() => {
    // Fetch the chat list from the server.
    getChats();

    // Retrieve the current chat details from local storage.
    const _currentChat = LocalStorage.get("currentChat");

    // If there's a current chat saved in local storage:
    if (_currentChat) {
      console.log("Current chat: ", _currentChat);

      // Set the current chat reference to the one from local storage.
      currentChat.current = _currentChat;
      // If the socket connection exists, emit an event to join the specific chat using its ID.
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      // Fetch the messages for the current chat.
      // getMessages();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Set up event listeners for various socket events:
    // Listener for when the socket connects.
    socket.on(CONNECTED_EVENT, onConnect);
    // Listener for when the socket disconnects.
    socket.on(DISCONNECT_EVENT, onDisconnect);
    // Listener for when a user is typing.
    socket.on(TYPING_EVENT, handleOnSocketTyping);
    // Listener for when a user stops typing.
    socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping);
    // Listener for when a new message is received.
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    // Listener for the initiation of a new chat.
    socket.on(NEW_CHAT_EVENT, onNewChat);
    // Listener for when a user leaves a chat.
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    // Listener for when a group's name is updated.
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    //Listener for when a message is deleted
    socket.on(MESSAGE_DELETE_EVENT, onMessageDelete);
    // When the component using this hook unmounts or if `socket` or `chats` change:
    return () => {
      // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECT_EVENT, onDisconnect);
      socket.off(TYPING_EVENT, handleOnSocketTyping);
      socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
      socket.off(MESSAGE_DELETE_EVENT, onMessageDelete);
    };

    // Note:
    // The `chats` array is used in the `onMessageReceived` function.
    // We need the latest state value of `chats`. If we don't pass `chats` in the dependency array,
    // the `onMessageReceived` will consider the initial value of the `chats` array, which is empty.
    // This will not cause infinite renders because the functions in the socket are getting mounted and not executed.
    // So, even if some socket callbacks are updating the `chats` state, it's not
    // updating on each `useEffect` call but on each socket call.
  }, [socket, allChats]);

  return (
    <div className="min-h-screen flex w-full">w
      <div className="w-full flex-grow flex gap-2">
        <div className="w-48 flex-shrink-0  border flex flex-col gap-4 items-center justify-center min-h-screen">
          <Button>Start game session</Button>
          {/* <Logout /> */}
        </div>

        <div className="border w-full ">
          All Chats
          {loadingChats ? (
            <div className="flex justify-center items-center h-[calc(100%-88px)]">
              <Skeleton className="w-14 h-4 rounded-full bg-primary" />
            </div>
          ) : (
            [...allChats].map((chat) => (
              <ChatItem
                chat={chat}
                isActive={chat.id === currentChat.current?.id}
                unreadCount={
                  unreadMessages.filter((n) => n.chat === chat.id).length
                }
                onClick={(chat) => {
                  if (
                    currentChat.current?.id &&
                    currentChat.current?.id === chat.id
                  )
                    return;
                  LocalStorage.set("currentChat", chat);
                  currentChat.current = chat;
                  setMessage("");
                  // getMessages();
                }}
                key={chat.id}
                onChatDelete={(chatId) => {
                  setChats("filterChat", undefined, undefined, chatId);
                  if (currentChat.current?.id === chatId) {
                    currentChat.current = null;
                    LocalStorage.remove("currentChat");
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// const num = 30;
// let res: string;
// if (num < 10) {
//   return (res = "less than 10");
// } else if (num > 10 && num < 30) {
//   return (res = "more than 10 and lesss than 30");
// } else {
//   return (res = "more than 30");
// }

// .filter((chat) =>
//   localSearchQuery
//     ? getChatObjectMetadata(chat, user!)
//         .title?.toLocaleLowerCase()
//         ?.includes(localSearchQuery)
//     : // If there's no localSearchQuery, include all chats
//       true
// )

// [...chats].map((chat) => {
//   return (
//     <ChatItem
//       chat={chat}
//       isActive={chat.id === currentChat.current?.id}
//       unreadCount={
//         unreadMessages.filter((n) => n.chat === chat.id).length
//       }
//       onClick={(chat) => {
//         if (
//           currentChat.current?.id &&
//           currentChat.current?.id === chat.id
//         )
//           return;
//         LocalStorage.set("currentChat", chat);
//         currentChat.current = chat;
//         setMessage("");
//         getMessages();
//       }}
//       key={chat.id}
//       onChatDelete={(chatId) => {
//         setChats((prev) =>
//           prev.filter((chat) => chat.id !== chatId)
//         );
//         if (currentChat.current?.id === chatId) {
//           currentChat.current = null;
//           LocalStorage.remove("currentChat");
//         }
//       }}
//     />
//   );
// })
