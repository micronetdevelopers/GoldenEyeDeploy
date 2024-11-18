import React, { useState, useEffect } from 'react';
import './CreateAdminUser.css';
import CentralizedInput from '../../../reusablecomponents/CentralizedInput/CentralizedInput';
import { City, Country, State } from "country-state-city";
import { useNavigate } from 'react-router-dom';
import CentraliseButton from '../../../reusablecomponents/CentraliseButton/CentraliseButton'
import { useUser } from '../../AuthProvider/AuthContext';
import ModalManager from '../../../reusablecomponents/GeopicxPopupModals/ModalManager'
import validateInput from '../../../reusablecomponents/CentralizedInput/validationUtils'
import GoldenEyeLogo from '../../../assets/Logos/GOLDEYE_LOGO_10K.png'
import axios from 'axios';
import ProductAllocation from './ProductAllocation';



const CreateAdminUser = () => {
    const [criteriamenu, setCriteriamenu] = useState(false);
const [isimportFile, setisimportFile] = useState(false);
const [isMenuVisible, setIsMenuVisible] = useState(false);
const [isModify, setisModify] = useState(false)
    const [productallocation, setProductallocation] = useState(false)
    const navigate = useNavigate();
    const { user } = useUser();
    // console.log('User', user?.roleName);
    const UserDetails = user?.roleName;
    // console.log("UserDetails ", UserDetails);
    const UserDetailsAccessToken = user?.access;
    // console.log("UserDetailsAccessToken ", UserDetailsAccessToken);


    const handleCancelClick = () => {
        navigate('/');
    };

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
        designation: '',
        department: '',
        country: '',
        state: '',
        city: '',
        mobileNo: '',
        phoneLan: '',
        locationName: '',
        username: '',
        emailId: '',
        emailIdAlt: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false); // Add state for form submission
    const [formErrors, setFormErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');

    const validationRules = {
        firstName: { required: true, maxLength: 20, minLength: 6, pattern: /^[A-Za-z]*$/ },
        middleName: { maxLength: 20 },
        lastName: { required: true, maxLength: 20, minLength: 6, pattern: /^[A-Za-z]*$/ },
        organization: { required: true, maxLength: 100 },
        designation: { required: true, maxLength: 50 },
        department: { required: true, maxLength: 50 },
        country: { required: true },
        state: { required: true },
        city: { required: true },
        mobileNo: { required: true, maxLength: 10, pattern: /^\d{10}$/, patternMessage: "10 digits required" },
        phoneLan: { maxLength: 15 },
        // themeSection: { required: true },
        location: { maxLength: 50 },
        username: { required: true, maxLength: 20, minLength: 6, pattern: /^[a-zA-Z0-9@%&*_\-]*$/, patternMessage: "Alphabet is required" },
        emailId: { required: true, maxLength: 100, pattern: /^[a-z0-9.@]*$/, patternMessage: "Invalid Email format" },
        emailIdAlt: { maxLength: 100 },
    };

    useEffect(() => {
        // Fetch all countries on component mount
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            setStates(State.getStatesOfCountry(selectedCountry));
        } else {
            setStates([]);
            setCities([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            setCities(City.getCitiesOfState(selectedCountry, selectedState));
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);

    // to send the response to backend not shortform in full form country name and state name
    const getCountryName = (isoCode) => {
        const country = Country.getAllCountries().find(
            (c) => c.isoCode === isoCode
        );
        return country ? country.name : "";
    };

    // Helper function to get the state name from ISO code
    const getStateName = (countryIsoCode, stateIsoCode) => {
        const states = State.getStatesOfCountry(countryIsoCode);
        const state = states.find((s) => s.isoCode === stateIsoCode);
        return state ? state.name : "";
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setFormData({
            ...formData,
            country: country,
            state: '',
            city: '',
        });
        setSelectedState('');
        setCities([]);
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setFormData({
            ...formData,
            state: state,
            city: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleValidationError = (name, error) => {
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const validateAllFields = () => {
        let newErrors = {};
        // Assuming validateInput is your validation function
        Object.keys(formData).forEach((key) => {
            const rules = validationRules ? validationRules[key] : null;
            const error = validateInput(formData[key], rules);
            if (error) {
                newErrors[key] = error;
            }
        });
        setFormErrors(newErrors);

        // Return true if there are no errors
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleIsSubmitted = () => {
        // Perform full form validation before checking submission status
        const isValid = validateAllFields();
        // console.log("isValid ", isValid)
        // console.log("isSubmitted ", isSubmitted)
        if (!isValid) {
            console.log('Please fix the errors before submitting the form.');
            return;
        }

        setIsSubmitted(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate all fields first
        const isValid = validateAllFields();

        // If the form has errors, stop here
        if (!isValid) {
            console.log('Form has validation errors.');
            return;
        }

        // Only continue if the form is valid and isSubmitted is true
        handleIsSubmitted();

        if (!isSubmitted) {
            return;
        }

        // Display confirmation modal before submitting
        ModalManager.confirm({
            modalHeaderHeading: UserDetails === 'superadmin' ? 'Create Admin User' : UserDetails === 'admin' ? 'Create Authorized User' : 'Create User',
            modalBodyHeading: 'Are you sure?',
            message: 'Please Confirm Form Submission',
            logo: GoldenEyeLogo,
            confirmButtonText: 'Yes, Submit!',
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    // User confirmed, proceed with form submission logic

                    const fullCountryName = getCountryName(formData.country);
                    const fullStateName = getStateName(formData.country, formData.state);

                    const updatedFormData = {
                        username: formData.username,
                        organization_name: formData.organization,
                        first_name: formData.firstName,
                        middle_name: formData.middleName,
                        last_name: formData.lastName,
                        designation: formData.designation,
                        department: formData.department,
                        country: fullCountryName,
                        state: fullStateName,
                        city: formData.city,
                        mobile_number: formData.mobileNo,
                        phoneLan: formData.phoneLan,
                        locationName: formData.locationName,
                        email: formData.emailId,
                        emailIdAlt: formData.emailIdAlt,
                        ...(UserDetails === 'superadmin' && { groups: [2] }), // Add groups key only if superadmin
                        ...(UserDetails === 'admin' && { groups: [3] }),        // Add groups key only if admin
                    };

                    console.log('Form submitted successfully', updatedFormData);
                    try {
                        // Make the API call using axios with Authorization header
                        const response = await axios.post(
                            `${process.env.REACT_APP_BASE_URL}/register/`,
                            updatedFormData,
                            {
                                headers: {
                                    'Authorization': `Bearer ${UserDetailsAccessToken}`, // Pass the JWT token in Authorization header
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        console.log('Response from API:', response.data);
                        // Handle the successful response here (e.g., redirect or show success message)

                    } catch (error) {
                        // Handle different error cases based on HTTP status codes
                        if (error.response) {
                            const status = error.response.status;
                            if (status === 400) {
                                // Extract the error messages from the response
                                const errorData = error.response.data;
                                let errorMessage = "Bad Request";

                                // Iterate through the error keys and concatenate messages
                                if (errorData) {
                                    errorMessage = Object.keys(errorData)
                                        .map((key) => `${key}: ${errorData[key].join(", ")}`)
                                        .join("\n");
                                }

                                ModalManager.error({
                                    modalHeaderHeading: 'Form Error',
                                    modalBodyHeading: 'Bad Request',
                                    message: errorMessage,
                                    confirmButtonText: 'OK',
                                });
                            } else if (status === 401) {
                                const errorDetail = error.response.data?.detail;
                                ModalManager.warning({
                                    modalHeaderHeading: UserDetails === 'superadmin' ? 'Create Admin User' : UserDetails === 'admin' ? 'Create Authorized User' : 'Create User',
                                    modalBodyHeading: 'Failed',
                                    message: errorDetail || 'Invalid credentials. Please try again.',
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
    const data1 = [
        {
          id: 0,
          header: "SPOT",
          selected: 0,
          total: 3,
          items: [
            { name: "SPOT-1.5m-MONO", selected: 1 },
            { name: "SPOT-1.5m-STEREO", selected: 0 },
            { name: "SPOT-1.5m-TRISTEREO", selected: 0 }
          ]
        },
        {
          id: 1,
          header: "Pleiades-Neo (0.3m)",
          selected: 1,
          total: 3,
          items: [
            { name: "Pleiades-Neo-0.3m-MONO", selected: 1 },
            { name: "Pleiades-Neo-0.3m-STEREO", selected: 0 },
            { name: "Pleiades-Neo-0.3m-TRISTEREO", selected: 0 }
          ]
        },
        {
          id: 2,
          header: "Pleiades (0.5m)",
          selected: 1,
          total: 3,
          items: [
            { name: "Pleiades-0.5m-MONO", selected: 1 },
            { name: "Pleiades-0.5m-STEREO", selected: 0 },
            { name: "Pleiades-0.5m-TRISTEREO", selected: 0 }
          ]
        },
        {
            id: 3,
            header: "DMC",
            selected: 0,
            total: 2,
            items: [
              { name: "Wide Scan SAR (WS)", selected: 0 },
              { name: "Scan SAR (SC)", selected: 0 }
            ]
          },
        {
          id: 3,
          header: "Terra SAR-X",
          selected: 0,
          total: 2,
          items: [
            { name: "Wide Scan SAR (WS)", selected: 0 },
            { name: "Scan SAR (SC)", selected: 0 }
          ]
        },
        {
            id: 3,
            header: "Elevation30",
            selected: 0,
            total: 2,
            items: [
              { name: "Wide Scan SAR (WS)", selected: 0 },
              { name: "Scan SAR (SC)", selected: 0 }
            ]
          },
          {
            id: 3,
            header: "WorldDEM",
            selected: 0,
            total: 2,
            items: [
              { name: "Wide Scan SAR (WS)", selected: 0 },
              { name: "Scan SAR (SC)", selected: 0 }
            ]
          },
          {
            id: 3,
            header: "WorldDEM NEO",
            selected: 0,
            total: 2,
            items: [
              { name: "Wide Scan SAR (WS)", selected: 0 },
              { name: "Scan SAR (SC)", selected: 0 }
            ]
          }
      ];

const handleProductallocation=()=>{
    setProductallocation(!productallocation)
    setCriteriamenu(false);
    setIsMenuVisible(false);
    setisModify(false);
    setisimportFile(false);
}


    return (
        <>
            {/* <StkeyButton /> */}
            <div className="container CreateAdminUserBox">
                {/* <h4 className="mb-4">Create Admin User</h4> */}

                <form onSubmit={handleSubmit} className='GECreateUsersForm'>
                    <fieldset className="FiledSetUserCreate  px-3">
                        <legend className="the-legend">
                            {UserDetails === 'superadmin' ? 'Create Admin User' : UserDetails === 'admin' ? 'Create Authorized User' : 'Create User'}
                        </legend>

                        {/* First row */}
                        <div className="row">
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    label="First Name"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your First Name"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="middleName"
                                    type="text"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    label="Middle Name"
                                    validationRules={validationRules}
                                    placeholder="Enter Your Middle Name"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    label="Last Name"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Last Name"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                        </div>

                        {/* Second row */}
                        <div className="row">
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="organization"
                                    type="text"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    label="Organization"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Organization"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="designation"
                                    type="text"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    label="Designation"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Designation"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <span style={{position:"absolute", paddingLeft:"97px"}}><button onClick={handleProductallocation}  className='bg-dark'>dd</button></span>
                                <CentralizedInput
                                    name="department"
                                    type="text"
                                    value={formData.department}
                                    onChange={handleChange}
                                    label="Department"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Department"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                        </div>
                      

                        {/* Fourth row */}
                        <div className="row">
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="country"
                                    type="select"
                                    value={formData.country}
                                    onChange={(e) => {
                                        handleCountryChange(e);
                                        handleChange(e); // Ensure formData is updated
                                    }}
                                    label="Country"
                                    required
                                    options={countries.map(c => ({ value: c.isoCode, label: c.name }))}
                                    validationRules={validationRules}
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                    className='GECreateUserSelecte'
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="state"
                                    type="select"
                                    value={formData.state}
                                    onChange={(e) => {
                                        handleStateChange(e);
                                        handleChange(e); // Ensure formData is updated
                                    }}
                                    label="State"
                                    required
                                    options={states.map(s => ({ value: s.isoCode, label: s.name }))}
                                    validationRules={validationRules}
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="city"
                                    type="select"
                                    value={formData.city}
                                    onChange={handleChange}
                                    label="City"
                                    required
                                    options={cities.map(c => ({ value: c.isoCode, label: c.name }))}
                                    validationRules={validationRules}
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                        </div>
                        {productallocation &&
                        <ProductAllocation
                        initialData={data1}
                        setProductallocation={setProductallocation}
                        
                        
                        />
                        }
                        {/* Fifth row */}
                        <div className="row">
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="mobileNo"
                                    type="text"
                                    value={formData.mobileNo}
                                    onChange={handleChange}
                                    label="Mobile No"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Mobile No"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="phoneLan"
                                    type="text"
                                    value={formData.phoneLan}
                                    onChange={handleChange}
                                    label="Phone (Landline)"
                                    validationRules={validationRules}
                                    placeholder="Enter Your Phone (Landline)"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="locationName"
                                    type="text"
                                    value={formData.locationName}
                                    onChange={handleChange}
                                    label="Location Name"
                                    validationRules={validationRules}
                                    placeholder="Enter Your Location Name"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                        </div>

                        {/* Sixth row */}
                        <div className="row">
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    label="Username"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Username"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="emailId"
                                    type="email"
                                    value={formData.emailId}
                                    onChange={handleChange}
                                    label="Email ID"
                                    required
                                    validationRules={validationRules}
                                    placeholder="Enter Your Email ID"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                            <div className="col-md-4">
                                <CentralizedInput
                                    name="emailIdAlt"
                                    type="email"
                                    value={formData.emailIdAlt}
                                    onChange={handleChange}
                                    label="Alternate Email ID"
                                    validationRules={validationRules}
                                    placeholder="Enter Your Alternate Email ID"
                                    onValidationError={handleValidationError}
                                    validateOnSubmit={true}
                                    isSubmitted={isSubmitted}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div class="row d-flex justify-content-center mt-3 mb-2 mx-3">
                        <div class="col d-flex justify-content-center">
                            <CentraliseButton
                                type="submit"
                                text={UserDetails === 'superadmin' ? 'Create Admin' : UserDetails === 'admin' ? 'Create Authorized' : 'Create User'}
                                onClick={handleIsSubmitted}
                                variant="#2b6e5b"
                                padding="0px 4px"
                                hoverBgColor="#2b6e5bcf"
                                hoverTextColor="white"
                                width="150px"
                                fontsize='15px'
                            />
                        </div>
                        <div class="col d-flex justify-content-center ">
                            <CentraliseButton
                                type="button"
                                text="CANCEL"
                                variant="#cb5951"
                                padding="0px 4px"
                                hoverBgColor="#ab3f3f9e"
                                hoverTextColor="white"
                                width="150px"
                                fontsize='15px'
                                onClick={handleCancelClick}
                            />
                        </div>
                    </div>
                </form>

            </div >
        </>
    );
};

export default CreateAdminUser;

