
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import client from "@/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";





export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        const user = await client.adminUser.findUnique({
            where: {
                username: username
            }
        });

        if(!user){
            return NextResponse.json({
                error: "User Not Found!!!"
            }, {status: 401})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return NextResponse.json({error:"Invalid Credentials"},{status:401});

        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET!, {
            expiresIn: "1h"
        });


        (await cookies()).set("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/"
        });


        return NextResponse.json({ message: "Login Successful!!!",user: user }, {status: 200})
    }catch(e){
        return NextResponse.json({
            error: `Something Happened, ${e}`
        }, {status: 500})
    }
}