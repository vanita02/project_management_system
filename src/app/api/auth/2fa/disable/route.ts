import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromHeaders } from "@/lib/auth";

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

    // In a real implementation, you would:
    // 1. Remove the 2FA secret for the user
    // 2. Disable 2FA for the user
    // 3. Update user preferences

    // For demo, we'll just simulate disabling 2FA
    return NextResponse.json(
      { message: "Two-factor authentication disabled successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Disable 2FA error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
