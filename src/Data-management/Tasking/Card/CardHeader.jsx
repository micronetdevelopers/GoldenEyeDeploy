import { Typography } from "antd";

export const CardHeader = ({ SvgHeader, content, cloudCoverage, planName }) => {
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
                    {SvgHeader}
                    <Typography
                        style={{
                            color: "#167dde",
                            fontSize: "75%",
                            fontWeight: 300,
                            margin: ".5rem 0",
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
                            fontWeight: 300,
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