/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from "clsx";
import { Calendar, Link, Users } from "lucide-react";
import { useState } from "react";

export default function Createpace() {
  const [disable, setDisable] = useState(true);
  const createLink = () => {};
  const groupSpace = () => {};


  // create a modal with url to give the link, let them enter the space etc

  return (
    <div>
      <h1 className="text-primary font-bold text-xl mt-4 text-special">
        Create-Space
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
        <div
          className="bg-secondary rounded p-8 group group-hover::bg-secondary-top flex flex-col gap-2 items-center justify-center text-center cursor-pointer hover:bg-secondary-top hover:text-primary"
          onClick={createLink}
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
