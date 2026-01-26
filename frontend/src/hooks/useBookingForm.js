import { useState, useCallback } from 'react';

const useBookingForm = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const handleBlur = useCallback((name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    }, []);

    const setFieldValue = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const setFieldError = useCallback((name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, []);

    const validateField = useCallback((name, value, rules = {}) => {
        let error = '';

        if (rules.required && (!value || value.toString().trim() === '')) {
            error = rules.requiredMessage || `${name} is required`;
        } else if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Invalid email address';
            }
        } else if (rules.phone && value) {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                error = 'Invalid phone number';
            }
        } else if (rules.minLength && value && value.length < rules.minLength) {
            error = `Must be at least ${rules.minLength} characters`;
        } else if (rules.maxLength && value && value.length > rules.maxLength) {
            error = `Must be no more than ${rules.maxLength} characters`;
        } else if (rules.pattern && value && !rules.pattern.test(value)) {
            error = rules.patternMessage || 'Invalid format';
        } else if (rules.custom && value) {
            error = rules.custom(value);
        }

        if (error) {
            setFieldError(name, error);
            return false;
        }
        return true;
    }, [setFieldError]);

    const validateForm = useCallback((validationRules) => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const fieldValue = values[fieldName];
            const rules = validationRules[fieldName];

            if (rules.required && (!fieldValue || fieldValue.toString().trim() === '')) {
                newErrors[fieldName] = rules.requiredMessage || `${fieldName} is required`;
                isValid = false;
            } else if (rules.email && fieldValue) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    newErrors[fieldName] = 'Invalid email address';
                    isValid = false;
                }
            } else if (rules.phone && fieldValue) {
                const phoneRegex = /^[0-9]{10,15}$/;
                if (!phoneRegex.test(fieldValue.replace(/\D/g, ''))) {
                    newErrors[fieldName] = 'Invalid phone number';
                    isValid = false;
                }
            } else if (rules.minLength && fieldValue && fieldValue.length < rules.minLength) {
                newErrors[fieldName] = `Must be at least ${rules.minLength} characters`;
                isValid = false;
            } else if (rules.custom && fieldValue) {
                const customError = rules.custom(fieldValue);
                if (customError) {
                    newErrors[fieldName] = customError;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [values]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldError,
        validateField,
        validateForm,
        resetForm,
        setValues
    };
};

export default useBookingForm;
