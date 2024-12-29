'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tag, Package, Leaf } from 'lucide-react';
import TagProductList from './TagProductList';
import { parseISO, format } from 'date-fns';

interface ProductDetailsProps {
  product: {
    product_name: string;
    brands: string;
    image_url: string;
    ingredients_text: string;
    nutriments: {
      'energy-kcal': number;
      proteins: number;
      carbohydrates: number;
      fat: number;
    };
    nutrition_grades?: string;
    tags?: string[];
    time?: string;
  };
  onAddToDailyIntake: (product: any) => void;
}

export default function ProductDetails({ product, onAddToDailyIntake }: ProductDetailsProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addToDailyIntake = async (product: any) => {
    try {
      const currentTime = new Date().toISOString();
      const foodItem = {
        name: product.product_name,
        calories: product.nutriments['energy-kcal'] || 0,
        protein: product.nutriments.proteins || 0,
        carbs: product.nutriments.carbohydrates || 0,
        fat: product.nutriments.fat || 0,
        imageUrl: product.image_url,
        ingredients: product.ingredients_text,
        tags: product.tags || [],
        time: currentTime,
      };

      const response = await fetch('/api/user/daily-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to daily intake');
      }

      // Also add to food list
      await fetch('/api/user/food-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodItem),
      });

      console.log('Item added to daily intake and food list');
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item');
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Product Details:</h2>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-full md:max-w-md mb-4 md:mb-0">
          <Image
            src={product.image_url || '/placeholder.svg?height=300&width=300'}
            alt={product.product_name}
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-auto"
          />
        </div>
        <div className="md:flex-1 md:pl-6">
          <p className="mb-2"><strong>Name:</strong> {product.product_name}</p>
          <p className="mb-2"><strong>Brand:</strong> {product.brands}</p>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Nutrition Facts (per 100g)
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Energy</p>
              <p>{product.nutriments['energy-kcal']} kcal</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Proteins</p>
              <p>{product.nutriments.proteins}g</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Carbohydrates</p>
              <p>{product.nutriments.carbohydrates}g</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-medium">Fat</p>
              <p>{product.nutriments.fat}g</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Ingredients
          </h3>
          <p className="text-gray-700 mb-4">{product.ingredients_text}</p>

          <h3 className="text-xl font-bold mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags && product.tags.length > 0 ? (
              product.tags.map((tag, index) => (
                <button
                  key={`tag-${tag}-${index}`}
                  onClick={() => handleTagClick(tag)}
                  className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center hover:bg-gray-300 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {tag}
                </button>
              ))
            ) : (
              <span>No tags available</span>
            )}
          </div>

          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${product.nutrition_grades === 'a' ? 'bg-green-100 text-green-800' :
                product.nutrition_grades === 'b' ? 'bg-blue-100 text-blue-800' :
                product.nutrition_grades === 'c' ? 'bg-yellow-100 text-yellow-800' :
                product.nutrition_grades === 'd' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'}`}>
              Nutri-Score: {product.nutrition_grades?.toUpperCase() || 'N/A'}
            </span>
          </div>
          <div className="mt-4">
            {product.time && (
              <p className="text-sm text-gray-500">
                Added: {format(parseISO(product.time), 'PPpp')}
              </p>
            )}
            <Button
              onClick={() => addToDailyIntake(product)}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add to Daily Intake
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
      {selectedTag && (
        <TagProductList tag={selectedTag} onClose={() => setSelectedTag(null)} />
      )}
    </div>
  );
}

