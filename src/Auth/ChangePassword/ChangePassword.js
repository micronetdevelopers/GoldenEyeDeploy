import React, { useState, useEffect } from 'react';
import '../Login/Login.css';
import './ChangePassword.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";
import GoldenEyeLogo from '../../assets/Logos/GOLDEYE_LOGO_10K.png';
import CentraliseButton from '../../reusablecomponents/CentraliseButton/CentraliseButton'
import StkeyButton from '../../reusablecomponents/StkeyButton/StkeyButton'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalManager from '../../reusablecomponents/GeopicxPopupModals/ModalManager';
import oldpass from '../../assets/Logos/reset-password.png'
import passwordlog from '../../assets/Logos/password.png'
import confpass from '../../assets/Logos/padlock.png'
import { useUser } from '../../Auth/AuthProvider/AuthContext';

const minLength = 8;
const maxLength = 40;

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [OldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [OldperrorMessage, setOldPerrorMessage] = useState('');
    const [perrorMessage, setPerrorMessage] = useState('');
    const [confirmPerrorMessage, setConfirmPerrorMessage] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(false); // New state
    const [uidb64, setUidb64] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const { user, logout } = useUser();

    const searchParams = new URLSearchParams(location.search);

    const username = searchParams.get('username');
    const roleName = searchParams.get('roleName');
    const accessToken = searchParams.get('accessToken');
    console.table([username, roleName, accessToken, location])
    // useEffect(() => {
    //     const pathname = location.pathname;
    //     console.log("pathname ", pathname)
    //     const pathSegments = pathname.split('/').filter(Boolean); // Split and remove empty segments
    //     if (pathSegments.length >= 2) {
    //         setUidb64(pathSegments[pathSegments.length - 2]); // The token before the last segment
    //         setTokenValue(pathSegments[pathSegments.length - 1]); // The last segment
    //     }
    // }, [location]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const validatePassword = (passwordargu) => {
        if (!passwordargu) return "Password is required.";
        if (passwordargu.length < minLength) return `At least ${minLength} characters long.`;
        if (passwordargu.length > maxLength) return `No more than ${maxLength} characters long.`;
        if (!/[A-Z]/.test(passwordargu)) return "At least one uppercase letter.";
        if (!/[a-z]/.test(passwordargu)) return "At least one lowercase letter.";
        if (!/[!@#$%^&*]/.test(passwordargu)) return "At least one special character !@#$%^&* ";
        if (!/\d/.test(passwordargu)) return "At least one number.";
        return '';
    };

    const handleOldPasswordChange = (e) => {
        const OldPasswords = e.target.value;
        setOldPassword(OldPasswords);
        setOldPerrorMessage(validatePassword(OldPasswords));
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPerrorMessage(validatePassword(newPassword));
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (newConfirmPassword !== password) {
            setConfirmPerrorMessage("Passwords do not match.");
        } else {
            setConfirmPerrorMessage('');
        }
    };
    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout successful');
        } catch (error) {
            console.error("Logout failed:", error);
        }
        navigate("/login");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords before submission
        const passwordError = validatePassword(password);
        setPerrorMessage(passwordError);
        if (passwordError) return;

        if (confirmPassword !== password) {
            setConfirmPerrorMessage("Passwords do not match.");
            return;
        }

        setConfirmPerrorMessage('');
        setIsLoading(true);
        // Display confirmation modal before submitting
        ModalManager.confirm({
            modalHeaderHeading: 'Change Password',
            modalBodyHeading: 'Are you sure?',
            message: 'Please Confirm Form Submission',
            logo: GoldenEyeLogo,
            confirmButtonText: 'Yes, Submit!',
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Make the API call using axios
                        const response = await axios.post(
                            `${process.env.REACT_APP_BASE_URL}/change-password/`,
                            {
                                current_password: OldPassword,
                                new_password: confirmPassword
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,  // Add Authorization header with token
                                    'Content-Type': 'application/json',
                                }
                            }
                        );

                        // Check if response is OK (status code 200-299)
                        if (response.status >= 200 && response.status < 300) {
                            const responsemessage = response.data.message;
                            console.log("responsemessage ", responsemessage)
                            setErrorMessage("");
                            setIsPasswordChanged(true); // Set password change success
                            ModalManager.success({
                                modalHeaderHeading: "Change Password",
                                modalBodyHeading: "Success",
                                message: "Your password has been changed successfully & Your user credentials have been temporarily logged out ",
                                onConfirm: () => {
                                    handleLogout();
                                    // navigate("/Login");
                                },
                                confirmButtonText: "OK",
                            }).then(() => {
                                window.location.href = "/Login";
                            });
                        }
                    } catch (error) {
                        // Handle different error statuses and trigger the appropriate modal
                        if (error.response) {
                            // Error responses from server
                            const status = error.response.status;

                            if (status === 400) {
                                // Extract the error messages from the response
                                const errorData = error.response.data.error;

                                ModalManager.error({
                                    modalHeaderHeading: 'Form Error',
                                    modalBodyHeading: 'Bad Request',
                                    message: errorData,
                                    confirmButtonText: 'OK',
                                });
                            } else if (status === 401) {
                                ModalManager.warning({
                                    modalHeaderHeading: 'Unauthorized',
                                    modalBodyHeading: 'Failed',
                                    message: 'Invalid credentials. Please try again.',
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
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    // User canceled the form submission
                    console.log('Form submission canceled.');
                }
            })
            .catch((error) => {
                console.error('An error occurred while handling the confirmation:', error);
            });
    };


    const handleCancelClick = () => {
        navigate('/');
    };

    return (
        <>
            {/* <StkeyButton /> */}
            <div className="goldeneyechangepass-container">
                <div className="goldeneyechangepass-right-side">
                    <div className='geoldeneyerightsidemainboxchange'>
                        <header className="d-flex justify-content-between goldeneyechangepass-header">
                            <div className='d-flex'>
                                <img src={GoldenEyeLogo} width="30" height="30" alt="GoldenEye Logo" />
                                <h4 className="text-heading">Change Password</h4>
                            </div>
                            <StkeyButton className="ColseBTNchangepass" icon={faXmark} isDraggable={false} />
                        </header>
                        <form className="goldeneyechangepass-form" onSubmit={handleSubmit}>
                            <fieldset className="GECHfieldset mb-2">
                                <legend className="GECHlegend">Create Your Password </legend>
                                {isPasswordChanged ? (
                                    <>
                                        <div className="alert alert-success" role="alert"><h3 className="text-center text-success">Password changed successfully!</h3></div>
                                        <div className="text-center mt-3">
                                            <Link to="/login" >Go to Login</Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center text-info">
                                            {username + '(' + roleName + ')'}
                                        </div>
                                        {/* <h3 className="text-center">Reset Password</h3> */}
                                        <div className="goldeneyechangepass-form-group">
                                            <label htmlFor="password" className='d-flex goldeneyechangepasslable'>
                                                <span className="required-field">*</span>Old Password
                                                <span className="error-messagechgpass">
                                                    {OldperrorMessage && (
                                                        <span className="text-danger">
                                                            {OldperrorMessage.toString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                            <div className='input-group'>
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <img src={oldpass} alt='old password' width={15} height={15} />
                                                    </div>
                                                </div>
                                                <input
                                                    type={showOldPassword ? "text" : "password"}
                                                    onChange={handleOldPasswordChange}
                                                    onBlur={() => setOldPerrorMessage(validatePassword(OldPassword))}
                                                    value={OldPassword}
                                                    className={`form-control ${OldperrorMessage ? "invalid" : ""}`}
                                                    name="OldPassword"
                                                    id="OldPassword"
                                                    placeholder='Enter Old Password'
                                                    maxLength={maxLength}
                                                    required
                                                /></div>
                                        </div>
                                        <div className="goldeneyelogin-form-group">
                                            <label htmlFor="password" className='d-flex goldeneyechangepasslable'>
                                                <span className="required-field">*</span>Password
                                                <span className="error-messagechgpass">
                                                    {perrorMessage && (
                                                        <span className="text-danger">
                                                            {perrorMessage.toString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                            <div className='input-group'>
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <img src={passwordlog} alt='password' width={15} height={16} />
                                                    </div>
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    onChange={handlePasswordChange}
                                                    onBlur={() => setPerrorMessage(validatePassword(password))}
                                                    value={password}
                                                    className={`form-control ${perrorMessage ? "invalid" : ""}`}
                                                    name="password"
                                                    id="password"
                                                    placeholder='Enter Password'
                                                    maxLength={maxLength}
                                                    required
                                                />
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
                                            <label htmlFor="confirmPassword" className='d-flex goldeneyechangepasslable'>
                                                <span className="required-field">*</span>Confirm Password
                                                <span className="error-messagechgpass">
                                                    {confirmPerrorMessage && (
                                                        <span className="text-danger">
                                                            {confirmPerrorMessage.toString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                            <div className='input-group'>
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <img src={confpass} alt='Confrim password' width={15} height={16} />
                                                    </div>
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    onChange={handleConfirmPasswordChange}
                                                    onBlur={() => {
                                                        if (confirmPassword !== password) {
                                                            setConfirmPerrorMessage("Passwords do not match.");
                                                        } else {
                                                            setConfirmPerrorMessage('');
                                                        }
                                                    }}
                                                    value={confirmPassword}
                                                    className={`form-control ${confirmPerrorMessage ? "invalid" : ""}`}
                                                    name="confirmPassword"
                                                    id="confirmPassword"
                                                    placeholder='Confirm Password'
                                                    maxLength={maxLength}
                                                    required
                                                />
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <FontAwesomeIcon
                                                            icon={showConfirmPassword ? faEye : faEyeSlash}
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* <span className="password-iconchangepass">
                                                <FontAwesomeIcon
                                                    icon={showConfirmPassword ? faEye : faEyeSlash}
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </span> */}
                                            </div>
                                        </div>

                                    </>
                                )}
                                {errorMessage && (
                                    <div className="error-messagechgpass text-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                            </fieldset>
                            {/* <div className='goldeneyeloginbtn'>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Changing Password...' : 'Change Password'}
                                </button>
                            </div> */}
                            <div className="GECHbtn d-flex justify-content-around align-items-between">
                                <CentraliseButton
                                    className=""
                                    type="submit"
                                    text="SUBMIT"
                                    variant="#2b6e5b"
                                    hoverBgColor="#2b6e5bcf"
                                    hoverTextColor="white"
                                    fontsize="16px"
                                    padding="0px 4px"
                                    width="150px"
                                />
                                <CentraliseButton
                                    className="  "
                                    type="submit"
                                    text="CANCEL"
                                    variant="#ab683f"
                                    padding="0px 6px"
                                    hoverBgColor="#ab683f9e"
                                    hoverTextColor="white"
                                    fontsize="16px"
                                    width="100px"
                                    onClick={handleCancelClick}
                                />
                            </div>
                            <div style={{ fontSize: '12px' }} className='mt-2'>
                                <ol className="text-success changepass-Info">
                                    <li className="m-0 p-0 text-left">
                                        Must be at least 8 characters long.
                                    </li>
                                    <li className="m-0 p-0 text-left">
                                        Must include special characters like <b>!@#$%^&*</b>
                                    </li>
                                    <li className="m-0 p-0 text-left">
                                        Must include  numbers.
                                    </li>
                                    <li className="m-0 p-0 text-left">
                                        Must include at least one uppercase letter and one lowercase letter.
                                    </li>
                                </ol>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
