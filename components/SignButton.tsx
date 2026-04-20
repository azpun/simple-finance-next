"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const SignButtons = () => {
  const { status } = useSession();
  return (
    <>
      {status === "authenticated" ? (
        <Button variant={"outline"} size={"lg"} onClick={() => signOut()}>
          Sign Out
        </Button>
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
            // onClick={() => }
          >
            Sign Up
          </Button>
        </>
      )}
    </>
  );
};

export default SignButtons;
