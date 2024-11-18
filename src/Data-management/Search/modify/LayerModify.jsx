import React, { useEffect, useCallback, useState } from 'react';
import { sidebarIcon } from '../../../constant';

const LayerModify = ({ drawnPolygons, isModify, onPolygonSelect, finishModify, openModalModify, activePolygonFeature }) => {
    const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null); // Track selected polygon
    // console.log("selectedPolygonIndex: ", selectedPolygonIndex)
    // console.log("activePolygonFeature: ", activePolygonFeature)
    const geometryIconMap = {
        Point: sidebarIcon.GE_Point_128,
        LineString: sidebarIcon.GE_Line_128,
        Polygon: sidebarIcon.GE_Poly_128,
        Rectangle: sidebarIcon.GE_Boxpoly_128,
    };

    const handlePolygonSelect = (index) => {
        setSelectedPolygonIndex(index); // Update selected index
        if (isModify) {
            onPolygonSelect(drawnPolygons[index].featureId, index); // Call the parent's onPolygonSelect
        }
    };

    // Automatically select the only polygon if there is exactly one
    useEffect(() => {
        if (drawnPolygons.length === 1) {
            handlePolygonSelect(0); // Automatically select the single feature
        }
    }, [drawnPolygons, isModify]);

    // Set activePolygonFeature as selected when passed as a prop
    useEffect(() => {
        const activeIndex = drawnPolygons.findIndex(polygon => polygon.featureId === activePolygonFeature);
        if (activeIndex !== -1) {
            setSelectedPolygonIndex(activeIndex); // Update selected polygon based on activePolygonFeature
        }
    }, [activePolygonFeature, drawnPolygons]);

    // Update featureId and index when the component is opened
    useEffect(() => {
        if (selectedPolygonIndex !== null && isModify) {
            onPolygonSelect(drawnPolygons[selectedPolygonIndex].featureId, selectedPolygonIndex);
        }
    }, [selectedPolygonIndex, isModify, drawnPolygons]);

    return (
        <div className="absolute w-[19.6rem] rounded-sm shadow-sm -ml-4 px-1.5 bg-blue-50 mt-1">
            <div className="flex items-center justify-between space-x-2">
                <label className="font-medium text-[13px] text-gray-700">Move vertices to Modify</label>
                <div className="flex items-center justify-between">
                    <select
                        className="px-2 bg-gray-50 border border-gray-300 text-gray-500 rounded-sm focus:outline-none"
                        value={selectedPolygonIndex || ''} // Set value to selected index
                        onChange={(e) => handlePolygonSelect(e.target.value)} // Handle selection change
                    >
                        {drawnPolygons.map((polygon, index) => {
                            const geometryType = polygon.featureId.split(' ')[0]; // Extract geometry type
                            const icon = geometryIconMap[geometryType] || '🔹'; // Default icon if type not found
                            return (
                                <option key={index} value={index}>
                                    {/* <img src={icon} alt={icon} className="w-4 h-4 mr-1.5" /> */}
                                    {polygon.featureId}
                                </option>
                            );
                        })}
                    </select>

                    <button className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a6 6 0 100 12 6 6 0 000-12zM2 8a8 8 0 1115.9 4.9l4.2 4.2a1 1 0 01-1.4 1.4l-4.2-4.2A8 8 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <hr className="p-0 m-0" />

            <div className="flex justify-center gap-4 md:gap-5 my-1.5">
                <button
                    className="text-black text-sm font-normal px-2 border border-gray-300"
                    onClick={openModalModify} // Placeholder for cancel action
                >
                    Cancel
                </button>
                <button
                    className="bg-blue-500 text-sm hover:text-Info_info hover:bg-blue-600 text-white font-normal px-3"
                    onClick={finishModify} // Placeholder for accept action
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default LayerModify;
