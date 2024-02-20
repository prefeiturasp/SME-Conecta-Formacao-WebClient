import { CalendarOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Tag, Typography } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { ENVIAR_INSCRICAO } from '~/core/constants/mensagens';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setDadosFormacao } from '~/core/redux/modules/area-publica-inscricao/actions';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';

type DadosDestaqueProps = {
  dadosFormacao: RetornoDetalheFormacaoDTO | undefined;
};

const styleTypographyText = {
  fontSize: 22,
};

const TagTipoFormacaoFormato = styled(Tag)`
  gap: 5px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 5px 10px;
  border: none;
  background-color: #ececee;
  color: #58616a;
  font-weight: bold;
`;

const DadosDestaque: React.FC<DadosDestaqueProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const dadosInscricao = location.state.location;
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;

  const setarDadosInscricao = () => {
    dispatch(setDadosFormacao(dadosInscricao));

    const temPerfilCursista = perfilUsuario.filter((item) =>
      item.perfilNome.includes(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]),
    );

    const perfilUsuarioId = temPerfilCursista[0]?.perfil;

    if (autenticado) {
      autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId).then((response) => {
        validarAutenticacao(response.data);
      });

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
    <Flex justify='left'>
      <Row gutter={28}>
        <Col>
          <img src={dadosInscricao?.imagemUrl ?? imagemFormacao} style={{ width: '100%' }} />
        </Col>

        <Flex gap={12} vertical justify='space-between' style={{ padding: 15 }}>
          <Typography.Title level={1}>{dadosInscricao?.titulo}</Typography.Title>

          <Typography.Text style={styleTypographyText}>
            Área Promotora: {dadosInscricao?.areaPromotora}
          </Typography.Text>

          <Row>
            <TagTipoFormacaoFormato
              icon={<FaGraduationCap size={22} />}
              style={styleTypographyText}
            >
              {dadosInscricao?.tipoFormacaoDescricao}
            </TagTipoFormacaoFormato>
            <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={22} />} style={styleTypographyText}>
              {dadosInscricao?.formatoDescricao}
            </TagTipoFormacaoFormato>
          </Row>

          <Typography.Text style={styleTypographyText}>
            <CalendarOutlined /> {dadosInscricao?.periodo}
          </Typography.Text>

          <Col span={48}>
            <Button
              type='primary'
              shape='round'
              size='large'
              onClick={setarDadosInscricao}
              disabled={desabilitarInscricao()}
            >
              {ENVIAR_INSCRICAO}
            </Button>
          </Col>
        </Flex>
      </Row>
    </Flex>
  );
};

export default DadosDestaque;
