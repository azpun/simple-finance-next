import { auth } from "@/auth";
// import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = auth(async req => {
  if (!req.auth?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
});
