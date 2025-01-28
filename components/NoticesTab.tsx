import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { User, Notice } from "../types";
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
import {
  useNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from "@/lib/api";
import { ErrorAlert } from "@/components/error-alert";
import { useAuthStore } from "@/lib/store";

interface NoticesTabProps {
  teacher: User;
}

export function NoticesTab({ teacher }: NoticesTabProps) {
  const { data: notices = [], isLoading, error } = useNotices();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);

  const handleNoticeSave = async (notice: Omit<Notice, "id">) => {
    try {
      if (currentNotice) {
        await updateNotice.mutateAsync({ ...notice, id: currentNotice.id });
      } else {
        console.log("notice", notice);
        await createNotice.mutateAsync({ ...notice, authorId: teacher.id });
      }
      setIsNoticeDialogOpen(false);
      setCurrentNotice(null);
    } catch (error) {
      console.error("Failed to save notice:", error);
    }
  };

  const handleNoticeEdit = (notice: Notice) => {
    setCurrentNotice(notice);
    setIsNoticeDialogOpen(true);
  };

  const handleNoticeDelete = async (id: string) => {
    try {
      await deleteNotice.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete notice:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <ErrorAlert message='Failed to load notices. Please try again later.' />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl text-primary'>Notices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-secondary'>
            School Notices
          </h2>
          <Dialog
            open={isNoticeDialogOpen}
            onOpenChange={setIsNoticeDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setCurrentNotice(null)}
                className='btn btn-primary'>
                <Plus className='mr-2 h-4 w-4' /> Add New Notice
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-card'>
              <DialogHeader>
                <DialogTitle>
                  {currentNotice ? "Edit Notice" : "Add New Notice"}
                </DialogTitle>
              </DialogHeader>
              <NoticeForm notice={currentNotice} onSave={handleNoticeSave} />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.content}</TableCell>
                <TableCell>
                  {new Date(notice.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleNoticeEdit(notice)}>
                    <Edit className='h-4 w-4 text-primary' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleNoticeDelete(notice.id)}>
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function NoticeForm({
  notice,
  onSave,
}: {
  notice: Notice | null;
  onSave: (notice: Omit<Notice, "id">) => void;
}) {
  const user = useAuthStore.getInitialState().user;
  const [formData, setFormData] = useState<Omit<Notice, "id">>(
    notice || {
      title: "",
      content: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      authorId: user.id,
    });
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
        <Label htmlFor='content'>Content</Label>
        <textarea
          id='content'
          name='content'
          value={formData.content}
          onChange={handleChange}
          required
          className='input w-full h-24'
        />
      </div>

      <Button type='submit' className='btn btn-primary'>
        Save
      </Button>
    </form>
  );
}
