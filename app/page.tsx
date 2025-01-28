"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { ParentDashboard } from "@/components/parent-dashboard";
import { KidDashboard } from "@/components/kid-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Navigation } from "@/components/navigation";
import { useAuthStore } from "@/lib/store";
import { Role } from "@prisma/client";

export default function Home() {
  const { user, isAppReady } = useAuthStore();
  console.log("isAppReady", isAppReady);
  const router = useRouter();
  console.log("user", user);

  useEffect(() => {
    if (isAppReady && !user) {
      router.push("/login");
    }
  }, [user, router, isAppReady]);

  if (isAppReady && !user)
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* <Navigation /> */}
      <div className='container mx-auto p-4'>
        {user?.role === Role.TEACHER && <TeacherDashboard teacher={user} />}
        {user?.role === Role.PARENT && <ParentDashboard parent={user} />}
        {user?.role === Role.KID && <KidDashboard kid={user} />}
        {user?.role === Role.ADMIN && <AdminDashboard admin={user} />}
      </div>
    </div>
  );
}
