"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  //   useSidebar,
} from "./ui/sidebar";

export default function AppSidebar() {
  //   const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  return (
    <Sidebar className="md:hidden">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
