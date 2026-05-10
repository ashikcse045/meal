import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';

// GET - Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in GET /api/users:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('Fetching all users for admin:', session.user.email);

    const db = await getDatabase();
    const users = await db
      .collection('users')
      .find({})
      .sort({ email: 1 })
      .toArray();

    console.log('Found users count:', users.length);

    // Format users
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      image: user.image || '',
      isAdmin: user.isAdmin || false,
      isVerified: user.isVerified || false,
      emailVerified: user.emailVerified,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
