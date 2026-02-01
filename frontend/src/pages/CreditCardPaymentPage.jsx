import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaLock, FaCreditCard } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { useNavigate, useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
  margin-top: 20px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-bottom: 32px;
`;

const AmountSection = styled.div`
  background: #f8f9fa;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const AmountLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const AmountValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const AmountNote = styled.div`
  font-size: 12px;
  color: #999;
`;

const Form = styled.form`
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const CardIcons = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  font-size: 28px;
`;

const VisaIcon = styled(SiVisa)`
  color: #1434cb;
`;

const MastercardIcon = styled(SiMastercard)`
  color: #eb001b;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SecurityBadge = styled.div`
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #065f46;
  font-weight: 600;

  svg {
    color: #10b981;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CancelButton = styled(Button)`
  background: white;
  border: 2px solid #e9ecef;
  color: #666;

  &:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
  }
`;

const PayButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecurityNote = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
`;

const CreditCardPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoice, workOrderDetails } = location.state || {};

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(amount || 0));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    } else if (name === 'cardholderName') {
      formattedValue = value.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate card number
    const cardNumberOnly = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberOnly) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberOnly.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Invalid expiry date format';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // Validate CVV
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page or back to dashboard
      navigate('/admin', {
        state: {
          message: 'Payment processed successfully!',
          type: 'success'
        }
      });
    }, 2000);
  };

  return (
    <PageContainer>
      <PaymentCard>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to invoice
        </BackButton>

        <Title>Pay with Credit Card</Title>
        <Subtitle>Invoice: {invoice?.invoice_no || 'INV-240127-0489'}</Subtitle>

        <AmountSection>
          <AmountLabel>Invoice Amount</AmountLabel>
          <AmountValue>{formatCurrency(invoice?.amount_due || 0)} VND</AmountValue>
          <AmountNote>* Card payments may include additional fees</AmountNote>
        </AmountSection>

        {Object.keys(errors).length > 0 && (
          <ErrorMessage>
            Please correct the errors in the form
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Card Number</Label>
            <InputWrapper>
              <Input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
              />
              <CardIcons>
                <VisaIcon />
                <MastercardIcon />
              </CardIcons>
            </InputWrapper>
            {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Expiry Date</Label>
              <Input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
              {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>CVV</Label>
              <Input
                type="text"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
              />
              {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Cardholder Name</Label>
            <Input
              type="text"
              name="cardholderName"
              placeholder="NGUYEN VAN A"
              value={formData.cardholderName}
              onChange={handleInputChange}
            />
            {errors.cardholderName && <ErrorMessage>{errors.cardholderName}</ErrorMessage>}
          </FormGroup>

          <SecurityBadge>
            <FaLock /> Powered by Secure Payment Gateway
          </SecurityBadge>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
            <PayButton type="submit" disabled={isProcessing}>
              <FaCreditCard /> {isProcessing ? 'Processing...' : 'Pay Now'}
            </PayButton>
          </ButtonGroup>
        </Form>

        <SecurityNote>
          🔒 Your card information is never stored
        </SecurityNote>
      </PaymentCard>
    </PageContainer>
  );
};

export default CreditCardPaymentPage;
