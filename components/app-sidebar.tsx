"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const navigationMenus = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const navigationMenusDashboard = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
  ];

  return (
    <Sidebar variant="sidebar" className={className}>
      <SidebarHeader className="pb-8">
        <h1 className="p-4 text-2xl">Simple Finance</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {pathname === "/dashboard" || pathname === "/transactions" ? (
            <>
              {navigationMenusDashboard.map(menu => (
                <SidebarMenuItem key={menu.name}>
                  <SidebarMenuButton asChild className="p-6">
                    <Link href={menu.href}>{menu.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          ) : (
            <>
              {navigationMenus.map(menu => (
                <SidebarMenuItem key={menu.name}>
                  <SidebarMenuButton asChild className="p-6">
                    <Link href={menu.href}>{menu.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link href="/auth/login">
            <Button variant={"outline"} size={"lg"}>
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant={"default"} size={"lg"}>
              Sign Up
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
