import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET notifications for the current user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const userId = decoded.userId;

    // Fetch notifications from database
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const senderId = decoded.userId;

    const { userId, title, message, fullMessage, senderName, type, relatedId } = await request.json();

    // Validate required fields
    if (!userId || !title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        fullMessage,
        senderName,
        type,
        relatedId,
        isRead: false,
      },
    });

    console.log("Notification created in database:", notification);

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

// PUT - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const userId = decoded.userId;

    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "Invalid notification IDs" }, { status: 400 });
    }

    // Update notifications in database
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        isRead: true,
      },
    });

    console.log("Marked notifications as read in database:", { notificationIds, userId });

    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
