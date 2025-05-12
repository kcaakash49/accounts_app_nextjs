"use server"


import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";



interface DecodedSchema extends JwtPayload{
    id: number,
    username: string
}

export async function fetchAdminInfo(){
    const token = (await cookies()).get("token")?.value;
    if(!token){
        return {
            error: "UnAuthorized"
        }
    }
    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET!);
        
        if (typeof decoded === "object" && "id" in decoded && "username" in decoded) {
            const { id, username } = decoded as DecodedSchema;
            
            

            return ({
                message: "User Fetched Successfully !!!",
                id,
                username
            })
        }

        return ({
            error: "Invalid Token"
        })

    }catch(e){
        return {
            error: "Something Happened",
            err: e
        }
    }
}