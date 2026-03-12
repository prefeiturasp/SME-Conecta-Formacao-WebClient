import { Button, Col, Flex, Row, Tag, Typography } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { BOTAO_INSCRICAO_EXTERNA, ENVIAR_INSCRICAO } from '~/core/constants/mensagens';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setDadosFormacao } from '~/core/redux/modules/area-publica-inscricao/actions';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';

type DadosDestaqueProps = {
  dadosFormacao: RetornoDetalheFormacaoDTO | undefined;
  propostaId?: number;
};

const styleTypographyText = {
  fontSize: 20,
};

const TagTipoFormacaoFormato = styled(Tag)`
  gap: 5px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 7px 10px;
  border: none;
  background-color: #ececee;
  color: #58616a;
  font-weight: bold;
`;

const DadosDestaque: React.FC<DadosDestaqueProps> = (dadosFormacao) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const dadosInscricao: RetornoDetalheFormacaoDTO = location.state.location;
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;
  const linkInscricaoExterna = dadosFormacao.dadosFormacao?.linkParaInscricoesExterna;

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

      navigate(`${ROUTES.INSCRICAO}/${dadosFormacao?.propostaId}`, {
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
    <>
      <Row>
        <Col span={6}>
          { }
        </Col>
        <Col span={18}>
          <Flex gap={12} vertical justify='space-between' style={{ padding: 15 }}>
            <Typography.Title level={2}>{dadosInscricao?.titulo}</Typography.Title>
          </Flex>
        </Col>
      </Row>

      <Row>
        <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <img src={dadosInscricao?.imagemUrl ?? imagemFormacao}
          alt="Imagem da formação"
          style={{ width: '70%' }} />
        </Col>
        <Col span={18}>
          <Flex gap={5} vertical justify='space-between' style={{ padding: '0px 15px 15px 15px' }}>

            <Row style={{ marginTop: 0, marginBottom: 10 }}>
              <TagTipoFormacaoFormato icon={<FaGraduationCap size={22} />} style={styleTypographyText}>
                {dadosInscricao?.tipoFormacaoDescricao}
              </TagTipoFormacaoFormato>
              <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={22} />} style={styleTypographyText}>
                {dadosInscricao?.formatoDescricao}
              </TagTipoFormacaoFormato>
            </Row>

            <Typography.Text style={styleTypographyText}>
              <strong>Período de realização:</strong> {dadosInscricao?.periodo}
            </Typography.Text>

            <Typography.Text style={styleTypographyText}>
              <strong>Período de inscrição:</strong> {dadosInscricao?.periodoInscricao}
            </Typography.Text>

            <Typography.Text style={styleTypographyText}>
              <strong>Área Promotora:</strong> {dadosInscricao?.areaPromotora}
            </Typography.Text>


            <Row style={{ marginTop: 20, marginBottom: 10 }}>
              <Col span={24}>
                {linkInscricaoExterna ? (
                  <Button type='primary' size='large' style={{ width: 500 }}>
                    <Link
                      to={linkInscricaoExterna}
                      target='_blank'
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <strong>{BOTAO_INSCRICAO_EXTERNA}</strong>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    size='large'
                    onClick={setarDadosInscricao}
                    disabled={desabilitarInscricao()}
                    style={{ width: 400 }}
                  >
                    <strong>{ENVIAR_INSCRICAO}</strong>
                  </Button>
                )}
              </Col>
            </Row>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default DadosDestaque;
