import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgetPass.css';
import CentralizedInput from '../../reusablecomponents/CentralizedInput/CentralizedInput';
// import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgetPass = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validationRules = {
        email: {
            required: true,
            maxLength: 100,
            pattern: emailRegex,
            patternMessage: "Invalid Email format"
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Proceed with sending the email
        const redirectLink = `${process.env.REACT_APP_FRONT_END_URL}/ChangePassword`;

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/request-reset-email/`,
                {
                    email: email.toLowerCase(),
                    redirectlink: redirectLink,
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                setSuccessMessage(
                    'An email has been sent to your registered email address. Please click on the link provided in that email.'
                );
            }
        } catch (error) {
            setErrorMessage('An error occurred while sending the email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidationError = (errors) => {
        setErrorMessage(errors.email || '');
    };

    return (
        <>
            {/* <StkeyButton /> */}
            <div className="d-flex justify-content-center align-items-center ForGetPassWord">
                <div className="col-md-8">
                    {successMessage ? (
                        <div className="text-center">
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                            <div className="text-center mt-3 mb-4">
                                <Link to="#" onClick={onBackToLogin}>
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-center mb-4 ForGetPassWordHeading">Forget Password</h3>
                            <form className='ForGetPassWordForm' onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <CentralizedInput
                                        name="emailId"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        label="Email address"
                                        required
                                        onValidationError={handleValidationError}
                                        validationRules={validationRules}
                                        placeholder="Enter Your Email Id"
                                        validateOnSubmit={true}
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                            <div className="text-center mt-3 mb-4">
                                <Link to="#" onClick={onBackToLogin}>
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgetPass;
