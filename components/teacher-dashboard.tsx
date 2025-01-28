"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import type { User, RoutineEntry, LearningMaterial } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useRoutine,
  useLearningMaterials,
  useMarks,
  useCreateRoutineEntry,
  useUpdateRoutineEntry,
  useDeleteRoutineEntry,
  useCreateLearningMaterial,
  useUpdateLearningMaterial,
  useDeleteLearningMaterial,
  useNotices,
  useClasses,
} from "@/lib/api";
import { ErrorAlert } from "@/components/error-alert";
import { NoticesTab } from "@/components/NoticesTab";

interface TeacherDashboardProps {
  teacher: User;
}

export function TeacherDashboard({ teacher }: TeacherDashboardProps) {
  const {
    data: routine = [],
    isLoading: isRoutineLoading,
    error: routineError,
  } = useRoutine();
  const {
    data: materials = [],
    isLoading: isMaterialsLoading,
    error: materialsError,
  } = useLearningMaterials();
  const {
    data: marks = [],
    isLoading: isMarksLoading,
    error: marksError,
  } = useMarks();
  const {
    data: notices = [],
    isLoading: isNoticesLoading,
    error: noticesError,
  } = useNotices();
  const {
    data: classes = [],
    isLoading: isClassesLoading,
    error: classError,
  } = useClasses();
  const createRoutineEntry = useCreateRoutineEntry();
  const updateRoutineEntry = useUpdateRoutineEntry();
  const deleteRoutineEntry = useDeleteRoutineEntry();
  const createLearningMaterial = useCreateLearningMaterial();
  const updateLearningMaterial = useUpdateLearningMaterial();
  const deleteLearningMaterial = useDeleteLearningMaterial();

  const [isRoutineDialogOpen, setIsRoutineDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [currentRoutineEntry, setCurrentRoutineEntry] =
    useState<RoutineEntry | null>(null);
  const [currentMaterial, setCurrentMaterial] =
    useState<LearningMaterial | null>(null);

  const handleRoutineSave = async (entry: Omit<RoutineEntry, "id">) => {
    try {
      if (currentRoutineEntry) {
        await updateRoutineEntry.mutateAsync({
          ...entry,
          id: currentRoutineEntry.id,
        });
      } else {
        await createRoutineEntry.mutateAsync(entry);
      }
      setIsRoutineDialogOpen(false);
      setCurrentRoutineEntry(null);
    } catch (error) {
      console.error("Failed to save routine entry:", error);
    }
  };

  const handleRoutineEdit = (entry: RoutineEntry) => {
    setCurrentRoutineEntry(entry);
    setIsRoutineDialogOpen(true);
  };

  const handleRoutineDelete = async (id: string) => {
    try {
      await deleteRoutineEntry.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete routine entry:", error);
    }
  };

  const handleMaterialSave = async (material: Omit<LearningMaterial, "id">) => {
    try {
      if (currentMaterial) {
        await updateLearningMaterial.mutateAsync({
          ...material,
          id: currentMaterial.id,
        });
      } else {
        await createLearningMaterial.mutateAsync(material);
      }
      setIsMaterialDialogOpen(false);
      setCurrentMaterial(null);
    } catch (error) {
      console.error("Failed to save learning material:", error);
    }
  };

  const handleMaterialEdit = (material: LearningMaterial) => {
    setCurrentMaterial(material);
    setIsMaterialDialogOpen(true);
  };

  const handleMaterialDelete = async (id: string) => {
    try {
      await deleteLearningMaterial.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete learning material:", error);
    }
  };

  if (
    isRoutineLoading ||
    isMaterialsLoading ||
    isMarksLoading ||
    isNoticesLoading
  ) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  if (routineError || materialsError || marksError || noticesError) {
    return (
      <ErrorAlert message='Failed to load data. Please try again later.' />
    );
  }

  const studentPerformance = marks.reduce((acc, mark) => {
    if (!acc[mark.subject]) {
      acc[mark.subject] = { totalScore: 0, count: 0 };
    }
    acc[mark.subject].totalScore += (mark.score / mark.totalScore) * 100;
    acc[mark.subject].count += 1;
    return acc;
  }, {} as Record<string, { totalScore: number; count: number }>);

  const performanceData = Object.entries(studentPerformance).map(
    ([subject, data]) => ({
      subject,
      averageScore: data.totalScore / data.count,
    })
  );

  return (
    <div className='teacher-dashboard min-h-screen p-6 animate-fadeIn'>
      <h1 className='text-3xl font-bold mb-6 text-primary animate-slideIn'>
        Welcome, {teacher.name}
      </h1>
      <Tabs defaultValue='routine' className='space-y-6'>
        <TabsList className='bg-orange-500 p-1 rounded-md shadow-sm text-white'>
          <TabsTrigger value='routine' className='btn btn-secondary'>
            Routine Management
          </TabsTrigger>
          <TabsTrigger value='materials' className='btn btn-secondary'>
            Learning Materials
          </TabsTrigger>
          <TabsTrigger value='performance' className='btn btn-secondary'>
            Student Performance
          </TabsTrigger>
          <TabsTrigger value='notices' className='btn btn-secondary'>
            Notices
          </TabsTrigger>
        </TabsList>
        <TabsContent value='routine' className='animate-fadeIn'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl text-primary'>Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-secondary'>
                  Class Schedule
                </h2>
                <Dialog
                  open={isRoutineDialogOpen}
                  onOpenChange={setIsRoutineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setCurrentRoutineEntry(null)}
                      className='btn btn-primary'>
                      <Plus className='mr-2 h-4 w-4' /> Add New Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='bg-card'>
                    <DialogHeader>
                      <DialogTitle>
                        {currentRoutineEntry ? "Edit Entry" : "Add New Entry"}
                      </DialogTitle>
                    </DialogHeader>
                    <RoutineForm
                      entry={currentRoutineEntry}
                      onSave={handleRoutineSave}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routine.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell>{entry.time}</TableCell>
                      <TableCell>{entry.subject}</TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRoutineEdit(entry)}>
                          <Edit className='h-4 w-4 text-primary' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRoutineDelete(entry.id)}>
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='materials' className='animate-fadeIn'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl text-primary'>Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-secondary'>
                  Uploaded Materials
                </h2>
                <Dialog
                  open={isMaterialDialogOpen}
                  onOpenChange={setIsMaterialDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setCurrentMaterial(null)}
                      className='btn btn-primary'>
                      <Upload className='mr-2 h-4 w-4' /> Upload Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='bg-card'>
                    <DialogHeader>
                      <DialogTitle>
                        {currentMaterial
                          ? "Edit Material"
                          : "Upload New Material"}
                      </DialogTitle>
                    </DialogHeader>
                    <MaterialForm
                      material={currentMaterial}
                      onSave={handleMaterialSave}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.title}</TableCell>
                      <TableCell>{material.subject}</TableCell>
                      <TableCell>{material.type}</TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleMaterialEdit(material)}>
                          <Edit className='h-4 w-4 text-primary' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleMaterialDelete(material.id)}>
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='performance' className='animate-fadeIn'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl text-primary'>
                Student Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='w-full h-[400px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={performanceData}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='var(--border)'
                    />
                    <XAxis dataKey='subject' stroke='var(--foreground)' />
                    <YAxis stroke='var(--foreground)' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey='averageScore' fill='var(--primary)' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='notices' className='animate-fadeIn'>
          <NoticesTab teacher={teacher} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoutineForm({
  entry,
  onSave,
}: {
  entry: RoutineEntry | null;
  onSave: (entry: Omit<RoutineEntry, "id">) => void;
}) {
  const {
    data: classes = [],
    isLoading: isClassesLoading,
    error: classError,
  } = useClasses();
  const [formData, setFormData] = useState<Omit<RoutineEntry, "id">>(
    entry || { day: "", time: "", subject: "", classId: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='day'>Day</Label>
        <Input
          id='day'
          name='day'
          value={formData.day}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='time'>Time</Label>
        <Input
          id='time'
          name='time'
          value={formData.time}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='subject'>Subject</Label>
        <Input
          id='subject'
          name='subject'
          value={formData.subject}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='classId'>Class</Label>
        <select
          id='classId'
          name='classId'
          className='input'
          value={formData.classId}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, classId: e.target.value }));
          }}>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        {/* <Input
          id='classId'
          name='classId'
          value={formData.classId}
          onChange={handleChange}
          required
          className='input'
        /> */}
      </div>
      <Button type='submit' className='btn btn-primary'>
        Save
      </Button>
    </form>
  );
}

function MaterialForm({
  material,
  onSave,
}: {
  material: LearningMaterial | null;
  onSave: (material: Omit<LearningMaterial, "id">) => void;
}) {
  const [formData, setFormData] = useState<Omit<LearningMaterial, "id">>(
    material || { title: "", subject: "", type: "PDF", url: "", classId: "" }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='subject'>Subject</Label>
        <Input
          id='subject'
          name='subject'
          value={formData.subject}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='type'>Type</Label>
        <select
          id='type'
          name='type'
          value={formData.type}
          onChange={handleChange}
          className='input w-full'
          required>
          <option value='PDF'>PDF</option>
          <option value='VIDEO'>Video</option>
        </select>
      </div>
      <div>
        <Label htmlFor='url'>URL</Label>
        <Input
          id='url'
          name='url'
          value={formData.url}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <div>
        <Label htmlFor='classId'>Class ID</Label>
        <Input
          id='classId'
          name='classId'
          value={formData.classId}
          onChange={handleChange}
          required
          className='input'
        />
      </div>
      <Button type='submit' className='btn btn-primary'>
        Save
      </Button>
    </form>
  );
}
