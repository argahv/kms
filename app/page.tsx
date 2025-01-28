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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Home() {
  const { user, isAppReady } = useAuthStore();
  const router = useRouter();

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
    <SidebarProvider>
      <div className='flex min-h-screen bg-background text-foreground'>
        {/* Sidebar Section */}
        <div className='w-1/4 flex justify-center items-center p-4'>
          <AppSidebar />
        </div>

        {/* Main Content Section */}
        <div className='flex-1 flex justify-center p-4'>
          <main className='w-3/4'>
            <SidebarTrigger />
            <Navigation />
            <div className='mt-4'>
              {user?.role === Role.TEACHER && (
                <TeacherDashboard teacher={user} />
              )}
              {user?.role === Role.PARENT && <ParentDashboard parent={user} />}
              {user?.role === Role.KID && <KidDashboard kid={user} />}
              {user?.role === Role.ADMIN && <AdminDashboard admin={user} />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
