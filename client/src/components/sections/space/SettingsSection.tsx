import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { leaveSpaceFunc } from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import {
  useAuthStore,
  useChatStore,
  useSpaceStore,
} from "@/lib/store/stateStore";
import { Settings } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsSection() {
  const navigate = useNavigate();
  const { space, setSpace, clearSpace } = useSpaceStore();
  const { user } = useAuthStore();
  const { clearChat } = useChatStore();

  const { toast } = useToast();

  const leaveSpace = async () => {
    const { error, data } = await fetcher(
      async () => await leaveSpaceFunc(space?.id as string, user?.id as string)
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
    console.log(data);

    setSpace("updateState", data?.data);
    clearSpace();
    clearChat();
    return navigate("/onboard");
  };

  useEffect(() => {
    if (!space) {
      return navigate("/onboard", {});
    }
  }, [space, navigate]);

  if (!space) {
    return;
  }

  return (
    <div className="bg-secondary flex-grow rounded-sm p-1 flex flex-col w-full">
      <div className="flex w-full justify-between gap-2 border-b border-b-white/5 py-1">
        <aside className="flex items-start gap-1 flex-shrink-0 text-primary ">
          <Settings className="h-5 w-5" />
          <p>Space Settings</p>
        </aside>
      </div>

      <div className="flex flex-col gap-2 px-2 my-2">
        <Button onClick={leaveSpace}>Leave Space</Button>
        <Button>End Space</Button>
      </div>
    </div>
  );
}
