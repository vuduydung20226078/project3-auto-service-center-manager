import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaGift, FaBell, FaCalendar } from 'react-icons/fa';
import Button from './Button';

const PromoContainer = styled.div`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const GiftIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const BenefitIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const BenefitDescription = styled.div`
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PromoButton = styled(Button)`
  flex: 1;
  &:hover {
    background: rgba(36, 84, 188, 0.25);
    transform: translateY(-2px);
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PromoCard = ({ 
  onClose,
  onRegister,
  onLearnMore
}) => {
  const benefits = [
    {
      icon: <FaBell />,
      title: 'Nhắc nhở bảo dưỡng định kỳ',
      description: 'Nhận thông báo tự động khi đến hạn bảo dưỡng xe'
    },
    {
      icon: <FaCalendar />,
      title: 'Lịch sử bảo dưỡng',
      description: 'Theo dõi toàn bộ lịch sử sửa chữa và bảo dưỡng xe'
    },
    {
      icon: <FaCalendar />,
      title: 'Đặt lịch nhanh chóng',
      description: 'Thông tin được lưu sẵn, đặt lịch trong 30 giây'
    },
    {
      icon: <FaGift />,
      title: 'Ưu đãi độc quyền',
      description: 'Giảm giá 10% cho thành viên và tích điểm đổi quà'
    }
  ];

  return (
    <PromoContainer>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>

      <Header>
        <GiftIcon>
          <FaGift />
        </GiftIcon>
        <TitleSection>
          <Title>Tạo tài khoản để nhận ưu đãi!</Title>
          <Subtitle>Quản lý xe của bạn dễ dàng hơn</Subtitle>
        </TitleSection>
      </Header>

      <BenefitsGrid>
        {benefits.map((benefit, index) => (
          <BenefitCard key={index}>
            <BenefitIcon>{benefit.icon}</BenefitIcon>
            <BenefitContent>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitContent>
          </BenefitCard>
        ))}
      </BenefitsGrid>

      <ButtonGroup>
        <PromoButton
          variant="outline"
          color="white"
          onClick={onRegister}
        >
          Đăng ký ngay - Miễn phí
        </PromoButton>
        <PromoButton
          variant="outline"
          color="white"
          onClick={onLearnMore}
        >
          Tìm hiểu thêm
        </PromoButton>
      </ButtonGroup>
    </PromoContainer>
  );
};

export default PromoCard;
