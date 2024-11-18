import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import './Login.css'; // Import CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faRedo, faSync, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CentraliseButton from '../../reusablecomponents/CentraliseButton/CentraliseButton'
import { useUser } from '../AuthProvider/AuthContext'
import { Link, useLocation } from 'react-router-dom';
import ForgetPass from '../ForgetPass/ForgetPass';
import LoginPageLogo from '../../assets/Logos/LoginPage_LOGO_10k_blue.svg';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookieUtils.js';
import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton.js';
import ModalManager from "../../reusablecomponents/GeopicxPopupModals/ModalManager.js";



const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [enteredCaptcha, setEnteredCaptcha] = useState("");
    const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());
    const [isCaptchaCorrect, setIsCaptchaCorrect] = useState(false);
    const [captchaStyle, setCaptchaStyle] = useState({
        color: getRandomColor(),
        textDecoration: `line-through ${getRandomColor()}`,
        textDecorationAngle: getRandomAngle()
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageC, setErrorMessageC] = useState("");
    const [perrorMessage, setPerrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgetPass, setShowForgetPass] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleCancelClick = () => {
        navigate(-1); // Go back one step in the history stack
    };

    function generateCaptcha() {
        const characters = "abcdefghjkmnopqrstuvwxyz0123456789";
        const captcha = Array.from(
            { length: 6 },
            () => characters[Math.floor(Math.random() * characters.length)]
        );
        return captcha.join("");
    }

    const handleCaptchaChange = (e) => {
        setEnteredCaptcha(e.target.value);
        setErrorMessageC("");
    };

    const refreshCaptcha = () => {
        setGeneratedCaptcha(generateCaptcha());
        setEnteredCaptcha("");
        setIsCaptchaCorrect(false);
        setCaptchaStyle({
            color: getRandomColor(),
            textDecoration: `line-through ${getRandomColor()}`,
            textDecorationAngle: getRandomAngle()
        });
    };

    const validateCaptcha = () => {
        setIsCaptchaCorrect(enteredCaptcha === generatedCaptcha);
    };

    function getRandomColor() {
        const letters = "0123456789abcdefghijkmnopqrstuvwxyz";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }
        return color;
    }

    function getRandomAngle() {
        return `${Math.floor(Math.random() * 8)}deg`;
    }

    const loginValidation = () => {
        let isValid = true;

        if (username.trim() === "") {
            setErrorMessage("Field is required");
            isValid = false;
        }
        if (password.trim() === "") {
            setPerrorMessage("Field is required");
            isValid = false;
        }
        if (enteredCaptcha.trim() === "") {
            setErrorMessageC("Field is required");
            isValid = false;
            refreshCaptcha();
        } else if (!isCaptchaCorrect) {
            setErrorMessageC("Incorrect captcha");
            isValid = false;
            refreshCaptcha();
        }

        return isValid;
    }

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     if (!loginValidation()) {
    //         return; // Don't proceed with the API call if validation fails
    //     }
    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_BASE_URL}/login/`,
    //             {
    //                 username: username,
    //                 password: password,
    //             },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         if (response.status === 200) {
    //             const userData = response.data;
    //             console.log(userData);
    //             login(userData);

    //             // Save to cookies if "Remember Me" is checked
    //             if (rememberMe) {
    //                 setCookie("rememberedUsername", username, 7);
    //                 setCookie("rememberedPassword", password, 7);
    //             } else {
    //                 deleteCookie("rememberedUsername");
    //                 deleteCookie("rememberedPassword");
    //             }

    //             if (userData?.roleName === 'admin' || userData?.roleName === 'superadmin') {
    //                 navigate("/");
    //             } else {
    //                 navigate("/");
    //             }
    //             alert("Login successful ✔");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Perform client-side validation before making the API call
        // if (!loginValidation()) {
        //     ModalManager.error({
        //         modalHeaderHeading: 'Login Error',
        //         modalBodyHeading: 'Validation Failed',
        //         message: 'Please check your input fields and try again.',
        //         confirmButtonText: 'OK',
        //     });
        //     return; // Don't proceed with the API call if validation fails
        // }
        if (!loginValidation()) {
            return; // Don't proceed with the API call if validation fails
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/login/`,
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const userData = response.data;
                console.log(userData);
                login(userData);

                // Save to cookies if "Remember Me" is checked
                if (rememberMe) {
                    setCookie("rememberedUsername", username, 7);
                    setCookie("rememberedPassword", password, 7);
                } else {
                    deleteCookie("rememberedUsername");
                    deleteCookie("rememberedPassword");
                }

                // Handle navigation based on roleName
                if (userData?.roleName === 'admin' || userData?.roleName === 'superadmin') {
                    ModalManager.success({
                        modalHeaderHeading: 'Login Successful',
                        modalBodyHeading: 'Login',
                        message: 'Welcome back, Admin!',
                        confirmButtonText: 'OK',
                    });
                    navigate("/"); // Navigate to admin dashboard
                } else {
                    ModalManager.success({
                        modalHeaderHeading: 'Login Successful',
                        message: 'Welcome back!',
                        confirmButtonText: 'OK',
                    });
                    navigate("/"); // Navigate to user dashboard
                }
            }
        } catch (error) {
            // Handle different error statuses and trigger the appropriate modal
            if (error.response) {
                // Error responses from server
                const status = error.response.status;

                if (status === 400) {
                    // Parse the error message from the response
                    const errorMessage = error.response.data?.non_field_errors?.[0] || "Bad Request";

                    ModalManager.error({
                        modalHeaderHeading: 'Login Error',
                        modalBodyHeading: 'Bad Request',
                        message: errorMessage,
                        confirmButtonText: 'OK',
                    });
                } else if (status === 401) {
                    const errorMessage1 = error.response.data?.detail || "Unauthorized";
                    ModalManager.warning({
                        modalHeaderHeading: 'Unauthorized',
                        modalBodyHeading: 'Login Failed',
                        message: errorMessage1 || 'Invalid credentials. Please try again.',
                        confirmButtonText: 'OK',
                    });
                } else if (status === 403) {
                    ModalManager.warning({
                        modalHeaderHeading: 'Forbidden',
                        modalBodyHeading: 'Access Denied',
                        message: 'You do not have permission to access this resource.',
                        confirmButtonText: 'OK',
                    });
                } else if (status === 500) {
                    ModalManager.error({
                        modalHeaderHeading: 'Server Error',
                        modalBodyHeading: 'Internal Server Error',
                        message: 'There was an issue with the server. Please try again later.',
                        confirmButtonText: 'OK',
                    });
                } else {
                    ModalManager.error({
                        modalHeaderHeading: 'Unknown Error',
                        modalBodyHeading: 'An unexpected error occurred',
                        message: `Status Code: ${status}`,
                        confirmButtonText: 'OK',
                    });
                }
            } else if (error.request) {
                // No response from server
                ModalManager.warning({
                    modalHeaderHeading: 'Network Error',
                    modalBodyHeading: 'No Response',
                    message: 'Unable to reach the server. Please check your internet connection and try again.',
                    confirmButtonText: 'OK',
                });
            } else {
                // Any other errors
                ModalManager.error({
                    modalHeaderHeading: 'Error',
                    modalBodyHeading: 'Unexpected Error',
                    message: `An error occurred: ${error.message}`,
                    confirmButtonText: 'OK',
                });
            }
            console.error(error);
        }
    };


    useEffect(() => {
        const storedUsername = getCookie("rememberedUsername");
        const storedPassword = getCookie("rememberedPassword");

        if (storedUsername) {
            setUsername(storedUsername);
            setRememberMe(true);
        }

        if (storedPassword) {
            setPassword(storedPassword);
        }
    }, []);

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
        if (!rememberMe) {
            deleteCookie("rememberedUsername");
            deleteCookie("rememberedPassword");
        }
    };

    const handleForgetPasswordClick = () => {
        setShowForgetPass(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleBackToLoginClick = () => {
        setShowForgetPass(false);
    };

    // Helper functions to handle cookies
    // function setCookie(name, value, days) {
    //     const expires = new Date(Date.now() + days * 864e5).toUTCString();
    //     document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
    // }

    // function getCookie(name) {
    //     return document.cookie.split("; ").reduce((r, v) => {
    //         const parts = v.split("=");
    //         return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    //     }, "");
    // }

    // function deleteCookie(name) {
    //     setCookie(name, "", -1);
    // }

    return (
        <>
            {/* <StkeyButton /> */}
            <div className="goldeneyelogin-container">
                <div className="goldeneyelogin-left-side">
                    <h1>Welcome to Golden-EYE</h1>
                    <p>Golden Eye is a cutting-edge web-based application that redefines image search
                        and task analytics. Leveraging advanced algorithms, it enables seamless discovery
                        of images based on keywords, metadata, or visual similarity, ensuring precise results
                        tailored to your needs. Beyond search, Golden Eye offers powerful analytics tools that
                        provide deep insights into image data.</p><br />
                    {/* <p>Whether you're monitoring brand perception, tracking trends, or conducting sentiment analysis, its comprehensive analytics capabilities empower users to extract meaningful information from visual content efficiently. With customizable dashboards and robust security measures, Golden Eye is designed to enhance productivity and decision-making across diverse industries, making it an indispensable tool for organizations seeking to harness the full potential of visual data.</p> */}
                </div>
                <div className="goldeneyelogin-vertical-line"></div>
                <div className="goldeneyelogin-right-side">
                    <div className='geoldeneyerightsidemainbox'>
                        <header className="d-flex justify-content-between goldeneyelogin-header">
                            <div className='d-flex'>
                                <img src={LoginPageLogo} width="30" height="auto" />
                                <h4 className="text-heading">Login</h4>
                            </div>
                            <StkeyButton className="ColseBTNlogin" icon={faXmark} isDraggable={false} />
                        </header>
                        {/* Conditionally render Login form or ForgetPass component */}
                        {showForgetPass ? (
                            <ForgetPass onBackToLogin={handleBackToLoginClick} />
                        ) : (
                            <form className="goldeneyelogin-form">
                                {/* <h3 className="text-center">Login</h3> */}
                                <div className="goldeneyelogin-form-group">
                                    <label htmlFor="username" className='d-flex goldeneyeloginlable'><span className="required-field">*</span>Username
                                        <span className="error-message">
                                            {errorMessage && (
                                                <span className="text-danger">
                                                    {errorMessage.toString()}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                    <div className='input-group'>
                                        <div class="input-group-prepend">
                                            <div class="input-group-text"><FontAwesomeIcon
                                                icon={faUser}
                                            /></div>
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            onChange={(e) => {
                                                setErrorMessage("");
                                                setUsername(e.target.value);
                                            }}
                                            className={`form-control ${errorMessage ? "invalid" : ""}`}
                                            value={username} id="username" placeholder='Enter Username'
                                            maxLength="40"
                                            title="Username should be alphanumeric with a maximum of 20 characters" />
                                    </div>

                                </div>
                                <div className="goldeneyelogin-form-group">
                                    <label htmlFor="password" className='d-flex goldeneyeloginlable'><span className="required-field">*</span>Password<span className="error-message">
                                        {perrorMessage && (
                                            <span className="text-danger">
                                                {perrorMessage.toString()}
                                            </span>
                                        )}
                                    </span></label>
                                    <div className='input-group'>
                                        <div class="input-group-prepend">
                                            <div class="input-group-text"><FontAwesomeIcon
                                                icon={faLock}
                                            /></div>
                                        </div>
                                        <input type={showPassword ? "text" : "password"}
                                            onChange={(e) => {
                                                setPerrorMessage("");
                                                setPassword(e.target.value);
                                            }}
                                            value={password}
                                            className={`form-control ${perrorMessage ? "invalid" : ""}`}
                                            name="password" id="password" placeholder='Enter Password'
                                            maxLength="40" />
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <FontAwesomeIcon
                                                    icon={showPassword ? faEye : faEyeSlash}
                                                    onClick={togglePasswordVisibility}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                        {/* <span className="password-icon">
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEye : faEyeSlash}
                                            onClick={togglePasswordVisibility}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </span> */}
                                    </div>
                                </div>
                                <div className="goldeneyelogin-form-group">
                                    <label htmlFor="captcha" className='d-flex goldeneyeloginlable'><span className="required-field">*</span>Enter Captcha Here<span className="error-message">
                                        {errorMessageC && (
                                            <span className="text-danger">{errorMessageC}</span>
                                        )}
                                    </span></label>
                                    <div class="Captchwraper">
                                        <div class="">
                                            <input
                                                className={`form-control CaptachInput ${errorMessageC ? "invalid" : ""}`}
                                                // {`form-control CaptachInput ${errorMessage ? "invalid" : ""}`}
                                                type="text"
                                                value={enteredCaptcha}
                                                onChange={handleCaptchaChange}
                                                onBlur={validateCaptcha}
                                                maxLength="6"
                                                placeholder='Enter Captcha'
                                            />
                                        </div>
                                        <div className='captachmainbox d-flex w-50'>
                                            <div class="CaptchaForFill">
                                                <div className="CaptchTextCenter">
                                                    <p className="text-center p-0" style={{
                                                        color: captchaStyle.color,
                                                        textDecoration: captchaStyle.textDecoration,
                                                        transform: `rotate(${captchaStyle.textDecorationAngle})`
                                                    }}>
                                                        {generatedCaptcha}
                                                    </p>
                                                </div>
                                                {enteredCaptcha.length >= 6 &&
                                                    enteredCaptcha !== generatedCaptcha && (
                                                        <span className="CaptchaMessage">
                                                        </span>
                                                    )}
                                            </div>
                                            <span class="refreshCaptchabtn" >
                                                <FontAwesomeIcon
                                                    // icon={faRedo}
                                                    icon={faSync}
                                                    onClick={refreshCaptcha}
                                                    className="refresh-icon ml-3"
                                                // className={`refresh-icon ml-3 ${isRotating ? 'rotate-icon' : ''}`}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="remeberWraper ">
                                        <div className="LoginRememberme">
                                            <input className="InputCheckBox" value="lsRememberMe" onChange={handleRememberMeChange} checked={rememberMe} type="checkbox" id="rememberMe" />
                                            <label className="check-labels mb-0 mt-0 LoginRememberme" for="flexCheckDefault">
                                                Remember me
                                            </label>
                                        </div>
                                        <div className=" LoginForgot">
                                            <Link onClick={handleForgetPasswordClick}>
                                                <label className="LoginForgot  mb-0 mt-0">Forgot password?</label>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='gap-4 goldeneyeloginbtn'>
                                    <CentraliseButton
                                        type="submit"
                                        text="Login"
                                        onClick={handleLogin}
                                        variant="#2b6e5b"
                                        padding="6px 20px"
                                        hoverBgColor="#2b6e5bcf"
                                        hoverTextColor="white"
                                        width="200px"
                                    />
                                    <CentraliseButton
                                        type="button"
                                        text="Cancel"
                                        variant="#cb5951"
                                        padding="4px 10px"
                                        hoverBgColor="#ab3f3f9e"
                                        hoverTextColor="white"
                                        width="100px"
                                        onClick={handleCancelClick}
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>

        </>
    );
};

export default Login;
