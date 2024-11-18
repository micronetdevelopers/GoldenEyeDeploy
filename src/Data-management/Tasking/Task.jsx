import { useEffect, useState } from "react";
import TabHeader from '../../reusablecomponents/TabHeader/TabHeader'
import { ReactComponent as OneDay } from "../../assets/Icons/sidebar-icons/oneDay.svg";
import { ReactComponent as OneNow } from "../../assets/Icons/sidebar-icons/oneNow.svg";
import { ReactComponent as OnePlan } from "../../assets/Icons/sidebar-icons/onePlan.svg";
import { ReactComponent as BackArrow } from "../../assets/Icons/sidebar-icons//back.svg";

import "./Task.css"

import {
    Card,
    Col,
    DatePicker,
    Divider,
    Row,
    Select,
    Space,
    Spin,
    Typography,
} from "antd";


import {
    CardHeader,
    OneDayComponent,
    OneNowComponent,
    OnePlanComponent,
    TaskingFormComponent,
    dateAfterOneMonth,
    todayDate,
    dateAfterOneMonth1,
    OneDayViewmore
} from "./SearchComponents/SearchComponents";
import dayjs from "dayjs";
import { Fill, Stroke, Style } from "ol/style";
import { sidebarIcon } from '../../constant';
import { useDatawithpost } from '../../hooks';
import { useUser } from '../../Auth/AuthProvider/AuthContext';
import MultiStepForm from "./SearchComponents/MultiStepForm";

const Search = ({ vectorLayerRef, toggleOffCanvas, isOpen, totalFeatures, activatePolygonLayer }) => {
    const { userName, access } = useUser()

    const [allfeature, setallFeatures] = useState(totalFeatures);
    const [selectedFeature, setSelectedFeature] = useState(null);
    
    useEffect(() => {
        if (allfeature.length > 0) {
            // Set to the last feature's featureId, or fallback to the first one's featureId
            setSelectedFeature(
                allfeature[allfeature.length - 1]?.featureId || allfeature[0]?.featureId
            );
        } else {
            // If no features are present, set to null
            setSelectedFeature(null);
        }
    }, [allfeature]);

    useEffect(() => {
        setallFeatures(totalFeatures)
    }, [totalFeatures])



    const [mission, setMission] = useState("")
    const [preTaskingOneDay, setPreTaskingOneDay] = useState([]);
    const [preTaskingOneNow, setPreTaskingOneNow] = useState([]);
    const [viewMoreState, setViewMoreState] = useState(false);
    const [customerReference, setCustomerReference] = useState()
    const [componentValues, setComponentValues] = useState();
    const [taskingComponentVisible, setTaskingComponentVisible] = useState(false);
    const [ErrorIsavailable, setErrorIsavailable] = useState("")


    const [formState, setFormState] = useState({
        aoi: [], // Initialize as an empty array
        acquisitionMode: "MONO",
        maxCloudCover: 10,
        maxIncidenceAngle: 50,
        acquisitionStartDate: new Date().toJSON(),
        acquisitionEndDate: dateAfterOneMonth1(),
        missions: ["PLEIADES", "SPOT"],
    });
    
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

    const payload = {
        acquisitionStartDate: formState.acquisitionStartDate,
        acquisitionEndDate: formState.acquisitionEndDate,
        missions: formState.missions,
        progTypeNames: ["ONEDAY", "ONENOW", "ONEPLAN"],
        acquisitionMode: formState.acquisitionMode,
        maxCloudCover: formState.maxCloudCover,
        maxIncidenceAngle: formState.maxIncidenceAngle,
        aoi: {
            type: "Polygon",
            coordinates: formState.aoi,
        },
    };

    const { data, isLoading, isError, error } = useDatawithpost(`providers/airbus/${userName}/tasking/attempts`, payload, ["LIST_PLAN", formState], isOpen);


   
    // Call mutate and handle success directly in the function
    useEffect(() => {
        if (data && data.progCapacities) {
            const { progCapacities } = data; // Access the progCapacities directly

            let spotPladiesWithOneDay = [];
            let spotPladiesWithOneNOW = [];

            if (progCapacities.length === 1) {
                // Ensure progTypes exists before accessing it
                if (progCapacities[0]?.progTypes?.length > 1) {
                    spotPladiesWithOneDay = [progCapacities[0].progTypes[0]];
                    spotPladiesWithOneNOW = [progCapacities[0].progTypes[1]];
                }
            } else {
                // Ensure that progTypes exists before mapping
                spotPladiesWithOneDay = progCapacities.map((capacity) => capacity.progTypes[0]);
                spotPladiesWithOneNOW = progCapacities.map((capacity) => capacity.progTypes[1]);
            }

            setPreTaskingOneNow(spotPladiesWithOneNOW);
            setPreTaskingOneDay(spotPladiesWithOneDay);
        }
    }, [data, setPreTaskingOneDay, setPreTaskingOneNow]);



    const disabledDate = (current) => {
        return current && current < new Date().setHours(0, 0, 0, 0);
    };

    const onChangeSensor = (id) => {
      
        if (id === "ALL") {
            setFormState(prevState => ({ ...prevState, missions: ["PLEIADES", "SPOT"] }))
        } else {
            setFormState(prevState => ({ ...prevState, missions: [id] }))
        }
    }

    const onChangeIncidenceAngle = (id) => {
        setFormState(prevState => ({ ...prevState, maxIncidenceAngle: id }))
    }
    const onChangeMaxCloudCover = (id) => {
        setFormState(prevState => ({ ...prevState, maxCloudCover: id }))
    }
    const onChangeAcquisitionMode = (id) => {
        setFormState(prevState => ({ ...prevState, acquisitionMode: id }))
    }
    const onChangeAcquationStartDate = (date) => {
        setFormState(prevState => ({ ...prevState, acquisitionStartDate: date }))
    }
    const onChangeAcquationEndDate = (date) => {
        setFormState(prevState => ({ ...prevState, acquisitionEndDate: date }))

    }




 // Update `aoi` when `allfeature` changes
useEffect(() => {
    if (allfeature.length > 0) {
        const lastFeature = allfeature[allfeature.length - 1]?.feature;
        const coordinates = lastFeature?.getGeometry()?.getCoordinates();

        setFormState((prevState) => ({
            ...prevState,
            aoi: coordinates || [],
        }));

        setCustomerReference(lastFeature );
    }
}, [allfeature]);






    // Handler for selecting polygons
    const onChangePolygon = (value) => {
        setSelectedFeature(value);
        const selectedFeature = allfeature.find((feature) => feature.featureId === value);

        if (selectedFeature) {
            setFormState((prevState) => ({
                ...prevState,
                aoi: selectedFeature.feature.getGeometry().getCoordinates(),
            }));

            setCustomerReference(selectedFeature.feature);
            activatePolygonLayer(selectedFeature.featureId);
        }
    };

    useEffect(() => {
        if (preTaskingOneDay) {
            const errorAvailable = preTaskingOneDay.some((oneDay) => oneDay.available);

            setErrorIsavailable(errorAvailable);
        }
    }, [preTaskingOneDay]);



    useEffect(() => {

        if (vectorLayerRef.current && vectorLayerRef.current.context && vectorLayerRef.current.context.map) {
            const mapView = vectorLayerRef.current.context.map.getView();
            try {
                const featureExtent = selectedFeature.feature.getGeometry().getExtent();
                mapView.fit(featureExtent, {
                    duration: 1250,
                    padding: [200, 200, 200, 200],
                });
            } catch (error) {
                console.error('Error fitting map view:', error);
            }
        } else {
            console.error('Map reference is not valid');
        }

    }, [isOpen])




    return (
        <>
            <div
                className={`mt-[65px] h-[calc(100vh-180px)]  absolute max-w-6xl z-30 bg-white 
                    rounded-sm transform transition-transform duration-300 ease-in-out
                     ${isOpen ? "translate-x-0 md:left-[4.7%] lg:left-[4.7%] xl:left-[3.8%] 2xl:left-[2.9%] " : "-translate-x-full"
                    }`}
            >

                <TabHeader
                    headingTitle="Tasking"
                    imgSrc={sidebarIcon.GE_Cancel_128}
                    imgCancle={sidebarIcon.GE_Cancel_128}
                    alt="search"
                    toggleOffCanvas={toggleOffCanvas}
                />


                {allfeature.length === 0 ? <>
                    <div style={{ display: "flex", flexDirection: "row", placeContent: "center", placeItems: "center" }}>
                        <Typography className="px-6 py-3 text-blue-600" style={{ fontFamily: "1.25rem", fontWeight: "bolder" }}>Please Create or Select AOI for Tasking!</Typography>
                    </div>
                </> : <>{taskingComponentVisible === true ? <></> : <>
                    <div
                        className=''
                    >
                        <div className='wrapper bg-[#167dde] p-2'>
                            <Space  >

                                <Select
                                    value={selectedFeature} // Bind the selected value to the current state
                                    showArrow={true}
                                    style={{ width: "10rem", color: 'white' }}
                                    onChange={onChangePolygon}
                                    className="custom-select"


                                >
                                    {allfeature.map((item, index) => (
                                        <Select.Option key={index} value={item.featureId}>
                                            {item.featureId}
                                        </Select.Option>
                                    ))}
                                </Select>

                                <DatePicker
                                    className="custom_select_date"
                                    onChange={(dateString) => {
                                        const day = dayjs(dateString, "DD/MM/YYYY");
                                        const jsonDate = day.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                                        onChangeAcquationStartDate(jsonDate);
                                    }}
                                    defaultValue={dayjs(todayDate(), dateFormatList[0])}
                                    format={dateFormatList}
                                    disabledDate={disabledDate}
                                />

                                <DatePicker
                                    className="custom_select_date"
                                    onChange={(dateString) => {
                                        const day = dayjs(dateString, "DD/MM/YYYY");
                                        const jsonDate = day.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
                                        onChangeAcquationEndDate(jsonDate);
                                    }}
                                    defaultValue={dayjs(dateAfterOneMonth(), dateFormatList[0])}
                                    format={dateFormatList}
                                    disabledDate={disabledDate}
                                />
                            </Space>
                        </div>

                        <div className='p-2 flex justify-end'>
                            <Space>
                                <Select onChange={onChangeSensor} style={{ width: "8rem" }} defaultValue={"ALL"} suffixIcon={"Sensor"}>
                                    <Select.Option value={"ALL"}>ALL </Select.Option>
                                    <Select.Option value={"PLEIADES"}>PLEIADES </Select.Option>
                                    <Select.Option value={"SPOT"}>SPOT </Select.Option>
                                    <Select.Option disabled value={"PLEIADES NEO"}>PLEIADES NEO</Select.Option>
                                </Select>
                                <Select onChange={onChangeIncidenceAngle} defaultValue={50} style={{ width: "9rem" }} suffixIcon={"Incidence Angle"}>
                                    <Select.Option value={20}>20≥</Select.Option>
                                    <Select.Option value={30}>30≥</Select.Option>
                                    <Select.Option value={50}>50≥</Select.Option>
                                </Select>
                                <Select onChange={onChangeMaxCloudCover} style={{ width: "10rem" }} defaultValue={10} suffixIcon={"Cloud Coverage(%)"}>
                                    <Select.Option value={5}>5≥</Select.Option>
                                    <Select.Option value={10}>10≥</Select.Option>
                                    <Select.Option value={20}>20≥</Select.Option>
                                </Select>
                                <Select onChange={onChangeAcquisitionMode} style={{ width: "11.5rem" }} defaultValue={"MONO"} suffixIcon={"Acquisition Mode"}>
                                    <Select.Option value={"MONO"}>MONO</Select.Option>
                                    <Select.Option value={"STEREO"}>STEREO</Select.Option>
                                    <Select.Option value={"TRISTEREO"}>TRISTEREO</Select.Option>
                                </Select>
                            </Space>
                        </div>
                    </div></>}

                    {taskingComponentVisible ? (
                        <>
                            <MultiStepForm
                                componentValues={componentValues}
                                customerReference={customerReference}
                                mission={mission}
                                formState={formState}
                                access={access}
                                userName={userName}
                                onBack={() => setTaskingComponentVisible((prevState) => !prevState)}
                                toggleOffCanvas={toggleOffCanvas}

                            />

                            {/* <TaskingFormComponent
                                componentValues={componentValues}
                                customerReference={customerReference}
                                mission={mission} formState={formState}
                                access={access}
                                userName={userName}
                                onBack={() => setTaskingComponentVisible((prevState) => !prevState)}
                            /> */}
                        </>
                    ) : (
                        <>
                            <Row className='p-2' gutter={16}>
                                {!viewMoreState && (
                                    <Col span={13} >
                                        <Card

                                            headStyle={{ backgroundColor: "#167dde1a" }}
                                            style={{

                                                height: "100%",
                                                border: "1px solid #ccc",

                                            }}
                                            title={
                                                <CardHeader
                                                    viewMoreState={viewMoreState}
                                                    SvgHeader={<OneDay />}
                                                    content={"Select your acquisition day"}
                                                    cloudCoverage={"No cloud coverage check"}
                                                    planName={"oneDay"}
                                                />
                                            }
                                            bordered={false}
                                            hoverable={true}
                                        >
                                            {isLoading ? (
                                                <><Spin className="flex items-center justify-center" tip="Loading.." /></>
                                            ) : (
                                                <>

                                                    <>
                                                        {preTaskingOneDay?.map((oneDay) => {


                                                            return (<>
                                                                <OneDayComponent
                                                                    availiblity={oneDay.available}
                                                                    errors={oneDay.available ? [] : oneDay.errors}
                                                                    type={oneDay.mission}
                                                                    segmentKey={oneDay.available ?
                                                                        oneDay.segments
                                                                        : ""}
                                                                    customerReference={customerReference}
                                                                    formState={formState}
                                                                    onSelect={(onSelectItem) => {
                                                                        setComponentValues(onSelectItem);
                                                                        setTaskingComponentVisible(true);
                                                                        setMission(oneDay)
                                                                    }}
                                                                />
                                                                {oneDay.mission === "SPOT" ? <><Divider /></> : <></>}
                                                                {oneDay.mission === "PLEIADESNEO" ? <><Divider /></> : <></>}
                                                            </>)
                                                        })}

                                                    </>


                                                    {
                                                        ErrorIsavailable && (
                                                            < div
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    placeContent: "center",
                                                                    placeItems: "center",
                                                                }}
                                                            >
                                                                <button
                                                                    className="text-xs font-bold mt-2 text-[#167dde] uppercase"
                                                                    onClick={() => setViewMoreState((prevState) => !prevState)}
                                                                >
                                                                    VIEW MORE
                                                                </button>
                                                            </div>
                                                        )

                                                    }




                                                </>
                                            )}
                                        </Card>
                                    </Col>
                                )}

                                {viewMoreState ? (
                                    <>
                                        <Col span={viewMoreState ? 24 : 12} >
                                            <Card
                                                className="ViewCardBody"
                                                headStyle={{ backgroundColor: "#167dde1a" }}
                                                style={{
                                                    margin: "0.5rem",
                                                    height: "100%",
                                                    border: "1px solid #ccc",

                                                }}
                                                title={
                                                    <CardHeader
                                                        backToCard={() => setViewMoreState((prevState) => !prevState)}
                                                        backArrow={<BackArrow />}
                                                        SvgHeader={<OneDay />}
                                                        content={"Select your acquisition day"}
                                                        cloudCoverage={"No cloud coverage check"}
                                                        planName={"oneDay"}
                                                    />
                                                }
                                                bordered={false}
                                                hoverable={true}
                                            >
                                                {isLoading ? (
                                                    <><Spin tip="Loading.." /></>
                                                ) : (
                                                    <>
                                                        <>


                                                            {preTaskingOneDay?.map((oneDay) => {
                                                                return (<>

                                                                    <OneDayViewmore
                                                                        availiblity={oneDay.available}
                                                                        type={oneDay.mission}
                                                                        viewMoreState={viewMoreState}
                                                                        formState={formState}
                                                                        segmentKey={oneDay.available ?
                                                                            oneDay.segments
                                                                            : ""}
                                                                        onSelect={(onSelectItem) => {
                                                                            setComponentValues(onSelectItem);
                                                                            setTaskingComponentVisible(true);
                                                                            setMission(oneDay)
                                                                        }}
                                                                    />

                                                                    {oneDay.mission === "SPOT" ? <><Divider /></> : <></>}
                                                                    {oneDay.mission === "PLEIADESNEO" ? <><Divider /></> : <></>}
                                                                </>)
                                                            })}

                                                        </>



                                                    </>
                                                )}
                                            </Card>
                                        </Col>
                                    </>
                                ) : (
                                    <>
                                        {/* <Col span={8}>
                                            <Card
                                                headStyle={{ backgroundColor: "#167dde1a" }}
                                                style={{
                                                    margin: "0.5rem",
                                                    height: "100%",
                                                    border: "1px solid #ccc",
                                                }}
                                                title={
                                                    <CardHeader
                                                        SvgHeader={<OneNow />}
                                                        content={"Access useful information in an instant"}
                                                        cloudCoverage={"Up to 10%"}
                                                        planName={"oneNow"}
                                                    />
                                                }
                                                hoverable={true}
                                                bordered={false}
                                            >
                                                {loading ? (
                                                    <><Spin tip="Loading.." /></>
                                                ) : (
                                                    <>
                                                        {preTaskingOneNow.map((oneNow) => {
                                                            return (<>
                                                                <OneNowComponent
                                                                    availiblity={oneNow.available}
                                                                    errors={oneNow.available ? [] : oneNow.errors}
                                                                    type={oneNow.mission}
                                                                    segmentKey={oneNow.available ?
                                                                        oneNow.segments
                                                                        : ""}
                                                                    customerReference={customerReference}
                                                                    formState={formState}
                                                                    onSelect={() => {
                                                                        setMission(oneNow)
                                                                        setComponentValues(oneNow.segments);
                                                                        setTaskingComponentVisible(true);

                                                                    }}
                                                                />
                                                                {oneNow.mission === "SPOT" ? <><Divider /></> : <></>}
                                                                {oneNow.mission === "PLEIADESNEO" ? <><Divider /></> : <></>}

                                                            </>)
                                                        })}
                                                    </>
                                                )}
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                headStyle={{ backgroundColor: "#167dde1a" }}
                                                style={{
                                                    margin: "0.5rem",
                                                    height: "100%",
                                                    border: "1px solid #ccc",
                                                }}
                                                title={
                                                    <CardHeader
                                                        SvgHeader={<OnePlan />}
                                                        content={
                                                            "Acquire qualified coverage within agreed timeframe"
                                                        }
                                                        cloudCoverage={"According to your need"}
                                                        planName={"OnePlan"}
                                                    />
                                                }
                                                hoverable={true}
                                                bordered={false}
                                            >
                                                <OnePlanComponent customerReference={
                                                    customerReference === undefined ? selectedFeature :
                                                        customerReference} formState={formState}

                                                />
                                            </Card>
                                        </Col> */}
                                    </>
                                )}
                            </Row>
                        </>
                    )}</>}

            </div >
        </>
    );
};

export default Search;
