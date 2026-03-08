import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, role } = body;

    const djangoResponse = await fetch("http://127.0.0.1:8000/users/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json(
        { error: data.error || "Signup failed" },
        { status: djangoResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}