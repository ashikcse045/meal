'use client';

import { useMemo } from 'react';
import { useMeals } from '@/context/MealContext';

interface SummaryCardsProps {
  userId: string;
}

export default function SummaryCards({ userId }: SummaryCardsProps) {
  const { meals, deposits, loading, depositsLoading } = useMeals();

  // Calculate summary data from context
  const summary = useMemo(() => {
    const userMeals = meals.filter(meal => meal.userId === userId);
    const userDeposits = deposits.filter(deposit => deposit.userId === userId);

    const totalExpenses = userMeals.reduce((sum, meal) => sum + meal.price, 0);
    const totalDeposits = userDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    const balance = totalDeposits - totalExpenses;

    return {
      totalExpenses,
      totalDeposits,
      balance,
    };
  }, [meals, deposits, userId]);

  const isLoading = loading || depositsLoading;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
      {/* Total Expenses Card */}
      <div className="flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Total Expenses
        </h3>
        {isLoading ? (
          <div className="h-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ৳{summary.totalExpenses.toLocaleString()}
          </p>
        )}
      </div>

      {/* Total Deposits Card */}
      <div className="flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Total Deposits
        </h3>
        {isLoading ? (
          <div className="h-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ৳{summary.totalDeposits.toLocaleString()}
          </p>
        )}
      </div>

      {/* Balance Card */}
      <div className={`flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
        summary.balance >= 0 ? 'border-blue-500' : 'border-orange-500'
      }`}>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Current Balance
        </h3>
        {isLoading ? (
          <div className="h-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ৳{summary.balance.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
