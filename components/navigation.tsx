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
    <nav className='bg-primary text-primary-foreground p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>
          Kids Management System
        </Link>
        <div className='hidden md:flex space-x-4'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-secondary-foreground ${
                pathname === item.href ? "font-bold" : ""
              }`}>
              {item.label}
            </Link>
          ))}
          <Button onClick={logout} variant='secondary'>
            Logout
          </Button>
        </div>
        <div className='md:hidden'>
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant='ghost'>
            Menu
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className='md:hidden mt-4 space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block hover:text-secondary-foreground ${
                pathname === item.href ? "font-bold" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Button onClick={logout} variant='secondary' className='w-full'>
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
