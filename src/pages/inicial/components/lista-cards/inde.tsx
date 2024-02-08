import { Card, Col, Flex, List, Typography } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { BsFiles } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { LuArrowLeftSquare, LuFileSearch2 } from 'react-icons/lu';
import { MdOutlineDoNotDisturb } from 'react-icons/md';
import { RiInboxArchiveLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PropostaDashboardDTO, PropostasItemDTO } from '~/core/dto/proposta-dashboard-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  SituacaoProposta,
  SituacaoPropostaCorTagDisplay,
  SituacaoPropostaTagDisplay,
} from '~/core/enum/situacao-proposta';
import { obterPropostasDashboard } from '~/core/services/proposta-service';
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
  width: '70%',
};

const styleDataHoraCard: CSSProperties = {
  fontSize: 10,
  color: Colors.Neutral.DARK,
};

type ListaCardsPropostasProps = {
  filters: FilterStateLocationProps;
};

export const ListaCardsPropostas: React.FC<ListaCardsPropostasProps> = ({ filters }) => {
  const navigate = useNavigate();
  const [dadosPropostas, setDadosPropostas] = useState<PropostaDashboardDTO[]>();

  let corSituacaoProposta: string;
  let iconeSituacaoProposta: React.ReactNode;

  const cardCoresIcones = (item: any) => {
    switch (item.situacao) {
      case SituacaoPropostaTagDisplay[SituacaoProposta.Publicada]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Publicada];
        iconeSituacaoProposta = <RiInboxArchiveLine size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Rascunho]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Rascunho];
        iconeSituacaoProposta = <IoIosWarning size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Cadastrada]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Cadastrada];
        iconeSituacaoProposta = <FaCheck size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseDf]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Publicada];
        iconeSituacaoProposta = <LuFileSearch2 size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseGestao]:
        corSituacaoProposta =
          SituacaoPropostaCorTagDisplay[SituacaoProposta.AguardandoAnaliseGestao];
        iconeSituacaoProposta = <BsFiles size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Desfavoravel]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Desfavoravel];
        iconeSituacaoProposta = <MdOutlineDoNotDisturb size={24} color={corSituacaoProposta} />;
        break;

      case SituacaoPropostaTagDisplay[SituacaoProposta.Devolvida]:
        corSituacaoProposta = SituacaoPropostaCorTagDisplay[SituacaoProposta.Devolvida];
        iconeSituacaoProposta = <LuArrowLeftSquare size={24} color={corSituacaoProposta} />;
        break;

      default:
        break;
    }
  };

  const obterPropostas = async () => {
    obterPropostasDashboard().then((resposta) => {
      if (resposta.sucesso) {
        setDadosPropostas(resposta.dados);
      }
    });
  };

  const cardProposta = (item: PropostaDashboardDTO) => {
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
  }, []);

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
        dataSource={dadosPropostas}
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
                    style={{ color: Colors.Suporte.Primary.INFO, fontWeight: 'bold' }}
                    onClick={() => {
                      navigate(ROUTES.CADASTRO_DE_PROPOSTAS, {
                        state: filters,
                      });
                    }}
                  >
                    Ver mais {item.totalRegistros}
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
