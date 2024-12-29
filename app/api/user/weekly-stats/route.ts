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
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyStats = user.dailyIntake
    .filter((intake: any) => new Date(intake.date) >= oneWeekAgo)
    .map((intake: any) => ({
      day: new Date(intake.date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: intake.totalCalories,
      protein: intake.totalProtein,
      carbs: intake.totalCarbs,
      fat: intake.totalFat,
    }));

  return NextResponse.json({ weeklyStats });
}

