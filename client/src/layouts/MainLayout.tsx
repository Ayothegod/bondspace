// import ThemeToggle from "@/components/build/ThemeToggle";
// import MainSidebar from "@/components/sections/MainSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <SidebarProvider>
        <div className="flex w-full">
          {/* <MainSidebar /> */}

          <main className="w-full">
            {/* <SidebarTrigger/> */}
            {/* <ThemeToggle /> */}
            <div className="w-full min-h-screen">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
