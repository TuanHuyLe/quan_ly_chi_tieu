
import React, { useState } from 'react';
import type { Member, Expense } from '../types';

interface ExpenseFormProps {
  members: Member[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ members, onAddExpense, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidById, setPaidById] = useState<string>(members[0]?.id || '');
  const [splitForIds, setSplitForIds] = useState<string[]>(members.map(m => m.id));
  const [error, setError] = useState('');

  const handleSplitForChange = (memberId: string) => {
    setSplitForIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSplitForIds(members.map(m => m.id));
    } else {
      setSplitForIds([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || amount <= 0 || !paidById || splitForIds.length === 0) {
      setError('Vui lòng điền đầy đủ và chính xác các thông tin.');
      return;
    }
    setError('');
    onAddExpense({
      description,
      amount: Number(amount),
      paidById,
      splitForIds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Thêm Chi Tiêu Mới</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung</label>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="VD: Ăn trưa nhà hàng ABC" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền (VND)</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="VD: 500000" />
          </div>
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Người trả</label>
            <select id="paidBy" value={paidById} onChange={e => setPaidById(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chia cho</p>
            <div className="mt-2 space-y-2">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="select-all" type="checkbox" checked={splitForIds.length === members.length} onChange={e => handleSelectAll(e.target.checked)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="select-all" className="font-medium text-gray-700 dark:text-gray-300">Chọn tất cả</label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                {members.map(member => (
                    <div key={member.id} className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id={`member-${member.id}`} type="checkbox" checked={splitForIds.includes(member.id)} onChange={() => handleSplitForChange(member.id)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={`member-${member.id}`} className="font-medium text-gray-700 dark:text-gray-300">{member.name}</label>
                        </div>
                    </div>
                ))}
                </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
