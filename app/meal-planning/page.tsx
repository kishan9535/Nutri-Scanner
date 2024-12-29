'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ConsumedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function MealPlanning() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState<Meal>({
    id: '',
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [consumedFoods, setConsumedFoods] = useState<ConsumedFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    fetchConsumedFoods();
  }, []);

  const fetchConsumedFoods = async () => {
    try {
      const response = await fetch('/api/user/daily-intake');
      if (response.ok) {
        const data = await response.json();
        setConsumedFoods(data.dailyIntake.items);
      } else {
        console.error('Failed to fetch consumed foods');
      }
    } catch (error) {
      console.error('Error fetching consumed foods:', error);
    }
  };

  const handleAddMeal = () => {
    if (newMeal.name) {
      setMeals([...meals, { ...newMeal, id: Date.now().toString() }]);
      setNewMeal({
        id: '',
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }
  };

  const handleRemoveMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const generateSuggestion = async () => {
    setIsLoading(true);
    setSuggestion('');

    const totalNutrients = consumedFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const prompt = `Based on the following consumed foods and their total nutrients for today:
      ${consumedFoods.map(food => `- ${food.name}`).join('\n')}
      
      Total nutrients consumed:
      Calories: ${totalNutrients.calories.toFixed(0)}
      Protein: ${totalNutrients.protein.toFixed(1)}g
      Carbs: ${totalNutrients.carbs.toFixed(1)}g
      Fat: ${totalNutrients.fat.toFixed(1)}g

      Please suggest a meal plan for the next few hours and the next few days that complements these foods and balances the overall nutrition. Include specific meal ideas and explain why they're beneficial.`;

    try {
      const response = await fetch('/api/meal-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get meal suggestion');
      }

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error getting meal suggestion:', error);
      setSuggestion('Failed to get a meal suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meal Planning</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Consumed Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {consumedFoods.map((food, index) => (
              <li key={index} className="mb-2">
                {food.name} - Calories: {food.calories}, Protein: {food.protein}g, Carbs: {food.carbs}g, Fat: {food.fat}g
              </li>
            ))}
          </ul>
          <Button onClick={generateSuggestion} className="mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestion...
              </>
            ) : (
              'Get Meal Suggestion'
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestion && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Meal Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={suggestion} readOnly className="w-full h-64" />
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mealName">Meal Name</Label>
              <Input
                id="mealName"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={newMeal.fat}
                onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={handleAddMeal} className="mt-4">Add Meal</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="day">Select Day</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-4 bg-gray-100 rounded">
                <div>
                  <h3 className="font-bold">{meal.name}</h3>
                  <p>Calories: {meal.calories} | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g</p>
                </div>
                <Button variant="destructive" onClick={() => handleRemoveMeal(meal.id)}>Remove</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

