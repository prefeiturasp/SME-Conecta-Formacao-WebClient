import { Button, Tooltip } from 'antd';
import { ButtonType } from 'antd/es/button';
import React, { PropsWithChildren } from 'react';
import { IconType } from 'react-icons/lib';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

interface ButtonContainerProps {
  borderColor?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

const ButtonContainer = styled(Button)<ButtonContainerProps>`
  &.ant-btn {
    font-weight: 700;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  &.ant-btn-default:disabled {
    border-color: ${Colors.Neutral.LIGHTEST};
  }

  &.ant-btn-default:not(:disabled) {
    border-color: ${(props) => props.borderColor};
    background-color: ${(props) => props.backgroundColor};

    :not(.ant-btn-disabled):hover {
      border-color: ${(props) => props.borderColor};
    }
  }
`;

export interface IconButtonDataTableProps {
  type?: ButtonType;
  color?: string;
  Icon: IconType;
  disabled?: boolean;
  onClick: () => void;
  tooltipTitle?: string;
  backgroundColor?: string;
}

export const IconButtonDataTable: React.FC<IconButtonDataTableProps & PropsWithChildren> = ({
  Icon,
  color,
  type = 'default',
  onClick,
  tooltipTitle = '',
  backgroundColor,
  disabled = false,
  children,
}) => (
  <Tooltip title={tooltipTitle}>
    <ButtonContainer
      type={type}
      onClick={onClick}
      disabled={disabled}
      borderColor={backgroundColor}
      backgroundColor={backgroundColor}
      style={{
        color: disabled ? undefined : color,
      }}
      icon={<Icon size={20} />}
    >
      {children}
    </ButtonContainer>
  </Tooltip>
);
