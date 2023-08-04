import { Button, ButtonProps } from 'antd';
import React from 'react';

import { FaPowerOff } from 'react-icons/fa';
import styled from 'styled-components';

const ExitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  line-height: 1.5;

  .ant-btn-icon {
    justify-content: center;
    display: flex;
    align-items: center;
  }
`;

const LabelButton = styled.div`
  font-size: 10px;
  color: #929494;
`;

interface ExitButtonProps extends ButtonProps {
  label?: string;
}

const ExitButton: React.FC<ExitButtonProps> = ({ label = 'Sair', ...rest }) => (
  <ExitButtonContainer>
    <Button size='small' type='primary' shape='circle' icon={<FaPowerOff />} {...rest} />
    <LabelButton>{label}</LabelButton>
  </ExitButtonContainer>
);

export default ExitButton;
