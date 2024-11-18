import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const SearchInfo = ({ infoitem, setinfoshow }) => {
    const [quicklookUrl, setQuicklookUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch the Quicklook image if the href is available
    useEffect(() => {
        const fetchQuicklook = async () => {
            if (infoitem.element?._links?.quicklook?.href && infoitem.airbusToken) {
                setLoading(true);
                try {
                    const response = await axios.get(infoitem.element._links.quicklook.href, {
                        headers: {
                            Authorization: `Bearer ${infoitem.airbusToken}`,
                        },
                        responseType: 'blob',
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    setQuicklookUrl(imageUrl);
                } catch (error) {
                    console.error("Failed to fetch Quicklook image:", error);
                    setQuicklookUrl(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchQuicklook();

        // Clean up the object URL when the component is unmounted
        return () => {
            if (quicklookUrl) {
                URL.revokeObjectURL(quicklookUrl);
            }
        };
    }, [infoitem]);




    return (
        <div className="bg-white px-4 py-2 max-w-4xl shadow-sm rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-600  m-0  cursor-pointer">Information</h2>
                <span className='text-sm cursor-pointer font-bold' onClick={() => setinfoshow(true)}><FontAwesomeIcon icon={faXmark} /></span>
            </div>
            <div className="grid grid-cols-2 break-words gap-4">
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Acquisition Date:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.acquisitionDate || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Azimuth Angle:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.azimuthAngle || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Cloud Cover:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.cloudCover || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Constellation:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.constellation || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Customer Reference:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.customerReference || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Expiration Date:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.expirationDate || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Geometry Centroid:</p>
                    <p className="text-gray-600 text-sm m-0">
                        Lat: {infoitem.element.properties?.geometryCentroid?.lat || 'N/A'}, <br /> Lon: {infoitem.element.properties?.geometryCentroid?.lon || 'N/A'}
                    </p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0 break-words">Illumination Azimuth Angle:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.illuminationAzimuthAngle || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Illumination Elevation Angle:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.illuminationElevationAngle || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Incidence Angle:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.incidenceAngle || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Processing Date:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.processingDate || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Product Type:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.productType || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Processor:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.processor || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Platform:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.platform || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Satellite:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.satellite || 'N/A'}</p>
                </div>
                <div className='hover:bg-gray-200'>
                    <p className="font-semibold text-gray-600 m-0">Resolution:</p>
                    <p className="text-gray-600 text-sm m-0">{infoitem.element.properties?.resolution || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                    <p className="font-semibold text-gray-600 m-0">Quicklook Image:</p>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-1xl" />
                            <span className="ml-2 text-gray-600">Loading...</span>
                        </div>
                    ) : quicklookUrl ? (
                        <img
                            src={quicklookUrl}
                            alt="Quicklook"
                            className="w-full h-auto shadow-md"
                        />
                    ) : (
                        <p className="text-gray-600 text-sm m-0">No Quicklook available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchInfo;
