import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const tasks = await Task.find({
      user: decoded.userId,   
    });


    return NextResponse.json(tasks);

  } catch (error) {
    console.error("TASKS API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
     

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  const { title, status, priority } = await req.json();

  const task = await Task.create({
    title,
    status,
    priority,
    user: decoded.userId,
  });

  return NextResponse.json(task);
}


export async function DELETE(req: Request) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  const { id } = await req.json();

  await Task.findOneAndDelete({
    _id: id,
    user: decoded.userId,
  });

  return NextResponse.json({ message: "Deleted" });
}

