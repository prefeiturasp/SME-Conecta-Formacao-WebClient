import React from 'react';
import { Flex, Row, Typography } from 'antd';
import { CalendarOutlined, SolutionOutlined } from '@ant-design/icons';
import { IoLocationOutline } from 'react-icons/io5';
import { FlexDestaque, ImagemDestaque, TagDestaque } from './styles';

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
    <ImagemDestaque src={srcImagem} />
    <Flex vertical align='flex-start' justify='space-between' style={{ padding: 15 }}>
      <Typography.Title level={1}>{titulo}</Typography.Title>
      <Typography.Title level={5}>Área Promotora: {areaPromotra}</Typography.Title>
      <Row>
        <TagDestaque icon={<SolutionOutlined />}>{tipoFormacao}</TagDestaque>
        <TagDestaque icon={<IoLocationOutline />}>{formato}</TagDestaque>
      </Row>
      <Typography.Title level={5}>
        <CalendarOutlined /> {datas}
      </Typography.Title>
    </Flex>
  </FlexDestaque>
);

export default DadosDestaque;
