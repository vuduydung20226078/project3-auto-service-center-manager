import React from 'react';
import styled from 'styled-components';

// Tạo styled component trực tiếp trong JSX
const HeaderWrapper = styled.header`
  background-color: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const NavLinks = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    display: flex;
  }
  li {
    margin: 0 15px;
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 18px;
  }
  a:hover {
    color: #ddd;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Logo>My Website</Logo>
      <NavLinks>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </NavLinks>
    </HeaderWrapper>
  );
};

export default Header;
    