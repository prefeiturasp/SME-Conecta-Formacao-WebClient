import { CalendarOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Typography } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { TagTipoFormacaoFormato } from '../card-formacao/styles';
import { FlexDestaque, ImagemDestaque, TextDestaque } from './styles';

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
      <Typography.Title level={1} style={{ color: '#1C2833', fontWeight: 700 }}>
        {titulo}
      </Typography.Title>
      <TextDestaque>Área Promotora: {areaPromotra}</TextDestaque>
      <Row>
        <TagTipoFormacaoFormato icon={<FaGraduationCap size={22} />} style={{ fontSize: 22 }}>
          {tipoFormacao}
        </TagTipoFormacaoFormato>
        <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={22} />} style={{ fontSize: 22 }}>
          {formato}
        </TagTipoFormacaoFormato>
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
