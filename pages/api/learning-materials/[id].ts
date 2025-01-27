import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '@/lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { title, subject, type, url, classId } = req.body

      const updatedLearningMaterial = await prisma.learningMaterial.update({
        where: { id: String(id) },
        data: {
          title,
          subject,
          type,
          url,
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

      res.status(200).json(updatedLearningMaterial)
    } catch (error) {
      console.error('Error updating learning material:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.learningMaterial.delete({
        where: { id: String(id) },
      })

      res.status(204).end()
    } catch (error) {
      console.error('Error deleting learning material:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)

