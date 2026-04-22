// app/api/auth/register/route.ts
import { validateRegister } from "../../../../validations/auth.validation";
import prisma from "@/lib/connectDB";
import { hashPassword } from "@/lib/hash";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const validated = validateRegister(data);

  if (!validated.success) {
    return NextResponse.json({
      success: false,
      status: 400,
      message: "Registration failed",
      errors: validated.error.issues,
    });
  }

  validated.data.password = `${await hashPassword(validated.data.password)}`;

  const user = await prisma.users.create({
    data: {
      fullname: validated.data.name,
      email: validated.data.email,
      password: validated.data.password,
    },
  });

  return NextResponse.json({
    success: true,
    status: 201,
    message: "Registration successful",
    data: {
      id: user.id,
      email: user.email,
      name: user.fullname,
    },
  });
}
