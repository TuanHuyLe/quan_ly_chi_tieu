
import React from 'react';
import type { Member, Expense, SimplifiedDebt } from '../types';

interface BalanceSummaryProps {
  debts: SimplifiedDebt[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ debts }) => {
  if (debts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <div className="flex justify-center items-center">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Tất cả đã thanh toán xong!</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Không có ai nợ ai cả.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tổng Kết Công Nợ</h2>
      <ul className="space-y-3">
        {debts.map((debt, index) => (
          <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-primary-600 dark:text-primary-400">{debt.from.name}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              <span className="font-semibold text-green-600 dark:text-green-400">{debt.to.name}</span>
            </div>
            <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(debt.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BalanceSummary;
