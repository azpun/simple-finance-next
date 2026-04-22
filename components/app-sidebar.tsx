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
import { Card } from "./ui/card";
import Image from "next/image";

// import SignButtons from "./SignButton";

export default function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
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
    { name: "Report", href: "/report" },
  ];

  return (
    <Sidebar variant="sidebar" className={className}>
      <SidebarHeader className="pb-8">
        <h1 className="p-4 text-2xl">Simple Finance</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {pathname === "/dashboard" ||
          pathname === "/transactions" ||
          pathname === "/report" ||
          pathname === "/profile" ? (
            <>
              {navigationMenusDashboard.map(menu => (
                <SidebarMenuItem key={menu.name} className={`px-4`}>
                  <SidebarMenuButton
                    asChild
                    className="p-6"
                    isActive={pathname === menu.href}
                  >
                    <Link href={menu.href}>{menu.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          ) : (
            <>
              {navigationMenus.map(menu => (
                <SidebarMenuItem key={menu.name} className={`px-4`}>
                  <SidebarMenuButton
                    asChild
                    className="p-6"
                    isActive={pathname === menu.href}
                  >
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
          <div className="flex flex-col gap-2">
            <Link href="/profile">
              <Card className="flex flex-row items-center pb-0 m-0">
                <Image
                  src="/user-default.svg"
                  alt="user"
                  width={50}
                  height={50}
                  className="my-2 ml-2"
                />
                <div>
                  <h3 className="font-bold">{session?.user?.name}</h3>
                </div>
              </Card>
            </Link>
            <Button
              variant={"default"}
              size={"lg"}
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant={"destructive"}
              size={"lg"}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
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
