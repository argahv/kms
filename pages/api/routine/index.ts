import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '@/lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const routineEntries = await prisma.routineEntry.findMany({
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      res.status(200).json(routineEntries)
    } catch (error) {
      console.error('Error fetching routine entries:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { day, time, subject, classId } = req.body

      const newRoutineEntry = await prisma.routineEntry.create({
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

      res.status(201).json(newRoutineEntry)
    } catch (error) {
      console.error('Error creating routine entry:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)

