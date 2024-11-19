// import Side from "@/components/sections/Side";
import { useAuthStore } from "@/lib/store/stateStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login", {});
    }
  }, [user, navigate]);

  if (!user) {
    return;
  }

  return (
    <div className="">
      {/* <SidebarProvider>
      </SidebarProvider> */}
      <div className="flex w-full">
        {/* <Side /> */}

        <main className="w-full">
          <div className="w-full min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
