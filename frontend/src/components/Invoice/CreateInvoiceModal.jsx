import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaTrash, FaCheck, FaSave } from 'react-icons/fa';
import { invoicesApi } from '../../api/invoicesApi';
import toast from '../../utils/toast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
`;

const CustomerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  font-size: 14px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #666;
  margin-right: 8px;
`;

const InfoValue = styled.span`
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const Thead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e9ecef;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f8d7da;
  }
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  color: white;
  margin-top: 24px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 2px solid #f3f4f6;
  background-color: #f8f9fa;
  border-radius: 0 0 16px 16px;
  position: sticky;
  bottom: 0;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CancelButton = styled(Button)`
  background-color: #e9ecef;
  color: #666;

  &:hover {
    background-color: #dee2e6;
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
`;

const LoadingState = styled.div`
  padding: 40px;
  text-align: center;
  color: #999;
`;

const CreateInvoiceModal = ({ workOrder, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [workOrderDetails, setWorkOrderDetails] = useState(null);
  const [items, setItems] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');

  useEffect(() => {
    loadWorkOrderDetails();
    generateInvoiceNo();
  }, [workOrder]);

  const generateInvoiceNo = () => {
    const date = new Date();
    const invoiceNumber = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setInvoiceNo(invoiceNumber);
  };

  const loadWorkOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getWorkOrderDetails(workOrder.id);
      setWorkOrderDetails(response);
      setItems(response.WorkOrderItems || []);
    } catch (error) {
      console.error('Error loading work order details:', error);
      toast.error('Failed to load work order details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    const quantity = parseInt(value) || 1;
    newItems[index].quantity = quantity;
    newItems[index].line_total = quantity * parseFloat(newItems[index].unit_price);
    setItems(newItems);
  };

  const handlePriceChange = (index, value) => {
    const newItems = [...items];
    const price = parseFloat(value) || 0;
    newItems[index].unit_price = price;
    newItems[index].line_total = newItems[index].quantity * price;
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0);
  };

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0).toFixed(0)} VND`;
  };

  const handleConfirm = async () => {
    try {
      const totalAmount = calculateTotal();
      
      // Create invoice
      const invoiceData = {
        work_order_id: workOrder.id,
        invoice_no: invoiceNo,
        amount_due: totalAmount
      };

      const invoice = await invoicesApi.create(invoiceData);
      toast.success('Invoice created successfully');
      
      // Navigate to payment page
      onSuccess(invoice, workOrderDetails);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  if (loading) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>
            <Title>Create Invoice</Title>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </Header>
          <LoadingState>Loading work order details...</LoadingState>
        </Modal>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Create Invoice - {invoiceNo}</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          {/* Customer Information */}
          <Section>
            <SectionTitle>Customer Information</SectionTitle>
            <CustomerInfo>
              <InfoItem>
                <InfoLabel>Name:</InfoLabel>
                <InfoValue>{workOrderDetails?.Vehicle?.Customer?.name || '-'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone:</InfoLabel>
                <InfoValue>{workOrderDetails?.Vehicle?.Customer?.phone || '-'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{workOrderDetails?.Vehicle?.Customer?.email || '-'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Vehicle:</InfoLabel>
                <InfoValue>{workOrderDetails?.Vehicle?.license_plate} - {workOrderDetails?.Vehicle?.model}</InfoValue>
              </InfoItem>
            </CustomerInfo>
          </Section>

          {/* Services */}
          <Section>
            <SectionTitle>Services & Parts</SectionTitle>
            <Table>
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Description</Th>
                  <Th style={{ width: '100px' }}>Qty</Th>
                  <Th style={{ width: '150px' }}>Unit Price</Th>
                  <Th style={{ width: '150px' }}>Total</Th>
                  <Th style={{ width: '60px' }}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.item_type}</Td>
                    <Td>{item.details?.name || item.description}</Td>
                    <Td>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                      />
                    </Td>
                    <Td>{formatCurrency(item.line_total)}</Td>
                    <Td>
                      <DeleteButton onClick={() => handleDeleteItem(index)}>
                        <FaTrash />
                      </DeleteButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Section>

          {/* Total */}
          <TotalSection>
            <TotalRow>
              <span>Total Amount:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </TotalRow>
          </TotalSection>
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            <FaCheck /> Confirm & Proceed to Payment
          </ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default CreateInvoiceModal;
