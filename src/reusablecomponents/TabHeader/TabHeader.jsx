import React from 'react'

const TabHeader = ({ headingTitle, imgSrc, imgCancle, toggleOffCanvas }) => {
    return (
        <div className="flex bg-[#167dde] justify-between items-center px-2 py-2">
            <div className="flex items-center">
                {/* <img src={imgCancle} className="w-4 h-4" alt="" /> */}
                <h1 className="text-lg font-semibold text-white leading-tight mb-0 cursor-pointer px-2">
                    {headingTitle}
                </h1>
            </div>

            <span
                className="text-white cursor-pointer hover:text-black"
                onClick={() => toggleOffCanvas(null)}
            >
                <img className="w-4 h-4" src={imgCancle} alt="" />
            </span>
        </div>
    )
}

export default TabHeader