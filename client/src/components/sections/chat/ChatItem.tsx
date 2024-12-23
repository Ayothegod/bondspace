/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";
import React, { useState } from "react";
import { ChatListItemInterface } from "@/lib/types/chat";
import { deleteOneOnOneChat } from "@/lib/fetch";
import { useAuthStore } from "@/lib/store/stateStore";
import { fetcher, getChatObjectMetadata } from "@/lib/hook/useUtility";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { Group, Link, Menu, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import GroupChatDetailsModal from "./GroupChatDetailsModal";

export const ChatItem: React.FC<{
  chat: ChatListItemInterface;
  onClick: (chat: ChatListItemInterface) => void;
  isActive?: boolean;
  unreadCount?: number;
  onChatDelete: (chatId: string) => void;
}> = ({ chat, onClick, isActive, unreadCount = 0, onChatDelete }) => {
  // console.log(chat);

  // PENDING:
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [openOptions, setOpenOptions] = useState(false);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  // const [openGroupInfo, setOpenGroupInfo] = useState(false);

  const deleteChat = async () => {
    const { error } = await fetcher(
      async () => await deleteOneOnOneChat(chat.id)
    );
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    onChatDelete(chat.id);
  };

  if (!chat) return;
  return (
    <>
      {/* <GroupChatDetailsModal
        open={openGroupInfo}
        onClose={() => {
          setOpenGroupInfo(false);
        }}
        chatId={chat._id}
        onGroupDelete={onChatDelete}
      /> */}
      <div
        role="button"
        onClick={() => onClick(chat)}
        onMouseLeave={() => setOpenOptions(false)}
        className={clsx(
          "group p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-secondary",
          isActive ? "border-[1px] border-zinc-500 bg-secondary" : "",
          unreadCount > 0
            ? "border-[1px] border-success bg-success/20 font-bold"
            : ""
        )}
      >
        {/* NOTE: open group chat modal */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className="self-center p-1 relative"
        >
          <Menu className="h-6 group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
          <div
            className={clsx(
              "z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary",
              openOptions ? "block" : "hidden"
            )}
          >
            {chat.isGroupGame ? (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenGroupInfo(true);
                }}
                role="button"
                className="p-4 w-full rounded-lg inline-flex items-center hover:bg-secondary"
              >
                <Group className="h-4 w-4 mr-2" /> About group
              </p>
            ) : (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  const ok = confirm(
                    "Are you sure you want to delete this chat?"
                  );
                  if (ok) {
                    deleteChat();
                  }
                }}
                role="button"
                className="p-4 text-danger rounded-lg w-full inline-flex items-center hover:bg-secondary"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete chat
              </p>
            )}
          </div>
        </button>

        {/* NOTE: set chat avatar  */}
        <div className="flex justify-center items-center flex-shrink-0">
          {chat.isGroupGame ? (
            <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
              {chat.players.slice(0, 3).map((player, i) => {
                // console.log(player);

                return (
                  <div key={player.id} className="flex items-center gap-2">
                    <Skeleton 
                    className={clsx(
                      "w-8 h-8 border-[1px] bg-primary  border-white rounded-full absolute outline outline-4 outline-dark group-hover:outline-secondary",
                      i === 0
                        ? "left-0 z-[3]"
                        : i === 1
                        ? "left-2.5 z-[2]"
                        : i === 2
                        ? "left-[18px] z-[1]"
                        : ""
                    )}
                     />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 bg-primary rounded-full " />
            </div>
          )}
        </div>

        {/* NOTE: set cover name/dat on chat */}
        <div className="w-full">
          <p className="truncate-1">
            {getChatObjectMetadata(chat, user!).title}
          </p>
          <div className="w-full inline-flex items-center text-left">
            <small className="text-white/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
              {getChatObjectMetadata(chat, user!).lastMessage}
            </small>
          </div>
        </div>

        {/* NOTE: time ago and unread messages */}
        <div className="flex text-white/50 h-full text-sm flex-col justify-between items-end">
          <small className="mb-2 inline-flex flex-shrink-0 w-max">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>

          {unreadCount <= 0 ? (
            "null"
          ) : (
            <span className="bg-success h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
