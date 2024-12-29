'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nutrient Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
                <Input
                  id="calorieGoal"
                  type="number"
                  value={localSettings.calorieGoal}
                  onChange={(e) => handleChange('calorieGoal', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="proteinGoal">Daily Protein Goal (g)</Label>
                <Input
                  id="proteinGoal"
                  type="number"
                  value={localSettings.proteinGoal}
                  onChange={(e) => handleChange('proteinGoal', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="carbsGoal">Daily Carbs Goal (g)</Label>
                <Input
                  id="carbsGoal"
                  type="number"
                  value={localSettings.carbsGoal}
                  onChange={(e) => handleChange('carbsGoal', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fatGoal">Daily Fat Goal (g)</Label>
                <Input
                  id="fatGoal"
                  type="number"
                  value={localSettings.fatGoal}
                  onChange={(e) => handleChange('fatGoal', Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={localSettings.darkMode}
                onCheckedChange={(checked) => handleChange('darkMode', checked)}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={localSettings.notifications}
                onCheckedChange={(checked) => handleChange('notifications', checked)}
              />
            </div>
            <div>
              <Label htmlFor="measurementUnit">Measurement Unit</Label>
              <Select
                value={localSettings.measurementUnit}
                onValueChange={(value: 'metric' | 'imperial') => handleChange('measurementUnit', value)}
              >
                <SelectTrigger id="measurementUnit">
                  <SelectValue placeholder="Select a measurement unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (g, kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (oz, lb, in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Save Settings</Button>
      </form>
    </div>
  );
}

