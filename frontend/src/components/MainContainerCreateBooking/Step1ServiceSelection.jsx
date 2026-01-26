import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWrench, FaCog } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import ServiceCard from '../common/ServiceCard';
import ServiceSelectionSummary from '../common/ServiceSelectionSummary';
import PromoCard from '../common/PromoCard';
import useServiceSelection from '../../hooks/useServiceSelection';
import { servicesApi } from '../../api/catalogApi';
import toast from '../../utils/toast';

const Container = styled.div`
  width: 100%;
`;

const PromoSection = styled.div`
  margin-bottom: 30px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;

  svg {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  h3 {
    margin: 0 0 8px 0;
    color: #666;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #c5192d;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fee;
`;

const Step1ServiceSelection = () => {
  const {
    selectedServices,
    totalPrice,
    selectedCount,
    isServiceSelected,
    toggleService
  } = useServiceSelection();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicesApi.getAll();
      
      // Transform data to match component format
      const formattedServices = data.map(service => ({
        id: service.id,
        name: service.name || 'Service',
        description: service.description || 'Complete service with inspection',
        price: parseFloat(service.price) || 0,
        duration: service.duration_minutes || 60, // default 60 minutes
        icon: getServiceIcon(service.name),
        iconBgColor: getServiceColor(service.name)
      }));

      setServices(formattedServices);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceName) => {
    if (!serviceName) return '🔧';
    const name = serviceName.toLowerCase();
    if (name.includes('oil')) return '🛢️';
    if (name.includes('brake')) return '🛑';
    if (name.includes('tire') || name.includes('rotation')) return '🚗';
    if (name.includes('engine') || name.includes('diagnostic')) return '🔧';
    if (name.includes('inspection')) return '✓';
    if (name.includes('air') || name.includes('a/c') || name.includes('ac')) return '❄️';
    return '🔧';
  };

  const getServiceColor = (serviceName) => {
    if (!serviceName) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const name = serviceName.toLowerCase();
    if (name.includes('oil')) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    if (name.includes('brake')) return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    if (name.includes('tire')) return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    if (name.includes('engine')) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (name.includes('inspection')) return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    if (name.includes('air') || name.includes('a/c')) return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const handleServiceClick = (service) => {
    toggleService(service);
  };

  const handleClosePromo = () => {
    setShowPromo(false);
  };

  const handleRegister = () => {
    // Navigate to register page
    window.location.href = '/';
  };

  const handleLearnMore = () => {
    // Navigate to features page or show modal
    toast.info('Learn more about member benefits!');
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading services...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <p>{error}</p>
          <button onClick={loadServices} style={{ marginTop: '16px' }}>
            Try Again
          </button>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader
        icon={<FaWrench />}
        title="Select Services"
        subtitle="Choose the services you need for your vehicle"
      />

      {showPromo && (
        <PromoSection>
          <PromoCard
            onClose={handleClosePromo}
            onRegister={handleRegister}
            onLearnMore={handleLearnMore}
          />
        </PromoSection>
      )}

      {services.length === 0 ? (
        <EmptyState>
          <FaCog />
          <h3>No Services Available</h3>
          <p>Please check back later or contact support.</p>
        </EmptyState>
      ) : (
        <>
          <ServicesGrid>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={isServiceSelected(service.id)}
                onSelect={handleServiceClick}
              />
            ))}
          </ServicesGrid>

          <ServiceSelectionSummary
            selectedCount={selectedCount}
            totalPrice={totalPrice}
          />
        </>
      )}
    </Container>
  );
};

export default Step1ServiceSelection;
