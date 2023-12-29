import { CalendarOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Typography } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { ENVIAR_INSCRICAO } from '~/core/constants/mensagens';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setDadosInscricao } from '~/core/redux/modules/area-publica-inscricao/actions';
import { TagTipoFormacaoFormato } from '../card-formacao/styles';
import { FlexDestaque, ImagemDestaque, TextDestaque } from './styles';

type DadosDestaqueProps = {
  dadosFormacao: RetornoDetalheFormacaoDTO | undefined;
};

const DadosDestaque: React.FC<DadosDestaqueProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const dadosInscricao = location.state.location;
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const setarDadosInscricao = () => {
    dispatch(setDadosInscricao(dadosInscricao));

    if (autenticado) {
      navigate(ROUTES.INSCRICAO, {
        replace: true,
      });
    } else {
      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    }
  };

  const desabilitarInscricao = () => {
    if (dadosInscricao?.inscricaoEncerrada) {
      return true;
    }

    if (dadosInscricao?.turmas?.find((item: any) => item.inscricaoEncerrada === false)) {
      return false;
    }

    return false;
  };

  return (
    <FlexDestaque justify='left'>
      <ImagemDestaque src={dadosInscricao?.imagemUrl ?? imagemFormacao} />
      <Flex vertical align='flex-start' justify='space-between' style={{ padding: 15 }}>
        <Typography.Title level={1} style={{ color: '#1C2833', fontWeight: 700 }}>
          {dadosInscricao?.titulo}
        </Typography.Title>

        <TextDestaque>Área Promotora: {dadosInscricao?.areaPromotora}</TextDestaque>

        <Row>
          <TagTipoFormacaoFormato icon={<FaGraduationCap size={22} />} style={{ fontSize: 22 }}>
            {dadosInscricao?.tipoFormacaoDescricao}
          </TagTipoFormacaoFormato>
          <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={22} />} style={{ fontSize: 22 }}>
            {dadosInscricao?.formatoDescricao}
          </TagTipoFormacaoFormato>
        </Row>

        <TextDestaque>
          <CalendarOutlined /> {dadosInscricao?.periodo}
        </TextDestaque>

        <Button
          type='primary'
          shape='round'
          size='large'
          onClick={setarDadosInscricao}
          disabled={desabilitarInscricao()}
        >
          {ENVIAR_INSCRICAO}
        </Button>
      </Flex>
    </FlexDestaque>
  );
};

export default DadosDestaque;
