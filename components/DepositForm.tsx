'use client';

import { useState } from 'react';
import { useMeals } from '@/context/MealContext';
import { format } from 'date-fns';
import { Wallet, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepositForm({ userId }: { userId: string }) {
  const { addDeposit } = useMeals();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      await addDeposit({
        userId,
        date: formData.date,
        amount: parseInt(formData.amount, 10),
        description: formData.description || undefined,
      });

      toast.success('Deposit added successfully!');

      // Reset form
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to add deposit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add deposit. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Add Deposit
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Monthly allowance, Payment received"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !formData.amount}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            'Adding...'
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Add Deposit
            </>
          )}
        </button>
      </form>
    </div>
  );
}
