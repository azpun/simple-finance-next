// 'use client';
import AppSidebar from "@/components/app-sidebar";
import ReactQueryProvider from "@/components/providers/ReactQuery";
import SignButtons from "@/components/SignButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigationMenus = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Budget", href: "/budget" },
    { name: "Report", href: "/report" },
  ];
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar className="block md:hidden" />
      <SidebarInset>
        <header
          className={`flex h-16 shrink-0 items-center justify-between border-b px-4`}
        >
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center">
            <Link href={"/"}>
              <h1 className="text-lg">Simple Finance</h1>
            </Link>
            <Separator
              orientation="vertical"
              className="hidden my-4 ml-4 mr-2 md:block"
            />
            <div className="hidden md:block">
              <ul className="flex items-center">
                {navigationMenus.map(menu => (
                  <Link key={menu.name} href={menu.href}>
                    <li className="p-4.5 hover:bg-slate-700/30">{menu.name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SignButtons />
            <ThemeSwitcher variant="ghost" />
          </div>
        </header>
        <main className="px-2 py-2 md:px-10 md:py-6 lg:px-20">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
