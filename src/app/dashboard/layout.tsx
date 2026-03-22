'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null; // Don't render dashboard until authorized
  }

  return (
    // <div className="flex min-h-screen bg-gray-100">
    //   <Sidebar />
    //   <div className="flex-1 flex flex-col">
    //     <Navbar />
    //     <main className="flex-1 overflow-auto">{children}</main>
    //   </div>
    // </div>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />  {/* fixed w-64 */}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Page content */}
          <div className="p-4">
            {children}  {/* your UploadRAWFiles page goes here */}
          </div>
        </main>
      </div>
    </div>
  );
}