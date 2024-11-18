import React, { useState, useEffect } from 'react';
import './CentralizedInput.css';


const validateInput = (value, rules, isFocused) => {
    let errorMessage = '';

    if (!rules) return errorMessage;

    // Skip validation if the field is not required and the value is empty
    if (!rules.required && !value) {
        return errorMessage;
    }

    // Check for required field
    if (rules.required && !value) {
        errorMessage = 'Field is required';
        // You can return or handle the error here if needed
        return errorMessage;
    }

    // Check for minimum length
    if (rules.minLength && value.length < rules.minLength) {
        errorMessage = `Min ${rules.minLength} characters required`;
        // You can return or handle the error here if needed
        return errorMessage;
    }

    // Check for pattern match
    if (rules.pattern && !rules.pattern.test(value)) {
        errorMessage = rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
        // You can return or handle the error here if needed
        return errorMessage;
    }

    return errorMessage;
};


const CentralizedInput = ({
    name,
    type,
    value,
    onChange,
    label,
    options,
    required = false,
    prefix,
    placeholder,
    validationRules,
    onValidationError,
    isSubmitted
}) => {
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isBlur, setIsBlur] = useState(false);
    const [maxLengthWarning, setMaxLengthWarning] = useState('');

    // Predefined regex patterns
    const letterRegex = /^[A-Za-z]*$/;
    const emailRegex = /^[a-z0-9.@]*$/;
    const usernameRegex = /^[a-zA-Z0-9@%&*_\-]*$/;

    // Validate input on change
    const handleChange = (e) => {
        const { name, value } = e.target;
        const rules = validationRules ? validationRules[name] : null;

        let formattedValue = value;

        // Apply formatting based on the input name
        if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
            // Allow only letters
            if (!letterRegex.test(value)) return;
            formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        } else if (name === 'organization' || name === 'designation' || name === 'department') {
            // Trim leading spaces and capitalize first letter
            formattedValue = value.trimStart();
            formattedValue = formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1).toLowerCase();
        } else if (name === 'emailId') {
            // Lowercase and validate email
            const lowercasedValue = value.toLowerCase();
            if (!emailRegex.test(lowercasedValue)) return;
            const domain = lowercasedValue.split('@')[1];
            if (domain) {
                const domainParts = domain.split('.');
                if (domainParts.length > 1) {
                    const tld = domainParts[domainParts.length - 1];
                    if (tld.length > 15) return; // Invalid email format
                }
            }
            formattedValue = lowercasedValue;
        } else if (name === 'username') {
            // Validate username
            if (!usernameRegex.test(value)) return;
        } else if (name === 'mobileNo') {
            // Validate mobile number (e.g., no leading zero and digits only)
            if (value.charAt(0) === '0' || !/^\d*$/.test(value)) return;
        } else if (name === 'phoneLan') {
            // Allow only digits, spaces, dashes, and parentheses
            const cleanedValue = value.replace(/[^0-9\s()-]/g, '');
            formattedValue = cleanedValue;
        }

        // Handle maxLength
        if (rules?.maxLength) {
            formattedValue = formattedValue.slice(0, rules.maxLength);
            if (formattedValue.length >= rules.maxLength) {
                setMaxLengthWarning(`Max ${rules.maxLength} characters.`);
                // Clear warning after 3 seconds
                setTimeout(() => {
                    setMaxLengthWarning('');
                }, 3000);
            } else {
                setMaxLengthWarning('');
            }
        }

        // Apply the formatted value
        onChange({ target: { name, value: formattedValue } });

        // Validate input while typing
        const validationError = validateInput(formattedValue, rules, isFocused);
        setError(validationError);
    };


    // console.log("validationRules ", validationRules)


    // Validate input when value or validationRules change
    // useEffect(() => {
    //     if (isBlur) {
    //         const rules = validationRules ? validationRules[name] : null;
    //         const validationError = validateInput(value, rules, isFocused);
    //         setError(validationError);
    //         onValidationError(name, validationError); // Notify parent about validation error
    //     }
    // }, [value, validationRules, isBlur, isFocused, name, onValidationError]);


    // useEffect(() => {
    //     // Validate on blur and on submission
    //     if (isBlur || isSubmitted) {
    //         const rules = validationRules ? validationRules[name] : null;
    //         const validationError = validateInput(value, rules, isFocused);
    //         setError(validationError);
    //         onValidationError(name, validationError);
    //     }
    // }, [value, validationRules, isBlur, isFocused, name, isSubmitted, onValidationError]);

    useEffect(() => {
        if (isBlur || isSubmitted) {
            const rules = validationRules ? validationRules[name] : null;
            const validationError = validateInput(value, rules, isFocused);

            // Only update the state if the error has changed
            if (validationError !== error) {
                setError(validationError);
                onValidationError(name, validationError);
            }
        }
    }, [isBlur, isSubmitted]); // Reduce the dependency array to avoid unnecessary renders


    const handleFocus = () => {
        setIsFocused(true);
        const rules = validationRules ? validationRules[name] : null;
        if (rules?.maxLength && value.length >= rules.maxLength) {
            setMaxLengthWarning(`Max ${rules.maxLength} characters.`);
            const timer = setTimeout(() => {
                setMaxLengthWarning('');
            }, 3000); // Clear warning after 3 seconds

            return () => clearTimeout(timer);
        }
    };

    const handleBlur = () => {
        setIsBlur(true);
        setIsFocused(false); // Ensure isFocused is false on blur
    };

    const inputClassName = `form-control ${type === 'tel' ? 'form-control-tel' : ''} ${error ? 'invalid' : ''}`;
    const selectClassName = `form-select ${error ? 'invalid' : ''}`;

    return (
        <div className="form-group mb-1">
            <label htmlFor={name} className='InputLabel'>
                <span className="text-danger">{required && '*'}</span>{label}
            </label>
            {error && <span className="text-danger errorMessage">{error}</span>}
            {maxLengthWarning && <span className="text-warning">{maxLengthWarning}</span>}
            {type === 'select' ? (
                <select
                    name={name}
                    className={`my-select ${selectClassName}`}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={required}
                >
                    <option value="" disabled>Select an option...</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <div className={type === 'tel' ? 'input-group' : ''}>
                    {prefix && <span className="input-group-text">{prefix}</span>}
                    <input
                        type={type}
                        className={inputClassName}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required={required}
                        placeholder={placeholder}
                    />
                </div>
            )}
        </div>
    );
};

export default CentralizedInput;




















// import React, { useState, useEffect } from 'react';
// import './CentralizedInput.css';

// // Function to validate input based on rules
// // const validateInput = (value, rules, isFocused) => {
// //     if (!rules) return '';

// //     if (rules.required && !value) {
// //         return 'Field is required';
// //     }

// //     if (rules.minLength && value.length < rules.minLength) {
// //         return `Min ${rules.minLength} characters required`;
// //     }

// //     if (rules.pattern && !rules.pattern.test(value)) {
// //         return rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
// //     }

// //     return '';
// // };
// const validateInput = (value, rules, isFocused) => {
//     let errorMessage = '';

//     if (!rules) return errorMessage;

//     // Skip validation if the field is not required and the value is empty
//     if (!rules.required && !value) {
//         return errorMessage;
//     }

//     // Check for required field
//     if (rules.required && !value) {
//         errorMessage = 'Field is required';
//         // You can return or handle the error here if needed
//         return errorMessage;
//     }

//     // Check for minimum length
//     if (rules.minLength && value.length < rules.minLength) {
//         errorMessage = `Min ${rules.minLength} characters required`;
//         // You can return or handle the error here if needed
//         return errorMessage;
//     }

//     // Check for pattern match
//     if (rules.pattern && !rules.pattern.test(value)) {
//         errorMessage = rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
//         // You can return or handle the error here if needed
//         return errorMessage;
//     }

//     return errorMessage;
// };


// const CentralizedInput = ({
//     name,
//     type,
//     value,
//     onChange,
//     label,
//     options,
//     required = false,
//     prefix,
//     placeholder,
//     validationRules,
//     onValidationError
// }) => {
//     const [error, setError] = useState('');
//     const [isFocused, setIsFocused] = useState(false);
//     const [isBlur, setIsBlur] = useState(false);
//     const [maxLengthWarning, setMaxLengthWarning] = useState('');

//     // Predefined regex patterns
//     const letterRegex = /^[A-Za-z]*$/;
//     const emailRegex = /^[a-z0-9.@]*$/;
//     const usernameRegex = /^[a-zA-Z0-9@%&*_\-]*$/;

//     // Validate input on change
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const rules = validationRules ? validationRules[name] : null;
//         console.log("rules ", rules)

//         let formattedValue = value;

//         // Apply formatting based on the input name
//         if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
//             if (!letterRegex.test(value)) return;
//             formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
//         } else if (name === 'organization' || name === 'designation' || name === 'department') {
//             formattedValue = value.trimStart(); // Remove leading spaces
//             formattedValue = formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1).toLowerCase();
//         } else if (name === 'emailId') {
//             const lowercasedValue = value.toLowerCase();
//             if (!emailRegex.test(lowercasedValue)) return;
//             const domain = lowercasedValue.split('@')[1];
//             if (domain) {
//                 const domainParts = domain.split('.');
//                 if (domainParts.length > 1) {
//                     const tld = domainParts[domainParts.length - 1];
//                     if (tld.length > 15) return; // Invalid email format
//                 }
//             }
//             formattedValue = lowercasedValue;
//         } else if (name === 'username') {
//             if (!usernameRegex.test(value)) return;
//         } else if (name === 'mobileNo') {
//             if (value.charAt(0) === '0' || !/^\d*$/.test(value)) return;
//         }

//         // Apply the formatted value
//         onChange({ target: { name, value: formattedValue } });

//         // Validate input while typing
//         const validationError = validateInput(formattedValue, rules, isFocused);
//         setError(validationError);
//     };
//     console.log("validationRules ", validationRules)


//     // Validate input when value or validationRules change
//     useEffect(() => {
//         if (isBlur) {
//             const rules = validationRules ? validationRules[name] : null;
//             const validationError = validateInput(value, rules, isFocused);
//             setError(validationError);
//             onValidationError(name, validationError); // Notify parent about validation error
//         }
//     }, [value, validationRules, isBlur, isFocused, name, onValidationError]);

//     // Handle maxLength warning
//     useEffect(() => {
//         const rules = validationRules ? validationRules[name] : null;
//         if (rules?.maxLength && value.length >= rules.maxLength) {
//             setMaxLengthWarning(`Max ${rules.maxLength} characters.`);
//             const timer = setTimeout(() => {
//                 setMaxLengthWarning('');
//             }, 3000); // Clear warning after 3 seconds

//             return () => clearTimeout(timer);
//         } else {
//             setMaxLengthWarning('');
//         }
//     }, [value, validationRules, name]);

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsBlur(true);
//         setIsFocused(false); // Ensure isFocused is false on blur
//     };

//     const inputClassName = `form-control ${type === 'tel' ? 'form-control-tel' : ''} ${error ? 'invalid' : ''}`;
//     const selectClassName = `form-select ${error ? 'invalid' : ''}`;

//     return (
//         <div className="form-group mb-1">
//             <label htmlFor={name} className='InputLabel'>
//                 <span className="text-danger">{required && '*'}</span>{label}
//             </label>
//             {error && <span className="text-danger errorMessage">{error}</span>}
//             {maxLengthWarning && <span className="text-warning">{maxLengthWarning}</span>}
//             {type === 'select' ? (
//                 <select
//                     name={name}
//                     className={`my-select ${selectClassName}`}
//                     value={value}
//                     onChange={handleChange}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     required={required}
//                 >
//                     <option value="" disabled>Select an option...</option>
//                     {options.map((option, index) => (
//                         <option key={index} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//             ) : (
//                 <div className={type === 'tel' ? 'input-group' : ''}>
//                     {prefix && <span className="input-group-text">{prefix}</span>}
//                     <input
//                         type={type}
//                         className={inputClassName}
//                         name={name}
//                         value={value}
//                         onChange={handleChange}
//                         onFocus={handleFocus}
//                         onBlur={handleBlur}
//                         required={required}
//                         placeholder={placeholder}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CentralizedInput;












// import React, { useState, useEffect } from 'react';
// import './CentralizedInput.css';


// // Function to validate input based on rules
// const validateInput = (value, rules, isFocused) => {
//     if (!rules) return '';

//     if (rules.required && !value) {
//         return 'Field is required';
//     }

//     // if (rules.maxLength && value.length > rules.maxLength) {
//     //     return `Max ${rules.maxLength} characters allowed`;
//     // }

//     if (rules.minLength && value.length < rules.minLength) {
//         return `Min ${rules.minLength} characters required`;
//     }

//     if (rules.pattern && !rules.pattern.test(value)) {
//         return rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
//     }

//     return '';
// };

// const CentralizedInput = ({
//     name,
//     type,
//     value,
//     onChange,
//     label,
//     options,
//     required = false,
//     prefix,
//     placeholder,
//     validationRules,
//     onValidationError
// }) => {
//     const [error, setError] = useState('');
//     const [isFocused, setIsFocused] = useState(false);
//     const [isBlur, setIsBlur] = useState(false);
//     const [maxLengthWarning, setMaxLengthWarning] = useState('');

//     // Validate input on change
//     const handleChange = (e) => {
//         const newValue = e.target.value;
//         const rules = validationRules ? validationRules[name] : null;

//         // Handle maxLength
//         if (rules?.maxLength && newValue.length > rules.maxLength) {
//             onChange({ target: { name, value: newValue.slice(0, rules.maxLength) } });
//         } else {
//             onChange(e);
//         }

//         // Validate input while typing
//         const validationError = validateInput(newValue, rules, isFocused);
//         setError(validationError);
//     };

//     // useEffect(() => {
//     //     if (isBlur) {
//     //         const rules = validationRules ? validationRules[name] : null;
//     //         setError(validateInput(value, rules, isFocused));
//     //     }
//     // }, [name, value, validationRules, isBlur, isFocused]);
//     // Validate input when value or validationRules change
//     useEffect(() => {
//         if (isBlur) {
//             const rules = validationRules ? validationRules[name] : null;
//             const validationError = validateInput(value, rules, isFocused);
//             setError(validationError);
//             onValidationError(name, validationError); // Notify parent about validation error
//         }
//     }, [value, validationRules, isBlur, isFocused, name, onValidationError]);

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsBlur(true);
//         setIsFocused(false); // Ensure isFocused is false on blur
//     };

//     useEffect(() => {
//         const rules = validationRules ? validationRules[name] : null;
//         if (rules?.maxLength) {
//             if (value.length >= rules.maxLength) {
//                 setMaxLengthWarning(`Max ${rules.maxLength} characters.`);
//                 const timer = setTimeout(() => {
//                     setMaxLengthWarning('');
//                 }, 3000); // Clear warning after 3 seconds

//                 return () => clearTimeout(timer);
//             } else {
//                 setMaxLengthWarning('');
//             }
//         }
//     }, [value, isFocused, validationRules, name]);

//     const inputClassName = `form-control ${type === 'tel' ? 'form-control-tel' : ''} ${error ? 'invalid' : ''}`;
//     const selectClassName = `form-select ${error ? 'invalid' : ''}`;

//     return (
//         <div className="form-group mb-1">
//             <label htmlFor={name} className='InputLabel'>
//                 <span className="text-danger">{required && '*'}</span>{label}
//             </label>
//             {error && <span className="text-danger errorMessage">{error}</span>}
//             {maxLengthWarning && <span className="text-warning">{maxLengthWarning}</span>}
//             {type === 'select' ? (
//                 <select
//                     name={name}
//                     className={`my-select ${selectClassName}`}
//                     value={value}
//                     onChange={handleChange}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     required={required}
//                 >
//                     <option value="" disabled>Select an option...</option>
//                     {options.map((option, index) => (
//                         <option key={index} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//             ) : (
//                 <div className={type === 'tel' ? 'input-group' : ''}>
//                     {prefix && <span className="input-group-text">{prefix}</span>}
//                     <input
//                         type={type}
//                         className={inputClassName}
//                         name={name}
//                         value={value}
//                         onChange={handleChange}
//                         onFocus={handleFocus}
//                         onBlur={handleBlur}
//                         required={required}
//                         placeholder={placeholder}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CentralizedInput;













// import React, { useState, useEffect } from 'react';
// import './CentralizedInput.css';

// // Function to validate input based on rules
// const validateInput = (value, rules, isFocused) => {
//     if (!rules) return '';

//     if (rules.required && !value) {
//         return 'Field is required';
//     }

//     // if (rules.maxLength && value.length > rules.maxLength) {
//     //     return `Max ${rules.maxLength} characters allowed`;
//     // }

//     if (rules.minLength && value.length < rules.minLength) {
//         return `Min ${rules.minLength} characters required`;
//     }

//     if (rules.pattern && !rules.pattern.test(value)) {
//         return rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
//     }

//     return '';
// };

// const CentralizedInput = ({
//     name,
//     type,
//     value,
//     onChange,
//     label,
//     options,
//     required = false,
//     prefix,
//     placeholder,
//     validationRules
// }) => {
//     const [error, setError] = useState('');
//     const [isFocused, setIsFocused] = useState(false);
//     const [isBlur, setIsBlur] = useState(false);
//     const [maxLengthWarning, setMaxLengthWarning] = useState('');

//     // Validate input on change
//     const handleChange = (e) => {
//         const newValue = e.target.value;
//         const rules = validationRules ? validationRules[name] : null;

//         // Handle maxLength
//         if (rules?.maxLength && newValue.length > rules.maxLength) {
//             onChange({ target: { name, value: newValue.slice(0, rules.maxLength) } });
//         } else {
//             onChange(e);
//         }

//         // Validate input while typing
//         const validationError = validateInput(newValue, rules, isFocused);
//         setError(validationError);
//     };

//     useEffect(() => {
//         if (isBlur) {
//             const rules = validationRules ? validationRules[name] : null;
//             setError(validateInput(value, rules, isFocused));
//         }
//     }, [name, value, validationRules, isBlur, isFocused]);

//     const handleFocus = () => {
//         setIsFocused(true);
//     };

//     const handleBlur = () => {
//         setIsBlur(true);
//         setIsFocused(false); // Ensure isFocused is false on blur
//     };

//     useEffect(() => {
//         const rules = validationRules ? validationRules[name] : null;
//         if (rules?.maxLength) {
//             if (value.length >= rules.maxLength) {
//                 setMaxLengthWarning(`Max ${rules.maxLength} characters.`);
//                 const timer = setTimeout(() => {
//                     setMaxLengthWarning('');
//                 }, 3000); // Clear warning after 3 seconds

//                 return () => clearTimeout(timer);
//             } else {
//                 setMaxLengthWarning('');
//             }
//         }
//     }, [value, isFocused, validationRules, name]);

//     const inputClassName = `form-control ${type === 'tel' ? 'form-control-tel' : ''} ${error ? 'invalid' : ''}`;
//     const selectClassName = `form-select ${error ? 'invalid' : ''}`;

//     return (
//         <div className="form-group mb-1">
//             <label htmlFor={name} className='InputLabel'>
//                 <span className="text-danger">{required && '*'}</span>{label}
//             </label>
//             {error && <span className="text-danger errorMessage">{error}</span>}
//             {maxLengthWarning && <span className="text-warning">{maxLengthWarning}</span>}
//             {type === 'select' ? (
//                 <select
//                     name={name}
//                     className={`my-select ${selectClassName}`}
//                     value={value}
//                     onChange={handleChange}
//                     onFocus={handleFocus}
//                     onBlur={handleBlur}
//                     required={required}
//                 >
//                     <option value="" disabled>Select an option...</option>
//                     {options.map((option, index) => (
//                         <option key={index} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//             ) : (
//                 <div className={type === 'tel' ? 'input-group' : ''}>
//                     {prefix && <span className="input-group-text">{prefix}</span>}
//                     <input
//                         type={type}
//                         className={inputClassName}
//                         name={name}
//                         value={value}
//                         onChange={handleChange}
//                         onFocus={handleFocus}
//                         onBlur={handleBlur}
//                         required={required}
//                         placeholder={placeholder}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CentralizedInput;










