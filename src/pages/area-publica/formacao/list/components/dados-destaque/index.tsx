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
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const setarDadosInscricao = () => {
    const dadosInscricao = location.state.location;

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

  // TODO - trocar pelo endpoint
  const dadosFormacao = {
    titulo: 'Formação de Teste Conecta',
    areaPromotora: 'teste dre 5',
    tipoFormacao: 1,
    tipoFormacaoDescricao: 'Curso',
    formato: 1,
    formatoDescricao: 'Presencial',
    periodo: 'De 02/12 até 03/12',
    justificativa:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    publicosAlvo: [
      'AGENTE DE APOIO/ASSIST. DE SUPORTE OPERACIONAL',
      'AGENTE ESCOLAR',
      'AGPP/ASSIST.ADM. DE GESTÃO',
      'ANALISTA DE INF.CULT. E DESP. - BIBLIOTECA',
      'ASSESSOR TÉCNICO EDUCACIONAL',
    ],
    palavrasChaves: [
      'ACOMPANHAMENTO DAS APRENDIZAGENS',
      'AFRICANIDADES',
      'ALTAS HABILIDADES',
      'ARTE',
    ],
    inscricaoEncerrada: false,
    imagemUrl:
      'https://dev-arquivos.sme.prefeitura.sp.gov.br/conecta/089717f1-24c4-479c-bb47-a0df6fd72046.png',
    turmas: [
      {
        nome: 'TURMA 0',
        periodos: ['De 01/12 até 02/12'],
        local: 'Salão Nobre',
        horario: '08:00 até 18:00',
        inscricaoEncerrada: false,
      },
      {
        nome: 'TURMA 0',
        periodos: ['De 02/12 até 03/12', 'De 04/12 até 16/12'],
        local: 'teste',
        horario: '09:32 até 11:32',
        inscricaoEncerrada: false,
      },
      {
        nome: 'TURMA 1',
        periodos: ['De 02/12 até 03/12'],
        local: null,
        horario: '03:36 até 05:36',
        inscricaoEncerrada: false,
      },
      {
        nome: 'TURMA 1',
        periodos: ['De 01/12 até 02/12'],
        local: 'Salão Nobre',
        horario: '08:00 até 18:00',
        inscricaoEncerrada: false,
      },
      {
        nome: 'TURMA 3',
        periodos: ['De 01/12 até 02/12'],
        local: 'Salão Nobre',
        horario: '08:00 até 18:00',
        inscricaoEncerrada: false,
      },
    ],
  };

  const desabilitarInscricao = () => {
    if (dadosFormacao?.inscricaoEncerrada) {
      return true;
    }

    if (dadosFormacao?.turmas.find((item) => item.inscricaoEncerrada === false)) {
      return false;
    }

    return true;
  };

  return (
    <FlexDestaque justify='left'>
      <ImagemDestaque src={dadosFormacao?.imagemUrl ?? imagemFormacao} />
      <Flex vertical align='flex-start' justify='space-between' style={{ padding: 15 }}>
        <Typography.Title level={1} style={{ color: '#1C2833', fontWeight: 700 }}>
          {dadosFormacao?.titulo}
        </Typography.Title>

        <TextDestaque>Área Promotora: {dadosFormacao?.areaPromotora}</TextDestaque>

        <Row>
          <TagTipoFormacaoFormato icon={<FaGraduationCap size={22} />} style={{ fontSize: 22 }}>
            {dadosFormacao?.tipoFormacaoDescricao}
          </TagTipoFormacaoFormato>
          <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={22} />} style={{ fontSize: 22 }}>
            {dadosFormacao?.formatoDescricao}
          </TagTipoFormacaoFormato>
        </Row>

        <TextDestaque>
          <CalendarOutlined /> {dadosFormacao?.periodo}
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
