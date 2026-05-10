import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TrendingUp, PieChart, Calendar, Shield } from 'lucide-react';

// Revalidate this page every hour (cached but refreshed periodically)
export const revalidate = 3600;

export default async function Home() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    console.error('Auth error in Home:', error);
    // Continue to render home page if auth fails
  }

  // Redirect to dashboard if user is logged in
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Track Your Meals,
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Manage Your Budget
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Simple and powerful meal tracking application to monitor your daily food expenses
              and eating habits.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Powerful features to help you track and manage your meals
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8">
            <div className="flex-1 sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-3 sm:mb-4">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Daily Tracking
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Log your meals with date, time, type, and price
              </p>
            </div>

            <div className="flex-1 sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-full mb-3 sm:mb-4">
                <PieChart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Monthly Overview
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                View and analyze your spending patterns month by month
              </p>
            </div>

            <div className="flex-1 sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Expense Analytics
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Get insights on your total and average meal costs
              </p>
            </div>

            <div className="flex-1 sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Login
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Safe and secure authentication with Google
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-12 sm:py-16 md:py-20 bg-indigo-600 dark:bg-indigo-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to start tracking?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8">
              Sign in with your Google account and start managing your meals today
            </p>
            <Link
              href="/login"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-100 text-indigo-600 font-medium text-sm sm:text-base rounded-lg transition-colors shadow-lg"
            >
              Sign In Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
