import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { RoleAuthorization } from "@/lib/authorization";

export async function DELETE(request: NextRequest) {
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

    // Fetch user details for authorization
    const userFromDb = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!userFromDb) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    if (!RoleAuthorization.canManageUsers(userFromDb as any)) {
      return NextResponse.json(
        { error: "Only managers can delete all tasks" },
        { status: 403 }
      );
    }

    // Delete all tasks
    const deleteResult = await prisma.task.deleteMany({});

    return NextResponse.json({
      message: "All tasks deleted successfully",
      deletedCount: deleteResult.count
    }, { status: 200 });

  } catch (error) {
    console.error("Delete all tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
