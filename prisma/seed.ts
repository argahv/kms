import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      {
        id: "1",
        name: "John Doe",
        email: "teacher1@kms.com",
        password: await bcrypt.hash("1234", 10),
        role: "TEACHER",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "parent1@kms.com",
        password: await bcrypt.hash("1234", 10),
        role: "PARENT",
      },
      {
        id: "3",
        name: "Alice Johnson",
        email: "kid1@kms.com",
        password: await bcrypt.hash("1234", 10),
        role: "KID",
      },
      {
        id: "4",
        name: "Bob Brown",
        email: "admin1@kms.com",
        password: await bcrypt.hash("1234", 10),
        role: "ADMIN",
      },
    ],
  });

  // Seed Notices
  const notices = await prisma.notice.createMany({
    data: [
      {
        id: "1",
        title: "Welcome to the new school year",
        content:
          "We are excited to welcome you to the new school year. Please find the schedule attached.",
        date: new Date(),
        authorId: "1", // Assuming John Doe is the author
      },
      {
        id: "2",
        title: "Parent-Teacher Meeting",
        content:
          "There will be a parent-teacher meeting next week. Please make sure to attend.",
        date: new Date(),
        authorId: "1", // Assuming John Doe is the author
      },
    ],
  });

  // Seed Classes
  const classes = await prisma.class.createMany({
    data: [
      { id: "1", name: "Math Class", teacherId: "1" },
      { id: "2", name: "Science Class", teacherId: "1" },
    ],
  });

  // Seed Children
  const children = await prisma.child.createMany({
    data: [
      { id: "1", name: "Alice Johnson", parentId: "2", classId: "1" },
      { id: "2", name: "Charlie Davis", parentId: "2", classId: "2" },
    ],
  });

  // Seed Routine Entries
  const routineEntries = await prisma.routineEntry.createMany({
    data: [
      {
        id: "1",
        day: "Monday",
        time: "09:00 AM",
        subject: "Math",
        classId: "1",
      },
      {
        id: "2",
        day: "Monday",
        time: "11:00 AM",
        subject: "Science",
        classId: "2",
      },
    ],
  });

  // Seed Attendance Records
  const attendanceRecords = await prisma.attendanceRecord.createMany({
    data: [
      {
        id: "1_20230501",
        date: new Date("2023-05-01"),
        status: "PRESENT",
        childId: "1",
      },
      {
        id: "1_20230502",
        date: new Date("2023-05-02"),
        status: "ABSENT",
        childId: "1",
      },
      {
        id: "2_20230501",
        date: new Date("2023-05-01"),
        status: "LATE",
        childId: "2",
      },
    ],
  });

  // Seed Marks
  const marks = await prisma.mark.createMany({
    data: [
      {
        id: "1_math",
        subject: "Math",
        score: 85,
        totalScore: 100,
        childId: "1",
      },
      {
        id: "1_science",
        subject: "Science",
        score: 90,
        totalScore: 100,
        childId: "1",
      },
      {
        id: "2_math",
        subject: "Math",
        score: 88,
        totalScore: 100,
        childId: "2",
      },
    ],
  });

  // Seed Learning Materials
  const learningMaterials = await prisma.learningMaterial.createMany({
    data: [
      {
        id: "1",
        title: "Introduction to Algebra",
        subject: "Math",
        type: "PDF",
        url: "https://example.com/algebra.pdf",
        classId: "1",
      },
      {
        id: "2",
        title: "Photosynthesis Explained",
        subject: "Science",
        type: "VIDEO",
        url: "https://example.com/photosynthesis.mp4",
        classId: "2",
      },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
