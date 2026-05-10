'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { CheckCircle, XCircle, Shield, User as UserIcon } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/users');
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Intentional: Fetch users on mount. This is a standard data-fetching pattern.
    // The React compiler warning about setState in effects is a false positive for this use case.
    void fetchUsers();
  }, []);

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdatingUserId(userId);
      setError('');
      
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isVerified: !currentStatus }
          : user
      ));
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          User Management
        </h2>
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Total: {users.length}
        </span>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center gap-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user.isAdmin ? (
                  <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    User
                  </span>
                )}
                {user.isVerified ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <XCircle className="h-3 w-3" />
                    Pending
                  </span>
                )}
              </div>
              {!user.isAdmin && (
                <button
                  onClick={() => toggleUserVerification(user.id, user.isVerified)}
                  disabled={updatingUserId === user.id}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    user.isVerified
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingUserId === user.id ? (
                    'Updating...'
                  ) : user.isVerified ? (
                    'Revoke'
                  ) : (
                    'Verify'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isAdmin ? (
                      <span className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400">
                        <Shield className="h-4 w-4" />
                        Admin
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <XCircle className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.isAdmin ? (
                      <span className="text-gray-400 dark:text-gray-600">
                        No action
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleUserVerification(user.id, user.isVerified)}
                        disabled={updatingUserId === user.id}
                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                          user.isVerified
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingUserId === user.id ? (
                          'Updating...'
                        ) : user.isVerified ? (
                          'Revoke'
                        ) : (
                          'Verify'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
