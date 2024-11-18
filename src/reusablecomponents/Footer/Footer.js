import React from "react";
import "./Footer.css";
import GoldenEyelogo from "../../assets/Logos/GOLDEYE_LOGO_10K.png";
import { DoubleRightOutlined, HomeOutlined } from "@ant-design/icons";

const Footer = () => {
  return (
    <>
      <div className="container-fluid footerMainBox ">
        <div class="bg-gray-100">
          <div class="w-full sm:px-6 text-gray-800 grid gap-4 mx-auto Footerbackground lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            <div class="w-full lg:d-flex lg:justify-content-end lg:align-items-center mt-2 ImageContaineroflogo">
              <div class="font-bold text-xl text-indigo-600 lg:text-align-center ">
                {" "}
                <img
              width={150}
               height="auto"
                  src={GoldenEyelogo}
                  className="img-fluid "
                  alt="Golden Eye Logo"
                />
              </div>
            </div>
            <div class="w-full  ServiceContainerMAin">
              <div class="text-sm uppercase text-indigo-600 font-bold mt-2">
              Services
              </div>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined />
                Satellite Imagery Search
                <span class="text-teal-600 text-xs p-1"></span>
              </p>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined /> Imagery Viewing{" "}
                <span class="text-teal-600 text-xs p-1"></span>
              </p>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined />
                Imagery Tasking Orders
              </p>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined />
                Data Download and Delivery
              </p>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined />
                Subscription Services
              </p>
              <p class="my-3 block" href="/#">
                {" "}
                <DoubleRightOutlined />
                Technical Support and Consulting
              </p>
            </div>
            <div class="  w-full ServiceContainer">
              <div class="text-sm uppercase text-indigo-600 font-bold mt-2">
              GoldenEye
              </div>
                <p className="my-3">
                                Welcome to Golden Eye, your premier source for high-resolution satellite imagery. Our platform allows you to search, view, and order top-quality AIRBUS images for various needs. We aim to unlock the potential of satellite imagery by connecting cutting-edge technology with real-world applications, making data access simple and affordable. Join us to experience advanced imagery solutions for your business or project.
                            </p>
            </div>
            <div class="mt-2 ServiceContainer w-1/2 md:w-full">
              <div class="text-sm uppercase text-indigo-600 font-bold">
                Contact us
              </div>
              <p class="my-3 block" href="/#">
              Plot No. 80 K T Nagar, Katol Road, Nagpur - 440013
                <span class="text-teal-600 text-xs p-1"></span>
              </p>
              <p> 
              info@goldeneye.com
               
              </p>
              <p>123-456-7890</p>
             
            </div>
          </div>
        </div>

        {/* <div className="row justify-content-end">
                    <div className="col-md-2 col-sm">
                        <div className="FooteServicesMainBox">
                            <span className="display-5">Services</span>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-chevron-right"></i> Satellite Imagery Search</li>
                                <li><i className="fas fa-chevron-right"></i> Imagery Viewing</li>
                                <li><i className="fas fa-chevron-right"></i> Imagery Tasking Orders</li>
                                <li><i className="fas fa-chevron-right"></i> Data Download and Delivery</li>
                                <li><i className="fas fa-chevron-right"></i> Subscription Services</li>
                                <li><i className="fas fa-chevron-right"></i> Technical Support and Consulting</li>
                                <li><i className="fas fa-chevron-right"></i> Historical Archive Access</li>
                                <li><i className="fas fa-chevron-right"></i> Educational Resources</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 text-left">
                        <div className="FooteGoldenEyeMainBox">
                            <img src={GoldenEyelogo} className="img-fluid mb-3" alt="Golden Eye Logo" width={30} height="auto" />
                            <span className="display-5">GoldenEye</span>
                            <p>
                                Welcome to Golden Eye, your premier source for high-resolution satellite imagery. Our platform allows you to search, view, and order top-quality AIRBUS images for various needs. We aim to unlock the potential of satellite imagery by connecting cutting-edge technology with real-world applications, making data access simple and affordable. Join us to experience advanced imagery solutions for your business or project.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="FooterGetMainBox">
                            <span className="display-5 mb-4">Get in Touch</span>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-chevron-right"></i> Plot No. 80 K T Nagar, Katol Road, Nagpur - 440013</li>
                                <li><i className="fas fa-chevron-right"></i> <a href="mailto:info@goldeneye.com">info@goldeneye.com</a></li>
                                <li><i className="fas fa-chevron-right"></i> 123-456-7890</li>
                            </ul>
                        </div>
                    </div>
                </div> */}
      </div>
    </>
  );
};

export default Footer;
