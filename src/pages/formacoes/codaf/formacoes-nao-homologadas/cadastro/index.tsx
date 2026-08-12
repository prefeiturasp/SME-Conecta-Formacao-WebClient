import { Col, Form, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SecaoListaInscritos } from './componentes/secao-lista-inscritos';
import { SecaoFormulario } from './componentes/secao-formulario';
import { TableRowSelection } from 'antd/lib/table/interface';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import { ROUTES } from '~/core/enum/routes-enum';
import {  
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
} from '~/core/services/codaf-lista-presenca-service';
import { obterDetalhesPropostaComTurmasPorId, PropostaTurmaDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { onClickVoltar } from '~/core/utils/form';
import {
  atualizarCodafNaoHomologado,
  CodafNaoHomologadoDetalheDTO,
  criarCodafNaoHomologado,
  excluirCodafNaoHomologado,
  obterCodafNaoHomologadoPorId,
  obterInscritosTurma,
} from '~/core/services/codaf-nao-homologado-service';
import ModalExcluir from '../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir';
import { BannerDownloadTermo } from '../../lista-presenca-codaf/cadastro/componentes/banner-download-termo';
import { SecaoAnexos } from '../../lista-presenca-codaf/cadastro/componentes/secao-anexos';
import { useCodafComum } from '~/core/hooks/use-codaf-comum';
import { usePerfilCodaf } from '~/core/hooks/use-perfil-codaf';
import { useTabelaInscritos } from '~/core/hooks/use-tabela-inscritos';
import { SecaoInformacoesAdicionais } from '../../shared/componentes/secao-informacoes-adicionais';
import { useExclusaoCodaf } from '~/core/hooks/use-exclusao-codaf';
import { BotoesAcaoCodaf } from '../../shared/componentes/botoes-acao-codaf';
import { criarColunasCodafNaoHomologado } from '../../shared/componentes/codaf-colunas-factory';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  participou: boolean | null;
}

const CadastroCodafFormacoesNaoHomologadas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
    
  const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = usePerfilCodaf();
  const { mapearAnexosParaFormulario, onBaixarModelo, onDownloadAnexo, exibirErroSalvar } = useCodafComum();
    const {
    modalExcluirVisible,
    loadingExclusao,
    onClickExcluir,
    cancelarExclusao,
    confirmarExclusao,
  } = useExclusaoCodaf(excluirCodafNaoHomologado, ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
  

  const {
    cursistas, setCursistas,
    cursistasSelecionadosIds, setCursistasSelecionadosIds,
    paginaAtualInscritos, setPaginaAtualInscritos,
    registrosPorPaginaInscritos,
    totalRegistrosInscritos, setTotalRegistrosInscritos,
    handleTableChangeInscritos,
  } = useTabelaInscritos<CursistaDTO>();

  const [turmasFiltradas, setTurmasFiltradas] = useState<PropostaTurmaDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const formOriginal = React.useRef<any>(null);
  const cursistasOriginais = React.useRef<CursistaDTO[]>([]);

  const modoEdicao = !!id;

  const situacao = {
    iniciado: status === 1,

    aguardandoFinalizacao: status === 2,

    finalizado: status === 3,
  };

  const bloqueios = {
    campos: {
      secaoFormulario: {
        numeroHomologacao: situacao.finalizado,
        turma: situacao.finalizado,
      },

      listaInscritos: situacao.finalizado,

      informacoesAdicionais: situacao.finalizado && ehAreaPromotora,
    },

    anexos: {
      areaPromotora: situacao.finalizado && !perfil.cursista && !perfil.admin,
    },

    botoes: {
      excluir: {
        visivel: modoEdicao && situacao.iniciado,

        bloqueado: situacao.finalizado,
      },

      salvar: {
        visivel:
          (!situacao.aguardandoFinalizacao ||
            (situacao.aguardandoFinalizacao && ehAreaPromotoraEAdmin)) &&
          !situacao.finalizado,

        bloqueado: situacao.finalizado,
      },
    },
  };

  const turmaId = Form.useWatch('turmaId', form);

  React.useEffect(() => {
    const aplicarCamposFormulario = (dados: CodafNaoHomologadoDetalheDTO) => {
      form.setFieldsValue({
        numeroHomologacao: dados.numeroHomologacao,
        nomeFormacao: dados.nomeFormacao,
        codigoFormacao: dados.codigoFormacao,
        turmaId: dados.propostaTurmaId,
        observacao: dados.observacao || '',
      });

      if (dados.anexos && dados.anexos.length > 0) {
        form.setFieldsValue({
          anexos: mapearAnexosParaFormulario(dados.anexos),
        });
      }
    };

    const carregarTurmas = async (dados: CodafNaoHomologadoDetalheDTO) => {
      try {
        const turmasResponse = await obterTurmasInscricao(dados.propostaId);
        if (!turmasResponse.sucesso || !turmasResponse.dados) return;

        setTurmaDisabled(!!dados.propostaTurmaId);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      }
    };

    const carregarDados = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const response = await obterCodafNaoHomologadoPorId(Number(id));

        if (!response.sucesso || !response.dados) {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] ?? 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
          return;
        }

        const dados = response.dados;
        setRegistroId(dados.id);
        setStatus(dados.status);

        aplicarCamposFormulario(dados);

        await carregarTurmas(dados);

        setTimeout(() => {
          formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
        }, 100);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        notification.error({
          message: 'Erro',
          description: 'Erro ao carregar dados do registro',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, form, navigate]);

  const buscarInscritos = async () => {
    if (!turmaId) {
      setCursistas([]);
      setTotalRegistrosInscritos(0);
      setPaginaAtualInscritos(1);
      return;
    }

    setLoading(true);
    try {
      const response = await obterInscritosTurma(turmaId, 1, 99999);
      if (response.sucesso && response.dados) {
        const inscritosFormatados = response.dados.items.map((inscrito) => ({
          id: inscrito.id,
          rfOuCpf: inscrito.documento,
          nomeCursista: inscrito.nome,
          participou: inscrito.participou ?? null,
        }));
        setCursistas(inscritosFormatados);
        setTotalRegistrosInscritos(response.dados.totalRegistros || 0);
        setPaginaAtualInscritos(1);
        setTimeout(() => {
          cursistasOriginais.current = JSON.parse(JSON.stringify(inscritosFormatados));
        }, 100);
      } else {
        setCursistas([]);
        setTotalRegistrosInscritos(0);
        notification.warning({
          message: 'Atenção',
          description: 'Nenhum inscrito encontrado para esta turma',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar inscritos:', error);
      setCursistas([]);
      setTotalRegistrosInscritos(0);
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar inscritos da turma',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    buscarInscritos();
  }, [turmaId]);

  React.useEffect(() => {
    if (turmaId) {
      buscarInscritos();
    }
  }, [registrosPorPaginaInscritos]);  
  
  const onChangeParticipou = useCallback((id: number, valor: boolean) => {
    setCursistas(prev => prev.map(c => c.id === id ? { ...c, participou: valor } : c));
  }, [setCursistas]);
  const colunasCursistas = criarColunasCodafNaoHomologado(
    paginaAtualInscritos, 
    registrosPorPaginaInscritos, 
    bloqueios.campos.listaInscritos, 
    onChangeParticipou
  );

  const rowSelection: TableRowSelection<CursistaDTO> = {
    selectedRowKeys: cursistasSelecionadosIds,
    onChange: (selectedRowKeys) => {
      setCursistasSelecionadosIds(selectedRowKeys as number[]);
    },
    preserveSelectedRowKeys: true,
    getCheckboxProps: () => ({
      disabled: bloqueios.campos.listaInscritos,
    }),
  };

  const onChangeCodigoFormacao = () => {
    setTurmasFiltradas([]);
    setTurmaDisabled(true);
  }

  const onBlurCodigoFormacao = async (_value: string) => {
    const valor = _value.replace(/\D/g, '');

    if (valor.length < 1) {
      setTurmasFiltradas([]);
      setTurmaDisabled(true);
      return;
    }

    try {
        const response = await obterDetalhesPropostaComTurmasPorId(Number(valor), false);
        if (response.sucesso && response.dados) {
            form.setFieldsValue({
                nomeFormacao: response.dados.nomeFormacao,
                codigoFormacao: response.dados.id,
                numeroHomologacao: response.dados.numeroFormacao,
            });

            if (response.dados.turmas && response.dados.turmas.length > 0) {
                setTurmasFiltradas(response.dados.turmas);
                setTurmaDisabled(false);
            } else {
            setTurmasFiltradas([]);
            setTurmaDisabled(true);
            notification.warning({
                message: 'Atenção',
                description: 'Nenhuma turma encontrada para esta formação',
            });
            }
        } else {
            setTurmasFiltradas([]);
            setTurmaDisabled(true);
            notification.info({
                message: 'Informação',
                description: 'Formação não encontrada',
            });
            form.setFieldsValue({
                nomeFormacao: '',
                numeroHomologacao: '',
                turmaId: undefined,
            });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.warning({
            message: 'Atenção',
            description: 'Erro ao buscar detalhes da formação',
        });
        form.setFieldsValue({
            nomeFormacao: '',
            numeroHomologacao: '',
            turmaId: undefined,
        });
      }
  };

  const tratarRespostaSalvar = (response: any) => {
    if (response.sucesso) {
      formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
      cursistasOriginais.current = JSON.parse(JSON.stringify(cursistas));
      notification.success({
        message: 'Sucesso',
        description: modoEdicao
          ? 'Registro atualizado com sucesso!'
          : 'Registro salvo com sucesso!',
      });
      if (!id) {
        navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
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

  const recarregarAnexos = async (registroIdAtual: number) => {
    const detalhes = await obterCodafNaoHomologadoPorId(registroIdAtual);
    if (detalhes.sucesso && detalhes.dados?.anexos) {
      form.setFieldsValue({ anexos: mapearAnexosParaFormulario(detalhes.dados.anexos) });
    }
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
      propostaId: values.codigoFormacao || 0,
      propostaTurmaId: values.turmaId || 0,
      observacao: values.observacao || '',
      inscritos: inscritosBase.map((cursista) => ({
        inscricaoId: cursista.id,
        participou: cursista.participou ?? null,
      })),
      anexos: anexosMapeados,
    };
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]): Promise<boolean> => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const dados = montarPayloadSalvar(values, inscritosOverride);

      const response = modoEdicao
        ? await atualizarCodafNaoHomologado(registroId ?? 0, dados)
        : await criarCodafNaoHomologado(dados);

      tratarRespostaSalvar(response);

      if (response.sucesso) {
        const registroIdAtual = registroId ?? response.dados?.id;

        if (registroIdAtual) {
          await recarregarAnexos(Number(registroIdAtual));
        }

        if (inscritosOverride) {
          setCursistas(inscritosOverride);
        }

        return true;
      }

      return false;
    } catch (error: any) {
      exibirErroSalvar(error, modoEdicao);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO });
  };

  return (
    <Col>
      <HeaderPage title='CODAF não homologados'>
        <Col span={24}>
          <BotoesAcaoCodaf
            bloqueiosBotoes={bloqueios.botoes}
            loading={loading}
            onClickVoltar={onClickCancelar}
            onClickExcluir={onClickExcluir}
            onClickCancelar={onClickCancelar}
            onClickSalvar={() => onClickSalvar()}
          />
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
                  Aqui você cria um novo CODAF não homologado. Preencha todas as informações antes
                  de salvar as informações.
                </div>
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            onChangeCodigoFormacao={onChangeCodigoFormacao}
            onBlurCodigoFormacao={onBlurCodigoFormacao}
            turmasFiltradas={turmasFiltradas}
            turmaDisabled={turmaDisabled}
            camposBloqueados={bloqueios.campos.secaoFormulario}
          />
          <SecaoListaInscritos
            colunasCursistas={colunasCursistas}
            cursistas={cursistas}
            paginaAtualInscritos={paginaAtualInscritos}
            registrosPorPaginaInscritos={registrosPorPaginaInscritos}
            totalRegistrosInscritos={totalRegistrosInscritos}
            handleTableChangeInscritos={handleTableChangeInscritos}
            rowSelection={rowSelection}
          />          
          <SecaoAnexos
            form={form}
            podeGerenciarAnexos={!perfil.cursista}
            onDownloadAnexo={onDownloadAnexo}
            fazerUploadAnexoCodaf={fazerUploadAnexoCodaf}
            obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
            bloqueado={bloqueios.anexos.areaPromotora}
          />

          <BannerDownloadTermo onBaixarModelo={onBaixarModelo} />
          
          <SecaoInformacoesAdicionais disabled={bloqueios.campos.informacoesAdicionais} />
        </CardContent>
      </Form>

      <ModalExcluir
        visible={modalExcluirVisible}
        onConfirm={() => confirmarExclusao(registroId)}
        onCancel={cancelarExclusao}
        loading={loading || loadingExclusao}
      />
    </Col>
  );
};

export default CadastroCodafFormacoesNaoHomologadas;
