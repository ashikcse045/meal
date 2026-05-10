import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Force this route to be dynamic (no caching)
export const dynamic = 'force-dynamic';

// PATCH - Update user verification status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in PATCH /api/users/[id]:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isVerified } = body;

    if (typeof isVerified !== 'boolean') {
      return NextResponse.json(
        { error: 'isVerified must be a boolean' },
        { status: 400 }
      );
    }

    console.log('Admin updating user verification:', id, 'isVerified:', isVerified);

    const db = await getDatabase();
    
    // Check if user exists
    const user = await db.collection('users').findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user verification status
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVerified } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
