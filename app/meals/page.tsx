import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientMealsView from '@/components/ClientMealsView';
import PageContainer from '@/components/PageContainer';

export default async function MealsPage() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    console.error('Auth error in Meals:', error);
    redirect('/login');
  }

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id || 'user123';

  // Show verification message for unverified users
  if (!session.user?.isVerified) {
    return (
      <PageContainer>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                Account Pending Verification
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Your account is awaiting admin approval. You won&apos;t be able to view meals and deposits until your account is verified.
                  Please contact the administrator if you need immediate access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ClientMealsView userId={userId} />
    </PageContainer>
  );
}
