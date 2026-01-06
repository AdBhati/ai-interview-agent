'use client';

import "../globals.css";
import Header from "@/components/dashboard/layout/Header";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { updateIsLogin, updateUserRole } from "@/store/slices/appSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Read from LocalStorage
    const storedIsLogin = localStorage.getItem('isLogin') === 'true';
    const storedUserRole = localStorage.getItem('userRole');

    if (!storedIsLogin) {
      // 2. Not logged in? Redirect.
      router.push("/");
    } else {
      // 3. Logged in? Update Redux Store to match LocalStorage
      dispatch(updateIsLogin(true));
      if (storedUserRole) {
        dispatch(updateUserRole(storedUserRole as any));
      }
      setIsChecking(false);
    }
  }, [dispatch, router]);

  // Prevent flashing of dashboard content before redirect check completes
  if (isChecking) {
    return null; // Or return a <LoadingSpinner /> here
  }

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        crossOrigin="anonymous"
        href="https://fonts.gstatic.com"
        rel="preconnect"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
        rel="stylesheet"
      />
      <div className="flex">
        <Sidebar />
        <div className="flex-column w-full">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}