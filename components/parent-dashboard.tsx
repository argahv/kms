'use client'

import { useState } from 'react'
import { User, Child, AttendanceRecord, Mark, RoutineEntry } from '../types'
import { Button } from '@/components/ui/button'
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart, Pie, Cell, Legend } from 'recharts'
import { useChildren, useAttendanceRecords, useMarks, useRoutine } from '@/lib/api'
import { ErrorAlert } from '@/components/error-alert'

interface ParentDashboardProps {
  parent: User;
}

export function ParentDashboard({ parent }: ParentDashboardProps) {
  const { data: children = [], isLoading: isChildrenLoading, error: childrenError } = useChildren()
  const { data: attendanceRecords = [], isLoading: isAttendanceLoading, error: attendanceError } = useAttendanceRecords()
  const { data: marks = [], isLoading: isMarksLoading, error: marksError } = useMarks()
  const { data: routine = [], isLoading: isRoutineLoading, error: routineError } = useRoutine()

  const [selectedChild, setSelectedChild] = useState<Child | null>(children[0] || null)

  if (isChildrenLoading || isAttendanceLoading || isMarksLoading || isRoutineLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (childrenError || attendanceError || marksError || routineError) {
    return <ErrorAlert message="Failed to load data. Please try again later." />
  }

  if (!selectedChild) {
    return <ErrorAlert message="No children found for this parent." />
  }

  const childAttendance = attendanceRecords.filter(record => record.id.startsWith(selectedChild.id))
  const childMarks = marks.filter(mark => mark.id.startsWith(selectedChild.id))

  const attendanceData = [
    { name: 'Present', value: childAttendance.filter(record => record.status === 'present').length },
    { name: 'Absent', value: childAttendance.filter(record => record.status === 'absent').length },
    { name: 'Late', value: childAttendance.filter(record => record.status === 'late').length },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  return (
    <div className="parent-dashboard min-h-screen p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-primary animate-slideIn">Welcome, {parent.name}</h1>
      <div className="mb-4">
        <label htmlFor="childSelect" className="block text-sm font-medium mb-2">Select Child:</label>
        <select
          id="childSelect"
          value={selectedChild?.id}
          onChange={(e) => setSelectedChild(children.find(child => child.id === e.target.value) || null)}
          className="w-full p-2 border rounded"
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>
      </div>
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="routine">Routine</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childAttendance.map((record) => (
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
        <TabsContent value="marks">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={childMarks}>
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
                  {childMarks.map((mark) => (
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
      </Tabs>
    </div>
  )
}

