'use client';

import { MealProvider } from '@/context/MealContext';
import MealForm from '@/components/MealForm';
import DepositForm from '@/components/DepositForm';

interface ClientDashboardProps {
  userId: string;
}

export default function ClientDashboard({ userId }: ClientDashboardProps) {
  return (
    <MealProvider>
      <div className="flex flex-col lg:flex-row flex-wrap gap-4 sm:gap-6 lg:gap-8">
        <div className="flex-1 lg:w-[calc(50%-1rem)]">
          <MealForm userId={userId} />
        </div>
        <div className="flex-1 lg:w-[calc(50%-1rem)]">
          <DepositForm userId={userId} />
        </div>
      </div>
    </MealProvider>
  );
}
