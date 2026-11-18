import { SearchOutlined } from '@ant-design/icons';
import { Form, FormInstance, Input, Typography } from 'antd';
import React, { FC } from 'react';
import filterIcon from '~/assets/hugeicons_filter-horizontal.svg';
import { BotaoFiltrosMobile, MobileCardWrapper } from '../../styles';

const { Title, Text } = Typography;

export interface CardFiltroMobileProps {
  form?: FormInstance;
  onOpenFiltros: () => void;
}

export const CardFiltroMobile: FC<CardFiltroMobileProps> = ({ form, onOpenFiltros }) => {
  return (
    <MobileCardWrapper>
      <Title
        level={3}
        style={{
          margin: '0 0 8px 0',
          fontFamily: 'Roboto',
          fontWeight: 700,
          fontSize: 20,
          lineHeight: '1.2',
          color: '#42474A',
        }}
      >
        Nova inscrição
      </Title>
      <Text
        style={{
          fontFamily: 'Roboto',
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '1.4',
          color: '#58616A',
          display: 'block',
          marginBottom: 16,
        }}
      >
        Confira quais são as formações disponíveis e realize a inscrição.
      </Text>

      <Form.Item name='titulo' style={{ marginBottom: 0 }}>
        <Input
          placeholder='Buscar formação'
          suffix={<SearchOutlined style={{ color: '#8C8C8C', fontSize: 16 }} />}
          allowClear
          onPressEnter={() => form?.submit()}
          style={{
            height: 44,
            borderRadius: 8,
            fontFamily: 'Roboto',
            fontSize: 14,
          }}
        />
      </Form.Item>

      <BotaoFiltrosMobile
        type='button'
        onClick={onOpenFiltros}
        data-testid='btn-filtros-mobile'
      >
        <img
          src={filterIcon}
          alt='Filtros'
          style={{ width: 20, height: 20, display: 'inline-block' }}
        />
        <span>Filtros</span>
      </BotaoFiltrosMobile>
    </MobileCardWrapper>
  );
};

export default CardFiltroMobile;
