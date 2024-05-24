import { Badge, Button, ButtonProps } from 'antd';
import React, { useContext } from 'react';

import { IoNotificationsSharp } from 'react-icons/io5';
import styled from 'styled-components';
import { NotificacoesContext } from '~/pages/notificacoes/provider';

const NotificationButtonContainer = styled.div`
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

interface NotificationButtonProps extends ButtonProps {
  label?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  label = 'Notificações',
  ...rest
}) => {
  const { quantidadeNotificacoes } = useContext(NotificacoesContext);

  return (
    <NotificationButtonContainer>
      <Badge count={quantidadeNotificacoes}>
        <Button
          size='small'
          type='primary'
          shape='circle'
          icon={<IoNotificationsSharp />}
          {...rest}
        />
      </Badge>
      <LabelButton>{label}</LabelButton>
    </NotificationButtonContainer>
  );
};

export default NotificationButton;
