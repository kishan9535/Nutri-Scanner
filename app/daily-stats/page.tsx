'use client'

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Image from 'next/image';
import { parseISO, format } from 'date-fns';

interface NutrientData {
  name: string;
  value: number;
  color: string;
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

interface DailyIntake {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: FoodEntry[];
}

export default function DailyStats() {
  const [nutrientData, setNutrientData] = useState<NutrientData[]>([]);
  const [dailyIntake, setDailyIntake] = useState<DailyIntake | null>(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieGoal] = useState(2000); // This could be user-configurable
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyIntake();
  }, []);

  const fetchDailyIntake = async () => {
    try {
      const response = await fetch('/api/user/daily-intake');
      if (!response.ok) {
        throw new Error('Failed to fetch daily intake');
      }
      const data = await response.json();
      setDailyIntake(data.dailyIntake);
      setTotalCalories(data.dailyIntake.totalCalories);

      setNutrientData([
        { name: 'Protein', value: data.dailyIntake.totalProtein, color: '#FF8042' },
        { name: 'Carbs', value: data.dailyIntake.totalCarbs, color: '#00C49F' },
        { name: 'Fat', value: data.dailyIntake.totalFat, color: '#FFBB28' },
      ]);
    } catch (error) {
      console.error('Error fetching daily intake:', error);
      setError('Failed to load daily stats. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Daily Stats</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Macronutrient Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={nutrientData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {nutrientData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Calorie Goal Progress</h2>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-4xl font-bold">{totalCalories} / {calorieGoal}</p>
              <p className="text-xl mt-2">Calories Consumed</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Today's Food Entries</h2>
        <div className="space-y-4">
          {dailyIntake?.items.map((entry) => (
            <div key={entry.id} className="flex flex-col md:flex-row items-start md:items-center border-b pb-4">
              <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
                <Image
                  src={entry.imageUrl || '/placeholder.svg?height=60&width=60'}
                  alt={entry.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{entry.name}</h3>
                <p className="text-sm">
                  Calories: {entry.calories} | Protein: {entry.protein}g | 
                  Carbs: {entry.carbs}g | Fat: {entry.fat}g
                </p>
                <p className="text-xs text-gray-500">
                  {entry.time 
                    ? `Added: ${format(parseISO(entry.time), 'PPpp')}` 
                    : 'Time not available'}
                </p>
                <p className="text-xs text-gray-600">Ingredients: {entry.ingredients}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

