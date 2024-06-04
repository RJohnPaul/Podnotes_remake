import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuickNotes',
  description: 'Notes Generatioon from Transcripts and Youtube Videos',
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16 overflow-y-auto">
          <div className="h-full p-4">{children}</div>
        </main>
      </div>
    </>
  );
}