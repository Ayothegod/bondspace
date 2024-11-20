// import { Users } from "lucide-react";
// import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { joinSpace } from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { useAuthStore, useSpaceStore } from "@/lib/store/stateStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinSpace() {
  const { setSpace } = useSpaceStore();
  const { user } = useAuthStore();

  const { toast } = useToast();
  const navigate = useNavigate();

  // const [disable, setDisable] = useState(true);
  const [spaceId, setSpaceId] = useState("");
  

  const join = async () => {
    const { error, data } = await fetcher(
      async () => await joinSpace(spaceId, user?.id as string)
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

    setSpace("updateStore", data?.data);
    return navigate("/play");
  };

  // create a modal with url to give the link, let them enter the space etc

  return (
    <div>
      <div className=" flex flex-col items-center justify-center ">
        <h1 className="text-primary font-bold text-xl mt-4 text-special">
          Join-Space
        </h1>

        <div className="bg-secondary rounded p-4 mt-4 w-1/2">
          <p className="text-sm mb-1">Enter the spaceId to get started.</p>
          <Input
              placeholder="SpaceId here"
              type="text"
              onChange={(e) => setSpaceId(e.target.value)}
            />

          <Button
            onClick={join}
            variant={"default"}
            className="w-full mt-4"
          >
            Take me there!
          </Button>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">

        <div
          className="bg-secondary rounded p-8 group group-hover::bg-secondary-top flex flex-col gap-2 items-center justify-center text-center cursor-pointer hover:bg-secondary-top hover:text-primary"
          onClick={groupSpace}
        >
          <Users className="group-hover:animate-bounce h-8 w-8" />
          <p className="font-semibold">Join Space</p>
        </div>
      </div> */}
    </div>
  );
}
