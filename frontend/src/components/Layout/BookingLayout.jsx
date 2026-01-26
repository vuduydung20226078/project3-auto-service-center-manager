import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ContentCard = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }
`;

const Footer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: auto;
  padding-top: 40px;
`;

const FooterContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  color: white;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FooterSection = styled.div`
  h4 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: white;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 8px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: white;
      }
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const BookingLayout = ({ 
  title = "Book Your Service Appointment",
  subtitle = "Schedule your vehicle service in just a few simple steps",
  children,
  showFooter = true
}) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>

      <ContentCard>
        {children}
      </ContentCard>

      {showFooter && (
        <Footer>
          <FooterContent>
            <FooterGrid>
              <FooterSection>
                <h4>Quick Links</h4>
                <ul>
                  <li>Our Services</li>
                  <li>Pricing</li>
                  <li>About Us</li>
                  <li>Testimonials</li>
                </ul>
              </FooterSection>
              <FooterSection>
                <h4>Customer Account</h4>
                <ul>
                  <li>Login to Your Account</li>
                  <li>Create New Account</li>
                  <li>My Bookings</li>
                  <li>Service History</li>
                </ul>
              </FooterSection>
              <FooterSection>
                <h4>Contact Us</h4>
                <ul>
                  <li>📍 123 Main Street, Anytown, ST 12345</li>
                  <li>📞 (555) 123-4567</li>
                  <li>✉️ info@autocarepro.com</li>
                  <li>🕐 Mon-Fri: 8:00 AM - 6:00 PM</li>
                </ul>
              </FooterSection>
            </FooterGrid>
            <Copyright>
              © {new Date().getFullYear()} AutoCare Pro. All rights reserved.
            </Copyright>
          </FooterContent>
        </Footer>
      )}
    </LayoutContainer>
  );
};

export default BookingLayout;
