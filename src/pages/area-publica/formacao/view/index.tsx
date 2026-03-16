import { Col, Row, Typography } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PUBLICO_ALVO_VAGAS_REMANESCENTES, PUBLICO_ALVO, SOBRE_ESTE_CURSO } from '~/core/constants/mensagens';
import { RetornoDetalheFormacaoDTO } from '~/core/dto/dados-formacao-area-publica-dto';
import { obterDadosFormacao } from '~/core/services/area-publica-service';
import CardTurmasPublico from '../../components/card-turmas';
import DadosDestaque from '../list/components/dados-destaque';
import { ROUTES } from '~/core/enum/routes-enum';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { HomeFilled } from '@ant-design/icons';
import { CustomDivider, TurmasTitulo, typographyStyles, PalavrasTag } from './styles';


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
      <Row style={{ width: '100%', padding: '16px 0' }}>
        <Col>
          <Typography.Link
            onClick={() => onClickVoltar()}
            id={CF_BUTTON_VOLTAR}
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: '#ff9a52',
              display: 'flex',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <HomeFilled style={{ marginRight: 6 }} />
            Início
          </Typography.Link>
        </Col>
      </Row>

      <div style={{ background: '#fff', minHeight: '100vh', padding: 24 }}>

        <DadosDestaque dadosFormacao={dadosFormacao} propostaId={id} />

        <CustomDivider />

        <Row gutter={32}>
          <Col span={12}>
            <Typography.Title level={3} style={typographyStyles.tituloNivel3}>
              {SOBRE_ESTE_CURSO}
            </Typography.Title>

            <Typography
              style={typographyStyles.textoJustificativa}
              dangerouslySetInnerHTML={{ __html: dadosFormacao?.justificativa ?? '' }}
            />
          </Col>

          {dadosFormacao?.publicosAlvo?.length ? (
            <Col span={6}>
              <Typography.Title level={3} style={typographyStyles.tituloPublicoAlvo}>
                {PUBLICO_ALVO}
              </Typography.Title>
              {dadosFormacao.publicosAlvo.map((publico) => (
                <Typography.Text key={publico} style={typographyStyles.textoPublicoAlvo}>
                  <PalavrasTag>{publico}</PalavrasTag>
                </Typography.Text>
              ))}
            </Col>
          ) : null}

          <Col span={6}>
            <Typography.Title level={3} style={typographyStyles.tituloPublicoAlvo}>
              {PUBLICO_ALVO_VAGAS_REMANESCENTES}
            </Typography.Title>

            <Row>
              {dadosFormacao?.palavrasChaves?.map((palavra) => (
                <PalavrasTag key={palavra}>{palavra}</PalavrasTag>
              ))}
            </Row>
          </Col>
        </Row>

        <CustomDivider />

        <TurmasTitulo level={4}>Turmas</TurmasTitulo>

        <Typography
          style={typographyStyles.textoJustificativa}
          dangerouslySetInnerHTML={{ __html: dadosFormacao?.justificativa ?? '' }}
        />

        <br/>

        <Row gutter={[16, 16]}>
          {dadosFormacao?.turmas?.map((turma) => (
            <Col key={turma.nome} xs={24} md={12} lg={8}>
              <CardTurmasPublico turma={turma} />
            </Col>
          ))}
        </Row>

      </div>
    </>
  );
};

export default VisualizarFormacao;
