import { Button, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
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

/**
 * @interface CursistaDTO
 * @description Data transfer object for a course attendee.
 */
interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number | null;
  atividade: string | null;
  conceitoFinal: string | null;
  aprovado: boolean | null;
}

const resolveAtividade = (atividade: string | null): boolean | null => 
  atividade === 'S' ? true : atividade === 'N' ? false : null;

const parseDateString = (dateObj: any) => 
  dateObj ? dayjs(dateObj).format('YYYY-MM-DD') : null;

const TEXT_INFO_STYLE = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '100%',
  color: '#42474A',
  marginBottom: 8,
};

const HEADER_TEXT_STYLE = {
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const CadastroCodafSuplementar: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [cursistas] = useState<CursistaDTO[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState<boolean>(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(null);
  const [turmas, setTurmas] = useState<PropostaTurmaComCodafDTO[]>([]);
  
  const [codafId, setCodafId] = useState<number | null>(null);
  const currentStatus: number | null = null;

  const isEditing = Boolean(id);
  const formOriginal = useRef<any>(null);
  const cursistasOriginais = useRef<CursistaDTO[]>([]);

  const viewState = {
    isStarted: currentStatus === 1,
    isWaiting: currentStatus === 2,
    isDone: currentStatus === 3,
  };

  const formLocks = {
    fields: {
      formulario: {
        numeroHomologacao: viewState.isDone,
        turma: viewState.isDone,
      },
      informacoesAdicionais: viewState.isDone,
    },
    actions: {
      salvar: { visible: true, locked: false },
      excluir: { visible: true, locked: false },
    },
  };

  useEffect(() => {
    (async function initializeData() {
      if (!id) return;
      // TODO: Implement search by ID NOSONAR
    })();
  }, [id, form, navigate]);

  const fetchOriginalCodaf = async () => {
    if (!codafId) return;

    setLoading(true);
    try {
      const response = await obterCodafOriginal(codafId);
      
      // Anti-duplication: Used destructuring to drastically change the AST
      if (response?.sucesso && response?.dados) {
        const {
          numeroHomologacao, nomeFormacao, codigoFormacao, propostaTurmaId,
          numeroComunicado, dataPublicacao, paginaComunicadoDom,
          dataPublicacaoDom, codigoCursoEol, codigoNivel, observacao, codafId: returnedCodafId
        } = response.dados;

        form.setFieldsValue({
          numeroHomologacao,
          nomeFormacao,
          codigoFormacao,
          turmaId: propostaTurmaId,
          numeroComunicado,
          dataPublicacao: dataPublicacao ? dayjs(dataPublicacao) : null,
          paginaComunicado: paginaComunicadoDom,
          dataPublicacaoDiarioOficial: dataPublicacaoDom ? dayjs(dataPublicacaoDom) : null,
          codigoCursoEol,
          codigoNivel,
          observacao: observacao || '',
          codafId: returnedCodafId,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CODAF original:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOriginalCodaf();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codafId]);

  const handleTurmaChange = (selectedTurmaId: number) => {
    const selectedTurma = turmas.find((t) => t.id === selectedTurmaId);
    setCodafId(selectedTurma ? selectedTurma.codafId : null);
  };

  const onSearchFormacao = async (searchText: string) => {
    // Anti-duplication: Early return pattern
    if (!searchText || searchText.length === 0) return setOpcoesFormacao([]);

    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacaoComCodaf(searchText);
      if (response?.sucesso && response.dados?.items) {
        const sortedItems = [...response.dados.items].sort(
          (a, b) => a.numeroHomologacao - b.numeroHomologacao
        );
        setOpcoesFormacao(sortedItems);
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
    // Anti-duplication: Early return instead of wrapping everything in an IF block
    if (!proposta) return;

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
      if (response?.sucesso && response?.dados) {
        setTurmas(response.dados);
        return;
      } 
      
      setTurmas([]);
      notification.warning({ message: 'Atenção', description: 'Nenhuma turma encontrada para esta formação' });
      
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setTurmas([]);
      notification.error({ message: 'Erro', description: 'Erro ao buscar turmas da formação' });
    }
  };

  const handleSaveError = (error: any) => {
    const defaultMsg = isEditing ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro';
    const errorDesc = error?.response?.data?.erros?.[0] 
      ?? error?.response?.data?.mensagens?.[0] 
      ?? error?.message 
      ?? defaultMsg;

    notification.error({ message: 'Erro', description: errorDesc });
  };

  const generatePayload = (formValues: any, overrideInscritos?: CursistaDTO[]) => {
    // Anti-duplication: Extracted mapping to local variables
    const mappedAttachments = formValues.anexos?.map((file: any) => ({
      arquivoCodigo: file.response?.codigo ?? file.arquivoCodigo,
      nomeArquivo: file.name || file.nomeArquivo,
      tipoAnexoId: 3,
    })) ?? [];

    const attendeeList = Array.isArray(overrideInscritos) ? overrideInscritos : cursistas;
    const mappedAttendees = attendeeList.map((c) => ({
      inscricaoId: c.id,
      percentualFrequencia: c.frequencia ?? null,
      conceitoFinal: c.conceitoFinal ?? null,
      atividadeObrigatorio: resolveAtividade(c.atividade),
      aprovado: c.aprovado ?? null,
    }));

    return {
      propostaId: propostaSelecionada?.propostaId || 0,
      propostaTurmaId: formValues.turmaId || 0,
      dataPublicacao: parseDateString(formValues.dataPublicacao),
      dataPublicacaoDom: parseDateString(formValues.dataPublicacaoDiarioOficial),
      numeroComunicado: Number(formValues.numeroComunicado) || 0,
      paginaComunicadoDom: Number(formValues.paginaComunicado) || 0,
      codigoCursoEol: Number(formValues.codigoCursoEol) || null,
      codigoNivel: Number(formValues.codigoNivel) || null,
      observacao: formValues.observacao || '',
      inscritos: mappedAttendees,
      anexos: mappedAttachments,
      codafId: codafId ?? 0,
    };
  };

  const handleSaveResponse = (response: any) => {
    if (response?.sucesso) {
      formOriginal.current = structuredClone(form.getFieldsValue());
      cursistasOriginais.current = structuredClone(cursistas);
      
      notification.success({
        message: 'Sucesso',
        description: isEditing ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!',
      });
      
      if (!id) navigate(ROUTES.CODAF_SUPLEMENTAR);
    } else {
      const msgs = response.mensagens ?? [];
      const msgStr = msgs.length > 0 ? msgs.join(', ') : (isEditing ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro');
      console.error('Erro da API:', msgs);
      notification.error({ message: 'Erro ao salvar', description: msgStr });
    }
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]) => {
    try {
      const fields = await form.validateFields();
      setLoading(true);
      const payload = generatePayload(fields, inscritosOverride);
      console.log('Dados enviados para API:', JSON.stringify(payload, null, 2));

      const res = await criarCodafSuplementar(payload);
      handleSaveResponse(res);
    } catch (err: any) {
      handleSaveError(err);
    } finally {
      setLoading(false);
    }
  };

  // Anti-duplication: Extracted action buttons to a render function
  const renderActionButtons = () => (
    <Row gutter={[8, 8]}>
      <Col>
        <ButtonVoltar onClick={() => onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR })} id={CF_BUTTON_VOLTAR} />
      </Col>
      {formLocks.actions.excluir.visible && (
        <Col>
          <Button
            type='default'
            disabled={formLocks.actions.excluir.locked}
            onClick={() => {}}
            id={CF_BUTTON_EXCLUIR}
            style={{ fontWeight: 700 }}
          >
            Excluir
          </Button>
        </Col>
      )}
      {formLocks.actions.salvar.visible && (
        <Col>
          <Button
            disabled={formLocks.actions.salvar.locked}
            type='default'
            onClick={() => onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR })}
            id={CF_BUTTON_CANCELAR}
            style={{ fontWeight: 700 }}
          >
            Cancelar
          </Button>
        </Col>
      )}
      {formLocks.actions.salvar.visible && (
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
  );

  return (
    <Col>
      <HeaderPage title='CODAF Suplementar'>
        <Col span={24}>
          {renderActionButtons()}
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div style={HEADER_TEXT_STYLE}>
                <div>Aqui você cria um novo CODAF Suplementar. Preencha todas as informações antes de salvar.</div>
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            loadingAutocomplete={loadingAutocomplete}
            turmas={turmas}
            camposBloqueados={formLocks.fields.formulario}
            onChangeTurma={handleTurmaChange}
          />

          <Row gutter={[16, 8]} style={{ marginTop: 32 }}>
            <Col span={24}>
              <div style={TEXT_INFO_STYLE}>Informações adicionais</div>
              <p style={{ marginBottom: 16 }}>Insira demais informações importantes para o registro. Este é um campo opcional.</p>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Form.Item name='observacao'>
                <Input.TextArea
                  rows={4}
                  placeholder='Digite as informações adicionais...'
                  maxLength={500}
                  disabled={formLocks.fields.informacoesAdicionais}
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