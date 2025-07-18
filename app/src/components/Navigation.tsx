'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">Drawing App</h1>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Draw
            </Link>

            <Link
              href="/gallery"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/gallery')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
