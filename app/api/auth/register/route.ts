import { validateRegister } from "../../../../validations/auth.validation";
import prisma from "@/lib/connectDB";
import { RegisterInputType } from "@/validations/auth.validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const validated = validateRegister(data);
  console.log("zod:", validated);

  if (!validated.success) {
    return NextResponse.json(validated.error.issues, { status: 400 });
  }

  // const user = await prisma.users.create({
  //   data: {
  //     fullname: validated.data.name,
  //     email: validated.data.email,
  //     password: validated.data.password,
  //   },
  // });
  // return NextResponse.json(user);
}
