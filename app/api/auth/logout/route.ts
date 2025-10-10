import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the token cookie
    (await cookies()).set("token", "", {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "lax",
      expires: new Date(0), // expire immediately
      path: "/",
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (e) {
    throw NextResponse.json(
      { error: "Something went wrong while logging out" },
      { status: 500 }
    );
  }
}
