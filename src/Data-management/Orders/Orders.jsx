import { useEffect, useState } from 'react'

import { Button, DatePicker, Divider, Dropdown, Popconfirm, Select, Space, Spin, Tooltip, Typography, message, notification, Input } from 'antd'

import axios from 'axios'

import { Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Fill, Stroke, Style } from 'ol/style';
// import './Orders.css'
// import Lightbox from 'react-image-lightbox';
import dayjs from "dayjs";
import TabHeader from '../../reusablecomponents/TabHeader/TabHeader';
import { ReactComponent as OneDay } from "../../assets/Icons/sidebar-icons/oneDay.svg";
import { ReactComponent as CancelImg } from "../../assets/Icons/svgIcon/Cancel.svg";
import { ReactComponent as OrderSuccess } from "../../assets/Icons/svgIcon/orderSuccess.svg";
import { ReactComponent as Angle } from "../../assets/Icons/sidebar-icons/angle.svg";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    SyncOutlined,
    EyeOutlined,
    MoreOutlined,
    AimOutlined,
    CloseOutlined,
    RotateRightOutlined,
    CloudOutlined,
    PictureOutlined,
    RadiusBottomrightOutlined,
    FilterOutlined,
    EllipsisOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import { dateConvertForTasking } from '../Tasking/SearchComponents/SearchComponents';
import { sidebarIcon } from '../../constant';
import { useUser } from '../../Auth/AuthProvider/AuthContext';


const Orders = ({ mapRef, toggleOffCanvas, closeIcon, vectorRef }) => {


    const { userName, access } = useUser()

    const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
    const { Search } = Input;
    const [api, contextHolder] = notification.useNotification();
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState([])
    const [isFilter, setIsFilter] = useState(false)
    const [isFilter1, setIsFilter1] = useState(false)
    const [typeFilter, setTypeFilter] = useState("")
    const [photoIcon, setPhotoIcon] = useState("")

    const openNotification = (title, description, type) => {
        api[type]({
            message: title,
            description: description,
            placement: "topRight",

        });
    };

    const [taskingOrders, setTaskingOrder] = useState([])
    const [taskingOrdersShallow, setTaskingOrderShallow] = useState([])
    const [selectedFeature, setSelectedFeature] = useState([])
    const [selectedFeature1, setSelectedFeature1] = useState([])
    const [taskingId, setTaskingId] = useState("")
    const [segmentId, setSegmentId] = useState("")
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState("")
    const [viewSegments, setViewSegments] = useState(false)
    const [segmentDetails, setSegmentDetails] = useState([])
    const [details, setDetails] = useState(null)
    const [segVal, setSegVal] = useState("")
    const [formDetails, setFormDetails] = useState({
        progTypeName: "",
        mission: "",
        startDate: "",
        endDate: "",
        endDays: ""
    })


    const getAllTasking = async () => {

        await axios.get(`${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/gettaskings`, {
            headers: {
                Authorization: `Bearer ${access}`
            }
        }).then((res) => {
            if (res.status === 200) {
                console.log(res.data, "______tt")
                setTaskingOrder(res?.data?.taskings);
                setTaskingOrderShallow(res.data.taskings);
            }
        }).catch((err) => {
            console.log(err);
        });

    };

    useEffect(() => {
        getAllTasking()
    }, [access])

    const cancel = (e) => {
        setLoading(false)
        message.error('Click on No');
    };



    const stopTasking = async () => {
        setMessages("Please wait while we are stopping tasking....");
        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${taskingId}/cancel`,
                {}, // Empty object for body if there's no data to send
                {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                }
            );

            if (res.status === 200) {
                getAllTasking();
                setLoading(false);
                openNotification("Message", res.data.message, "success");
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const checkstatus = async () => {
        setMessages("Please wait while we geting current status tasking....")
        setLoading(true)
        await axios.get(`${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${taskingId}/checkstatus`, {
            headers: {
                Authorization: `Bearer ${access}` // Ensure `access` token is valid and retrieved correctly
            }
        }).then((res) => {
            if (res.status === 200) {
                getAllTasking()
                setLoading(false)
                openNotification("Message", res.data.message, "success")

            }
        }).catch((err) => {
            console.log(err)
            setLoading(false)

        })
    }
    const getSegmentDetails = async (id) => {
        setLoading(true);
        setMessages("Please wait, fetching all segments...");

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${id}/segments`,
                {
                    headers: {
                        Authorization: `Bearer ${access}` // Ensure `access` token is valid and retrieved correctly
                    }
                }
            );
            setViewSegments(true);
            if (res.status === 200) {
                const payload = res.data.segments.map((segment) => ({
                    ...segment
                }));

                console.log(payload);
                setSegmentDetails(payload);

            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };


    const handlePointerEnter = (task) => {
        const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
        if (layer) {
            let feature = new Feature(new Polygon(task.aoi[0].geometry.coordinates));
            feature.setId(task.taskingId);
            let style = new Style({
                stroke: new Stroke({
                    color: 'orange', // Hover color
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(255, 165, 0, 0.1)',
                }),
            });
            feature.setStyle(style);
            layer.getSource().addFeature(feature);
        }
    };

    const handlePointerLeave = (task) => {
        const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
        if (layer) {
            layer.getSource().forEachFeature((item) => {
                if (item.getId() === task.taskingId && !selectedFeature.includes(task.taskingId)) {
                    layer.getSource().removeFeature(item);
                }
            });
        }
    };

    //     const handleClick = (task) => {
    //         const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
    //         if (!layer) return;

    //         let arr = [...selectedFeature];
    //         const index = arr.indexOf(task.taskingId);

    //         if (index !== -1) {
    //             // If already selected, remove the feature
    //             arr.splice(index, 1);
    //             setSelectedFeature(arr);
    //             const feature = layer.getSource().getFeatureById(task.taskingId);
    //             if (feature) {
    //                 layer.getSource().removeFeature(feature);
    //             }
    //         } else {
    //             // Add the new selected feature
    //             arr.push(task.taskingId);
    //             setSelectedFeature(arr);

    //             let feature = new Feature(new Polygon(task.aoi[0].geometry.coordinates));
    //             feature.setId(task.taskingId);

    //             // Style for selected feature
    //             let style = new Style({
    //                 stroke: new Stroke({
    //                     color: "blue", // Selected color
    //                     width: 3,
    //                 }),
    //                 fill: new Fill({
    //                     color: 'rgba(0, 0, 0, 0.1)',
    //                 }),
    //             });

    //             feature.setStyle(style);
    //             layer.getSource().addFeature(feature);

    //             // Fit the map view to the feature's extent
    //             mapRef.current.ol.getView().fit(feature.getGeometry().getExtent(), {
    //                 duration: 1250,
    //                 padding: [200, 200, 200, 200],
    //             });
    //         }

    //         // Set styles for other features in the layer
    //         layer.getSource().getFeatures().forEach((feature) => {
    //             if (!arr.includes(feature.getId())) {
    //                 const defaultStyle = new Style({
    //                     stroke: new Stroke({
    //                         color: "gray", // Default color for unselected features
    //                         width: 1,
    //                     }),
    //                     fill: new Fill({
    //                         color: 'rgba(128, 128, 128, 0.1)',
    //                     }),
    //                 });
    //                 feature.setStyle(defaultStyle);
    //             } else {
    //                 // If the feature is selected, apply the selected style
    //                 const selectedStyle = new Style({
    //                     stroke: new Stroke({
    //                         color: "blue", // Selected color
    //                         width: 3,
    //                     }),
    //                     fill: new Fill({
    //                         color: 'rgba(0, 0, 0, 0.1)',
    //                     }),
    //                 });
    //                 feature.setStyle(selectedStyle);
    //             }
    //         });

    //         // Update the details for the clicked task
    //         setDetails({
    //             customerReference: task.productionParameters.customerReference,
    //             taskingId: task.taskingId,
    //             progTypeName: task.progTypeName,
    //             mission: task.mission,
    //             orderedArea: Math.round(task.taskingProgress.orderedArea / 1000000),
    //             status: task.status,
    //         });

    //         setTaskingId(task.taskingId);
    //         getSegmentDetails(task.taskingId); // Assuming this is defined elsewhere
    //     };
    //     // Function to handle extending the view to fit the feature
    //     const handleExtend = (task) => {
    //         const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
    //         if (!layer) return;

    //         const feature = layer.getSource().getFeatureById(task.taskingId);
    //         if (feature) {
    //             mapRef.current.ol.getView().fit(feature.getGeometry().getExtent(), {
    //                 duration: 1250,
    //                 padding: [200, 200, 200, 200],
    //             });
    //         }
    //     };

    //    // Function to handle preview and highlight selected feature
    // const handlePreview = (task) => {
    //     const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
    //     if (!layer) return;

    //     let arr = [...selectedFeature];
    //     const index = arr.indexOf(task.taskingId);

    //     if (index !== -1) {
    //         // If already selected, remove the feature
    //         arr.splice(index, 1);
    //         setSelectedFeature(arr);
    //         const feature = layer.getSource().getFeatureById(task.taskingId);
    //         if (feature) {
    //             layer.getSource().removeFeature(feature);
    //         }
    //     } else {
    //         // Add the selected feature
    //         arr.push(task.taskingId);
    //         setSelectedFeature(arr);

    //         let feature = new Feature(new Polygon(task.aoi[0].geometry.coordinates));
    //         feature.setId(task.taskingId);

    //         // Style for selected feature
    //         let style = new Style({
    //             stroke: new Stroke({
    //                 color: "blue", // Selected color
    //                 width: 3,
    //             }),
    //             fill: new Fill({
    //                 color: 'rgba(0, 0, 0, 0.1)',
    //             }),
    //         });

    //         feature.setStyle(style);
    //         layer.getSource().addFeature(feature);

    //         // Removed the map view fit function to avoid extending on preview
    //         // mapRef.current.ol.getView().fit(feature.getGeometry().getExtent(), {
    //         //     duration: 1250,
    //         //     padding: [200, 200, 200, 200],
    //         // });
    //     }
    // };

    const handleClick = (task) => {
        const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
        if (!layer) return;

        let arr = [...selectedFeature];
        const index = arr.indexOf(task.taskingId);

        // Get the feature by its ID if it already exists
        const feature = layer.getSource().getFeatureById(task.taskingId);

        if (index !== -1) {
            // If already selected, remove the feature
            arr.splice(index, 1);
            setSelectedFeature(arr);

            if (feature) {
                layer.getSource().removeFeature(feature);
            }
        } else {
            // Add the new selected feature
            arr.push(task.taskingId);
            setSelectedFeature(arr);

            if (!feature) {
                let newFeature = new Feature(new Polygon(task.aoi[0].geometry.coordinates));
                newFeature.setId(task.taskingId);

                // Style for selected feature
                let style = new Style({
                    stroke: new Stroke({
                        color: "blue", // Selected color
                        width: 3,
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 0, 0.1)',
                    }),
                });

                newFeature.setStyle(style);
                layer.getSource().addFeature(newFeature);
            }

            // Extend the map view to fit the feature's extent
            mapRef.current.ol.getView().fit(feature.getGeometry().getExtent(), {
                duration: 1250,
                padding: [200, 200, 200, 200],
            });
        }

        // Update the styles for all other features
        layer.getSource().getFeatures().forEach((feature) => {
            const defaultStyle = new Style({
                stroke: new Stroke({
                    color: arr.includes(feature.getId()) ? "blue" : "gray", // Apply styles based on selection
                    width: arr.includes(feature.getId()) ? 3 : 1,
                }),
                fill: new Fill({
                    color: arr.includes(feature.getId()) ? 'rgba(0, 0, 0, 0.1)' : 'rgba(128, 128, 128, 0.1)',
                }),
            });
            feature.setStyle(defaultStyle);
        });

        // Update task details
        setDetails({
            customerReference: task.productionParameters.customerReference,
            taskingId: task.taskingId,
            progTypeName: task.progTypeName,
            mission: task.mission,
            orderedArea: Math.round(task.taskingProgress.orderedArea / 1000000),
            status: task.status,
        });

        setTaskingId(task.taskingId);
        getSegmentDetails(task.taskingId); // Assuming this is defined elsewhere
    };
    // Function to handle extending the view to fit the feature
    const handleExtend = (task) => {
        const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
        if (!layer) return;

        // Check if the feature exists by its ID
        const feature = layer.getSource().getFeatureById(task.taskingId);
        if (feature) {
            // Extend the map view to fit the feature's extent
            mapRef.current.ol.getView().fit(feature.getGeometry().getExtent(), {
                duration: 1250,
                padding: [200, 200, 200, 200],
            });
        }
    };

    // Function to handle preview and highlight the selected feature
    const handlePreview = (task) => {
        const layer = mapRef.current.ol.getLayers().getArray().find(layer => layer.get("name") === "SearchResultsHoverLayer");
        if (!layer) return;

        let arr = [...selectedFeature];
        const index = arr.indexOf(task.taskingId);

        // Check if the feature already exists in the layer by its ID
        const feature = layer.getSource().getFeatureById(task.taskingId);

        if (index !== -1) {
            // If already selected, remove the feature
            arr.splice(index, 1);
            setSelectedFeature(arr);

            if (feature) {
                layer.getSource().removeFeature(feature);
            }
        } else {
            // Add the selected feature to the layer if it doesn't exist
            arr.push(task.taskingId);
            setSelectedFeature(arr);

            if (!feature) {
                let newFeature = new Feature(new Polygon(task.aoi[0].geometry.coordinates));
                newFeature.setId(task.taskingId);

                // Style for selected feature
                let style = new Style({
                    stroke: new Stroke({
                        color: "blue", // Selected color
                        width: 3,
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 0, 0.1)',
                    }),
                });

                newFeature.setStyle(style);
                layer.getSource().addFeature(newFeature);
            }
        }

        // Style all features (selected and unselected)
        layer.getSource().getFeatures().forEach((feature) => {
            const defaultStyle = new Style({
                stroke: new Stroke({
                    color: arr.includes(feature.getId()) ? "blue" : "gray", // Selected vs default color
                    width: arr.includes(feature.getId()) ? 3 : 1,
                }),
                fill: new Fill({
                    color: arr.includes(feature.getId()) ? 'rgba(0, 0, 0, 0.1)' : 'rgba(128, 128, 128, 0.1)',
                }),
            });
            feature.setStyle(defaultStyle);
        });
    };


    const items =
        viewSegments ?
            segVal === "VALIDATED" ? [{
                label: (
                    <Popconfirm
                        title="Get Status"
                        description="Are you sure to Download Segment?"
                        onConfirm={() => { window.location.href = `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${details.taskingId}/segments/${segmentId}/download?x-ads-signature=${access}` }}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    ><Button size="small" type="link" >Download</Button></Popconfirm>
                ),
                key: '0',
            },] :

                [

                    {
                        label: (
                            <Popconfirm
                                title="Get Status"
                                description="Are you sure to Validate Segment?"
                                onConfirm={() => { accepetTasking() }}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            ><Button size="small" type="link" >Validate</Button></Popconfirm>
                        ),
                        key: '0',
                    },
                    {
                        label: (
                            <Popconfirm
                                title="Stop Tasking"
                                description="Are you sure to Refuse Segment?"
                                onConfirm={() => { refuseTasking() }}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            ><Button size="small" type="link" >Refuse</Button></Popconfirm>
                        ),
                        key: '1',
                    },

                ] :

            [

                {
                    label: (
                        <Popconfirm
                            title="Get Status"
                            description="Are you sure to Get Status of this task?"
                            onConfirm={checkstatus}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><Button size="small" type="link" >Get Status</Button></Popconfirm>
                    ),
                    key: '0',
                },
                {
                    label: (
                        <Popconfirm
                            title="Stop Tasking"
                            description="Are you sure to Stop Tasking ?"
                            onConfirm={stopTasking}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        ><Button size="small" type="link" >Stop Tasking</Button></Popconfirm>
                    ),
                    key: '1',
                },


            ];

    const accepetTasking = async () => {
        setLoading(true)
        setMessages("Please wait while we validating tasking....")
        await axios.get(`${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${taskingId}/segments/${segmentId}/accept`)
            .then((res) => {
                setLoading(false)
                openNotification("Message", res.data.message, "success")
            }).catch((err) => {
                console.log(err)
                setLoading(false)

            })
    }
    const refuseTasking = async () => {
        setLoading(true)
        setMessages("Please wait while we refusing tasking....")
        await axios.get(`${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/${taskingId}/segments/${segmentId}/refuse`)
            .then((res) => {
                setLoading(false)
                openNotification("Message", res.data.message, "success")
            }).catch((err) => {
                console.log(err)
                setLoading(false)

            })
    }
    const previewImage = async (url) => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/image?url=${url}`, { responseType: "arraybuffer" }).then((res) => {
            const base64Image = btoa(
                new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                ));
            setImages([`data:image/png;base64,${base64Image}`]);
            setIsOpen(true)
        }).catch((err) => {
            console.log(err)
        })
    }
    const onApplyFilter = async () => {
        let url = `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/getByQuery?`
        if (formDetails.mission) {
            url = url + "mission=" + formDetails.mission + "&"
        }
        if (formDetails.progTypeName) {
            url = url + "progTypeName=" + formDetails.progTypeName + "&"
        }
        if (formDetails.startDate) {
            if (formDetails.startDate === "Invalid Date") {

            } else {
                url = url + "startDate=" + formDetails.startDate + "&"
            }

        }
        if (formDetails.endDate) {
            if (formDetails.endDate === "Invalid Date") {

            } else {
                url = url + "endDate=" + formDetails.endDate + "&"
            }
        }
        if (formDetails.endDays) {
            url = url + "endDays=" + formDetails.endDays + "&"
        }
        await axios.get(url.slice(0, -1)).then((res) => {
            setTaskingOrder(res.data.taskings)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <>

            <div
                className={`mt-[0px] w-[30%] h-[calc(100vh-115px)]  absolute    max-w-6xl z-30 bg-slate-100  
                    rounded-sm transform transition-transform duration-300 ease-in-out
                     ${closeIcon ? "translate-x-0 md:left-[4.7%] lg:left-[4.7%] xl:left-[3.8%] 2xl:left-[2.9%] " : "-translate-x-full"
                    }`}
            >
                <TabHeader
                    headingTitle="Orders"
                    imgSrc={sidebarIcon.GE_Cancel_128}
                    imgCancle={sidebarIcon.GE_Cancel_128}
                    alt="timer"
                    toggleOffCanvas={toggleOffCanvas}

                // onClick={() => { viewSegments ? setViewSegments(false) : closeIcon(false) }}
                />

                <div
                    className='bg-white border '
                >
                    {viewSegments ? <></> : <>
                        <div style={{ display: "flex", flexDirection: "row", placeItems: "center", placeContent: "flex-start", padding: "10px 0.25em", gap: "5px" }}>
                            <Search
                                placeholder="Customer Refrence"
                                onSearch={(e) => {
                                    setIsFilter1(true)
                                    setTaskingOrder(taskingOrders.filter(entry => {
                                        return entry.productionParameters.customerReference.toLocaleLowerCase() === e.toLocaleLowerCase();
                                    }))
                                }}
                                style={{
                                    width: "30em",
                                }}
                                suffix={isFilter1 ? <Button type="text" onClick={() => {
                                    getAllTasking()
                                    setIsFilter1(false)
                                }}><CloseOutlined /></Button> : <></>}
                            />
                            <Button type="text" onClick={() => { setIsFilter(!isFilter) }}>{isFilter ? <EllipsisOutlined /> : <FilterOutlined />}</Button>
                            <Button type="text" onClick={getAllTasking}><SyncOutlined /></Button>

                        </div>

                        <div style={{ display: "flex", flexDirection: "row", placeItems: "center", placeContent: "flex-start", padding: "0 0.25em", gap: "5px" }}>
                            <Button type={typeFilter === "Canceled".toLocaleLowerCase() ? "primary" : "dashed"} onClick={() => {
                                if (typeFilter === "Canceled".toLocaleLowerCase()) {
                                    setTypeFilter("")
                                    setTaskingOrder(taskingOrdersShallow)
                                } else {
                                    setTypeFilter("Canceled".toLocaleLowerCase())
                                    let payload = [...taskingOrdersShallow]
                                    setTaskingOrder(payload.filter(entry => {
                                        return entry.status.toLocaleLowerCase() === "Canceled".toLocaleLowerCase();
                                    }))
                                }
                            }}>Cancelled</Button>
                            <Button type={typeFilter === "In Progress".toLocaleLowerCase() ? "primary" : "dashed"} onClick={() => {
                                if (typeFilter === "In Progress".toLocaleLowerCase()) {
                                    setTaskingOrder(taskingOrdersShallow)
                                    setTypeFilter("")

                                } else {
                                    setTypeFilter("In Progress".toLocaleLowerCase())
                                    let payload = [...taskingOrdersShallow]
                                    setTaskingOrder(payload.filter(entry => {
                                        return entry.status.toLocaleLowerCase() === "In Progress".toLocaleLowerCase();
                                    }))
                                }

                            }}>In Progress</Button>
                            <Button type={typeFilter === "Completed".toLocaleLowerCase() ? "primary" : "dashed"} onClick={() => {
                                if (typeFilter === "Completed".toLocaleLowerCase()) {
                                    setTaskingOrder(taskingOrdersShallow)
                                    setTypeFilter("")

                                } else {
                                    setTypeFilter("Completed".toLocaleLowerCase())
                                    let payload = [...taskingOrdersShallow]
                                    setTaskingOrder(payload.filter(entry => {
                                        return entry.status.toLocaleLowerCase() === "Completed".toLocaleLowerCase();
                                    }))
                                }
                            }}>Completed</Button>
                        </div>
                        {isFilter ? <> <div style={{ display: "flex", flexDirection: "column", padding: "10px 0.5em", gap: "5px", marginTop: "5px" }}>
                            <div style={{ display: "flex", flexDirection: "row", placeItems: "center", placeContent: "space-between" }}>
                                <Select style={{ width: "11em" }} placeholder="Mission" allowClear onChange={(e) => {
                                    setFormDetails((prev) => ({ ...prev, mission: e }))
                                }}>
                                    <Select.Option key={"PLEIADES"} value={"PLEIADES"}>PLEIADES</Select.Option>
                                    <Select.Option key={"SPOT"} value={"SPOT"}>SPOT</Select.Option>
                                    <Select.Option key={"PLEIADESNEO"} value={"PLEIADESNEO"}>PLEIADES NEO</Select.Option>
                                </Select>
                                <Select style={{ width: "11em" }} placeholder="Program Types" allowClear onChange={(e) => {
                                    setFormDetails((prev) => ({ ...prev, progTypeName: e }))
                                }}>
                                    <Select.Option key={"OneDay"} value={"ONEDAY"}>ONEDAY</Select.Option>
                                    <Select.Option key={"OneNow"} value={"ONENOW"}>ONENOW</Select.Option>
                                    <Select.Option key={"OnePlan"} value={"ONEPLAN"}>ONEPLAN</Select.Option>
                                </Select>
                                <Select style={{ width: "11em" }} placeholder="Tasking end days" allowClear onChange={(e) => {
                                    setFormDetails((prev) => ({ ...prev, endDays: e }))
                                }}>
                                    <Select.Option key={"4"} value={4}>4 Days</Select.Option>
                                    <Select.Option key={"15"} value={15}>15 Days</Select.Option>
                                    <Select.Option key={"30"} value={30}>30 Days</Select.Option>
                                </Select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", placeItems: "center", placeContent: "space-between" }}>
                                <DatePicker style={{ width: "11em" }} placeholder='Start Date' format={dateFormatList} onChange={(dateString) => {
                                    const day = dayjs(dateString, "DD/MM/YYYY");
                                    const jsonDate = day.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                                    setFormDetails((prev) => ({ ...prev, startDate: jsonDate }))
                                }} />
                                <DatePicker style={{ width: "11em" }} placeholder='End Date' format={dateFormatList} onChange={(dateString) => {
                                    const day = dayjs(dateString, "DD/MM/YYYY");
                                    const jsonDate = day.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                                    setFormDetails((prev) => ({ ...prev, endDate: jsonDate }))

                                }} />
                                <Button style={{ width: "5em" }} type="primary" onClick={onApplyFilter}>Apply</Button>
                                <Button style={{ width: "5em" }} onClick={() => { setTaskingOrder(taskingOrdersShallow) }}>Reset</Button>
                            </div>
                        </div></> : <></>}

                        {/* <Divider type="horizontal" /> */}
                        <div className='mt-3'>

                        </div>
                    </>}

                    <div style={{
                        overflowY: "auto",
                        padding: 0,
                        height: isFilter ? "60vh" : "calc(100vh - 28vh)",
                    }}>

                        {!viewSegments ? <>
                            <Spin spinning={loading} tip={messages}>
                                {taskingOrders?.map((task) => {
                                    return (<>

                                        <div className='hover:bg-blue-50' style={{ display: "flex", flexDirection: "row", placeContent: "space-between", placeItems: "center", padding: "0.5rem 1rem", }}

                                            onPointerEnter={() => handlePointerEnter(task)}

                                            onPointerLeave={() => handlePointerLeave(task)}


                                        >
                                            <div style={{ display: "flex", flexDirection: "row", placeItems: "center", gap: "20px" }}

                                                onClick={() => handleClick(task)}
                                            >
                                                {task.status === "In Progress" || task.status === "IN_PROGRESS" ? <> <img src={sidebarIcon.LoadingImg} className='w-7 h-' alt="" /> </> : <></>}
                                                {task.status === "CANCELLED" || task.status === "Canceled" ? <> <CancelImg /> </> : <>   </>}
                                                {task.status === "Completed" ? <OrderSuccess /> : <></>}
                                                <div style={{ display: "flex", flexDirection: "column", placeItems: "flex-start", }}>
                                                    <div style={{ display: "flex", flexDirection: "row", placeContent: "center", placeItems: "center", gap: "5px", margin: 0, padding: 0 }}>
                                                        <h4 style={{
                                                            fontWeight: "500",
                                                            margin: 0, padding: 0, color: "#167dde",
                                                            fontSize: ".875rem"
                                                        }}>{task.progTypeName}</h4>
                                                        <p style={{
                                                            margin: 0, padding: 0, color: "#0000008a",
                                                            fontSize: ".75rem",
                                                            listStyle: "none"
                                                        }}>{task.sal}</p>
                                                    </div>
                                                    <h4 className='text-[#0a0101de] m-0 p-0 text-base font-medium '>{task.productionParameters.customerReference}</h4>
                                                    {/* <h5  className='text-xs m-0 p-0 text-[#0000008a] font-normal'>{(task.progTypeName).toUpperCase() === "ONEDAY" ? dateConvertForTasking(task.period.startDate) :
                                                        `${dateConvertForTasking(task.period.startDate)} - ${dateConvertForTasking(task.period.endDate)}`
                                                        }</h5> */}
                                                    <h5 className='text-xs m-0 p-0 text-[#0000008a] font-normal'>{
                                                        `${dateConvertForTasking(task.creationDate)} - ${dateConvertForTasking(task.period.endDate)}`
                                                    }</h5>
                                                    <h5 className='text-xs m-0 p-0 text-[#0000008a] font-normal'>{task.taskingId} | { }   </h5>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "row", placeContent: "center", placeItems: "center", }}>
                                                <Tooltip title="Extent">
                                                    <Button type="text" className='' icon={<AimOutlined />}
                                                        onClick={() => {
                                                            handleExtend(task)
                                                        }} >

                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Preview">
                                                    <Button
                                                        type="text"
                                                        icon={
                                                            <EyeOutlined
                                                                style={{
                                                                    color: selectedFeature.includes(task.taskingId)
                                                                        ? 'rgb(22, 125, 222)' // Color when selected
                                                                        : '#000', // Default color
                                                                }}
                                                            />
                                                        }
                                                        onClick={() => {
                                                            handlePreview(task)
                                                        }}
                                                    />

                                                </Tooltip>
                                                {task.status === "Completed" ? <>


                                                    <Button type="text" disabled icon={<RotateRightOutlined />} />

                                                </> : <>
                                                    <Dropdown

                                                        menu={{
                                                            items,
                                                        }}

                                                        trigger={['click']}
                                                        onOpenChange={(e) => {
                                                            setTaskingId(task.taskingId)
                                                        }}
                                                    >

                                                        <Tooltip title="More"><Button type="text" icon={<MoreOutlined />} /></Tooltip>
                                                    </Dropdown>
                                                </>}



                                            </div>

                                        </div >
                                        <hr className='p-0 m-0' />
                                    </>)
                                })}
                            </Spin>

                        </> :
                            <>
                                <div className='py-2 px-3 '>
                                    <div className="flex items-center justify-between py-2 mb-2 ">
                                        {/* Left Section: Title and ID */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-xl m-0 leading-tight p-0">testtaskingwardhaOneNow1</h3>
                                            <h5 className="text-sm m-0 p-0 text-gray-500 font-mono">SAL21454486 (ICR_FC_422905)</h5>
                                        </div>

                                        <div className="flex space-x-3 text-gray-600">

                                            <PictureOutlined className="text-xl cursor-pointer" />
                                            <EnvironmentOutlined className="text-xl cursor-pointer" />
                                            <AimOutlined className="text-xl cursor-pointer" />
                                            <MoreOutlined className="text-xl cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className='bg-sky-100 rounded-sm p-3'>

                                        <div className='flex justify-between items-end'>
                                            <div>
                                                <div className='flex gap-2'>
                                                    <OneDay />  <span className='text-xs text-gray-500'>Pleiades</span>
                                                </div>

                                                <div className="text-blue-500 text-sm py-1.5">
                                                    <p className='flex items-center m-0 p-0'>
                                                        <span>05 Jan 2024</span>
                                                        <span className="mx-2">•</span>
                                                        <ClockCircleOutlined className="inline-block" />
                                                        <span className="mx-2">→</span>
                                                        <span>20 Jan 2024</span>
                                                    </p>
                                                    {/* Additional Data */}
                                                    <p className='flex items-center p-0 m-0'>
                                                        <span className="mr-4">🌡 <span className="text-blue-500">  30° </span></span>
                                                        <CloudOutlined className="inline-block mr-1" />
                                                        <span>  10% </span>
                                                    </p>
                                                </div>

                                            </div>

                                            <div>

                                            </div>

                                            {/* Right Section */}
                                            <div className="flex items-center">
                                                {/* Circular Progress */}
                                                <div className="relative">
                                                    {/* Circular Progress (e.g., 99%) */}
                                                    <div className="w-14 h-14 rounded-full border-4 border-blue-500 relative flex items-center justify-center">
                                                        <span className="text-blue-500 font-bold text-lg">99%</span>
                                                    </div>
                                                    {/* Check Icon Overlay */}
                                                    <CheckCircleOutlined className="absolute top-0 right-0 text-green-500 bg-white rounded-full" />
                                                </div>

                                                {/* Completion Text */}
                                                <div className="ml-4">
                                                    <h4 className="text-xl font-semibold m-0 p-0 text-gray-800">Completed</h4>
                                                    <p className="text-sm text-gray-500 p-0 m-0">100 km² total</p>
                                                </div>
                                            </div>

                                        </div>


                                    </div>


                                </div>




                                {/* <div style={{ display: "flex", flexDirection: "row", placeContent: "space-between", placeItems: "center", backgroundColor: "#167dde0a", padding: "0.25rem 1rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", placeContent: "center" }}>
                                        <h3 style={{ margin: 0, padding: 0, fontSize: "1rem", fontWeight: "600" }}>{details.taskingId}</h3>
                                        <h4 style={{ margin: 0, padding: 0, fontSize: "1rem", fontWeight: "600", color: "#0000008a" }}>{details.customerReference}</h4>
                                    </div>
                                    <h3 style={{ margin: 0, padding: 0 }}>{details.progTypeName}</h3>
                                    <Divider type="vertical" style={{ height: "75px" }} />
                                    <div style={{ display: "flex", flexDirection: "row", placeContent: "center", gap: "5px" }}>
                                        {details.status === "In Progress" || details.status === "IN_PROGRESS" ? <><img alt={details.status} src={sidebarIcon.GE_Point_128} width={40} height={40} style={{ padding: 0, margin: 0 }} /></> : <></>}
                                        {details.status === "CANCELLED" || details.status === "Canceled" ? <><img alt={details.status} src={sidebarIcon.GE_Point_128} width={40} height={40} style={{ padding: 0, margin: 0 }} /></> : <></>}
                                        {details.status === "Completed" ? <><img alt={details.status} src={sidebarIcon.GE_Point_128} width={40} height={40} style={{ padding: 0, margin: 0 }} /></> : <></>}
                                        <div style={{ display: "flex", flexDirection: "column", placeContent: "center", placeItems: "baseline", gap: "5px" }}>
                                            <h4 style={{ margin: 0, padding: 0 }}>{details.status}</h4>
                                            <h6 style={{ margin: 0, padding: 0, color: "#0000008a" }}>{details.orderedArea} km<sup>2</sup></h6>
                                        </div>
                                    </div>
                                </div> */}
                                <div>

                                    <Spin spinning={loading} tip={messages}>

                                        {segmentDetails?.map((seg) => (
                                            <>
                                                <div style={{ display: "flex", flexDirection: "row", placeContent: "space-between", placeItems: "center", padding: "0.25rem 1rem" }}>
                                                    <DotChartOutlined fontSize="small" sx={{
                                                        color: seg.status === "Proposed" ?
                                                            "#e400d0" : "#6cbe20"
                                                    }} />
                                                    <div style={{ display: "flex", flexDirection: "column", placeItems: "flex-start" }}>

                                                        <h4 style={{ margin: 0, padding: 0 }}>
                                                            {seg.id}
                                                        </h4>
                                                        <h5 style={{ margin: 0, padding: 0, color: "#0000008a" }}>
                                                            {dateConvertForTasking(seg.asDetail1.acquisitionDate)}
                                                        </h5>
                                                    </div>
                                                    <Space style={{ display: "flex", flexDirection: "row", placeContent: "center", placeItems: "center", }}>
                                                        <Tooltip title="Incidence Angle">
                                                            <RadiusBottomrightOutlined
                                                                color="primary"
                                                                sx={{ height: "1rem", width: "1rem" }}
                                                            />
                                                        </Tooltip>
                                                        <Typography style={{ fontSize: "95%" }}>

                                                            {seg.asDetail1.incidenceAngle.toFixed(2)}


                                                        </Typography>
                                                        <Tooltip title="Cloud Cover">
                                                            <CloudOutlined
                                                                color="primary"
                                                                sx={{ height: "1rem", width: "1rem" }}
                                                            />
                                                        </Tooltip>
                                                        <Typography style={{ fontSize: "95%" }}>
                                                            {(100 - seg.asDetail1.clearSkyRate
                                                            ).toFixed(2)}%
                                                        </Typography>
                                                    </Space>
                                                    <div style={{ display: "flex", flexDirection: "row", placeContent: "center", placeItems: "center", }}>
                                                        <Tooltip title="Extent">
                                                            <Button type="text" style={{ margin: 0, padding: 0 }} onClick={() => {
                                                                mapRef.current.ol.getLayers().getArray().forEach((layer) => {
                                                                    if (layer.get("name") === "SearchResultsHoverLayer") {
                                                                        let feature = new Feature(new Polygon(seg.asDetail1.footprint.coordinates))
                                                                        feature.setId(seg.id)
                                                                        let style = new Style({
                                                                            stroke: new Stroke({
                                                                                color: "blue",
                                                                                width: 3,
                                                                            }),
                                                                            fill: new Fill({
                                                                                color: 'rgba(0, 0, 0, 0.1)'
                                                                            }),
                                                                        })
                                                                        feature.setStyle(style)
                                                                        layer.getSource().addFeature(feature)
                                                                        mapRef.current.ol.getView()
                                                                            .fit(feature.getGeometry().getExtent(), {
                                                                                duration: 1250,
                                                                                padding: [200, 200, 200, 200],
                                                                            });
                                                                        layer.getSource().removeFeature(feature)
                                                                    }
                                                                })

                                                            }} >
                                                                <img
                                                                    style={{ margin: "5px 0 0 0", padding: 0 }}
                                                                    width={20}
                                                                    height={20}
                                                                    alt="target"
                                                                    src={sidebarIcon.GE_Analytics_128}
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="QuickLook">
                                                            <Button type="link" onClick={() => {
                                                                if (seg.deliveries) {
                                                                    setPhotoIcon(seg.deliveries._links.quicklook.href)
                                                                    previewImage(seg.deliveries._links.quicklook.href)
                                                                } else {
                                                                    openNotification("Image Preview", "Please validate before previewing it!", "error")
                                                                }
                                                            }}>
                                                                <PictureOutlined color={photoIcon === seg?.deliveries?._links?.quicklook?.href
                                                                    ? ""
                                                                    : "action"
                                                                } />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Show Tasking">
                                                            <Button type="text" icon={<AimOutlined color={selectedFeature1.includes(seg.id)
                                                                ? "primary"
                                                                : ""
                                                            } />} onClick={() => {
                                                                mapRef.current.ol.getLayers().getArray().forEach((layer) => {
                                                                    if (layer.get("name") === "SearchResultsHoverLayer") {
                                                                        let arr = [...selectedFeature1]
                                                                        const index = arr.indexOf(seg.id);
                                                                        if (index !== -1) {
                                                                            arr.splice(index, 1);
                                                                            setSelectedFeature1(arr)
                                                                            layer.getSource().removeFeature(layer.getSource().getFeatureById(seg.id
                                                                            ))
                                                                        } else {
                                                                            arr.push(seg.id
                                                                            );
                                                                            setSelectedFeature1(arr)
                                                                            let feature = new Feature(new Polygon(seg.asDetail1.footprint.coordinates))
                                                                            feature.setId(seg.id
                                                                            )
                                                                            let style = new Style({
                                                                                stroke: new Stroke({
                                                                                    color: "#6cbe20",
                                                                                    width: 2,
                                                                                }),
                                                                                fill: new Fill({
                                                                                    color: 'rgba(196, 214, 148, 0.4)'
                                                                                }),
                                                                            })
                                                                            feature.setStyle(style)
                                                                            layer.getSource().addFeature(feature)
                                                                            mapRef.current.ol.getView()
                                                                                .fit(feature.getGeometry().getExtent(), {
                                                                                    duration: 1250,
                                                                                    padding: [200, 200, 200, 200],
                                                                                });
                                                                        }

                                                                    }
                                                                })
                                                            }} />

                                                        </Tooltip>
                                                        <Dropdown
                                                            menu={{
                                                                items,
                                                            }}

                                                            trigger={['click']}
                                                            onOpenChange={(e) => {
                                                                setSegmentId(seg.id)
                                                                setSegVal(seg.status.toUpperCase())
                                                            }}
                                                        >

                                                            <Tooltip title="More"> <Button type="text" icon={<MoreOutlined />} /></Tooltip>
                                                        </Dropdown>





                                                    </div>
                                                </div>
                                                <Divider /></>
                                        ))}
                                    </Spin>
                                </div>

                            </>}

                    </div>

                </div >
                {/* {isOpen && (
                    <Lightbox
                        mainSrc={images[0]}
                        onCloseRequest={() => setIsOpen(false)}
                        clickOutsideToClose={true}
                    />
                )
                } */}
                {contextHolder}


            </div >
        </>
    )
}

export default Orders