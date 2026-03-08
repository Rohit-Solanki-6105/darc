import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    const djangoResponse = await fetch("http://127.0.0.1:8000/users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json(
        { error: data.error || "Login failed" },
        { status: djangoResponse.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}