"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Transactions() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const isMobile = useIsMobile();

  const dummyData = [];
  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl">Transactions</h1>
        <p>Here&apos;s your transaction list</p>
      </div>
      <div className="px-6">This is for Filter and Search</div>
      <div>
        <div className="p-6">
          <h1 className="text-2xl">Transaction List</h1>
          <p>Here&apos;s your transaction list</p>
        </div>
      </div>
    </div>
  );
}
