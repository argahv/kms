'use client'

import { useState } from 'react'
import { User, AttendanceRecord, Mark, RoutineEntry } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCurrentWeek } from '../utils/date-utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Progress } from '@/components/ui/progress'
import { useAttendanceRecords, useMarks, useRoutine } from '@/lib/api'
import { ErrorAlert } from '@/components/error-alert'

interface KidDashboardProps {
  kid: User;
}

export function KidDashboard({ kid }: KidDashboardProps) {
  const { data: attendanceRecords = [], isLoading: isAttendanceLoading, error: attendanceError } = useAttendanceRecords()
  const { data: marks = [], isLoading: isMarksLoading, error: marksError } = useMarks()
  const { data: routine = [], isLoading: isRoutineLoading, error: routineError } = useRoutine()

  if (isAttendanceLoading || isMarksLoading || isRoutineLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (attendanceError || marksError || routineError) {
    return <ErrorAlert message="Failed to load data. Please try again later." />
  }

  const currentWeek = getCurrentWeek()
  const todayRoutine = routine.filter(entry => entry.day === currentWeek[new Date().getDay()])

  const overallProgress = marks.reduce((sum, mark) => sum + (mark.score / mark.totalScore), 0) / marks.length * 100

  return (
    <div className="kid-dashboard min-h-screen p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-primary animate-slideIn">Welcome, {kid.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full" />
          <p className="text-center mt-2">{overallProgress.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="routine">Weekly Routine</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="attendance">My Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayRoutine.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.time}</TableCell>
                      <TableCell>{entry.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="routine">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routine.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell>{entry.time}</TableCell>
                      <TableCell>{entry.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((mark) => (
                    <TableRow key={mark.id}>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>{mark.score}</TableCell>
                      <TableCell>{mark.totalScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

