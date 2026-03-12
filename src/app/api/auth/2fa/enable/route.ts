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

    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Valid 6-digit code is required" },
        { status: 400 }
      );
    }

    // For demo purposes, accept any 6-digit code starting with "123"
    if (!code.startsWith("123")) {
      return NextResponse.json(
        { error: "Invalid authentication code" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Verify the TOTP code against the user's secret
    // 2. Store the 2FA secret for the user
    // 3. Enable 2FA for the user

    // For demo, we'll just simulate enabling 2FA
    return NextResponse.json(
      { message: "Two-factor authentication enabled successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Enable 2FA error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
