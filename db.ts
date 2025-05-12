import { PrismaClient } from "@prisma/client";



console.log("inside db.ts")
const prismaSingleton = () => {
    console.log("inside single")
    return new PrismaClient();

}

declare global {
    var prisma: undefined | ReturnType<typeof prismaSingleton>;
}

const prisma = globalThis.prisma ?? prismaSingleton();


if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
