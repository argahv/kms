"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/" },
    // ...(user.role === "ADMIN"
    // ? [{ label: "Admin Panel", href: "/admin" }]
    // : []),
  ];

  return (
    <nav className=' text-primary-foreground p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Button onClick={logout} variant='secondary'>
          Logout
        </Button>
      </div>
      <div className='md:hidden'>
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant='ghost'>
          Menu
        </Button>
      </div>
    </nav>
  );
}
