
import React, { useState, useRef, useEffect } from 'react';
import JSZip from "jszip";
import * as shapefile from "shapefile";
import { kml } from '@mapbox/togeojson'; // Import kml function from toGeoJSON
import * as turf from "@turf/turf"



const ImportData = ({ onhandleImportDataGetFormChild, onhandleAcceptImportData, onhandleImportData }) => {
    const [activeFormat, setActiveFormat] = useState('SHP');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [importDataGeometry, setImportDataGeometry] = useState([]);
    const [isUploaded, setIsUploaded] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // console.log("importDataGeometry ", importDataGeometry)
    // console.log("uploadedFiles ", uploadedFiles)



    const fileInputRef = useRef(null);

    const handleFormatChange = (format) => {
        setActiveFormat(format);
        // setSelectedFile(null);
        setUploadedFiles([]);
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };


    // function extractGeometryRecursively(data) {
    //     const extractedData = [];

    //     function findGeometry(obj) {
    //         if (obj && typeof obj === 'object') {
    //             // If the object contains a geometry with type and coordinates
    //             if (obj.geometry && obj.geometry.type && obj.geometry.coordinates) {
    //                 extractedData.push(
    //                     {
    //                         "type": "FeatureCollection",
    //                         "features": [
    //                             {
    //                                 "type": "Feature",
    //                                 geometry: {
    //                                     type: obj.geometry.type,
    //                                     coordinates: obj.geometry.coordinates
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 );
    //             }
    //             // If the object contains type and coordinates directly (e.g., in a GeometryCollection)
    //             else if (obj.type && obj.coordinates) {
    //                 extractedData.push(
    //                     {
    //                         "type": "FeatureCollection",
    //                         "features": [
    //                             {
    //                                 "type": "Feature",
    //                                 geometry: {
    //                                     type: obj.type,
    //                                     coordinates: obj.coordinates
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 );
    //             }
    //             // Recursively check nested objects and arrays
    //             Object.keys(obj).forEach(key => {
    //                 const value = obj[key];
    //                 if (typeof value === 'object') {
    //                     findGeometry(value);
    //                 }
    //             });
    //         }
    //     }

    //     findGeometry(data);
    //     return extractedData;
    // }

    function extractGeometryRecursively(data) {
        const extractedData = [];

        function findGeometry(obj) {
            if (obj && typeof obj === 'object') {
                // If the object contains a geometry with type and coordinates
                if (obj.geometry && obj.geometry.type && obj.geometry.coordinates) {
                    const newFeature = {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                geometry: {
                                    type: obj.geometry.type,
                                    coordinates: obj.geometry.coordinates
                                }
                            }
                        ]
                    };

                    // Check for duplicates before adding
                    if (!extractedData.some(feature =>
                        JSON.stringify(feature.features[0].geometry) === JSON.stringify(newFeature.features[0].geometry)
                    )) {
                        extractedData.push(newFeature);
                    }
                }
                // If the object contains type and coordinates directly (e.g., in a GeometryCollection)
                else if (obj.type && obj.coordinates) {
                    const newFeature = {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                geometry: {
                                    type: obj.type,
                                    coordinates: obj.coordinates
                                }
                            }
                        ]
                    };

                    // Check for duplicates before adding
                    if (!extractedData.some(feature =>
                        JSON.stringify(feature.features[0].geometry) === JSON.stringify(newFeature.features[0].geometry)
                    )) {
                        extractedData.push(newFeature);
                    }
                }
                // Recursively check nested objects and arrays
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (typeof value === 'object') {
                        findGeometry(value);
                    }
                });
            }
        }

        findGeometry(data);
        return extractedData;
    }


    const handleFileUpload = async (event) => {
        try {
            const chosenFiles = Array.from(event.target.files);

            if (chosenFiles.length === 0) {
                alert("No files selected.");
                return;
            }

            for (const file of chosenFiles) {
                if (uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
                    alert("You have already uploaded this file.");
                    setIsModalOpen(false);
                    continue;
                }

                let importDataGeometryLet;
                setSelectedFiles(file.name);

                // Modularize file handling logic
                if (file.name.toLowerCase().endsWith(".shp")) {
                    importDataGeometryLet = await handleShapefile(file);
                } else if (file.name.toLowerCase().endsWith(".kml")) {
                    importDataGeometryLet = await handleKmlFile(file);
                } else if (
                    file.name.toLowerCase().endsWith(".geojson") ||
                    file.name.toLowerCase().endsWith(".json")
                ) {
                    importDataGeometryLet = await handleGeoJsonFile(file);
                } else if (file.name.toLowerCase().endsWith(".kmz")) {
                    importDataGeometryLet = await handleKmzFile(file);
                } else {
                    alert("Unsupported file format");
                    continue;
                }

                setIsUploaded(11);
                console.log("importDataGeometryLet ", importDataGeometryLet)
                // const feature = turf.feature(importDataGeometryLet);
                const feature = extractGeometryRecursively(importDataGeometryLet)
                console.log("feature ", feature)


                // Add file and geometry to state as an array of objects
                setUploadedFiles((prevFiles) => [...prevFiles, file]);

                feature.forEach((data, dataIndex) => {
                    setImportDataGeometry((prevGeometries) => [
                        ...prevGeometries,
                        { name: file.name, geometry: data }
                    ]);
                })
            }
        } catch (error) {
            alert("An error occurred while uploading files.");
            console.error(error);
        }
    };

    const handleShapefile = async (file) => {
        return await readShapefile(file); // Assuming readShapefile is defined elsewhere
    };

    const handleKmlFile = async (file) => {
        const kmlData = await file.text();
        return kml(new DOMParser().parseFromString(kmlData, "text/xml")); // Use kml function from toGeoJSON
    };

    const handleGeoJsonFile = async (file) => {
        return JSON.parse(await file.text());
    };

    const handleKmzFile = async (file) => {
        const zip = new JSZip();
        const kmzData = await zip.loadAsync(file);
        const kmlFile = kmzData.file(/\.kml$/i)[0];
        if (kmlFile) {
            const kmlData = await kmlFile.async("text");
            return kml(new DOMParser().parseFromString(kmlData, "text/xml")); // Use kml function from toGeoJSON
        } else {
            alert("KMZ file does not contain a .kml file");
            return null;
        }
    };


    const readShapefile = async (arrayBuffer) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                const data = await shapefile.open(reader.result);
                const features = [];
                while (true) {
                    const result = await data.read();
                    if (result.done) break;
                    features.push(result.value);
                }
                resolve({ type: "FeatureCollection", features });
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(new Blob([arrayBuffer]));
        });
    };

    useEffect(() => {
        if (importDataGeometry) {
            onhandleImportDataGetFormChild(importDataGeometry)
        }
    }, [importDataGeometry]);

    return (
        <div class="absolute w-96 px-3 py-2 mt-2 bg-blue-50 shadow-lg rounded-sm space-y-4">
            {/* File Format Tabs */}
            <div class="flex">
                <button
                    onClick={() => handleFormatChange('SHP')}
                    class={`px-3 py-1 text-sm font-mono ${activeFormat === 'SHP' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    SHP
                </button>
                <button
                    onClick={() => handleFormatChange('KML')}
                    class={`px-3 py-1 text-sm font-mono ${activeFormat === 'KML' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    KML/KMZ
                </button>
                <button
                    onClick={() => handleFormatChange('GeoJSON')}
                    class={`px-3 py-1 text-sm font-mono ${activeFormat === 'GeoJSON' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    JSON/GeoJSON
                </button>
            </div>
            {activeFormat === 'SHP' && <p className="text-sm italic text-gray-700 mt-1">Shapefile with Projection WGS84 EPSG:4326 is only allow.</p>}

            <div className="flex gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept={activeFormat === 'SHP' ? '.shp' : activeFormat === 'KML' ? '.kml, .kmz' : activeFormat === 'GeoJSON' ? '.json, .geojson' : '.xml'}
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <input
                    type="text"
                    placeholder="Select File from folder"
                    value={
                        uploadedFiles && uploadedFiles.length > 0
                            ? uploadedFiles.map(file => file.name).join(', ')
                            : ''
                    }
                    readOnly
                    className="w-full px-2 py-1 italic text-sm bg-white border border-gray-300 focus:outline-none"
                />

                <button
                    className="px-1 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                    onClick={handleFileButtonClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a2 2 0 00-2-2H3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H10zM2 4a2 2 0 012-2h3a2 2 0 012 2h8a2 2 0 012 2v12H2V4z" />
                    </svg>
                </button>
            </div>

            {/* Display the selected file names below the input */}
            {uploadedFiles && uploadedFiles.length > 0 && (
                <p className="text-sm italic text-gray-700 mt-1">
                    Selected file{uploadedFiles.length > 1 ? 's' : ''}: {uploadedFiles.map(file => file.name).join(', ')}
                </p>
            )}


            <div class="flex justify-center gap-4 md:gap-5 my-1.5">
                <button class="text-black bg-white text-sm font-normal px-2 border border-gray-300" onClick={onhandleImportData}>Cancel</button>
                <button class="bg-blue-500 text-sm hover:text-Info_info hover:bg-blue-600 text-white font-normal py-1 px-3" onClick={onhandleAcceptImportData}>Accept</button>
            </div>
        </div>
    );
};

export default ImportData;
