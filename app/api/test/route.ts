import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "DB connected successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message , msg:"failure"},
      { status: 500 }
    );
  }
}