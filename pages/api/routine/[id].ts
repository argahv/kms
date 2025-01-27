import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '@/lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { day, time, subject, classId } = req.body

      const updatedRoutineEntry = await prisma.routineEntry.update({
        where: { id: String(id) },
        data: {
          day,
          time,
          subject,
          classId,
        },
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      res.status(200).json(updatedRoutineEntry)
    } catch (error) {
      console.error('Error updating routine entry:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.routineEntry.delete({
        where: { id: String(id) },
      })

      res.status(204).end()
    } catch (error) {
      console.error('Error deleting routine entry:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)

