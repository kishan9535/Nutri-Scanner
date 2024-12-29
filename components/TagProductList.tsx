'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image_url: string;
  nutriments: {
    [key: string]: number;
  };
}

interface TagProductListProps {
  tag: string;
  onClose: () => void;
}

export default function TagProductList({ tag, onClose }: TagProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const fetchProducts = async () => {
      // Simulating API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          image_url: '/placeholder.svg?height=100&width=100',
          nutriments: { 'energy-kcal': 100, proteins: 5, carbohydrates: 20, fat: 2 },
        },
        {
          id: '2',
          name: 'Product 2',
          image_url: '/placeholder.svg?height=100&width=100',
          nutriments: { 'energy-kcal': 150, proteins: 8, carbohydrates: 25, fat: 3 },
        },
        // Add more mock products as needed
      ];
      setProducts(mockProducts);
    };

    fetchProducts();
  }, [tag]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products tagged with "{tag}"</h2>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4 p-4 border rounded">
              <Image
                src={product.image_url}
                alt={product.name}
                width={100}
                height={100}
                className="rounded"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p>Calories: {product.nutriments['energy-kcal']} kcal</p>
                <p>Protein: {product.nutriments.proteins}g</p>
                <p>Carbs: {product.nutriments.carbohydrates}g</p>
                <p>Fat: {product.nutriments.fat}g</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

