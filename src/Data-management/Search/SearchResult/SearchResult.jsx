import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCartShopping, faCrosshairs, faEye, faSpinner, faXmark, faSquare } from "@fortawesome/free-solid-svg-icons";
import ArchivalSearchIcon from "../../../assets/Icons/sidebar-icons/GE_ArchiveSearch_128.png";
import { useUser } from "../../../Auth/AuthProvider/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Fill, Stroke, Style, } from "ol/style";
import TileLayer from "ol/layer/Tile";
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js';
import Feature from "ol/Feature";
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import { Polygon } from "ol/geom";
import { Modify } from "ol/interaction";
import * as turf from "@turf/turf";
import { Modal, notification } from "antd";
import SearchInfo from './SearchInfo'
import 'ol/ol.css';
import TabHeader from "../../../reusablecomponents/TabHeader/TabHeader";
import { sidebarIcon } from "../../../constant";
import ThumbnailImage from "./ThumbnailImage";


function SearchResult({ isMoreGet, onsetquickLoop, airbusToken, loadingMore, isLoading, isError, error, searchData, totalResult, handleClickMore, searchCriteria, isOpen, toggleOffCanvas, mapRef, vectorLayerRef, searchLayerRef, searchLayerHoverRef, totalFeatures }) {

    // console.log(isOpen, "isOpen ")
    const [allFeaturesId, setAllFeatureId] = useState([]);
    const [areaCovered, setAreaCovered] = useState([]);
    const [quickLook, setQuickLook] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [infoshow, setinfoshow] = useState(true);
    const [infoshowdata, setinfoshowdata] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (title, description, type, pauseOnHover) => {
        api[type]({
            message: title,
            description: description,
            placement: "topRight",
            showProgress: true,
            pauseOnHover,
            placement: "bottom",
        });
    };

    useEffect(() => {
        onsetquickLoop(quickLook);
    }, [quickLook, onsetquickLoop]);


    const handleMouseEnter = (element) => {
        try {
            setIsHovered(true); // Set hover state to true

            // Check if searchCriteria and element have valid geometry
            if (!searchCriteria?.geometry?.coordinates || !element?.geometry?.coordinates) {
                openNotification(
                    "Invalid Data",
                    "Geometry data is missing or invalid. Please check the input data.",
                    "error",
                    true
                );
                return;
            }

            // Calculate the intersection using Turf.js
            const intersection = turf.intersect(
                turf.featureCollection([
                    turf.polygon(searchCriteria.geometry.coordinates),
                    turf.polygon(element.geometry.coordinates),
                ])
            );

            if (!intersection || !intersection.geometry || !intersection.geometry.coordinates.length) {
                openNotification(
                    "No Intersection Found",
                    "The selected element does not intersect with the search area.",
                    "warning",
                    true
                );
                return;
            }

            // Extract intersection coordinates
            const coords = intersection.geometry.coordinates[0];

            // Calculate areas
            const areaOriginalPoly = turf.area(turf.polygon(searchCriteria.geometry.coordinates));
            const areaPolygon = areaOriginalPoly / 1000000; // Area in square kilometers
            const areaIntersection = turf.area(intersection);
            const areaInSquareKilometers = areaIntersection / 1000000;
            const percentageOfArea = Math.round((areaInSquareKilometers / areaPolygon) * 100);

            // Check if percentage calculation is valid
            if (isNaN(percentageOfArea)) {
                openNotification(
                    "Calculation Error",
                    "Failed to calculate the percentage of the intersection area.",
                    "error",
                    true
                );
                return;
            }

            // Create a feature for the intersection polygon
            const feature = new Feature(new Polygon([coords]));
            feature.setId(element.id); // Set the ID of the feature
            feature.setStyle(
                new Style({
                    fill: new Fill({
                        color: "rgba(255, 255, 0, 0.1)",
                    }),
                    stroke: new Stroke({
                        color: "rgba(255, 255, 0, 0.6)", // Yellow color with full opacity
                        width: 2,
                    }),
                })
            );

            // Find the hover layer in the mapRef layers and add the feature
            const layers = mapRef.current?.ol?.getLayers()?.getArray();
            if (!layers) {
                openNotification(
                    "Map Error",
                    "Failed to access map layers. Please ensure the map is loaded correctly.",
                    "error",
                    true
                );
                return;
            }

            const hoverLayer = layers.find((layer) => layer.get("name") === "SearchResultsHoverLayer");
            if (hoverLayer) {
                hoverLayer.getSource().addFeature(feature);
            } else {
                openNotification(
                    "Layer Not Found",
                    "Hover layer 'SearchResultsHoverLayer' not found in the map.",
                    "error",
                    true
                );
            }
        } catch (error) {
            // General error handling
            console.error("Error in handleMouseEnter:", error);
            openNotification(
                "Unexpected Error",
                `An error occurred while processing the hover action: ${error.message}`,
                "error",
                true
            );
        }
    };





    // Handler for mouse leave (clear hover layer)
    const handleMouseLeave = () => {
        try {
            setIsHovered(false); // Reset hover state

            // Check if mapRef and its current instance are valid
            if (!mapRef?.current?.ol) {
                openNotification(
                    "Map Error",
                    "Failed to access the map reference. Please ensure the map is loaded correctly.",
                    "error",
                    true
                );
                return;
            }

            // Retrieve the layers from the map
            const layers = mapRef.current.ol.getLayers().getArray();
            if (!layers || layers.length === 0) {
                openNotification(
                    "Layer Retrieval Error",
                    "No layers found in the map. Please check the map configuration.",
                    "error",
                    true
                );
                return;
            }

            // Find the hover layer by name
            const hoverLayer = layers.find((layer) => layer.get("name") === "SearchResultsHoverLayer");
            if (hoverLayer) {
                hoverLayer.getSource().clear(); // Clear all features on the hover layer
            } else {
                openNotification(
                    "Layer Not Found",
                    "Hover layer 'SearchResultsHoverLayer' not found. Unable to clear features.",
                    "warning",
                    true
                );
            }
        } catch (error) {
            // General error handling
            console.error("Error in handleMouseLeave:", error);
            openNotification(
                "Unexpected Error",
                `An error occurred while clearing hover features: ${error.message}`,
                "error",
                true
            );
        }
    };




    const getAuthHeader = (username, password) => {
        if (typeof window !== 'undefined' && window.btoa) {
            // For browsers
            const credentials = window.btoa(`${username}:${password}`);
            return `Basic ${credentials}`;
        } else {
            // For Node.js (React SSR or other cases)
            const credentials = Buffer.from(`${username}:${password}`).toString('base64');
            return `Basic ${credentials}`;
        }
    };

    // console.log("🐱‍🏍 ", process.env.REACT_APP_APIKEY_VALUE)
    const authHeader = getAuthHeader('APIKEY', process.env.REACT_APP_APIKEY_VALUE);

    // console.log("🚓",airbusToken ?? authHeader)
    const [loadingTiles, setLoadingTiles] = useState(null); // Track the ID of the loading tile

    const onclickWmts = async (id, url) => {
        try {
            setQuickLook((prevState) => [...prevState, id]);

            // Check if the WMTS layer with the given ID already exists
            if (quickLook.includes(id)) {
                // Remove the layer if it already exists
                setQuickLook((prevState) => prevState.filter((element) => element !== id));

                // Loop through the layers and remove the one with the matching ID
                searchLayerRef.current.context.map.getLayers().getArray().forEach((layer) => {
                    if (layer instanceof TileLayer && layer.get("name") === id) {
                        searchLayerRef.current.context.map.removeLayer(layer);
                        console.log("Layer removed: ", id);
                        openNotification(
                            "Layer Removed",
                            `The WMTS layer '${id}' has been successfully removed.`,
                            "info",
                            true
                        );
                    }
                });
                return;
            }

            setLoadingTiles(id); // Set the specific ID as loading

            // Fetch WMTS capabilities from the provided URL
            const response = await fetch(
                // `${process.env.REACT_APP_BASE_URL}/link/?linkUrl=${url}`
                url, {
                headers: {
                    // 'Authorization': authHeader,
                    'Authorization': `Bearer ${airbusToken}` ?? authHeader,
                },
            });

            if (!response.ok) {
                openNotification(
                    "WMTS Fetch Error",
                    `Failed to fetch WMTS capabilities for layer '${id}'. Status: ${response.status}`,
                    "error",
                    true
                );
                setLoadingTiles(null);
                return;
            }

            const text = await response.text();
            const parser = new WMTSCapabilities();
            const result = parser.read(text);

            // Extract options from the capabilities response
            const options = optionsFromCapabilities(result, {
                layer: 'default',
                matrixSet: "EPSG4326",
            });

            // Custom tile load function with error handling
            const customTileLoadFunction = (imageTile, src) => {
                fetch(src, {
                    headers: {
                        // 'Authorization': authHeader,
                        'Authorization': `Bearer ${airbusToken}` ?? authHeader,
                    },
                })
                    .then((tileResponse) => {
                        if (tileResponse.ok) {
                            return tileResponse.blob();
                        } else {
                            openNotification(
                                "Tile Load Error",
                                `Failed to load tile from URL: ${src}. Status: ${tileResponse.status}`,
                                "warning",
                                true
                            );
                            throw new Error(`Tile fetch failed: ${tileResponse.status}`);
                        }
                    })
                    .then((blob) => {
                        const objectURL = URL.createObjectURL(blob);
                        imageTile.getImage().src = objectURL;
                    })
                    .catch((tileError) => {
                        console.error("Error fetching tile:", tileError);
                        imageTile.getImage().src = ''; // Set the tile image to empty on error
                        openNotification(
                            "Tile Fetch Error",
                            `An error occurred while fetching the tile: ${tileError.message}`,
                            "error",
                            true
                        );
                    });
            };

            // Create a new WMTS layer with the custom tile load function
            const layer = new TileLayer({
                properties: { "name": id },
                opacity: 1,
                zIndex: 1,
                source: new WMTS({
                    ...options,
                    tileLoadFunction: customTileLoadFunction,
                }),
            });

            // Event listener to clear loading state once tiles are loaded
            layer.getSource().on('tileloadend', () => {
                setLoadingTiles(null);
                openNotification(
                    "Tiles Loaded",
                    `All tiles for layer '${id}' have been successfully loaded.`,
                    "success",
                    true
                );
            });

            // Add the new WMTS layer to the map
            searchLayerRef.current.context.map.addLayer(layer);
            openNotification(
                "Layer Added",
                `The WMTS layer '${id}' has been successfully added to the map.`,
                "success",
                true
            );
        } catch (error) {
            console.error("Error in onclickWmts:", error);
            openNotification(
                "Unexpected Error",
                `An unexpected error occurred: ${error.message}`,
                "error",
                true
            );
            setLoadingTiles(null); // Reset loading state on error
        }
    };





    const style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
        }),
        stroke: new Stroke({
            color: "rgba(255, 255, 0, 0.6)", // Yellow color with full opacity
            width: 2,
        }),
    });

    const onClickselectAll = (id, data) => {
        console.log(id, data)
        try {
            setAllFeatureId((prevState) => [...prevState, id]); // Add ID to state

            let vectLayer;

            // Check if the map reference and layers are available
            if (!searchLayerRef.current || !searchLayerRef.current.context.map) {
                openNotification(
                    "Map Error",
                    "The map reference is not available.",
                    "error",
                    true
                );
                return;
            }

            // Get map layers and log for debugging
            const layers = searchLayerRef.current.context.map.getLayers();
            layers.forEach((layer) => {
                console.log("Layer Name:", layer.get("name"));
                if (layer.get("name") === "SearchResultsLayer") {
                    vectLayer = layer;
                }
            });

            // Exit if vectLayer is not found
            if (!vectLayer) {
                openNotification(
                    "Layer Not Found",
                    "The 'SearchResultsLayer' could not be found in the map layers.",
                    "warning",
                    true
                );
                return;
            }

            // Check if ID is already selected
            if (allFeaturesId.includes(id)) {
                // Remove feature if it exists
                setAllFeatureId((prevState) =>
                    prevState.filter((element) => element !== id)
                );
                setAreaCovered((prevState) =>
                    prevState.filter((element) => element.id !== id)
                );

                // Get the feature by ID and remove it if exists
                const feature = vectLayer.getSource().getFeatureById(id);
                if (feature) {
                    vectLayer.getSource().removeFeature(feature);
                    openNotification(
                        "Feature Removed",
                        `The feature with ID '${id}' has been removed.`,
                        "info",
                        true
                    );
                } else {
                    openNotification(
                        "Feature Not Found",
                        `No feature found with ID '${id}' to remove.`,
                        "warning",
                        true
                    );
                }
                return;
            }

            // Calculate intersection of polygons using turf.js
            const intersection = turf.intersect(
                turf.featureCollection([
                    turf.polygon(searchCriteria.geometry.coordinates),
                    turf.polygon(data),
                ])
            );

            if (!intersection) {
                openNotification(
                    "Intersection Error",
                    "No intersection found between the selected polygons.",
                    "warning",
                    true
                );
                return;
            }

            const areaOriginalPoly = turf.area(
                turf.polygon(searchCriteria.geometry.coordinates)
            );
            const areaPolygon = areaOriginalPoly / 1000000; // Area in square kilometers
            const areaIntersection = turf.area(intersection);
            const areaInSquareKilometers = areaIntersection / 1000000;

            const percentageOfArea = Math.round(
                (areaInSquareKilometers / areaPolygon) * 100
            );

            // Update covered area
            setAreaCovered((prevState) => [
                ...prevState,
                {
                    coveredArea: areaInSquareKilometers,
                    percentageOfArea: percentageOfArea,
                    id: id,
                },
            ]);

            // Ensure valid intersection coordinates before creating a feature
            if (
                intersection &&
                intersection.geometry &&
                intersection.geometry.coordinates.length > 0
            ) {
                const coords = intersection.geometry.coordinates[0];

                // Wrap the coordinates in another array to form a valid polygon
                const feature = new Feature(new Polygon([coords]));
                feature.setId(id);
                feature.setStyle(style);

                vectLayer.getSource().addFeature(feature);

                console.log("Feature Geometry:", feature.getGeometry().getCoordinates());

                const extent = feature.getGeometry().getExtent();
                if (!isEmptyExtent(extent)) {
                    searchLayerRef.current.context.map.getView().fit(extent, {
                        duration: 1250,
                        padding: [200, 200, 200, 200],
                    });
                    openNotification(
                        "Feature Added",
                        `The feature with ID '${id}' has been added and the map view is adjusted.`,
                        "success",
                        true
                    );
                } else {
                    openNotification(
                        "Invalid Extent",
                        "The feature has an empty or invalid extent.",
                        "warning",
                        true
                    );
                }
            } else {
                openNotification(
                    "Invalid Coordinates",
                    "No valid coordinates found for the intersection.",
                    "warning",
                    true
                );
            }
        } catch (error) {
            console.error("Error in onClickselectAll:", error);
            openNotification(
                "Unexpected Error",
                `An unexpected error occurred: ${error.message}`,
                "error",
                true
            );
        }
    };


    const isEmptyExtent = (extent) => {
        return extent[0] === extent[2] && extent[1] === extent[3];
    };

    const findIndex = (arr, id) => {
        let found = arr.find((element) => element.id === id);
        if (found === undefined) {
            return;
        } else {
            return `${Math.round(found.percentageOfArea)}% covered (${Math.round(
                found.coveredArea
            )}km²)`;
        }
    };


    const showInformation = (info) => {
        setinfoshow(false)
        setinfoshowdata(info)
    }




    return (
        <div
            className={`absolute w-25 z-50 bg-slate-100  rounded-sm transform transition-transform duration-300 ease-in-out
                 ${isOpen ? "translate-x-0 md:left-[4.7%] lg:left-[4.7%] xl:left-[3.8%] 2xl:left-[2.9%] " : "-translate-x-full"}`}
        >
            <TabHeader
                headingTitle="Archive Search"
                imgSrc={sidebarIcon.GE_Cancel_128}
                imgCancle={sidebarIcon.GE_Cancel_128}
                toggleOffCanvas={toggleOffCanvas}
            />
            <div className="py-2 px-2">
                {isError && <p>Error: {error.message}</p>}

                {searchCriteria.geometry === undefined ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-blue-300 font-semibold mb-2 text-center">
                            Please Create or Select AOI before searching.
                        </p>
                        <img src={sidebarIcon.GE_DRAW_128} className="w-6 h-6" alt="Draw Aoi" />
                    </div>
                ) : isLoading ? (
                    // Loading Indicator
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-2xl" />
                        <span className="ml-2 text-blue-500">Loading...</span>
                    </div>
                ) : !isError && (
                    <>
                        <div className="flex flex-row justify-between pb-2">
                            <div className="flex flex-row items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        defaultChecked={true}
                                    />
                                </label>
                                <span className="ml-2">Living Library Only</span>
                                <span className="ml-2">{totalResult}, Items</span>
                            </div>
                        </div>

                        <div className="h-[calc(100vh-205px)] overflow-auto scrollbar-thin">
                            {infoshow ? (
                                searchData.length > 0 ? (
                                    searchData.map((element, index) => (
                                        <div
                                            key={index}
                                            className="transition-shadow duration-300 ease-out border border-gray-300 grid grid-cols-[130px_auto] mb-2 min-h-[8.125rem] relative box-border hover:bg-gray-200"
                                            // className={`transition-shadow duration-300 ease-out border border-gray-300 grid grid-cols-[130px_auto] mb-2 min-h-[8.125rem] relative box-border ${isHovered ? 'bg-yellow-100' : 'bg-white'}`} // Conditionally change background color
                                            onMouseEnter={() => handleMouseEnter(element)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {/* <div className="bg-black text-white relative flex items-center justify-center box-border">
                                            <img
                                                className="max-h-[128px] w-full object-contain"
                                                alt="thumbnail"
                                                src={element._links?.thumbnail?.href}
                                            />
                                        </div> */}
                                            <ThumbnailImage element={element} airbusToken={airbusToken} />
                                            <div className="relative">
                                                <div className="text-gray-600 text-sm leading-5 mt-2 ml-3">
                                                    <span className="text-[95%]">
                                                        {new Date(element.properties.acquisitionDate)
                                                            .toUTCString()
                                                            .replace(' GMT', '')} UTC
                                                    </span>

                                                    <br />
                                                    <span className="text-blue-600 text-[95%]">
                                                        {element.properties.constellation === "PNEO"
                                                            ? "Pléiades Neo"
                                                            : element.properties.constellation === "PHR"
                                                                ? "Pléiades"
                                                                : element.properties.constellation === "SPOT"
                                                                    ? "SPOT"
                                                                    : ""}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <span title="Constellation" className="text-[95%]">
                                                            {element.properties.constellation === "PNEO"
                                                                ? "0.3m"
                                                                : element.properties.constellation === "PHR"
                                                                    ? "0.5m"
                                                                    : element.properties.constellation === "SPOT"
                                                                        ? "1.5m"
                                                                        : ""}
                                                        </span>

                                                        <span title="Incidence Angle" className="text-[95%] flex items-center">
                                                            <svg
                                                                className="w-4 h-4 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15.232 5.232l3.536 3.536M9 11l-2 2m0 0l-1.5 1.5M7 13l5-5 2.5 2.5M9 11h3m3.5 2h1m-1 0H9m9.5 1.5L19 14l-3 3-3 3L7.5 13 13 7.5 15.5 10 12 15l-4-4-1-1.5"
                                                                />
                                                            </svg>
                                                            {Math.round(element.properties.incidenceAngle)}
                                                        </span>

                                                        <span title="Cloud Cover" className="text-[95%] flex items-center">
                                                            <svg
                                                                className="w-4 h-4 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 17c.942 0 1.786-.272 2.5-.732M4 17h11.243M5.758 11.243c1.414-1.414 3.768-1.414 5.182 0m4.242 4.242c1.414 1.414 3.768 1.414 5.182 0m0 0c-1.414-1.414-1.414-3.768 0-5.182m-4.242 4.242c1.414-1.414 1.414-3.768 0-5.182"
                                                                />
                                                            </svg>
                                                            {Math.round(element.properties.cloudCover)}
                                                        </span>
                                                    </div>
                                                    <section className="border-t border-gray-300 absolute inset-x-0 bottom-0 p-1.5 flex justify-between">
                                                        {/* Left Section */}
                                                        <div className="flex items-center">
                                                            <div className="relative group cursor-pointer p-2" onClick={() => {
                                                                onClickselectAll(
                                                                    element.properties.id,
                                                                    element.geometry.coordinates
                                                                );
                                                            }} >
                                                                <FontAwesomeIcon icon={faSquare} className={`text-${allFeaturesId.includes(element.properties.id) ? 'blue-500' : 'gray-400'}`} />
                                                                <div className="absolute bottom-full mb-1 hidden w-max px-2 py-1 bg-gray-700 text-white text-xs rounded group-hover:block">
                                                                    Select All
                                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 bg-gray-700 rotate-45"></div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    color: "#0000008a",
                                                                    display: "inline",
                                                                    fontSize: ".7rem",
                                                                }}
                                                            >
                                                                {findIndex(
                                                                    areaCovered,
                                                                    element.properties.id
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Section */}
                                                        <div className="flex items-center space-x-2">
                                                            <div className="relative group cursor-pointer p-2" onClick={() => {
                                                                onclickWmts(element.properties.id, element._links.wmts.href);
                                                            }}>
                                                                {loadingTiles === element.properties.id ? (
                                                                    <FontAwesomeIcon icon={faSpinner} spin className="text-gray-500" />
                                                                ) : (
                                                                    <FontAwesomeIcon icon={faEye} className={`text-${quickLook.includes(element.properties.id) ? 'blue-500' : 'gray-400'}`} />
                                                                )}
                                                                <div className="absolute bottom-full mb-1 hidden w-max px-2 py-1 bg-gray-700 text-white text-xs rounded group-hover:block">
                                                                    {loadingTiles === element.properties.id ? 'Loading...' : 'Visibility'}
                                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 bg-gray-700 rotate-45"></div>
                                                                </div>
                                                            </div>

                                                            <div className="relative group cursor-pointer p-2" onClick={() => {
                                                                const feature = new Feature(
                                                                    new Polygon(element.geometry.coordinates)
                                                                );
                                                                vectorLayerRef.current.context.map
                                                                    .getView()
                                                                    .fit(feature.getGeometry().getExtent(), {
                                                                        duration: 1250,
                                                                        padding: [200, 200, 200, 200],
                                                                    });
                                                            }}>
                                                                <FontAwesomeIcon icon={faCrosshairs} />
                                                                <div className="absolute bottom-full mb-1 hidden w-max px-2 py-1 bg-gray-700 text-white text-xs rounded group-hover:block">
                                                                    Crosshairs
                                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 bg-gray-700 rotate-45"></div>
                                                                </div>
                                                            </div>

                                                            <div className="relative group cursor-pointer p-2">
                                                                <FontAwesomeIcon icon={faCartShopping} />
                                                                <div className="absolute left-[-50px] bottom-full mb-1 hidden w-max px-2 py-1 bg-gray-700 text-white text-xs rounded group-hover:block">
                                                                    Add to Cart
                                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 bg-gray-700 rotate-45"></div>
                                                                </div>
                                                            </div>

                                                            <div className="relative group cursor-pointer p-2" onClick={() => showInformation({ element, airbusToken })} >
                                                                <FontAwesomeIcon icon={faCircleInfo} />
                                                                <div className="absolute left-[-50px] bottom-full mb-1 hidden w-max px-2 py-1 bg-gray-700 text-white text-xs rounded group-hover:block">
                                                                    Information
                                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-2 h-2 bg-gray-700 rotate-45"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                    <div className="absolute right-1 top-1"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 p-4">
                                        No Data Available
                                    </div>
                                )
                            ) : (
                                <SearchInfo
                                    infoitem={infoshowdata}
                                    setinfoshow={setinfoshow} />
                            )}

                            {infoshow && !isMoreGet && (

                                <div className="flex justify-center mt-2">
                                    <button
                                        onClick={handleClickMore}
                                        className="flex items-center text-blue-500 hover:bg-gray-200 rounded px-4 py-2"
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? (
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />
                                        ) : (
                                            "Load More"
                                        )}
                                    </button>
                                </div>
                            )}

                        </div>
                    </>
                )}


            </div>

        </div>
    );
};

export default SearchResult;