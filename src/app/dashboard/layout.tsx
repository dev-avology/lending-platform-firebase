"use client";

import Link from 'next/link';
import { Home, Bell, Settings, PieChart, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from '@/components/icons/logo';
import { useUser } from '@/contexts/UserContext';
import { UserAvatar } from '@/components/icons/UserAvatar';
import { logout } from '@/lib/firebase';
import { useRouter } from 'next/navigation'; // Import from next/navigation

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useUser();
  const router = useRouter(); // Use useRouter from next/navigation

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logout(); // Assuming you have signOut defined in your firebase helper file
      router.push('/login'); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSetting = async () => {
      router.push('/setting'); // Redirect to login page after sign-out
  };
  const handleProfile = async () => {
    router.push('/profile'); // Redirect to login page after sign-out
 };
const handleLoanStatus = async () => {
    router.push('/loan-status'); // Redirect to login page after sign-out
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          {/* Logo and Navigation Menu */}
          <div className="flex items-center flex-grow">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center mr-8">
              <span className="sr-only">Your Company</span>
              <Logo width={80} height={80} />
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
              <Link href="/loan" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                <Briefcase className="mr-2 h-5 w-5" />
                Loan
              </Link>
              <Link href="/financial" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                <PieChart className="mr-2 h-5 w-5" />
                Financial
              </Link>
              <Link href="/setting" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <h1>Welcome, {userData?.firstName || 'User'}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" size="icon">
                  <UserAvatar imageUrl={userData?.photoURL} size={50} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfile}>Your Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLoanStatus}>Loan Status</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetting}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto flex-1 overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
