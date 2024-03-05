import { Card, Col, Flex, List, Typography } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Empty from '~/components/main/empty';
import { PropostaDashboardDTO, PropostasItemDTO } from '~/core/dto/proposta-dashboard-dto';
import { PropostaFiltrosDTO } from '~/core/dto/proposta-filtro-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoProposta, SituacaoPropostaTagDisplay } from '~/core/enum/situacao-proposta';
import { obterPropostasDashboard } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

const PropostaHover = styled.div`
  &:hover {
    background-color: ${Colors.Neutral.LIGHTEST};
  }
`;

const styleItensCard: CSSProperties = {
  fontSize: 13,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  width: '70%',
};

const styleDataHoraCard: CSSProperties = {
  fontSize: 10,
  color: Colors.Neutral.DARK,
};

type ListaCardsPropostasProps = {
  filters: PropostaFiltrosDTO;
  carregando: boolean;
};

export const ListaCardsPropostas: React.FC<ListaCardsPropostasProps> = ({
  filters,
  carregando,
}) => {
  const navigate = useNavigate();
  const [dadosPropostas, setDadosPropostas] = useState<PropostaDashboardDTO[]>();

  let corSituacaoProposta: string;
  let iconeSituacaoProposta: React.ReactNode;

  const cardCoresIcones = (item: any) => {
    corSituacaoProposta = item.cor;
    switch (item.situacao) {
      case SituacaoProposta.Publicada:
        corSituacaoProposta;
        break;

      case SituacaoProposta.Rascunho:
        corSituacaoProposta;
        break;

      case SituacaoProposta.Cadastrada:
        corSituacaoProposta;
        break;

      case SituacaoProposta.AguardandoAnaliseDf:
        corSituacaoProposta;
        break;

      case SituacaoProposta.AguardandoAnaliseGestao:
        corSituacaoProposta;
        break;

      case SituacaoProposta.Desfavoravel:
        corSituacaoProposta;
        break;

      case SituacaoProposta.Devolvida:
        corSituacaoProposta;
        break;

      default:
        break;
    }
  };

  const obterPropostas = async () => {
    obterPropostasDashboard(filters).then((resposta) => {
      if (resposta.sucesso) {
        setDadosPropostas(resposta.dados);
      }
    });
  };

  const listItensProposta = (item: PropostaDashboardDTO) => {
    return (
      <List
        dataSource={item.propostas}
        renderItem={(item: PropostasItemDTO, index) => {
          return (
            <PropostaHover key={index}>
              <Flex
                gap={24}
                justify='space-between'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate(`${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/${item.numero}`, {
                    replace: true,
                  });
                }}
              >
                <Typography.Text
                  ellipsis={{
                    tooltip: item.nome,
                  }}
                  style={styleItensCard}
                >
                  {item.numero} - {item.nome}
                </Typography.Text>
                <Typography style={styleDataHoraCard}>{item.data}</Typography>
              </Flex>
            </PropostaHover>
          );
        }}
      />
    );
  };

  useEffect(() => {
    obterPropostas();
  }, [filters]);

  return (
    <Col xs={24}>
      <List
        loading={carregando}
        grid={{
          gutter: [26, 26],
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 4,
        }}
        locale={{ emptyText: <Empty /> }}
        dataSource={dadosPropostas}
        renderItem={(item, index) => {
          cardCoresIcones(item);
          return (
            <List.Item>
              <Card
                loading={carregando}
                key={index}
                title={
                  <Flex align='center' gap={8}>
                    {iconeSituacaoProposta}
                    <Typography>{SituacaoPropostaTagDisplay[item.situacao]}</Typography>
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
                    style={{ color: Colors.Suporte.Primary.INFO, fontWeight: 'bold' }}
                    onClick={() => {
                      if (item.situacao) {
                        const valoresParaFiltrar = {
                          ...filters,
                          situacao: item.situacao,
                        };

                        navigate(ROUTES.CADASTRO_DE_PROPOSTAS, {
                          state: { filters: valoresParaFiltrar },
                        });
                      }
                    }}
                  >
                    Ver mais {item.totalRegistros}
                  </Typography.Text>,
                ]}
              >
                {listItensProposta(item)}
              </Card>
            </List.Item>
          );
        }}
      />
    </Col>
  );
};
