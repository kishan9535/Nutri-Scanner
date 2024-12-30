import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  imageUrl: String,
  ingredients: String,
  tags: [String],
  time: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  scannedAt: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  }
});

const DailyIntakeSchema = new mongoose.Schema({
  date: { 
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  items: [FoodItemSchema],
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
  recentItems: [FoodItemSchema],
  foodList: [FoodItemSchema],
  dailyIntake: [DailyIntakeSchema],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
