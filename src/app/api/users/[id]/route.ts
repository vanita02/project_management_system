import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";
import { RoleAuthorization } from "@/lib/authorization";

// DELETE user (managers only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: "Only managers can delete users" },
        { status: 403 }
      );
    }

    const userIdToDelete = params.id;

    if (!userIdToDelete) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const targetUserId = parseInt(userIdToDelete);

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Prevent users from deleting themselves
    if (targetUserId === payload.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user (tasks will be deleted due to cascade)
    await prisma.user.delete({
      where: { id: targetUserId }
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
