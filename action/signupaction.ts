// actions/signupaction.ts
'use server';

import client from "@/db";
import bcrypt from "bcrypt";

export async function signUpAction(
  prevState: { message: string | null; error: string | null },
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const hashedPassword = await bcrypt.hash(password,10);

    await client.adminUser.create({
      data: { name: name, username: username, password: hashedPassword },
    });

    return { message: "User created successfully!", error: null };
  } catch (e) {
    console.error(e);
    return { message: null, error: "Something went wrong!" };
  }
}
