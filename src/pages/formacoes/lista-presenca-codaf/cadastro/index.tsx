import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalEnviarDF from './componentes/modal-enviar-df/modal-enviar-df';
import ModalDevolverDF from './componentes/modal-devolver-df/modal-devolver-df';
import ModalExcluir from './componentes/modal-excluir/modal-excluir';
import ModalComentario from './componentes/modal-comentario/modal-comentario';
import SecaoRetificacoes from './componentes/secao-retificacoes/secao-retificacoes';
import { BannerDownloadTermo } from './componentes/banner-download-termo';
import { SecaoAnexos } from './componentes/secao-anexos';
import { SecaoListaInscritos } from './componentes/secao-lista-inscritos';
import { SecaoFormulario } from './componentes/secao-formulario';
import { BannerComentarios } from './componentes/banner-comentarios';

dayjs.locale('pt-br');
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
  atualizarCodafListaPresenca,
  baixarModeloTermoResponsabilidade,
  ComentarioCodafDTO,
  criarCodafListaPresenca,
  devolverCodafParaCorrecao,
  enviarCodafParaDF,
  excluirCodafListaPresenca,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
  obterCodafListaPresencaPorId,
  obterInscritosTurma,
  verificarTurmaPossuiLista,
} from '~/core/services/codaf-lista-presenca-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { downloadBlob } from '~/core/utils/functions';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number | null;
  atividade: string | null;
  conceitoFinal: string | null;
  aprovado: boolean | null;
}

const CadastroListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);
  const [loading, setLoading] = useState(false);
  const [cursistas, setCursistas] = useState<CursistaDTO[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  const [turmas, setTurmas] = useState<RetornoListagemDTO[]>([]);
  const [turmasFiltradas, setTurmasFiltradas] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [formValido, setFormValido] = useState(false);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [paginaAtualInscritos, setPaginaAtualInscritos] = useState(1);
  const [totalRegistrosInscritos, setTotalRegistrosInscritos] = useState(0);
  const [registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos] = useState(10);
  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [todasTurmasPossuemLista, setTodasTurmasPossuemLista] = useState(false);
  const [retificacoes, setRetificacoes] = useState<number[]>([1]);
  const [contadorRetificacoes, setContadorRetificacoes] = useState(1);
  const [retificacoesOriginais, setRetificacoesOriginais] = useState<
    Map<number, { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }>
  >(new Map());
  const [mostrarDivergencia, setMostrarDivergencia] = useState(false);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [comentario, setComentario] = useState<ComentarioCodafDTO | null>(null);
  const [modalEnviarDFVisible, setModalEnviarDFVisible] = useState(false);
  const [modalDevolverDFVisible, setModalDevolverDFVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [modalComentarioVisible, setModalComentarioVisible] = useState(false);
  const formOriginal = React.useRef<any>(null);
  const cursistasOriginais = React.useRef<CursistaDTO[]>([]);

  const modoEdicao = !!id;
  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const ehAreaPromotora = ehPerfilDF || ehPerfilEMFORPEF;
  const ehPerfilAdmin = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

  const podeGerenciarAnexos = ehPerfilDF || ehPerfilEMFORPEF;
  const mostrarBotaoExcluir = modoEdicao && status === 1;
  const mostrarBotaoEnviarDF =
    (status === 1 || status === null || status === 3) && ehAreaPromotora == true;
  const mostrarBotaoDevolverDF = status === 2 && ehPerfilAdmin == true;

  const numeroHomologacao = Form.useWatch('numeroHomologacao', form);
  const nomeFormacao = Form.useWatch('nomeFormacao', form);
  const codigoFormacao = Form.useWatch('codigoFormacao', form);
  const turmaId = Form.useWatch('turmaId', form);
  const numeroComunicado = Form.useWatch('numeroComunicado', form);
  const paginaComunicado = Form.useWatch('paginaComunicado', form);
  const codigoCursoEol = Form.useWatch('codigoCursoEol', form);
  const codigoNivel = Form.useWatch('codigoNivel', form);
  const dataPublicacao = Form.useWatch('dataPublicacao', form);
  const dataPublicacaoDiarioOficial = Form.useWatch('dataPublicacaoDiarioOficial', form);

  React.useEffect(() => {
    const camposBasicosPreenchidos =
      numeroHomologacao &&
      nomeFormacao &&
      codigoFormacao &&
      turmaId &&
      numeroComunicado &&
      paginaComunicado &&
      dataPublicacao &&
      dataPublicacaoDiarioOficial;

    const todosPreenchidos = ehAreaPromotora
      ? camposBasicosPreenchidos
      : camposBasicosPreenchidos && codigoCursoEol && codigoNivel;

    setFormValido(!!todosPreenchidos);
  }, [
    numeroHomologacao,
    nomeFormacao,
    codigoFormacao,
    turmaId,
    numeroComunicado,
    paginaComunicado,
    codigoCursoEol,
    codigoNivel,
    ehAreaPromotora,
    dataPublicacao,
    dataPublicacaoDiarioOficial,
  ]);

  React.useEffect(() => {
    const carregarDados = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const response = await obterCodafListaPresencaPorId(Number(id));

        if (response.sucesso && response.dados) {
          const dados = response.dados;
          setRegistroId(dados.id);
          setStatus(dados.status);

          if (dados.comentario) {
            setComentario(dados.comentario);
            setMostrarBanner(true);
          }

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
          });

          if (dados.anexos && dados.anexos.length > 0) {
            const anexosCarregados = dados.anexos.map((anexo) => ({
              uid: anexo.arquivoCodigo,
              name: anexo.nomeArquivo,
              status: 'done',
              xhr: anexo.arquivoCodigo,
              arquivoCodigo: anexo.arquivoCodigo,
              nomeArquivo: anexo.nomeArquivo,
              tipoAnexoId: anexo.tipoAnexoId,
              urlDownload: anexo.urlDownload,
            }));
            form.setFieldsValue({
              anexos: anexosCarregados,
            });
          }

          if (dados.retificacoes && dados.retificacoes.length > 0) {
            const numerosRetificacoes = dados.retificacoes.map((_, index) => index + 1);
            setRetificacoes(numerosRetificacoes);
            setContadorRetificacoes(dados.retificacoes.length);

            const mapaRetificacoes = new Map<
              number,
              { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }
            >();
            dados.retificacoes.forEach((retificacao, index) => {
              mapaRetificacoes.set(index + 1, retificacao);
            });
            setRetificacoesOriginais(mapaRetificacoes);

            dados.retificacoes.forEach((retificacao, index) => {
              const numeroFormatado = (index + 1).toString().padStart(2, '0');
              form.setFieldsValue({
                [`dataRetificacao${numeroFormatado}`]: retificacao.dataRetificacao
                  ? dayjs(retificacao.dataRetificacao)
                  : null,
                [`paginaRetificacao${numeroFormatado}`]: retificacao.paginaRetificacaoDom,
              });
            });
          }

          // Define a proposta selecionada
          setPropostaSelecionada({
            propostaId: dados.propostaId,
            numeroHomologacao: dados.numeroHomologacao,
            nomeFormacao: dados.nomeFormacao,
            codigoFormacao: dados.codigoFormacao,
          });

          try {
            const turmasResponse = await obterTurmasInscricao(dados.propostaId);
            if (turmasResponse.sucesso && turmasResponse.dados) {
              setTurmas(turmasResponse.dados);
              console.log(turmas);

              const turmaSelecionada = turmasResponse.dados.find(
                (t) => t.id === dados.propostaTurmaId,
              );
              const turmasDisponiveis: RetornoListagemDTO[] = [];

              if (turmaSelecionada) {
                turmasDisponiveis.push(turmaSelecionada);
              }

              for (const turma of turmasResponse.dados) {
                if (turma.id === dados.propostaTurmaId) continue;

                try {
                  const possuiLista = await verificarTurmaPossuiLista(turma.id, dados.id || 0);
                  if (possuiLista.sucesso && possuiLista.dados === false) {
                    turmasDisponiveis.push(turma);
                  }
                } catch (error) {
                  console.error(`Erro ao verificar turma ${turma.id}:`, error);
                }
              }

              setTurmasFiltradas(turmasDisponiveis);
              setTurmaDisabled(false);
              setTooltipAberto(false);
              setTodasTurmasPossuemLista(false);
            }
          } catch (error) {
            console.error('Erro ao buscar turmas:', error);
          }

          setTimeout(() => {
            formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
          }, 100);
        } else {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] || 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.LISTA_PRESENCA_CODAF);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        notification.error({
          message: 'Erro',
          description: 'Erro ao carregar dados do registro',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
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
          rfOuCpf: inscrito.cpf,
          nomeCursista: inscrito.nome,
          frequencia: inscrito.percentualFrequencia ?? null,
          atividade:
            inscrito.atividadeObrigatorio !== undefined && inscrito.atividadeObrigatorio !== null
              ? inscrito.atividadeObrigatorio
                ? 'S'
                : 'N'
              : null,
          conceitoFinal: inscrito.conceitoFinal ?? null,
          aprovado: inscrito.aprovado ?? null,
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

  const handleCursistaChange = (id: number, field: keyof CursistaDTO, value: any) => {
    setCursistas((prev) =>
      prev.map((cursista) => (cursista.id === id ? { ...cursista, [field]: value } : cursista)),
    );
  };

  const handleFrequenciaChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    const numValue = numericValue ? Math.min(parseInt(numericValue, 10), 100) : null;

    handleCursistaChange(id, 'frequencia', numValue);
  };

  const handleTableChangeInscritos = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPaginaInscritos) {
      setRegistrosPorPaginaInscritos(pagination.pageSize);
    }
    setPaginaAtualInscritos(pagination.current);
  };

  const colunasCursistas: ColumnsType<CursistaDTO> = [
    {
      key: 'indice',
      title: ' ',
      width: 60,
      align: 'center',
      render: (_text: any, _record: CursistaDTO, index: number) => {
        return (paginaAtualInscritos - 1) * registrosPorPaginaInscritos + index + 1;
      },
    },
    {
      key: 'rfOuCpf',
      title: 'Funcional (RF) ou CPF',
      dataIndex: 'rfOuCpf',
      width: 180,
    },
    {
      key: 'nomeCursista',
      title: 'Nome do Cursista',
      dataIndex: 'nomeCursista',
      ellipsis: true,
    },
    {
      key: 'frequencia',
      title: 'Frequência (%)',
      dataIndex: 'frequencia',
      width: 150,
      render: (freq: number | null, record: CursistaDTO) => (
        <Input
          value={freq !== null ? `${freq}%` : ''}
          placeholder='%'
          onChange={(e) => handleFrequenciaChange(record.id, e.target.value)}
          style={{ width: '100%' }}
          maxLength={4}
        />
      ),
    },
    {
      key: 'atividade',
      title: 'Atividade',
      dataIndex: 'atividade',
      width: 150,
      render: (atividade: string | null, record: CursistaDTO) => (
        <Select
          value={atividade}
          placeholder='Selecione'
          onChange={(value) => handleCursistaChange(record.id, 'atividade', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
          allowClear
        />
      ),
    },
    {
      key: 'conceitoFinal',
      title: 'Conceito final',
      dataIndex: 'conceitoFinal',
      width: 250,
      render: (conceitoFinal: string | null, record: CursistaDTO) => (
        <Select
          value={conceitoFinal}
          placeholder='Selecione'
          onChange={(value) => handleCursistaChange(record.id, 'conceitoFinal', value || null)}
          style={{ width: '100%' }}
          options={[
            { label: 'Plenamente satisfatório (P)', value: 'P' },
            { label: 'Satisfatório (S)', value: 'S' },
            { label: 'Não Satisfatório (NS)', value: 'NS' },
          ]}
          allowClear
        />
      ),
    },
    {
      key: 'aprovado',
      title: 'Aprovado',
      dataIndex: 'aprovado',
      width: 120,
      render: (aprovado: boolean | null, record: CursistaDTO) => (
        <Select
          value={aprovado !== null ? (aprovado ? 'S' : 'N') : null}
          placeholder='Selecione'
          onChange={(value) =>
            handleCursistaChange(record.id, 'aprovado', value ? value === 'S' : null)
          }
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
          allowClear
        />
      ),
    },
  ];

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText || searchText.length < 0) {
      setOpcoesFormacao([]);
      return;
    }

    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacao(searchText);
      if (response.sucesso && response.dados && response.dados.items) {
        setOpcoesFormacao(response.dados.items);
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
    const proposta = opcoesFormacao.find((p) => p.numeroHomologacao === option.numeroHomologacao);
    if (proposta) {
      setPropostaSelecionada(proposta);
      form.setFieldsValue({
        numeroHomologacao: proposta.numeroHomologacao,
        nomeFormacao: proposta.nomeFormacao,
        codigoFormacao: proposta.codigoFormacao,
        turmaId: undefined,
      });

      setTodasTurmasPossuemLista(false);

      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmas(response.dados);
          console.log(turmas);

          const turmasDisponiveis: RetornoListagemDTO[] = [];
          for (const turma of response.dados) {
            try {
              const possuiLista = await verificarTurmaPossuiLista(turma.id, 0);
              if (possuiLista.sucesso && possuiLista.dados === false) {
                turmasDisponiveis.push(turma);
              }
            } catch (error) {
              console.error(`Erro ao verificar turma ${turma.id}:`, error);
            }
          }

          if (turmasDisponiveis.length === 0) {
            // Se não sobrar nenhuma turma, deixe apenas a primeira e desabilite
            const primeiraTurma = response.dados.length > 0 ? response.dados[0] : null;
            if (primeiraTurma) {
              setTurmasFiltradas([primeiraTurma]);
              form.setFieldValue('turmaId', primeiraTurma.id);
            } else {
              setTurmasFiltradas([]);
            }
            setTurmaDisabled(true);
            setTooltipAberto(true);
            // Marca que todas as turmas possuem lista (modo criação)
            setTodasTurmasPossuemLista(true);
          } else {
            setTurmasFiltradas(turmasDisponiveis);
            setTurmaDisabled(false);
            setTooltipAberto(false);
            setTodasTurmasPossuemLista(false);
          }
        } else {
          setTurmas([]);
          setTurmasFiltradas([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmas([]);
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar turmas da formação',
        });
      }
    }
  };

  const onClickSalvar = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formatarData = (data: any) => {
        if (!data) return null;
        return dayjs(data).format('YYYY-MM-DD');
      };

      const anexos =
        values.anexos?.map((arquivo: any) => ({
          arquivoCodigo: arquivo.xhr || arquivo.arquivoCodigo,
          nomeArquivo: arquivo.name || arquivo.nomeArquivo,
          tipoAnexoId: 3,
        })) || [];

      const dados = {
        propostaId: propostaSelecionada?.propostaId || 0,
        propostaTurmaId: values.turmaId || 0,
        dataPublicacao: formatarData(values.dataPublicacao),
        dataPublicacaoDom: formatarData(values.dataPublicacaoDiarioOficial),
        numeroComunicado: Number(values.numeroComunicado) || 0,
        paginaComunicadoDom: Number(values.paginaComunicado) || 0,
        codigoCursoEol: Number(values.codigoCursoEol) || null,
        codigoNivel: Number(values.codigoNivel) || null,
        observacao: values.observacao || '',
        inscritos: cursistas.map((cursista) => ({
          inscricaoId: cursista.id,
          percentualFrequencia: cursista.frequencia ?? null,
          conceitoFinal: cursista.conceitoFinal ?? null,
          atividadeObrigatorio:
            cursista.atividade === 'S' ? true : cursista.atividade === 'N' ? false : null,
          aprovado: cursista.aprovado ?? null,
        })),
        anexos,
        retificacoes: retificacoes
          .map((numero) => {
            const numeroFormatado = numero.toString().padStart(2, '0');
            const dataRetificacao = values[`dataRetificacao${numeroFormatado}`];
            const paginaRetificacao = values[`paginaRetificacao${numeroFormatado}`];

            if (dataRetificacao || paginaRetificacao) {
              const retificacaoOriginal = modoEdicao ? retificacoesOriginais.get(numero) : null;

              return {
                id: retificacaoOriginal?.id || 0,
                dataRetificacao: formatarData(dataRetificacao),
                paginaRetificacaoDom: Number(paginaRetificacao) || 0,
              };
            }
            return null;
          })
          .filter(
            (
              retificacao,
            ): retificacao is {
              id: number;
              dataRetificacao: string | null;
              paginaRetificacaoDom: number;
            } => retificacao !== null,
          ),
      };

      console.log('Dados enviados para API:', JSON.stringify(dados, null, 2));

      const response = modoEdicao
        ? await atualizarCodafListaPresenca(registroId!, dados)
        : await criarCodafListaPresenca(dados);

      console.log('Resposta da API:', response);

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
          navigate(ROUTES.LISTA_PRESENCA_CODAF_EDITAR.replace(':id', response.dados.id));
        }
      } else {
        const mensagensErro = response.mensagens || [];
        const mensagemDetalhada =
          mensagensErro.length > 0
            ? mensagensErro.join(', ')
            : modoEdicao
            ? 'Erro ao atualizar o registro'
            : 'Erro ao salvar o registro';

        console.error('Erro da API:', mensagensErro);

        notification.error({
          message: 'Erro ao salvar',
          description: mensagemDetalhada,
        });
      }
    } catch (error: any) {
      console.error('Erro ao salvar (catch):', error);
      console.error('Detalhes do erro:', {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data,
      });

      const mensagemErro =
        error?.response?.data?.mensagens?.[0] ||
        error?.message ||
        (modoEdicao ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro');

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF });
  };

  const onClickExcluir = () => {
    setModalExcluirVisible(true);
  };

  const confirmarExclusao = async () => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'Registro não encontrado',
        });
        setModalExcluirVisible(false);
        return;
      }

      setLoading(true);
      setModalExcluirVisible(false);

      const response = await excluirCodafListaPresenca(registroId);

      if (response.status === 204) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro excluído com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao excluir o registro';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      const mensagemErro =
        error?.response?.data?.mensagens?.[0] || error?.message || 'Erro ao excluir o registro';

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirVisible(false);
  };

  const onBaixarModelo = async () => {
    try {
      setLoading(true);
      const response = await baixarModeloTermoResponsabilidade();

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const contentType = response.headers['content-type'];
        let fileName = 'Modelo_Termo_Responsabilidade';

        if (contentType?.includes('pdf')) {
          fileName += '.pdf';
        } else if (contentType?.includes('wordprocessingml') || contentType?.includes('msword')) {
          fileName += '.docx';
        } else {
          fileName += '.pdf';
        }

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        downloadBlob(response.data, fileName);

        notification.success({
          message: 'Sucesso',
          description: 'Modelo baixado com sucesso!',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao baixar modelo do termo de responsabilidade',
        });
      }
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao baixar modelo do termo de responsabilidade',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDownloadAnexo = async (arquivo: any) => {
    try {
      console.log('Arquivo completo para download:', arquivo);

      if (arquivo.urlDownload) {
        window.open(arquivo.urlDownload, '_blank');
        return;
      }

      const codigoArquivo = arquivo.xhr || arquivo.arquivoCodigo || arquivo.response;
      console.log('Código do arquivo extraído:', codigoArquivo);

      if (!codigoArquivo) {
        notification.error({
          message: 'Erro',
          description: 'Código do arquivo não encontrado',
        });
        return;
      }

      const response = await obterAnexoCodafParaDownload(codigoArquivo);

      if (response.status === 200) {
        downloadBlob(response.data, arquivo.name);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao fazer download do arquivo',
        });
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao fazer download do arquivo',
      });
    }
  };

  const verificarAlteracoes = () => {
    if (!modoEdicao || !formOriginal.current) return false;

    const formAtual = form.getFieldsValue();
    const formOriginalStr = JSON.stringify(formOriginal.current);
    const formAtualStr = JSON.stringify(formAtual);
    const cursistasOriginaisStr = JSON.stringify(cursistasOriginais.current);
    const cursistasAtuaisStr = JSON.stringify(cursistas);

    return formOriginalStr !== formAtualStr || cursistasOriginaisStr !== cursistasAtuaisStr;
  };

  const onClickEnviarParaDF = async () => {
    if (!registroId) {
      notification.warning({
        message: 'Atenção',
        description: 'É necessário salvar o registro antes de enviar para DF',
      });
      setModalEnviarDFVisible(false);
      return;
    }

    if (verificarAlteracoes()) {
      notification.warning({
        message: 'Atenção',
        description: 'Você possui alterações não salvas. Por favor, salve antes de enviar.',
      });
      return;
    }

    const anexos = form.getFieldValue('anexos');

    if (!anexos || anexos.length === 0) {
      notification.warning({
        message: 'Atenção',
        description: 'É necessário anexar pelo menos um arquivo antes de enviar para DF',
      });
      return;
    }

    if (!formValido) {
      const camposVazios: string[] = [];

      if (!numeroHomologacao) camposVazios.push('Número de homologação');
      if (!nomeFormacao) camposVazios.push('Nome da formação');
      if (!codigoFormacao) camposVazios.push('Código da formação');
      if (!turmaId) camposVazios.push('Turma');
      if (!numeroComunicado) camposVazios.push('Número do comunicado');
      if (!paginaComunicado) camposVazios.push('Página do comunicado');
      if (!dataPublicacao) camposVazios.push('Data de publicação');
      if (!dataPublicacaoDiarioOficial) camposVazios.push('Data de publicação no Diário Oficial');
      if (!ehAreaPromotora && !codigoCursoEol) camposVazios.push('Código do curso no EOL');
      if (!ehAreaPromotora && !codigoNivel) camposVazios.push('Código do nível');

      notification.warning({
        message: 'Atenção',
        description: `Os seguintes campos não possuem valores validos: (${camposVazios.join(
          ', ',
        )})`,
      });
      return;
    }

    if (cursistas.length === 0) {
      notification.warning({
        message: 'Atenção',
        description: 'Não é possível enviar para DF sem inscritos na lista de presença',
      });
      return;
    }

    const cursistasIncompletos = cursistas.filter(
      (cursista) =>
        cursista.frequencia === null ||
        cursista.conceitoFinal === null ||
        cursista.aprovado === null,
    );

    if (cursistasIncompletos.length > 0) {
      notification.warning({
        message: 'Atenção',
        description:
          'Você precisa preencher a Frequência, Conceito Final e Aprovado em todos os inscritos para prosseguir',
      });
      return;
    }

    setModalEnviarDFVisible(true);
  };

  const confirmarEnvioParaDF = async () => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'É necessário salvar o registro antes de enviar para DF',
        });
        setModalEnviarDFVisible(false);
        return;
      }

      setLoading(true);
      setModalEnviarDFVisible(false);

      const response = await enviarCodafParaDF(registroId);

      if (response.status === 200) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro enviado para DF com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao enviar o registro para DF';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error: any) {
      console.error('Erro ao enviar para DF:', error);
      const mensagemErro =
        error?.response?.data?.mensagens?.[0] ||
        error?.message ||
        'Erro ao enviar o registro para DF';

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarEnvioParaDF = () => {
    setModalEnviarDFVisible(false);
  };

  const confirmarDevolucaoParaDF = async (justificativa: string) => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'É necessário salvar o registro antes de devolver para correção',
        });
        setModalDevolverDFVisible(false);
        return;
      }

      setLoading(true);
      setModalDevolverDFVisible(false);

      const response = await devolverCodafParaCorrecao(registroId, justificativa);

      if (response.status === 200) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro devolvido para correção com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao devolver o registro para correção';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao devolver o registro para correção',
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarDevolucaoParaDF = () => {
    setModalDevolverDFVisible(false);
  };

  const onClickAtualizarInscritos = async () => {
    if (!turmaId) {
      notification.warning({
        message: 'Atenção',
        description: 'Selecione uma turma para atualizar os inscritos',
      });
      return;
    }

    setLoading(true);
    try {
      await buscarInscritos();
      setMostrarDivergencia(false);
      notification.success({
        message: 'Sucesso',
        description: 'Lista de inscritos atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar inscritos:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao atualizar lista de inscritos',
      });
    } finally {
      setLoading(false);
    }
  };

  const onConferirComentarios = () => {
    if (!comentario) {
      notification.warning({
        message: 'Atenção',
        description: 'Nenhum comentário disponível',
      });
      return;
    }

    setModalComentarioVisible(true);
  };

  const onCloseModalComentario = () => {
    setModalComentarioVisible(false);
    //setMostrarBanner(false);
  };

  return (
    <Col>
      <HeaderPage
        title={modoEdicao ? 'Edição - Lista Presença Codaf' : 'Cadastro - Lista Presença Codaf'}
      >
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            {mostrarBotaoExcluir && (
              <Col>
                <Button
                  type='default'
                  onClick={onClickExcluir}
                  id={CF_BUTTON_EXCLUIR}
                  style={{
                    fontWeight: 700,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                  }}
                >
                  Excluir
                </Button>
              </Col>
            )}
            <Col>
              <Button
                type='default'
                onClick={onClickCancelar}
                id={CF_BUTTON_CANCELAR}
                style={{
                  fontWeight: 700,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                }}
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickSalvar}
                loading={loading}
                disabled={!modoEdicao && todasTurmasPossuemLista}
                id={CF_BUTTON_SALVAR}
                style={{ fontWeight: 700 }}
              >
                Salvar
              </Button>
            </Col>
            <Col>
              {mostrarBotaoEnviarDF && (
                <Button
                  type='primary'
                  onClick={onClickEnviarParaDF}
                  loading={loading}
                  disabled={!formValido}
                  style={{ fontWeight: 700 }}
                >
                  Enviar para DF
                </Button>
              )}

              {mostrarBotaoDevolverDF && (
                <Button
                  type='primary'
                  onClick={() => setModalDevolverDFVisible(true)}
                  loading={loading}
                  disabled={!ehPerfilAdmin}
                  style={{ fontWeight: 700 }}
                >
                  Devolver para DF
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          {mostrarBanner && status === 3 && ehAreaPromotora && (
            <BannerComentarios
              comentario={comentario}
              onConferirComentarios={onConferirComentarios}
              loading={loading}
            />
          )}

          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div style={{ paddingBottom: '24px' }}>
                Aqui você cria um novo CODAF. Preencha todas as informações antes de enviar a
                aprovação da Divisão de Formação (DF).
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            loadingAutocomplete={loadingAutocomplete}
            turmasFiltradas={turmasFiltradas}
            turmaDisabled={turmaDisabled}
            tooltipAberto={tooltipAberto}
            ehPerfilDF={ehPerfilDF}
            ehPerfilEMFORPEF={ehPerfilEMFORPEF}
          />
          <SecaoListaInscritos
            mostrarDivergencia={mostrarDivergencia}
            nomeFormacao={nomeFormacao}
            onClickAtualizarInscritos={onClickAtualizarInscritos}
            loading={loading}
            colunasCursistas={colunasCursistas}
            cursistas={cursistas}
            paginaAtualInscritos={paginaAtualInscritos}
            registrosPorPaginaInscritos={registrosPorPaginaInscritos}
            totalRegistrosInscritos={totalRegistrosInscritos}
            handleTableChangeInscritos={handleTableChangeInscritos}
          />
          <div style={{ display: ehPerfilDF || ehPerfilEMFORPEF ? 'block' : 'none' }}>
            <SecaoRetificacoes
              retificacoes={retificacoes}
              setRetificacoes={setRetificacoes}
              contadorRetificacoes={contadorRetificacoes}
              setContadorRetificacoes={setContadorRetificacoes}
              retificacoesOriginais={retificacoesOriginais}
              setRetificacoesOriginais={setRetificacoesOriginais}
              form={form}
            />
          </div>
          <SecaoAnexos
            form={form}
            podeGerenciarAnexos={podeGerenciarAnexos}
            onDownloadAnexo={onDownloadAnexo}
            fazerUploadAnexoCodaf={fazerUploadAnexoCodaf}
            obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
          />

          <BannerDownloadTermo onBaixarModelo={onBaixarModelo} />

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
                />
              </Form.Item>
            </Col>
          </Row>
        </CardContent>
      </Form>

      <ModalEnviarDF
        visible={modalEnviarDFVisible}
        onConfirm={confirmarEnvioParaDF}
        onCancel={cancelarEnvioParaDF}
        loading={loading}
      />

      <ModalDevolverDF
        visible={modalDevolverDFVisible}
        onConfirm={confirmarDevolucaoParaDF}
        onCancel={cancelarDevolucaoParaDF}
        loading={loading}
      />

      <ModalExcluir
        visible={modalExcluirVisible}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        loading={loading}
      />

      <ModalComentario
        visible={modalComentarioVisible}
        onClose={onCloseModalComentario}
        comentario={comentario}
      />
    </Col>
  );
};

export default CadastroListaPresencaCodaf;
