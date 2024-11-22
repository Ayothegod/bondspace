/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/context/useSocketContext";
import {
  getChatMessagesFunc,
  getChatsDetails,
  getSpaceDetails,
  renameSpaceFunc,
  sendMessageFunc,
  SocketEventEnum,
  updateChatName,
  getUserProfile,
} from "@/lib/fetch";
import { fetcher, getUserMetadata, LocalStorage } from "@/lib/hook/useUtility";
import {
  ChatItemInterface,
  MessageInterface,
  SpaceInterface,
} from "@/lib/types/chat";
import { useEffect, useRef, useState } from "react";
// import { ChatItem } from "@/components/sections/chat/ChatItem";
import {
  useAuthStore,
  useChatStore,
  useMessageStore,
  useSpaceStore,
  useUserStore,
} from "@/lib/store/stateStore";
import Header from "@/components/sections/Header";
import {
  Loader,
  LoaderIcon,
  LucideArrowDownWideNarrow,
  MessageCircle,
  MoreVertical,
  Pen,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import moment from "moment";
import UserProfileModal from "@/components/sections/UserProfileModal";

import testWhite from "@/assets/white/Clovers_A_white.png";
import testBlack from "@/assets/black/Clovers_A_black.png";

interface CurrentSpace {
  state: {
    space: SpaceInterface;
  };
}

export default function Play() {
  const { chat, setChat } = useChatStore();
  const { space, setSpace } = useSpaceStore();
  const { messages, setMessages } = useMessageStore();
  const { user } = useAuthStore();
  const { setUserProfile, displayUserProfile, setDisplayUserProfile } =
    useUserStore();

  const { socket } = useSocket();
  const { toast } = useToast();

  const [isConnected, setIsConnected] = useState(false);
  const currentSpace = useRef<CurrentSpace | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [spaceName, setSpaceName] = useState("");
  const [startSpaceNameUpdate, setStartSpaceNameUpdate] = useState(false);

  const [chatName, setChatName] = useState("");
  const [startChatNameUpdate, setStartChatNameUpdate] = useState(false);

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);
  // const [localSearchQuery, setLocalSearchQuery] = useState("");

  // DONE: space
  const getSpace = async () => {
    const { error, data } = await fetcher(
      async () => await getSpaceDetails(space?.id as string)
    );
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setSpace("updateState", data?.data);
  };

  // DONE:
  const renameSpace = async () => {
    const { error, data } = await fetcher(
      async () => await renameSpaceFunc(space?.id as string, spaceName)
    );
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    toast({
      description: `${data?.message}`,
    });

    setStartSpaceNameUpdate(!startSpaceNameUpdate);
    setSpaceName("");
    setSpace("updateState", data?.data);
  };

  // DONE: chat
  const renameChat = async () => {
    const { error, data, isLoading } = await fetcher(
      async () => await updateChatName(chat?.id as string, chatName)
    );
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    toast({
      description: `${data?.message}`,
    });

    setStartChatNameUpdate(!startChatNameUpdate);
    setChatName("");
    setLoadingChat(isLoading);
    setChat("updateChat", data?.data);
  };

  // DONE:
  const getSpaceChats = async () => {
    const { error, data, isLoading } = await fetcher(
      async () => await getChatsDetails(space?.id as string)
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    // console.log("chat:", data?.data)

    setLoadingChat(isLoading);
    setChat("updateChat", data?.data);
  };

  // DONE:
  const getMessages = async () => {
    if (!space)
      return toast({
        description: `No space is active`,
        variant: "destructive",
      });

    setLoadingMessages(!loadingMessages);
    const { error, data } = await fetcher(
      async () => await getChatMessagesFunc(space?.id as string)
    );

    setLoadingMessages(!loadingMessages);
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }

    setMessages("updateMessage", data?.data);
  };

  // DONE:
  const sendChatMessage = async (e: any) => {
    e.preventDefault();
    if (!chat || !socket) return;
    socket.emit(SocketEventEnum.STOP_TYPING_EVENT, chat?.id);
    console.log("send chat");

    const { error, data } = await fetcher(
      async () => await sendMessageFunc(chat.id, message)
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setMessage("");
    setMessages("addMessage", undefined, data?.data);
  };

  // PENDING:
  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!socket || !isConnected) return;

    // // Check if the user isn't already set as typing
    if (!selfTyping) {
      setSelfTyping(true);
      socket.emit(SocketEventEnum.TYPING_EVENT, user?.id);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEventEnum.STOP_TYPING_EVENT, user?.id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  // const deleteChatMessage = async (message: ChatItemInterface) => {
  //   //ONClick delete the message and reload the chat when deleteMessage socket gives any response in chat.tsx
  //   //use request handler to prevent any errors
  //   // await requestHandler(
  //   //   async () => await deleteMessage(message.chat, message._id),
  //   //   null,
  //   //   (res) => {
  //   //     setMessages((prev) => prev.filter((msg) => msg._id !== res.data._id));
  //   //     updateChatLastMessageOnDeletion(message.chat, message);
  //   //   },
  //   //   alert
  //   // );
  // };

  // NOTE: TODO: PENDING: WARN: NOTE: TODO: PENDING: WARN:

  const onConnect = () => {
    // NOTE:
    setIsConnected(true);
  };

  // NOTE:
  const onDisconnect = () => {
    setIsConnected(false);
  };

  // NOTE:
  const onSpaceNameChange = (space: SpaceInterface) => {
    toast({
      description: "Space name changed successfully.",
    });
    setSpace("updateState", space);
  };

  // NOTE:
  const onChatNameChange = (chat: ChatItemInterface) => {
    toast({
      description: "Chat name changed successfully.",
    });
    setChat("updateChat", chat);
  };

  // NOTE:
  const onNewSpace = (space: any) => {
    toast({
      description: "New space created successfully.",
    });
    setSpace("updateState", space);
  };

  // NOTE:
  const onJoinSpace = (space: SpaceInterface) => {
    toast({
      description: "A new user joined the space.",
    });
    setSpace("updateState", space);
  };

  // NOTE:
  const onLeaveSpace = (space: SpaceInterface) => {
    toast({
      description: "A user left the space.",
    });
    setSpace("updateState", space);
  };

  // const onMessageDelete = (message: ChatMessageInterface) => {
  //   if (message?.chat !== currentChat.current?.id) {
  //     setUnreadMessages((prev) => prev.filter((msg) => msg.id !== message.id));
  //   } else {
  //     setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
  //   }

  //   updateChatLastMessageOnDeletion(message.chat, message);
  // };

  const onNewMessage = (message: MessageInterface) => {
    // NOTE:
    setMessages("addMessage", undefined, message);
  };

  const handleOnSocketTyping = (chatId: string) => {
    console.log("start typing", chatId);
    setIsTyping(true);
  };

  const onEndSpace = () => {
    // PENDING:
    // AI summarise space duration etc
    // Maybe timeframe/durationn of space too
    console.log("Space ended");
  };

  useEffect(() => {
    getSpace();

    const _currentSpace = LocalStorage.get("active-space");

    if (_currentSpace) {
      currentSpace.current = _currentSpace;
      socket?.emit(SocketEventEnum.JOIN_SPACE_EVENT, space?.id);
    }
    getSpaceChats();
    getMessages();
  }, [socket]);

  useEffect(() => {
    if (!socket || !chat) return;

    const joinChat = () => {
      socket.emit(SocketEventEnum.JOIN_CHAT_EVENT, chat.id);
      // console.log(`Joined chat room: ${chat.id}`);
    };

    // Fallback: Emit after a short delay
    const timeoutId = setTimeout(() => {
      if (!socket.connected) {
        joinChat();
      }
    }, 500);

    if (socket.connected) {
      joinChat();
    } else {
      socket.on("connect", joinChat);
    }

    return () => {
      clearTimeout(timeoutId);
      socket.off("connect", joinChat);
    };
  }, [socket, chat]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEventEnum.CONNECTED_EVENT, onConnect);
    socket.on(SocketEventEnum.DISCONNECT_EVENT, onDisconnect);

    const handleOnSocketStopTyping = (chatId: string) => {
      console.log("STOP_TYPING_EVENT received for chat:", chatId);
      setIsTyping(false);
    };

    socket.on(SocketEventEnum.TYPING_EVENT, handleOnSocketTyping);
    socket.on(SocketEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);

    // NOTE: chat
    socket.on(SocketEventEnum.UPDATE_CHAT_NAME_EVENT, onChatNameChange);
    // socket.on(SocketEventEnum.JOIN_CHAT_EVENT, onJoinChat);

    // NOTE: message
    socket.on(SocketEventEnum.NEW_MESSAGE, onNewMessage);
    // socket.on(MESSAGE_DELETE_EVENT, onMessageDelete);

    // NOTE: space
    socket.on(SocketEventEnum.NEW_SPACE_EVENT, onNewSpace);
    socket.on(SocketEventEnum.JOIN_SPACE_EVENT, onJoinSpace);
    socket.on(SocketEventEnum.LEAVE_SPACE_EVENT, onLeaveSpace);
    socket.on(SocketEventEnum.UPDATE_SPACE_NAME_EVENT, onSpaceNameChange);
    socket.on(SocketEventEnum.END_SPACE, onEndSpace);

    // NOTE: error
    socket.on(SocketEventEnum.SOCKET_ERROR_EVENT, onDisconnect);

    return () => {
      socket.off(SocketEventEnum.CONNECTED_EVENT, onConnect);
      socket.off(SocketEventEnum.DISCONNECT_EVENT, onDisconnect);

      socket.off(SocketEventEnum.NEW_MESSAGE, onNewMessage);
      socket.off(SocketEventEnum.TYPING_EVENT, handleOnSocketTyping);
      socket.off(SocketEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);

      socket.off(SocketEventEnum.NEW_SPACE_EVENT, onNewSpace);
      socket.off(SocketEventEnum.JOIN_SPACE_EVENT, onJoinSpace);
      socket.off(SocketEventEnum.LEAVE_SPACE_EVENT, onLeaveSpace);
      socket.off(SocketEventEnum.UPDATE_SPACE_NAME_EVENT, onSpaceNameChange);
      socket.off(SocketEventEnum.END_SPACE, onEndSpace);

      socket.off(SocketEventEnum.SOCKET_ERROR_EVENT, onDisconnect);

      socket.off(SocketEventEnum.UPDATE_CHAT_NAME_EVENT, onChatNameChange);
      // socket.off(MESSAGE_DELETE_EVENT, onMessageDelete);
    };
  }, [socket, chat]);

  // DONE:
  const getProfile = async (userId: string) => {
    const { error, data } = await fetcher(
      async () => await getUserProfile(userId as string)
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setUserProfile(data?.data);
  };

  return (
    <div className="contain">
      <Header />
      <div className="h-16 border bg-secondary rounded-md relative px-2 flex items-center justify-between overflow-hidden">
        <aside className="flex items-center gap-1">
          <p className="text-primary text-xl font-bold">{space?.name}</p>{" "}
          <Pen
            className="h-4 w-4 text-special cursor-pointer"
            onClick={() => setStartSpaceNameUpdate(!startSpaceNameUpdate)}
          />
        </aside>
        <div>
          {startSpaceNameUpdate && (
            <aside className="flex items-center gap-2 flex-grow">
              <Input
                value={spaceName}
                placeholder=" space name"
                className="w-max"
                type="text"
                onChange={(e) => setSpaceName(e.target.value)}
              />
              <Button size="sm" onClick={renameSpace}>
                Update
              </Button>
            </aside>
          )}
        </div>

        <img
          src={testBlack}
          alt=""
          className={`absolute top-0 right-4 rotate-12 h-40 w-32 ${
            startSpaceNameUpdate && "-z-10"
          }`}
        />
        <img
          src={testWhite}
          alt=""
          className={`absolute top-0 right-28 -rotate-12 h-40 w-32 ${
            startSpaceNameUpdate && "-z-10"
          }`}
        />
      </div>

      <div className="flex w-full py-2 h-body gap-2">
        {/* NOTE: space users - game space */}
        <div className=" lg:max-w-[70%] w-full border flex-shrink-0">
          <div className="grid grid-cols-3 grid-rows-3 gap-4 max-h-full">
            <div className="grid grid-rows-3 gap-2">
              <div className="bg-gray-200 p-4">Item 1</div>
              <div className="bg-gray-300 p-4">Item 2</div>
              <div className="bg-gray-400 p-4">Item 3</div>
            </div>

            <div className="row-span-3 border p-4">
              <img src={testWhite} alt="" className="h-18 w-14" />
            </div>

            <div className="grid grid-rows-3 gap-2">
              <div className="bg-gray-200 p-4">Item 5</div>
              <div className="bg-gray-300 p-4">Item 6</div>
              <div className="bg-gray-400 p-4">Item 7</div>
            </div>
          </div>
        </div>

        {/* NOTE: second section */}
        <div className="hidden w-full flex-grow lg:flex flex-col">
          {/* NOTE: tabs */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group">
              <div className="group-hover:text-special flex gap-1">
                <MessageCircle className="h-5 w-5" />{" "}
                <span className="">{messages.length}</span>
              </div>
            </div>
            <div className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group">
              <div className="group-hover:text-special flex gap-1">
                <Users className="h-5 w-5" />{" "}
                <span className="">{space?.participants.length}</span>
              </div>
            </div>
            <div className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group">
              <div className="group-hover:text-special flex gap-1">
                <LucideArrowDownWideNarrow className="h-5 w-5" />{" "}
              </div>
            </div>
            <div className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group">
              <Settings className="h-5 w-5 group-hover:text-special" />
            </div>
          </div>

          {/* NOTE: Chat */}

          <div className="bg-secondary flex-grow rounded-sm p-1 flex flex-col w-full">
            <div className="flex w-full justify-between gap-2 border-b border-b-white/5 py-1">
              <aside className="flex items-start gap-1 flex-shrink-0 text-primary ">
                <MessageCircle className="h-5 w-5" />
                <p className="">{chat?.name || "Space chat"}</p>
              </aside>
            </div>

            {/* NOTE: chat messages */}
            <div className="max-h-80 overflow-y-scroll py-1 flex flex-col gap-0.5">
              {loadingChat ? (
                <div className="flex justify-center items-center h-[calc(100%-88px)]">
                  <Skeleton className="w-14 h-4 rounded-full bg-primary" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="py-2 px-2 hover:bg-secondary-top rounded-md cursor-pointer group"
                  >
                    <div className="flex items- gap-2 justify-between">
                      <p className="text-xs text-special">
                        {message.sender.username}
                      </p>
                      <small className="inline-flex flex-shrink-0 w-max">
                        {moment(message.createdAt)
                          .add("TIME_ZONE", "hours")
                          .fromNow(true)}

                        <MoreVertical className="h-5 w-5 cursor-pointer" />
                      </small>
                    </div>
                    <p className=" group-hover:text-primary">
                      {message.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* NOTE: Send message */}
            <div className="mt-auto border-t border-t-white/5 pt-2 ">
              {isTyping && (
                <div className="flex items-center gap-2 mb-1 animate-pulse">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                  <small>A user is typing</small>
                </div>
              )}

              {selfTyping && (
                <div className="flex items-center gap-2 mb-1 animate-pulse">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                  <small>You are typing a message</small>
                </div>
              )}

              <form
                onSubmit={sendChatMessage}
                className="flex items-center gap-2"
              >
                <Input
                  className=""
                  placeholder="Send a message"
                  value={message}
                  onChange={(e) => handleOnMessageChange(e)}
                />
                <aside className="bg-special text-black p-1 rounded cursor-pointer group">
                  <Send
                    className="w-max group-hover:translate-x-1 duration-300 group-hover:rotate-45"
                    onClick={sendChatMessage}
                  />
                </aside>
              </form>
            </div>
          </div>

          {/* NOTE: participants */}
          <div className="hidden bg-secondary flex-grow rounded-sm p-1 fle flex-col w-full">
            <div className="flex w-full justify-between gap-2 border-b border-b-white/5 py-1">
              <aside className="flex items-start gap-1 flex-shrink-0 text-primary ">
                <Users className="h-5 w-5" />
                <p>Space Participants</p>
              </aside>
            </div>

            <div className="flex flex-col gap-3 py-2">
              {space?.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={
                      participant?.avatar?.imageURL
                        ? participant?.avatar?.imageURL
                        : "https://via.placeholder.com/100x100.png"
                    }
                    alt="user-avatar"
                    className="border border-special h-8 w-8 rounded-full"
                  />

                  <div className="group">
                    <p
                      className="text-xs group-hover:underline"
                      onClick={() => {
                        setDisplayUserProfile();
                        getProfile(participant.id);
                      }}
                    >
                      {participant.id}
                    </p>
                    <p className="text-sm text-special">
                      {participant.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {displayUserProfile && <UserProfileModal />}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="border w-full ">
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
        </div> */
}

// update chat name
{
  /* <Pen
                    className="h-4 w-4 text-special cursor-pointer"
                    onClick={() => setStartChatNameUpdate(!startChatNameUpdate)}
                {startChatNameUpdate && (
                  <aside className="flex items-center flex-col gap-1 flex-grow">
                    <Input
                      value={chatName}
                      placeholder="Update Chat name"
                      type="text"
                      onChange={(e) => setChatName(e.target.value)}
                    />
                    <Button onClick={renameChat}>Update name</Button>
                  </aside>
                )}
                  /> */
}
