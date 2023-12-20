import { CalendarOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Typography } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { ENVIAR_INSCRICAO } from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setDadosInscricao } from '~/core/redux/modules/area-publica-inscricao/actions';
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
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const setarDadosInscricao = () => {
    const dadosInscricao = location.state.location;
    navigate(ROUTES.LOGIN, {
      replace: true,
    });
    dispatch(setDadosInscricao(dadosInscricao));
  };

  return (
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

        <Button type='primary' shape='round' size='large' onClick={setarDadosInscricao}>
          {ENVIAR_INSCRICAO}
        </Button>
      </Flex>
    </FlexDestaque>
  );
};

export default DadosDestaque;
