import { useCallback } from 'react';
import { useBooking } from '../contexts/BookingContext';

const useBookingNavigation = () => {
    const {
        currentStep,
        completedSteps,
        nextStep: contextNextStep,
        prevStep: contextPrevStep,
        goToStep,
        completeStep,
        selectedServices,
        selectedDate,
        selectedTime,
        customerInfo,
        vehicleInfo
    } = useBooking();

    const canProceedToStep2 = useCallback(() => {
        return selectedServices.length > 0;
    }, [selectedServices]);

    const canProceedToStep3 = useCallback(() => {
        return selectedDate && selectedTime;
    }, [selectedDate, selectedTime]);

    const canProceedToStep4 = useCallback(() => {
        const hasCustomerInfo = customerInfo.name &&
            (customerInfo.email || customerInfo.phone); // At least one contact method
        const hasVehicleInfo = vehicleInfo.make &&
            vehicleInfo.model &&
            vehicleInfo.year &&
            vehicleInfo.licensePlate;
        return hasCustomerInfo && hasVehicleInfo;
    }, [customerInfo, vehicleInfo]);

    const canSubmitBooking = useCallback(() => {
        return canProceedToStep2() &&
            canProceedToStep3() &&
            canProceedToStep4();
    }, [canProceedToStep2, canProceedToStep3, canProceedToStep4]);

    const nextStep = useCallback(() => {
        let canProceed = true;

        switch (currentStep) {
            case 1:
                canProceed = canProceedToStep2();
                break;
            case 2:
                canProceed = canProceedToStep3();
                break;
            case 3:
                canProceed = canProceedToStep4();
                break;
            default:
                break;
        }

        if (canProceed) {
            completeStep(currentStep);
            contextNextStep();
            return true;
        }
        return false;
    }, [currentStep, canProceedToStep2, canProceedToStep3, canProceedToStep4, completeStep, contextNextStep]);

    const prevStep = useCallback(() => {
        contextPrevStep();
    }, [contextPrevStep]);

    const jumpToStep = useCallback((step) => {
        if (step <= currentStep || completedSteps.includes(step - 1)) {
            goToStep(step);
            return true;
        }
        return false;
    }, [currentStep, completedSteps, goToStep]);

    const isStepAccessible = useCallback((step) => {
        if (step === 1) return true;
        if (step <= currentStep) return true;
        return completedSteps.includes(step - 1);
    }, [currentStep, completedSteps]);

    const getStepStatus = useCallback((step) => {
        if (completedSteps.includes(step)) return 'completed';
        if (currentStep === step) return 'active';
        if (isStepAccessible(step)) return 'accessible';
        return 'locked';
    }, [currentStep, completedSteps, isStepAccessible]);

    return {
        currentStep,
        completedSteps,
        nextStep,
        prevStep,
        jumpToStep,
        isStepAccessible,
        getStepStatus,
        canProceedToStep2,
        canProceedToStep3,
        canProceedToStep4,
        canSubmitBooking
    };
};

export default useBookingNavigation;
