'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSession } from 'next-auth/react';
import { parseISO, format } from 'date-fns';

interface DashboardStats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  imageUrl: string;
  ingredients: string;
  tags: string[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [dailyStats, setDailyStats] = useState<DashboardStats>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentFoods, setRecentFoods] = useState<FoodEntry[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dailyIntakeResponse, weeklyStatsResponse, foodListResponse] = await Promise.all([
        fetch('/api/user/daily-intake'),
        fetch('/api/user/weekly-stats'),
        fetch('/api/user/food-list')
      ]);

      if (!dailyIntakeResponse.ok || !weeklyStatsResponse.ok || !foodListResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dailyIntakeData = await dailyIntakeResponse.json();
      const weeklyStatsData = await weeklyStatsResponse.json();
      const foodListData = await foodListResponse.json();

      setDailyStats(dailyIntakeData.dailyIntake);
      setWeeklyData(weeklyStatsData.weeklyStats);
      setRecentFoods(foodListData.foodList.slice(-5).reverse()); // Get last 5 items in reverse order
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const calorieGoal = 2000;
  const remainingCalories = calorieGoal - dailyStats.totalCalories;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
          <p>Calories: {dailyStats.totalCalories.toFixed(0)} / {calorieGoal}</p>
          <p>Remaining: {remainingCalories.toFixed(0)}</p>
          <div className="mt-2">
            <ProgressBar label="Protein" value={dailyStats.totalProtein} max={100} />
            <ProgressBar label="Carbs" value={dailyStats.totalCarbs} max={250} />
            <ProgressBar label="Fat" value={dailyStats.totalFat} max={65} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Weekly Calorie Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Recently Logged Foods</h2>
        <ul>
          {recentFoods.map((food: FoodEntry) => (
            <li key={food.id} className="mb-2">
              <span className="font-medium">{food.name}</span> - {food.calories.toFixed(0)} calories
              <div className="text-sm text-gray-600">
                Protein: {food.protein.toFixed(1)}g | Carbs: {food.carbs.toFixed(1)}g | Fat: {food.fat.toFixed(1)}g
              </div>
              <div className="text-xs text-gray-500">
                {food.time ? `Added: ${format(parseISO(food.time), 'PPpp')}` : 'Time not available'}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute top-4 right-4">
        {session?.user?.name && (
          <p className="text-lg font-semibold">Welcome, {session.user.name}</p>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  const isExceeded = value > max;
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">
          {value.toFixed(1)}g {isExceeded && '⚠️'} / {max}g
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${isExceeded ? 'bg-red-600' : 'bg-blue-600'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

