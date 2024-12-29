import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a proper database.
let dailyIntake: any[] = [];
let dashboardStats = {
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
};

export async function POST(request: Request) {
  const product = await request.json();

  const newItem = {
    id: Date.now().toString(),
    name: product.product_name,
    calories: product.nutriments['energy-kcal'] || 0,
    protein: product.nutriments.proteins || 0,
    carbs: product.nutriments.carbohydrates || 0,
    fat: product.nutriments.fat || 0,
    time: new Date().toLocaleTimeString(),
    imageUrl: product.image_url,
    ingredients: product.ingredients_text,
    tags: product.tags || [],
  };

  // Add the product to the daily intake
  dailyIntake.push(newItem);

  // Update dashboard stats
  dashboardStats.totalCalories += newItem.calories;
  dashboardStats.totalProtein += newItem.protein;
  dashboardStats.totalCarbs += newItem.carbs;
  dashboardStats.totalFat += newItem.fat;

  return NextResponse.json({ message: 'Product added to daily intake' }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ dailyIntake, dashboardStats });
}

