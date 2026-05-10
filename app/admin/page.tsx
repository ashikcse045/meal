import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/UserManagement';
import PageContainer from '@/components/PageContainer';

export default async function AdminPage() {
  let session = null;
  
  try {
    session = await auth();
  } catch (error) {
    console.error('Auth error in Admin:', error);
    redirect('/login');
  }

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin
  if (!session.user?.isAdmin) {
    redirect('/dashboard');
  }

  return (
    <PageContainer 
      title="Admin Panel" 
      description="Manage user access and verification"
    >
      <UserManagement />
    </PageContainer>
  );
}
