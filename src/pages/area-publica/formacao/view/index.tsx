import { FC, useCallback, useEffect, useState } from 'react';
import DadosDestaque from '../list/components/dados-destaque';
import { useParams } from 'react-router-dom';
import { Col, Row, Space, Tag, Typography, notification } from 'antd';
import { Colors } from '~/core/styles/colors';
import styled from 'styled-components';
import CardTurmasPublico from '../../components/card-turmas';
import { obterDadosFormacao } from '~/core/services/area-publica-service';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { PALAVRAS_CHAVES, PUBLICO_ALVO, SOBRE_ESTE_EVENTO } from '~/core/constants/mensagens';

const PalavraChave = styled(Tag)`
  font-size: 14px;
  border-radius: 20px;
  padding: 5px 10px 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  background-color: ${Colors.Neutral.DARK};
  color: ${Colors.Neutral.WHITE};
`;
const ListaPublicAlvo = styled.ul`
  padding-left: 27px;
`;

const VisualizarFormacao: FC = () => {
  const paramsRoute = useParams();
  const [dadosFormacao, setDadosFormacao] = useState<RetornoDetalheFormacaoDTO>();
  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;
  const carregarDados = useCallback(async () => {
    const formacao = await obterDadosFormacao(id);
    if (formacao.sucesso) {
      setDadosFormacao(formacao.dados);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);
  return (
    <>
      <DadosDestaque
        srcImagem={dadosFormacao?.imagemUrl}
        areaPromotra={dadosFormacao?.areaPromotora}
        formato={dadosFormacao?.formatoDescricao}
        tipoFormacao={dadosFormacao?.tipoFormacaoDescricao}
        datas={dadosFormacao?.periodo}
        titulo={dadosFormacao?.titulo}
      />
      <Row>
        <Typography.Title level={3} style={{ paddingTop: 25 }}>
          {SOBRE_ESTE_EVENTO}
        </Typography.Title>
        <Typography.Text>{dadosFormacao?.justificativa} </Typography.Text>
      </Row>
      <Space style={{ paddingTop: 20 }}>
        <Typography.Title level={4} style={{ paddingRight: 80 }}>
          {PUBLICO_ALVO}
          <Col>
            <ListaPublicAlvo>
              {dadosFormacao?.publicosAlvo?.map((publico, i) => {
                return (
                  <li key={i}>
                    <Typography.Text>{publico}</Typography.Text>
                  </li>
                );
              })}
            </ListaPublicAlvo>
          </Col>
        </Typography.Title>
        <Typography.Title level={4} style={{ paddingLeft: 180 }}>
          {PALAVRAS_CHAVES}
          <Row>
            {dadosFormacao?.palavrasChaves?.map((palavra, i) => {
              return <PalavraChave key={i}>{palavra}</PalavraChave>;
            })}
          </Row>
        </Typography.Title>
      </Space>
      <Row>
        {dadosFormacao?.turmas?.map((turma, i) => {
          return (
            <CardTurmasPublico
              key={i}
              titulo={turma.nome}
              datas={turma?.periodos?.join(' , ')}
              local={turma.local}
              turmaEncerrada={turma.inscricaoEncerrada}
            />
          );
        })}
      </Row>
    </>
  );
};

export default VisualizarFormacao;
