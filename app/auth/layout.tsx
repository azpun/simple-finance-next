import ReactQueryProvider from "@/components/providers/ReactQuery";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col ">
      <header className="flex justify-start">
        <div className="p-4">
          <ThemeSwitcher variant="ghost" />
        </div>
      </header>
      <main className="px-4">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </main>
    </div>
  );
}
