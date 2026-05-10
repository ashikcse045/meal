import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch all deposits for the authenticated user
export async function GET(request: NextRequest) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in GET /api/deposits:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    console.log('Fetching deposits for userId:', session.user.id);

    const db = await getDatabase();
    const deposits = await db
      .collection('deposits')
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .toArray();

    console.log('Found deposits count:', deposits.length);

    // Convert _id to id and remove _id
    const formattedDeposits = deposits.map(deposit => ({
      id: deposit._id.toString(),
      userId: deposit.userId,
      date: deposit.date,
      amount: deposit.amount,
      description: deposit.description,
      createdAt: deposit.createdAt,
    }));

    return NextResponse.json(formattedDeposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}

// POST - Add a new deposit
export async function POST(request: NextRequest) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in POST /api/deposits:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    console.log('Creating deposit for userId:', session.user.id);

    const body = await request.json();
    const { date, amount, description } = body;

    if (!date || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const newDeposit = {
      userId: session.user.id,
      date,
      amount: parseInt(amount, 10),
      description: description || undefined,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('deposits').insertOne(newDeposit);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newDeposit,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding deposit:', error);
    return NextResponse.json(
      { error: 'Failed to add deposit' },
      { status: 500 }
    );
  }
}
