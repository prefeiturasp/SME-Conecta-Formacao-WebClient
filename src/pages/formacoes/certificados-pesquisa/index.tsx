import {
  AutoComplete,
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
import { TipoCertificado, TipoCertificadoDescricao } from '~/core/enum/tipo-certificado';
import { onClickVoltar } from '~/core/utils/form';
import {
  CodafCertificadoDTO,
  obterCertificadosCodaf,
  downloadCertificadosLote,
} from '~/core/services/codaf-certificado-service';
import { downloadCertificado } from '~/core/services/codaf-lista-presenca-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

const CertificadosPesquisa: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [dados, setDados] = useState<CodafCertificadoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [turmasAPI, setTurmasAPI] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);

  const tipoCertificadoSelecionado = Form.useWatch('tipoCertificado', form);
  const rfCursistaDisabled = tipoCertificadoSelecionado === TipoCertificado.Regente;
  const rfRegenteDisabled = tipoCertificadoSelecionado === TipoCertificado.Cursista;

  React.useEffect(() => {
    if (rfCursistaDisabled) {
      form.setFieldValue('rfOuCpfCursista', undefined);
    }
    if (rfRegenteDisabled) {
      form.setFieldValue('rfRegente', undefined);
    }
  }, [rfCursistaDisabled, rfRegenteDisabled, form]);

  const columns: ColumnsType<CodafCertificadoDTO> = [
    {
      key: 'codigoCertificado',
      title: 'Código do certificado',
      dataIndex: 'codigoCertificado',
      width: 1,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      ellipsis: true,
    },
    {
      key: 'nomeParticipante',
      title: 'Nome do participante',
      dataIndex: 'nomeParticipante',
      ellipsis: true,
    },
    {
      key: 'tipoCertificado',
      title: 'Tipo de certificado',
      dataIndex: 'tipoCertificado',
      width: 1,
      render: (value: TipoCertificado) => TipoCertificadoDescricao[value] ?? '-',
    },
    {
      key: 'documento',
      title: 'RF ou CPF',
      dataIndex: 'documento',
      width: 1,
    },
    {
      key: 'dataEmissao',
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      width: 1,
      render: (value: string) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    columnTitle: (
      <Checkbox
        checked={dados.length > 0 && selectedRowKeys.length === dados.length}
        //indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < dados.length}
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

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText) {
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
    } catch {
      setOpcoesFormacao([]);
    } finally {
      setLoadingAutocomplete(false);
    }
  };

  const onSelectFormacao = async (_value: string, option: any) => {
    const proposta = opcoesFormacao.find((p) => p.numeroHomologacao === option.numeroHomologacao);
    if (proposta) {
      form.setFieldsValue({ turmaId: undefined });
      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmasAPI(response.dados);
          setTurmaDisabled(false);
        } else {
          setTurmasAPI([]);
          setTurmaDisabled(true);
        }
      } catch {
        setTurmasAPI([]);
        setTurmaDisabled(true);
      }
    }
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
        TipoCertificado: form.getFieldValue('tipoCertificado') ?? undefined,
        NumeroHomologacao: form.getFieldValue('numeroHomologacao')
          ? Number(form.getFieldValue('numeroHomologacao'))
          : undefined,
        CodigoCertificado: form.getFieldValue('codigoCertificado')
          ? Number(form.getFieldValue('codigoCertificado'))
          : undefined,
        DocumentoCursista: form.getFieldValue('rfOuCpfCursista') || undefined,
        DocumentoRegente: form.getFieldValue('rfRegente') || undefined,
        NomeCursista: form.getFieldValue('nomeCursista') || undefined,
        DataEmissao: dataEmissaoFormatada,
        DreId: form.getFieldValue('dreId')?.id || undefined,
        PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
        NumeroPagina: pagina,
        NumeroRegistros: registrosPorPagina,
      };

      const response = await obterCertificadosCodaf(filtros);

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
        description: 'Erro ao buscar certificados',
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

  /* const onClickLimpar = () => {
    form.resetFields();
    setDados([]);
    setTotalRegistros(0);
    setPaginaAtual(1);
    setFiltroAplicado(false);
    setSelectedRowKeys([]);
    setOpcoesFormacao([]);
    setTurmasAPI([]);
    setTurmaDisabled(true);
  }; */

  const onClickBaixarCertificado = async () => {
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0] as number;
      const resultado = await downloadCertificado(id);

      if (resultado.sucesso && resultado.dados?.urlDownload) {
        const { nomeFormacao, nomeCompleto, urlDownload } = resultado.dados;
        const sanitize = (s: string) => s.replace(/[/\\:*?"<>|]/g, '_').trim();
        const nomePdf = `CERTIFICADO_${sanitize(nomeFormacao)}_${sanitize(nomeCompleto)}.pdf`;
        const link = document.createElement('a');
        link.href = urlDownload;
        link.download = nomePdf;
        link.click();
        notification.success({
          message: 'Sucesso',
          description: 'O certificado foi baixado com sucesso.',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Não conseguimos baixar o certificado selecionado. Tente novamente.',
        });
      }
      return;
    }

    const ids = selectedRowKeys as number[];
    const resultado = await downloadCertificadosLote(ids);

    if (resultado.sucesso && resultado.blob) {
      const url = window.URL.createObjectURL(resultado.blob);
      const link = document.createElement('a');
      link.href = url;
      const now = dayjs();
      link.download = `CERTIFICADOS_${now.format('DDMMYYYY')}_${now.format('HHmmss')}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
      notification.success({
        message: 'Sucesso',
        description: 'Os certificados selecionados foram baixados com sucesso.',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Não conseguimos baixar os certificados selecionados. Tente novamente.',
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

  React.useEffect(() => {
    if (filtroAplicado) {
      buscarDados(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosPorPagina]);

  return (
    <Col>
      <HeaderPage title='Pesquisar certificados'>
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
                    ? 'Selecione um ou mais registros para baixar os certificados.'
                    : undefined
                }
              >
                <Button
                  block
                  type='primary'
                  onClick={onClickBaixarCertificado}
                  disabled={selectedRowKeys.length === 0}
                  style={{ fontWeight: 700 }}
                >
                  Baixar certificado
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <style>{`
        .certificados-pesquisa-form .ant-form-item-label > label {
          font-weight: bold;
        }
      `}</style>
      <Form form={form} layout='vertical' autoComplete='off' className='certificados-pesquisa-form'>
        <CardContent>
          {/* Linha 1 */}
          <Row gutter={[16, 8]}>
            <p>
              Consulte os certificados emitidos para cursistas e regentes em formações já
              concluídas. Use os filtros para encontrar o que precisa com mais facilidade.
            </p>

            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <InputTexto
                formItemProps={{
                  label: 'Nome da formação',
                  name: 'nomeFormacao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_NOME_FORMACAO,
                  placeholder: 'Nome da formação',
                  maxLength: 200,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label='Tipo de certificado' name='tipoCertificado'>
                <Select
                  placeholder='Selecione o tipo de certificado'
                  options={Object.values(TipoCertificado)
                    .filter((v): v is TipoCertificado => typeof v === 'number')
                    .map((t) => ({
                      label: TipoCertificadoDescricao[t],
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
                  placeholder: 'Código da formação',
                  maxLength: 20,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item label='Número de homologação da formação' name='numeroHomologacao'>
                <AutoComplete
                  id={CF_INPUT_NUMERO_HOMOLOGACAO}
                  placeholder='Digite para buscar formação'
                  allowClear
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
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                <Select
                  placeholder='Selecione a turma'
                  options={turmasAPI.map((turma) => ({
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
                  label: 'Código do certificado',
                  name: 'codigoCertificado',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  placeholder: 'Código do certificado',
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
                  placeholder: 'RF ou CPF do cursista',
                  maxLength: 20,
                  allowClear: true,
                  disabled: rfCursistaDisabled,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <InputTexto
                formItemProps={{
                  label: 'RF do regente',
                  name: 'rfRegente',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  placeholder: 'RF do regente',
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
                  placeholder: 'Nome do cursista',
                  maxLength: 200,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item label='Data de emissão do certificado' name='dataEmissao'>
                <DatePicker
                  placeholder='Selecione a data'
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
                  name: 'dreId',
                  rules: [{ required: false }],
                }}
                selectProps={{ mode: undefined, allowClear: true }}
                exibirOpcaoTodos
              />
            </Col>
          </Row>

          {/* Botões de ação */}
          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
            {/* <Col>
              <Button
                type='default'
                onClick={onClickLimpar}
                style={{
                  fontWeight: 700,
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35',
                  color: '#ffffff',
                }}
              >
                Limpar
              </Button>
            </Col> */}
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

export default CertificadosPesquisa;
