import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeaders, JWTPayload } from "@/lib/auth";
import { RoleAuthorization } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = getTokenFromHeaders(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const filterUserId = userIdParam ? parseInt(userIdParam) : null;

    let tasks;

    if (payload.role === "MANAGER") {
      // If userId is provided, filter by that user
      if (filterUserId) {
        tasks = await prisma.task.findMany({
          where: { userId: filterUserId },
          orderBy: { createdAt: "desc" },
        });
      } else {
        // Otherwise get all tasks
        tasks = await prisma.task.findMany({
          orderBy: { createdAt: "desc" },
        });
      }
    } else {
      // Regular users can only see their own tasks
      tasks = await prisma.task.findMany({
        where: { userId: payload.userId },
        orderBy: { createdAt: "desc" },
      });
    }

    // Fetch user data separately to avoid relation issues
    const userIds = [...new Set(tasks.map(task => task.userId).filter(Boolean))];
    const users = userIds.length > 0 ? await prisma.user.findMany({
      where: { id: { in: userIds as number[] } },
      select: { id: true, name: true, email: true },
    }) : [];

    const userMap = users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {} as Record<number, any>);

    // Attach user data to tasks
    const tasksWithUsers = tasks.map(task => ({
      ...task,
      user: task.userId ? userMap[task.userId] || null : null,
    }));

    return NextResponse.json({ tasks: tasksWithUsers });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// CREATE a new task
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = getTokenFromHeaders(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user has permission to create tasks
    // Fetch user details to get name for authorization
    const userFromDb = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!userFromDb) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    if (!RoleAuthorization.canCreateTask(userFromDb)) {
      return NextResponse.json(
        { error: "Insufficient permissions to create tasks" },
        { status: 403 }
      );
    }

    const { title, description, status, priority, dueDate, userId } =
      await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Managers can assign tasks to any user, regular users can only create their own
    let assignedUserId = payload.userId;
    
    if (payload.role === "MANAGER" && userId) {
      // Manager is assigning to someone else
      // Convert userId to number if it's a string
      const targetUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      if (isNaN(targetUserId)) {
        return NextResponse.json(
          { error: "Invalid user ID format." },
          { status: 400 }
        );
      }
      
      // Validate that the user exists before assigning
      const userExists = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, name: true, role: true }
      });
      
      if (!userExists) {
        return NextResponse.json(
          { error: "User not found. Cannot assign task to non-existent user." },
          { status: 400 }
        );
      }
      
      assignedUserId = targetUserId;
    } else if (payload.role === "USER") {
      // Regular user creating task for themselves (this should be blocked)
      return NextResponse.json(
        { error: "Users cannot create tasks. Only managers can create and assign tasks." },
        { status: 403 }
      );
    } else {
      // Manager creating task for themselves
    }

    // Ensure assignedUserId is not null and is a valid number
    if (!assignedUserId) {
      return NextResponse.json(
        { error: "User ID is required for task assignment." },
        { status: 400 }
      );
    }

    if (isNaN(assignedUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID format." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: assignedUserId,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
