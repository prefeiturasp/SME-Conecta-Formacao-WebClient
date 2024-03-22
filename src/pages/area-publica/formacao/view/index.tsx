import { Col, Row, Tag, Typography } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PALAVRAS_CHAVES, PUBLICO_ALVO, SOBRE_ESTE_EVENTO } from '~/core/constants/mensagens';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { obterDadosFormacao } from '~/core/services/area-publica-service';
import { Colors } from '~/core/styles/colors';
import CardTurmasPublico from '../../components/card-turmas';
import DadosDestaque from '../list/components/dados-destaque';
import { DivTitulo, TextTitulo } from '../list/styles';
import { ROUTES } from '~/core/enum/routes-enum';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import ButtonVoltar from '~/components/main/button/voltar';
import HeaderPage from '~/components/lib/header-page';

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
  const navigate = useNavigate();
  const carregarDados = useCallback(async () => {
    const formacao = await obterDadosFormacao(id);
    if (formacao.sucesso) {
      setDadosFormacao(formacao.dados);
    }
  }, [id]);

  const onClickVoltar = () => navigate(ROUTES.AREA_PUBLICA);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  return (
    <>
      <HeaderPage title=''>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <DadosDestaque dadosFormacao={dadosFormacao} />

      <Typography.Title level={3} style={{ paddingTop: 25, color: '#58616A', fontWeight: 700 }}>
        {SOBRE_ESTE_EVENTO}
      </Typography.Title>
      <Row>
        <Typography.Text style={{ color: '#58616A', fontSize: 16, fontWeight: 500 }}>
          {dadosFormacao?.justificativa}
        </Typography.Text>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        {dadosFormacao?.publicosAlvo?.length ? (
          <Typography.Title level={4} style={{ paddingRight: 80 }}>
            <Typography.Title
              level={3}
              style={{ paddingTop: 25, color: '#58616A', fontWeight: 700 }}
            >
              {PUBLICO_ALVO}
            </Typography.Title>

            <Col>
              <ListaPublicAlvo>
                {dadosFormacao?.publicosAlvo?.map((publico, i) => {
                  return (
                    <li key={i}>
                      <Typography.Text style={{ color: '#58616A', fontSize: 16, fontWeight: 500 }}>
                        {publico}
                      </Typography.Text>
                    </li>
                  );
                })}
              </ListaPublicAlvo>
            </Col>
          </Typography.Title>
        ) : (
          <></>
        )}

        <Typography.Title level={4}>
          <Typography.Title level={3} style={{ color: '#58616A', fontWeight: 700 }}>
            {PALAVRAS_CHAVES}
          </Typography.Title>
          <Row>
            {dadosFormacao?.palavrasChaves?.map((palavra, i) => {
              return <PalavraChave key={i}>{palavra}</PalavraChave>;
            })}
          </Row>
        </Typography.Title>
      </Row>

      <DivTitulo>
        <TextTitulo>Turmas</TextTitulo>
      </DivTitulo>
      <Col>
        {dadosFormacao?.turmas?.map((turma, i) => {
          return (
            <CardTurmasPublico
              key={i}
              titulo={turma.nome}
              datas={turma?.periodos}
              local={turma.local}
              turmaEncerrada={turma.inscricaoEncerrada}
            />
          );
        })}
      </Col>
    </>
  );
};

export default VisualizarFormacao;
