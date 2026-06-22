import { Button, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_SALVAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  obterPropostasTurmasComCodaf,
  PropostaTurmaComCodafDTO,
} from '~/core/services/codaf-lista-presenca-service';
import {
  criarCodafSuplementar,
  obterCodafOriginal,
} from '~/core/services/codaf-suplementar-service';
import {
  autocompletarFormacaoComCodaf,
  PropostaAutocompletarDTO,
} from '~/core/services/proposta-service';
import { onClickVoltar } from '~/core/utils/form';
import { SecaoFormulario } from './componentes/secao-formulario';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number | null;
  atividade: string | null;
  conceitoFinal: string | null;
  aprovado: boolean | null;
}

const letraParaAtividadeObrigatorio = (atividade: string | null): boolean | null => {
  if (atividade === 'S') return true;
  if (atividade === 'N') return false;
  return null;
};

const formatarData = (data: any) => {
  if (!data) return null;
  return dayjs(data).format('YYYY-MM-DD');
};

const CadastroCodafSuplementar: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [cursistas] = useState<CursistaDTO[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  const [turmas, setTurmas] = useState<PropostaTurmaComCodafDTO[]>([]);
  const [status] = useState<number | null>(null);
  const [codafId, setCodafId] = useState<number | null>(null);

  const modoEdicao = !!id;
  const formOriginal = React.useRef<any>(null);
  const cursistasOriginais = React.useRef<CursistaDTO[]>([]);

  const situacao = {
    iniciado: status === 1,
    aguardando: status === 2,
    finalizado: status === 3,
  };

  const bloqueios = {
    campos: {
      secaoFormulario: {
        numeroHomologacao: situacao.finalizado,
        turma: situacao.finalizado,
      },
      informacoesAdicionais: situacao.finalizado,
    },
    botoes: {
      salvar: {
        visivel: true,
        bloqueado: false,
      },
      excluir: {
        visivel: true,
        bloqueado: false,
      },
    },
  };

  React.useEffect(() => {
    const carregarDados = async () => {
      if (!id) return;
      // TODO: Implementar lógica de busca pelo ID se necessário
    };

    carregarDados();
  }, [id, form, navigate]);

  const buscarCodafOriginal = async () => {
    if (!codafId) return;

    setLoading(true);
    try {
      const response = await obterCodafOriginal(codafId);
      if (response.sucesso && response.dados) {
        const dados = response.dados;
        form.setFieldsValue({
          numeroHomologacao: dados.numeroHomologacao,
          nomeFormacao: dados.nomeFormacao,
          codigoFormacao: dados.codigoFormacao,
          turmaId: dados.propostaTurmaId,
          numeroComunicado: dados.numeroComunicado,
          dataPublicacao: dados.dataPublicacao ? dayjs(dados.dataPublicacao) : null,
          paginaComunicado: dados.paginaComunicadoDom,
          dataPublicacaoDiarioOficial: dados.dataPublicacaoDom
            ? dayjs(dados.dataPublicacaoDom)
            : null,
          codigoCursoEol: dados.codigoCursoEol,
          codigoNivel: dados.codigoNivel,
          observacao: dados.observacao || '',
          codafId: dados.codafId,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CODAF original:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    buscarCodafOriginal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codafId]);

  const handleTurmaChange = (selectedTurmaId: number) => {
    const turmaSeleciona = turmas.find((turma) => turma.id === selectedTurmaId);

    if (turmaSeleciona) {
      setCodafId(turmaSeleciona.codafId);
    } else {
      setCodafId(null);
    }
  };

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText || searchText.length < 0) {
      setOpcoesFormacao([]);
      return;
    }

    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacaoComCodaf(searchText);
      if (response?.sucesso && response.dados?.items) {
        const itemsList = [...response.dados.items];
        itemsList.sort((a, b) => a.numeroHomologacao - b.numeroHomologacao);
        
        setOpcoesFormacao(itemsList);
      } else {
        setOpcoesFormacao([]);
      }
    } catch (error) {
      console.error('Erro ao buscar formações:', error);
      setOpcoesFormacao([]);
    } finally {
      setLoadingAutocomplete(false);
    }
  };

  const onSelectFormacao = async (_value: string, option: any) => {
    const proposta = opcoesFormacao.find((p) => p.propostaId === option.propostaId);
    if (proposta) {
      setPropostaSelecionada(proposta);
      form.setFieldsValue({
        numeroHomologacao: proposta.numeroHomologacao,
        nomeFormacao: proposta.nomeFormacao,
        codigoFormacao: proposta.codigoFormacao,
        turmaId: undefined,
        codafId: undefined,
      });

      try {
        const response = await obterPropostasTurmasComCodaf(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmas(response.dados);
        } else {
          setTurmas([]);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmas([]);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar turmas da formação',
        });
      }
    }
  };

  const exibirErroSalvar = (error: any) => {
    const mensagemPadraoErro = modoEdicao
      ? 'Erro ao atualizar o registro'
      : 'Erro ao salvar o registro';
    const mensagemErro =
      error?.response?.data?.erros?.[0] ??
      error?.response?.data?.mensagens?.[0] ??
      error?.message ??
      mensagemPadraoErro;

    notification.error({ message: 'Erro', description: mensagemErro });
  };

  const montarPayloadSalvar = (values: any, inscritosOverride?: CursistaDTO[]) => {
    const anexosMapeados =
      values.anexos?.map((arquivo: any) => ({
        arquivoCodigo: arquivo.response?.codigo ?? arquivo.arquivoCodigo,
        nomeArquivo: arquivo.name || arquivo.nomeArquivo,
        tipoAnexoId: 3,
      })) ?? [];

    const inscritosBase = Array.isArray(inscritosOverride) ? inscritosOverride : cursistas;

    return {
      propostaId: propostaSelecionada?.propostaId || 0,
      propostaTurmaId: values.turmaId || 0,
      dataPublicacao: formatarData(values.dataPublicacao),
      dataPublicacaoDom: formatarData(values.dataPublicacaoDiarioOficial),
      numeroComunicado: Number(values.numeroComunicado) || 0,
      paginaComunicadoDom: Number(values.paginaComunicado) || 0,
      codigoCursoEol: Number(values.codigoCursoEol) || null,
      codigoNivel: Number(values.codigoNivel) || null,
      observacao: values.observacao || '',
      inscritos: inscritosBase.map((cursista) => ({
        inscricaoId: cursista.id,
        percentualFrequencia: cursista.frequencia ?? null,
        conceitoFinal: cursista.conceitoFinal ?? null,
        atividadeObrigatorio: letraParaAtividadeObrigatorio(cursista.atividade),
        aprovado: cursista.aprovado ?? null,
      })),
      anexos: anexosMapeados,
      codafId: codafId ?? 0,
    };
  };

  const tratarRespostaSalvar = (response: any) => {
    if (response.sucesso) {
      formOriginal.current = structuredClone(form.getFieldsValue());
      cursistasOriginais.current = structuredClone(cursistas);
      
      notification.success({
        message: 'Sucesso',
        description: modoEdicao
          ? 'Registro atualizado com sucesso!'
          : 'Registro salvo com sucesso!',
      });
      if (!id) {
        navigate(ROUTES.CODAF_SUPLEMENTAR);
      }
    } else {
      const mensagensErro = response.mensagens ?? [];
      const mensagemPadrao = modoEdicao
        ? 'Erro ao atualizar o registro'
        : 'Erro ao salvar o registro';
      const mensagemDetalhada =
        mensagensErro.length > 0 ? mensagensErro.join(', ') : mensagemPadrao;
      console.error('Erro da API:', mensagensErro);
      notification.error({ message: 'Erro ao salvar', description: mensagemDetalhada });
    }
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]) => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const dados = montarPayloadSalvar(values, inscritosOverride);

      console.log('Dados enviados para API:', JSON.stringify(dados, null, 2));

      const response = await criarCodafSuplementar(dados);
      tratarRespostaSalvar(response);
    } catch (error: any) {
      exibirErroSalvar(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR });
  };

  const onClickExcluir = () => {};

  return (
    <Col>
      <HeaderPage title='CODAF Suplementar'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            {bloqueios.botoes.excluir.visivel && (
              <Col>
                <Button
                  type='default'
                  disabled={bloqueios.botoes.excluir.bloqueado}
                  onClick={onClickExcluir}
                  id={CF_BUTTON_EXCLUIR}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Excluir
                </Button>
              </Col>
            )}
            {bloqueios.botoes.salvar.visivel && (
              <Col>
                <Button
                  disabled={bloqueios.botoes.salvar.bloqueado}
                  type='default'
                  onClick={onClickCancelar}
                  id={CF_BUTTON_CANCELAR}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Cancelar
                </Button>
              </Col>
            )}
            {bloqueios.botoes.salvar.visivel && (
              <Col>
                <Button
                  type='primary'
                  onClick={() => onClickSalvar()}
                  loading={loading}
                  id={CF_BUTTON_SALVAR}
                  style={{ fontWeight: 700 }}
                >
                  Salvar
                </Button>
              </Col>
            )}
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div
                style={{
                  paddingBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  Aqui você cria um novo CODAF Suplementar. Preencha todas as informações antes de
                  salvar.
                </div>
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            loadingAutocomplete={loadingAutocomplete}
            turmas={turmas}
            camposBloqueados={bloqueios.campos.secaoFormulario}
            onChangeTurma={handleTurmaChange}
          />

          <Row gutter={[16, 8]} style={{ marginTop: 32 }}>
            <Col span={24}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '100%',
                  color: '#42474A',
                  marginBottom: 8,
                }}
              >
                Informações adicionais
              </div>
              <p style={{ marginBottom: 16 }}>
                Insira demais informações importantes para o registro. Este é um campo opcional.
              </p>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Form.Item name='observacao'>
                <Input.TextArea
                  rows={4}
                  placeholder='Digite as informações adicionais...'
                  maxLength={500}
                  disabled={bloqueios.campos.informacoesAdicionais}
                />
              </Form.Item>
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};

export default CadastroCodafSuplementar;
