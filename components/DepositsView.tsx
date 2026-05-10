'use client';

import { useState } from 'react';
import { useMeals } from '@/context/MealContext';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2, Wallet, Pencil } from 'lucide-react';
import { Deposit } from '@/types';
import toast from 'react-hot-toast';

export default function DepositsView({ userId }: { userId: string }) {
  const { editDeposit, deleteDeposit, getDepositsByMonth, getAllDeposits, depositsLoading } = useMeals();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    amount: '',
    description: '',
    date: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthDeposits = getDepositsByMonth(year, month).filter(
    (deposit) => deposit.userId === userId
  );

  // Calculate LIFETIME stats (all deposits ever)
  const allDeposits = getAllDeposits(userId);
  const lifetimeDeposits = allDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const totalDepositCount = allDeposits.length;

  // Group deposits by date
  const depositsByDate = monthDeposits.reduce((acc, deposit) => {
    const dateKey = format(new Date(deposit.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(deposit);
    return acc;
  }, {} as Record<string, typeof monthDeposits>);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const handleEditClick = (deposit: Deposit) => {
    setEditingDeposit(deposit);
    setEditForm({
      amount: deposit.amount.toString(),
      description: deposit.description || '',
      date: format(new Date(deposit.date), 'yyyy-MM-dd'),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeposit || submitting) return;

    try {
      setSubmitting(true);
      await editDeposit(editingDeposit.id, {
        userId: editingDeposit.userId,
        amount: parseInt(editForm.amount, 10),
        description: editForm.description,
        date: editForm.date,
      });

      toast.success('Deposit updated successfully!');
      setEditingDeposit(null);
      setEditForm({ amount: '', description: '', date: '' });
    } catch (error) {
      console.error('Failed to update deposit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update deposit. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditingDeposit(null);
    setEditForm({ amount: '', description: '', date: '' });
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8">
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
              className="mt-1 text-xs sm:text-sm text-green-600 dark:text-green-400 hover:underline"
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
        <div className="flex flex-col md:flex-row flex-wrap gap-2 sm:gap-4">
          {depositsLoading ? (
            // Loading skeleton
            <>
              <div className="flex-1 md:w-[calc(50%-0.5rem)] bg-gray-200 dark:bg-gray-700 p-3 sm:p-4 rounded-lg animate-pulse h-24"></div>
              <div className="flex-1 md:w-[calc(50%-0.5rem)] bg-gray-200 dark:bg-gray-700 p-3 sm:p-4 rounded-lg animate-pulse h-24"></div>
            </>
          ) : (
            <>
              <div className="flex-1 md:w-[calc(50%-0.5rem)] bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Deposits
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalDepositCount}
                </p>
              </div>

              <div className="flex-1 md:w-[calc(50%-0.5rem)] bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Lifetime Amount
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  ৳{lifetimeDeposits.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deposits List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Deposit History
        </h3>

        {depositsLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        ) : monthDeposits.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No deposits recorded for this month
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {Object.keys(depositsByDate)
              .sort()
              .reverse()
              .map((dateKey) => {
                const dayDeposits = depositsByDate[dateKey];
                const dayTotal = dayDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

                return (
                  <div key={dateKey} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                      </h4>
                      <span className="font-medium text-green-600 dark:text-green-400 text-sm">
                        +{dayTotal}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayDeposits.map((deposit) => (
                        <div
                          key={deposit.id}
                          className="flex items-start justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 hover:opacity-90 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                <Wallet className="w-3 h-3" />
                                Deposit
                              </span>
                            </div>
                            {deposit.description && (
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {deposit.description}
                              </p>
                            )}
                            <p className="text-sm font-semibold mt-1 text-green-600 dark:text-green-400">
                              +{deposit.amount}
                            </p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 shrink-0">
                            <button
                              onClick={() => handleEditClick(deposit)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => deleteDeposit(deposit.id)}
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
      {editingDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Deposit
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Description"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-sm"
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
