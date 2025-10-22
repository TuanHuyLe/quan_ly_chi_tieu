
import React, { useState } from 'react';
import type { Member } from '../types';

interface MemberManagerProps {
  members: Member[];
  onAddMember: (name: string) => void;
  onDeleteMember: (id: string) => void;
}

const MemberManager: React.FC<MemberManagerProps> = ({ members, onAddMember, onDeleteMember }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember(newMemberName);
    setNewMemberName('');
  };

  const handleDeleteConfirm = (memberId: string, memberName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${memberName}" không?`)) {
      onDeleteMember(memberId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quản Lý Thành Viên</h2>
      
      <form onSubmit={handleAddSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Tên thành viên mới"
          className="flex-grow block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          aria-label="Tên thành viên mới"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        >
          Thêm
        </button>
      </form>

      <div className="mt-4">
        {members.length > 0 ? (
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <span className="text-gray-800 dark:text-gray-200">{member.name}</span>
                <button 
                  onClick={() => handleDeleteConfirm(member.id, member.name)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  aria-label={`Xóa ${member.name}`}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            Chưa có thành viên nào. <br/> Hãy bắt đầu bằng việc thêm người đầu tiên vào nhóm.
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberManager;
