import { useAuthStore } from "@/lib/store";
import { BookOpen, LineChart, LogOut, UserCheck } from "lucide-react";
import { SidebarContent } from "./ui/sidebar";

// Menu items with icons that match the educational context
const items = [
  {
    title: "Lessons",
    url: "/",
    icon: BookOpen,
  },
  {
    title: "Progress",
    url: "/",
    icon: LineChart,
  },
  {
    title: "Attendance",
    url: "/",
    icon: UserCheck,
  },
];

export function AppSidebar() {
  const { logout } = useAuthStore();

  return (
    <SidebarContent>
      <div className='h-full p-4'>
        <div className='bg-white shadow-lg rounded-lg p-4'>
          <div className='flex flex-col space-y-4'>
            <>
              {items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className='flex items-center space-x-2 text-gray-600 hover:text-primary hover:bg-gray-50 p-2 rounded-md'>
                  <item.icon className='h-6 w-6' />
                  <span className='text-sm font-medium'>{item.title}</span>
                </a>
              ))}
              <a
                onClick={logout}
                // href={item.url}
                className='flex items-center space-x-2 text-red-600 hover:text-primary hover:bg-gray-50 p-2 rounded-md'>
                <LogOut className='h-6 w-6' />
                <span className='text-sm font-medium'>Logout</span>
              </a>
            </>
          </div>
        </div>
      </div>
    </SidebarContent>
  );
}
