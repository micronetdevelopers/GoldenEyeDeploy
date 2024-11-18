import React, { useState } from 'react';
import { sidebarIcon } from '../../../constant';

const  ProductAllocation = ({ initialData, setProductmenu }) => {
    const [data, setData] = useState(initialData);
    const [expandAll, setExpandAll] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [activeCategory, setActiveCategory] = useState([]);
    const [selectedItemvalue, setselectedItemvalue] = useState([]);


    // Handle item checkbox toggle
    const handleItemToggle = (headerIndex, itemIndex) => {
        const newData = [...data];
        const item = newData[headerIndex].items[itemIndex];

        // Toggle the selected state
        item.selected = item.selected ? 0 : 1;

        // Update selected count for the category
        newData[headerIndex].selected = newData[headerIndex].items.filter(i => i.selected === 1).length;

        // Update the selectedItemvalue state
        if (item.selected === 1) {
            setselectedItemvalue(prev => [...prev, item.name]); // Add selected item
        } else {
            setselectedItemvalue(prev => prev.filter(name => name !== item.name));
        }

        setData(newData);
    };

    // Handle category checkbox toggle
    const handleCategoryToggle = (headerIndex) => {
        const newData = [...data];
        const isSelected = newData[headerIndex].selected === newData[headerIndex].total;

        // Toggle all items within the category
        newData[headerIndex].items.forEach(item => item.selected = isSelected ? 0 : 1);
        newData[headerIndex].selected = isSelected ? 0 : newData[headerIndex].total;

        // Update selectedItemvalue based on the new selection
        const selectedItems = newData[headerIndex].items
            .filter(item => item.selected === 1)
            .map(item => item.name);

        setselectedItemvalue(prev => {
            const updatedSelection = isSelected ?
                prev.filter(name => !selectedItems.includes(name)) :
                [...new Set([...prev, ...selectedItems])]; // Combine and ensure unique values
            return updatedSelection;
        });

        setData(newData);
    };

    // Handle Select All functionality
    const handleSelectAll = () => {
        const newData = data.map(category => {
            const allSelected = selectAll;
            category.items = category.items.map(item => ({ ...item, selected: allSelected ? 0 : 1 }));
            category.selected = allSelected ? 0 : category.total;
            return category;
        });

        setSelectAll(!selectAll);
        setData(newData);
        setselectedItemvalue(selectAll ? [] : data.flatMap(category => category.items.map(item => item.name))); // Update selected items
    };

    // Handle Expand All functionality
    const handleExpandAll = () => {
        setExpandAll(!expandAll);
    };

    // Handle showing a particular category without collapsing others
    const handleCategory = (headerIndex) => {
        if (expandAll) {
            setExpandAll(false);
        }

        setActiveCategory(prevActiveCategories => {
            if (prevActiveCategories.includes(headerIndex)) {
                return prevActiveCategories.filter(index => index !== headerIndex);
            } else {
                return [...prevActiveCategories, headerIndex];
            }
        });
    };

    return (
        <>
            <div className="md:w-[1050px] absolute top-[200px]">
                <div className='flex bg-blue-800 justify-between items-center px-2 py-1'>
                    <h1 className="text-lg font-normal text-white leading-tight mb-0">Products</h1>
                    <img onClick={() => setProductmenu(false)} src={sidebarIcon.GE_Cancel_128} alt="Close" className="w-3 h-3 mr-2" />
                </div>

                <div className='bg-gray-50'>
                    <div className='mb-3 flex justify-end items-center space-x-4 border-b p-1 px-3'>
                        <div>
                            <input type="checkbox" className="mr-2" onChange={handleExpandAll} checked={expandAll} />
                            <label className="text-sm font-normal text-gray-700">Expand All</label>
                        </div>
                        <div>
                            <input type="checkbox" className="mr-2" onChange={handleSelectAll} checked={selectAll} />
                            <label className="text-sm font-normal text-gray-700">Select All</label>
                        </div>
                    </div>

                    <div className='productAllocation_Item_container w-full'>
                        {/* <p>chhaya</p> */}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            {data?.map((item, headerIndex) => (<>
                                  
                                <div key={headerIndex} className="border self-start rounded w-full ">
                                 
                                    <div className="flex items-center justify-between border-b w-full px-2">

                                        <div>
                                        <label className="text-base font-medium">{item.header}</label>
                                           <input
                                                type="checkbox"
                                                className="ml-2"
                                                checked={item.selected === item.total}
                                                onChange={() => handleCategoryToggle(headerIndex)}
                                            />
                                            
                                        </div>
                                        <div className="flex items-center space-x-5">
                                            <div className="bg-blue-500 text-white px-2 py-1">
                                                {`${item.selected}/${item.total}`}
                                            </div>

                                            <img
                                                onClick={() => handleCategory(headerIndex)} src={sidebarIcon.GE_Dropdown_128} alt="Close"
                                                className={`${activeCategory.includes(headerIndex) ? "-rotate-90" : "rotate-90"} transition-transform duration-300  w-3 h-3 mr-2`} />


                                            {/* <svg
                                                onClick={() => handleCategory(headerIndex)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-blue-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L10 13.414l-3.293-3.293a1 1 0 01-1.414-1.414L5.293 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg> */}

                                        </div>
                                    </div>

                                    <div className="transition-all duration-300 ease-in-out"
                                        style={{ maxHeight: expandAll || activeCategory.includes(headerIndex) ? '500px' : '0', overflow: 'hidden' }}
                                    >
                                        <div className="pb-4 pt-1">
                                            {item?.items.map((list, itemIndex) => (
                                                <div key={itemIndex} className="my-1 pr-2">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="hover:bg-Info_info w-full rounded-sm hover:text-white pl-2">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2"
                                                                checked={list.selected === 1}
                                                                onChange={() => handleItemToggle(headerIndex, itemIndex)}
                                                            />
                                                            <label className="text-xs leading-tight">{list.name}</label>
                                                        </div>
                                                        <div>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 text-blue-500"
                                                                viewBox="0 0 20 20"
                                                                fill="#1697de"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M18 10A8 8 0 110 10a8 8 0 0118 0zm-9-4a1 1 0 100-2 1 1 0 000 2zm1 8a1 1 0 10-2 0v1a1 1 0 102 0v-1zm-1-3a1 1 0 000 2h.01a1 1 0 100-2H9z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                </> ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 my-3 pb-3">
                        <button
                            onClick={() => setProductmenu(false)}
                            className="text-gray-800 hover:text-Info_info font-normal px-3 border border-gray-800 hover:border-Info_info rounded-sm hover:outline hover:outline-1 hover:outline-Info_info">
                            Cancel
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded-sm">
                            Allocation
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductAllocation;