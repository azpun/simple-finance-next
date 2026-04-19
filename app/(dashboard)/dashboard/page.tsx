"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
