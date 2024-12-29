'use client'

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface FoodItem {
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

export default function MyFoodList() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof FoodItem>('name');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('/api/user/food-list');
      if (!response.ok) {
        throw new Error('Failed to fetch food items');
      }
      const data = await response.json();
      setFoodItems(data.foodList);
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to load food items. Please try again later.');
    }
  };

  const filteredItems = foodItems
    .filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/food-list/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      await fetchFoodItems(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Food List</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as keyof FoodItem)}
          className="p-2 border rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="calories">Sort by Calories</option>
          <option value="protein">Sort by Protein</option>
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {filteredItems.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center mb-4 p-4 bg-gray-100 rounded">
            <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
              <Image
                src={item.imageUrl || '/placeholder.svg?height=80&width=80'}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Calories: {item.calories.toFixed(1)} | Protein: {item.protein.toFixed(1)}g | 
                Carbs: {item.carbs.toFixed(1)}g | Fat: {item.fat.toFixed(1)}g
              </p>
              <p className="text-sm text-gray-500">Added at: {item.time}</p>
              <p className="text-sm text-gray-600 mt-1">Ingredients: {item.ingredients}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:ml-4">
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

