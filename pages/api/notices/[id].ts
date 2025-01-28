import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: String(id) },
        include: { author: { select: { name: true } } },
      });
      if (notice) {
        res.status(200).json(notice);
      } else {
        res.status(404).json({ message: "Notice not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching notice", error });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, content } = req.body;
      const updatedNotice = await prisma.notice.update({
        where: { id: String(id) },
        data: { title, content },
      });
      res.status(200).json(updatedNotice);
    } catch (error) {
      res.status(500).json({ message: "Error updating notice", error });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.notice.delete({
        where: { id: String(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting notice", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
