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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyIntake = user.dailyIntake.find((intake: any) => {
    const intakeDate = new Date(intake.date);
    return intakeDate.getTime() === today.getTime();
  });

  if (!dailyIntake) {
    dailyIntake = {
      date: today,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      items: [],
    };
    user.dailyIntake.push(dailyIntake);
    await user.save();
  }

  // Ensure all items have a valid ISO string for time
  if (dailyIntake && dailyIntake.items) {
    dailyIntake.items = dailyIntake.items.map((item: any) => ({
      ...item,
      time: item.time ? new Date(item.time).toISOString() : new Date().toISOString(),
    }));
  }

  return NextResponse.json({ dailyIntake });
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyIntake = user.dailyIntake.find((intake: any) => {
    const intakeDate = new Date(intake.date);
    return intakeDate.getTime() === today.getTime();
  });

  if (!dailyIntake) {
    dailyIntake = {
      date: today.toISOString(),
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      items: [],
    };
    user.dailyIntake.push(dailyIntake);
  }

  const updatedFoodItem = {
    ...foodItem,
    time: new Date().toISOString(), // Ensure time is stored as ISO string
  };

  dailyIntake.items.push(updatedFoodItem);
  dailyIntake.totalCalories += updatedFoodItem.calories;
  dailyIntake.totalProtein += updatedFoodItem.protein;
  dailyIntake.totalCarbs += updatedFoodItem.carbs;
  dailyIntake.totalFat += updatedFoodItem.fat;

  await user.save();

  return NextResponse.json({ message: 'Food item added to daily intake', dailyIntake });
}

