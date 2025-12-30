import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_SALVAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_CURSO_EOL,
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_CODIGO_NIVEL,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_COMUNICADO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_PAGINA_COMUNICADO,
} from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  atualizarCodafListaPresenca,
  criarCodafListaPresenca,
  obterCodafListaPresencaPorId,
  obterInscritosTurma,
} from '~/core/services/codaf-lista-presenca-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number;
  atividade: string;
  conceitoFinal: string;
  aprovado: boolean;
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
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [formValido, setFormValido] = useState(false);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [paginaAtualInscritos, setPaginaAtualInscritos] = useState(1);
  const [totalRegistrosInscritos, setTotalRegistrosInscritos] = useState(0);
  const [registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos] = useState(10);

  const modoEdicao = !!id;
  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const mostrarBotaoExcluir = modoEdicao && status === 1;

  // Monitora mudanças nos campos do formulário
  const numeroHomologacao = Form.useWatch('numeroHomologacao', form);
  const nomeFormacao = Form.useWatch('nomeFormacao', form);
  const codigoFormacao = Form.useWatch('codigoFormacao', form);
  const turmaId = Form.useWatch('turmaId', form);
  const numeroComunicado = Form.useWatch('numeroComunicado', form);
  const dataPublicacao = Form.useWatch('dataPublicacao', form);
  const paginaComunicado = Form.useWatch('paginaComunicado', form);
  const dataPublicacaoDiarioOficial = Form.useWatch('dataPublicacaoDiarioOficial', form);
  const codigoCursoEol = Form.useWatch('codigoCursoEol', form);
  const codigoNivel = Form.useWatch('codigoNivel', form);

  // Verifica se todos os campos obrigatórios estão preenchidos
  React.useEffect(() => {
    const todosPreenchidos =
      numeroHomologacao &&
      nomeFormacao &&
      codigoFormacao &&
      turmaId &&
      numeroComunicado &&
      dataPublicacao &&
      paginaComunicado &&
      dataPublicacaoDiarioOficial &&
      codigoCursoEol &&
      codigoNivel;

    setFormValido(!!todosPreenchidos);
  }, [
    numeroHomologacao,
    nomeFormacao,
    codigoFormacao,
    turmaId,
    numeroComunicado,
    dataPublicacao,
    paginaComunicado,
    dataPublicacaoDiarioOficial,
    codigoCursoEol,
    codigoNivel,
  ]);

  // Carrega dados quando está em modo de edição
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

          // Preenche os campos do formulário
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

          // Define a proposta selecionada
          setPropostaSelecionada({
            propostaId: dados.propostaId,
            numeroHomologacao: dados.numeroHomologacao,
            nomeFormacao: dados.nomeFormacao,
            codigoFormacao: dados.codigoFormacao,
          });

          // Busca as turmas da proposta
          try {
            const turmasResponse = await obterTurmasInscricao(dados.propostaId);
            if (turmasResponse.sucesso && turmasResponse.dados) {
              setTurmas(turmasResponse.dados);
              setTurmaDisabled(false);
            }
          } catch (error) {
            console.error('Erro ao buscar turmas:', error);
          }

          // Nota: A API não retorna a lista de inscritos no GET,
          // então a tabela de cursistas ficará vazia no modo de edição
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

  // Busca os inscritos quando uma turma é selecionada
  const buscarInscritos = async (pagina = 1) => {
    if (!turmaId) {
      setCursistas([]);
      setTotalRegistrosInscritos(0);
      setPaginaAtualInscritos(1);
      return;
    }

    setLoading(true);
    try {
      const response = await obterInscritosTurma(turmaId, pagina, registrosPorPaginaInscritos);
      if (response.sucesso && response.dados) {
        const inscritosFormatados = response.dados.items.map((inscrito) => ({
          id: inscrito.id,
          rfOuCpf: inscrito.cpf,
          nomeCursista: inscrito.nome,
          frequencia: inscrito.percentualFrequencia ?? 0,
          atividade: inscrito.atividadeObrigatorio ? 'S' : 'N',
          conceitoFinal: inscrito.conceitoFinal ?? 'NS',
          aprovado: inscrito.aprovado,
        }));
        setCursistas(inscritosFormatados);
        setTotalRegistrosInscritos(response.dados.totalRegistros || 0);
        setPaginaAtualInscritos(pagina);
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
    buscarInscritos(1);
  }, [turmaId]);

  React.useEffect(() => {
    if (turmaId) {
      buscarInscritos(1);
    }
  }, [registrosPorPaginaInscritos]);

  const handleCursistaChange = (id: number, field: keyof CursistaDTO, value: any) => {
    setCursistas((prev) =>
      prev.map((cursista) => (cursista.id === id ? { ...cursista, [field]: value } : cursista)),
    );
  };

  const handleFrequenciaChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    const numValue = numericValue ? Math.min(parseInt(numericValue, 10), 100) : 0;

    handleCursistaChange(id, 'frequencia', numValue);
  };

  const handleTableChangeInscritos = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPaginaInscritos) {
      setRegistrosPorPaginaInscritos(pagination.pageSize);
      setPaginaAtualInscritos(1);
    } else {
      buscarInscritos(pagination.current);
    }
  };

  const colunasCursistas: ColumnsType<CursistaDTO> = [
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
      render: (freq: number, record: CursistaDTO) => (
        <Input
          value={`${freq}%`}
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
      render: (atividade: string, record: CursistaDTO) => (
        <Select
          value={atividade}
          onChange={(value) => handleCursistaChange(record.id, 'atividade', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
        />
      ),
    },
    {
      key: 'conceitoFinal',
      title: 'Conceito final',
      dataIndex: 'conceitoFinal',
      width: 250,
      render: (conceitoFinal: string, record: CursistaDTO) => (
        <Select
          value={conceitoFinal}
          onChange={(value) => handleCursistaChange(record.id, 'conceitoFinal', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'Plenamente satisfatório (P)', value: 'P' },
            { label: 'Satisfatório (S)', value: 'S' },
            { label: 'Não Satisfatório (NS)', value: 'NS' },
          ]}
        />
      ),
    },
    {
      key: 'aprovado',
      title: 'Aprovado',
      dataIndex: 'aprovado',
      width: 120,
      render: (aprovado: boolean, record: CursistaDTO) => (
        <Select
          value={aprovado ? 'S' : 'N'}
          onChange={(value) => handleCursistaChange(record.id, 'aprovado', value === 'S')}
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
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
        turmaId: undefined, // Limpa o campo turma
      });

      // Buscar turmas da proposta selecionada
      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmas(response.dados);
          setTurmaDisabled(false);
        } else {
          setTurmas([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmas([]);
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

      // Formatar datas para o formato esperado pela API (yyyy-mm-dd)
      const formatarData = (data: any) => {
        if (!data) return '';
        return dayjs(data).format('YYYY-MM-DD');
      };

      const dados = {
        propostaId: propostaSelecionada?.propostaId || 0,
        propostaTurmaId: values.turmaId || 0,
        dataPublicacao: formatarData(values.dataPublicacao),
        dataPublicacaoDom: formatarData(values.dataPublicacaoDiarioOficial),
        numeroComunicado: Number(values.numeroComunicado) || 0,
        paginaComunicadoDom: Number(values.paginaComunicado) || 0,
        codigoCursoEol: Number(values.codigoCursoEol) || 0,
        codigoNivel: Number(values.codigoNivel) || 0,
        observacao: values.observacao || '',
        inscritos: cursistas.map((cursista) => ({
          inscricaoId: cursista.id,
          percentualFrequencia: cursista.frequencia,
          conceitoFinal: cursista.conceitoFinal,
          atividadeObrigatorio: cursista.atividade === 'S',
          aprovado: cursista.aprovado,
        })),
      };

      console.log('Dados enviados para API:', JSON.stringify(dados, null, 2));

      const response = modoEdicao
        ? await atualizarCodafListaPresenca(registroId!, dados)
        : await criarCodafListaPresenca(dados);

      console.log('Resposta da API:', response);

      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: modoEdicao
            ? 'Registro atualizado com sucesso!'
            : 'Registro salvo com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
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
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este registro?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        notification.success({
          message: 'Sucesso',
          description: 'Registro excluído com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF);
      },
    });
  };

  const onClickEnviarParaDF = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      console.log('Enviando para DF:', values);

      notification.success({
        message: 'Sucesso',
        description: 'Registro enviado para DF com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao enviar para DF:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao enviar o registro para DF',
      });
    } finally {
      setLoading(false);
    }
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
                id={CF_BUTTON_SALVAR}
                style={{ fontWeight: 700 }}
              >
                Salvar
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickEnviarParaDF}
                loading={loading}
                disabled={!formValido}
                style={{ fontWeight: 700 }}
              >
                {ehPerfilDF || ehPerfilEMFORPEF ? 'Devolver para DF' : 'Enviar para DF'}
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <p>
                Aqui você cria um novo CODAF. Preencha todas as informações antes de enviar a
                aprovação da Divisão de Formação (DF).
              </p>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <b>
                <Form.Item label='Número de homologação' name='numeroHomologacao'>
                  <AutoComplete
                    id={CF_INPUT_NUMERO_HOMOLOGACAO}
                    placeholder='Digite para buscar formação'
                    onSearch={onSearchFormacao}
                    onSelect={onSelectFormacao}
                    options={opcoesFormacao.map((opcao) => ({
                      value: opcao.numeroHomologacao.toString(),
                      label: opcao.numeroHomologacao.toString(),
                      numeroHomologacao: opcao.numeroHomologacao,
                    }))}
                    filterOption={false}
                    notFoundContent={
                      loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada'
                    }
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Nome da formação',
                    name: 'nomeFormacao',
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome da formação',
                    maxLength: 200,
                    disabled: true,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Código da formação',
                    name: 'codigoFormacao',
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                    maxLength: 20,
                    disabled: true,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <b>
                <Form.Item label='Turma' name='turmaId'>
                  <Select
                    placeholder='Selecione a turma'
                    options={turmas.map((turma) => ({
                      label: turma.descricao,
                      value: turma.id,
                    }))}
                    disabled={turmaDisabled}
                    allowClear
                  />
                </Form.Item>
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Número do comunicado',
                    name: 'numeroComunicado',
                  }}
                  inputProps={{
                    id: CF_INPUT_NUMERO_COMUNICADO,
                    placeholder: 'Número do comunicado',
                    maxLength: 20,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item
                  label='Data da publicação'
                  name='dataPublicacao'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <DatePicker
                    placeholder='Selecione a data'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    locale={locale}
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Página do comunicado no Diário Oficial',
                    name: 'paginaComunicado',
                  }}
                  inputProps={{
                    id: CF_INPUT_PAGINA_COMUNICADO,
                    placeholder: 'Página do comunicado',
                    maxLength: 10,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item
                  label='Data de publicação do Diário Oficial'
                  name='dataPublicacaoDiarioOficial'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <DatePicker
                    placeholder='Selecione a data'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    locale={locale}
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Código do curso no EOL',
                    name: 'codigoCursoEol',
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_CURSO_EOL,
                    placeholder: 'Código do curso no EOL',
                    maxLength: 50,
                    disabled: ehPerfilDF || ehPerfilEMFORPEF,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Código do nível',
                    name: 'codigoNivel',
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_NIVEL,
                    placeholder: 'Código do nível',
                    maxLength: 50,
                    disabled: ehPerfilDF || ehPerfilEMFORPEF,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
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
                Lista de inscritos na formação
              </div>
              <p style={{ marginBottom: 16 }}>
                Insira as informações dos cursistas que finalizaram a formação.
              </p>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div className='table-pagination-center'>
                <Table
                  columns={colunasCursistas}
                  dataSource={cursistas}
                  rowKey='id'
                  pagination={{
                    current: paginaAtualInscritos,
                    pageSize: registrosPorPaginaInscritos,
                    total: totalRegistrosInscritos,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    locale: { items_per_page: '' },
                  }}
                  onChange={handleTableChangeInscritos}
                  locale={{
                    emptyText: 'Nenhum cursista cadastrado',
                  }}
                  scroll={{ x: 'max-content' }}
                />
              </div>
              <style>{`
                .table-pagination-center .ant-pagination {
                  display: flex;
                  justify-content: center;
                }
              `}</style>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
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
                Retificações
              </div>
              <p style={{ marginBottom: 16 }}>
                Caso haja retificações realizadas, insira nos campos abaixo. Caso seja necessário o
                registro de mais de uma, clique em &quot;Nova retificação&quot;.
              </p>
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ff9a52',
                    color: '#fff',
                    padding: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Retificação 01
                </div>
                <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 700 }}>Data da retificação</span>}
                        name='dataRetificacao01'
                      >
                        <DatePicker
                          format='DD/MM/YYYY'
                          placeholder='Selecione a data'
                          locale={locale}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <InputNumero
                        formItemProps={{
                          label: 'Página da retificação',
                          name: 'paginaRetificacao01',
                        }}
                        inputProps={{
                          placeholder: 'Número da página',
                          maxLength: 10,
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
            <Col>
              <Button
                type='default'
                icon={<PlusOutlined />}
                style={{
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                  fontWeight: 500,
                }}
              >
                Nova retificação
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
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
                Anexos
              </div>
              <p style={{ marginBottom: 16 }}>Anexe os documentos úteis para a criação do CODAF.</p>
              <UploadArquivosConectaFormacao
                form={form}
                formItemProps={{
                  name: 'anexos',
                  label: '',
                }}
                draggerProps={{ multiple: true }}
                subTitulo='Deve permitir apenas arquivos PDF com no máximo 20MB cada.'
                tipoArquivosPermitidos=',.pdf'
              />
            </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                height: '100%',
                borderRadius: '4px',
                backgroundColor: 'white',
                boxShadow: '0px 0px 12px 0px #0000001F',
                padding: '24px',


              }}
            >
              <Row gutter={[16, 8]} align='middle' justify='space-between'>
                <Col>
                  <p style={{ margin: 0 }}>
                    Você pode baixar o modelo do termo de responsabilidade para preenchimento.
                    Clique no botão "Termo de Responsabilidade" para fazer o download.
                  </p>
                </Col>
                <Col>
                  <Button
                    type='default'
                    icon={<DownloadOutlined />}
                    style={{
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                      fontWeight: 500,
                      padding: '9px',
                    }}
                  >
                    Termo de responsabilidade
                  </Button>
                </Col>
              </Row>
            </div>
          </div>

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

      {/* <div style={{ marginTop: 16 }}>
        <CardContent>
          <Row gutter={[16, 8]} justify='end'>
            <Col>
              <Button
                type='default'
                onClick={onClickCancelar}
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
                id={CF_BUTTON_SALVAR}
                style={{ fontWeight: 700 }}
              >
                Salvar
              </Button>
            </Col>
          </Row>
        </CardContent>
      </div> */}
    </Col>
  );
};

export default CadastroListaPresencaCodaf;
