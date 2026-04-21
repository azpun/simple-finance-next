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
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import SignButtons from "./SignButton";

export default function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { status } = useSession();
  // console.log(status);
  const router = useRouter();

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
        {/* <SignButtons /> */}
        {status === "authenticated" ? (
          <Button variant={"destructive"} size={"lg"} onClick={() => signOut()}>
            Sign Out
          </Button>
        ) : (
          <>
            <Button variant={"outline"} size={"lg"} onClick={() => signIn()}>
              Sign In
            </Button>

            <Button
              variant={"default"}
              size={"lg"}
              onClick={() => router.push("/auth/register")}
            >
              Sign Up
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
