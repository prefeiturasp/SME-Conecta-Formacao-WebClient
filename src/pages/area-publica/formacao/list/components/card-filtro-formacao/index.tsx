import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';
import CardFiltroMobile from './components/card-filtro-mobile';
import FiltroFormacaoDesktop from './components/filtro-formacao-desktop';
import FiltroFormacaoMobilePanel from './components/filtro-formacao-mobile-panel';
import { MobileFiltroContainer } from './styles';

export interface CardFiltroFormacaoProps {
  form?: FormInstance;
  onLimpar?: () => void;
}

export const CardFiltroFormacao: FC<CardFiltroFormacaoProps> = ({ form, onLimpar }) => {
  const [drawerAberto, setDrawerAberto] = useState(false);

  return (
    <>
      <style>
        {`
          .ant-form-item-label > label {
            font-weight: 600;
          }
        `}
      </style>

      {/* Versão Desktop */}
      <FiltroFormacaoDesktop />

      {/* Versão Mobile */}
      <MobileFiltroContainer>
        <CardFiltroMobile
          form={form}
          onOpenFiltros={() => setDrawerAberto(true)}
        />

        <FiltroFormacaoMobilePanel
          open={drawerAberto}
          form={form}
          onClose={() => setDrawerAberto(false)}
          onLimpar={onLimpar}
        />
      </MobileFiltroContainer>
    </>
  );
};

export default CardFiltroFormacao;
