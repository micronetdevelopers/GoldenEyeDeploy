import React, { useState, useRef, useEffect } from 'react';
import { sidebarIcon } from '../../../constant';
import { Slider, Tooltip } from 'antd';
import { DatePicker } from 'antd'; // Import DatePicker from Ant Design
import '../../RootContainer.css'
// import moment from 'moment'; // Import moment for date manipulation
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import Timezone plugin
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Item from 'antd/es/list/Item';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


const Criteriamenu = ({ setCriteriamenu, criteriamenu, onSubmit }) => {
    // Define default values
    const defaultIncidentAngle = [0, 60]; // Default Incident Angle range
    const defaultCloudCover = [0, 100]; // Default Cloud Cover range
    const startinitial = dayjs().subtract(1, 'month').startOf('month').tz('Asia/Kolkata'); // Set to IST
    const endinitial = dayjs().tz('Asia/Kolkata'); // Set to IST

    const [incidentAngle, setIncidentAngle] = useState([0, 60]); // Incident Angle range [0, 60]
    const [cloudCover, setCloudCover] = useState([0, 100]); // Cloud Cover range [0, 100]
    const startPickerRef = useRef(null);
    const endPickerRef = useRef(null);
    const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
    const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);


    const [startDate, setStartDate] = useState(startinitial);
    const [endDate, setEndDate] = useState(endinitial);
    const [pickerState, setPickerState] = useState('single'); // Store the dropdown value

    // Reset to default values
    const resetToDefaults = () => {
        setIncidentAngle(defaultIncidentAngle);
        setCloudCover(defaultCloudCover);
        setStartDate(startinitial);
        setEndDate(endinitial);
        setPickerState('single')
    };


    // Handle dropdown change
    const handlePickerStateChange = (event) => {
        setPickerState(event.target.value);
    };
    // Handle Incident Angle min and max change
    const handleIncidentMinChange = (e) => {
        const newValue = Math.max(0, Math.min(e.target.value, incidentAngle[1]));
        setIncidentAngle([newValue, incidentAngle[1]]);
    };

    const handleIncidentMaxChange = (e) => {
        const newValue = Math.min(60, Math.max(e.target.value, incidentAngle[0]));
        setIncidentAngle([incidentAngle[0], newValue]);
    };

    // Handle Cloud Cover min and max change
    const handleCloudMinChange = (e) => {
        const newValue = Math.max(0, Math.min(e.target.value, cloudCover[1]));
        setCloudCover([newValue, cloudCover[1]]);
    };

    const handleCloudMaxChange = (e) => {
        const newValue = Math.min(100, Math.max(e.target.value, cloudCover[0]));
        setCloudCover([cloudCover[0], newValue]);
    };

    // Slider change for Incident Angle
    const handleIncidentSliderChange = (value) => {
        setIncidentAngle(value);
    };

    // Slider change for Cloud Cover
    const handleCloudSliderChange = (value) => {
        setCloudCover(value);
    };

    // Render tooltips for sliders (to display units on hover)
    const renderIncidentTooltip = (value) => `${value}°`;
    const renderCloudTooltip = (value) => `${value}%`;



    // Handle start date change
    const handleStartDateChange = (date) => {
        if (date) {
            setStartDate(date);
            // If the start date is later than the current end date, update the end date
            if (date.isSameOrAfter(endDate)) {
                setEndDate(date);
            }
        }
        setIsStartPickerOpen(false); // Close the date picker after date is selected

    };

    // Handle end date change
    const handleEndDateChange = (date) => {
        if (date) {
            setEndDate(date);
        }
        setIsEndPickerOpen(false); // Close the date picker after date is selected

    };

    // Disable dates for the end date picker to ensure it's after the start date
    const disableEndDate = (current) => {
        return current && current.isSameOrBefore(startDate, 'day');
    };

    // Disable dates for the start date picker to ensure it's not after the end date
    const disableStartDate = (current) => {
        return current && current.isSameOrAfter(endDate, 'day');
    };

    // Handle OK button click
    const handleOk = () => {
        let dateRange = [];
        const formattedStartDate = startDate.toISOString(); // Format start date
        const formattedEndDate = endDate.toISOString(); // Format end date
        if (pickerState === 'disable') {
            dateRange = ""
        } else {
            dateRange = [formattedStartDate, formattedEndDate];
        }
        const incidentAngleRange = incidentAngle;
        const cloudCoverRange = cloudCover;

        // Call the onSubmit function (provided from the parent) with the values
        if (onSubmit) {
            onSubmit({ "Date": dateRange, "incidentAngle": incidentAngleRange, "cloudCover": cloudCoverRange });
        }

        // Optional: Close the menu after submitting
        setCriteriamenu(false);
    };



    return (
        <>
            <div class="md:w-[850px] border-[1px] bg-white  border-gray-400 absolute top-[46px]  xl:left-[7.5rem]">
                <div className='flex bg-blue-800 justify-between items-center px-2'>
                    <h1 class="text-lg  font-medium text-white leading-tight pt-1">Criteria</h1>
                    <img onClick={() => setCriteriamenu(!criteriamenu)} src={sidebarIcon.GE_Cancel_128} alt={sidebarIcon.GE_Cancel_128} className="w-3 h-3 mr-2" />
                </div>
                <div className='mx-2 px-2'>
                    <h2 class="text-base bg-blue-500 font-normal text-white leading-tight py-1 px-2 mt-1">Search Criteria</h2>

                    <div className='w-full py-2.5'>
                        <div className="grid grid-cols-[40%_auto] space-x-4 mb-2 items-center">
                            <div className="flex items-center gap-12 w-full">
                                <label className="text-base font-semibold whitespace-nowrap leading-tight tracking-tight">
                                    Cloud Cover (%)
                                </label>
                                <div className="flex items-center justify-end gap-2 ml-1">
                                    <input
                                        type="number"
                                        value={cloudCover[0]}
                                        onChange={handleCloudMinChange}
                                        className="border-1 border-gray-400 rounded-sm py-1 px-1 text-sm focus:outline-none w-12"
                                        min={0}
                                        max={100}
                                    />
                                    -
                                    <input
                                        type="number"
                                        value={cloudCover[1]}
                                        onChange={handleCloudMaxChange}
                                        className="border-1 border-gray-400 rounded-sm py-1 px-1 text-sm focus:outline-none w-12"
                                        min={0}
                                        max={100}
                                    />
                                    <span className='text-sm'>%</span>
                                </div>
                            </div>
                            <div className='flex justify-end pr-6'>
                                <Slider
                                    range
                                    min={0}
                                    max={100}
                                    value={cloudCover}
                                    onChange={handleCloudSliderChange}
                                    tooltip={{ formatter: renderCloudTooltip }} // Show unit as tooltip on hover
                                    className="slider"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                    </div>


                    <div className='w-full py-2.5'>
                        <div class="grid grid-cols-[40%_auto] space-x-4 mb-2 items-center">
                            <div className="flex items-center gap-12 w-full">
                                <label className="text-base font-semibold whitespace-nowrap leading-tight tracking-tight">
                                    Incident Angle (°)
                                </label>
                                <div className="flex items-center justify-end gap-2 ml-1">
                                    <input
                                        type="number"
                                        value={incidentAngle[0]}
                                        onChange={handleIncidentMinChange}
                                        className="border-1 border-gray-400 rounded-sm py-1 px-1 text-sm focus:outline-none w-12"
                                        min={0}
                                        max={60}
                                    />
                                    -
                                    <input
                                        type="number"
                                        value={incidentAngle[1]}
                                        onChange={handleIncidentMaxChange}
                                        className="border-1 border-gray-400 rounded-sm py-1 px-1 text-sm focus:outline-none w-12"
                                        min={0}
                                        max={60}
                                    />
                                    <span className='text-sm'>°</span>
                                </div>
                            </div>
                            <div className='flex justify-end pr-6'>
                                <Slider
                                    range
                                    min={0}
                                    max={60}
                                    value={incidentAngle}
                                    onChange={handleIncidentSliderChange}
                                    tooltip={{ formatter: renderIncidentTooltip }} // Show unit as tooltip on hover
                                    className="slider"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                    </div>


                    <div className='w-full py-2.5'>
                        <div className="flex items-center space-x-4 w-full mb-3">
                            <label className="text-base font-semibold whitespace-nowrap leading-tight tracking-tight">
                                Acquisition date range
                            </label>
                            <select
                                className="border-1 border-gray-400 rounded-sm py-1 px-2 text-sm focus:outline-none w-32"
                                value={pickerState}
                                onChange={handlePickerStateChange}
                            >
                                <option value="single">Single</option>
                                <option value="disable">Disabled</option>
                            </select>

                            {/* Start Date Picker */}
                            <div className="flex flex-row items-center gap-2">
                                <label htmlFor="startDate" className="text-sm font-normal mb-1">Start Date :</label>
                                <div className="d-flex items-center gap-2">
                                    <DatePicker
                                        onChange={handleStartDateChange} // Handle start date change
                                        value={startDate} // Set the value to the current start date
                                        placeholder="Start Date"
                                        disabledDate={disableStartDate} // Disable dates after the end date
                                        format="DD/MM/YYYY" // Format the date as DD/MM/YYYY
                                        className="border-1 border-gray-400 rounded-sm py-1 px-2 text-sm focus:outline-none w-32"
                                        open={isStartPickerOpen} // Control the open state
                                        onOpenChange={(open) => setIsStartPickerOpen(false)} // Disable opening from the input
                                        allowClear={false} // Prevent clearing the date
                                        inputReadOnly // Make the input field read-only
                                        disabled={pickerState === 'disable'} // Disable if "Disabled" is selected
                                    />
                                    <img
                                        src="https://png.pngtree.com/png-vector/20221013/ourmid/pngtree-calendar-icon-logo-2023-date-time-png-image_6310337.png"
                                        alt="Calendar"
                                        // className="w-7 h-7 cursor-pointer"
                                        // onClick={() => setIsStartPickerOpen(true)} // Trigger DatePicker on image click
                                        className={`w-7 h-7 cursor-pointer ${pickerState === 'disable' ? 'opacity-50 cursor-not-allowed' : ''}`} // Grey out and disable the image if "Disabled"
                                        onClick={() => pickerState === 'single' && setIsStartPickerOpen(true)} // Open only if in 'single' state
                                    />
                                </div>
                            </div>

                            {/* End Date Picker */}
                            <div className="flex flex-row items-center gap-2">
                                <label htmlFor="endDate" className="text-sm font-normal mb-1">End Date :</label>
                                <div className="d-flex items-center gap-2">
                                    <DatePicker
                                        onChange={handleEndDateChange} // Handle end date change
                                        value={endDate} // Set the value to the current end date
                                        placeholder="End Date"
                                        disabledDate={disableEndDate} // Disable dates before the start date
                                        format="DD/MM/YYYY" // Format the date as DD/MM/YYYY
                                        className="border-1 border-gray-400 rounded-sm py-1 px-2 text-sm focus:outline-none w-32"
                                        open={isEndPickerOpen} // Control the open state
                                        onOpenChange={(open) => setIsEndPickerOpen(false)} // Disable opening from the input
                                        allowClear={false} // Prevent clearing the date
                                        inputReadOnly // Make the input field read-only
                                        disabled={pickerState === 'disable'} // Disable if "Disabled" is selected
                                    />
                                    <img
                                        src="https://png.pngtree.com/png-vector/20221013/ourmid/pngtree-calendar-icon-logo-2023-date-time-png-image_6310337.png"
                                        alt="Calendar"
                                        // className="w-7 h-7 cursor-pointer"
                                        // onClick={() => setIsEndPickerOpen(true)} // Trigger DatePicker on image click
                                        className={`w-7 h-7 cursor-pointer ${pickerState === 'disable' ? 'opacity-50 cursor-not-allowed' : ''}`} // Grey out and disable the image if "Disabled"
                                        onClick={() => pickerState === 'single' && setIsEndPickerOpen(true)} // Open only if in 'single' state
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div class="flex justify-center gap-4 md:gap-8 my-3 p">
                    <button
                        onClick={() => setCriteriamenu(!Criteriamenu)}
                        class="text-Info_info hover:text-black font-semibold px-3 border-[1px] border-Info_info rounded-sm">
                        Cancel
                    </button>
                    <button onClick={resetToDefaults} class="text-Info_info hover:text-black font-semibold px-3 border-[1px] border-Info_info rounded-sm">
                        Restore Default
                    </button>
                    <button onClick={handleOk} class="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-sm">OK</button>
                </div>
            </div>
        </>
    );
};

export default Criteriamenu;
