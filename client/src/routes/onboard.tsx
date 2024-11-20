import Header from "@/components/sections/Header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/stateStore";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Onboard() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login", {});
    }
  }, [user, navigate]);

  if (!user) {
    return;
  }

  const isMainChatPage = location.pathname === "/onboard";

  const joinSpace = () => {
    return navigate("/onboard/join");
  };

  const createSpace = () => {
    return navigate("/onboard/create");
  };

  return (
    <div className="contain">
      <Header />

      <div className="max-w-3xl mx-auto p-4 mt-10">
        <div className="text-center md:text-left">
          <h2 className="text-3xl text-primary">
            Welcome to <span className="text-special">Bondspace</span>{" "}
          </h2>
          <p>Build Bonds, Not Just Networks.</p>
        </div>

        {isMainChatPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-4">
            <div className="bg-secondary rounded p-4">
              <div className=" text-center">
                <p className="text-xl font-semibold text-primary">Join space</p>
                <p className="text-sm">
                  Already have a room in mind? Step right in! and you're all set
                  to join the conversation.
                </p>
              </div>
              <Button
                onClick={joinSpace}
                variant={"outline"}
                className="w-full mt-10"
              >
                Join Space
              </Button>
            </div>

            <div className="bg-secondary rounded p-4">
              <div className=" text-center">
                <p className="text-xl font-semibold text-primary">
                  Create new space
                </p>
                <p className="text-sm">
                  Start fresh and bring your crew together! Create a new space,
                  set the vibe, and make it yours.
                </p>
              </div>
              <Button onClick={createSpace} className="w-full mt-10">
                Create Space
              </Button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
