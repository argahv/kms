import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '@/lib/auth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const learningMaterials = await prisma.learningMaterial.findMany({
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      res.status(200).json(learningMaterials)
    } catch (error) {
      console.error('Error fetching learning materials:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, subject, type, url, classId } = req.body

      const newLearningMaterial = await prisma.learningMaterial.create({
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

      res.status(201).json(newLearningMaterial)
    } catch (error) {
      console.error('Error creating learning material:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)

