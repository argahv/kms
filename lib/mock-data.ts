import { User, Child, AttendanceRecord, Mark, RoutineEntry, LearningMaterial } from '../types'

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', role: 'teacher' },
  { id: '2', name: 'Jane Smith', role: 'parent' },
  { id: '3', name: 'Alice Johnson', role: 'kid' },
  { id: '4', name: 'Bob Brown', role: 'admin' },
]

export const mockChildren: Child[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Charlie Davis' },
]

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: '1_20230501', date: '2023-05-01', status: 'present' },
  { id: '1_20230502', date: '2023-05-02', status: 'absent' },
  { id: '1_20230503', date: '2023-05-03', status: 'present' },
  { id: '2_20230501', date: '2023-05-01', status: 'present' },
  { id: '2_20230502', date: '2023-05-02', status: 'present' },
  { id: '2_20230503', date: '2023-05-03', status: 'late' },
]

export const mockMarks: Mark[] = [
  { id: '1_math', subject: 'Math', score: 85, totalScore: 100 },
  { id: '1_science', subject: 'Science', score: 92, totalScore: 100 },
  { id: '1_english', subject: 'English', score: 78, totalScore: 100 },
  { id: '2_math', subject: 'Math', score: 90, totalScore: 100 },
  { id: '2_science', subject: 'Science', score: 88, totalScore: 100 },
  { id: '2_english', subject: 'English', score: 95, totalScore: 100 },
]

export const mockRoutine: RoutineEntry[] = [
  { id: '1', day: 'Monday', time: '09:00 AM', subject: 'Math' },
  { id: '2', day: 'Monday', time: '11:00 AM', subject: 'Science' },
  { id: '3', day: 'Tuesday', time: '09:00 AM', subject: 'English' },
  { id: '4', day: 'Tuesday', time: '11:00 AM', subject: 'History' },
  { id: '5', day: 'Wednesday', time: '09:00 AM', subject: 'Math' },
  { id: '6', day: 'Wednesday', time: '11:00 AM', subject: 'Art' },
]

export const mockLearningMaterials: LearningMaterial[] = [
  { id: '1', title: 'Introduction to Algebra', subject: 'Math', type: 'pdf', url: 'https://example.com/algebra.pdf' },
  { id: '2', title: 'Photosynthesis Explained', subject: 'Science', type: 'video', url: 'https://example.com/photosynthesis.mp4' },
  { id: '3', title: 'Grammar Basics', subject: 'English', type: 'pdf', url: 'https://example.com/grammar.pdf' },
]

