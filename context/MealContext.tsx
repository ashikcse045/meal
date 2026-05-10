'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meal, Deposit } from '@/types';

interface MealContextType {
  meals: Meal[];
  deposits: Deposit[];
  loading: boolean;
  depositsLoading: boolean;
  addMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => Promise<void>;
  editMeal: (id: string, updatedData: Omit<Meal, 'id' | 'createdAt'>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addDeposit: (deposit: Omit<Deposit, 'id' | 'createdAt'>) => Promise<void>;
  editDeposit: (id: string, updatedData: Omit<Deposit, 'id' | 'createdAt'>) => Promise<void>;
  deleteDeposit: (id: string) => Promise<void>;
  getMealsByMonth: (year: number, month: number) => Meal[];
  getDepositsByMonth: (year: number, month: number) => Deposit[];
  getAllMeals: (userId: string) => Meal[];
  getAllDeposits: (userId: string) => Deposit[];
  refreshMeals: () => Promise<void>;
  refreshDeposits: () => Promise<void>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositsLoading, setDepositsLoading] = useState(true);

  // Load meals on mount
  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/meals');
        
        // Handle 401 (Unauthorized) gracefully - user is not logged in
        if (response.status === 401) {
          setMeals([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }
        
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMeals();
  }, []);

  // Load deposits on mount
  useEffect(() => {
    const loadDeposits = async () => {
      try {
        setDepositsLoading(true);
        const response = await fetch('/api/deposits');
        
        // Handle 401 (Unauthorized) gracefully - user is not logged in
        if (response.status === 401) {
          setDeposits([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch deposits');
        }
        
        const data = await response.json();
        setDeposits(data);
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setDeposits([]);
      } finally {
        setDepositsLoading(false);
      }
    };

    void loadDeposits();
  }, []);

  // Fetch meals from API (for manual refresh)
  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meals');
      
      // Handle 401 (Unauthorized) gracefully - user is not logged in
      if (response.status === 401) {
        setMeals([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (mealData: Omit<Meal, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add meal');
      }

      const newMeal = await response.json();
      setMeals(prev => [newMeal, ...prev]);
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  };

  const editMeal = async (id: string, updatedData: Omit<Meal, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meal');
      }

      const updatedMeal = await response.json();
      setMeals(prev =>
        prev.map(meal => (meal.id === id ? updatedMeal : meal))
      );
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  };

  const deleteMeal = async (id: string) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      setMeals(prev => prev.filter(meal => meal.id !== id));
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };

  const getMealsByMonth = (year: number, month: number) => {
    return meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getFullYear() === year && mealDate.getMonth() === month;
    });
  };

  const getAllMeals = (userId: string) => {
    return meals.filter(meal => meal.userId === userId);
  };

  const refreshMeals = async () => {
    await fetchMeals();
  };

  // Fetch deposits from API (for manual refresh)
  const fetchDeposits = async () => {
    try {
      setDepositsLoading(true);
      const response = await fetch('/api/deposits');
      
      // Handle 401 (Unauthorized) gracefully - user is not logged in
      if (response.status === 401) {
        setDeposits([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch deposits');
      }
      
      const data = await response.json();
      setDeposits(data);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      setDeposits([]);
    } finally {
      setDepositsLoading(false);
    }
  };

  const addDeposit = async (depositData: Omit<Deposit, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add deposit');
      }

      const newDeposit = await response.json();
      setDeposits(prev => [newDeposit, ...prev]);
    } catch (error) {
      console.error('Error adding deposit:', error);
      throw error;
    }
  };

  const editDeposit = async (id: string, updatedData: Omit<Deposit, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update deposit');
      }

      const updatedDeposit = await response.json();
      setDeposits(prev =>
        prev.map(deposit => (deposit.id === id ? updatedDeposit : deposit))
      );
    } catch (error) {
      console.error('Error updating deposit:', error);
      throw error;
    }
  };

  const deleteDeposit = async (id: string) => {
    try {
      const response = await fetch(`/api/deposits/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete deposit');
      }

      setDeposits(prev => prev.filter(deposit => deposit.id !== id));
    } catch (error) {
      console.error('Error deleting deposit:', error);
      throw error;
    }
  };

  const getDepositsByMonth = (year: number, month: number) => {
    return deposits.filter(deposit => {
      const depositDate = new Date(deposit.date);
      return depositDate.getFullYear() === year && depositDate.getMonth() === month;
    });
  };

  const getAllDeposits = (userId: string) => {
    return deposits.filter(deposit => deposit.userId === userId);
  };

  const refreshDeposits = async () => {
    await fetchDeposits();
  };

  return (
    <MealContext.Provider 
      value={{ 
        meals,
        deposits,
        loading,
        depositsLoading,
        addMeal,
        editMeal,
        deleteMeal,
        addDeposit,
        editDeposit,
        deleteDeposit,
        getMealsByMonth,
        getDepositsByMonth,
        getAllMeals,
        getAllDeposits,
        refreshMeals,
        refreshDeposits,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
}
