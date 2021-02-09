import React from "react";

const Pagination = (props) => {
  
    const { offset, setOffset, limit, setLimit, linkCount } = props;

    const paginationText = (linkCount !== 0) ?
                            (linkCount > offset + limit) ? `${offset + 1} to ${offset + limit} of ${linkCount}` : `${offset + 1} to ${linkCount} of ${linkCount}`
                            : `0 to 0 of 0`;

    const handlePrevClick = () => {
        if(offset !== 0) {
            setOffset(offset - limit);
        }
    }

    const handleNextClick = () => {
        if(offset + limit < linkCount) {
            setOffset(offset + limit);
        }
    }

    return (
        <div class="flex items-center flex-row justify-end p-2 w-full">
            <h3 class="text-s py-2 px-4 text-gray-800">{paginationText}</h3>
            <div class="flex flex-row"> 
                <button 
                    class='bg-indigo-200 text-indigo-600 rounded-r-none border-r-0 border-2 border-indigo-600 font-bold py-2 px-4 rounded hover:bg-indigo-500 hover:border-indigo-900 hover:text-indigo-900 focus:outline-none'
                    onClick={handlePrevClick}
                >
                    Prev
                </button>
                <button 
                    class='bg-indigo-200 text-indigo-600 border-2 rounded-l-none border-l-1 border-indigo-600 font-bold py-2 px-4 rounded hover:bg-indigo-500 hover:border-indigo-900 hover:text-indigo-900 focus:outline-none'
                    onClick={handleNextClick}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;