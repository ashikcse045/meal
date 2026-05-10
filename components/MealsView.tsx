'use client';

import { useState } from 'react';
import { useMeals } from '@/context/MealContext';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react';
import { Meal } from '@/types';
import toast from 'react-hot-toast';

export default function MealsView({ userId }: { userId: string }) {
  const { editMeal, deleteMeal, getMealsByMonth, getAllMeals, getAllDeposits, loading } = useMeals();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    description: '',
    price: '',
    date: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthMeals = getMealsByMonth(year, month).filter(
    (meal) => meal.userId === userId
  );

  // Calculate LIFETIME stats (all meals ever)
  const allMeals = getAllMeals(userId);
  const allDeposits = getAllDeposits(userId);
  const lifetimeExpenses = allMeals.reduce((sum, meal) => sum + meal.price, 0);
  const lifetimeDeposits = allDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const currentBalance = lifetimeDeposits - lifetimeExpenses;
  const totalMealCount = allMeals.length;

  // Group meals by date
  const mealsByDate = monthMeals.reduce((acc, meal) => {
    const dateKey = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(meal);
    return acc;
  }, {} as Record<string, typeof monthMeals>);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const handleEditClick = (meal: Meal) => {
    setEditingMeal(meal);
    setEditForm({
      mealType: meal.mealType,
      description: meal.description || '',
      price: meal.price.toString(),
      date: format(new Date(meal.date), 'yyyy-MM-dd'),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeal || submitting) return;

    try {
      setSubmitting(true);
      await editMeal(editingMeal.id, {
        userId: editingMeal.userId,
        mealType: editForm.mealType,
        description: editForm.description,
        price: parseInt(editForm.price, 10),
        date: editForm.date,
      });

      toast.success('Transaction updated successfully!');
      setEditingMeal(null);
      setEditForm({ mealType: 'breakfast', description: '', price: '', date: '' });
    } catch (error) {
      console.error('Failed to update meal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update meal. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditingMeal(null);
    setEditForm({ mealType: 'breakfast', description: '', price: '', date: '' });
  };

  return (
    <div className="w-full mx-auto py-4 sm:py-6 md:py-8">
      {/* Month Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={goToCurrentMonth}
              className="mt-1 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Go to current month
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Lifetime Statistics */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            // Loading skeleton
            <>
              <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-gray-200 dark:bg-gray-700 p-4 sm:p-5 md:p-6 rounded-lg animate-pulse h-32"></div>
              <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-gray-200 dark:bg-gray-700 p-4 sm:p-5 md:p-6 rounded-lg animate-pulse h-32"></div>
              <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-gray-200 dark:bg-gray-700 p-4 sm:p-5 md:p-6 rounded-lg animate-pulse h-32"></div>
            </>
          ) : (
            <>
          <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
              Total Meals
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalMealCount}
            </p>
          </div>

          <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-red-50 dark:bg-red-900/20 p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
              Total Expenses
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              ৳{lifetimeExpenses.toLocaleString()}
            </p>
          </div>

          <div className="flex-1 md:w-[calc(33.333%-1rem)] bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
              Current Balance
            </p>
            <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              currentBalance >= 0 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              ৳{currentBalance.toLocaleString()}
            </p>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Meals List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Meal History
        </h3>

        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ) : monthMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No transactions recorded for this month
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {Object.keys(mealsByDate)
              .sort()
              .reverse()
              .map((dateKey) => {
                const dayMeals = mealsByDate[dateKey];
                const dayExpenses = dayMeals.reduce((sum, meal) => sum + meal.price, 0);

                return (
                  <div key={dateKey} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                      </h4>
                      <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{dayExpenses}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dayMeals.map((meal) => (
                        <div
                          key={meal.id}
                          className="flex items-start justify-between p-4 rounded-lg hover:opacity-90 transition-colors bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded capitalize bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                {meal.mealType}
                              </span>
                            </div>
                            {meal.description && (
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {meal.description}
                              </p>
                            )}
                            <p className="text-sm font-semibold mt-1 text-indigo-600 dark:text-indigo-400">
                              {meal.price}
                            </p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 shrink-0">
                            <button
                              onClick={() => handleEditClick(meal)}
                              className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => deleteMeal(meal.id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Transaction
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={editForm.mealType}
                    onChange={(e) => setEditForm({ ...editForm, mealType: e.target.value as typeof editForm.mealType })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="deposit">Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="What did you eat?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
