'use client';

import { useState, useEffect, startTransition } from 'react';
import { useMeals } from '@/context/MealContext';
import { Meal } from '@/types';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const PRICE_SHORTCUTS = [60, 70, 80, 85, 90, 100];

export default function MealForm({ userId }: { userId: string }) {
  const { addMeal } = useMeals();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    mealType: 'lunch' as Meal['mealType'],
    description: '',
    price: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Load last used price from localStorage after hydration
  useEffect(() => {
    const lastPrice = localStorage.getItem('lastMealPrice');
    if (lastPrice) {
      startTransition(() => {
        setFormData(prev => ({ ...prev, price: lastPrice }));
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      await addMeal({
        userId,
        date: formData.date,
        mealType: formData.mealType,
        description: formData.description || undefined,
        price: parseInt(formData.price, 10),
      });

      // Save price to localStorage for next time
      localStorage.setItem('lastMealPrice', formData.price);

      // Show success message
      toast.success('Meal added successfully!');

      // Reset form but keep the price and meal type
      const savedPrice = formData.price;
      const savedMealType = formData.mealType;
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        mealType: savedMealType,
        description: '',
        price: savedPrice,
      });
    } catch (error) {
      console.error('Failed to add meal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add meal. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePriceShortcut = (price: number) => {
    setFormData({ ...formData, price: price.toString() });
  };

  return (
    <>
      {/* Meal Entry Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Add New Meal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value as Meal['mealType'] })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What did you eat?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRICE_SHORTCUTS.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => handlePriceShortcut(price)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                          formData.price === price.toString()
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {submitting ? 'Saving...' : 'Add Meal'}
            </button>
          </form>
        </div>
    </>
  );
}
