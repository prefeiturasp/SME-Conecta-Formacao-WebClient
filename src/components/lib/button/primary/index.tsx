import { Button, ButtonProps } from 'antd';
import React from 'react';

export const ButtonPrimary: React.FC<ButtonProps> = ({ ...rest }) => (
  <Button
    type='primary'
    block
    style={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}
    {...rest}
  />
);
