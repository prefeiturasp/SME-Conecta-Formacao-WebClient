import React from 'react';
import { Button, Flex, Row, Typography } from 'antd';
import { CalendarOutlined, SolutionOutlined } from '@ant-design/icons';
import { IoLocationOutline } from 'react-icons/io5';
import { FlexDestaque, ImagemDestaque, TagDestaque, TextDestaque } from './styles';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';

type DadosDestaqueProps = {
  srcImagem?: string;
  titulo?: string;
  areaPromotra?: string;
  tipoFormacao?: string;
  formato?: string;
  datas?: string;
};
const DadosDestaque: React.FC<DadosDestaqueProps> = ({
  srcImagem,
  titulo,
  areaPromotra,
  tipoFormacao,
  formato,
  datas,
}) => (
  <FlexDestaque justify='left'>
    <ImagemDestaque src={srcImagem ?? imagemFormacao} />
    <Flex vertical align='flex-start' justify='space-between' style={{ padding: 15 }}>
      <Typography.Title level={1}>{titulo}</Typography.Title>
      <TextDestaque>Área Promotora: {areaPromotra}</TextDestaque>
      <Row>
        <TagDestaque icon={<SolutionOutlined />}>{tipoFormacao}</TagDestaque>
        <TagDestaque icon={<IoLocationOutline />}>{formato}</TagDestaque>
      </Row>
      <TextDestaque>
        <CalendarOutlined /> {datas}
      </TextDestaque>
      <Button type='primary' shape='round' size='large'>
        Enviar inscrição
      </Button>
    </Flex>
  </FlexDestaque>
);

export default DadosDestaque;
