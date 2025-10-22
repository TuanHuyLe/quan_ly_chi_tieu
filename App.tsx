
import React, { useState, useMemo, useEffect } from 'react';
import type { Member, Expense, SimplifiedDebt } from './types';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import { calculateBalances, simplifyDebts } from './services/expenseCalculator';

const initialMembers: Member[] = [
  { id: '1', name: 'An' },
  { id: '2', name: 'Bình' },
  { id: '3', name: 'Chi' },
  { id: '4', name: 'Dũng' },
];

const initialExpenses: Expense[] = [
    { id: 'e1', description: 'Bữa trưa ngày 1', amount: 800000, paidById: '1', splitForIds: ['1', '2', '3', '4'], date: new Date('2023-10-26T12:00:00Z').toISOString() },
    { id: 'e2', description: 'Cà phê', amount: 150000, paidById: '2', splitForIds: ['1', '2'], date: new Date('2023-10-26T14:00:00Z').toISOString() },
    { id: 'e3', description: 'Bữa tối BBQ', amount: 1200000, paidById: '3', splitForIds: ['1', '2', '3', '4'], date: new Date('2023-10-26T19:00:00Z').toISOString() },
];


const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('group_expense_members');
    return savedMembers ? JSON.parse(savedMembers) : initialMembers;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('group_expense_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('group_expense_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('group_expense_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${new Date().getTime()}`,
      date: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };
  
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  }

  const simplifiedDebts: SimplifiedDebt[] = useMemo(() => {
    const balances = calculateBalances(members, expenses);
    return simplifyDebts(balances, members);
  }, [members, expenses]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Danh Sách Chi Tiêu</h2>
                <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Thêm Chi Tiêu
                </button>
            </div>
            <ExpenseList expenses={expenses} members={members} onDelete={handleDeleteExpense} />
          </div>
          <div className="lg:col-span-1">
             <BalanceSummary debts={simplifiedDebts} />
          </div>
        </div>
      </main>
      {isFormVisible && (
        <ExpenseForm
          members={members}
          onAddExpense={handleAddExpense}
          onClose={() => setIsFormVisible(false)}
        />
      )}
    </div>
  );
};

export default App;
