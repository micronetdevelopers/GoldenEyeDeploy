import React, { useState, useEffect } from 'react';
import { sidebarIcon } from '../../../constant';

const Productmenu = ({ initialData, setProductmenu, onSave }) => {
    const [data, setData] = useState([]);
    const [expandAll, setExpandAll] = useState(true);
    const [selectAll, setSelectAll] = useState(true);
    const [allowMultipleSelection, setAllowMultipleSelection] = useState(false);
    const [activeCategory, setActiveCategory] = useState([]);
    const [selectedItemvalue, setSelectedItemValue] = useState([]);

    useEffect(() => {
        const updatedData = initialData.map(category => {
            const items = category.items.map(item => {
                const isStereoOrTriStereo = item.name.includes("STEREO") || item.name.includes("TRISTEREO") || item.name.includes("SAR");
                const isSelected = isStereoOrTriStereo ? 0 : 1; // Default selection
                return {
                    ...item,
                    selected: isSelected
                };
            });

            const selectedCount = items.reduce((count, item) => count + item.selected, 0);

            return {
                ...category,
                items,
                selected: selectedCount,
                total: items.length
            };
        });

        // Initialize selectedItemvalue with default mappings
        const defaultSelectedValues = updatedData.flatMap(category =>
            category.items.filter(item => item.selected === 1).map(item => {
                if (item.name.trim() === 'SPOT-1.5m-MONO') return 'SPOT';
                if (item.name.trim() === 'Pleiades-Neo-0.3m-MONO') return 'PNEO';
                if (item.name.trim() === 'Pleiades-0.5m-MONO') return 'PHR';
                console.log("1", item.name)
                return item.name;
            })
        );

        setData(updatedData);
        setSelectedItemValue(defaultSelectedValues);
    }, [initialData]);

    const handleItemToggle = (headerIndex, itemIndex) => {
        const newData = [...data];
        const item = newData[headerIndex].items[itemIndex];
        const isStereoOrTriStereo = item.name.includes("STEREO") || item.name.includes("TRISTEREO") || item.name.includes("SAR");

        if (isStereoOrTriStereo) return; // Skip toggle for STEREO/TRISTEREO

        if (allowMultipleSelection) {
            item.selected = item.selected ? 0 : 1;
        } else {
            newData.forEach(category => {
                category.items.forEach(i => (i.selected = 0));
            });
            item.selected = 1; // Select only the clicked item
        }

        newData[headerIndex].selected = newData[headerIndex].items.filter(i => i.selected === 1).length;

        // Update selected items
        if (allowMultipleSelection) {
            if (item.selected === 1) {
                setSelectedItemValue(prev => [...prev, item.name]);
            } else {
                setSelectedItemValue(prev => prev.filter(name => name !== item.name));
            }
        } else {
            setSelectedItemValue([item.name]);
        }

        setData(newData);
    };

    const handleSelectAll = () => {
        const allSelected = !selectAll;
        const newData = data.map(category => {
            category.items = category.items.map(item => {
                const isStereoOrTriStereo = item.name.includes("STEREO") || item.name.includes("TRISTEREO") || item.name.includes("SAR");
                return {
                    ...item,
                    selected: isStereoOrTriStereo ? 0 : (allSelected ? 1 : 0)
                };
            });

            category.selected = category.items.reduce((acc, item) => acc + item.selected, 0);
            return category;
        });

        setSelectAll(allSelected);
        setSelectedItemValue(
            allSelected
                ? newData.flatMap(category =>
                    category.items.filter(item => item.selected === 1).map(item => {
                        if (item.name.trim() === 'SPOT-1.5m-MONO') return 'SPOT';
                        if (item.name.trim() === 'Pleiades-Neo-0.3m-MONO') return 'PNEO';
                        if (item.name.trim() === 'Pleiades-0.5m-MONO') return 'PHR';
                        console.log("2", item.name)

                        return item.name;
                    })
                )
                : []
        );

        setData(newData);
    };

    const handleSaveClick = () => {
        const mappedSelectedValues = selectedItemvalue.map(name => {
            if (name === 'SPOT-1.5m-MONO') return 'SPOT';
            if (name === 'Pleiades-Neo-0.3m-MONO') return 'PNEO';
            if (name === 'Pleiades-0.5m-MONO') return 'PHR';
            return name;
        });
        // console.log("mappedSelectedValues ", mappedSelectedValues)
        onSave(mappedSelectedValues);
        setProductmenu(false);
    };

    const handleCategory = headerIndex => {
        setActiveCategory(prevActiveCategories =>
            prevActiveCategories.includes(headerIndex)
                ? prevActiveCategories.filter(index => index !== headerIndex)
                : [...prevActiveCategories, headerIndex]
        );
    };

    const handleExpandAll = () => {
        setExpandAll(!expandAll);
    };

    const handleCategoryToggle = headerIndex => {
        const newData = [...data];
        const isSelected = newData[headerIndex].selected === newData[headerIndex].total;

        newData[headerIndex].items.forEach(item => {
            const isStereoOrTriStereo = item.name.includes("STEREO") || item.name.includes("TRISTEREO") || item.name.includes("SAR");
            item.selected = isStereoOrTriStereo ? 0 : (isSelected ? 0 : 1);
        });

        newData[headerIndex].selected = newData[headerIndex].items.reduce((acc, item) => acc + item.selected, 0);

        const selectedItems = newData[headerIndex].items
            .filter(item => item.selected === 1)
            .map(item => {
                if (item.name.trim() === 'SPOT-1.5m-MONO') return 'SPOT';
                if (item.name.trim() === 'Pleiades-Neo-0.3m-MONO') return 'PNEO';
                if (item.name.trim() === 'Pleiades-0.5m-MONO') return 'PHR';
                console.log("3", item.name)

                return item.name;
            });

        setSelectedItemValue(prev => {
            const updatedSelection = isSelected
                ? prev.filter(name => !selectedItems.includes(name))
                : [...new Set([...prev, ...selectedItems])];
            return updatedSelection;
        });

        setData(newData);
    };

    return (

        <div className="md:w-[750px] absolute top-[46px]">
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
                    <div>
                        <label className="mr-2 text-sm font-normal text-gray-700">Multiple Selection</label>
                        <input type="checkbox" checked={allowMultipleSelection} onChange={() => setAllowMultipleSelection(!allowMultipleSelection)} />
                    </div>
                </div>

                <div className='product_Item_container w-full'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.map((category, headerIndex) => (
                            <div key={headerIndex} className="border self-start rounded w-full ">
                                <div className="flex items-center justify-between border-b w-full px-2">
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={category.selected === category.total}
                                            onChange={() => handleCategoryToggle(headerIndex)}
                                        />
                                        <label className="text-base font-medium">{category.header}</label>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="bg-blue-500 text-white px-2 py-1">
                                            {`${category.selected}/${category.total}`}
                                        </div>

                                        <img
                                            onClick={() => handleCategory(headerIndex)} src={sidebarIcon.GE_Dropdown_128} alt="Close"
                                            className={`${activeCategory.includes(headerIndex) ? "-rotate-90" : "rotate-90"} transition-transform duration-300  w-3 h-3 mr-2`} />
                                    </div>
                                </div>

                                <div className="transition-all duration-300 ease-in-out"
                                    style={{ maxHeight: expandAll || activeCategory.includes(headerIndex) ? '500px' : '0', overflow: 'hidden' }}>
                                    <div className="pb-4 pt-1">
                                        {category.items.map((item, itemIndex) => {
                                            const isStereoOrTriStereo = item.name.includes("STEREO") || item.name.includes("TRISTEREO") || item.name.includes("SAR");

                                            return (
                                                <div key={itemIndex} className="my-1 pr-2">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className={`hover:bg-Info_info w-full rounded-sm pl-2 ${isStereoOrTriStereo ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'}`}>
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2"
                                                                checked={isStereoOrTriStereo ? false : item.selected === 1}
                                                                onChange={() => handleItemToggle(headerIndex, itemIndex)}
                                                                disabled={isStereoOrTriStereo}
                                                            />
                                                            <label className={`text-xs leading-tight ${isStereoOrTriStereo ? 'text-gray-400' : ''}`}>
                                                                {item.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-3 my-3 pb-3">
                    <button
                        onClick={() => setProductmenu(false)}
                        className="text-gray-800 hover:text-Info_info font-normal px-3 border border-gray-800 hover:border-Info_info rounded-sm hover:outline hover:outline-1 hover:outline-Info_info">
                        Cancel
                    </button>
                    <button className="bg-blue-800 hover:bg-blue-600 text-white font-normal px-4 rounded-sm" onClick={handleSaveClick}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default Productmenu;

