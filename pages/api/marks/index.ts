import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '@/lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const marks = await prisma.mark.findMany({
      include: {
        child: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    res.status(200).json(marks)
  } catch (error) {
    console.error('Error fetching marks:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default authMiddleware(handler)

