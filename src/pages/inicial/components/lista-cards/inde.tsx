import { Card, Col, Flex, List, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import { BsFiles } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { LuArrowLeftSquare, LuFileSearch2 } from 'react-icons/lu';
import { MdOutlineDoNotDisturb } from 'react-icons/md';
import { RiInboxArchiveLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoProposta, SituacaoPropostaTagDisplay } from '~/core/enum/situacao-proposta';
import { Colors } from '~/core/styles/colors';
import { FilterStateLocationProps } from '../filtro';

const PropostaHover = styled.div`
  &:hover {
    background-color: ${Colors.Neutral.LIGHTEST};
  }
`;

const styleItensCard: CSSProperties = {
  fontSize: 13,
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const styleDataHoraCard: CSSProperties = { fontSize: 10, color: Colors.Neutral.DARK };

type ListaCardsPropostasProps = {
  filters: FilterStateLocationProps;
};

export const ListaCardsPropostas: React.FC<ListaCardsPropostasProps> = ({ filters }) => {
  const navigate = useNavigate();

  let corSituacaoProposta: string;
  let iconeSituacaoProposta: React.ReactNode;

  const CoresCardsProposta = {
    Publicada: '#D06D12',
    AguardandoAnaliseDf: '#6464FF',
    Devolvida: '#EEC25E',
    AguardandoAnaliseGestao: '#000000',
    Cadastrada: '#297805',
    Desfavoravel: '#A50E05',
    Rascunho: '#000000',
  };

  const cardCoresIcones = (item: any) => {
    switch (item.situacao) {
      case SituacaoPropostaTagDisplay[SituacaoProposta.Publicada]:
        corSituacaoProposta = CoresCardsProposta.Publicada;
        iconeSituacaoProposta = <RiInboxArchiveLine size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Rascunho]:
        corSituacaoProposta = CoresCardsProposta.Rascunho;
        iconeSituacaoProposta = <IoIosWarning size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Cadastrada]:
        corSituacaoProposta = CoresCardsProposta.Cadastrada;
        iconeSituacaoProposta = <FaCheck size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseDf]:
        corSituacaoProposta = CoresCardsProposta.AguardandoAnaliseDf;
        iconeSituacaoProposta = <LuFileSearch2 size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseGestao]:
        corSituacaoProposta = CoresCardsProposta.AguardandoAnaliseGestao;
        iconeSituacaoProposta = <BsFiles size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Desfavoravel]:
        corSituacaoProposta = CoresCardsProposta.Desfavoravel;
        iconeSituacaoProposta = <MdOutlineDoNotDisturb size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Devolvida]:
        corSituacaoProposta = CoresCardsProposta.Devolvida;
        iconeSituacaoProposta = <LuArrowLeftSquare size={24} color={corSituacaoProposta} />;
        break;

      default:
        break;
    }
  };

  // TODO: AGUARDAR ENDPOINT PARA OBTER AS PROPOSTAS
  const generateMockItens = (situacao: string) => {
    const itens = [];
    for (let i = 1; i <= 20; i++) {
      itens.push({
        codigo: `000${i}`,
        nome: `Item ${i}`,
        dataHora: '08/08/22 ás 09:45',
      });
    }
    return { situacao, itens };
  };

  const situacoes = [
    SituacaoPropostaTagDisplay[SituacaoProposta.Publicada],
    SituacaoPropostaTagDisplay[SituacaoProposta.Rascunho],
    SituacaoPropostaTagDisplay[SituacaoProposta.Cadastrada],
    SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseDf],
    SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseGestao],
    SituacaoPropostaTagDisplay[SituacaoProposta.Desfavoravel],
    SituacaoPropostaTagDisplay[SituacaoProposta.Devolvida],
  ];

  const listaCards = situacoes.map((situacao) => generateMockItens(situacao));

  const cardProposta = (propostas: any) => {
    return (
      <List
        dataSource={propostas.itens.slice(0, 5)}
        renderItem={(item: any, index) => {
          return (
            <PropostaHover key={index}>
              <Flex
                gap={24}
                align='center'
                justify='space-between'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  //TODO: PASSAR O ID DO ITEM CLICADO
                  navigate(`${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/${item.codigo}`, {
                    replace: true,
                  });
                }}
              >
                <Typography style={styleItensCard}>
                  {item.codigo} - {item.nome}
                </Typography>
                <Typography style={styleDataHoraCard}>{item.dataHora}</Typography>
              </Flex>
            </PropostaHover>
          );
        }}
      />
    );
  };

  return (
    <Col>
      <List
        grid={{
          gutter: [26, 26],
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 4,
        }}
        dataSource={listaCards}
        renderItem={(item, index) => {
          cardCoresIcones(item);
          return (
            <List.Item>
              <Card
                key={index}
                title={
                  <Flex align='center' gap={8}>
                    {iconeSituacaoProposta}
                    <Typography>{item.situacao}</Typography>
                  </Flex>
                }
                extra={
                  <Typography style={{ fontSize: 10, color: Colors.Neutral.DARK }}>
                    Data/Hora
                  </Typography>
                }
                style={{
                  borderLeft: `10px solid ${corSituacaoProposta}`,
                  borderRadius: 5,
                }}
                actions={[
                  <Typography.Text
                    style={{ color: '#035D96', fontWeight: 'bold' }}
                    onClick={() => {
                      navigate(ROUTES.CADASTRO_DE_PROPOSTAS, {
                        state: filters,
                      });
                    }}
                  >
                    Ver mais {item.itens.length - 5}
                  </Typography.Text>,
                ]}
              >
                {cardProposta(item)}
              </Card>
            </List.Item>
          );
        }}
      />
    </Col>
  );
};
