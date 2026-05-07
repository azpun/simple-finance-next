"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="py-4">
      <Card>
        <CardHeader className="text-2xl text-center md:text-3xl lg:text-4xl">
          Profile
        </CardHeader>
        <CardContent>
          <Image
            src={user.image || "/user-default.svg"}
            alt="user-profile"
            width={200}
            height={200}
            className="mx-auto"
          />
          <CardTitle className="text-center">{user.name}</CardTitle>
          <p className="my-4 text-center">Email: {user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
