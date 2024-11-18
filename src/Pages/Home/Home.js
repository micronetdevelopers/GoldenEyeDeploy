import React, { useState } from 'react'; // Ensure useState is imported
import './Home.css'
// import HomepageVideo from '../websitefrontpagevedio.mp4'
import HomeAbout from '../../assets/images/homeabout.png'
import Airbusone from '../../assets/images/Airbus1.PNG'
import Planetone from '../../assets/images/Planet1.PNG'
import MDAone from '../../assets/images/MDA1.PNG'
import OurServices from '../../assets/images/ourservices.PNG'
import Airbus_logo_BGR_Product from '../../assets/Logos/Airbus_logo_BGR_Product.png'
import MDA_BR from '../../assets/Logos/MDA_BR.png'
import Planet_logo from '../../assets/Logos/Planet_logo.png'

import Footer from '../../reusablecomponents/Footer/Footer'
// import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton'

const Home = () => {
    const [activeCard, setActiveCard] = useState(null);

    const handleCardClick = (index) => {
        setActiveCard(activeCard === index ? null : index);
    };

    const cardData = [
        'Satellite Imagery Search',
        'Imagery Viewing',
        'Imagery Tasking Order',
        'Data Download & Delivery',
        'Technical Support & Consulting',
        'Other Services'
    ];

    return (
        <>
            {/* <StkeyButton/> */}
            <div className='homecontent'>
                {/* Video Section */}
                <div className="container-fluid p-0">
                    <div className="main">
                        <video className="w-100" autoPlay muted loop>
                            {/* <source src={HomepageVideo} type="video/mp4" /> */}
                            <source src="goldeneye/websitefrontpagevedio.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>

                {/* About Section */}
                <div className="container py-5 AboutMainBox">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img src={HomeAbout} className="img-fluid" alt="About Golden Eye" />
                        </div>
                        <div className="col-md-6">
                            <h1 className="display-4">About Golden Eye</h1>
                            <p>
                                Welcome to Golden Eye, your trusted partner in high-resolution satellite imagery. At Golden Eye, we are dedicated to providing an intuitive and user-friendly platform for clients to search, view, and order premium satellite images. Whether you are involved in agriculture, urban planning, environmental monitoring, or disaster management, our services are tailored to meet your specific needs. Golden Eye is a leading provider of high-quality satellite imagery. We leverage the advanced capabilities of AIRBUS satellites to deliver precise and reliable data to our clients. Our team is passionate about helping you harness the power of satellite imagery to make informed, data-driven decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="container-fluid py-4 ProductMainBox">
                    <h1 className="display-4 text-center mb-4">Our Products</h1>
                    <p className="text-center mb-5">
                        At Golden Eye, we offer a comprehensive range of high-resolution satellite imagery products from leading providers, including Airbus, Planet, and MDA. Our diverse product lineup ensures that you have access to the best satellite imagery available to meet your specific needs.
                    </p>
                    <div className="row text-center">
                        <div className='OuterProdBox'>
                            <div className='LogoCard'>
                                <div className="Airbuslogo">
                                    <img src={Airbus_logo_BGR_Product} className="img-fluid" alt="Airbus Logo" />
                                </div>
                            </div>

                            <div className='LogoCard'>
                                <div className="Airbuslogo">
                                    <img src={MDA_BR} className="img-fluid" alt="Airbus Logo" />
                                </div>

                            </div>
                            <div className='LogoCard'>
                            <div className="Airbuslogo">
                                    <img src={Planet_logo} className="img-fluid" alt="Airbus Logo" />
                                </div>

                            </div>
                        </div>
                        {/* <div className="col-4">
                            <img src={Airbusone} className="img-fluid" alt="Airbus" />
                        </div>
                        <div className="col-4">
                            <img src={Planetone} className="img-fluid" alt="Planet" />
                        </div>
                        <div className="col-4">
                            <img src={MDAone} className="img-fluid" alt="MDA" />
                        </div> */}
                    </div>
                </div>

                {/* Services Section */}

                <div className="container-fluid py-5 ServicesMainBox">
                    <h1 className="display-4 text-center mb-4">Our Services</h1>
                    <div className='outermaincardbox'>
                        <div className="cardbox">
                            <h1 className='heading1'>Satellite Imagery Search</h1>

                        </div>

                        <div className="cardbox">
                            <h1 className='heading2'>Imagery Viewing</h1>
                        </div>

                        <div className="cardbox">
                            <h1 className='heading3'>Imagery Tasking Order</h1>
                        </div>

                        <div className="cardbox">
                            <h1 className='heading4'>Data Download & Delivery</h1>
                        </div>

                        <div className="cardbox">
                            <h1 className='heading5'>Technical Support & Consulting</h1>
                        </div>

                        <div className="cardbox">
                            <h1 className='heading6'>Other Services</h1>
                        </div>

                    </div>
                </div>
               
                <Footer />
            </div>

        </>
    );
}

export default Home;