import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

// Load environment variables
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function addUser() {
  try {
    // Get user details from command line arguments
    const args = process.argv.slice(2);
    const name = args[0] || "Temka User";
    const email = args[1] || "temka@gmail.com";
    const password = args[2] || "user123";
    const role = args[3] || "user";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.mruser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone: "88888888",
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Error: User with this email already exists!");
    } else {
      console.error("❌ Error creating user:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
