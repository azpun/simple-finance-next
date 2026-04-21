"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

const SignButtons = () => {
  const { status } = useSession();
  const router = useRouter();
  const isMobile = useIsMobile();
  // console.log(isMobile);

  return (
    <>
      {status === "authenticated" ? (
        <>
          <Button
            variant={"destructive"}
            size={"lg"}
            className={`${isMobile ? "hidden" : "hidden md:block"} cursor-pointer `}
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
          <Button
            variant={"default"}
            size={"lg"}
            className={`${isMobile ? "hidden" : "hidden md:block"} cursor-pointer `}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
          <Image
            src="/user-default.svg"
            alt="user"
            width={40}
            height={40}
            className={`${isMobile ? "hidden" : "hidden md:block"} cursor-pointer `}
          />
        </>
      ) : (
        <>
          <Button
            variant={"outline"}
            size={"lg"}
            className="hidden cursor-pointer md:block"
            onClick={() => signIn()}
          >
            Sign In
          </Button>

          <Button
            variant={"default"}
            size={"lg"}
            className="hidden cursor-pointer md:block"
            onClick={() => router.push("/auth/register")}
          >
            Sign Up
          </Button>
        </>
      )}
    </>
  );
};

export default SignButtons;
