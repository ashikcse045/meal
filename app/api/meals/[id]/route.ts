import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// PUT - Update a meal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in PUT /api/meals/[id]:', error);
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
    const { date, mealType, description, price } = body;

    if (!date || !mealType || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify the meal belongs to the user
    const existingMeal = await db.collection('meals').findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!existingMeal) {
      return NextResponse.json(
        { error: 'Meal not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if meal type already exists for this date
    // Only check if the meal type or date has changed
    if (mealType !== existingMeal.mealType || date !== existingMeal.date) {
      const duplicateMeal = await db.collection('meals').findOne({
        userId: session.user.id,
        date: date,
        mealType: mealType,
        _id: { $ne: new ObjectId(id) }, // Exclude current meal
      });

      if (duplicateMeal) {
        return NextResponse.json(
          { error: `You already have a ${mealType} entry for this date` },
          { status: 409 }
        );
      }
    }

    const updatedData = {
      date,
      mealType,
      description: description || undefined,
      price: parseInt(price, 10),
    };

    await db.collection('meals').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    return NextResponse.json({
      id,
      userId: session.user.id,
      ...updatedData,
      createdAt: existingMeal.createdAt,
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    return NextResponse.json(
      { error: 'Failed to update meal' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a meal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let session = null;
    
    try {
      session = await auth();
    } catch (error) {
      console.error('Auth error in DELETE /api/meals/[id]:', error);
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

    // Verify the meal belongs to the user before deleting
    const result = await db.collection('meals').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Meal not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json(
      { error: 'Failed to delete meal' },
      { status: 500 }
    );
  }
}
