import { output } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/hello
export async function GET() {
  return NextResponse.json({
    message: "Hello from GET",
  });
}

// POST /api/hello
export async function POST(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    output: {
      message: "hello",
      received: body,
    }
  });
}