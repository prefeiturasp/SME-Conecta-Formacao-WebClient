import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

import prefeituraLogoCinza from '~/assets/prefeitura-sp-logo-cinza.svg';

const FooterContainer = styled(Layout.Footer)`
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 49px;
  padding: 0px 32px;
`;

const FooterContainerItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #bfbfbf;
`;

const LogoSP = styled.img`
  height: 45px;
  padding: 5px 0px;
`;

const FooterDescription = styled.div`
  font-size: 14px;
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
