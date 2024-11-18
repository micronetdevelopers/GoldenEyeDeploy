import React, { useEffect, useState, useRef } from 'react'
import "./RootContainer.css"
import { GE_ShopBasket_128, sidebarIcon, GEAoiLayers } from '../constant'
import { Tooltip } from 'bootstrap';

import Productmenu from "./Search/product/Productmenu"
import ProductAllocation from '../Auth/Manage/CreateAdminUser/ProductAllocation';
import Criteriamenu from './Search/Criteria/Criteriamenu';
import Coordinatemenu from './Search/draw/Coordinatemenu';
import SearchResult from './Search/SearchResult/SearchResult';
import SearchMap from './Search/SearchMap/SearchMap';
import axios from "axios";

import "ol/ol.css";
import * as turf from "@turf/turf"
import { Fill, Stroke, Style, Text } from "ol/style";
import { Draw } from 'ol/interaction';
import { Polygon as PolygonGeom } from 'ol/geom'; // Import polygon geometry
import Overlay from 'ol/Overlay'; // Import Overlay

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

import BufferComponent from "./Search/Buffer/BufferComponent"
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
import { Modal, notification } from "antd"; // Import Ant Design Notification and Progress components


import { useUser } from "../Auth/AuthProvider/AuthContext";
import { onClickMore } from "../reusablecomponents/apiService/ApiService";
import ModalManager from "../reusablecomponents/GeopicxPopupModals/ModalManager";


import LayerModify from './Search/modify/LayerModify';
import ImportData from './Search/ImportFile/ImportData';
import Search from './Tasking/Task';

import { useDatawithpost } from '../hooks';
import Orders from './Orders/Orders';
import { Vector as VectorSource } from 'ol/source';
import { getArea } from 'ol/sphere'; // Import getArea from OpenLayers
import TileLayer from "ol/layer/Tile";
import { Geocoder } from 'ol/control'; // Import Geocoder from OpenLayers
import warning from 'antd/es/_util/warning';



function OpenSearchMap() {
  const [showLeftdrop, setshowLeftdrop] = useState(false);
  const [productmenu, setProductmenu] = useState(false);
  const [criteriamenu, setCriteriamenu] = useState(false);
  const [isModify, setisModify] = useState(false)
  const [isimportFile, setisimportFile] = useState(false)
  const [activeItem, setActiveItem] = useState(null);

  const [isOpenTasking, setIsOpenTasking] = useState(false);
  const [CenterCoordinets, setCenterCoordinets] = useState(true);
  const [isCoordinate, setisCoordinate] = useState(false);
  const [id, setId] = useState("1");
  const [totalFeatures, setTotalFeatures] = useState([]);
  const [drawgeometryType, setdrawgeometryType] = useState(null);
  const [coordinateData, setCoordinates] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [drawButtonName, setDrawButtonName] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawType, setDrawType] = useState(null);
  const [isRectangle, setIsRectangle] = useState(false);
  const vectorRef = useRef(); // Create the ref for the vector layer
  const searchLayerRef = useRef(); // Create the ref for the search layer
  const searchLayerHoverRef = useRef(); // Create the ref for the search layer
  const mapRef = useRef(null);
  const [totalResult, setTotalResult] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const token = user?.access;
  const [minValue, setMinValue] = useState(0.4);
  const [maxValue, setMaxValue] = useState(39.6);
  // State to track the visibility of the menu, buffer, and the current tool
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isBufferVisible, setIsBufferVisible] = useState(false);
  const [currentTool, setCurrentTool] = useState("Point");
  const [valueBuffer, setvalueBuffer] = useState(null);

  const vectorLayerRef = useRef();
  const measureTooltipElement = useRef();
  const measureTooltip = useRef();
  const modifyInteractionRef = useRef(null); // Ref for the modify interaction
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedPolygonSource1, setSelectedPolygonSource1] = useState(new VectorSource());

  const [featureAreaOrLength, setFeatureAreaOrLength] = useState(null);
  const [count, setCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(11);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePolygon, setActivePolygon] = useState(null); // To track the active polygon
  const [polygonName, setPolygonName] = useState(''); // To hold the name of the active polygon
  const [drawnPolygons, setDrawnPolygons] = useState([]); // Holds names of drawn polygons
  const [activePolygonName, setActivePolygonName] = useState(''); // Active polygon name
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
  const [isEditingName, setIsEditingName] = useState(false); // Control if user is editing name
  const [editingPolygonIndex, setEditingPolygonIndex] = useState(null); // Track the polygon being edited
  const [tempPolygonName, setTempPolygonName] = useState(''); // Temporary name while editing


  const [currentActiveLayer, setCurrentActiveLayer] = useState(null); // Currently selected feature
  const [modifiedPolygon, setModifiedPolygon] = useState(null); // To track modified polygons
  const [aoiNameChnage, setaoiNameChnage] = useState(null); // To track modified polygons
  // console.log(totalFeatures)

  const [activeFeatureIdForModfiye, setactiveFeatureIdForModfiye] = useState(null);


  const [selectedPolygonId, setSelectedPolygonId] = useState(null);
  const [selectedPolygonSource, setSelectedPolygonSource] = useState(null);

  const [receivedData, setReceivedData] = useState([]);

  const [selectedValues, setSelectedValues] = useState([]); // Store the selected values here
  const [selectedConstillation, setSelectedConstillation] = useState("")
  // const [incidentAngle, setIncidentAngle] = useState(""); // Incident Angle range [0, 60]
  // const [cloudCover, setCloudCover] = useState("");
  // const [aquDate, setaquDate] = useState("");
  const [criteriaData, setcriteriaData] = useState("");
  const [originalPolygonGeometry, setOriginalPolygonGeometry] = useState(null);
  const [area, setArea] = useState(0); // State to hold area
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

  const openConfirmationModal = (title, description, onConfirm, notificationData = null) => {
    Modal.confirm({
      title: title,
      content: description,
      onOk: () => {
        if (onConfirm) {
          onConfirm();
        }

        // Default notification configuration
        const defaultNotification = {
          message: 'Confirmed',
          description: 'You have confirmed the action.',
          placement: 'bottom',
          duration: 2,
          showProgress: true,
          pauseOnHover: true,
        };

        // Merge user-provided notificationData with default configuration
        const finalNotification = { ...defaultNotification, ...(notificationData || {}) };

        // Display the notification
        notification.success(finalNotification);
      },
      okText: 'Yes',
      cancelButtonProps: { style: { display: 'none' } }, // Hides the "No" button
    });
  };



  const handleProduct = () => {
    setProductmenu(!productmenu);
    setCriteriamenu(false);
    setIsMenuVisible(false);
    setisModify(false);
    setisimportFile(false);
    // Example of calling the function
    // openConfirmationModal(
    //   'Are you sure?',
    //   'Do you want to proceed with this action?',
    //   () => console.log('User confirmed the action'),
    //   () => console.log('User cancelled the action')
    // );
  };
  const handleCriteria = () => {
    setCriteriamenu(!criteriamenu);
    setProductmenu(false);
    setIsMenuVisible(false);
    setisModify(false);
    setisimportFile(false);
  };

  const handleDrawLayer = () => {
    setIsMenuVisible(!isMenuVisible);
    setIsBufferVisible(false); // Close buffer when menu toggles
    setProductmenu(false);
    setCriteriamenu(false);
    setisModify(false);
    setisimportFile(false);
  };

  const openModalAoiManager = () => {
    setIsModalOpen(!isModalOpen);
    setIsDropdownOpen(false);
  }
  const openModalModify = () => {
    setisModify(!isModify);
    setCriteriamenu(false);
    setProductmenu(false);
    setIsMenuVisible(false);
    setisimportFile(false);
  }
  const handleImportData = () => {
    setisimportFile(!isimportFile)
    setisModify(false);
    setCriteriamenu(false);
    setProductmenu(false);
    setIsMenuVisible(false);
  }

  // Toggle Buffer Distance UI when a tool is clicked
  const handleShowBufferUI = (tool) => {
    if (currentTool === tool) {
      // If the same tool is clicked, toggle the buffer visibility
      setIsBufferVisible(!isBufferVisible);
    } else {
      // If a different tool is clicked, show the buffer for the new tool
      setCurrentTool(tool);
      setIsBufferVisible(true); // Show buffer for the new tool
    }
  };


  // Handle buffer change when the value is updated
  const handleBufferChange = (bufferValue) => {
    setvalueBuffer(bufferValue);
    // console.log(`Buffer value for ${currentTool}:`, bufferValue);
  };

  const handlePolygonSourceUpdate = (source) => {
    setSelectedPolygonSource(source); // Update the state with selectedPolygonSource from SearchMap
    // console.log("source ", source)
    const flatCoordinates = source.geometry.flatCoordinates;
    const coordinatePairs = [];
    for (let i = 0; i < flatCoordinates.length; i += 2) {
      coordinatePairs.push([flatCoordinates[i], flatCoordinates[i + 1]]);
    }
    // Create a Turf.js polygon object using the new geometry coordinates
    const polygonGeoJSON = turf.polygon([coordinatePairs]);
    console.log("polygonGeoJSON ", polygonGeoJSON);
  };

  const updatePolygonGeometry = (selectedPolygonId, newGeometryCoordinates) => {
    // console.log("newGeometryCoordinates", newGeometryCoordinates);
    // Find the polygon feature corresponding to the selectedPolygonId
    const selectedPolygon = drawnPolygons.find(poly => poly.feature.id_ === selectedPolygonId);
    // console.log("selectedPolygon ", selectedPolygon);
    if (!selectedPolygon) {
      console.error("No polygon found with the provided ID:", selectedPolygonId);
      // Show a notification for the missing polygon
      openNotification(
        'Polygon Not Found',
        'No polygon found with the provided ID. Please select a valid polygon.',
        'error',
        true
      );
      return; // Stop if no polygon is found
    }

    // Check the geometry type
    const geometryType = selectedPolygon.feature.getGeometry().getType();
    // console.log("Geometry type:", geometryType);

    // Convert flat coordinates to pairs of [longitude, latitude]
    const flatCoordinates = newGeometryCoordinates.flatCoordinates;
    const coordinatePairs = [];
    for (let i = 0; i < flatCoordinates.length; i += 2) {
      coordinatePairs.push([flatCoordinates[i], flatCoordinates[i + 1]]);
    }

    // Create a Turf.js polygon object using the new geometry coordinates
    const polygonGeoJSON = turf.polygon([coordinatePairs]);

    // Check for kinks (self-intersections) in the polygon
    const polygonKinks = turf.kinks(polygonGeoJSON);

    if (polygonKinks.features.length > 0) {
      console.error("Invalid polygon geometry due to self-intersections (kinks).");
      // Show a notification for invalid polygon geometry
      openNotification(
        'Invalid Polygon Geometry',
        'The polygon contains self-intersections (kinks) and is invalid. Please modify the geometry.',
        'warning',
        true
      );
      // Apply styling for the invalid polygon geometry
      const invalidStyle = invalidGeometry;
      selectedPolygon.feature.setStyle(invalidStyle);

      // Stop further processing since the polygon geometry is invalid
      return;
    }

    // If the geometry is valid, calculate the area and proceed with updating the polygon feature
    const polygonarae = turf.area(polygonGeoJSON) / 1e6; // Calculate area in square meters
    const area = polygonarae.toFixed(2);
    // console.log("Calculated area:", area);

    const updatedPolygons = drawnPolygons.map((poly) => {
      if (poly.feature.id_ === selectedPolygonId) {
        // Create a new Polygon geometry with the new coordinates
        const newGeometry = new PolygonGeom([newGeometryCoordinates.flatCoordinates]);

        // Create a new feature with the updated geometry
        const updatedFeature = new Feature({
          geometry: newGeometry,
          ...poly.feature.getProperties(), // Preserve the original properties
        });

        // Make sure to preserve the original feature's ID
        updatedFeature.setId(poly.feature.getId());

        // Update the areaOrLength key
        return {
          ...poly,
          feature: updatedFeature,
          areaOrLength: area, // Update areaOrLength with the calculated area (formatted to 2 decimal places)
        };
      }
      return poly; // Return other polygons unchanged
    });

    // console.log("updatedPolygons", updatedPolygons);

    // Update state with the new array of polygons
    setDrawnPolygons(updatedPolygons);

    // Set the active polygon to the updated one
    const modifiedPolygon = updatedPolygons.find(poly => poly.feature.id_ === selectedPolygonId);
    if (modifiedPolygon) {
      setActivePolygon(modifiedPolygon); // Set the modified polygon as active
      setModifiedPolygon(modifiedPolygon); // Set the modified polygon in state
    }
  };


  const handlePolygonSelect = (featureId, index) => {
    setSelectedPolygonId(featureId); // Set the selected polygon ID
    onPolygonIdChange(featureId);

    const selectedPolygon = drawnPolygons.find(poly => poly.feature.id_ === featureId);

    // Check if the selected polygon or its feature is undefined
    if (!selectedPolygon) {
      openNotification(
        'Polygon Selection Error',
        'The selected polygon was not found. Please try selecting a valid polygon.',
        'error',
        true
      );
      return;
    }

    if (!selectedPolygon.feature) {
      openNotification(
        'Feature Error',
        'The selected polygon feature is undefined. Please check the data and try again.',
        'error',
        true
      );
      return;
    }

    if (!selectedPolygon.featureId) {
      openNotification(
        'Feature ID Error',
        'The feature ID of the selected polygon is undefined. Please verify the polygon data.',
        'error',
        true
      );
      return;
    }

    // If all checks pass, proceed with setting the active polygon
    setActivePolygon(selectedPolygon);
    setEditingPolygonIndex(Number(index));
    setTempPolygonName(featureId);

    setTotalFeatures((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      const existingFeatureIndex = updatedFeatures.findIndex(
        (feature) => feature.featureId === selectedPolygon.featureId
      );

      if (existingFeatureIndex === -1) {
        updatedFeatures.push(selectedPolygon); // Add the selected polygon
      } else {
        updatedFeatures[existingFeatureIndex] = selectedPolygon; // Update the existing one
      }

      // Schedule the style update outside of the render cycle
      updatePolygonStylesWithDelay(Number(index));

      // Ensure the map view fits the selected polygon's geometry
      if (vectorLayerRef.current && vectorLayerRef.current.context && vectorLayerRef.current.context.map) {
        const mapView = vectorLayerRef.current.context.map.getView();
        try {
          const featureExtent = selectedPolygon.feature.getGeometry().getExtent();
          mapView.fit(featureExtent, {
            duration: 1250,
            padding: [200, 200, 200, 200],
          });
        } catch (error) {
          console.error('Error fitting map view:', error);
          openNotification(
            'Map View Error',
            'An error occurred while fitting the map view. Please try again.',
            'error',
            true
          );
        }
      } else {
        console.error('Map reference is not valid');
        openNotification(
          'Map Reference Error',
          'The map reference is not valid. Please check the map setup and try again.',
          'error',
          true
        );
      }

      return updatedFeatures;
    });
  };




  // Cancel modification

  const finishModify = (modifiedFeature) => {
    try {
      // Check if the event is user-triggered (isTrusted)
      if (modifiedFeature.isTrusted) {
        if (selectedPolygon) {
          // Store the original geometry before modification
          setOriginalPolygonGeometry(selectedPolygon.getGeometry().clone());

          // Check if the selected polygon source and geometry are valid before updating
          if (selectedPolygonSource && selectedPolygonSource.selectedPolygonId && selectedPolygonSource.geometry) {
            // Update the polygon geometry
            updatePolygonGeometry(selectedPolygonSource.selectedPolygonId, selectedPolygonSource.geometry);

            // Notify user of successful modification
            // openNotification(
            //   'Polygon Modification',
            //   'The polygon geometry has been successfully modified.',
            //   'success',
            //   true
            // );
          } else {
            openNotification(
              'Modification Error',
              'Invalid polygon source or geometry data. Please try again.',
              'error',
              true
            );
            return;
          }
        } else {
          openNotification(
            'Selection Error',
            'No polygon is currently selected for modification. Please select a polygon first.',
            'error',
            true
          );
          return;
        }
      } else {
        openNotification(
          'Modification Error',
          'The modification was not initiated by the user. Please try again.',
          'warning',
          true
        );
        return;
      }

      // Open the modification modal and reset states
      openModalModify();
      setSelectedPolygonId(null);
      setModifiedPolygon(null);
      setSelectedPolygon(null);
      setSelectedPolygonSource1(new VectorSource());
    } catch (error) {
      console.error('Error during polygon modification:', error);
      openNotification(
        'Unexpected Error',
        'An error occurred while modifying the polygon. Please try again later.',
        'error',
        true
      );
    }
  };


  const modifycancel = () => {
    try {
      if (selectedPolygonId) {
        const polygon = drawnPolygons.find(poly => poly.feature.id_ === selectedPolygonId);

        if (polygon) {
          // Restore to the original geometry if it exists
          if (originalPolygonGeometry) {
            polygon.feature.setGeometry(originalPolygonGeometry);
            updatePolygonGeometry(selectedPolygonId, originalPolygonGeometry);

            // openNotification(
            //   'Modification Canceled',
            //   'The polygon geometry has been restored to its original state.',
            //   'info',
            //   true
            // );
          } else {
            // No original geometry (first-time modification), use the current geometry
            updatePolygonGeometry(selectedPolygonId, polygon.feature.getGeometry());

            openNotification(
              'Modification Canceled',
              'No original geometry found. The current polygon geometry is retained.',
              'warning',
              true
            );
          }

          // Set the selected polygon to the current one
          setSelectedPolygon(polygon.feature);
        } else {
          // No polygon found for the given ID
          openNotification(
            'Cancel Error',
            'No polygon found with the selected ID. Please select a valid polygon.',
            'error',
            true
          );

          setSelectedPolygon(null);
          setSelectedPolygonSource1(new VectorSource());
        }
      } else {
        // No polygon ID is selected
        openNotification(
          'Cancel Error',
          'No polygon is currently selected for cancellation. Please select a polygon first.',
          'error',
          true
        );
      }

      // Close the modify layer and reset states
      openModalModify();
      setSelectedPolygonId(null);
      setModifiedPolygon(null);
      setSelectedPolygon(null);
      setSelectedPolygonSource1(new VectorSource());
    } catch (error) {
      console.error('Error during modification cancellation:', error);
      openNotification(
        'Unexpected Error',
        'An error occurred while canceling the polygon modification. Please try again later.',
        'error',
        true
      );
    }
  };



  const updatePolygonSelection = (polygonId) => {
    try {
      const polygon = drawnPolygons.find(poly => poly.feature.id_ === polygonId);

      if (polygon) {
        // Set the selected polygon
        setSelectedPolygon(polygon.feature);

        // Create a new VectorSource with the selected feature
        const featureSource = new VectorSource({ features: [polygon.feature] });
        setSelectedPolygonSource1(featureSource);

        // Store the original geometry of the newly selected polygon
        setOriginalPolygonGeometry(polygon.feature.getGeometry().clone());

        // Handle polygon source update
        handlePolygonSourceUpdate({
          geometry: polygon.feature.getGeometry(),
          selectedPolygonId: polygonId
        });

        // openNotification(
        //   'Polygon Selected',
        //   'The polygon has been successfully selected and its geometry stored.',
        //   'success',
        //   true
        // );
      } else {
        // No polygon found with the given ID
        setSelectedPolygon(null);
        setSelectedPolygonSource1(new VectorSource());
        setOriginalPolygonGeometry(null);

        openNotification(
          'Selection Error',
          'No polygon found with the specified ID. Please select a valid polygon.',
          'error',
          true
        );
      }
    } catch (error) {
      console.error('Error during polygon selection:', error);
      openNotification(
        'Unexpected Error',
        'An error occurred while selecting the polygon. Please try again later.',
        'error',
        true
      );
    }
  };


  // const onPolygonIdChange = (newPolygonId) => {
  //   setSelectedPolygonId(newPolygonId);
  //   updatePolygonSelection(newPolygonId); // Call the new function here
  // };
  const onPolygonIdChange = (newPolygonId) => {
    try {
      if (!newPolygonId) {
        openNotification(
          'Invalid Polygon ID',
          'The provided polygon ID is invalid or empty. Please select a valid polygon.',
          'error',
          true
        );
        return;
      }

      // Update the selected polygon ID state
      setSelectedPolygonId(newPolygonId);

      // Attempt to update the polygon selection
      updatePolygonSelection(newPolygonId);

      // Notify the user of a successful polygon ID change
      // openNotification(
      //   'Polygon ID Changed',
      //   `Polygon ID ${newPolygonId} has been successfully updated.`,
      //   'success',
      //   true
      // );
    } catch (error) {
      console.error('Error during polygon ID change:', error);
      openNotification(
        'Unexpected Error',
        'An error occurred while changing the polygon ID. Please try again later.',
        'error',
        true
      );
    }
  };


  const activePolygonStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.1)',
    }),
  });

  const nonActivePolygonStyle = new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.1)', // Black color with 10% opacity
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.6)', // Black color with 50% opacity
      width: 3,
    }),
  });

  const invalidGeometry = new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.1)', // Black color with 10% opacity
    }),
    stroke: new Stroke({
      color: 'rgba(255, 0, 0, 0.6)', // Red color for the stroke (border)
      width: 3,     // Border width
    }),
  });


  // Apply styles to polygons based on whether they are active or non-active
  const updatePolygonStyles = (activeIndex) => {
    try {
      if (!drawnPolygons || drawnPolygons.length === 0) {
        openNotification(
          'No Polygons Found',
          'There are no polygons available to update styles. Please draw or select a polygon first.',
          'warning',
          true
        );
        return;
      }

      if (activeIndex < 0 || activeIndex >= drawnPolygons.length) {
        openNotification(
          'Invalid Active Index',
          'The provided active index is out of range. Please select a valid polygon.',
          'error',
          true
        );
        return;
      }

      drawnPolygons.forEach((polygon, index) => {
        if (!polygon || !polygon.feature) {
          console.error(`Invalid polygon or feature at index ${index}`);
          openNotification(
            'Invalid Polygon Data',
            `Polygon data is missing or corrupted at index ${index}. Skipping this polygon.`,
            'error',
            true
          );
          return;
        }

        // Apply styles based on active index
        if (index === activeIndex) {
          // Active polygon style (yellow)
          polygon.feature.setStyle(activePolygonStyle);

          // Fit map view to the active polygon's geometry
          if (vectorLayerRef.current?.context?.map) {
            try {
              vectorLayerRef.current.context.map.getView().fit(polygon.feature.getGeometry().getExtent(), {
                duration: 1250,
                padding: [200, 200, 200, 200],
              });
            } catch (error) {
              console.error('Error fitting map view:', error);
              openNotification(
                'Map View Error',
                'An error occurred while fitting the map view to the selected polygon. Please try again.',
                'error',
                true
              );
            }
          } else {
            console.error('Map reference is invalid.');
            openNotification(
              'Map Reference Error',
              'The map reference is invalid or not available. Unable to fit the map view.',
              'error',
              true
            );
          }
        } else {
          // Non-active polygon style (brown)
          polygon.feature.setStyle(nonActivePolygonStyle);
        }
      });

      // Notify the user of successful style update
      // openNotification(
      //   'Polygon Styles Updated',
      //   'Polygon styles have been successfully updated.',
      //   'success',
      //   true
      // );
    } catch (error) {
      console.error('Unexpected error in updatePolygonStyles:', error);
      openNotification(
        'Unexpected Error',
        'An error occurred while updating polygon styles. Please try again later.',
        'error',
        true
      );
    }
  };


  // Use requestAnimationFrame to ensure style updates happen outside render
  const updatePolygonStylesWithDelay = (activeIndex) => {
    requestAnimationFrame(() => {
      updatePolygonStyles(activeIndex);
    });
  };


  useEffect(() => {
    try {
      if (drawnPolygons.length > 0 || modifiedPolygon || aoiNameChnage) {
        let activePolygon = null;
        let isNewPolygon = false;

        // Determine the active polygon based on the current state
        if (modifiedPolygon) {
          activePolygon = modifiedPolygon;
          // openNotification(
          //   'Polygon Modified',
          //   'The polygon has been successfully modified.',
          //   'info',
          //   true
          // );
        } else if (aoiNameChnage) {
          activePolygon = aoiNameChnage;
          // openNotification(
          //   'AOI Name Changed',
          //   'The Area of Interest (AOI) name has been updated.',
          //   'info',
          //   true
          // );
        } else {
          // Handle new polygon addition
          activePolygon = drawnPolygons[drawnPolygons.length - 1];
          isNewPolygon = true;
          // openNotification(
          //   'New Polygon Added',
          //   'A new polygon has been added to the map.',
          //   'success',
          //   true
          // );
        }

        // Validate the active polygon
        if (activePolygon && activePolygon.featureId) {
          setActivePolygon(activePolygon);
          setTempPolygonName(activePolygon.featureId);
          setactiveFeatureIdForModfiye(activePolygon.featureId);

          if (isNewPolygon) {
            setEditingPolygonIndex(drawnPolygons.length - 1);
          }

          // Update the list of total features
          setTotalFeatures((prevFeatures) => {
            const updatedFeatures = [...prevFeatures];
            const existingFeatureIndex = updatedFeatures.findIndex(
              (feature) => feature.featureId === activePolygon.featureId
            );

            if (existingFeatureIndex === -1) {
              updatedFeatures.push(activePolygon);
              // openNotification(
              //   'Polygon Added to Features',
              //   'The new polygon has been added to the list of features.',
              //   'success',
              //   true
              // );
            } else {
              updatedFeatures[existingFeatureIndex] = activePolygon;
              // openNotification(
              //   'Polygon Updated',
              //   'The existing polygon has been updated successfully.',
              //   'info',
              //   true
              // );
            }

            // Determine the index for style update
            const polygonIndex = isNewPolygon
              ? drawnPolygons.length - 1
              : updatedFeatures.findIndex((feature) => feature.featureId === activePolygon.featureId);

            // Apply styles with delay
            try {
              updatePolygonStylesWithDelay(polygonIndex);
              // openNotification(
              //   'Polygon Style Updated',
              //   'The styles for the active polygon have been updated.',
              //   'success',
              //   true
              // );
            } catch (error) {
              console.error('Error updating polygon styles:', error);
              openNotification(
                'Style Update Error',
                'An error occurred while updating the polygon styles. Please try again.',
                'error',
                true
              );
            }

            return updatedFeatures;
          });
        } else {
          console.error('Active polygon or featureId is undefined');
          openNotification(
            'Polygon Selection Error',
            'The selected polygon or its feature ID is undefined. Please check your selection.',
            'error',
            true
          );
        }
      }
    } catch (error) {
      console.error('Unexpected error in useEffect:', error);
      openNotification(
        'Unexpected Error',
        'An unexpected error occurred while processing the polygon update. Please try again later.',
        'error',
        true
      );
    }
  }, [drawnPolygons, modifiedPolygon, aoiNameChnage]);



  const selectPolygonName = (index) => {
    if (index < 0 || index >= drawnPolygons.length) {
      console.error('Index out of bounds');
      openNotification(
        'Selection Error',
        'The selected index is out of bounds. Please choose a valid polygon.',
        'error',
        true
      );
      return;
    }

    const selectedPolygon = drawnPolygons[index];

    if (selectedPolygon && selectedPolygon.feature && selectedPolygon.featureId) {
      console.log('Selected Polygon:', selectedPolygon);

      // Set the active polygon and update related states
      setActivePolygon(selectedPolygon);
      setEditingPolygonIndex(index);
      setTempPolygonName(selectedPolygon.featureId);
      setactiveFeatureIdForModfiye(selectedPolygon.featureId);

      // Notify the user about the selection
      openNotification(
        'Polygon Selected',
        `Polygon with ID ${selectedPolygon.featureId} has been selected.`,
        'info',
        true
      );

      // Update the list of total features
      setTotalFeatures((prevFeatures) => {
        const updatedFeatures = [...prevFeatures];
        const existingFeatureIndex = updatedFeatures.findIndex(
          (feature) => feature.featureId === selectedPolygon.featureId
        );

        if (existingFeatureIndex === -1) {
          updatedFeatures.push(selectedPolygon);
          // openNotification(
          //   'Feature Added',
          //   `The selected polygon has been added to the list of features.`,
          //   'success',
          //   true
          // );
        } else {
          updatedFeatures[existingFeatureIndex] = selectedPolygon;
          openNotification(
            'Feature Updated',
            `The selected polygon has been updated in the list of features.`,
            'info',
            true
          );
        }

        // Apply the style update with delay
        try {
          updatePolygonStylesWithDelay(index);
          // openNotification(
          //   'Style Updated',
          //   'The style for the selected polygon has been updated.',
          //   'success',
          //   true
          // );
        } catch (error) {
          console.error('Error updating polygon styles:', error);
          openNotification(
            'Style Update Error',
            'An error occurred while updating the polygon styles.',
            'error',
            true
          );
        }

        // Fit the map view to the selected polygon's geometry
        if (vectorLayerRef.current && vectorLayerRef.current.context && vectorLayerRef.current.context.map) {
          const mapView = vectorLayerRef.current.context.map.getView();
          try {
            const featureExtent = selectedPolygon.feature.getGeometry().getExtent();
            mapView.fit(featureExtent, {
              duration: 1250,
              padding: [200, 200, 200, 200],
            });
            openNotification(
              'Map View Updated',
              'The map view has been adjusted to fit the selected polygon.',
              'info',
              true
            );
          } catch (error) {
            console.error('Error fitting map view:', error);
            openNotification(
              'Map View Error',
              'An error occurred while adjusting the map view to the selected polygon.',
              'error',
              true
            );
          }
        } else {
          console.error('Map reference is not valid');
          openNotification(
            'Map Reference Error',
            'The map reference is invalid. Please ensure the map is loaded correctly.',
            'error',
            true
          );
        }

        return updatedFeatures;
      });

      // Exit editing mode and close the dropdown
      setIsEditingName(false);
      setIsDropdownOpen(false);
    } else {
      console.error('Selected polygon or featureId is undefined:', selectedPolygon);
      openNotification(
        'Selection Error',
        'The selected polygon or its feature ID is undefined. Please try again.',
        'error',
        true
      );
    }
  };


  const searchCriteria = {
    itemsPerPage: 12,
    constellation: selectedConstillation, // Customize as needed
    cloudCover: JSON.stringify(criteriaData?.cloudCover) || "[0,100]",
    incidenceAngle: JSON.stringify(criteriaData?.incidentAngle) || "[0,60]",
    processingLevel: "SENSOR",
    sortBy: "",
    // acquisitionDate: criteriaData?.Date || "",
    acquisitionDate: Array.isArray(criteriaData?.Date) && criteriaData.Date.length === 2
      ? `[${criteriaData.Date.join(",")}]`
      : criteriaData?.Date || "",
    geometry: activePolygon // Only use geometry of the active polygon
      ? {
        type: activePolygon.feature.getGeometry().getType(), // Get the type from the active polygon
        coordinates: activePolygon.feature.getGeometry().getCoordinates(), // Get coordinates from the active polygon
      }
      : undefined // Set geometry to undefined if there's no active polygon
  };



  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };



  const handleNameChange = (e) => {
    setTempPolygonName(e.target.value); // Update the temporary name
  };



  const confirmNameChange = () => {
    try {
      // Update drawn polygons and keep a reference to the updated polygons
      const updatedPolygons = drawnPolygons.map((polygon, index) => {
        if (index === editingPolygonIndex) {
          const feature = polygon?.feature;
          if (feature?.setId) {
            feature.setId(tempPolygonName);
          }

          return {
            ...polygon,
            featureId: tempPolygonName,
          };
        }
        return polygon;
      });

      // Set the updated polygons state
      setDrawnPolygons(updatedPolygons);

      // Notify the user about the name change
      // openNotification(
      //   'Polygon Name Updated',
      //   `The polygon name has been successfully updated to "${tempPolygonName}".`,
      //   'success',
      //   true
      // );

      // Update total features
      setTotalFeatures((prevFeatures) =>
        prevFeatures.map((feature, index) => {
          if (index === editingPolygonIndex) {
            const featureObj = feature?.feature;
            if (featureObj?.setId) {
              featureObj.setId(tempPolygonName);
            }

            return {
              ...feature,
              featureId: tempPolygonName,
            };
          }
          return feature;
        })
      );

      // Find and set the modified polygon as the active polygon
      const modifiedPolygon = updatedPolygons.find((poly) => poly.featureId === tempPolygonName);
      if (modifiedPolygon) {
        setActivePolygon(modifiedPolygon);
        setaoiNameChnage(modifiedPolygon);

        openNotification(
          'Active Polygon Updated',
          `The active polygon has been set to "${tempPolygonName}".`,
          'info',
          true
        );
      } else {
        openNotification(
          'Polygon Not Found',
          `The polygon with the name "${tempPolygonName}" could not be found.`,
          'error',
          true
        );
      }

      // Exit editing mode
      setIsEditingName(false);
    } catch (error) {
      console.error('Error confirming name change:', error);
      openNotification(
        'Update Error',
        'An error occurred while updating the polygon name. Please try again.',
        'error',
        true
      );
    }
  };


  const handleInputClick = () => {
    setIsEditingName(true); // Start editing mode
    setIsDropdownOpen(false);
  };


  const removePolygon = (index) => {
    try {
      if (index < 0 || index >= drawnPolygons.length) {
        // Handle out-of-bounds index
        openNotification(
          'Invalid Polygon Index',
          'The polygon index provided is out of bounds. Please try again.',
          'error',
          true
        );
        return;
      }

      // Set the modal state to closed
      setIsModalOpen(false);

      // Remove the polygon from drawnPolygons
      setDrawnPolygons((prevPolygons) => {
        const updatedPolygons = prevPolygons.filter((_, i) => i !== index);
        return updatedPolygons;
      });

      // Remove the polygon from totalFeatures as well
      setTotalFeatures((prevFeatures) => {
        const updatedFeatures = prevFeatures.filter(
          (feature) => feature.featureId !== drawnPolygons[index].featureId
        );
        return updatedFeatures;
      });

      // Reset temporary polygon name
      setTempPolygonName('');

      // Optionally close the dropdown
      setIsDropdownOpen(false);

      // Notify the user about the removal
      // openNotification(
      //   'Polygon Removed',
      //   `The polygon with the ID "${drawnPolygons[index].featureId}" has been successfully removed.`,
      //   'success',
      //   true
      // );
    } catch (error) {
      console.error('Error removing polygon:', error);

      // Show error notification if something goes wrong
      openNotification(
        'Removal Error',
        'An error occurred while removing the polygon. Please try again.',
        'error',
        true
      );
    }
  };



  const handleDrawToolChange = (type, isRect = false) => {
    setIsDrawing(true);  // Start drawing
    setDrawType(type);   // Set the drawing type (Point, LineString, Polygon)
    setIsRectangle(isRect); // Indicate whether we are drawing a rectangle
  };

  const [activeIndex, setActiveIndex] = useState(null); // State to store active index

  const toggleOffCanvas = (index) => {
    // Toggle the active index. If clicked item is already active, set it to null (close it)
    if (activeIndex === index) {
      setActiveIndex(null);  // Close the active sidebar
    } else {
      setActiveIndex(index);  // Open the sidebar for the clicked item
    }
  };
  const ToggleCenterBoundBtn = (value) => {
    setCenterCoordinets(value);
  }


  useEffect(() => {
    console.log("IKKKKk ", activeIndex)
  }, [activeIndex])



  const geometryIconMap = {
    Point: sidebarIcon.GE_Point_128,
    LineString: sidebarIcon.GE_Line_128,
    Polygon: sidebarIcon.GE_Poly_128,
    Rectangle: sidebarIcon.GE_Boxpoly_128,

  };

  const sidebarItems = [
    { icon: sidebarIcon.GE_ArchiveSearch_128, tooltip: "Archive Search" },
    { icon: sidebarIcon.GE_TASKING_128, tooltip: "Tasking" },
    { icon: sidebarIcon.GE_Analytics_128, tooltip: "Analytics" },
    { icon: sidebarIcon.GE_AdvanceData_128, tooltip: "Advance Data" },
    { icon: sidebarIcon.GE_MyData_128, tooltip: "My Data" },
    { icon: sidebarIcon.GE_MyIndent_128, tooltip: "My Indent" },
    { icon: sidebarIcon.GE_MyOrder_128, tooltip: "My Order" },
    // { icon: sidebarIcon.dashboard_black, tooltip: "Dashboard" },
    { icon: sidebarIcon.GE_Dashboard_128, tooltip: "Dashboard" },
  ];

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  const data1 = [
    {
      id: 0,
      header: "SPOT",
      selected: 0,
      total: 3,
      items: [
        { name: "SPOT-1.5m-MONO", selected: 1 },
        { name: "SPOT-1.5m-STEREO", selected: 0 },
        { name: "SPOT-1.5m-TRISTEREO", selected: 0 }
      ]
    },
    {
      id: 1,
      header: "Pleiades-Neo (0.3m)",
      selected: 1,
      total: 3,
      items: [
        { name: "Pleiades-Neo-0.3m-MONO", selected: 1 },
        { name: "Pleiades-Neo-0.3m-STEREO", selected: 0 },
        { name: "Pleiades-Neo-0.3m-TRISTEREO", selected: 0 }
      ]
    },
    {
      id: 2,
      header: "Pleiades (0.5m)",
      selected: 1,
      total: 3,
      items: [
        { name: "Pleiades-0.5m-MONO", selected: 1 },
        { name: "Pleiades-0.5m-STEREO", selected: 0 },
        { name: "Pleiades-0.5m-TRISTEREO", selected: 0 }
      ]
    },
    {
      id: 3,
      header: "Terra SAR-X",
      selected: 0,
      total: 2,
      items: [
        { name: "Wide Scan SAR (WS)", selected: 0 },
        { name: "Scan SAR (SC)", selected: 0 }
      ]
    }
  ];



  useEffect(() => {
    // Set zoom level and modify zoom slider button text
    if (mapRef.current) {
      const mapInstance = mapRef.current.ol;
      if (mapInstance) {
        setZoomLevel(Math.round(mapInstance.getView().getZoom()));
        const button = document.querySelector(".ol-zoomslider button");
        if (button) {
          button.textContent = Math.round(mapInstance.getView().getZoom());
        }
      }
    }
  }, [mapRef.current, zoomLevel]);


  const styleDanger = () => {
    return new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2,

      }),

    })
  }
  const styleDanger1 = () => {
    return new Style({
      stroke: new Stroke({
        color: "gray",
        width: 3,
      }),

    })
  }

  // Onchage tasking polygonsm
  const activatePolygonLayer = (selectedFeatureId) => {
    try {
      const layers = mapRef.current.ol.getLayers().getArray();
      const drawingLayer = layers.find(layer => layer.get('name') === 'DrawingLayer');

      if (!drawingLayer) {
        // Notify if the DrawingLayer is not found
        openNotification(
          'Layer Error',
          'Drawing layer not found on the map.',
          'error',
          true
        );
        return;
      }

      const activeFeatures = drawingLayer.getSource().getFeatures();

      const activeResult = activeFeatures.find((activeItem) => activeItem.getId() === selectedFeatureId);

      // Set all features to the danger style
      activeFeatures.forEach((feature) => {
        feature.setStyle(styleDanger1);
      });

      if (activeResult) {
        // Set the selected feature to the active style
        activeResult.setStyle(styleDanger);

        // Adjust map view to fit the selected feature's extent
        const extent = activeResult.getGeometry().getExtent();
        mapRef.current.ol.getView().fit(extent, {
          duration: 1250,
          padding: [200, 50, 200, 800],
        });

        // Notify the user about the successful activation of the polygon
        // openNotification(
        //   'Polygon Activated',
        //   `Polygon with ID "${selectedFeatureId}" has been successfully activated.`,
        //   'success',
        //   true
        // );
      } else {
        // Notify if the selected feature is not found
        openNotification(
          'Feature Error',
          `Polygon with ID "${selectedFeatureId}" not found in the drawing layer.`,
          'error',
          true
        );
      }
    } catch (error) {
      console.error('Error activating polygon layer:', error);

      // Show error notification if something goes wrong
      openNotification(
        'Activation Error',
        'An error occurred while activating the polygon. Please try again.',
        'error',
        true
      );
    }
  };


  const handleDrawButtonClick = (type, defaultBuffer) => {
    setIsMenuVisible(false);

    let bufferValue = valueBuffer || defaultBuffer;

    if (vectorLayerRef.current && vectorLayerRef.current.context.map) {
      const map = vectorLayerRef.current.context.map;

      // Remove any existing draw interactions to prevent multiple active drawings
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof Draw) {
          map.removeInteraction(interaction);
        }
      });

      let draw;


      // Custom geometry function for rectangle
      const geometryFunction = (coords, geom) => {
        const start = coords[0];
        const end = coords[1];
        const coordinates = [
          [start[0], start[1]],
          [start[0], end[1]],
          [end[0], end[1]],
          [end[0], start[1]],
          [start[0], start[1]],
        ];
        if (!geom) {
          geom = new PolygonGeom([coordinates]);
        } else {
          geom.setCoordinates([coordinates]);
        }
        return geom;
      };

      // Set up the Draw interaction based on the type
      if (type === 'Rectangle') {
        draw = new Draw({
          source: vectorLayerRef.current.source,
          type: 'Circle',
          geometryFunction: geometryFunction,
        });
      } else {
        draw = new Draw({
          source: vectorLayerRef.current.source,
          type: type,
        });
      }

      // Handle 'drawstart' event
      draw.on('drawstart', (event) => {
        measureTooltipElement.current = document.createElement('div');
        measureTooltipElement.current.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip.current = new Overlay({
          element: measureTooltipElement.current,
          offset: [0, -15],
          positioning: 'bottom-center',
        });
        map.addOverlay(measureTooltip.current);
        measureTooltip.current.setPosition(event.coordinate);

        const geometry = event.feature.getGeometry();
        // const formatLength = function (line) {
        //   const length = getLength(line); // Length in meters
        //   let output;
        //   if (length > 100) {
        //     output = Math.round((length / 1000) * 100) / 100 + ' km';
        //   } else {
        //     output = Math.round(length * 100) / 100 + ' m';
        //   }
        //   return output;
        // };

        // Update the area in real-time as the user draws
        geometry.on('change', () => {
          const geomType = geometry.getType();
          let areaOrLength = null;


          if (geomType === 'Polygon') {
            const polygonCoordinates = geometry.getCoordinates();
            if (polygonCoordinates[0].length < 4) {
              return; // Skip if not enough points for a valid polygon
            }
            const polygonGeoJSON = turf.polygon(polygonCoordinates);
            const polygonArea = turf.area(polygonGeoJSON) / 1e6; // Convert to square kilometers
            areaOrLength = polygonArea.toFixed(2);

            // Update tooltip with the real-time area
            measureTooltipElement.current.innerHTML = `<div>${areaOrLength} km²</div>`;
            measureTooltip.current.setPosition(geometry.getLastCoordinate());
          }
          else if (geomType === 'LineString') {
            // console.log("geometry ", geometry);

            // Get the flat coordinates of the LineString
            const flatCoordinates = geometry.getFlatCoordinates();

            // Ensure the LineString has at least two points
            if (flatCoordinates.length < 4) {
              console.log('Not enough points to calculate distance.');
              openNotification(
                'LineString',
                'Not enough points to calculate distance.',
                'error',
                true
              );
              return; // Exit if not enough points
            }

            // Function to convert degrees to radians
            function toRadians(degrees) {
              return degrees * (Math.PI / 180);
            }

            // Haversine formula to calculate distance between two points
            function haversineDistance(lon1, lat1, lon2, lat2) {
              const R = 6371; // Radius of the Earth in kilometers
              const dLat = toRadians(lat2 - lat1);
              const dLon = toRadians(lon2 - lon1);

              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c; // Distance in kilometers
            }

            // Calculate the total length of the LineString
            let totalLength = 0;

            for (let i = 0; i < flatCoordinates.length - 2; i += 2) {
              const lon1 = flatCoordinates[i];
              const lat1 = flatCoordinates[i + 1];
              const lon2 = flatCoordinates[i + 2];
              const lat2 = flatCoordinates[i + 3];

              totalLength += haversineDistance(lon1, lat1, lon2, lat2) * 1000; // Convert to meters and add to total
            }

            // console.log(totalLength);

            let output;
            if (totalLength > 100) {
              output = Math.round((totalLength / 1000) * 100) / 100 + ' km';
            } else {
              output = Math.round(totalLength * 100) / 100 + ' m';
            }

            measureTooltipElement.current.innerHTML = `<div>${output}</div>`;
            measureTooltip.current.setPosition(geometry.getLastCoordinate());
          }
        });
      });

      // Handle 'drawend' event
      draw.on('drawend', (event) => {
        map.removeOverlay(measureTooltip.current);
        measureTooltipElement.current.style.display = 'none';

        const feature = event.feature;
        // console.log("feature ", feature)
        const transformedGeometry = feature.getGeometry();
        const geometryType = transformedGeometry.getType();
        let Coordinates = transformedGeometry.getCoordinates();

        const featureId = `${type} ${count + 1}`;
        setCount((prevCount) => prevCount + 1);


        feature.setId(featureId);
        setCoordinates(Coordinates);

        let areaOrLength = null;
        let bufferFeature = null;
        if (geometryType === 'Polygon') {
          setdrawgeometryType('Polygon');

          const polygonCoordinates = transformedGeometry.getCoordinates();
          // Ensure the polygon has at least 4 coordinates
          if (polygonCoordinates[0].length < 4) {
            console.error("Invalid polygon: needs at least 4 coordinates");
            openNotification(
              'Polygon',
              'Invalid polygon: needs at least 4 coordinates.',
              'error',
              true
            );
            return;
          }

          // Create a Turf.js polygon object
          const polygonGeoJSON = turf.polygon(polygonCoordinates);

          // Check for kinks (self-intersections)
          const polygonKinks = turf.kinks(polygonGeoJSON);
          // if (polygonKinks.features.length > 0) {
          //   console.error("Invalid LineString geometry due to self-intersections (kinks).");
          //   openNotification(
          //     'Invalid Polygon Geometry',
          //     'The polygon contains self-intersections (kinks) and is invalid. Please modify the geometry.',
          //     'warning',
          //     true
          //   );
          //   // Create a custom red style for the invalid LineString
          //   const invalidStyle = invalidGeometry;

          //   // Assign a custom property to the invalid feature (for identification later)
          //   feature.setProperties({ customProperty: 'invalid' });

          //   // Apply the red style to the invalid LineString
          //   feature.setStyle(invalidStyle);

          //   // Add the invalid feature to the map (optional, in case you want to show it before removal)
          //   vectorLayerRef.current.source.addFeature(feature);

          //   // Show a modal informing the user about the invalid LineString geometry
          //   ModalManager.success({
          //     modalHeaderHeading: 'Invalid Line Geometry Detected',
          //     message: 'The drawn line has self-intersections (kinks) and is invalid. It will be removed after you confirm.',
          //     confirmButtonText: 'OK',
          //     onConfirm: () => {
          //       // Find the specific invalid feature by custom property and remove it
          //       const features = vectorLayerRef.current.source.getFeatures();

          //       // Loop through features and remove the one with the 'invalid' custom property
          //       features.forEach((f) => {
          //         if (f.get('customProperty') === 'invalid') {
          //           vectorLayerRef.current.source.removeFeature(f);
          //         }
          //       });

          //       // Remove the draw interaction to end the drawing
          //       map.removeInteraction(draw);

          //       // Remove any overlays like tooltips
          //       if (measureTooltip.current) {
          //         map.removeOverlay(measureTooltip.current);
          //         measureTooltip.current = null;
          //       }

          //       // Reset the coordinate state as the layer is invalid
          //       setCoordinates(null);

          //       // Optionally, reset other state or perform further cleanup
          //     }
          //   });

          //   return; // Stop further processing if the LineString has kinks
          // }
          if (polygonKinks.features.length > 0) {
            console.error("Invalid LineString geometry due to self-intersections (kinks).");

            // Create a custom red style for the invalid LineString
            const invalidStyle = invalidGeometry;

            // Assign a custom property to the invalid feature (for identification later)
            feature.setProperties({ customProperty: 'invalid' });

            // Apply the red style to the invalid LineString
            feature.setStyle(invalidStyle);

            // Optionally add the invalid feature to the map
            vectorLayerRef.current.source.addFeature(feature);

            // Show a confirmation modal with only a "Yes" button
            openConfirmationModal(
              'Invalid Line Geometry Detected',
              'The drawn line has self-intersections (kinks) and is invalid. It will be removed after you confirm.',
              () => {
                // Action when user confirms
                const features = vectorLayerRef.current.source.getFeatures();

                // Loop through features and remove the one with the 'invalid' custom property
                features.forEach((f) => {
                  if (f.get('customProperty') === 'invalid') {
                    vectorLayerRef.current.source.removeFeature(f);
                  }
                });

                // Remove the draw interaction to end the drawing
                map.removeInteraction(draw);

                // Remove any overlays like tooltips
                if (measureTooltip.current) {
                  map.removeOverlay(measureTooltip.current);
                  measureTooltip.current = null;
                }

                // Reset the coordinate state as the layer is invalid
                setCoordinates(null);

                console.log('Invalid geometry removed and state reset.');
              }, {
              message: 'Item Deleted',
              description: 'The item has been successfully deleted.',
              placement: 'bottom',
              duration: 2,
              showProgress: true,
              pauseOnHover: true,
            }
            );

            // Stop further processing if the LineString has kinks
            return;
          }



          const polygonArea = turf.area(polygonGeoJSON) / 1e6
          areaOrLength = polygonArea.toFixed(2);

          map.getView().fit(feature.getGeometry().getExtent(), {
            duration: 1250,
            padding: [200, 200, 200, 200],
          });
          // console.log("feature ", feature)

          setDrawnPolygons((prevFeatures) => [
            ...prevFeatures,
            { feature, areaOrLength, featureId },  // Use the original feature
          ]);
        }
        else if (geometryType === 'LineString') {
          if (bufferValue > 0) {
            setdrawgeometryType("Polygon");
            const lineGeoJSON = turf.lineString(transformedGeometry.getCoordinates());
            // Check if the line has invalid geometry (e.g., self-intersections)
            const lineKinks = turf.kinks(lineGeoJSON);  // Use turf.kinks for invalid geometry check
            if (lineKinks.features.length > 0) {
              console.error("Invalid LineString geometry due to self-intersections (kinks).");

              // Create a custom red style for the invalid LineString
              const invalidStyle = invalidGeometry;

              // Assign a custom property to the invalid feature (for identification later)
              feature.setProperties({ customProperty: 'invalid' });

              // Apply the red style to the invalid LineString
              feature.setStyle(invalidStyle);

              // Optionally add the invalid feature to the map
              vectorLayerRef.current.source.addFeature(feature);

              // Show a confirmation modal using openConfirmationModal
              openConfirmationModal(
                'Invalid Line Geometry Detected',
                'The drawn line has self-intersections (kinks) and is invalid. It will be removed after you confirm.',
                () => {
                  // Action when user confirms
                  const features = vectorLayerRef.current.source.getFeatures();

                  // Loop through features and remove the one with the 'invalid' custom property
                  features.forEach((f) => {
                    if (f.get('customProperty') === 'invalid') {
                      vectorLayerRef.current.source.removeFeature(f);
                    }
                  });

                  // Remove the draw interaction to end the drawing
                  map.removeInteraction(draw);

                  // Remove any overlays like tooltips
                  if (measureTooltip.current) {
                    map.removeOverlay(measureTooltip.current);
                    measureTooltip.current = null;
                  }

                  // Reset the coordinate state as the layer is invalid
                  setCoordinates(null);

                  console.log('Invalid geometry removed and state reset.');
                },
                {
                  message: 'Invalid Geometry Removed',
                  description: 'The self-intersecting line has been successfully removed.',
                  placement: 'topRight',
                  duration: 3,
                  showProgress: true,
                  pauseOnHover: true,
                }
              );

              // Stop further processing if the LineString has kinks
              return;
            }

            const bufferedLine = turf.buffer(lineGeoJSON, bufferValue / 2, { units: 'kilometers' });
            const coords = bufferedLine.geometry.coordinates[0];
            Coordinates = bufferedLine.geometry.coordinates;
            setCoordinates(Coordinates);

            // Create the buffer feature for LineString
            bufferFeature = new Feature(new PolygonGeom([coords]));
            bufferFeature.setId(featureId);  // Set the feature ID for bufferFeature
            vectorLayerRef.current.source.addFeature(bufferFeature);

            const bufferArea = turf.area(bufferedLine) / 1e6;
            areaOrLength = bufferArea.toFixed(2);
            map.getView().fit(bufferFeature.getGeometry().getExtent(), {
              duration: 1250,
              padding: [200, 200, 200, 200],
            });
            setDrawnPolygons((prevFeatures) => [
              ...prevFeatures,
              { feature: bufferFeature, areaOrLength, featureId },  // Use bufferFeature
            ]);
          } else {
            areaOrLength = (transformedGeometry.getLength() / 1000).toFixed(2);
          }
        } else if (geometryType === 'Point') {
          if (bufferValue > 0) {
            setdrawgeometryType('Polygon');

            const pointGeoJSON = turf.point(transformedGeometry.getCoordinates());
            const bufferedBBox = turf.bbox(turf.buffer(pointGeoJSON, bufferValue / 2, { units: 'kilometers' }));
            const bboxPolygon = turf.bboxPolygon(bufferedBBox);
            // console.log("bboxPolygon ", bboxPolygon)

            const coords = bboxPolygon.geometry.coordinates[0];
            Coordinates = bboxPolygon.geometry.coordinates;
            setCoordinates(Coordinates);

            // Create the buffer feature for Point
            bufferFeature = new Feature(new PolygonGeom([coords]));
            bufferFeature.setStyle(new Style({
              fill: new Fill({
                color: 'rgba(255, 0, 0, 0.2)',
              }),
              stroke: new Stroke({
                color: 'red',
                width: 2,
              }),
            }));
            bufferFeature.setId(featureId);  // Set the feature ID for bufferFeature
            vectorLayerRef.current.source.addFeature(bufferFeature);
            const bufferArea = turf.area(bboxPolygon) / 1e6;
            areaOrLength = bufferArea.toFixed(2);
            map.getView().fit(bufferFeature.getGeometry().getExtent(), {
              duration: 1250,
              padding: [200, 200, 200, 200],
            });
            setDrawnPolygons((prevFeatures) => [
              ...prevFeatures,
              { feature: bufferFeature, areaOrLength, featureId },  // Use bufferFeature
            ]);
          }
        }

        // Remove the draw interaction after the drawing is completed
        map.removeInteraction(draw);
      });


      // Add the draw interaction to the map
      map.addInteraction(draw);
    } else {
      console.error('vectorLayerRef is not initialized yet.');
      openNotification(
        'vectorLayer Not Found',
        'vectorLayerRef is not initialized yet.',
        'error',
        true
      );
    }
  };



  const [quickLook, setQuickLook] = useState([]);
  const handlequickLook = (data) => {
    // console.log(" 🔆", data)
    setQuickLook(data);
  }
  const origin = [79.0082, 21.1458]; // Define your origin coordinates

  // Function to set map view to the origin
  const setMapViewToOrigin = () => {
    if (mapRef.current && mapRef.current.ol) {
      const map = mapRef.current.ol;
      const view = map.getView();

      // Set the map view to the origin coordinates with an appropriate zoom level
      view.animate({
        center: origin,
        zoom: 5, // Adjust the zoom level as needed
        duration: 1000, // Animation duration in milliseconds
      });

      console.log("Map view set to origin:", origin);
    } else {
      console.error("mapRef is not initialized yet.");
    }
  };

  const handleClearAll = () => {
    try {
      if (vectorLayerRef.current && vectorLayerRef.current.context.map) {
        const map = vectorLayerRef.current.context.map;

        // Remove any existing draw interactions to prevent multiple active drawings
        map.getInteractions().forEach((interaction) => {
          if (interaction instanceof Draw) {
            map.removeInteraction(interaction);
          }
        });
      } else {
        console.error("vectorLayerRef is not initialized yet.");
        openNotification(
          "Initialization Error",
          "The map reference is not initialized yet. Please try again later.",
          "error",
          true
        );
        return;
      }

      // Define the array of layer names to clear
      const layerNamesToClear = [
        "DrawingLayer",
        "SearchResultsLayer",
        "SearchResultsHoverLayer"
      ];

      // Remove layers dynamically added by the user based on quickLook
      const map = searchLayerRef.current.context.map;
      map.getLayers().getArray().forEach((layer) => {
        if (layer instanceof TileLayer && quickLook.includes(layer.get("name"))) {
          map.removeLayer(layer);
        }
      });

      // Get all layers in the map
      const layers = mapRef.current.ol.getLayers().getArray();

      // Clear specified layers and handle errors
      layers.forEach((layer) => {
        const layerName = layer.get("name");

        if (layerNamesToClear.includes(layerName)) {
          layer.getSource().clear(); // Clear the source of the layer
        } else if (quickLook.includes(layerName)) {
          map.removeLayer(layer);
        } else {
          console.error(`Layer '${layerName}' not found for clearing.`);
          openNotification(
            "Layer Not Found",
            `The layer '${layerName}' was not found for clearing.`,
            "warning",
            true
          );
        }
      });

      // Clear all overlays (if any)
      const overlays = mapRef.current.ol.getOverlays().getArray();
      overlays.forEach((overlay) => {
        mapRef.current.ol.removeOverlay(overlay);
        console.log("Overlay removed.");
      });

      // Reset state (optional)
      setActiveIndex(null);
      setIsModalOpen(false);
      setCount(0);
      setActivePolygon("");
      setEditingPolygonIndex(null);
      setTempPolygonName("");
      setDrawnPolygons([]);
      setSearchData([]);
      setTotalFeatures([]);
      setSearchResult(0);
      setReceivedData([]);
      setMapViewToOrigin();

      openNotification(
        "Map Reset",
        "The map and related states have been reset successfully.",
        "success",
        true
      );
    } catch (error) {
      console.error("Error in handleClearAll:", error);
      openNotification(
        "Unexpected Error",
        `An error occurred while clearing the map: ${error.message}`,
        "error",
        true
      );
    }
  };




  const isValidSearch = searchCriteria.geometry !== undefined;

  const { data, isLoading, isError, error } = useDatawithpost('providers/airbus/searches', searchCriteria, ['Search_result_list', searchCriteria], isValidSearch);


  // Message to show when geometry is missing
  const missingGeometryMessage = searchCriteria.geometry === undefined ? (
    <p>Please draw the first AOI (Area of Interest) before searching.</p>
  ) : null;

  const [loadingMore, setLoadingMore] = useState(false);
  const [isMoreGet, setisMoreGet] = useState(false);
  const handleClickMore = async () => {
    setLoadingMore(true); // Start loading
    try {
      const data = await onClickMore(searchCriteria, page, token);

      if (data.message === "No More Images!") {
        setisMoreGet(true);
        console.log(data.message);
        openNotification("Search data", data.message, "warning", true);
      } else {
        setSearchData((prevState) => [...prevState, ...data.features]); // Append new search results to the existing state
        // Update the total result count by accumulating the length of new features
        setTotalResult((prevTotal) => prevTotal + data.features.length);

        setPage((prevPage) => prevPage + 1); // Increment page state
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoadingMore(false); // Stop loading
    }
  };



  const [airbusToken, setairbusToken] = useState(null);

  useEffect(() => {
    if (data) {
      setairbusToken(data.airbus_token)
      setSearchData(data.features);
      setTotalResult(data.features.length);
    }
  }, [data]);


  // console.log("receivedData ", receivedData)
  const handleImportDataGetFormChild = (importDataGeometry) => {
    if (importDataGeometry) {
      setReceivedData(importDataGeometry);
    }
  };


  const handleAcceptImportData = () => {
    setisimportFile(!isimportFile)

    const layers = mapRef.current.ol.getLayers().getArray();

    // Filter only layers that have a valid 'name' property and include 'DrawingLayer'
    const drawingLayers = layers.filter(layer => {
      const layerName = layer.get('name');
      return layerName && layerName.includes('DrawingLayer');
    });

    if (drawingLayers.length === 0) {
      console.error('No DrawingLayers found');
      return;
    }

    receivedData.forEach((data, dataIndex) => {
      // Validate data structure
      if (!data.geometry || !data.geometry.features) {
        console.error(`Data at index ${dataIndex} does not have valid geometry.features.`);
        return; // Skip this iteration
      }

      const features = data.geometry.features;
      console.log(`Data at index ${dataIndex} has ${features.length} features.`);
      const featureId = data.name;

      features.forEach((feature, index) => {
        const featureType = feature.geometry.type;
        console.log(`Feature ${index} type: ${featureType}`);
        const uniqueFeatureId = `${featureId}-${dataIndex + 1}-${index + 1}`; // Ensure unique featureId with data index

        if (featureType === 'Polygon') {
          const polygonCoordinates = feature.geometry.coordinates;
          const polygonGeoJSON = turf.polygon(polygonCoordinates);
          const polygonKinks = turf.kinks(polygonGeoJSON);

          if (polygonKinks.features.length > 0) {
            console.error('Invalid polygon geometry due to self-intersections (kinks).');
            return; // Skip this feature
          }

          const polygonArea = turf.area(polygonGeoJSON) / 1e6; // Convert to square kilometers
          const areaOrLength = polygonArea.toFixed(2);

          const validFeature = new Feature({
            geometry: new Polygon(polygonCoordinates),
          });

          validFeature.setId(uniqueFeatureId);
          validFeature.setGeometryName("geometry");
          validFeature.setStyle(new Style({
            stroke: new Stroke({ color: 'blue', width: 3 }),
            fill: new Fill({ color: 'rgba(0, 0, 0, 0.1)' }),
          }));

          // Add to the vector source of the last layer
          const lastLayer = drawingLayers[drawingLayers.length - 1];
          const vectorSource = lastLayer.getSource();
          vectorSource.addFeature(validFeature);

          setDrawnPolygons(prevFeatures => [
            ...prevFeatures,
            { feature: validFeature, areaOrLength, featureId: uniqueFeatureId },
          ]);
          console.log(`Processing Polygon: ${uniqueFeatureId}`);

        } else if (featureType === 'LineString') {
          const lineCoordinates = feature.geometry.coordinates;
          const lineGeoJSON = turf.lineString(lineCoordinates);
          const bufferedLine = turf.buffer(lineGeoJSON, 5, { units: 'kilometers' });
          const coords = bufferedLine.geometry.coordinates[0];
          const bufferedArea = turf.area(bufferedLine) / 1e6; // Convert to square kilometers
          const areaOrLength = bufferedArea.toFixed(2);

          const validFeature = new Feature({
            geometry: new Polygon([coords]),
          });

          validFeature.setId(uniqueFeatureId);
          validFeature.setGeometryName("geometry");
          validFeature.setStyle(new Style({
            stroke: new Stroke({ color: 'green', width: 2 }),
            fill: new Fill({ color: 'rgba(0, 255, 0, 0.1)' }),
          }));

          const lastLayer = drawingLayers[drawingLayers.length - 1];
          const vectorSource = lastLayer.getSource();
          vectorSource.addFeature(validFeature);

          setDrawnPolygons(prevFeatures => [
            ...prevFeatures,
            { feature: validFeature, areaOrLength, featureId: uniqueFeatureId },
          ]);
          console.log(`Processing LineString: ${uniqueFeatureId}`);

        } else if (featureType === 'Point') {
          const pointCoordinates = feature.geometry.coordinates;
          const pointGeoJSON = turf.point(pointCoordinates);
          const bufferedBBox = turf.bbox(turf.buffer(pointGeoJSON, 2.25, { units: 'kilometers' }));
          const bboxPolygon = turf.bboxPolygon(bufferedBBox);
          const coords = bboxPolygon.geometry.coordinates[0];
          const bufferedArea = turf.area(bboxPolygon) / 1e6; // Convert to square kilometers
          const areaOrLength = bufferedArea.toFixed(2);

          const validFeature = new Feature({
            geometry: new Polygon([coords]),
          });

          validFeature.setId(uniqueFeatureId);
          validFeature.setGeometryName("geometry");
          validFeature.setStyle(new Style({
            stroke: new Stroke({ color: 'red', width: 2 }),
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.1)' }),
          }));

          const lastLayer = drawingLayers[drawingLayers.length - 1];
          const vectorSource = lastLayer.getSource();
          vectorSource.addFeature(validFeature);

          setDrawnPolygons(prevFeatures => [
            ...prevFeatures,
            { feature: validFeature, areaOrLength, featureId: uniqueFeatureId },
          ]);
          console.log(`Processing Point: ${uniqueFeatureId}`);
        } else {
          console.warn(`Unknown feature type: ${featureType}`);
        }
      });
    });
  };


  // Function to handle save and receive selected values

  // Function to handle save and receive selected values
  const handleSave = (selectedItems) => {
    setSelectedValues(selectedItems);
    console.log('Selected Items:', selectedItems);

    // Handle the selected values based on length of selectedItems
    let constellationValue = "";

    if (selectedItems.length >= 3) {
      constellationValue = ""; // If 3 or more items, set to an empty string
    } else if (selectedItems.length === 1) {
      constellationValue = selectedItems[0]; // If only 1 item, use its value
    }
    setSelectedConstillation(constellationValue)
    // Update searchCriteria with the new constellation value
    // setSearchCriteria((prevCriteria) => ({
    //   ...prevCriteria,
    //   constellation: constellationValue,
    // }));


  };

  // console.log("drawnPolygons ", drawnPolygons)

  const generateKMLContent = (polygons) => {
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>`;

    polygons.forEach((polygon, index) => {
      const coordinates = polygon.feature.getGeometry().getCoordinates();
      const geometryType = polygon.feature.getGeometry().getType();

      if (geometryType === 'Polygon') {
        kmlContent += `
          <Placemark>
            <name>Polygon ${index + 1}</name>
            <Polygon>
              <outerBoundaryIs>
                <LinearRing>
                  <coordinates>
                    ${coordinates[0]
            .map((coord) => `${coord[0]},${coord[1]},0`)
            .join(' ')}
                  </coordinates>
                </LinearRing>
              </outerBoundaryIs>
            </Polygon>
          </Placemark>`;
      }
    });

    kmlContent += `</Document></kml>`;
    return kmlContent;
  };

  // Function to handle KML generation and download
  const handleKMLDownload = () => {
    setIsModalOpen(false);
    if (drawnPolygons.length === 0) {
      console.log('No polygons to export.');
      return;
    }

    // Generate KML content
    const kmlContent = generateKMLContent(drawnPolygons);

    // Create a Blob from the KML string
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);

    // Get the current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format the filename with the current date and time
    const filename = `export-aoi-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.kml`;

    // Create a download link and click it programmatically
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Set the dynamic filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL after download
    URL.revokeObjectURL(url);
  };



  const handleCriteriaSubmit = (data) => {
    // console.log("data ", data)
    // You can process these values further as needed
    if (data) {
      setcriteriaData(data);
    }
  };

  const [location, setLocation] = useState(''); // State to track search input
  const [suggestions, setSuggestions] = useState([]); // Store location suggestions
  const [SearchCrossIcon, setSearchCrossIcon] = useState(false);

  // Function to fetch suggestions while typing
  const fetchSuggestions = async (query) => {
    const apiKey = '119c230f8d9b4cdfb0a5572657f6c0db'; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.results); // Store suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    // Show the search cross icon only when the input value is greater than 0
    if (value.length > 0) {
      setSearchCrossIcon(true);
    } else {
      setSearchCrossIcon(false);
    }

    // Fetch suggestions if the input value is longer than 2 characters
    if (value.length > 2) {
      fetchSuggestions(value); // Fetch suggestions when input length > 2
    } else {
      setSuggestions([]); // Clear suggestions when input is too short
    }
  };

  // Function to clear the input value
  const clearInput = () => {
    setLocation(""); // Clear the location input
    setSearchCrossIcon(false); // Hide the search cross icon
    setSuggestions([]); // Optionally clear suggestions when the input is cleared
  };


  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.formatted); // Set location to the selected suggestion's formatted address
    const { lng, lat } = suggestion.geometry;

    if (vectorLayerRef.current && vectorLayerRef.current.context && vectorLayerRef.current.context.map) {
      const map = vectorLayerRef.current.context.map;
      if (map.getView) {
        map.getView().setCenter([lng, lat]);  // Adjust map center
        map.getView().setZoom(10); // Optional: Adjust zoom level
      } else {
        console.error("map.getView() is undefined");
      }
    } else {
      console.error("Map reference in vectorLayerRef is not defined.");
    }

    setSuggestions([]); // Clear suggestions after selecting
  };






  return (
    <>

      <div className='main_container'>
        <div className=" bg-slate-100 sidebar sm:w-[5%]  lg:w-[5%] xl:w-[4%] 2xl:w-[3%] flex justify-center py-2.5 shadow-2xl">
          <ul>
            {sidebarItems.map((item, index) => (
              <>
                <li className={`sidebar-item ${activeIndex === index ? "bg-[#1088ff]" : ""}   ${index === 4 ? 'with-line' : ''}`}>
                  <img
                    src={item.icon}
                    alt={item.tooltip}
                    className="sidebar-icon"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title={item.tooltip}
                    onClick={() => toggleOffCanvas(index)}
                  />
                </li>
                {index === 3 && <hr className="horizontal-line-icon" />}
                {index === 6 && <hr className="horizontal-line-icon" />}
              </>
            ))}
          </ul>
        </div>

        {activeIndex === 0 &&
          <SearchResult
            isOpen={activeIndex === 0}
            toggleOffCanvas={toggleOffCanvas}
            totalFeatures={totalFeatures}
            vectorLayerRef={vectorLayerRef}
            searchLayerRef={searchLayerRef}
            searchLayerHoverRef={searchLayerHoverRef}
            mapRef={mapRef}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchData={searchData}
            totalResult={totalResult}
            handleClickMore={handleClickMore}
            missingGeometryMessage={missingGeometryMessage}
            searchCriteria={searchCriteria}
            headingTitle="Title"
            airbusToken={airbusToken}
            onsetquickLoop={handlequickLook}
            loadingMore={loadingMore}
            isMoreGet={isMoreGet}
          />
        }

        {activeIndex === 1 &&
          <Search
            isOpen={activeIndex === 1}
            closeIcon={activeIndex === 1}
            toggleOffCanvas={toggleOffCanvas}
            totalFeatures={drawnPolygons}
            vectorLayerRef={vectorLayerRef}
            activatePolygonLayer={activatePolygonLayer}
          />

        }

        {activeIndex === 6 &&
          <Orders
            closeIcon={activeIndex === 6}
            toggleOffCanvas={toggleOffCanvas}
            searchLayerHoverRef={searchLayerHoverRef}
            mapRef={mapRef}

          />
        }


        <div className={`map_section relative ${showLeftdrop ? " Third-section " : " w-full"}  `}>
          <SearchMap
            isDrawing={isDrawing} drawType={drawType} isRectangle={isRectangle} setIsDrawing={setIsDrawing}
            setTotalFeatures={setTotalFeatures}
            id={id}
            SearchResult={SearchResult}
            vectorLayerRef={vectorLayerRef}
            searchLayerRef={searchLayerRef}
            searchLayerHoverRef={searchLayerHoverRef}
            mapRef={mapRef}
            setZoomLevel={setZoomLevel}
            // totalFeatures={totalFeatures}
            drawnPolygons={drawnPolygons}
            featureAreaOrLength={featureAreaOrLength}
            selectedPolygonId={selectedPolygonId}
            onSubmit={finishModify} // Pass the function as a prop
            onSubmitCancel={openModalModify}
            setDrawnPolygons={setDrawnPolygons}
            onPolygonSourceChange={handlePolygonSourceUpdate}
            selectedPolygon={selectedPolygon}
            selectedPolygonSource1={selectedPolygonSource1}
            finishModify={finishModify}
          />
          {/* <div ref={mapRef} style={{ width: '100%', height: '100%' }} /> */}
          <div className='Filter_section '>

            <div className='relative w-full'>

              <div class=" flex justify-between items-center  space-x-4  xl:space-x-14">
                {/* <!-- Left Section (Buttons) --> */}

                <div className="flex ">
                  <span className="text-xs  text-center bg-blue-800 text-[#FF9000] cursor-pointer " style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                    FILTER
                  </span>
                  <div className="flex py-1 px-1 bg-white">
                    <div className="flex space-x-2  ">
                      <button
                        onClick={handleProduct}
                        className="bg-blue-900 text-white flex items-center space-x-1 py-[2px] px-2 rounded-sm">
                        <img src={sidebarIcon.GE_Product_W_128} className="w-4 h-4" alt="Product Icon" />
                        <span className='capitalize pr-4'>Product</span>
                      </button>
                      <button
                        onClick={handleCriteria}
                        className="bg-blue-900 text-white flex items-center space-x-2 py-[2px] px-2 rounded-sm">
                        <img src={sidebarIcon.GE_Criteria_W_128} className="w-4 h-4" alt="Criteria Icon" />
                        <span className='capitalize pr-4'>Criteria</span>
                      </button>
                    </div>
                  </div>

                  {/* Productmenu drop down  */}

                  {productmenu &&
                    <Productmenu
                      initialData={data1}
                      setProductmenu={setProductmenu}
                      onSave={handleSave}
                    />
                  }


                  {/* Criteria drop down  */}

                  {
                    criteriamenu &&
                    <Criteriamenu
                      setCriteriamenu={setCriteriamenu}
                      criteriamenu={criteriamenu}
                      onSubmit={handleCriteriaSubmit}
                    />
                  }


                </div>

                {/* <!-- Group 2 --> */}

                <div className='flex '>
                  <span className="text-xs  text-center bg-blue-800 cursor-pointer text-[#FF9000]" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                    AOI
                  </span>
                  <div className="relative"> {/* Parent div with relative positioning */}
                    {/* Buttons Section */}
                    <div className="flex space-x-2 bg-white py-1 px-1">
                      <button
                        className="bg-blue-900 text-white flex items-center space-x-2  py-[2px]   px-2 rounded-sm"
                        onClick={handleDrawLayer}
                      >
                        <img src={sidebarIcon.GE_DRAW_128} className="w-4 h-4" alt="Icon" />
                        <span className='capitalize pr-4'>Draw</span>
                      </button>
                      {/* <button
                        onClick={openModalModify}
                        className="bg-blue-900 text-white flex items-center space-x-1 py-[2px]  px-2 rounded-sm">
                        <img src={sidebarIcon.GE_Modify1_W_128} className="w-4 h-4" alt="Icon" />
                        <span className='capitalize pr-4'>Modify</span>
                      </button> */}
                      <button
                        onClick={openModalModify}
                        disabled={drawnPolygons.length === 0}  // Disable the button based on the condition
                        className={`bg-blue-900 text-white flex items-center space-x-1 py-[2px] px-2 rounded-sm ${drawnPolygons.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <img src={sidebarIcon.GE_Modify1_W_128} className="w-4 h-4" alt="Icon" />
                        <span className="capitalize pr-4">Modify</span>
                      </button>

                      <button
                        onClick={handleImportData}
                        className="bg-blue-900 text-white flex items-center space-x-1 py-[2px] px-2 rounded-sm">
                        <img src={sidebarIcon.GE_Import_W_128} className="w-4 h-4" alt="Icon" />
                        <span className='capitalize pr-4'>Import</span>
                      </button>
                    </div>

                    {isModify &&
                      <LayerModify
                        drawnPolygons={drawnPolygons}
                        activePolygonFeature={activeFeatureIdForModfiye}
                        currentActiveLayer={currentActiveLayer}
                        onPolygonSelect={handlePolygonSelect}
                        isModify={isModify}
                        finishModify={finishModify}
                        openModalModify={modifycancel}
                      />
                    }

                    {
                      isimportFile &&
                      <ImportData
                        onhandleImportDataGetFormChild={handleImportDataGetFormChild}
                        onhandleAcceptImportData={handleAcceptImportData}
                        onhandleImportData={handleImportData}
                      />
                    }

                    {/* Conditionally Draw Render the Menu */}
                    {isMenuVisible && (
                      <div className="absolute  w-48 border  rounded-sm bg-white shadow-lg">
                        <div className='relative'>
                          <ul className="divide-y  pl-0 ">
                            <li
                              className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center">
                                <img src={sidebarIcon.GE_Point_128} alt={sidebarIcon.GE_Point_128} className="w-5 h-5 mr-2" />
                                <span onClick={() => handleDrawButtonClick('Point', 2.25)} className="text-sm font-semibold">Point</span>
                              </div>
                              {/* <span className="text-gray-800">&gt;</span> */}
                              <span onClick={() => handleShowBufferUI('Point')} className="text-gray-800 text-[8px] bg-aliceblue p-[2px_5px] border border-solid">
                                {currentTool === "Point" && isBufferVisible ? (
                                  <FontAwesomeIcon icon={faChevronLeft} />
                                ) : (
                                  <FontAwesomeIcon icon={faChevronRight} />
                                )}
                              </span>

                            </li>
                            <li
                              // onClick={() => handleDrawToolChange("LineString")} 
                              className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-100">

                              <div className="flex items-center">
                                <img src={sidebarIcon.GE_Line_128} alt={sidebarIcon.GE_Line_128} className="w-5 h-5 mr-2" />

                                <span
                                  onClick={() => handleDrawButtonClick('LineString', 5)}
                                  className="text-sm font-semibold cursor-pointer ">Polyline</span>
                              </div>
                              <span onClick={() => handleShowBufferUI('Line')} className="text-gray-800 text-[8px] bg-aliceblue p-[2px_5px] border border-solid">
                                {currentTool === "Line" && isBufferVisible ? (
                                  <FontAwesomeIcon icon={faChevronLeft} />
                                ) : (
                                  <FontAwesomeIcon icon={faChevronRight} />
                                )}
                              </span>
                            </li>
                            <li className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center">
                                <img src={sidebarIcon.GE_Boxpoly_128} alt={sidebarIcon.GE_Boxpoly_128} className="w-5 h-5 mr-2" />
                                <span
                                  onClick={() => handleDrawButtonClick('Rectangle')}
                                  className="text-sm font-semibold">Box/Rectangle</span>
                              </div>
                              {/* <span className="text-gray-800">&gt;</span> */}
                            </li>
                            <li onClick={() => handleDrawToolChange("Polygon")} className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center">
                                <img src={sidebarIcon.GE_Poly_128} alt={sidebarIcon.GE_Poly_128} className="w-5 h-5 mr-2" />
                                <span
                                  onClick={() => handleDrawButtonClick('Polygon')}
                                  className="text-sm font-semibold">Polygon</span>
                              </div>
                              {/* <span className="text-gray-800">&gt;</span> */}
                            </li>
                            {isCoordinate &&
                              <li
                                onClick={() => setisCoordinate(false)}
                                className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                  <img src={sidebarIcon.GE_Coordinates_128} alt={sidebarIcon.GE_Coordinates_128} className="w-5 h-5 mr-2" />
                                  <span className="text-sm font-semibold">Coordinates</span>
                                </div>
                              </li>
                            }
                          </ul>

                          {/* Buffer Distance UI - Conditionally Render */}
                          {isBufferVisible && currentTool && (
                            <BufferComponent
                              toolType={currentTool} // Pass the selected tool type
                              onBufferChange={handleBufferChange}
                              setIsBufferVisible={setIsBufferVisible}
                            // Pass the handler for buffer changes
                            />
                          )}

                          {
                            isCoordinate &&
                            <Coordinatemenu
                              isCoordinate={isCoordinate}
                              setisCoordinate={setisCoordinate}
                              CenterCoordinets={CenterCoordinets}
                              ToggleCenterBoundBtn={ToggleCenterBoundBtn}
                            />
                          }


                        </div>

                        <div onClick={handleClearAll} className="px-4 py-1 bg-blue-500 text-white text-center cursor-pointer hover:bg-blue-600">
                          Clear All
                        </div>

                      </div>
                    )}
                  </div>

                </div>

                {/* <!-- Right Section (Search Bar) --> */}

                <div className='flex'>
                  <span className="text-xs  text-center bg-blue-800 text-[#FF9000] cursor-pointer" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                    Z T L
                  </span>
                  {/* <div className="flex items-center space-x-2 bg-white px-2 py-1">
                    <input
                      type="text"
                      placeholder="Type Location Name"
                      className="border border-gray-300 rounded-md pl-2 py-[2px] pr-6 outline-none"
                      value={location} // Bind input value to state
                      onChange={(e) => setLocation(e.target.value)} // Update state on input change
                    />
                    <button
                      className="bg-gray-300 p-1.5 px-3 rounded-md"
                      onClick={handleSearch} // Trigger search on button click
                    >
                      <img src="path/to/search-icon.svg" className="w-4 h-4" alt="Search" />
                    </button>
                  </div> */}
                  <div>
                    <div className="flex items-center space-x-2 bg-white px-2 py-1">
                      <input
                        type="text"
                        placeholder="Type Location Name"
                        className="border border-gray-300 rounded-md pl-2 py-[2px] pr-6 outline-none"
                        value={location} // Bind input value to state
                        onChange={handleInputChange} // Update state on input change
                      />
                      {SearchCrossIcon &&
                        <div className="absolute right-4 z-10 hover:bg-gray-100 p-1 py-0 rounded-md">
                          <FontAwesomeIcon
                            icon={faXmark}
                            onClick={clearInput}
                          />
                        </div>
                      }
                    </div>
                    {suggestions.length > 0 && (
                      <ul className="absolute mt-0 pl-0 border border-gray-300  max-h-60 overflow-auto bg-white shadow-lg w-[27%] z-10">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.formatted}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* {suggestions.length > 0 && (
                      <ul className="mt-2 border border-gray-300 rounded-md max-h-60 overflow-auto">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.formatted}
                          </li>
                        ))}
                      </ul>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div class="GEMapRightSection" style={{ pointerEvents: 'auto' }}>
            <div className='GEMapRightSectionIcon'><GEAoiLayers /></div>
            <div className='GEMapRightSectionIcon'><GE_ShopBasket_128 /></div>
          </div> */}
          <div className="GEMapRightSection" style={{ pointerEvents: 'auto' }}>
            {/* GEAoiLayers Button */}
            <div className="relative">
              {/* <div className="GEMapRightSectionIcon" onClick={openModalAoiManager}>
                <img src={GEAoiLayers} alt="AOI Layers Icon" />
              </div> */}
              <div
                className={`GEMapRightSectionIcon ${drawnPolygons.length === 0 ? 'disabled' : ''}`}
              >
                <button
                  onClick={openModalAoiManager}
                  disabled={drawnPolygons.length === 0}
                  className={`${drawnPolygons.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <img src={GEAoiLayers} alt="AOI Layers Icon" />
                </button>
              </div>

              {isModalOpen && (
                <div className="absolute right-full top-0 w-[23rem] p-1 bg-white border border-gray-200 shadow-lg">
                  <div className="flex items-center">
                    {/* Icon */}
                    <div className="m-1 cursor-pointer" onClick={handleKMLDownload} title='AOI(S) Export'>
                      <img src={sidebarIcon.GE_Export_B_128} width={20} height={20} />
                    </div>
                    <div className='h-5 border-l-2 mr-1'></div>
                    {/* Active Polygon Text */}
                    <p className="text-sm mb-0 mr-1 font-medium text-gray-700">
                      Active Polygon:
                    </p>

                    {/* Input for Polygon Name */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Name"
                        // value={drawnPolygons[editingPolygonIndex] || ''}
                        value={tempPolygonName}
                        onChange={handleNameChange} // Change active input value only
                        onClick={handleInputClick} // Handle input click to start editing
                        className="w-30 text-sm border border-gray-300 pr-10 h-[30px]" // Add padding for the button
                      />
                      {/* OK Button */}
                      {isEditingName && (
                        <button
                          type="button"
                          onClick={confirmNameChange}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 rounded focus:outline-none"
                        >
                          OK
                        </button>
                      )}
                      {/* Dropdown Arrow */}
                      {!isEditingName && (
                        <button
                          type="button"
                          onClick={toggleDropdown}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent focus:outline-none py-[7px] px-[10px]"
                        >
                          <img width={15} height={15} src={sidebarIcon.dropdown_64} />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* {isDropdownOpen && (
                    <div className="absolute right-6 z-4 w-[12.7rem] bg-white border border-gray-200 shadow-lg" style={{ maxHeight: '25vh', overflowY: 'auto' }}>
                      <ul className=" w-full list-none p-0 mb-0">
                        {drawnPolygons
                          .filter((polygon) => polygon.featureId) // Filter out polygons without a featureId
                          .map((polygon, index) => {
                            // Extract the geometry type from the featureId
                            // const geometryType = polygon.featureId.split(' ')[0]; // Get the type from featureId
                            const geometryType = polygon.feature.getGeometry().getType();
                            const icon = geometryIconMap[geometryType] || '🔹'; // Default icon if type is not found

                            return (
                              <li key={index} className="flex justify-between items-center text-sm text-gray-600 px-2 py-1 hover:bg-gray-100 cursor-pointer">
                            
                                <span className="flex items-center">
                                  <img src={icon} alt={icon} className="w-4 h-4 mr-1.5" />

                                  <span onClick={() => selectPolygonName(index)}>{polygon.featureId}</span>
                                </span>
                                <button
                                  className="text-red-600 hover:text-red-800 ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from also selecting the polygon
                                    removePolygon(index); // Function to remove the polygon
                                  }}
                                >
                                  <img src={sidebarIcon.cancel_64} alt={sidebarIcon.cancel_64} className="w-2.5 h-2.5 mr-1.5" />
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                      
                    </div>
                  )} */}
                  {isDropdownOpen && (
                    <div className="absolute right-6 z-4 w-[12.7rem] bg-white border border-gray-200 shadow-lg" style={{ maxHeight: '25vh', overflowY: 'auto' }}>
                      <ul className="w-full list-none p-0 mb-0">
                        {drawnPolygons
                          .filter((polygon) => polygon.featureId) // Filter out polygons without a featureId
                          .map((polygon, index) => {
                            const geometryType = polygon.feature.getGeometry().getType();
                            const icon = geometryIconMap[geometryType] || '🔹'; // Default icon if type is not found
                            return (
                              <React.Fragment key={index}>
                                <li className="flex justify-between items-center text-sm text-gray-600 px-2 py-1 hover:bg-gray-100 cursor-pointer">
                                  {/* Display icon and featureId in dropdown */}
                                  <span className="flex items-center">
                                    <img src={icon} alt={icon} className="w-4 h-4 mr-1.5" />
                                    <span onClick={() => selectPolygonName(index)}>{polygon.featureId}</span>
                                  </span>
                                  {/* Cross button to remove the polygon */}
                                  <button
                                    className="text-red-600 hover:text-red-800 ml-2"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent click from also selecting the polygon
                                      removePolygon(index); // Function to remove the polygon
                                    }}
                                  >
                                    <img src={sidebarIcon.cancel_64} alt={sidebarIcon.cancel_64} className="w-2.5 h-2.5 mr-1.5" />
                                  </button>
                                </li>
                                {/* Add an <hr> after each item */}
                                <hr className="gray p-0 m-0" />
                              </React.Fragment>
                            );
                          })}
                      </ul>
                      <div onClick={handleClearAll} className="bg-blue-500 text-white text-center cursor-pointer hover:bg-blue-600">
                        Clear All
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
            <div className="GEMapRightSectionIcon">
              <img src={GE_ShopBasket_128} className='w-4 h-4' alt="Shop Basket Icon" />
            </div>
          </div>
        </div>
        {contextHolder}
      </div >

    </>
  )
}

export default OpenSearchMap;
