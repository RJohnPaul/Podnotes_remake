'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {  MenuIcon } from 'lucide-react';
import { useState } from 'react';

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
              <a href="dashboard/profile" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Transcript
              </a>
              <a href="dashboard/kanban" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Youtube Link
              </a>
              <a href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Magic Chat - Underdev
              </a>
              <a href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Style Library - Underdev
              </a>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
