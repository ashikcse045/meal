import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET - Fetch all meals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in GET /api/meals:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    console.log('Fetching meals for userId:', session.user.id);

    const db = await getDatabase();
    const meals = await db
      .collection('meals')
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .toArray();

    console.log('Found meals count:', meals.length);

    // Convert _id to id and remove _id
    const formattedMeals = meals.map(meal => ({
      id: meal._id.toString(),
      userId: meal.userId,
      date: meal.date,
      mealType: meal.mealType,
      description: meal.description,
      price: meal.price,
      createdAt: meal.createdAt,
    }));

    return NextResponse.json(formattedMeals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

// POST - Add a new meal
export async function POST(request: NextRequest) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in POST /api/meals:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is verified
    if (!session.user.isVerified) {
      return NextResponse.json({ error: 'Account not verified. Please wait for admin approval.' }, { status: 403 });
    }

    console.log('Creating meal for userId:', session.user.id);

    const body = await request.json();
    const { date, mealType, description, price } = body;

    if (!date || !mealType || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if meal type already exists for this date
    const existingMeal = await db.collection('meals').findOne({
      userId: session.user.id,
      date: date,
      mealType: mealType,
    });

    if (existingMeal) {
      return NextResponse.json(
        { error: `You already have a ${mealType} entry for this date` },
        { status: 409 }
      );
    }

    const newMeal = {
      userId: session.user.id,
      date,
      mealType,
      description: description || undefined,
      price: parseInt(price, 10),
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('meals').insertOne(newMeal);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newMeal,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding meal:', error);
    return NextResponse.json(
      { error: 'Failed to add meal' },
      { status: 500 }
    );
  }
}
