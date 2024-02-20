import { Button, ButtonProps } from 'antd';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const ButtonVoltar: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button
      type='default'
      block
      icon={<FaArrowLeft />}
      style={{ width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      {...rest}
      disabled={false}
    />
  );
};

export default ButtonVoltar;
