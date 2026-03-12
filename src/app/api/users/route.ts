import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeaders, hashPassword } from "@/lib/auth";
import { RoleAuthorization } from "@/lib/authorization";

// GET all users (managers only)
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

    // Only managers can view all users
    if (payload.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { task: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new user (managers only)
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

    // Fetch user details for authorization
    const userFromDb = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!userFromDb) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    if (!RoleAuthorization.canManageUsers(userFromDb)) {
      return NextResponse.json(
        { error: "Only managers can create users" },
        { status: 403 }
      );
    }

    const requestData = await request.json();
    const name = requestData.name;
    const email = requestData.email;
    const password = requestData.password;
    const role = requestData.role;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["USER", "MANAGER"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either USER or MANAGER" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
