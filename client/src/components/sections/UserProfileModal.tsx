import { useUserStore } from "@/lib/store/stateStore";
import { X } from "lucide-react";

export default function UserProfileModal() {
  const { userProfile, setDisplayUserProfile } = useUserStore();

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,.7)] flex items-center justify-center h-screen text-primary px-4 md:px-8">
      <div
        className="absolute top-2 right-2 bg-secondary-top p-2 rounded-md cursor-pointer group"
        onClick={setDisplayUserProfile}
      >
        <X className="group-hover:scale-110" />
      </div>

      <div className="bg-secondary-top py-10 px-8 rounded-md w-full sm:w-2/3 md:w-1/2 flex gap-4">
        <img
          src={
            userProfile?.avatar?.imageURL
              ? userProfile?.avatar?.imageURL
              : "https://via.placeholder.com/100x100.png"
          }
          alt="User-Avatar"
          className="border border-special h-24 w-24 rounded-full flex-shrink-0"
        />

        <div className="flex flex-col gap-2">
          <p>
            User ID:{" "}
            <span className="text-sm font-semibold text-special">
              {userProfile?.id}
            </span>
          </p>
          <p>
            Username:{" "}
            <span className="text-sm font-semibold text-special">
              {userProfile?.username}
            </span>
          </p>
          <p>
            Full Name:{" "}
            <span className="text-sm font-semibold text-special">
              {userProfile?.username}
            </span>
          </p>
          <p>
            Email Address:{" "}
            <span className="text-sm font-semibold text-special">
              {userProfile?.email}
            </span>
          </p>

          <small className="mt-8">Past Records...</small>
        </div>
      </div>
    </div>
  );
}
