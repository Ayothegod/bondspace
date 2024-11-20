/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createSpace } from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { useSpaceStore } from "@/lib/store/stateStore";
import clsx from "clsx";
import { Calendar, Link, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Createpace() {
  const { setSpace, space } = useSpaceStore();
  // const { socket } = useSocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [disable, setDisable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [spaceName, setSpaceName] = useState("");

  const createLink = async () => {
    const { error, data } = await fetcher(
      async () => await createSpace(spaceName)
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

  const groupSpace = () => {};
  // console.log(space);

  // create a modal with url to give the link, let them enter the space etc

  // for createLink, after success, provide the link and a join button (navigate("/play")) simple also follow google meet for share etc

  return (
    <div>
      <h1 className="text-primary font-bold text-xl mt-4 text-special">
        Create-Space
      </h1>

      {showModal && (
        <div>
          <p>Enter the name of the space</p>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowModal(!showModal)}>Cancel</Button>
            <Input
              placeholder="space name here"
              type="text"
              onChange={(e) => setSpaceName(e.target.value)}
            />
            <Button onClick={createLink}>Create space</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
        <div
          className="bg-secondary rounded p-8 group group-hover::bg-secondary-top flex flex-col gap-2 items-center justify-center text-center cursor-pointer hover:bg-secondary-top hover:text-primary"
          onClick={() => setShowModal(!showModal)}
        >
          <Link className="group-hover:animate-bounce h-8 w-8" />
          <p className="font-semibold">Create Link</p>
        </div>

        <button disabled={disable}>
          <div
            className={clsx(
              "bg-secondary rounded p-8 flex flex-col gap-2 items-center justify-center text-center",
              disable
                ? "text-secondary-top"
                : " group hover:bg-secondary-top hover:text-primary"
            )}
          >
            <Calendar className="group-hover:animate-bounce h-8 w-8" />
            <p className="font-semibold">Schedule</p>
          </div>
        </button>

        <div
          className="bg-secondary rounded p-8 group group-hover::bg-secondary-top flex flex-col gap-2 items-center justify-center text-center cursor-pointer hover:bg-secondary-top hover:text-primary"
          onClick={groupSpace}
        >
          <Users className="group-hover:animate-bounce h-8 w-8" />
          <p className="font-semibold">Group Space</p>
        </div>
      </div>
    </div>
  );
}
