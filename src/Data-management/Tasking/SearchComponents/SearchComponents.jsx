import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Spin,
    Steps,
    Tag,
    Timeline,
    Typography,
    theme,
} from "antd";
import { ReactComponent as Angle } from "../../../assets/Icons/sidebar-icons/angle.svg";
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON';
import { getArea } from 'ol/sphere'; // Example if you're using the getArea method
import { Polygon } from 'ol/geom';


import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../Auth/AuthProvider/AuthContext";

export const CardHeader = ({ viewMoreState, backToCard, backArrow, SvgHeader, content, cloudCoverage, planName }) => {
    return (
        <>
            <div
                className="main-Header"
                style={{
                    margin: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    placeContent: "space-between",
                }}
            >
                <div className="icon-header">
                    <div className="flex items-center gap-2">
                        {backArrow && <span className="text-blue-500 w-5 h-5" onClick={backToCard}>  {backArrow}</span>}
                        {SvgHeader}
                    </div>
                    <Typography

                        style={{
                            color: "#167dde",
                            fontSize: "75%",
                            fontWeight: 400,
                            ...(viewMoreState ? { margin: ".3rem 1.5rem", } : { margin: ".4rem 0", }),
                        }}
                    >
                        {content}
                    </Typography>
                </div>
                <div
                    className="cloud-coverage"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "space-between",
                        placeItems: "flex-end",
                    }}
                >
                    <Typography
                        style={{
                            color: "#167dde",
                            fontSize: "75%",
                            fontWeight: 400,
                            margin: "0 0.325rem 0 0",
                        }}
                    >
                        Cloud coverage
                    </Typography>
                    <Typography
                        style={{
                            color: planName === "oneDay" ? "#f5a623" : "#167dde",
                            fontSize: "75%",
                            fontWeight: 500,
                            margin: ".0 0.325rem 0 0",
                        }}
                    >
                        {cloudCoverage}
                    </Typography>
                </div>
            </div>
        </>
    );
};


export const OneDayComponent = ({

    type,
    segmentKey,
    viewMore,
    onSelect,
    availiblity,
    errors,
    customerReference,
    formState,
}) => {
    const [price, setPrice] = useState();
    const [loading, setLoading] = useState(true);
    const { userName, access } = useUser()

    const getPrice = async () => {
        await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/admin/tasking/price`,
                priceJSON(
                    customerReference.getId(),
                    formState.aoi,
                    type === "SPOT" ? "SpotTaskingOneDay" : "PleiadesTaskingOneDay",
                    formState.acquisitionMode,
                    formState.acquisitionStartDate,
                    formState.acquisitionEndDate,
                    "Pricecheck",
                    segmentKey.segmentKey,
                    "pansharpened_natural_color",
                    "basic",
                    "dimap_jpeg2000_regular",
                    "8bits",
                    "ortho",
                    4326,
                    "standard",
                    "best_available",
                    "standard",
                    { userName },
                    "",
                    "",
                    ""
                ),
                {
                    headers: {
                        Authorization: `Bearer ${access}`, // Pass the token in the Authorization header
                    },
                }

            )
            .then((res) => {

                // console.log(res, "_____res")
                setPrice(res.data.totalAmount);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };
    useEffect(() => {
        // getPrice()
    }, []);


    return (


        <>
            <div className={` `}>



                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        placeContent: "flex-start",
                        placeItems: "center",
                    }}
                >
                    <Typography style={{ fontWeight: 700, fontSize: "80%" }}>
                        {type}
                    </Typography>
                    <Tag
                        style={{
                            borderRadius: "1.5rem",
                            color: "#888",
                            background: "#eee",
                            fontSize: "60%",
                            lineHeight: ".8rem",
                            marginRight: "0.5rem",
                            marginTop: "0.2rem",
                            marginLeft: "0.5rem",
                            padding: "0.125rem 0.5rem",
                        }}
                    >
                        DIRECT TO SATELLITE
                    </Tag>
                </div>
                {/* {availiblity ? (
                    <>
                        <div>
                            <Typography style={{ color: "#6cbe20", fontWeight: "500" }}>
                                {loading ? <><Spin /></> : <> {price} €</>}
                            </Typography>
                        </div>
                    </>
                ) : (
                    <></>
                )} */}


                <div className={` flex flex-wrap flex-row justify-start gap-5 `}>

                    {segmentKey.length > 0 ? (
                        segmentKey
                            ?.slice(0, 1)
                            .map((item, index) => (
                                <>
                                    {availiblity ? (
                                        <div className={` "border-r pr-3" `}>
                                            {/* Acquisition start date */}
                                            <div
                                                className="flex items-center"
                                            >
                                                <div
                                                    style={{
                                                        content: "",
                                                        display: "inline-block",
                                                        border: "2px solid rgba(22,125,222,.5)",
                                                        borderRadius: "50%",
                                                        height: "0.5rem",
                                                        margin: "0 0.5rem 0 0",
                                                        width: "0.5rem",
                                                    }}
                                                />
                                                <Typography style={{ fontSize: "90%" }}>
                                                    {dateConvertForTasking(item?.acquisitionStartDate)}
                                                </Typography>
                                            </div>

                                            {/* Incidence angle */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    placeItems: "center",
                                                }}
                                            >
                                                <div style={{ height: "1rem", width: "1rem" }}>
                                                    <Angle className="h-4 w-4" />
                                                </div>
                                                <Typography
                                                    style={{
                                                        color: "#00000094",
                                                        fontSize: "90%",
                                                        lineHeight: "1.25rem",
                                                        marginLeft: "0.5rem",
                                                    }}
                                                >
                                                    Incidence angle:
                                                </Typography>
                                                <Typography
                                                    style={{
                                                        color: "#000000de",
                                                        fontSize: "90%",
                                                        lineHeight: "1.25rem",
                                                        fontWeight: "700",
                                                        marginLeft: "0.5rem",
                                                    }}
                                                >
                                                    {`${Math.abs(
                                                        parseFloat(item.acrossTrackIncidenceAngle.toFixed(2))
                                                    )} - °${formState.maxIncidenceAngle}°`}
                                                </Typography>
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex mt-2 items-center gap-2">
                                                <Button type="primary" size="small" onClick={() => onSelect(item)}>
                                                    SELECT
                                                </Button>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        placeContent: "center",
                                                        placeItems: "center",
                                                        margin: "5px",
                                                    }}
                                                >
                                                    <Typography className="text-[000000de] italic text-sm">
                                                        Order deadline:
                                                    </Typography>
                                                    <Typography
                                                        style={{
                                                            fontSize: "90%",
                                                            fontStyle: "italic",
                                                            fontWeight: 300,
                                                            color: "#000000de",
                                                        }}
                                                    >
                                                        {`${dateConvertForTasking(item.orderDeadline)} (UTC)`}
                                                    </Typography>
                                                </div>
                                            </div>


                                        </div>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                </>
                            ))
                    ) : (

                        errors.length > 0 && (

                            <div>
                                <p style={{ padding: 0, margin: 0 }}>
                                    For the Direct to satellite tasking
                                </p>
                                <strong style={{ padding: 0, margin: 0 }}>
                                    please adjust your parameters
                                </strong>

                                <div
                                    style={{
                                        background: "rgba( 255, 69, 0, .07 )",
                                        borderRadius: "6px",
                                        fontSize: ".75rem",
                                        listStyle: "none",
                                        margin: "0.25rem 0",
                                        padding: "0.7rem 0.875rem",
                                    }}
                                >
                                    {errors.map((error, errorIndex) => (
                                        <div
                                            key={errorIndex}
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                            }}
                                        >
                                            <Typography style={{ fontSize: "90%", color: "#000000de" }}>
                                                {maxMinError(error.code)}
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontSize: "90%",
                                                    color: "#ff4500",
                                                    fontWeight: 600,
                                                    paddingLeft: "0.5rem",
                                                }}
                                            >
                                                {`${error.message}${error.code.match(/AREA/g) ? "km2" : "km"}`}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>
        </>


    );
};






export const OneNowComponent = ({
    type,
    onSelect,
    availiblity,
    errors,
    segmentKey,
    customerReference,
    formState,
}) => {
    const [price, setPrice] = useState();
    const [loading, setLoading] = useState(true);
    const { userName, access } = useUser()


    const getPrice = async () => {
        await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/price`,
                priceJSON(
                    customerReference.getId(),
                    formState.aoi,
                    type === "SPOT" ? "SpotTaskingOneNow" : "PleiadesTaskingOneNow",
                    formState.acquisitionMode,
                    formState.acquisitionStartDate,
                    formState.acquisitionEndDate,
                    "Pricecheck",
                    segmentKey[0].segmentKey,
                    "pansharpened_natural_color",
                    "basic",
                    "dimap_jpeg2000_regular",
                    "8bits",
                    "ortho",
                    4326,
                    "standard",
                    "best_available",
                    "standard",
                    { userName },
                    "",
                    "",
                    ""
                ), {
                headers: {
                    Authorization: `Bearer ${access}`, // Pass the token in the Authorization header
                },
            }
            )
            .then((res) => {
                setPrice(res.data.totalAmount);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };
    useEffect(() => {
        // getPrice()
    }, []);
    return (
        <>
            <>
                <div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            placeContent: "space-between",
                            placeItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                placeContent: "flex-start",
                                placeItems: "center",
                            }}
                        >
                            <Typography style={{ fontWeight: 700, fontSize: "80%" }}>
                                {type}
                            </Typography>
                            <Tag
                                style={{
                                    borderRadius: "1.5rem",
                                    color: "#888",
                                    background: "#eee",
                                    fontSize: "60%",
                                    lineHeight: ".8rem",
                                    marginRight: "0.5rem",
                                    marginTop: "0.2rem",
                                    marginLeft: "0.5rem",
                                    padding: "0.125rem 0.5rem",
                                }}
                            >
                                DIRECT TO SATELLITE
                            </Tag>
                        </div>
                        {availiblity ? (
                            <>
                                <div>
                                    <Typography style={{ color: "#6cbe20", fontWeight: "500" }}>
                                        {/* {loading ? <><Spin /></> : <> {price} €</>} */}
                                    </Typography>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    {availiblity ? (
                        <>
                            <div style={{ marginTop: "0.5rem" }}>
                                <Timeline

                                    style={{
                                        height: "4.5rem",
                                    }}
                                    items={segmentKey.map((el) => {
                                        return {
                                            children: (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        placeContent: "flex-start",
                                                        placeItems: "center",
                                                    }}
                                                >
                                                    <Typography style={{ fontSize: "90%" }}>
                                                        {dateConvertForTasking(el.acquisitionStartDate)}
                                                    </Typography>
                                                    <Typography
                                                        style={{
                                                            color: "#000000de",
                                                            fontSize: "90%",
                                                            lineHeight: "1.25rem",
                                                            fontWeight: "700",
                                                            marginLeft: "0.5rem",
                                                        }}
                                                    >
                                                        {`${Math.abs(
                                                            parseFloat(
                                                                el.acrossTrackIncidenceAngle.toFixed(2)
                                                            )
                                                        )}° - 50°`}
                                                    </Typography>
                                                </div>
                                            ),
                                        };
                                    })}
                                />
                            </div>
                            <div
                                className="flex mt-4 items-center gap-4"
                            >
                                <Button onClick={onSelect} type="primary" size="small">
                                    SELECT
                                </Button>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        placeContent: "center",
                                        placeItems: "center",
                                        marginLeft: "5px",
                                    }}
                                >
                                    <Typography
                                        style={{
                                            fontSize: "90%",
                                            fontStyle: "italic",
                                            fontWeight: 300,
                                            color: "#000000de",
                                        }}
                                    >
                                        Order deadline:
                                    </Typography>
                                    <Typography
                                        style={{
                                            fontSize: "90%",
                                            fontStyle: "italic",
                                            fontWeight: 300,
                                            color: "#000000de",
                                        }}
                                    >
                                        {dateConvertForTasking(segmentKey[0].orderDeadline)} (UTC)
                                    </Typography>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ padding: 0, margin: 0 }}>
                                For the Direct to satellite tasking
                            </p>
                            <strong style={{ padding: 0, margin: 0 }}>
                                {" "}
                                please adjust your parameters
                            </strong>
                            <div
                                style={{
                                    background: "rgba( 255, 69, 0, .07 )",
                                    borderRadius: "6px",
                                    fontSize: "90%",

                                    listStyle: "none",
                                    margin: "0.25rem 0",
                                    padding: "0.7rem 0.875rem",
                                }}
                            >
                                {errors.map((error) => {
                                    return (
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <Typography
                                                style={{
                                                    fontSize: "90%",
                                                    color: "#000000de",
                                                }}
                                            >
                                                {maxMinError(error.code)}
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontSize: "90%",

                                                    color: "#ff4500",
                                                    fontWeight: 600,
                                                    paddingLeft: "0.5rem",
                                                }}
                                            >{`${error.message}${error.code.match(/AREA/g) ? "km2" : "km"
                                                }`}</Typography>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </>
        </>
    );
};


export const OnePlanComponent = ({ formState, customerReference }) => {
    const { userName, access } = useUser()

    const [onePlanFeasibility, setOnePlanFeasibility] = useState([]);
    const [price, setPrice] = useState();
    const [loading, setLoading] = useState(true);
    let data = {
        aoi: {
            type: "Polygon",
            coordinates: formState.aoi,
        },
        acquisitionMode: formState.acquisitionMode,
        maxCloudCover: formState.maxCloudCover,
        maxIncidenceAngle: formState.maxIncidenceAngle,
        acquisitionStartDate: formState.acquisitionStartDate,
        acquisitionEndDate: formState.acquisitionEndDate,
        missions: formState.missions,
    };
    const getPrice1 = async (type, type1, type2) => {
        await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/price`,
                priceJSON(
                    customerReference.getId(),
                    formState.aoi,
                    "PleiadesTaskingOnePlan",
                    formState.acquisitionMode,
                    formState.acquisitionStartDate,
                    formState.acquisitionEndDate,
                    "Pricecheck",
                    "",
                    "pansharpened_natural_color",
                    "basic",
                    "dimap_jpeg2000_regular",
                    "8bits",
                    "ortho",
                    4326,
                    "standard",
                    "best_available",
                    "standard",
                    { userName },
                    type,
                    type1,
                    type2
                )
            )
            .then((res) => {
                setPrice(res.data.totalAmount);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    const checkFeasibility = async () => {
        setLoading(true);
        await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/feasibility`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${access}`, // Pass the token in the Authorization header
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    // getPrice1(res.data.progCapacities[0].progTypes[0].feasibility.automationName, res.data.progCapacities[0].progTypes[0].feasibility.automation, res.data.progCapacities[0].progTypes[0].feasibility.classification)
                    setOnePlanFeasibility(res.data.progCapacities);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        checkFeasibility();
    }, []);


    return (
        <>
            <>
                <div>
                    <div>
                        <Timeline
                            style={{
                                height: "6rem",
                            }}
                            pendingDot={
                                <div
                                    style={{
                                        content: "",
                                        borderBottom: "2px solid rgba(22,125,222,.5)",
                                        borderRight: "2px solid rgba(22,125,222,.5)",
                                        height: "0.5rem",
                                        left: "2px",
                                        top: "1.575rem",
                                        transform: "rotate( 45deg )",
                                        width: "0.5rem",
                                    }}
                                ></div>
                            }
                            pending={
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        placeContent: "flex-start",
                                        placeItems: "center",
                                    }}
                                >
                                    <Typography style={{ fontSize: "90%" }}>
                                        {dateConvertForTasking(formState.acquisitionEndDate, false)}
                                    </Typography>
                                </div>
                            }
                            items={[
                                {
                                    children: (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                placeContent: "flex-start",
                                                placeItems: "center",
                                            }}
                                        >
                                            <Typography style={{ fontSize: "90%" }}>
                                                {dateConvertForTasking(
                                                    formState.acquisitionStartDate,
                                                    false
                                                )}
                                            </Typography>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                        <div style={{ display: "flex", margin: "0.25rem 0.25rem" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    placeItems: "center",
                                }}
                            >
                                <div style={{ width: "1rem", height: "1rem" }}>
                                    {" "}
                                    <Angle className="h-4 w-4" />
                                </div>
                                <Typography
                                    style={{
                                        color: "#00000094",
                                        fontSize: "80%",
                                        lineHeight: "1.25rem",
                                        marginLeft: "0.25rem",
                                    }}
                                >
                                    Incidence angle:
                                </Typography>
                                <Typography
                                    style={{
                                        color: "#000000de",
                                        fontSize: "80%",
                                        lineHeight: "1.25rem",
                                        fontWeight: "700",
                                        marginLeft: "0.25rem",
                                    }}
                                >
                                    ≤ {formState.maxIncidenceAngle}°
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    placeItems: "center",
                                }}
                            >
                                <div style={{ width: "1rem", height: "1rem" }}>
                                    <img
                                        alt="cloud"
                                        src={require("../../../assets/Icons/sidebar-icons/cloud (2).png")}
                                        width={18}
                                        height={18}
                                    />
                                </div>
                                <Typography
                                    style={{
                                        color: "#00000094",
                                        fontSize: "80%",
                                        lineHeight: "1.25rem",
                                        marginLeft: "0.25rem",
                                    }}
                                >
                                    Cloud coverage:
                                </Typography>
                                <Typography
                                    style={{
                                        color: "#000000de",
                                        fontSize: "80%",
                                        lineHeight: "1.25rem",
                                        fontWeight: "700",
                                        marginLeft: "0.25rem",
                                    }}
                                >
                                    ≤ {formState.maxCloudCover}%
                                </Typography>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                placeItems: "center",
                                marginLeft: "0.25rem",
                                marginBottom: "1rem",
                            }}
                        >
                            <div style={{ width: "1rem", height: "1rem" }}>
                                {" "}
                                <img
                                    alt="cloud"
                                    src={require("../../../assets/Icons/sidebar-icons/picture.png")}
                                    width={18}
                                    height={18}
                                />{" "}
                            </div>
                            <Typography
                                style={{
                                    color: "#00000094",
                                    fontSize: "80%",
                                    lineHeight: "1.25rem",
                                    marginLeft: "0.5rem",
                                }}
                            >
                                Acquisition mode:
                            </Typography>
                            <Typography
                                style={{
                                    color: "#000000de",
                                    fontSize: "80%",
                                    lineHeight: "1.25rem",
                                    fontWeight: "700",
                                    marginLeft: "0.5rem",
                                }}
                            >
                                {formState.acquisitionMode}
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    {loading ? (
                        <></>
                    ) : (
                        <>
                            {onePlanFeasibility?.map((element) => {
                                return (
                                    <>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                placeContent: "space-between",
                                                placeItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    placeContent: "flex-start",
                                                    placeItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    style={{ fontWeight: 700, fontSize: "80%" }}
                                                >
                                                    {element.mission}
                                                </Typography>
                                                {element.progTypes[0].available === true ? (
                                                    <>
                                                        <Tag
                                                            style={{
                                                                borderRadius: "1.5rem",
                                                                color: "#888",
                                                                background: "#eee",
                                                                fontSize: ".525rem",
                                                                lineHeight: ".8rem",
                                                                marginRight: "0.5rem",
                                                                marginTop: "0.2rem",
                                                                marginLeft: "0.5rem",
                                                                padding: "0.125rem 0.5rem",
                                                            }}
                                                        >
                                                            DIRECT TO SATELLITE
                                                        </Tag>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            {element.progTypes[0].available === true ? (
                                                <>
                                                    <div>
                                                        <Typography
                                                            style={{
                                                                color: "#6cbe20",
                                                                fontWeight: "500",
                                                                fontSize: "80%",
                                                            }}
                                                        >
                                                            {/* {loading ? <><Spin /></> : <>{price}</>} € */}
                                                        </Typography>
                                                    </div>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "1rem",
                                            }}
                                        >
                                            <>
                                                <Typography
                                                    style={{
                                                        color: "#00000094",
                                                        fontSize: "80%",
                                                        lineHeight: "1.25rem",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    Classification:
                                                </Typography>
                                                <Typography
                                                    style={{
                                                        color: "#000000de",
                                                        fontSize: "80%",
                                                        lineHeight: "1.25rem",
                                                        marginLeft: "0.5rem",
                                                    }}
                                                >
                                                    {element.progTypes[0].feasibility.classification ===
                                                        "Easy" ? (
                                                        <> OnePlan</>
                                                    ) : (
                                                        <> OnePlan Pro</>
                                                    )}
                                                </Typography>
                                            </>
                                        </div>
                                        <div
                                            style={{
                                                margin: ".5rem auto 0",
                                                display: "flex",
                                                flexDirection: "row",
                                                placeItems: "center",
                                            }}
                                        >
                                            <Button type="primary" size="small">
                                                SELECT
                                            </Button>
                                        </div>
                                        {element.mission === "SPOT" ? (
                                            <>
                                                {" "}
                                                <Divider />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                );
                            })}
                        </>
                    )}
                </div>
            </>
        </>
    );
};




export const PriceComponent = ({
    componentValues,
    onSubmitValues,
    customerReference,
    currentStep,
    formState
}) => {

    const geometry = customerReference.getGeometry();
    const geojson = new GeoJSON().writeGeometryObject(geometry);
    const convertedArea = turf.area(geojson) / 1e6;

    // const onSubmitValuesArray = Object.keys(onSubmitValues).map((key) => {
    //     return {
    //         name: key,
    //         value: onSubmitValues[key],
    //     };
    // });

    return (
        <>
            <div className="bg-slate-100 py-4 h-[calc(100vh-220px)]">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "space-evenly",
                        marginLeft: "1rem",

                    }}
                >
                    <Typography
                        style={{
                            color: "#6cbe20",
                            fontSize: "x-large",
                        }}
                    >
                        {/* 4 600 € */}
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography
                            style={{
                                whiteSpace: "nowrap",
                                color: "#6cbe20",
                                fontSize: "12px",
                            }}
                        >
                            500 km² invoiced
                        </Typography>
                        <Typography
                            style={{
                                color: "#00000061",
                                fontSize: "12px",
                                marginLeft: "3px",
                            }}
                        >
                            (minimum order applied)
                        </Typography>
                    </div>
                </div>
                <Divider />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        placeContent: "space-evenly",
                        marginLeft: "1.5rem",
                        marginTop: "0.5rem",
                    }}
                >
                    <Typography style={{ color: "#167dde", fontWeight: "700" }}>
                        {onSubmitValues?.step2?.customerReference || customerReference.getId()}

                    </Typography>
                    <Typography
                        style={{
                            fontSize: ".75rem",
                            fontWeight: 300,
                            opacity: 0.54,
                            color: "#167dde",
                        }}
                    >

                        {`${convertedArea.toFixed(2)} km² `}
                    </Typography>
                </div>
                <Divider style={{ margin: "10px 0" }} />


                {componentValues.length === undefined ? (
                    <>
                        <div>
                            <Typography
                                style={{
                                    color: "#000000de",
                                    fontSize: "1rem",
                                    marginLeft: "1rem",
                                }}
                            >
                                {componentValues.id}
                            </Typography>
                            <Typography
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: 300,
                                    margin: "1rem 0 1rem 0.5rem",
                                    paddingLeft: "1.75rem",
                                    position: "relative",
                                }}
                            >
                                {dateConvertForTasking(componentValues.acquisitionStartDate)}
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    placeItems: "center",
                                }}
                            >
                                <Typography
                                    style={{
                                        color: "#00000094",
                                        fontSize: ".8rem",
                                        lineHeight: ".5rem",
                                        marginLeft: "1.25rem",
                                    }}
                                >
                                    Incidence angle:
                                </Typography>
                                <Typography
                                    style={{
                                        color: "#000000de",
                                        fontSize: ".8125rem",
                                        lineHeight: "1.25rem",
                                        fontWeight: "700",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    {`${Math.abs(
                                        parseFloat(
                                            componentValues.acrossTrackIncidenceAngle.toFixed(2)
                                        )
                                    )} - °${formState.maxIncidenceAngle}°`}
                                </Typography>
                            </div>
                            {componentValues.acrossTrackIncidenceAngle > 20 ? (
                                <></>
                            ) : (
                                <>
                                    <div>
                                        <Typography
                                            style={{
                                                color: "#f5a623",
                                                display: "block",
                                                gridColumn: "span 2",
                                                margin: "0.25rem 0",
                                                paddingLeft: "1.25rem",
                                            }}
                                        >
                                            Be aware that geometric quality can be deteriorated if you
                                            associate an ortho processing level with an incidence angle{" "}
                                            {`>`} 20°
                                        </Typography>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {componentValues.length > 0 ? (
                            <>
                                <Typography
                                    style={{
                                        color: "#000000de",
                                        fontSize: "1rem",
                                        marginLeft: "1rem",
                                    }}
                                >
                                    {componentValues.id}
                                </Typography>
                                <div style={{ margin: "0.5rem" }}>
                                    <Timeline
                                        style={{
                                            height: "6rem",
                                        }}
                                        items={componentValues.map((el) => {
                                            return {
                                                children: (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            placeContent: "flex-start",
                                                            placeItems: "center",
                                                        }}
                                                    >
                                                        <Typography>
                                                            {dateConvertForTasking(el.acquisitionStartDate)}
                                                        </Typography>
                                                        <Typography
                                                            style={{
                                                                color: "#000000de",
                                                                fontSize: ".8125rem",
                                                                lineHeight: "1.25rem",
                                                                fontWeight: "700",
                                                                marginLeft: "0.5rem",
                                                            }}
                                                        >
                                                            {`${Math.abs(
                                                                parseFloat(
                                                                    el.acrossTrackIncidenceAngle.toFixed(2)
                                                                )
                                                            )}° - 50°`}
                                                        </Typography>
                                                    </div>
                                                ),
                                            };
                                        })}
                                    />
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}

                <Divider style={{ margin: "10px 0" }} />

                {/* {onSubmitValuesArray.map((element) => {
                    return (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "56% 44%",
                                }}
                            >
                                <Typography
                                    style={{
                                        color: "#0000008a",
                                        fontWeight: 500,
                                        marginTop: "0.5rem",
                                        paddingLeft: "1.2rem",
                                        position: "relative",
                                        fontSize: ".8125rem",
                                    }}
                                >
                                    {removeFunction(element.name)}:
                                </Typography>
                                <Typography
                                    style={{
                                        marginTop: "0.5rem",
                                        paddingLeft: "0.25rem",
                                        fontSize: ".8125rem",
                                        color: "#000000de",
                                        fontWeight: 700,
                                    }}
                                >
                                    {element.value}
                                </Typography>
                            </div>
                        </>
                    );
                })} */}

                {
                    currentStep === 2 && (
                        <div>
                            {Object.entries(onSubmitValues.step1).map(([key, value]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "56% 44%",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <Typography
                                        style={{
                                            color: "#0000008a",
                                            fontWeight: 500,
                                            marginTop: "0.5rem",
                                            paddingLeft: "1.2rem",
                                            position: "relative",
                                            fontSize: ".8125rem",
                                        }}
                                    >
                                        {removeFunction(key)}:
                                    </Typography>
                                    <Typography
                                        style={{
                                            marginTop: "0.5rem",
                                            paddingLeft: "0.25rem",
                                            fontSize: ".8125rem",
                                            color: "#000000de",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    )
                }

            </div>


        </>
    );
};

export const Production = ({ optionResult, getSampleValues, inputs, onChange = () => { }, stepKey }) => {


    const { processing_level, projection_1, spectral_processing, dem, image_format, pixel_coding, radiometric_processing, licence } = inputs;

    function handleChange(inputKey) {
        return (event) => {
            onChange({ value: event.target.value, stepKey, inputKey });
        };
    }





    const handleSubmit = () => {
        // onSubmit(formData)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Geometric Processing</label>
                        <select
                            name="processing_level"
                            value={processing_level}
                            onChange={handleChange("processing_level")}
                            className="border border-gray-300 rounded-md p-2"
                        >

                            {optionResult(getSampleValues("processing_level"))}
                        </select>
                    </div>


                    {
                        processing_level !== "Primary" && (
                            <>
                                <div className="flex flex-col justify-between">
                                    <label className="block font-semibold">Projection Code</label>
                                    <select
                                        name="processing_level"
                                        value={projection_1}
                                        onChange={handleChange("projection_1")}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        {optionResult(getSampleValues("projection_1"))}
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                            </>
                        )
                    }
                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Spectral Bands Combination</label>
                        <select
                            name="spectral_processing"
                            value={spectral_processing}
                            onChange={handleChange("spectral_processing")}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {optionResult(getSampleValues("spectral_processing"))}

                            {/* Add more options as needed */}
                        </select>
                    </div>


                    {
                        processing_level !== "Projected" && processing_level !== "Primary" && (
                            <>

                                <div className="flex flex-col justify-between">
                                    <label className="block font-semibold">Orthorectification DEM Reference</label>
                                    <select
                                        name="dem"
                                        value={dem}
                                        onChange={handleChange("dem")}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        {optionResult(getSampleValues("dem"))}
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                            </>
                        )
                    }




                    {
                        processing_level == "Projected" && (
                            <div className="flex flex-col justify-between">
                                <label className="block font-semibold">Elevation</label>
                                <input
                                    id="small-input"
                                    type="number"
                                    class="block w-full  text-gray-900 border border-gray-300 rounded-md px-2 py-2.5 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />                    </div>

                        )
                    }

                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Product Format</label>
                        <select
                            name="image_format"
                            value={image_format}
                            onChange={handleChange("image_format")}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {optionResult(getSampleValues("image_format"))}
                            {/* Add more options as needed */}
                        </select>
                    </div>

                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Pixel Coding</label>
                        <select
                            name="pixel_coding"
                            value={pixel_coding}
                            onChange={handleChange("pixel_coding")}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {optionResult(getSampleValues("pixel_coding"))}
                            {/* Add more options as needed */}
                        </select>
                    </div>

                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Radiometric Processing</label>
                        <select
                            name="radiometric_processing"
                            value={radiometric_processing}
                            onChange={handleChange("radiometric_processing")}

                            className="border border-gray-300 rounded-md p-2"
                        >
                            {optionResult(getSampleValues("radiometric_processing"))}

                            {/* Add more options as needed */}
                        </select>
                    </div>

                    <div className="flex flex-col justify-between">
                        <label className="block font-semibold">Licence</label>
                        <select
                            name="licence"
                            value={licence}
                            onChange={handleChange("licence")}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            {optionResult(getSampleValues("licence"))}
                            {/* Add more options as needed */}
                        </select>
                    </div>
                </div>

                {/* <div className="flex justify-between mt-4">
                    <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">
                        CONTINUE
                    </button>
                    <button onClick={onBack} type="button" className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
                        CANCEL
                    </button>
                </div> */}
            </form>



            {/* <Form
                onValuesChange={handleFormChange}
                onFinish={onSubmit}
                layout="vertical"
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 24 }}
                style={{ marginTop: 25 }}
            >
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {productionFormValues.map((form) => {

                        return (
                            <>
                                <div
                                    style={{
                                        width: "50%",
                                        boxSizing: "border-box",
                                        padding: "10px",
                                    }}
                                >
                                    <Form.Item
                                        initialValue={form.defaultValue}
                                        label={capitalizeFirstWord(form.label)}
                                        name={form.name}
                                        rules={[{ required: true }]}
                                    >
                                        <Select defaultValue={form.defaultValue}>
                                            {form.sampleValues.map((el) => {
                                                return (
                                                    <>
                                                        <Select.Option value={el}>
                                                            {capitalizeFirstWord(el)}
                                                        </Select.Option>
                                                    </>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </>
                        );
                    })}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            placeContent: "flex-start",
                            placeItems: "center",
                        }}
                    >
                        <Form.Item style={{ margin: 10 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ margin: 10 }}>
                            <Button type="" onClick={onBack} >
                                Previous
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form> */}



        </>




    );
};
export const Delivery = ({ error, optionResult, getSampleValues, inputs, onChange = () => { }, stepKey }) => {

    const { customerReference, application, program, deliveryType, email } = inputs


    function handleChange(inputKey) {
        return (event) => {
            onChange({ value: event.target.value, stepKey, inputKey });
        };
    }




    return (
        <>

            <div className=" py-2 ">
                {/* Customer Reference */}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700">
                        Customer reference <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="customerReference"
                        value={customerReference}
                        onChange={handleChange("customerReference")}
                        className="w-full border border-gray-300 rounded p-2 mt-1"

                    />
                    {error.customerReference && (<span className="text-red-500 text-sm ">{error.customerReference}</span>
                    )}
                </div>

                {/* Application and Program in the same row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">
                            Application <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="application"
                            value={application}
                            onChange={handleChange("application")}

                            className="w-full border  rounded p-2 mt-1 "
                        >
                            {optionResult(getSampleValues("application"))}

                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Program</label>
                        <input
                            type="text"
                            name="program"
                            value={program}
                            onChange={handleChange("program")}
                            className="w-full border border-gray-300 rounded p-2 mt-1"
                            placeholder=""
                        />
                    </div>
                </div>

                {/* Delivery Type Section */}
                <div className="mb-4 p-4 bg-blue-100 rounded-md">
                    <label className="block text-sm font-bold text-gray-700">
                        Delivery Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="deliveryType"
                        value={deliveryType}
                        onChange={handleChange("deliveryType")}
                        className="w-1/2 border border-blue-500 rounded p-2 mt-1"
                    >
                        {optionResult(getSampleValues("type"))}
                    </select>
                </div>

                {/* Notifications Section */}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700">
                        Notifications <span className="text-red-500">*</span>
                    </label>

                    {/* <div className="bg-gray-200 p-2 rounded mb-2">
                        {addedEmails.map((email, index) => (
                            <div key={index}>{email}</div>
                        ))}
                    </div> */}
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange("email")}
                        placeholder="email"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {error.email && (<span className="text-red-500 text-sm font-normal ">{error.email}</span>
                    )}
                    {/* <button
          onClick={addEmail}
          className="mt-2 text-blue-500 font-bold"
        >
          ADD +
        </button> */}
                </div>

                {/* Buttons Section */}
                {/* <div className="flex justify-between">
                    <button
                        onClick={onPrev}

                        className="bg-gray-300 text-gray-600 py-2 px-4 rounded">CANCEL</button>
                    <button
                        onClick={handlesubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded">CONTINUE</button>
                </div> */}
            </div>




        </>
    );
};


export const TaskingFormComponent = ({
    componentValues,
    customerReference,
    mission,
    formState,
    access,
    userName,
    onBack
}) => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);
    const [isTaskComplete, setIsTaskComplete] = useState(false)
    const [productionFormValues, serProductionFormValues] = useState();
    const [deliveryFormValues, setDeliveryFormValues] = useState();
    const [onSubmitValues, setOnSubmitValues] = useState();
    const { token } = theme.useToken();
    const [checkBox1, setCheckBox1] = useState(false)
    const [checkBox2, setCheckBox2] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    console.log(onSubmitValues, "++++onSubmitValues")
    const getSubscription = async () => {
        setLoading(true); // Assuming you want to show loading state before the request starts
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/subscriptions/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`, // Pass the token in the Authorization header
                    },
                }
            );

            let { production, delivery } = res.data.subscriptions.tasking.serviceInfo;

            serProductionFormValues(Object.values(production).map((obj) => obj));
            setDeliveryFormValues(Object.values(delivery).map((obj) => obj));

            console.log(production, "++++")

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false); // Set loading to false in both success and error cases
        }
    };

    const orderTasking = async () => {
        // Define the headers
        const headers = {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
        };

        setLoading1(true)
        await axios.post(taskingUrl(mission, userName), taskingJson(componentValues,
            customerReference,
            mission,
            onSubmitValues,
            formState),
            { headers }).then((res) => {
                if (res.status === 201) {
                    setLoading1(false)
                    setIsTaskComplete(true)
                }
            }).catch((err) => {
                console.log(err)
                setLoading1(false)

            })
    }



    useEffect(() => {
        getSubscription();
    }, []);

    const next = (e) => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: "Production",
            content: (
                <>
                    {loading ? (
                        <></>
                    ) : (
                        <>
                            <Production
                                productionFormValues={productionFormValues}
                                onSubmit={(e) => {
                                    setOnSubmitValues(e);
                                    next();
                                }}
                                onBack={onBack}

                            />
                        </>
                    )}
                </>
            ),
        },
        {
            title: "Delivery",
            content: (
                <>
                    {loading ? (
                        <></>
                    ) : (
                        <>
                            <Delivery
                                DeliveryFormValues={deliveryFormValues}
                                onSubmit={(e) => {
                                    setOnSubmitValues({ ...onSubmitValues, ...e });
                                    next(e);
                                }}
                                onPrev={() => prev()}
                                onSubmitValues={onSubmitValues}
                            />
                        </>
                    )}
                </>
            ),
        },
        {
            title: "Confirmation",
            content: (
                <>
                    <Spin spinning={loading1} tip="Please Wait it takes few mins to complete tasking...">
                        {onSubmitValues && componentValues && <>
                            <div style={{ padding: "1rem 3rem 0 3rem" }}>
                                <div style={{ display: "flex", flexDirection: "row", placeContent: "space-between", placeItems: "center", }}>
                                    <h4 style={{
                                        fontSize: "1.3125rem",
                                        fontWeight: 700,
                                        margin: 0,
                                        color: "black"
                                    }}>Order  Summary</h4>
                                    <h4 style={{
                                        fontSize: "1.3125rem",
                                        fontWeight: 500,
                                        margin: 0,
                                        color: "#6cbe20"
                                    }}> {`${(
                                        customerReference.getGeometry().getArea() * 11504.809413552744
                                    ).toFixed(2)} km² `} invoiced</h4>
                                </div>
                                <div>
                                    <h4 style={{
                                        color: "#167dde",
                                        fontSize: " 1rem",
                                        fontWeight: 400,
                                        // gridColumn: " 1/span 4",
                                        margin: "0.25rem 0 0 2rem}"
                                    }}>{mission.mission}</h4>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: componentValues.length > 0 ? "25% 25% 25% " : "25% 25% 25% 25%" }}>
                                    {componentValues.length > 0 ? <>
                                        <div style={{ margin: "0.5rem" }}>
                                            <Timeline
                                                style={{
                                                    height: "6rem",
                                                }}
                                                items={componentValues.map((el) => {
                                                    return {
                                                        children: (
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    placeContent: "flex-start",
                                                                    placeItems: "center",
                                                                }}
                                                            >
                                                                <Typography>
                                                                    {dateConvertForTasking(el.acquisitionStartDate)}
                                                                </Typography>
                                                                <Typography
                                                                    style={{
                                                                        color: "#000000de",
                                                                        fontSize: ".8125rem",
                                                                        lineHeight: "1.25rem",
                                                                        fontWeight: "700",
                                                                        marginLeft: "0.5rem",
                                                                    }}
                                                                >
                                                                    {`${Math.abs(
                                                                        parseFloat(
                                                                            el.acrossTrackIncidenceAngle.toFixed(2)
                                                                        )
                                                                    )}° - 50°`}
                                                                </Typography>
                                                            </div>
                                                        ),
                                                    };
                                                })}
                                            />
                                        </div>
                                    </> : <>
                                        <div style={{ display: "flex", flexDirection: "column", p: "center", padding: "2px" }}>
                                            <p style={{ fontSize: "1rem", color: "black", margin: 0 }}>{dateConvertForTasking(componentValues.length > 0 ? componentValues[0].acquisitionStartDate : componentValues.acquisitionStartDate)}</p>
                                            <p style={{
                                                color: "#f5a623",
                                                fontSize: ".8rem",
                                                marginBottom: "1.25rem",
                                                marginTop: 0
                                            }}>Be aware that geometric quality can be deteriorated if you associate an ortho processing level with an incidence angle   {`>`} 20°</p>
                                        </div>
                                        <div >
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Incidence angle
                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {`${Math.abs(
                                                    parseFloat(
                                                        componentValues.length > 0 ? componentValues[0].acrossTrackIncidenceAngle.toFixed(2) : componentValues.acrossTrackIncidenceAngle.toFixed(2)
                                                    )
                                                )}° - 50°`}
                                            </p>
                                        </div>
                                    </>}

                                    <div >
                                        <div>
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Geometric processing
                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.
                                                    processing_level
                                                }
                                            </p></div>
                                        <div>
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Projection code
                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.projection_1}
                                            </p>
                                        </div>
                                        <div >
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Spectral bands combination

                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.spectral_processing
                                                }
                                            </p>
                                        </div>

                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", p: "center", padding: "2px" }}>
                                        <div><p style={{
                                            color: "#0000008a",
                                            fontSize: ".8125rem",
                                            margin: 0
                                        }}>
                                            DEM
                                        </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.dem
                                                }
                                            </p></div>
                                        <div>
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Product Format

                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.image_format}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Pixel Coding
                                            </p>
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.
                                                    pixel_coding
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{
                                                color: "#0000008a",
                                                fontSize: ".8125rem",
                                                margin: 0
                                            }}>
                                                Radiometric processing
                                            </p >
                                            <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                                {onSubmitValues.radiometric_processing}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", }}>
                                <div style={{ display: "flex", flexDirection: "row", }}>
                                    <p >Customer Refrence:</p>
                                    <p style={{ color: "black", marginLeft: "2px" }}> {onSubmitValues.customerReference}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p > Application:</p>
                                    <p style={{ color: "black", marginLeft: "2px" }}> {onSubmitValues.application}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p >Delivery Type:</p>
                                    <p style={{ color: "black", marginLeft: "2px" }}> Standard</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p >Notifcation:</p>
                                    <p style={{ color: "black", marginLeft: "2px" }}>{onSubmitValues.email}</p>
                                </div>
                            </div>
                            {isTaskComplete ? <>
                                <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", gap: "5px" }}>
                                    <h3 style={{
                                        fontSize: "1.3125rem",
                                        fontWeight: 500,
                                        margin: 0,
                                        color: "#6cbe20"
                                    }}>Order Placed SuccessFully!</h3>
                                </div>

                            </> : <>
                                <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", marginBottom: "10px" }}>
                                    <Checkbox type="large" checked={checkBox1} onClick={() => {
                                        setCheckBox1(!checkBox1)
                                    }} >
                                        I have read and accept the product licence
                                    </Checkbox>
                                    <Button type="link" style={{ margin: 0, padding: 0 }} onClick={showModal}>( SPOT OneDay - Standard Licence Agreement )</Button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", marginBottom: "10px" }}>
                                    <Checkbox type="large" checked={checkBox2} onClick={() => {
                                        setCheckBox2(!checkBox2)
                                    }} >
                                        I have read and accept the general terms and conditions
                                    </Checkbox>
                                    <Button type="link" style={{ margin: 0, padding: 0 }} onClick={() => { window.open("https://www.micronetsolutions.in/about-us/", '_blank') }}>general terms and conditions</Button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", gap: "5px" }}>
                                    <Button type="primary" disabled={!checkBox2 || !checkBox1} onClick={() => { orderTasking() }} loading={loading1}>Order</Button>
                                    <Button type="default" loading={loading1} onClick={() => prev()}>Previous</Button>
                                </div>
                            </>}
                        </>}
                    </Spin>
                    <Modal title={"Product Licence"} centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        This Agreement, between Airbus DS and GoldenEye, grants GoldenEye limited rights to use the PRODUCT under strict compliance. GoldenEye may internally use, alter, and share the PRODUCT, but not transfer it commercially. They may distribute derivative works externally and display extracts with proper attribution. GoldenEye must respect copyright and refrain from reverse engineering. Airbus DS warrants ownership of the PRODUCT but disclaims operational guarantees. Liability for damages is limited. The License is perpetual unless terminated for breach, with disputes subject to French law. GoldenEye agrees not to assign the License and accepts severability of provisions. By signing, GoldenEye acknowledges and agrees to these terms.
                    </Modal>
                </>
            ),
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const contentStyle = {
        height: "35rem",
        overflow: "auto",
        scrollbarWidth: "thin",
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        margin: "16px 0 5px 10px",
        width: "100%",
    };
    const contentStyle1 = {
        height: "44.9rem",
        overflow: "auto",
        scrollbarWidth: "thin",
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        margin: "16px 0 5px 10px",
        width: "95%",
    };


    return (
        <>
            <Row gutter={16}>
                <Col span={steps[current].title === "Confirmation" ? 24 : 16}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            placeContent: "center",
                            margin: "16px",
                        }}
                    >
                        <Steps
                            current={current}
                            items={items}
                            style={{ width: "30rem", marginTop: "1.5rem" }}
                        />
                    </div>
                    <div style={contentStyle}>{steps[current].content}</div>
                </Col>
                {steps[current].title === "Confirmation" ? <></> : <>
                    <Col span={8}>
                        <div style={contentStyle1}>
                            <PriceComponent
                                customerReference={customerReference}
                                componentValues={componentValues}
                                onSubmitValues={
                                    steps[current].title === "Delivery"
                                        ? onSubmitValues
                                        : steps[current].title === "Confirmation"
                                            ? onSubmitValues
                                            : {}
                                }
                            />
                        </div>
                    </Col>
                </>}

            </Row>
        </>
    );
};


export const dateConvertForTasking = (originalDate, hours) => {
    const originalDateString = new Date(originalDate).toUTCString();
    let formattedDate;
    if (hours === false) {
        formattedDate = moment(
            originalDateString,
            "ddd, DD MMM YYYY HH:mm:ss [GMT]"
        ).format("DD MMM YYYY");
    } else {
        formattedDate = moment(
            originalDateString,
            "ddd, DD MMM YYYY HH:mm:ss [GMT]"
        ).format("DD MMM YYYY HH:mm");
    }
    return formattedDate;
};


export function capitalizeFirstWord(str) {
    if (typeof str !== "string") {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const removeFunction = (name) => {
    // Add custom formatting logic here, e.g., replacing underscores with spaces
    return name.replace(/_/g, " ");
};
export const dateAfterOneMonth = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (today.getDate() > nextMonth.getDate()) {
        nextMonth.setDate(0);
    }
    var day = String(nextMonth.getDate()).padStart(2, "0");
    var month = String(nextMonth.getMonth() + 1).padStart(2, "0");
    var year = nextMonth.getFullYear();
    return `${day}/${month}/${year}`;
};
export const dateAfterOneMonth1 = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (today.getDate() > nextMonth.getDate()) {
        nextMonth.setDate(0);
    }
    return nextMonth.toJSON();
};
export const todayDate = () => {
    let currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, "0");
    var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    var year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
};
export const maxMinError = (errorText) => {
    let message;
    switch (errorText) {
        case "ERR_MAX_AOI_AREA":
            message = "AOI area must not exceed";
            break;
        case "ERR_AOI_MAX_WIDTH":
            message = "AOI width must not exceed";
            break;
        case "ERR_AOI_MAX_HEIGHT":
            message = "AOI hieght must not exceed";
            break;
        case "ERR_MIN_AOI_AREA":
            message = "AOI area minimum required";
            break;
        case "ERR_MIN_AOI_WIDTH":
            message = "AOI width minimum required";
            break;
        case "ERR_MIN_AOI_HIEGHT":
            message = "AOI hieght minimum required";
            break;
        default:
            message = "";
            break;
    }
    return message;
};
export const priceJSON = (
    name,
    coords,
    prodId,
    acquisitionMode,
    startDate,
    endDate,
    comments,
    segmentKey,
    spectral_processing,
    radiometric_processing,
    image_format,
    pixel_coding,
    processing_level,
    projection_1,
    licence,
    dem,
    priority,
    emailId,
    feasibilityAutomationName,
    feasibilityAutomation,
    classification
) => {
    return {
        aoi: [
            {
                id: 1,
                name: name,
                geometry: {
                    type: "Polygon",
                    coordinates: coords,
                },
            },
        ],
        contractId: "MICRONET_OneAtlasTasking_Samples",
        productTypeId: prodId,
        aoiId: 1,
        acquisitionMode: acquisitionMode,
        acqPeriod: `${startDate} ${endDate}`,
        comments: comments,
        segmentKey: segmentKey,
        customerReference: name,
        spectral_processing: spectral_processing,
        radiometric_processing: radiometric_processing.toLowerCase(),
        image_format: image_format,
        pixel_coding: pixel_coding,
        processing_level: processing_level,
        projection_1: projection_1,
        licence: licence,
        dem: dem,
        priority: priority,
        emailId: emailId,
        feasibilityAutomationName: feasibilityAutomationName,
        feasibilityAutomation: feasibilityAutomation,
        classification: classification,
    };
};
export const generateUniqueRandomNumber = () => {
    const generatedNumbers = [];

    return () => {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 51); // Generate random number between 0 and 50
        } while (generatedNumbers.includes(randomNumber));

        generatedNumbers.push(randomNumber);

        if (generatedNumbers.length === 51) {
            // All numbers generated, reset the array
            generatedNumbers.length = 0;
        }

        return randomNumber;
    };
};

export const taskingUrl = (mission, userName) => {


    if (mission.name === "ONEDAY" && mission.mission === "SPOT") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/spotoneday/order`;
    }
    if (mission.name === "ONENOW" && mission.mission === "SPOT") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/spotonenow/order`;
    }
    if (mission.name === "ONEDAY" && mission.mission === "PLEIADES") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/pleadesoneday/order`;
    }
    if (mission.name === "ONENOW" && mission.mission === "PLEIADES") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/pleiadesonenow/order`;
    }
    if (mission.name === "ONEDAY" && mission.mission === "PLEIADESNEO") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/pneooneday/order`;
    }
    if (mission.name === "ONENOW" && mission.mission === "PLEIADESNEO") {
        return `${process.env.REACT_APP_BASE_URL}/providers/airbus/${userName}/tasking/pneoonenow/order`;
    }
};
export const taskingJson = (
    componentValues,
    customerReference,
    mission,
    inputs,
    formState
) => {

    return {
        aoi: [
            {
                id: 1,
                name: customerReference.getId(),
                geometry: {
                    type: "Polygon",
                    coordinates: customerReference.getGeometry().getCoordinates(),
                },
            },
        ],
        progTypeNames: mission.name,
        missions: mission.mission,
        acquisitionMode: formState.acquisitionMode,
        maxCloudCover: formState.maxCloudCover,
        acquisitionStartDate: componentValues.acquisitionStartDate,
        acquisitionEndDate: componentValues.acquisitionEndDate,
        segmentKey: componentValues.segmentKey,
        dem: inputs.step1.dem,
        licence: inputs.step1.licence,
        image_format: inputs.step1.image_format,
        pixel_coding: inputs.step1.pixel_coding,
        projection_1: inputs.step1.projection_1,
        processing_level: inputs.step1.processing_level,
        spectral_processing: inputs.step1.spectral_processing,
        radiometric_processing: inputs.step1.radiometric_processing,
        emailId: inputs.step2.email,
        customerReference: inputs.step2.customerReference,
        comments: "General",
        priority: "standard",
        maxIncidenceAngle: formState.maxIncidenceAngle,
        deliveryType: "network",
        // cost: 10,
    };
};



export const OneDayViewmore = ({
    viewMoreState,
    type,
    segmentKey,
    onSelect,
    availiblity,
    formState

}) => {

    return (


        <>
            <div className={` `}>

                <div className={`  flex flex-wrap flex-row justify-start gap-5 `}>
                    {segmentKey.length > 0 && (
                        segmentKey
                            ?.map((item, index) => (
                                <>
                                    {availiblity ? (
                                        <div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    placeContent: "flex-start",
                                                    placeItems: "center",
                                                }}
                                            >
                                                <Typography style={{ fontWeight: 700, fontSize: "80%" }}>
                                                    {type}
                                                </Typography>
                                                <Tag
                                                    style={{
                                                        borderRadius: "1.5rem",
                                                        color: "#888",
                                                        background: "#eee",
                                                        fontSize: "60%",
                                                        lineHeight: ".8rem",
                                                        marginRight: "0.5rem",
                                                        marginTop: "0.2rem",
                                                        marginLeft: "0.5rem",
                                                        padding: "0.125rem 0.5rem",
                                                    }}
                                                >
                                                    DIRECT TO SATELLITE
                                                </Tag>
                                            </div>

                                            <div className={`${viewMoreState ? "border-r pr-3" : ""}`}>
                                                {/* Acquisition start date */}
                                                <div
                                                    className="flex items-center"
                                                >
                                                    <div
                                                        style={{
                                                            content: "",
                                                            display: "inline-block",
                                                            border: "2px solid rgba(22,125,222,.5)",
                                                            borderRadius: "50%",
                                                            height: "0.5rem",
                                                            margin: "0 0.5rem 0 0",
                                                            width: "0.5rem",
                                                        }}
                                                    />
                                                    <Typography style={{ fontSize: "90%" }}>
                                                        {dateConvertForTasking(item?.acquisitionStartDate)}
                                                    </Typography>
                                                </div>

                                                {/* Incidence angle */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        placeItems: "center",
                                                    }}
                                                >
                                                    <div style={{ height: "1rem", width: "1rem" }}>
                                                        <Angle className="w-4 h-4" />
                                                    </div>
                                                    <Typography
                                                        style={{
                                                            color: "#00000094",
                                                            fontSize: "90%",
                                                            lineHeight: "1.25rem",
                                                            marginLeft: "0.5rem",
                                                        }}
                                                    >
                                                        Incidence angle:
                                                    </Typography>
                                                    <Typography
                                                        style={{
                                                            color: "#000000de",
                                                            fontSize: "90%",
                                                            lineHeight: "1.25rem",
                                                            fontWeight: "700",
                                                            marginLeft: "0.5rem",
                                                        }}
                                                    >
                                                        {`${Math.abs(
                                                            parseFloat(item.acrossTrackIncidenceAngle.toFixed(2))
                                                        )} - °${formState.maxIncidenceAngle}°`}
                                                    </Typography>
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex mt-2 items-center gap-2">
                                                    <Button type="primary" size="small" onClick={() => onSelect(item)}>
                                                        SELECT
                                                    </Button>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            placeContent: "center",
                                                            placeItems: "center",
                                                            margin: "5px",
                                                        }}
                                                    >
                                                        <Typography className="text-[000000de] italic text-sm">
                                                            Order deadline:
                                                        </Typography>
                                                        <Typography
                                                            style={{
                                                                fontSize: "90%",
                                                                fontStyle: "italic",
                                                                fontWeight: 300,
                                                                color: "#000000de",
                                                            }}
                                                        >
                                                            {`${dateConvertForTasking(item.orderDeadline)} (UTC)`}
                                                        </Typography>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

                                    ) : (
                                        <>
                                        </>
                                    )}
                                </>
                            ))
                    )}

                </div>

            </div>
        </>


    );
}



export function Step3({
    loading1,
    inputs,
    isTaskComplete,
    checkBox1,
    setCheckBox1,
    showModal,
    checkBox2,
    setCheckBox2,
    isModalOpen,
    handleOk,
    handleCancel,
    componentValues,
    mission,
    customerReference,

}) {



    const geometry = customerReference.getGeometry();
    const geojson = new GeoJSON().writeGeometryObject(geometry);
    const convertedArea = turf.area(geojson) / 1e6;
    return (
        <>

            <Spin spinning={loading1} tip="Please Wait it takes few mins to complete tasking...">
                {inputs && componentValues && <>
                    <div style={{ padding: "1rem 3rem 0 3rem" }}>
                        <div style={{ display: "flex", flexDirection: "row", placeContent: "space-between", placeItems: "center", }}>
                            <h4 style={{
                                fontSize: "1.3125rem",
                                fontWeight: 700,
                                margin: 0,
                                color: "black"
                            }}>Order  Summary</h4>
                            <h4 style={{
                                fontSize: "1.3125rem",
                                fontWeight: 500,
                                margin: 0,
                                color: "#6cbe20"
                            }}> {`${convertedArea.toFixed(2)} km² `} invoiced</h4>
                        </div>
                        <div>
                            <h4 style={{
                                color: "#167dde",
                                fontSize: " 1rem",
                                fontWeight: 400,
                                // gridColumn: " 1/span 4",
                                margin: "0.25rem 0 0 2rem}"
                            }}>{mission.mission}</h4>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: componentValues.length > 0 ? "25% 25% 25% " : "25% 25% 25% 25%" }}>
                            {componentValues.length > 0 ? <>
                                <div style={{ margin: "0.5rem" }}>
                                    <Timeline
                                        style={{
                                            height: "6rem",
                                        }}
                                        items={componentValues.map((el) => {
                                            return {
                                                children: (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            placeContent: "flex-start",
                                                            placeItems: "center",
                                                        }}
                                                    >
                                                        <Typography>
                                                            {dateConvertForTasking(el.acquisitionStartDate)}
                                                        </Typography>
                                                        <Typography
                                                            style={{
                                                                color: "#000000de",
                                                                fontSize: ".8125rem",
                                                                lineHeight: "1.25rem",
                                                                fontWeight: "700",
                                                                marginLeft: "0.5rem",
                                                            }}
                                                        >
                                                            {`${Math.abs(
                                                                parseFloat(
                                                                    el.acrossTrackIncidenceAngle.toFixed(2)
                                                                )
                                                            )}° - 50°`}
                                                        </Typography>
                                                    </div>
                                                ),
                                            };
                                        })}
                                    />
                                </div>
                            </> : <>
                                <div style={{ display: "flex", flexDirection: "column", p: "center", padding: "2px" }}>
                                    <p style={{ fontSize: "1rem", color: "black", margin: 0 }}>{dateConvertForTasking(componentValues.length > 0 ? componentValues[0].acquisitionStartDate : componentValues.acquisitionStartDate)}</p>
                                    <p style={{
                                        color: "#f5a623",
                                        fontSize: ".8rem",
                                        marginBottom: "1.25rem",
                                        marginTop: 0
                                    }}>Be aware that geometric quality can be deteriorated if you associate an ortho processing level with an incidence angle   {`>`} 20°</p>
                                </div>
                                <div >
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Incidence angle
                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {`${Math.abs(
                                            parseFloat(
                                                componentValues.length > 0 ? componentValues[0].acrossTrackIncidenceAngle.toFixed(2) : componentValues.acrossTrackIncidenceAngle.toFixed(2)
                                            )
                                        )}° - 50°`}
                                    </p>
                                </div>
                            </>}

                            <div >
                                <div>
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Geometric processing
                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.
                                            processing_level
                                        }
                                    </p></div>
                                <div>
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Projection code
                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.projection_1}
                                    </p>
                                </div>
                                <div >
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Spectral bands combination

                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.spectral_processing
                                        }
                                    </p>
                                </div>

                            </div>
                            <div style={{ display: "flex", flexDirection: "column", p: "center", padding: "2px" }}>
                                <div><p style={{
                                    color: "#0000008a",
                                    fontSize: ".8125rem",
                                    margin: 0
                                }}>
                                    DEM
                                </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.dem
                                        }
                                    </p></div>
                                <div>
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Product Format

                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.image_format}
                                    </p>
                                </div>
                                <div>
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Pixel Coding
                                    </p>
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.
                                            pixel_coding
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p style={{
                                        color: "#0000008a",
                                        fontSize: ".8125rem",
                                        margin: 0
                                    }}>
                                        Radiometric processing
                                    </p >
                                    <p style={{ margin: 0, fontSize: ".8125rem", color: "black" }} >
                                        {inputs.step1.radiometric_processing}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "3rem", display: "flex", flexDirection: "column", }}>
                        <div style={{ display: "flex", flexDirection: "row", }}>
                            <p >Customer Refrence:</p>
                            <p style={{ color: "black", marginLeft: "2px" }}> {inputs.step2.customerReference}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <p > Application:</p>
                            <p style={{ color: "black", marginLeft: "2px" }}> {inputs.step2.application}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <p >Delivery Type:</p>
                            <p style={{ color: "black", marginLeft: "2px" }}> Standard</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <p >Notifcation:</p>
                            <p style={{ color: "black", marginLeft: "2px" }}>{inputs.step2.email}</p>
                        </div>
                    </div>
                    {isTaskComplete ? <>
                        <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", gap: "5px" }}>
                            <h3 style={{
                                fontSize: "1.3125rem",
                                fontWeight: 500,
                                margin: 0,
                                color: "#6cbe20"
                            }}>Order Placed SuccessFully!</h3>
                        </div>

                    </> : <>
                        <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", marginBottom: "10px" }}>
                            <Checkbox type="large" checked={checkBox1} onClick={() => {
                                setCheckBox1(!checkBox1)
                            }} >
                                I have read and accept the product licence
                            </Checkbox>
                            <Button type="link" style={{ margin: 0, padding: 0 }} onClick={showModal}>( SPOT OneDay - Standard Licence Agreement )</Button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", marginBottom: "10px" }}>
                            <Checkbox type="large" checked={checkBox2} onClick={() => {
                                setCheckBox2(!checkBox2)
                            }} >
                                I have read and accept the general terms and conditions
                            </Checkbox>
                            <Button type="link" style={{ margin: 0, padding: 0 }} onClick={() => { window.open("https://www.micronetsolutions.in/about-us/", '_blank') }}>general terms and conditions</Button>
                        </div>
                        {/* <div style={{ display: "flex", flexDirection: "row", placeItems: "center", paddingLeft: "3rem", gap: "5px" }}>
                        <Button type="primary" disabled={!checkBox2 || !checkBox1} onClick={() => { }} loading={loading1}>Order</Button>
                        <Button type="default" loading={loading1} onClick={() => prev()}>Previous</Button>
                    </div> */}
                    </>}
                </>}
            </Spin>
            <Modal title={"Product Licence"} centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


                <p>This Agreement, between Airbus DS and GoldenEye, grants GoldenEye limited
                    rights to use the PRODUCT under strict compliance. GoldenEye may internally
                    use, alter, and share the PRODUCT, but not transfer it commercially. They may distribute
                    derivative works externally and display extracts with proper attribution. GoldenEye must respect
                    copyright and refrain from reverse engineering. Airbus DS warrants ownership of the PRODUCT but disclaims
                    operational guarantees. Liability for damages is limited. The License is perpetual unless terminated for
                    breach, with disputes subject to French law. GoldenEye agrees not to assign the License and accepts severability
                    of provisions. By signing, GoldenEye acknowledges and agrees to these terms.</p>


            </Modal>
        </>
    )
}
