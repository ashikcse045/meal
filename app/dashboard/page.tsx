import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SummaryCards from '@/components/SummaryCards';
import ClientDashboard from '@/components/ClientDashboard';
import PageContainer from '@/components/PageContainer';
import { MealProvider } from '@/context/MealContext';

export default async function DashboardPage() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    console.error('Auth error in Dashboard:', error);
    redirect('/login');
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <PageContainer 
      title="Dashboard" 
      description="Track your meals and manage your deposits"
    >

      {/* Verification Status Alert */}
      {!session.user?.isVerified && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Account Pending Verification
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Your account is awaiting admin approval. You won&apos;t be able to add or view meals until your account is verified.
                  Please contact the administrator if you need immediate access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards and Forms - Only show for verified users */}
      {session.user?.isVerified ? (
        <MealProvider>
          <SummaryCards userId={session.user?.id || 'user123'} />
          <ClientDashboard userId={session.user?.id || 'user123'} />
        </MealProvider>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Access Restricted
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your account needs to be verified before you can access this content.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
