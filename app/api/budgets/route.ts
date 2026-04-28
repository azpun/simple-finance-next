"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
}
