import { BookOpen, LineChart, UserCheck } from "lucide-react";

// Menu items with icons that match the educational context
const items = [
  {
    title: "Lessons",
    url: "/lessons",
    icon: BookOpen,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: LineChart,
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: UserCheck,
  },
];

export function AppSidebar() {
  return (
    <div className='h-full p-4'>
      <div className='bg-white shadow-lg rounded-lg p-4'>
        <div className='flex flex-col space-y-4'>
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className='flex items-center space-x-2 text-gray-600 hover:text-primary hover:bg-gray-50 p-2 rounded-md'>
              <item.icon className='h-6 w-6' />
              <span className='text-sm font-medium'>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
