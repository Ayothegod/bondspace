/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/context/useSocketContext";
import {
  getChatMessagesFunc,
  getChatsDetails,
  getSpaceDetails,
  getUserProfile,
  renameSpaceFunc,
  SocketEventEnum,
} from "@/lib/fetch";
import { fetcher, LocalStorage } from "@/lib/hook/useUtility";
import {
  ChatItemInterface,
  MessageInterface,
  SpaceInterface,
} from "@/lib/types/chat";
import { useEffect, useRef, useState } from "react";
// import { ChatItem } from "@/components/sections/chat/ChatItem";
import {
  useChatStore,
  useMessageStore,
  useSpaceStore,
  useUserStore,
} from "@/lib/store/stateStore";
import Header from "@/components/sections/Header";
import {
  LucideArrowDownWideNarrow,
  MessageCircle,
  Pen,
  Settings,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserProfileModal from "@/components/sections/UserProfileModal";

import testWhite from "@/assets/white/Clovers_A_white.png";
import testBlack from "@/assets/black/Clovers_A_black.png";

import { parseAsString, useQueryState } from "nuqs";
import ChatSection from "@/components/sections/chat/Chat";
import ParticipantsSection from "@/components/sections/space/ParticipantsSection";
import SettingsSection from "@/components/sections/space/SettingsSection";

interface CurrentSpace {
  state: {
    space: SpaceInterface;
  };
}

export default function Play() {
  const { chat, setChat } = useChatStore();
  const { space, setSpace } = useSpaceStore();
  const { messages, setMessages } = useMessageStore();
  const { displayUserProfile, setDisplayUserProfile, setUserProfile } =
    useUserStore();

  const { socket } = useSocket();
  const { toast } = useToast();

  const [isConnected, setIsConnected] = useState(false);
  const currentSpace = useRef<CurrentSpace | null>(null);

  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [spaceName, setSpaceName] = useState("");
  const [startSpaceNameUpdate, setStartSpaceNameUpdate] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

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

  const [action, setAction] = useQueryState(
    "action",
    parseAsString.withDefault("chat")
  );

  return (
    <div className="contain">
      <Header />

      <div className="h-16 border bg-secondary rounded-md relative px-2 flex items-center justify-between overflow-hidden">
        <aside className="flex items-center gap-1">
          <p className="text-primary text-xl font-bold">{space?.name}</p>
          <p className="text-primary text-xl font-bold">{space?.id}</p>

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
        <div className=" lg:max-w-[70%] w-full flex-shrink-0 h-full rounded-md overflow-hidde">
          <div className="grid grid-cols-3 h-ful">
            <div
              className={`grid grid-rows-3 gap-2 ${
                space?.participants.length && space.participants.length > 6
                  ? "h-grid-body-extra debug"
                  : "h-grid-body debug"
              }`}
            >
              {space?.participants.slice(0, 3).map((participant) => (
                <div
                  key={participant.id}
                  className="bg-gray-800 p-4 flex items-center justify-center"
                >
                  <img
                    src={testWhite}
                    alt="Static Image"
                    className="h-18 w-14"
                  />
                  {participant.username}
                </div>
              ))}
            </div>

            <div className="row-span-3 p-4">
              <img src={testWhite} alt="Static Image" className="h-18 w-14" />
            </div>

            <div className="grid grid-rows-3 gap-2 h-full">
              {space?.participants.slice(3, 6).map((participant) => (
                <div
                  key={participant.id}
                  className="bg-gray-300 p-4 flex items-center justify-center"
                >
                  {participant.username}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block pt-2 h-20">
            <div className="bg-secondary h-full grid grid-cols-4 gap-2 place-items-center px-2">
              {space?.participants.slice(6, 10).map((participant) => (
                <div
                  key={participant.id}
                  className="bg-secondary-top rounded-md p-3 flex items-center justify-center gap-2 cursor-pointer group h-max w-full"
                >
                  <img
                    src={
                      participant?.avatar?.imageURL
                        ? participant?.avatar?.imageURL
                        : "https://via.placeholder.com/100x100.png"
                    }
                    alt="user-avatar"
                    className="h-8 w-8 rounded-full"
                  />

                  <p
                    className="text-sm font-semibold group-hover:underline group-hover:text-special"
                    onClick={() => {
                      setDisplayUserProfile();
                      getProfile(participant.id);
                    }}
                  >
                    {participant.username}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOTE: second section */}
        <div className="hidden w-full flex-grow lg:flex flex-col max-h-full">
          {/* NOTE: tabs */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div
              className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group"
              onClick={() => setAction("chat")}
            >
              <div className="group-hover:text-special flex gap-1">
                <MessageCircle className="h-5 w-5" />{" "}
                <span className="">{messages.length}</span>
              </div>
            </div>
            <div
              className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group"
              onClick={() => setAction("participant")}
            >
              <div className="group-hover:text-special flex gap-1">
                <Users className="h-5 w-5" />{" "}
                <span className="">{space?.participants.length}</span>
              </div>
            </div>
            <div
              className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group"
              onClick={() => setAction("leaderboard")}
            >
              <div className="group-hover:text-special flex gap-1">
                <LucideArrowDownWideNarrow className="h-5 w-5" />{" "}
              </div>
            </div>
            <div
              className="bg-secondary w-full p-1 rounded-md flex items-center justify-center cursor-pointer text-sm group"
              onClick={() => setAction("settings")}
            >
              <Settings className="h-5 w-5 group-hover:text-special" />
            </div>
          </div>

          {action === "chat" && (
            <ChatSection
              chat={chat}
              loadingChat={loadingChat}
              isConnected={isConnected}
              isTyping={isTyping}
            />
          )}

          {action === "participant" && <ParticipantsSection/>}

          {action === "settings" && <SettingsSection/>}

          {displayUserProfile && <UserProfileModal />}
        </div>
      </div>
    </div>
  );
}
