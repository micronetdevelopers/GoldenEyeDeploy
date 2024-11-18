import React, { useState, useEffect } from 'react';

const BufferComponent = ({ toolType, defaultBufferPoint = 2.25, defaultBufferLine = 5, onBufferChange, setIsBufferVisible }) => {
    const [buffer, setBuffer] = useState(defaultBufferPoint); // Initialize buffer based on default value
    const [error, setError] = useState('');

    useEffect(() => {
        // Set default buffer based on toolType when the component mounts
        const initialBuffer = toolType === 'Point' ? defaultBufferPoint : defaultBufferLine;
        setBuffer(initialBuffer);
        onBufferChange(initialBuffer);
        setError('');
    }, [toolType]);

    const handleBufferChange = (e) => {
        const value = parseFloat(e.target.value);
        setBuffer(value);

        // Validation for buffer values
        if (toolType === 'Point' && value < 2.25) {
            setError('Buffer distance for Point cannot be less than 2.25 km.');
            return;
        } else if (toolType === 'Line' && value < 5) {
            setError('Buffer distance for Line cannot be less than 5 km.');
            return;
        } else {
            setError('');
        }
        // onBufferChange(value);
    };

    const modifyBufferValue = () => {
        if (!error) {
            onBufferChange(buffer);
            setIsBufferVisible(false)

        }
    };

    const resetBuffer = () => {
        const defaultBuffer = toolType === 'Point' ? defaultBufferPoint : defaultBufferLine;
        setBuffer(defaultBuffer);
        setError('');
        onBufferChange(defaultBuffer);
    };

    return (
        <div className="absolute top-0 left-48 w-72 border border-gray-300 bg-white py-1 px-3 rounded-sm shadow-md">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">
                        Buffer Distance <span className="font-normal text-gray-500">(all sides)</span>
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={buffer !== null ? buffer : ''}
                            onChange={handleBufferChange}
                            className="border text-center border-gray-300 px-1 w-20"
                        />
                        <span>km</span>
                    </div>
                    {error && <p className="text-red-500 text-xs mb-0">{error}</p>}
                </div>

                <div className="w-[1px] bg-gray-400 h-[90]"></div>

                <div className="flex flex-col gap-2 justify-center px-2">
                    <button
                        onClick={resetBuffer}
                        className="border text-xs text-gray-700 px-2 py-1"
                    >
                        RESET
                    </button>
                    <button
                        onClick={modifyBufferValue}
                        className="bg-blue-500 text-xs text-white px-3 py-1 rounded-sm">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BufferComponent;
