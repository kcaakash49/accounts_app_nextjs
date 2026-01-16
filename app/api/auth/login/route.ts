
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import client from "@/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";





export async function POST(req: NextRequest) {
    
    try {
      const { username, password } = await req.json();
  
      const user = await client.adminUser.findUnique({
        where: { username },
      });
  
      if (!user) {
        throw NextResponse.json({ error: "User Not Found!!!" }, { status: 401 });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        throw NextResponse.json({ error: "Invalid Password" }, { status: 401 });
      }
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
  
      (await cookies()).set("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      });
  
      return NextResponse.json(
        { message: "Login Successful!!!", user },
        { status: 200 }
      );
    } catch (e: any) {
      if (e instanceof NextResponse) {
        // If we already threw a NextResponse (like 401), just return it
        return e;
      }
  
      console.error("Login error:", e);
      return NextResponse.json(
        { error: "Something went wrong, please try again." },
        { status: 500 }
      );
    }
  }