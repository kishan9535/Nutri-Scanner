'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Camera, List, BarChart2, PieChart, Tag, Settings, Menu, X, Calendar, Book } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, LogIn } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Scan Food', href: '/scan', icon: Camera },
  { name: 'My Food List', href: '/food-list', icon: List },
  { name: 'Weekly Stats', href: '/weekly-stats', icon: BarChart2 },
  { name: 'Daily Stats', href: '/daily-stats', icon: PieChart },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Meal Planning', href: '/meal-planning', icon: Calendar },
  { name: 'Recipe Suggestions', href: '/recipe-suggestions', icon: Book },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md z-10`}>
        <div className="p-4 flex items-center gap-2">
          <Image
            src="/icon.svg"
            alt="NutriScan Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-gray-800">NutriScan</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Login
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}

