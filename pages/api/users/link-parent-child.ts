import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/auth";
import { prisma } from "@/prisma/prisma.client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { parentId, childId } = req.body;
    const linkParentChild = await prisma.user.update({
      where: {
        id: parentId,
      },
      data: {
        children: {
          connect: {
            id: childId,
          },
        },
      },
    });

    res.status(200).json(linkParentChild);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware(handler);
