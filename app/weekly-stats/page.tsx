'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function WeeklyStats() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const response = await fetch('/api/user/weekly-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch weekly data');
      }
      const data = await response.json();
      setWeeklyData(data.weeklyStats);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      setError('Failed to load weekly stats. Please try again later.');
    }
  };

  const calculateAverages = () => {
    const sum = weeklyData.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      calories: Math.round(sum.calories / 7),
      protein: Math.round(sum.protein / 7),
      carbs: Math.round(sum.carbs / 7),
      fat: Math.round(sum.fat / 7),
    };
  };

  const averages = calculateAverages();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Weekly Stats</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Averages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-lg font-semibold">Calories</p>
            <p className="text-2xl">{averages.calories}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <p className="text-lg font-semibold">Protein</p>
            <p className="text-2xl">{averages.protein}g</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-lg font-semibold">Carbs</p>
            <p className="text-2xl">{averages.carbs}g</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-lg font-semibold">Fat</p>
            <p className="text-2xl">{averages.fat}g</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Nutrient Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories" fill="#8884d8" />
            <Bar dataKey="protein" fill="#82ca9d" />
            <Bar dataKey="carbs" fill="#ffc658" />
            <Bar dataKey="fat" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-left">Calories</th>
              <th className="p-2 text-left">Protein</th>
              <th className="p-2 text-left">Carbs</th>
              <th className="p-2 text-left">Fat</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((day) => (
              <tr key={day.day} className="border-b">
                <td className="p-2">{day.day}</td>
                <td className="p-2">{day.calories}</td>
                <td className="p-2">{day.protein}g</td>
                <td className="p-2">{day.carbs}g</td>
                <td className="p-2">{day.fat}g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

