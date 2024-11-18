import React from 'react';
import './About.css';
// import GoldenEyelogo from '../../assets/Logos/GOLDENEYE_LOGO.png';
import GoldenEyelogo from '../../assets/Logos/GOLDEYE_LOGO1_10K.png';
import ourvision_about from '../../assets/images/ourvision_about.PNG';
import ourvision_about1 from '../../assets/images/ourvision_about1.PNG';
import ourmission from '../../assets/images/OurMission_aboutus.png';
import ourvision from '../../assets/images/OurVision_aboutus.png';
import aboutushand from '../../assets/images/AboutUs_hand.png';
import Footer from '../../reusablecomponents/Footer/Footer';

// import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton'

const About = () => {
    return (
        <>
            {/* <StkeyButton /> */}
            <div className='aboutpageclass'>
                <div className='container-fluid'>
                    <div className='aboutcenterbox'>
                        <div className='row'>
                            {/* Left column (Logo, Heading, Content) */}
                            <div className='col-sm-7 p-3 '>
                                <div className='row'>
                                    <div className='col-lg-7 col-md-6 p-3 '>
                                        <div className='headingbox d-flex align-items-center'>
                                            <img src={GoldenEyelogo} className="img-fluid logo-image" alt="Responsive Image" loading="lazy" />
                                            <h1 className='logoname ms-3'>Golden Eye</h1>
                                        </div>
                                        <div className='aboutus-content'>
                                            <p>Welcome to Golden Eye, your premier platform for<br></br> high-resolution satellite imagery.
                                                A High Resolution<br></br> Satellite Imagery with different satellites and platforms<br></br> like Airbus, Planet & MDA. Our high-resolution satellite<br></br> imagery services provide accurate and up-to-date <br></br>information for various industries. Whether you're in<br></br> agriculture, environmental monitoring, urban planning,<br></br> or emergency response, our advanced satellite <br></br>technology helps you make well-informed decisions.<br></br> We are committed to delivering reliable and actionable <br></br>satellite data to meet your specific needs. Our team of <br></br>experts ensures that you receive the highest quality <br></br>satellite imagery for your projects, empowering you to <br></br>gain valuable insights and stay ahead of the <br></br>competition.</p>
                                        </div>
                                    </div>

                                    {/* Mission and Vision Section */}
                                    <div className='col-lg-5 col-md-6 p-3 '>
                                        <div className='flip-card'>
                                            <div className='flip-card-inner'>
                                                <div className='flip-card-front'>
                                                    <div className='aboutus-mission'>
                                                        <img src={ourmission} className="img-fluid" alt="Responsive Image" loading="lazy" />
                                                    </div>
                                                </div>

                                                <div class="flip-card-back">
                                                    <p>Our mission is to empower clients with accessible and high-quality satellite imagery solutions. We strive to provide an intuitive and efficient platform for searching, viewing, and ordering premium AIRBUS satellite imagery, ensuring that our clients can make informed, data-driven decisions in sectors such as agriculture, urban planning, environmental monitoring, and disaster management.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flip-card1'>
                                            <div className='flip-card-inner1'>
                                                <div className='flip-card-front1'>
                                                    <div className='aboutus-vision'>
                                                        <img src={ourvision} className="img-fluid" alt="Responsive Image" loading="lazy" />
                                                    </div>
                                                </div>
                                                <div class="flip-card-back1">
                                                    <p>Our vision is to be the leading provider of satellite imagery services, recognized for our commitment to excellence, innovation, and customer satisfaction. We aim to continuously enhance our platform and expand our offerings to meet the evolving needs of our clients, ultimately contributing to a better understanding of our world through advanced satellite imagery.</p>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>



                            {/* Right column */}
                            <div className='col-lg-5 col-md-12 p-3 text-muted'>
                                <div className='row'>
                                    {/* First inner column - 1 column wide */}
                                    <div className='col-1'>
                                        {/* Vertical line */}
                                        <div className="vl"></div>

                                    </div>

                                    {/* Second inner column - 11 columns wide */}
                                    <div className='col-11'>
                                        <div className='rtcol-content'>
                                            <h4>
                                                Access high-resolution satellite imagery and <br />
                                                advanced geospatial data for your <br />
                                                innovative projects with Golden Eye. <br />
                                                Empower your endeavors with precise, up-<br />
                                                to-date insights tailored to your needs.
                                            </h4>
                                        </div>

                                        <div className='aboutus-handimg'>
                                            <img src={aboutushand} className="img-fluid" alt="Responsive Image" loading="lazy" />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <div className="container">
                    <div className="card mx-auto">
                        <div className="card-body text-center">
                            
                            <div className="d-flex flex-column flex-md-row align-items-left justify-content-left mb-4">
                                <img src={GoldenEyelogo} className="aboutlogo img-fluid mb-3 mb-md-0" alt="GoldenEye Logo" width="50" height="auto" />
                                <h2 className="aboutlogoname mt-1">GoldenEye</h2>
                            </div>
                            <h1 className="card-title mt-4">Welcome to Our Golden Eye!</h1>
                            <p className="card-text mt3">
                                Welcome to Golden Eye, your premier platform for high-resolution satellite
                                imagery. A High Resolution Satellite Imagery with different satellites and platforms like
                                Airbus, Planet & MDA. Our high-resolution satellite imagery services provide accurate and
                                up-to-date information for various industries. Whether you're in agriculture, environmental
                                monitoring, urban planning, or emergency response, our advanced satellite technology helps
                                you make well-informed decisions. We are committed to delivering reliable and actionable
                                satellite data to meet your specific needs. Our team of experts ensures that you receive the
                                highest quality satellite imagery for your projects, empowering you to gain valuable
                                insights and stay ahead of the competition.
                            </p>
                            <img src={ourvision_about} className="aboutvision1 img-fluid my-3" alt="Our Vision" />
                            <img src={ourvision_about1} className="aboutvision2 img-fluid my-3" alt="Our Vision" />
                            <p className="card-text1 mt-3">
                                Access high-resolution satellite imagery and advanced geospatial data for
                                your innovative projects with Golden Eye. Empower your endeavors with precise, up-to-date
                                insights tailored to your needs.
                            </p>
                            <a href="#" className="btn btn-primary mt-3">Learn More</a>
                        </div>
                    </div>
                </div> */}
            </div >
            <Footer />
        </>
    );
};

export default About;
