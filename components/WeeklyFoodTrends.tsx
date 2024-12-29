'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyNutrients {
  day: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  date: string;
}

export default function WeeklyFoodTrends() {
  const [weeklyData, setWeeklyData] = useState<DailyNutrients[]>([]);
  const [foodHistory, setFoodHistory] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch this data from an API or local storage
    const mockWeeklyData: DailyNutrients[] = [
      { day: 'Mon', calories: 2000, fat: 65, protein: 100, carbs: 300 },
      { day: 'Tue', calories: 2200, fat: 70, protein: 110, carbs: 280 },
      { day: 'Wed', calories: 1900, fat: 60, protein: 95, carbs: 270 },
      { day: 'Thu', calories: 2100, fat: 68, protein: 105, carbs: 290 },
      { day: 'Fri', calories: 2300, fat: 75, protein: 115, carbs: 310 },
      { day: 'Sat', calories: 2400, fat: 80, protein: 120, carbs: 320 },
      { day: 'Sun', calories: 2000, fat: 65, protein: 100, carbs: 300 },
    ];
    setWeeklyData(mockWeeklyData);

    const mockFoodHistory: Product[] = [
      { id: '1', name: 'Apple', category: 'Fruit', date: '2023-05-01' },
      { id: '2', name: 'Chicken Breast', category: 'Meat', date: '2023-05-02' },
      { id: '3', name: 'Broccoli', category: 'Vegetable', date: '2023-05-03' },
      { id: '4', name: 'Salmon', category: 'Fish', date: '2023-05-04' },
      { id: '5', name: 'Yogurt', category: 'Dairy', date: '2023-05-05' },
    ];
    setFoodHistory(mockFoodHistory);
  }, []);

  const filteredFoodHistory = foodHistory.filter(
    product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weekly Food Trends</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Nutrient Intake Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" />
            <Line type="monotone" dataKey="fat" stroke="#82ca9d" />
            <Line type="monotone" dataKey="protein" stroke="#ffc658" />
            <Line type="monotone" dataKey="carbs" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Food History</h2>
        <input
          type="text"
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoodHistory.map(product => (
            <div key={product.id} className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Date: {product.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

