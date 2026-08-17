export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { DbService } from "@/lib/db";

export async function GET() {
  try {
    const data = await DbService.getDb();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load database";
    console.error("API GET Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action in request body" }, { status: 400 });
    }

    switch (action) {
      case "updateCompletion": {
        const { userId, problemId, completed } = body;
        if (!userId || !problemId) {
          return NextResponse.json({ error: "Missing userId or problemId" }, { status: 400 });
        }
        const data = await DbService.updateCompletion(userId, problemId, completed);
        return NextResponse.json({ success: true, data });
      }

      case "updateNote": {
        const { userId, problemId, note } = body;
        if (!userId || !problemId) {
          return NextResponse.json({ error: "Missing userId or problemId" }, { status: 400 });
        }
        const data = await DbService.updateNote(userId, problemId, note);
        return NextResponse.json({ success: true, data });
      }

      case "toggleBookmark": {
        const { userId, problemId } = body;
        if (!userId || !problemId) {
          return NextResponse.json({ error: "Missing userId or problemId" }, { status: 400 });
        }
        const data = await DbService.toggleBookmark(userId, problemId);
        return NextResponse.json({ success: true, data });
      }

      case "updateRevision": {
        const { userId, problemId, status } = body;
        if (!userId || !problemId) {
          return NextResponse.json({ error: "Missing userId or problemId" }, { status: 400 });
        }
        const data = await DbService.updateRevision(userId, problemId, status);
        return NextResponse.json({ success: true, data });
      }

      case "updateUserSettings": {
        const { users } = body;
        if (!users || !Array.isArray(users)) {
          return NextResponse.json({ error: "Missing or invalid users array" }, { status: 400 });
        }
        const data = await DbService.updateUserSettings(users);
        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update database";
    console.error("API POST Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
