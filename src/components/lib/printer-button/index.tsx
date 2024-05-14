import { Button, ButtonProps } from 'antd';
import React from 'react';
import { AiFillPrinter } from 'react-icons/ai';

export const ButtonImprimir: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button
      type='default'
      block
      icon={<AiFillPrinter size={20} />}
      style={{ width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      {...rest}
    />
  );
};
