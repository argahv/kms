import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { User, Notice } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  teacher?: User;
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
        await createNotice.mutateAsync({ ...notice, authorId: teacher?.id });
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
        <div className='flex justify-between items-center mb-6'>
          {teacher && (
            <Dialog
              open={isNoticeDialogOpen}
              onOpenChange={setIsNoticeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentNotice(null)}>
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
          )}
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {notices.map((notice) => (
            <Card key={notice.id} className='shadow-lg rounded-lg border'>
              <CardHeader>
                <CardTitle className='text-lg font-bold text-primary'>
                  {notice.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='mb-2'>{notice.content}</p>
                <p className='text-sm '>
                  {new Date(notice.date).toLocaleDateString()}
                </p>
                {teacher && (
                  <div className='mt-4 flex gap-2'>
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
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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
        <label htmlFor='title' className='block font-medium text-sm'>
          Title
        </label>
        <input
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          className='w-full border rounded-lg px-3 py-2'
        />
      </div>
      <div>
        <label htmlFor='content' className='block font-medium text-sm'>
          Content
        </label>
        <textarea
          id='content'
          name='content'
          value={formData.content}
          onChange={handleChange}
          required
          className='w-full border rounded-lg px-3 py-2 h-24'
        />
      </div>
      <Button type='submit' className='btn btn-primary w-full'>
        Save
      </Button>
    </form>
  );
}
