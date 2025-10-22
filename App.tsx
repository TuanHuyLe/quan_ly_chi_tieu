
import React, { useState, useMemo, useEffect } from 'react';
import type { Member, Expense, SimplifiedDebt } from './types';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import MemberManager from './components/MemberManager'; // Import new component
import { calculateBalances, simplifyDebts } from './services/expenseCalculator';

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('group_expense_members');
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('group_expense_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('group_expense_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('group_expense_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddMember = (name: string) => {
    if (name.trim() === '') {
        alert('Tên thành viên không được để trống.');
        return;
    }
    if (members.some(member => member.name.toLowerCase() === name.trim().toLowerCase())) {
        alert('Tên thành viên đã tồn tại.');
        return;
    }
    const newMember: Member = {
      id: `mem-${new Date().getTime()}`,
      name: name.trim(),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleDeleteMember = (memberId: string) => {
    const isMemberInvolved = expenses.some(expense => 
        expense.paidById === memberId || expense.splitForIds.includes(memberId)
    );

    if (isMemberInvolved) {
        alert('Không thể xóa thành viên đã tham gia vào một khoản chi tiêu. Vui lòng xóa các chi tiêu liên quan trước.');
        return;
    }

    setMembers(prev => prev.filter(member => member.id !== memberId));
  };


  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${new Date().getTime()}`,
      date: new Date().toISOString(),
      settledByIds: newExpenseData.splitForIds.includes(newExpenseData.paidById) ? [newExpenseData.paidById] : [],
    };
    setExpenses(prev => [...prev, newExpense]);
  };
  
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  }

  const handleToggleSettlement = (expenseId: string, memberId: string) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => {
        if (expense.id === expenseId) {
          const settled = expense.settledByIds || [];
          // The payer cannot be unsettled
          if (memberId === expense.paidById) return expense;
          
          const newSettledByIds = settled.includes(memberId)
            ? settled.filter(id => id !== memberId)
            : [...settled, memberId];
          return { ...expense, settledByIds: newSettledByIds };
        }
        return expense;
      })
    );
  };

  const simplifiedDebts: SimplifiedDebt[] = useMemo(() => {
    if (members.length === 0 || expenses.length === 0) return [];
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
                disabled={members.length === 0}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Thêm Chi Tiêu
                </button>
            </div>
            <ExpenseList 
              expenses={expenses} 
              members={members} 
              onDelete={handleDeleteExpense} 
              onToggleSettlement={handleToggleSettlement}
            />
          </div>
          <div className="lg:col-span-1 space-y-8">
             <MemberManager members={members} onAddMember={handleAddMember} onDeleteMember={handleDeleteMember} />
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