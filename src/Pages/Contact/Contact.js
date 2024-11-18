import React from 'react'
import './Contact.css'
import GoldenEyelogo from '../../assets/Logos/GOLDEYE_LOGO_10K.png';
// import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton'

const Contact = () => {
    return (
        <>
            {/* <StkeyButton /> */}
            <div className="contact-main">
                <div className="contact-container">
                    <div className="col-md-5 left-col">
                    </div>
                    <div className="col-md-7 right-col">
                        <div className="text-left d-flex mb-4 contact-logo">
                            <img
                                className="img-fluid logo-contact"
                                alt="GoldenEye Logo"
                                src={GoldenEyelogo} width="50" height="auto"
                            />
                            <h2 className="logo-name-contact">GoldenEye</h2>
                        </div>
                        <h1 className="text-left">Contact Us</h1>
                        <p className="contact-content text-left">
                            We're excited to hear from you! Please fill out the form, and our team
                            will be in touch shortly. GoldenEye always deals with better products.
                        </p>
                        <form id="contact-form" method="post" className="contact-form mt-4">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Your Full Name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Your Email Address"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea
                                    rows="6"
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    placeholder="Your Message"
                                    required
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" id="submit" name="submit" className="btn btn-primary">Send</button>
                            </div>
                        </form>
                        <div id="error" className="mt-3"></div>
                        <div id="success-msg" className="mt-3"></div>
                    </div>
                </div>
            </div>

            {/* <div className='contactpageclass'>
                <h1>Contact page</h1>
            </div> */}
        </>
    )
}

export default Contact;