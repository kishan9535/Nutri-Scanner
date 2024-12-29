import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ foodList: user.foodList });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const foodItem = await request.json();

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updatedFoodItem = {
    ...foodItem,
    time: new Date().toISOString(), // Ensure time is stored as ISO string
  };

  user.foodList.push(updatedFoodItem);
  user.recentItems.unshift(updatedFoodItem);
  user.recentItems = user.recentItems.slice(0, 5); // Keep only the 5 most recent items

  await user.save();

  return NextResponse.json({ message: 'Food item added successfully' });
}

