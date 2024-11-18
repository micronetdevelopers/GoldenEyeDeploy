import React from 'react'
import './Services.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import video from '../../assets/Video/night_animated_vedeio.mp4';
import Satellite_Imagery_Search from '../../assets/images/Satellite_Imagery_Search.png';
import ImageryViewing from '../../assets/images/Imagery Viewing.png';
import ImageryTaskingOrders from '../../assets/images/Imagery Tasking Orders.png';
import DataDownloadandDelivery from '../../assets/images/Data Download and Delivery.png';
import SubscriptionServices from '../../assets/images/Subscription Services.png';
import TechnicalSupportandConsulting from '../../assets/images/Technical Support and Consulting.png';
import HistoricalArchiveAccess from '../../assets/images/Historical Archive Access.png';
import EducationalResources from '../../assets/images/Educational Resources.png';


const Services = () => {
    const services = [
        {
            id: 1,
            imgSrc: Satellite_Imagery_Search,
            title: 'Satellite Imagery Search',
            description:
                'Short Description: Download purchased imagery securely in various formats compatible with GIS software, such as GeoTIFF, JPEG, and KMZ.',
        },
        {
            id: 2,
            imgSrc: ImageryViewing,
            title: 'Imagery Viewing',
            description:
                'Preview Satellite Imagery in High Resolution Short Description: Explore and preview high-resolution satellite images with our interactive map interface before making a purchase.',
        },
        {
            id: 3,
            imgSrc: ImageryTaskingOrders,
            title: 'Imagery Tasking Orders',
            description:
                'Order custom satellite imagery for future acquisitions, tailored to your specific needs in terms of resolution and coverage area.',
        },
        {
            id: 4,
            imgSrc: DataDownloadandDelivery,
            title: 'Data Download & Delivery',
            description:
                'Order custom satellite imagery for future acquisitions, tailored to your specific needs in terms of resolution and coverage area.',
        },

        {
            id: 5,
            imgSrc: SubscriptionServices,
            title: 'Subscription Services',
            description:
                'Access updated satellite imagery regularly with our subscription plans, and receive notifications for new imagery of your specified regions or interests.',
        },
        {
            id: 6,
            imgSrc: TechnicalSupportandConsulting,
            title: 'Technical Support & Consulting',
            description:
                'Get dedicated support for orders, downloads, and technical issues, along with consulting services for customized analysis and project-specific imagery solutions.',
        },
        {
            id: 7,
            imgSrc: HistoricalArchiveAccess,
            title: 'Historical Archive Access',
            description:
                'Access an extensive archive of historical satellite imagery for long-term projects, and use tools to compare historical and current imagery to assess changes over time.',
        },
        {
            id: 8,
            imgSrc: EducationalResources,
            title: 'Educational Resources',
            description:
                'Access tutorials, webinars, and documentation to effectively use satellite imagery and the Golden Eye platform, along with case studies showcasing successful applications.',
        },












    ];



    return (
        <div  
            >
            <div className="position-relative overflow-hidden" style={{ height: '93vh' }}>
                <video className="w-100 h-100 position-absolute top-0 start-0 object-fit-cover" autoPlay muted loop>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white px-3">
                    <h1 className="display-4 responsive-heading" >Take Your Business to Higher Ground</h1>
                    <p className="lead responsive-paragraph" >
                        We give best services to our clients & we deal always with better products.</p>
                </div>
            </div>




        <div   style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
            url(https://wmo.int/sites/default/files/2023-03/AdobeStock_580430822.jpeg) center center / cover`,
            objectFit: "cover",
            backgroundSize: "cover",
            backgroundPosition: "center"}}>
        <section className="py-5  Containinsideservicepage " 
      
            >
                <div>
                    <div className="justify-content-center d-flex align-item-center
                    " >
                        <div>
                            <div className="text-center" style={{ paddingTop: '20px' }}>
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-4 service-heading"
                                        style={{
                                            fontSize: '2rem',
                                        }} >Discover Golden Eye Services</Card.Title>

                                    <Card.Text
                                        style={{
                                            paddingBottom: '10px',

                                        }}>
                                        Welcome to Golden Eye, your ultimate destination for high-resolution satellite imagery solutions. From advanced search capabilities to custom image orders, secure data downloads, and expert analysis tools, we provide everything you need to leverage the power of satellite data. Explore our diverse services and see how we can support your projects with precision and efficiency.
                                    </Card.Text>

                                </Card.Body>
                            </div>


                            <div className="
                             py-4">
                                {/* Top Row */}
                                {/* <div className="row">
                                    {services.map((service) => (
                                        <div className="col-lg-3 col-md-6 mb-4" key={service.id}>
                                            <div className="card h-100 d-flex flex-column">
                                                <img
                                                    src={service.imgSrc}
                                                    className="card-img-top"
                                                    alt={service.title}
                                                    loading="lazy"
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">
                                                        {service.title}</h5>
                                                    <p className="card-text">
                                                        {service.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div> */}

                                {/* Bottom Row */}
                                {/* <div className="row">
                                    {services.slice(1, 1).map((service) => (
                                        <div className="col-lg-3 col-md-6 mb-4" key={service.id}>
                                            <div className="card h-100">
                                                <img
                                                    src={service.imgSrc}
                                                    className="card-img-top"
                                                    alt={service.title}
                                                    loading="lazy"
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        {service.title}
                                                    </h5>
                                                    <p
                                                        className="card-text"
                                                        style={{ fontSize: '15px', textAlign: 'center' }}
                                                    >
                                                        {service.description}

                                                    
                                                        <div className="mt-auto"></div>

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div> */}

                                <div className="row">
                                    {services.map((service) => (
                                        <div className="col-lg-3 col-md-6 col-sm-12  containerOfService container" key={service.id} style={{ '--clr': '#009688' }}>
                                            <div className="cardServices ">
                                            <div class="img-box">
                                               
                                                <img
                                                    src={service.imgSrc}
                                                    // className="card-img-top"
                                                    alt={service.title}
                                                    loading="lazy"
                                                />
                                                 </div>
                                                <div className="contentOfSErvices">
                                                    <h2 className='Titleofcardservice'>
                                                        {service.title}</h2>
                                                    <p>
                                                        {service.description}</p>
                                                        <a href="">Read More</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {services.map((service) => (
    <div
      className="containerOfService p-4"
      key={service.id}
      style={{ '--clr': '#009688' }}
    >
      <div className="cardServices bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="img-box">
          <img
            src={service.imgSrc}
            alt={service.title}
            loading="lazy"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="contentOfSErvices p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {service.title}
          </h2>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <a href="#" className="text-blue-500 hover:underline">
            Read More
          </a>
        </div>
      </div>
    </div>
  ))}
</div> */}

                                {/* <div class="containerOfService">
        <div class="cardServices" style={{ '--clr': '#009688' }}>
            <div class="img-box">
                <img src="https://www.trio.dev/hubfs/Imported_Blog_Media/263a75529a1752b75d64f9f21fd07c92-3-2.jpg"/>
            </div>
            <div class="contentOfSErvices">
                <h2>Development</h2>
                <p>
                    As a front-end developer, I have extensive experience in everything from simple landing pages to extensive large-scale projects for hotels and resorts. There is no project too big or too small. 
                </p>
                <a href="">Read More</a>
            </div>
        </div>
        <div class="cardServices" style={{ '--clr': '#009688' }}>
            <div class="img-box">
                <img src="https://www.freecodecamp.org/news/content/images/2021/09/emily-bernal-v9vII5gV8Lw-unsplash.jpg"/>
            </div>
            <div class="contentOfSErvices">
                <h2>Design</h2>
                <p>
                   As a graphic designer I have worked in many industries on everything from apparel to branding for companies large and small. I can help with full re-branding, or building awareness for a brand that already exists. 
                </p>
                <a href="">Read More</a>
            </div>
        </div>
        <div class="cardServices" style={{ '--clr': '#009688' }}>
            <div class="img-box">
                <img src="https://www.graphicdesigndegreehub.com/wp-content/uploads/2020/09/If-I-Do-Not-Like-Coding-is-a-Graphic-Design-Degree-Right-for-Me.jpg"/>
            </div>
            <div class="contentOfSErvices">
                <h2>Playground</h2>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Architecto, hic? Magnam eum error saepe doloribus corrupti
                    repellat quisquam alias doloremque!
                </p>
                <a href="">Read More</a>
            </div>
        </div>
    </div> */}
                            </div>




                        </div>
                    </div>
                </div>
            </section>
        </div>
           




        </div>
    )
}


export default Services;