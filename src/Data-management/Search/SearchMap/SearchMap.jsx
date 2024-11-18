import React, { useEffect, useState } from 'react';
import {
    RMap,
    RLayerVector,
    RControl,
    RLayerTileWebGL,
    ROSMWebGL,
    RLayerTileWMS,
    RFeature,
    ROverlay,
    RInteraction
} from 'rlayers';
import { Vector as VectorSource } from 'ol/source';
import "ol/ol.css";

const SearchMap = React.memo(function SearchMap({
    finishModify, selectedPolygonSource1, selectedPolygon, setDrawnPolygons, onPolygonSourceChange, drawnPolygons,
    selectedPolygonId, onSubmit, onSubmitCancel, vectorLayerRef, mapRef, searchLayerRef, searchLayerHoverRef
}) {
    const origin = [79.0082, 21.1458];
    const [zoomLevel, setZoomLevel] = useState(5);

    useEffect(() => {
        if (mapRef.current) {
            const mapInstance = mapRef.current.ol;

            const updateZoomLevel = () => {
                const currentZoom = Math.round(mapInstance.getView().getZoom());
                setZoomLevel(currentZoom);
            };

            mapInstance.on('moveend', updateZoomLevel);

            return () => {
                mapInstance.un('moveend', updateZoomLevel);
            };
        }
    }, [mapRef]);

    useEffect(() => {
        if (zoomLevel !== undefined && mapRef.current) {
            const zoomButton = document.querySelector('.ol-zoomslider button');
            if (zoomButton) {
                zoomButton.textContent = `${zoomLevel}`;
            }
        }
    }, [zoomLevel]);


    // useEffect(() => {
    //     if (mapRef.current) {
    //         const mapInstance = mapRef.current.ol; // OpenLayers map instance
    //         const view = mapInstance.getView();

    //         // Define the constrained extent (for India)
    //         const constrainedExtent = [-85, -180, 85, 180]; // [MinLon, MinLat, MaxLon, MaxLat]

    //         // Set the constrained extent for the view
    //         view.setMinZoom(4);
    //         view.setMaxZoom(15);
    //         view.setConstrainResolution(true);

    //         // Apply extent constraints to limit panning but allow zooming freely
    //         view.on('change:center', () => {
    //             const currentCenter = view.getCenter();
    //             if (!currentCenter) return;

    //             const clampedX = Math.max(constrainedExtent[0], Math.min(currentCenter[0], constrainedExtent[2]));
    //             const clampedY = Math.max(constrainedExtent[1], Math.min(currentCenter[1], constrainedExtent[3]));

    //             if (clampedX !== currentCenter[0] || clampedY !== currentCenter[1]) {
    //                 view.setCenter([clampedX, clampedY]);
    //             }
    //         });
    //     }
    // }, [mapRef]);




    return (
        <div>
            <RMap
                width={"100%"}
                height={"88vh"}
                initial={{ center: origin, zoom: 5 }}
                ref={mapRef}
                projection={"EPSG:4326"}
                maxZoom={15}
                minZoom={4}
            >
                <RControl.RLayers>
                    <ROSMWebGL properties={{ label: "OSM" }} />
                    <RLayerTileWebGL
                        properties={{ label: "Google Road Map" }}
                        url='http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                        attributions="Google Road Map"
                    />
                    <RLayerTileWebGL
                        properties={{ label: "ESRI Imagery" }}
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        attributions="&copy; <a href='https://www.esri.com/'>Esri</a>"
                    />
                </RControl.RLayers>

                <RLayerTileWMS
                    properties={{ label: "India Shapefile WMS Layer" }}
                    url="http://13.232.99.245:8085/geoserver/indialayer/wms"
                    params={{
                        'LAYERS': 'indialayer:shapefile',
                        'TILED': true,
                        'FORMAT': 'image/png',
                        'VERSION': '1.1.1',
                        'SRS': 'EPSG:4326'
                    }}
                    attributions="India Shapefile WMS Layer"
                    zIndex={1}
                />

                <RControl.RScaleLine />
                <RControl.RZoomSlider />

                <RLayerVector
                    properties={{ "name": "DrawingLayer" }}
                    zIndex={6}
                    ref={vectorLayerRef}
                    source={new VectorSource()}
                >
                    {drawnPolygons?.map((f) => (
                        <RFeature key={f.feature.id_} id={f.feature.id_} feature={f.feature}>
                            <ROverlay positioning="center-center">
                                <div className='rounded-md'>
                                    <p className='text-blue-900 text-xs m-0 p-0'>
                                        <strong>{`${f.feature.id_}`}</strong>
                                    </p>
                                    <p className='text-blue-900 text-xs m-0 p-0'>
                                        {f.areaOrLength ? `Area: ${f.areaOrLength} km²` : null}
                                    </p>
                                </div>
                            </ROverlay>
                        </RFeature>
                    ))}
                </RLayerVector>

                <RLayerVector
                    properties={{ "name": "SelectedPolygonLayer" }}
                    zIndex={7}
                    source={selectedPolygonSource1}
                >
                    {selectedPolygon && (
                        <RFeature key={selectedPolygon.id_} id={selectedPolygon.id_} feature={selectedPolygon} />
                    )}

                    {selectedPolygon && (
                        <RInteraction.RModify layer={selectedPolygonSource1} onModify={finishModify} />
                    )}
                </RLayerVector>

                <RLayerVector properties={{ name: "SearchResultsLayer" }} zIndex={999} ref={searchLayerRef} />
                <RLayerVector properties={{ name: "SearchResultsHoverLayer" }} zIndex={999} ref={searchLayerHoverRef} />
            </RMap>
        </div>
    );
});

export default SearchMap;