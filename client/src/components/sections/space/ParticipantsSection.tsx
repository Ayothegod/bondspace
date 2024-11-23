import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { useSpaceStore, useUserStore } from "@/lib/store/stateStore";
import { Users } from "lucide-react";

export default function ParticipantsSection() {
  const { space } = useSpaceStore();

  const { toast } = useToast();
  const { setUserProfile, setDisplayUserProfile } = useUserStore();

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
    <div className="bg-secondary flex-grow rounded-sm p-1 flex flex-col w-full">
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
              className="h-8 w-8 rounded-full"
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
              <p className="text-sm text-special">{participant.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
