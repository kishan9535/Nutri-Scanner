'use client'
import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  nutrients: {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
  };
  portion: number;
}

export default function DailyNutrientTracker() {
  const [dailyProducts, setDailyProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data from localStorage or an API
    const mockData: Product[] = [
      {
        id: '1',
        name: 'Apple',
        image: '/placeholder.svg?height=100&width=100',
        nutrients: { calories: 95, fat: 0.3, protein: 0.5, carbs: 25 },
        portion: 1,
      },
      {
        id: '2',
        name: 'Chicken Breast',
        image: '/placeholder.svg?height=100&width=100',
        nutrients: { calories: 165, fat: 3.6, protein: 31, carbs: 0 },
        portion: 1,
      },
    ];
    setDailyProducts(mockData);
  }, []);

  const updatePortion = (id: string, newPortion: number) => {
    setDailyProducts(products =>
      products.map(product =>
        product.id === id ? { ...product, portion: newPortion } : product
      )
    );
  };

  const removeProduct = (id: string) => {
    setDailyProducts(products => products.filter(product => product.id !== id));
  };

  const calculateTotalNutrients = () => {
    return dailyProducts.reduce(
      (total, product) => ({
        calories: total.calories + product.nutrients.calories * product.portion,
        fat: total.fat + product.nutrients.fat * product.portion,
        protein: total.protein + product.nutrients.protein * product.portion,
        carbs: total.carbs + product.nutrients.carbs * product.portion,
      }),
      { calories: 0, fat: 0, protein: 0, carbs: 0 }
    );
  };

  const totalNutrients = calculateTotalNutrients();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Daily Nutrient Tracker</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Total Daily Intake</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <p className="font-bold">Calories</p>
            <p>{totalNutrients.calories.toFixed(1)}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="font-bold">Fat (g)</p>
            <p>{totalNutrients.fat.toFixed(1)}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <p className="font-bold">Protein (g)</p>
            <p>{totalNutrients.protein.toFixed(1)}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="font-bold">Carbs (g)</p>
            <p>{totalNutrients.carbs.toFixed(1)}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Today's Products</h2>
        {dailyProducts.map(product => (
          <div key={product.id} className="flex items-center mb-4 p-4 bg-gray-100 rounded">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-4" />
            <div className="flex-grow">
              <h3 className="font-bold">{product.name}</h3>
              <p>Calories: {(product.nutrients.calories * product.portion).toFixed(1)}</p>
              <p>Fat: {(product.nutrients.fat * product.portion).toFixed(1)}g</p>
              <p>Protein: {(product.nutrients.protein * product.portion).toFixed(1)}g</p>
              <p>Carbs: {(product.nutrients.carbs * product.portion).toFixed(1)}g</p>
            </div>
            <div className="flex flex-col items-end">
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={product.portion}
                onChange={(e) => updatePortion(product.id, Number(e.target.value))}
                className="w-16 mb-2 p-1 border rounded"
              />
              <button
                onClick={() => removeProduct(product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

