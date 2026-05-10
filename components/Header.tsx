import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from '@/lib/auth';
import { LogOut, PlusCircle, List, Utensils, Shield } from 'lucide-react';
import MobileNav from './MobileNav';

export default async function Header() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    // Handle invalid session cookies gracefully
    console.error('Auth error in Header:', error);
    session = null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Meal Manager
              </span>
            </Link>

            {/* Desktop Navigation */}
            {session && (
              <div className="hidden sm:flex space-x-2 md:space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Add Meal</span>
                </Link>
                <Link
                  href="/meals"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">View Meals</span>
                </Link>
                {session.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Navigation Menu */}
            {session && <MobileNav isAdmin={session.user?.isAdmin || false} />}
            
            {session ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={32}
                      height={32}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                    />
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session.user?.name}
                  </span>
                </div>
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Sign Out</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
