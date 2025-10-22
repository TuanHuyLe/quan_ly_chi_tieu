
import React from 'react';
import type { Member, Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  onDelete: (expenseId: string) => void;
  onToggleSettlement: (expenseId: string, memberId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, members, onDelete, onToggleSettlement }) => {
  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown';

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Chưa có chi tiêu nào</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hãy bắt đầu bằng việc thêm một khoản chi tiêu mới.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.slice().reverse().map(expense => {
          const settledIds = expense.settledByIds || [];
          return (
            <li key={expense.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <p className="text-md font-medium text-primary-600 dark:text-primary-400 truncate">{expense.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getMemberName(expense.paidById)} đã trả
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tình trạng thanh toán:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                      {expense.splitForIds.map(memberId => {
                        const isSettled = settledIds.includes(memberId);
                        const isPayer = memberId === expense.paidById;
                        return (
                          <div key={memberId} className="flex items-center">
                            <input
                              id={`settle-${expense.id}-${memberId}`}
                              type="checkbox"
                              checked={isSettled}
                              disabled={isPayer}
                              onChange={() => onToggleSettlement(expense.id, memberId)}
                              className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${isPayer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            />
                            <label
                              htmlFor={`settle-${expense.id}-${memberId}`}
                              className={`ml-2 text-sm ${
                                isSettled
                                  ? 'text-gray-500 dark:text-gray-400 line-through'
                                  : 'text-gray-800 dark:text-gray-200'
                              } ${isPayer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {getMemberName(memberId)}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={() => onDelete(expense.id)} className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 self-start flex-shrink-0 ml-4">Xóa</button>
                </div>
              </div>

            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;