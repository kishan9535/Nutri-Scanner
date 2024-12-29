'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function RecipeSuggestions() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestionPrompt, setSuggestionPrompt] = useState('');
  const [suggestedRecipe, setSuggestedRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Grilled Chicken Salad',
        ingredients: ['chicken breast', 'mixed greens', 'tomatoes', 'cucumber', 'olive oil', 'lemon juice'],
        instructions: [
          'Grill the chicken breast',
          'Chop vegetables',
          'Mix all ingredients in a bowl',
          'Drizzle with olive oil and lemon juice'
        ],
        calories: 350,
        protein: 30,
        carbs: 10,
        fat: 20,
      },
      {
        id: '2',
        name: 'Vegetarian Stir Fry',
        ingredients: ['tofu', 'broccoli', 'carrots', 'bell peppers', 'soy sauce', 'rice'],
        instructions: [
          'Cut tofu and vegetables into bite-sized pieces',
          'Stir fry tofu and vegetables in a pan',
          'Add soy sauce for flavor',
          'Serve over rice'
        ],
        calories: 300,
        protein: 15,
        carbs: 40,
        fat: 10,
      },
    ];
    setRecipes(mockRecipes);
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestedRecipe('');

    try {
      const response = await fetch('/api/food-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Suggest a recipe for ${suggestionPrompt} and provide step-by-step instructions on how to make it.` }),
      });

      if (!response.ok) {
        throw new Error('Failed to get food suggestion');
      }

      const data = await response.json();
      setSuggestedRecipe(data.suggestion);
    } catch (error) {
      console.error('Error getting food suggestion:', error);
      setSuggestedRecipe('Failed to get a recipe suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Suggestions</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask for a Recipe Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div>
              <Label htmlFor="suggestionPrompt">What kind of recipe are you looking for?</Label>
              <Input
                id="suggestionPrompt"
                value={suggestionPrompt}
                onChange={(e) => setSuggestionPrompt(e.target.value)}
                placeholder="E.g., healthy breakfast, quick dinner, vegetarian meal"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestion...
                </>
              ) : (
                'Get Recipe Suggestion'
              )}
            </Button>
          </form>
          {suggestedRecipe && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Suggested Recipe:</h3>
              <Textarea
                value={suggestedRecipe}
                readOnly
                className="w-full h-64"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <Label htmlFor="search">Search Existing Recipes</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by name or ingredient"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h3 className="font-bold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside mb-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
              <p>Calories: {recipe.calories} | Protein: {recipe.protein}g | Carbs: {recipe.carbs}g | Fat: {recipe.fat}g</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

