import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface TokenPayload extends JwtPayload {
  id: number;
}

export async function verifyHallOwner(req: Request, hallId: number) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  let decoded: TokenPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  if (!decoded?.id) {
    throw new Error("INVALID_TOKEN");
  }

  const hall = await prisma.event_halls.findUnique({
    where: { id: hallId },
  });

  if (!hall) {
    throw new Error("NOT_FOUND");
  }

  if (hall.owner_id !== decoded.id) {
    throw new Error("FORBIDDEN");
  }

  return decoded.id;
}
