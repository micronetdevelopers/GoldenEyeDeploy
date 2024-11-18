import { useEffect, useState } from "react";
import { dateConvertForTasking, Delivery, PriceComponent, Production, taskingJson, taskingUrl, Step3 } from "./SearchComponents"; // Replace with actual component paths
import axios from "axios";
import { useUser } from "../../../Auth/AuthProvider/AuthContext";
import { Button, Checkbox, Col, Modal, Row, Spin, Steps, Timeline, Typography } from "antd";
import ModalManager from "../../../reusablecomponents/GeopicxPopupModals/ModalManager";





const Page = {
    Step1: 1,
    Step2: 2,
    Step3: 3,
};

const FINAL_STEP = Page.Step3;

function MultiStepForm({ onBack, componentValues, mission, customerReference, formState, userName, toggleOffCanvas, onSubmit = () => { } }) {
    const { access } = useUser();
    const [currentStep, setCurrentStep] = useState(Page.Step1);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);
    const [isTaskComplete, setIsTaskComplete] = useState(false)
    const [massage, setMassage] = useState(false)

    const [checkBox1, setCheckBox1] = useState(false)
    const [checkBox2, setCheckBox2] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productionFormValues, setProductionFormValues] = useState();
    const [deliveryFormValues, setDeliveryFormValues] = useState();
    const [error, setError] = useState(null);

    const [inputs, setInputs] = useState({
        step1: {
            processing_level: "",
            projection_1: "",
            spectral_processing: "",
            dem: "",
            image_format: "",
            pixel_coding: "",
            radiometric_processing: "",
            licence: "",
        },
        step2: {
            customerReference: "",
            application: "",
            program: "",
            deliveryType: "",
            email: "",
            addedEmails: [""],
        },
        // step3: {
        //     loading1: false,
        //     isTaskComplete: false,
        //     customerReference: customerReference,
        //     componentValues: componentValues,
        // },
    });

    useEffect(() => {
        if (access) {
            getSubscription();
        }
    }, [access]);

    const getSubscription = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/providers/airbus/subscriptions/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );

            const { production, delivery } = res.data.subscriptions.tasking.serviceInfo;



            setProductionFormValues(Object.values(production).map((obj) => obj));
            setDeliveryFormValues(Object.values(delivery).map((obj) => obj));
            // Set the initial input values directly using field names
            if (production && delivery) {
                setInputs((prevInputs) => ({
                    ...prevInputs,
                    step1: {
                        ...prevInputs.step1,
                        processing_level: production.processing_level?.defaultValue || "",
                        projection_1: production.projection_1?.defaultValue || "",
                        spectral_processing: production.spectral_processing?.defaultValue || "",
                        dem: production.dem?.defaultValue || "",
                        image_format: production.image_format?.defaultValue || "",
                        pixel_coding: production.pixel_coding?.defaultValue || "",
                        radiometric_processing: production.radiometric_processing?.defaultValue || "",
                        licence: production.licence?.defaultValue || "",
                    },
                    step2: {
                        ...prevInputs.step2,
                        customerReference: customerReference.getId() || "",
                        application: delivery.application?.defaultValue || "",
                        program: delivery.program?.defaultValue || "",
                        deliveryType: delivery.deliveryType?.defaultValue || "",
                        email: delivery.email?.defaultValue || "",
                    },
                }));
            }
        } catch (err) {
            console.error("Error fetching subscription data:", err);
        } finally {
            setLoading(false);
        }
    };

    const StepsComponents = {
        [Page.Step1]: Production,
        [Page.Step2]: Delivery,
        [Page.Step3]: Step3,
    };

    const StepComponent = StepsComponents[currentStep];
    const submitButtonText = FINAL_STEP === currentStep ? "Order" : "Continue";


    function handleInputChange({ stepKey, value, inputKey }) {
        const oldInputs = structuredClone(inputs);
        oldInputs[stepKey][inputKey] = value;

        setInputs(oldInputs);

        // Clear error for the specific field when a valid value is entered
        setError((prevErrors) => {
            const newErrors = { ...prevErrors };

            if (newErrors[inputKey] && value) {
                delete newErrors[inputKey];
            }

            return newErrors;
        });
    }

    function handleNext() {
        const isValid = validateFields(`step${currentStep}`);
        if (isValid) {
            if (currentStep < FINAL_STEP) {
                setCurrentStep(currentStep + 1);
            } else {


                ModalManager.confirm({
                    modalHeaderHeading: 'Confirmation',
                    message: 'Your order is in progress! We\'ll notify you as soon as it\'s complete.',

                    confirmButtonText: 'OK'
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        toggleOffCanvas(null)

                        const headers = {
                            Authorization: `Bearer ${access}`,
                            'Content-Type': 'application/json',
                        };

                        await axios.post(taskingUrl(mission, userName), taskingJson(componentValues,
                            customerReference,
                            mission,
                            inputs,
                            formState),
                            { headers }).then((res) => {

                                if (res.status === 201) {
                                    ModalManager.success({
                                        modalHeaderHeading: 'Notification',
                                        message: 'Order Placed SuccessFully!',
                                        confirmButtonText: 'OK',
                                    });
                                    setIsTaskComplete(true)

                                }

                            }).catch((err) => {
                                console.log(err)
                                setLoading1(false)


                            })

                    } else {
                        // User canceled the form submission
                        console.log('Form submission canceled.');
                    }
                })
                    .catch((error) => {
                        console.error('An error occurred while handling the confirmation:', error);
                    });


                // orderTasking()
            }
        }
    }

    function handleBack() {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }
    const validateFields = (stepKey) => {
        const stepInputs = inputs[stepKey];
        let newError = {};

        if (stepKey === "step2") {
            if (!stepInputs.deliveryType) newError.deliveryType = "Delivery Type is required";
            if (!stepInputs.application) newError.application = "Application is required";
            if (!stepInputs.customerReference) newError.customerReference = "Customer Reference is required";
            if (!stepInputs.email) newError.email = "Email is required";
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };


    const inputToSend = inputs[`step${currentStep}`];

    function optionResult(sampleValues) {
        return sampleValues.map((el) => (
            <option key={el} value={el}>
                {el}
            </option>
        ));
    }

    const getSampleValues = (fieldName) => {
        const formValues = currentStep === Page.Step1 ? productionFormValues : deliveryFormValues;
        const formField = formValues?.find((form) => form.name === fieldName);
        return formField ? formField.sampleValues : [];
    };


    // const orderTasking = async () => {
    //     // Define the headers
    //     const headers = {
    //         Authorization: `Bearer ${access}`,
    //         'Content-Type': 'application/json',
    //     };

    //     await axios.post(taskingUrl(mission, userName), taskingJson(componentValues,
    //         customerReference,
    //         mission,
    //         inputs,
    //         formState),
    //         { headers }).then((res) => {

    //             if (res.status === 201) {
    //                 ModalManager.success({
    //                     modalHeaderHeading: 'Login Successful',
    //                     message: 'Welcome back!',
    //                     confirmButtonText: 'OK',
    //                 });
    //                 setIsTaskComplete(true)

    //             }

    //         }).catch((err) => {
    //             console.log(err)
    //             setLoading1(false)


    //         })
    // }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);

    };
    const handleCancel = () => {
        setIsModalOpen(false);

    };


    return (
        <div className={`grid ${currentStep == 3 ? "grid-cols-[100%_auto]" : "grid-cols-[60%_auto]"} `}>
            {/* Left Column: Steps and Form */}
            <div className="space-y-6 px-6 py-4">
                {/* Stepper */}
                <div className="">
                    <Steps size="small" current={currentStep - 1}>
                        <Steps.Step title="Production" />
                        <Steps.Step title="Delivery" />
                        <Steps.Step title="Confirmation" />
                    </Steps>
                </div>

                {/* Step Component */}

                {
                    currentStep == 3 && (
                        <Step3

                            loading1={loading1}
                            inputs={inputs}
                            isTaskComplete={isTaskComplete}
                            checkBox1={checkBox1}
                            setCheckBox1={setCheckBox1}
                            showModal={showModal}
                            checkBox2={checkBox2}
                            setCheckBox2={setCheckBox2}
                            isModalOpen={isModalOpen}
                            handleOk={handleOk}
                            handleCancel={handleCancel}
                            componentValues={componentValues}
                            mission={mission}
                            customerReference={customerReference}
                        />

                    )
                }


                {
                    currentStep !== 3 && (
                        <StepComponent
                            stepKey={`step${currentStep}`}
                            onChange={handleInputChange}
                            inputs={inputToSend}
                            optionResult={optionResult}
                            getSampleValues={getSampleValues}
                            error={error}
                        />

                    )


                }

                {/* Buttons */}


                {
                    !isTaskComplete && (
                        <div className="flex space-x-4">
                            {currentStep > Page.Step1 && (
                                <button onClick={handleBack} className="">
                                    Back
                                </button>
                            )}
                            <button type="button" onClick={onBack} className="bg-gray-300 px-3 rounded py-1">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-500 px-3 text-white  rounded py-1"
                                disabled={currentStep === 3 ? checkBox1 === false || checkBox2 === false : Object.keys(error || {}).length > 0}
                            >
                                {submitButtonText}
                            </button>
                        </div>
                    )
                }

            </div>


            {
                currentStep !== 3 && (

                    <PriceComponent
                        customerReference={customerReference}
                        componentValues={componentValues}
                        onSubmitValues={inputs}
                        currentStep={currentStep}
                        formState={formState}

                    />

                )
            }


        </div>

    );
}

export default MultiStepForm;
