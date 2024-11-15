import ThemeToggle from "@/components/build/ThemeToggle";
import Side from "@/components/sections/Side";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <SidebarProvider>
        <div className="flex w-full">
          <Side />

          <main className="w-full">
            <ThemeToggle />
            <div className="w-full min-h-screen">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
