// validationUtils.js

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
        return errorMessage;
    }

    // Check for minimum length
    if (rules.minLength && value.length < rules.minLength) {
        errorMessage = `Min ${rules.minLength} characters required`;
        return errorMessage;
    }

    // Check for pattern match
    if (rules.pattern && !rules.pattern.test(value)) {
        errorMessage = rules.patternMessage || 'Invalid format'; // Use custom message or default to 'Invalid format'
        return errorMessage;
    }

    return errorMessage;
};

export default validateInput;