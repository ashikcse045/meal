import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Force this route to be dynamic (no caching)
export const dynamic = 'force-dynamic';

// PUT - Update a deposit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in PUT /api/deposits/[id]:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { date, amount, description } = body;

    if (!date || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify the deposit belongs to the user
    const existingDeposit = await db.collection('deposits').findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!existingDeposit) {
      return NextResponse.json(
        { error: 'Deposit not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedData = {
      date,
      amount: parseInt(amount, 10),
      description: description || undefined,
    };

    await db.collection('deposits').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    return NextResponse.json({
      id,
      userId: session.user.id,
      ...updatedData,
      createdAt: existingDeposit.createdAt,
    });
  } catch (error) {
    console.error('Error updating deposit:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a deposit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in DELETE /api/deposits/[id]:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDatabase();

    // Verify the deposit belongs to the user before deleting
    const result = await db.collection('deposits').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Deposit not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    return NextResponse.json(
      { error: 'Failed to delete deposit' },
      { status: 500 }
    );
  }
}
