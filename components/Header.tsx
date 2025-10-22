
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Quản Lý Chi Tiêu Nhóm
        </h1>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
          Theo dõi các khoản ăn uống và thanh toán của cả nhóm một cách dễ dàng.
        </p>
      </div>
    </header>
  );
};

export default Header;
