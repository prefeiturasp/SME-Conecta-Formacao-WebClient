import { Button, ButtonProps } from 'antd';
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const ButtonExcluir: React.FC<ButtonProps> = ({ ...rest }) => {
  return (
    <Button
      type='default'
      block
      danger
      icon={<FaTrashAlt />}
      style={{ width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      {...rest}
    />
  );
};

export default ButtonExcluir;
