import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { LuArrowDownUp } from 'react-icons/lu';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';

type ButtonOrdenacaoProps = {
  onClick: (type: TipoOrdenacaoEnum) => void;
};
const ButtonOrdenacao: React.FC<ButtonOrdenacaoProps> = ({ onClick }) => {
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    onClick(Number(e.key));
  };

  const items: MenuProps['items'] = [
    {
      label: 'Decrescente por data de registro',
      key: TipoOrdenacaoEnum.DATA,
    },
    {
      label: 'Por ordem alfabética (A–Z)',
      key: TipoOrdenacaoEnum.AZ,
    },
    {
      label: 'Por ordem alfabética (Z–A)',
      key: TipoOrdenacaoEnum.ZA,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
      <Button
        style={{
          padding: '0px 8px',
          fontWeight: 700,
          marginTop: 10,
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <LuArrowDownUp size={17} />
        Ordenar
      </Button>
    </Dropdown>
  );
};

export default ButtonOrdenacao;
