import { prisma } from "@/prisma/prisma.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        include: { author: { select: { name: true } } },
      });
      res.status(200).json(notices);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching notices", error });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content, authorId } = req.body;
      if (!title || !content || !authorId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const notice = await prisma.notice.create({
        data: {
          title,
          content,
          date: new Date(),
          authorId,
        },
      });
      res.status(201).json(notice);
    } catch (error) {
      res.status(500).json({ message: "Error creating notice", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
