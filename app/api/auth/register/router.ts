import prisma from "@/lib/connectDB";
import { RegisterInputType } from "@/validations/auth.validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = (await req.json()) as RegisterInputType;
  const user = await prisma.users.create({
    data: {
      fullname: data.name,
      email: data.email,
      password: data.password,
    },
  });
  return NextResponse.json(user);
}
