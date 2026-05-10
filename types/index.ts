export interface Meal {
  id: string;
  userId: string;
  date: string; // Date only (YYYY-MM-DD)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description?: string; // Optional description
  price: number;
  createdAt: string; // Backend timestamp
}

export interface Deposit {
  id: string;
  userId: string;
  date: string; // Date only (YYYY-MM-DD)
  amount: number;
  description?: string; // Optional description
  createdAt: string; // Backend timestamp
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface MealStats {
  totalMeals: number;
  totalSpent: number;
  averagePerMeal: number;
  monthlyTotal: number;
}
