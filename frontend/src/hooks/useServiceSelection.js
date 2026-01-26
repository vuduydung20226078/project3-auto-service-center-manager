import { useState, useCallback, useMemo } from 'react';
import { useBooking } from '../contexts/BookingContext';

const useServiceSelection = () => {
    const {
        selectedServices,
        selectService,
        deselectService,
        clearServices,
        totalPrice,
        totalDuration
    } = useBooking();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const isServiceSelected = useCallback((serviceId) => {
        return selectedServices.some(s => s.id === serviceId);
    }, [selectedServices]);

    const toggleService = useCallback((service) => {
        selectService(service);
    }, [selectService]);

    const removeService = useCallback((serviceId) => {
        deselectService(serviceId);
    }, [deselectService]);

    const removeAllServices = useCallback(() => {
        clearServices();
    }, [clearServices]);

    const filterServices = useCallback((services) => {
        let filtered = services;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(service =>
                service.category === categoryFilter
            );
        }

        return filtered;
    }, [searchTerm, categoryFilter]);

    const selectedServiceIds = useMemo(() => {
        return selectedServices.map(s => s.id);
    }, [selectedServices]);

    const selectedCount = selectedServices.length;

    const formatDuration = useCallback((minutes) => {
        if (minutes < 60) {
            return `${minutes} mins`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }, []);

    const formatPrice = useCallback((price) => {
        return `${parseFloat(price || 0).toFixed(0)} VND`;
    }, []);

    return {
        selectedServices,
        selectedServiceIds,
        selectedCount,
        totalPrice,
        totalDuration,
        searchTerm,
        categoryFilter,
        setSearchTerm,
        setCategoryFilter,
        isServiceSelected,
        toggleService,
        removeService,
        removeAllServices,
        filterServices,
        formatDuration,
        formatPrice
    };
};

export default useServiceSelection;
