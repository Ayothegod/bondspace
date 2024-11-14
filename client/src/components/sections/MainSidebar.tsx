import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Group,
  Home,
  LogOut,
  Phone,
  Save,
  Settings,
  Trash,
  Upload,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";

// /group/chat/iwe832
// /chat/ysdu838

const items = [
  {
    title: "Chats",
    url: "/home",
    icon: Home,
  },
  {
    title: "Groups",
    url: "/group",
    icon: Group,
  },
  {
    title: "Status",
    url: "/status",
    icon: Upload,
  },
  {
    title: "Calls",
    url: "#",
    icon: Phone,
  },
  {
    title: "Archived Chat",
    url: "#",
    icon: Trash,
  },
  {
    title: "Saved Messages",
    url: "#",
    icon: Save,
  },
];

const footerItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/Settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export default function MainSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const {
    // setOpen,
    isMobile,
  } = useSidebar();

  return (
    <div className="hidden lg:flex">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuButton asChild>
              <a href="#">
                <Home className="" />
                <p className="text-2xl text-foreground">Converse</p>
                {isMobile && <SidebarTrigger />}
              </a>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      variant={path === item.url ? "outline" : "default"} asChild
                    >
                      <a
                        href={item.url}
                        className={`${path === item.url && "text-foreground"}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-base">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  variant={path === item.url ? "outline" : "default"} asChild
                >
                  <a
                    href={item.url}
                    className={`${path === item.url && "text-foreground"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-base">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
