"use client";

import { useState } from "react";
import { User, Child } from "../types";
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
import { useUsers, useChildren, useLinkParentChild } from "@/lib/api";
import { ErrorAlert } from "@/components/error-alert";
import { Role } from "@prisma/client";

interface AdminDashboardProps {
  admin: User;
}

export function AdminDashboard({ admin }: AdminDashboardProps) {
  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
  } = useUsers();
  const {
    data: children = [],
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useChildren();
  const linkParentChild = useLinkParentChild();

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<User | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  if (isUsersLoading || isChildrenLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  if (usersError || childrenError) {
    return (
      <ErrorAlert message='Failed to load data. Please try again later.' />
    );
  }

  const handleLinkAccounts = async () => {
    if (selectedParent && selectedChild) {
      try {
        await linkParentChild.mutateAsync({
          parentId: selectedParent.id,
          childId: selectedChild.id,
        });
        setIsLinkDialogOpen(false);
        setSelectedParent(null);
        setSelectedChild(null);
      } catch (error) {
        console.error("Failed to link accounts:", error);
      }
    }
  };

  return (
    <div className='admin-dashboard min-h-screen p-6 animate-fadeIn'>
      <h1 className='text-3xl font-bold mb-6 text-primary animate-slideIn'>
        Welcome, {admin.name}
      </h1>
      <Tabs defaultValue='users' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='users'>User Management</TabsTrigger>
          <TabsTrigger value='link'>Link Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value='users'>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.children
                          ? user.children.map((child) => (
                              <div key={child.id}>
                                {child.name} ({child.class.name})
                              </div>
                            ))
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='sm'>
                          Edit
                        </Button>
                        <Button variant='ghost' size='sm'>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='link'>
          <Card>
            <CardHeader>
              <CardTitle>Link Parent-Child Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Link Accounts</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Link Parent-Child Accounts</DialogTitle>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='parentSelect'>Select Parent:</Label>
                      <select
                        id='parentSelect'
                        value={selectedParent?.id || ""}
                        onChange={(e) =>
                          setSelectedParent(
                            users.find((user) => user.id === e.target.value) ||
                              null
                          )
                        }
                        className='w-full p-2 border rounded'>
                        <option value=''>Select a parent</option>
                        {users
                          .filter((user) => user.role === Role.PARENT)
                          .map((parent) => (
                            <option key={parent.id} value={parent.id}>
                              {parent.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor='childSelect'>Select Child:</Label>
                      <select
                        id='childSelect'
                        value={selectedChild?.id || ""}
                        onChange={(e) =>
                          setSelectedChild(
                            children.find(
                              (child) => child.id === e.target.value
                            ) || null
                          )
                        }
                        className='w-full p-2 border rounded'>
                        <option value=''>Select a child</option>
                        {children.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={handleLinkAccounts}>Link Accounts</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
