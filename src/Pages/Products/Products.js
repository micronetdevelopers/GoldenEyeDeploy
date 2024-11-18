import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Products.css';
import video from '../../assets/Video/Product_BG.mp4';
import images from '../../assets/images/Airbus.png';
import logoes from '../../assets/Logos/Airbus_logo_BGR.png'
import Product_Airbus_Section2 from '../../assets/images/Product_Airbus_Section2.png';

import A1 from '../../assets/images/A1.png';
import A2 from '../../assets/images/A2.png';
import A3 from '../../assets/images/A3.png';
import A4 from '../../assets/images/A4.png';
import A5 from '../../assets/images/A5.png';
import A6 from '../../assets/images/A6.png';
import A7 from '../../assets/images/A7.png';

// Map IDs to images
const satelliteImages = {
    A1: A1,
    A2: A2,
    A3: A3,
    A4: A4,
    A5: A5,
    A6: A6,
    A7: A7
};



const Products = () => {
    useEffect(() => {
        document.querySelector('.custom-bg').style.backgroundColor = '#1C2A45';
    }, []);

    // Define the satellites array here
    const satellites = [
        { id: 'A1', label: 'Pleaides Neo' },
        { id: 'A2', label: 'Pleiades' },
        { id: 'A3', label: 'Vision-1' },
        { id: 'A4', label: 'Spot 6 / 7' },
        { id: 'A5', label: 'Radar Constellation' },
        { id: 'A6', label: 'DMC Constellation' },
        { id: 'A7', label: 'WorldDEM/WorldDEM™ Neo' }
    ];

    return (
        <Container fluid className="products-container">
            <div className='row'>
                <div  md={4} className=" col d-flex flex-column align-items-start custom-bg text-white p-4 text-content">
                    <div className="text-left ">
                        <h1 className='leftsidetext'>WE WILL GIVE YOU GUARANTEED PRODUCTS</h1>
                        <p className='paragraphbesideimage'>We deal always with better products</p>
                    </div>
                    <div className=" card mt-4 p-3 outer-card">
                        <div className=" card p-1 inner-card">
                        <img
    className="w-full h-auto object-cover transform transition duration-300 ease-in-out hover:scale-95 hover:translate-x-1 hover:-translate-y-1"
    src={images}
    alt="Airbus Defence & Space"
  />
                            {/* <Card.Img variant="top" src={images} alt="Airbus Defence & Space" /> */}
                        </div>
                    </div>
                </div>
                <div md={8} className="col-lg-8 col-md-8 p-0 video-col">
                    <video className="w-100 h-100 video-background" autoPlay muted loop>
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                </div>
            </div>



            {/* New Section */}
            <div className="section1 py-4">
                <div className="align-items-center centerbox">
                    <div  className="row w-55 h-100 headerbox">
                        <div xs={12} md={2} className=" col-xs 12 col-md-2 col-lg-2 Airbuslogo">
                            <img src={logoes} className="img-fluid" alt="Responsive Image" />
                        </div>
                        <div xs={12} md={10} className="col-lg-10 col-md-10 col-xs-12 heading1">
                            <h2 className="align-text-center lg:p-4 md:p-4   head-1">A Unique Constellation with extensive satellite Imagery solutions</h2>
                        </div>
                    </div>

                    <div className=" row nextbox">
                        <div className=" md:col-6 lg:col-6 sm:col-12 lftbox my-4">
                            <div className="contentbox ">
                                <h1 className="head-2">When ground support is essential, turn your eyes to the sky</h1>
                                <p className="Airbus-para">
                                    Airbus leads the market with the most comprehensive constellation of optical
                                    and radar Earth observation satellites. Offering precise remote-sensing surveillance solutions
                                    across various industries, our constellation includes Pleiades Neo, Pleiades, SPOT, Vision-1
                                    optical satellites, and the Radar Constellation (TerraSAR-X, TanDEM-X, PAZ, NovaSAR). This
                                    unrivaled portfolio covers the entire geo-information value chain, empowering decision-makers
                                    with integrated solutions for enhanced security, optimized mission planning, improved
                                    operational performance, resource management, and environmental protection, contributing to a
                                    sustainable future.
                                    Get actionable intelligence to respond to your challenges with greater speed and greater
                                    certainty. Browse through the suite of satellite imagery from Airbus and select the one most
                                    suited to your needs.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-6 lg:col-6 sm:col-12 rhtbox my-4">
                            <img src={Product_Airbus_Section2} className="img-fluid" alt="Responsive Image" />
                        </div>
                    </div>

                    <div className="container-fluid bottombox">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4">
    {satellites.map((satellite, index) => (
        <div key={index} className="card-container">
            <img
                src={satelliteImages[satellite.id]}
                className="w-full h-auto card-img"
                alt={satellite.label}
                loading="lazy" 
            />
            <button className="btn w-full mt-2">{satellite.label}</button>
        </div>
    ))}
</div>
                        {/* <div className="row">
                            {satellites.map((satellite, index) => (
                                <div key={index} className="col  card-container">
                                    <img
                                        src={satelliteImages[satellite.id]}

                                        className="img-fluid card-img" alt={satellite.label} loading="lazy" />
                                    <button className="btn w-100 ">{satellite.label}</button>
                                </div>
                            ))}

                        </div> */}

                    </div>
                </div>
            </div>

            {/* New Section for Broucher */}

            {/* New Section with Centered Card */}
            <div className="section2 d-flex justify-content-center align-items-left pt-5 min-vh-100">
                <div className="containerProduct">
                    {/* <div className="row justify-content-center"> */}
                    {/* <div className="col-lg-6 col-md-8 col-sm-10" */}
                    {/* style={{
                            
                            backgroundColor: '#1A3956'  // Add your desired background color
                        }}
                        > */}
                    <div className="card text-center"
                        style={{
                            width: '100%',
                            height: '780px',
                            backgroundColor: 'whitesmoke',
                            borderRadius: '0',  // Remove border radius
                            border: 'none', // Remove the outer border
                        }} // Customize width and height here
                    >

                        <div className="cardheader" >
                            <h3 className="card-title" style={{ color: '#1A3956' }}>Download Our Brochure</h3>
                            <p className="card-text" style={{ color: 'black', padding: '10px' }}>Discover more about our satellite images collection by downloading our brochure. Get a glimpse into the extraordinary <br></br>scenes captured by advanced satellite technology.</p>,
                        </div>
                        <div className="card-body"
                            style={{

                                width: '100%',  // Set your desired width
                                height: 'auto',  // Set your desired height
                                margin: '0 auto', // Center the box horizontally
                                display: 'flex',  // Enable flexbox for vertical centering
                                justifyContent: 'center',  // Center content horizontally
                                alignItems: 'center'  // Center content vertically


                            }}>
                            <div className="card-box justify-content-center p-5 "
                                style={{
                                    width: '100%',  // Set your desired width
                                    height: 'auto',  // Set your desired height
                                    margin: '0 auto', // Center the box horizontally
                                    display: 'flex',  // Enable flexbox for vertical centering
                                    justifyContent: 'center',  // Center content horizontally
                                    alignItems: 'center', // Center content vertically
                                    backgroundColor: '#1A3956', // Add your desired background color
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)'  // Add a shadow to the card-box
                                }}
                            >
                                {/* Broucher cardbox inside the small card-box */}
                                {/* <div className='row'>
                                  
                                    <div className="col-12 mb-4">
                                        <div className="d-flex justify-content-between flex-wrap">
                                            {[
                                                { heading: "Airbus Pleiades Neo", content: "Pleiades Neo Brochure Document download here..." },
                                                { heading: "Airbus Pleiades", content: "Pleiades Brochure Document download here..." },
                                                { heading: "Airbus VISION-1", content: "VISION-1 Brochure Document download here..." },
                                                { heading: "Airbus SPOT6/SPOT7", content: "SPOT6 / SPOT7 Brochure Document download here..." },
                                                { heading: "Airbus TerraSAR-X", content: "TerraSAR-X Brochure Document download here..." }

                                            ].map((item, index) => (

                                                <div className="card-box p-3 mb-3 CardContent"
                                                    style={{
                                                        width: '18%',
                                                        background: 'radial-gradient(circle, rgba(242, 247, 248, 0.81) 0%, rgba(129, 147, 183, 0) 100%)',  // Radial gradient background, 
                                                        border: '0.1px solid #77A1CA',  // Add outer border with color and width
                                                        borderRadius: '2px'
                                                    }}
                                                    key={index}>
                                                    <h5 className="mb-2" style={{ fontSize: '20px' }}>{item.heading}</h5>
                                                    <p className="mb-3" style={{ fontSize: '16px' }}>{item.content}</p>

                                                    <button className="btn btn-primary w-50"
                                                        style={{
                                                            backgroundColor: 'rgba(238, 235, 235, 0.973)',  // Add your desired background color
                                                            padding: '0px',
                                                            border: '1px solid #1A3956',  // Add outer border with color and width
                                                            color: 'black',
                                                            borderRadius: '5px'  // Remove border radius

                                                        }}

                                                        onMouseEnter={(e) => e.target.style.color = 'green'}  // Change text color on hover
                                                        onMouseLeave={(e) => e.target.style.color = 'black'}  // Reset text color after hover

                                                    >Download</button>

                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                  
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between flex-wrap">
                                            {[
                                                { heading: "Airbus WorldDEM", content: "WorldDEM Brochure Document download here..." },
                                                { heading: "Planet Scope", content: "Planet Scope Brochure Document download here..." },
                                                { heading: "Planet Monitoring", content: "Planet Monitoring Brochure Document download here..." },
                                                { heading: "Planet Solutions", content: "Planet Solutions Brochure Document download here..." },
                                                { heading: "MDA Imaging Modes", content: "MDA Brochure Document download here..." }

                                            ].map((item, index) => (

                                                <div className="card-box p-3 mb-3"
                                                    style={{
                                                        width: '18%',
                                                        border: '0.1px solid #77A1CA',  // Add outer border with color and width
                                                        background: 'radial-gradient(circle, rgba(242, 247, 248, 0.81) 0%, rgba(129, 147, 183, 0) 100%)',  // Radial gradient background, , 
                                                        borderRadius: '2px'

                                                    }} key={index}>

                                                    <h5 className="mb-2" style={{ fontSize: '20px' }}>{item.heading}</h5>
                                                    <p className="mb-3" style={{ fontSize: '16px' }}>{item.content}</p>

                                                    <button className="btn btn-primary w-50"
                                                        style={{
                                                            backgroundColor: 'rgba(238, 235, 235, 0.973)',  // Add your desired background color
                                                            border: '1px solid #1A3956',  // Add outer border with color and width
                                                            padding: '0px',
                                                            color: 'black',
                                                            borderRadius: '5px',  // Remove border radius
                                                            outerborderColor: 'none'  // Remove outer border
                                                        }}

                                                        onMouseEnter={(e) => e.target.style.color = 'green'}  // Change text color on hover
                                                        onMouseLeave={(e) => e.target.style.color = 'black'}  // Reset text color after hover

                                                    >Download</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                </div> */}
                                <div className="grid gap-4">
    {/* Upper Card */}
    <div className="w-full mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
                { heading: "Airbus Pleiades Neo", content: "Pleiades Neo Brochure Document download here..." },
                { heading: "Airbus Pleiades", content: "Pleiades Brochure Document download here..." },
                { heading: "Airbus VISION-1", content: "VISION-1 Brochure Document download here..." },
                { heading: "Airbus SPOT6/SPOT7", content: "SPOT6 / SPOT7 Brochure Document download here..." },
                { heading: "Airbus TerraSAR-X", content: "TerraSAR-X Brochure Document download here..." },
                { heading: "Airbus WorldDEM", content: "WorldDEM Brochure Document download here..." },
                { heading: "Planet Scope", content: "Planet Scope Brochure Document download here..." },
                { heading: "Planet Monitoring", content: "Planet Monitoring Brochure Document download here..." },
                { heading: "Planet Solutions", content: "Planet Solutions Brochure Document download here..." },
                { heading: "MDA Imaging Modes", content: "MDA Brochure Document download here..." }
            ].map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-gray-100 to-blue-50 border border-blue-300 rounded-md CardContent">
                    <h5 className="mb-2 text-lg font-semibold">{item.heading}</h5>
                    <p className="mb-3 text-base">{item.content}</p>
                    <button className="downloadbtn btn  w-1/2 bg-gray-200 border border-blue-800 text-black rounded hover:text-green-500 transition-colors">
                        Download
                    </button>
                </div>
            ))}
        </div>
    </div>

    {/* Lower Card */}
    {/* <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
                { heading: "Airbus WorldDEM", content: "WorldDEM Brochure Document download here..." },
                { heading: "Planet Scope", content: "Planet Scope Brochure Document download here..." },
                { heading: "Planet Monitoring", content: "Planet Monitoring Brochure Document download here..." },
                { heading: "Planet Solutions", content: "Planet Solutions Brochure Document download here..." },
                { heading: "MDA Imaging Modes", content: "MDA Brochure Document download here..." }
            ].map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-gray-100 to-blue-50 border border-blue-300 rounded-md">
                    <h5 className="mb-2 text-lg font-semibold">{item.heading}</h5>
                    <p className="mb-3 text-base">{item.content}</p>
                    <button className="btn w-1/2 bg-gray-200 border border-blue-800 text-black rounded hover:text-green-500 transition-colors">
                        Download
                    </button>
                </div>
            ))}
        </div>
    </div> */}
</div>




                            </div>

                            {/* Add more content here */}
                        </div>
                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </div>
            </div>








        </Container>
    );
}

export default Products;

