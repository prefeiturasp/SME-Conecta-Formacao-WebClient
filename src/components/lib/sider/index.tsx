import { Button, Layout } from 'antd';
import React, { useState } from 'react';

import styled from 'styled-components';
import { BoxShadow, Colors } from '~/core/styles/colors';

import { FormOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';

const SiderContainer = styled(Layout.Sider)`
  box-shadow: ${BoxShadow.DEFAULT};
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`;

const MenuGroup = styled.div`
  background-color: ${Colors.ORANGE_CONECTA_FORMACAO};
  width: 100%;
  height: 60px;
  margin: 4px;
  border-radius: 4px;
  justify-content: space-evenly;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  div {
    font-size: 10px;
    font-weight: 700;
  }
`;
const Sider: React.FC = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);

  return (
    <SiderContainer
      width={collapsed ? 88 : 264}
      style={{
        textAlign: 'center',
        color: '#fff',
        backgroundColor: Colors.ORANGE_CF_DARK,
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 12,
      }}
      trigger={null}
      collapsible
    >
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '24px',
          width: '100%',
          height: '72px',
          backgroundColor: Colors.ORANGE_CONECTA_FORMACAO,
          color: 'white',
          borderRadius: 0,
        }}
      />
      <MenuContainer>
        {/* TODO - O MENU VAI SER CRIADO EM OUTRO MOMENTO! */}
        <MenuGroup onClick={() => navigate(ROUTES.MEUS_DADOS)}>
          <FaUser size={24} />
          <div>Meus dados</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.AREA_PROMOTORA)}>
          <FormOutlined size={24} />
          <div>Área promotora</div>
        </MenuGroup>
        <MenuGroup onClick={() => navigate(ROUTES.CADASTRO_DE_PROPOSTAS)}>
          <FormOutlined size={24} />
          <div>Cadastro de propostas</div>
        </MenuGroup>
      </MenuContainer>
    </SiderContainer>
  );
};

export default Sider;
