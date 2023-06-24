import React from 'react';
import _ from 'lodash';


const Pagination = ({items, pageSize, currentPage,  onPageChange}) => {

    const pageCount = items / pageSize;
    if (Math.ceil(pageCount) === 1) return null;
    const pages = _.range(1, pageCount + 1);


    return (
        <div className='mt-8'>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a href="#" className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
            </a>

            {pages.map(page => 
                <a href="#" aria-current="page" onClick={() => onPageChange(page)} className="page-item relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20">{page }</a>
            )}

        
            <a href="#" className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
            <span className="sr-only">Next</span>

            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
            </a>
        </nav>
        </div>
    )
}

export default Pagination