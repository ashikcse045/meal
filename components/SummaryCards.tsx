import { auth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { Meal, Deposit } from '@/types';

interface SummaryData {
  totalExpenses: number;
  totalDeposits: number;
  balance: number;
}

async function getSummaryData(userId: string): Promise<SummaryData> {
  try {
    const db = await getDatabase();
    
    // Fetch meals and deposits from database
    const meals = await db.collection<Meal>('meals')
      .find({ userId })
      .toArray();
    
    const deposits = await db.collection<Deposit>('deposits')
      .find({ userId })
      .toArray();

    // Calculate totals
    const totalExpenses = meals.reduce((sum, meal) => sum + meal.price, 0);
    const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    const balance = totalDeposits - totalExpenses;

    return {
      totalExpenses,
      totalDeposits,
      balance,
    };
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return {
      totalExpenses: 0,
      totalDeposits: 0,
      balance: 0,
    };
  }
}

export default async function SummaryCards() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const summary = await getSummaryData(session.user.id);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
      {/* Total Expenses Card */}
      <div className="flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Total Expenses
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ৳{summary.totalExpenses.toLocaleString()}
        </p>
      </div>

      {/* Total Deposits Card */}
      <div className="flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Total Deposits
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ৳{summary.totalDeposits.toLocaleString()}
        </p>
      </div>

      {/* Balance Card */}
      <div className={`flex-1 sm:w-[calc(33.333%-0.667rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
        summary.balance >= 0 ? 'border-blue-500' : 'border-orange-500'
      }`}>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Current Balance
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ৳{summary.balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
