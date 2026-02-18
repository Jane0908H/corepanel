import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import Task from "@/models/Task";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const url = new URL(req.url);
    const taskId = url.pathname.split("/").pop();


    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (task.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
   
    const { status, title } = await req.json();

    if (title) {
    task.title = title;
    }

    if (["todo", "doing", "done"].includes(status)) {
    task.status = status;
    }

    await task.save();

    return NextResponse.json(task);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
