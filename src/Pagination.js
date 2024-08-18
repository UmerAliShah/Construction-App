import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <div className="flex justify-between items-center py-4">
      <button
        className={`px-3 py-2 border text-gray-600 rounded-lg hover:bg-gray-300 ${
          currentPage === 1 ? 'cursor-not-allowed text-gray-300' : ''
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          backgroundColor: currentPage === 1 ? '#e0e0e0' : 'transparent',
        }}
      >
        &lt;
      </button>

      <div className="flex space-x-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 border rounded-lg text-sm ${
              currentPage === page
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-100'
            }`}
            style={{
              minWidth: '32px',
              padding: '4px 8px',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`px-3 py-2 border text-gray-600 rounded-lg hover:bg-gray-300 ${
          currentPage === totalPages ? 'cursor-not-allowed text-gray-300' : ''
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          backgroundColor: currentPage === totalPages ? '#e0e0e0' : 'transparent',
        }}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
