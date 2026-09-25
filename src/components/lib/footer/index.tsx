import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

import prefeituraLogoCinza from '~/assets/prefeitura-sp-logo-cinza.png';

const FooterContainer = styled(Layout.Footer)`
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 49px;
  padding: 0px 32px;

  @media (max-width: 768px) {
    position: relative;
    height: auto;
    padding: 20px 16px 48px;
  }
`;

const FooterContainerItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #bfbfbf;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-top: 16px;
    text-align: center;
  }
`;

const LogoSP = styled.img`
  height: 45px;
  padding: 5px 0px;
  opacity: 0.7;

  @media (max-width: 768px) {
    height: 38px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    padding: 0;
    margin: 0 auto;
    display: block;
  }
`;

const FooterDescription = styled.div`
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 11px;
    line-height: 1.4;
    color: #42474a;
    text-align: center;
    max-width: 260px;
    margin: 0 auto;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContainerItems>
        <LogoSP src={prefeituraLogoCinza} alt='PREFEITURA SP LOGO' />
        <FooterDescription>
          Sistema homologado para navegadores: Google Chrome e Firefox
        </FooterDescription>
      </FooterContainerItems>
    </FooterContainer>
  );
};

export default Footer;
