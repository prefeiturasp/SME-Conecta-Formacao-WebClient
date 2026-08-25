import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Empty,
  Form,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import { SelectDRE } from '~/components/main/input/dre';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_RF,
} from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoDeclaracao, TipoDeclaracaoDescricao } from '~/core/enum/tipo-declaracao';
import { onClickVoltar } from '~/core/utils/form';
import {
  CodafDeclaracaoDTO,
  obterDeclaracoesCodaf,
  downloadDeclaracoesLote,
} from '~/core/services/codaf-declaracao-service';
import { downloadDeclaracao } from '~/core/services/codaf-lista-presenca-service';
import { obterDetalhesPropostaComTurmasPorId } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { TipoEmissorEnum } from '~/core/enum/tipo-emissor';

const DeclaracoesPesquisa: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [dados, setDados] = useState<CodafDeclaracaoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [turmasProposta, setTurmasProposta] = useState<RetornoListagemDTO[]>([]);

  const tipoDeclaracaoSelecionado = Form.useWatch('tipoDeclaracao', form);
  const rfCursistaDisabled = tipoDeclaracaoSelecionado === TipoDeclaracao.Regente;
  const rfRegenteDisabled = tipoDeclaracaoSelecionado === TipoDeclaracao.Cursista;

  React.useEffect(() => {
    if (rfCursistaDisabled) {
      form.setFieldValue('rfOuCpfCursista', undefined);
    }
    if (rfRegenteDisabled) {
      form.setFieldValue('rfRegente', undefined);
    }
  }, [rfCursistaDisabled, rfRegenteDisabled, form]);

  const columns: ColumnsType<CodafDeclaracaoDTO> = [
    {
      key: 'codigoDeclaracao',
      title: 'Código da declaração',
      dataIndex: 'codigoDeclaracao',
      width: 155,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      width: 500,
      ellipsis: true,
    },
    {
      key: 'nomeCursista',
      title: 'Nome do participante',
      dataIndex: 'nomeCursista',
      render: (_: any, record: CodafDeclaracaoDTO) => record.nomeCursista ?? record.nomeRegente,
      width: 500,
      ellipsis: true,
    },
    {
      key: 'tipoDeclaracao',
      title: 'Tipo de declaração',
      dataIndex: 'tipoDeclaracao',
      width: 230,
      render: (value: TipoDeclaracao) => TipoDeclaracaoDescricao[value] ?? '-',
    },
    {
      key: 'documentoCursista',
      title: 'RF ou CPF',
      dataIndex: 'documentoCursista',
      render: (_: any, record: CodafDeclaracaoDTO) => record.documentoCursista ?? record.documentoRegente,
      width: 190,
    },
    {
      key: 'dataEmissao',
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      width: 170,
      render: (value: string) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    columnTitle: (
      <Checkbox
        checked={dados.length > 0 && selectedRowKeys.length === dados.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(dados.map((item) => item.id));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />
    ),
  }; 

  const buscarDados = async (pagina = 1) => {
    setLoading(true);
    try {
      const dataEmissao = form.getFieldValue('dataEmissao');
      const dataEmissaoFormatada = dataEmissao
        ? dayjs(dataEmissao).format('YYYY-MM-DD')
        : undefined;

      const filtros = {
        NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
        TipoDeclaracao: form.getFieldValue('tipoDeclaracao') ?? undefined,
        CodigoFormacao: form.getFieldValue('codigoFormacao')
          ? Number(form.getFieldValue('codigoFormacao'))
          : undefined,
        NumeroHomologacao: form.getFieldValue('numeroHomologacao')
          ? Number(form.getFieldValue('numeroHomologacao'))
          : undefined,
        CodigoDeclaracao: form.getFieldValue('codigoDeclaracao')
          ? Number(form.getFieldValue('codigoDeclaracao'))
          : undefined,
        DocumentoCursista: form.getFieldValue('rfOuCpfCursista') || undefined,
        DocumentoRegente: form.getFieldValue('rfRegente') || undefined,
        NomeCursista: form.getFieldValue('nomeCursista') || undefined,
        DataEmissao: dataEmissaoFormatada,
        TipoEmissor: TipoEmissorEnum.DRE,
        EmissorId: form.getFieldValue('emissorId')?.id || undefined,
        TurmaId: form.getFieldValue('turmaId') || undefined,
        Pagina: pagina,
        TamanhoPagina: registrosPorPagina,
      };

      const response = await obterDeclaracoesCodaf(filtros);

      if (response.sucesso && response.dados) {
        setDados(response.dados.items);
        setTotalRegistros(response.dados.totalRegistros);
        if (response.dados.items.length === 1) {
          setSelectedRowKeys([response.dados.items[0].id]);
        } else {
          setSelectedRowKeys([]);
        }
      } else {
        setDados([]);
        setTotalRegistros(0);
        setSelectedRowKeys([]);
      }
      setPaginaAtual(pagina);
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar declarações',
      });
      setDados([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  };

  const onClickFiltrar = () => {
    setFiltroAplicado(true);
    setSelectedRowKeys([]);
    buscarDados(1);
  };

  const onClickLimpar = () => {
    setPaginaAtual(1);    
    setTotalRegistros(0);
    setFiltroAplicado(false);
    setTurmaDisabled(false);
    setTurmasProposta([]);
    form.resetFields();
  };

  const onClickBaixarDeclaracao = async () => {
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0] as number;
      const resultado = await downloadDeclaracao(id);

      if (resultado.sucesso && resultado.dados?.urlDownload) {
        const { nomeFormacao, nomeCompleto, urlDownload } = resultado.dados;
        const sanitize = (s: string) => s.replaceAll(/[/\\:*?"<>|]/g, '_').trim();
        const nomePdf = `DECLARACAO_${sanitize(nomeFormacao)}_${sanitize(nomeCompleto)}.PDF`;
        const blob = await fetch(urlDownload).then((r) => r.blob());
        const url = globalThis.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomePdf;
        link.click();
        globalThis.URL.revokeObjectURL(url);
        notification.success({
          message: 'Sucesso',
          description: 'A declaração foi baixada com sucesso.',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Não conseguimos baixar a declaração selecionada. Tente novamente.',
        });
      }
      return;
    }

    const ids = selectedRowKeys as number[];
    const resultado = await downloadDeclaracoesLote(ids);

    if (resultado.sucesso && resultado.blob) {
      const url = globalThis.URL.createObjectURL(resultado.blob);
      const link = document.createElement('a');
      link.href = url;
      const now = dayjs();
      link.download = `DECLARACOES_${now.format('DDMMYYYY')}_${now.format('HHmmss')}.zip`;
      link.click();
      globalThis.URL.revokeObjectURL(url);
      notification.success({
        message: 'Sucesso',
        description: 'As declarações selecionadas foram baixadas com sucesso.',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Não conseguimos baixar as declarações selecionadas. Tente novamente.',
      });
    }
  };

  const handleTableChange = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPagina) {
      setRegistrosPorPagina(pagination.pageSize);
      setPaginaAtual(1);
    } else {
      buscarDados(pagination.current);
    }
  };

   const aoMudarCodigoProposta = () => {    
    setTurmaDisabled(true);
    setTurmasProposta([]);
  }

  const aoSairDoCampoCodigoProposta = async (_valor: string) => {
      const value = Number(_valor.trim().replaceAll(/\D/g, ''));
  
      if (value === 0) {
        setTurmaDisabled(true);
        setTurmasProposta([]);
        return;
      }
  
      try {
        const resposta = await obterDetalhesPropostaComTurmasPorId(value, false);
  
        if (resposta.sucesso && resposta.dados) {
          if (resposta.dados.turmas && resposta.dados.turmas.length > 0) {
            setTurmasProposta(resposta.dados.turmas);
            setTurmaDisabled(false);
            form.setFieldsValue({
              numeroHomologacao: resposta.dados.numeroFormacao || undefined,
            });
          } else {
            setTurmasProposta([]);
            setTurmaDisabled(true);
          }
          form.setFieldsValue({
            turmaId: undefined
          });
        } else {
          form.setFieldsValue({
            turmaId: undefined,
          });
          setTurmasProposta([]);
          setTurmaDisabled(true);
        }
      } catch (error) {
        console.error('Erro ao obter detalhes da proposta:', error);
        setTurmasProposta([]);
        setTurmaDisabled(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao obter detalhes da proposta',
        });
      }
    };

  React.useEffect(() => {
    if (filtroAplicado) {
      buscarDados(1);
    }
  }, [registrosPorPagina]);

  return (
    <Col>
      <HeaderPage title='Pesquisar declarações'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Tooltip
                title={
                  selectedRowKeys.length === 0
                    ? 'Selecione um ou mais registros para baixar as declarações.'
                    : undefined
                }
              >
                <Button
                  block
                  type='primary'
                  onClick={onClickBaixarDeclaracao}
                  disabled={selectedRowKeys.length === 0}
                  style={{ fontWeight: 700 }}
                >
                  Baixar declaração
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <style>{`
        .declaracaos-pesquisa-form .ant-form-item-label > label {
          font-weight: bold;
        }
      `}</style>
      <Form form={form} layout='vertical' autoComplete='off' className='declaracaos-pesquisa-form'>
        <CardContent>
          {/* Linha 1 */}
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <InputTexto
                formItemProps={{
                  label: 'Nome da formação',
                  name: 'nomeFormacao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_NOME_FORMACAO,
                  placeholder: 'Nome da formação...',
                  maxLength: 200,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label='Tipo de declaração' name='tipoDeclaracao'>
                <Select
                  placeholder='Selecione...'
                  options={Object.values(TipoDeclaracao)
                    .filter((v): v is TipoDeclaracao => typeof v === 'number')
                    .map((t) => ({
                      label: TipoDeclaracaoDescricao[t],
                      value: t,
                    }))}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Linha 2 */}
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputNumero
                  formItemProps={{
                    label: 'Código da formação',
                    name: 'codigoFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação...',
                    maxLength: 19,
                    onChange: aoMudarCodigoProposta,
                    onBlur: (e) => aoSairDoCampoCodigoProposta(e.target.value),
                  }}
                />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputTexto
                formItemProps={{
                  label: 'Número de homologação da formação',
                  name: 'numeroHomologacao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_NUMERO_HOMOLOGACAO,
                  placeholder: 'Digite para buscar a formação...',
                  maxLength: 100,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                <Select
                  placeholder='Selecione...'
                  options={turmasProposta.map((turma) => ({
                    label: turma.descricao,
                    value: turma.id,
                  }))}
                  disabled={turmaDisabled}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Linha 3 */}
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputNumero
                formItemProps={{
                  label: 'Código da declaração',
                  name: 'codigoDeclaracao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  placeholder: 'Código da declaração...',
                  maxLength: 100,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputTexto
                formItemProps={{
                  label: 'RF ou CPF do cursista',
                  name: 'rfOuCpfCursista',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_RF,
                  placeholder: '000.000.000-00',
                  maxLength: 20,
                  allowClear: true,
                  disabled: rfCursistaDisabled,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputTexto
                formItemProps={{
                  label: 'RF ou CPF do regente',
                  name: 'rfRegente',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  placeholder: '000.000.000-00',
                  maxLength: 20,
                  allowClear: true,
                  disabled: rfRegenteDisabled,
                }}
              />
            </Col>
          </Row>

          {/* Linha 4 */}
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputTexto
                formItemProps={{
                  label: 'Nome do cursista',
                  name: 'nomeCursista',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  placeholder: 'Ex: João da Silva',
                  maxLength: 200,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item label='Data de emissão da declaração' name='dataEmissao'>
                <DatePicker
                  placeholder='Selecione a data...'
                  format='DD/MM/YYYY'
                  style={{ width: '100%' }}
                  locale={locale}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <SelectDRE
                formItemProps={{
                  label: 'Diretoria Regional de Educação',
                  name: 'emissorId',
                  rules: [{ required: false }],
                }}
                exibirApenasDREsUsuarioLogado
                selectProps={{ mode: undefined, allowClear: true }}
                exibirOpcaoTodos
              />
            </Col>
          </Row>

          {/* Botões de ação */}
          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
           <Col>
              <Button
                type='default'
                onClick={onClickLimpar}
                style={{
                  fontWeight: 700,
                  borderColor: '#FF9A52',
                  color: '#FF9A52',
                }}
              >
                Limpar filtros
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickFiltrar}
                loading={loading}
                style={{ fontWeight: 700 }}
              >
                Filtrar
              </Button>
            </Col>
          </Row>

          {/* Tabela */}
          {filtroAplicado && (
            <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
              <Col span={24}>
                {!loading && dados.length === 0 ? (
                  <div
                    style={{
                      width: '100%',
                      height: '30vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Empty description='Sem dados' />
                  </div>
                ) : (
                  <div className='table-pagination-center'>
                    <Table
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={dados}
                      rowKey='id'
                      loading={loading}
                      pagination={{
                        current: paginaAtual,
                        pageSize: registrosPorPagina,
                        total: totalRegistros,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 30, 50, 100],
                        locale: { items_per_page: '' },
                      }}
                      onChange={handleTableChange}
                      scroll={{ x: 'max-content' }}
                    />
                  </div>
                )}
                <style>{`
                  .table-pagination-center .ant-pagination {
                    display: flex;
                    justify-content: center;
                  }
                  .table-pagination-center .ant-dropdown-menu {
                    background-color: #FFFFFF;
                  }
                  .table-pagination-center .ant-dropdown-menu-item {
                    color: #42474A;
                  }
                  .table-pagination-center .ant-dropdown-menu-item:hover {
                    background-color: #f5f5f5;
                    color: #42474A;
                  }
                  .table-pagination-center .ant-table-tbody > tr.ant-table-row-selected > td {
                    background: #fff !important;
                  }
                  .table-pagination-center .ant-table-tbody > tr.ant-table-row-selected:hover > td {
                    background: #fafafa !important;
                  }
                `}</style>
              </Col>
            </Row>
          )}
        </CardContent>
      </Form>
    </Col>
  );
};

export default DeclaracoesPesquisa;
