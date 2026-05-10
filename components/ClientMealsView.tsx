'use client';

import { MealProvider } from '@/context/MealContext';
import MealsView from '@/components/MealsView';
import DepositsView from '@/components/DepositsView';

interface ClientMealsViewProps {
  userId: string;
}

export default function ClientMealsView({ userId }: ClientMealsViewProps) {
  return (
    <MealProvider>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
        {/* Meals Section */}
        <section className="flex-1 lg:w-1/2">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Meals History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your meal expenses and eating habits
            </p>
          </div>
          <MealsView userId={userId} />
        </section>

        {/* Deposits Section */}
        <section className="flex-1 lg:w-1/2">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Deposits History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View all your deposit transactions
            </p>
          </div>
          <DepositsView userId={userId} />
        </section>
      </div>
    </MealProvider>
  );
}
