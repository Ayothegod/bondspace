/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/context/useSocketContext";
import { sendMessageFunc, SocketEventEnum } from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { useAuthStore, useMessageStore } from "@/lib/store/stateStore";
import { ChatItemInterface } from "@/lib/types/chat";
import { LoaderIcon, MessageCircle, MoreVertical, Send } from "lucide-react";
import moment from "moment";
import { useRef, useState } from "react";

export default function ChatSection({
  chat,
  loadingChat,
  isConnected,
  isTyping,
}: {
  chat: ChatItemInterface | null;
  loadingChat: boolean;
  isConnected: boolean;
  isTyping: boolean;
}) {
  const { user } = useAuthStore();
  const { messages, setMessages } = useMessageStore();

  const { socket } = useSocket();
  const { toast } = useToast();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = useState("");
  const [selfTyping, setSelfTyping] = useState(false);
  // const [localSearchQuery, setLocalSearchQuery] = useState("");

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

  return (
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
              <p className=" group-hover:text-primary">{message.content}</p>
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

        <form onSubmit={sendChatMessage} className="flex items-center gap-2">
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
  );
}
