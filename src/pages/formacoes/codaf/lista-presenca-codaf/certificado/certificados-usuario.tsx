import { Button, Col, DatePicker, Form, Row, Select, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';

import HeaderPage from '~/components/lib/header-page';
import CardContent from '~/components/lib/card-content';
import InputTexto from '~/components/main/text/input-text';
import InputNumero from '~/components/main/numero';
import { notification } from '~/components/lib/notification';

import {
  obterCertificadosUsuario,
  CertificadoUsuarioDTO,
  downloadCertificado,
  obterDeclaracoesUsuario,
  DeclaracaoUsuarioDTO,
  downloadDeclaracao,
} from '~/core/services/codaf-lista-presenca-service';

const { RangePicker } = DatePicker;

type AbaType = 'certificados' | 'declaracoes';

const tableWrapperStyle = String.raw`
.codaf-supplementary-result .ant-pagination {
  display: flex;
  justify-content: center;
}
.codaf-supplementary-result .ant-dropdown-menu {
  background-color: #FFFFFF;
}
.codaf-supplementary-result .ant-dropdown-menu-item {
  color: #42474A;
}
.codaf-supplementary-result .ant-dropdown-menu-item:hover {
  background-color: #f5f5f5;
  color: #42474A;
}
`;

const MeusCertificados: React.FC = () => {
  const [form] = Form.useForm();
  const [abaAtiva, setAbaAtiva] = useState<AbaType>('certificados');
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  const mapTipoParticipacao = (tipo: number) => {
    switch (tipo) {
      case 1:
        return 'Cursista';
      case 2:
        return 'Regente';
      default:
        return '-';
    }
  };

  const onClickVisualizarCertificado = async (record: CertificadoUsuarioDTO) => {
    try {
      setLoadingDownload(record.id);
      const response = await downloadCertificado(record.id);
      if (response.sucesso && response.dados?.urlDownload) {
        window.open(response.dados.urlDownload, '_blank');
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao obter certificado para download',
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao obter certificado para download',
      });
    } finally {
      setLoadingDownload(null);
    }
  };

  const onClickVisualizarDeclaracao = async (record: DeclaracaoUsuarioDTO) => {
    try {
      setLoadingDownload(record.id);
      const response = await downloadDeclaracao(record.id);
      if (response.sucesso && response.dados?.urlDownload) {
        window.open(response.dados.urlDownload, '_blank');
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao obter declaração para download',
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao obter declaração para download',
      });
    } finally {
      setLoadingDownload(null);
    }
  };

  const colunasCertificados: ColumnsType<any> = [
    {
      title: 'Código do certificado',
      dataIndex: 'codigoCertificado',
      render: (v: number) => String(v).padStart(5, '0'),
    },
    {
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
    },
    {
      title: 'Código de homologação',
      dataIndex: 'numeroHomologacao',
    },
    {
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Tipo de certificado',
      dataIndex: 'tipoParticipacao',
      render: (v: number) => mapTipoParticipacao(v),
    },
    {
      title: 'Ações',
      width: 200,
      render: (_: any, record: CertificadoUsuarioDTO) => (
        <Button
          type='default'
          icon={<FiDownload />}
          loading={loadingDownload === record.id}
          onClick={() => onClickVisualizarCertificado(record)}
          style={{
            width: 190,
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Baixar certificado
        </Button>
      ),
    },
  ];

  const colunasDeclaracoes: ColumnsType<any> = [
    {
      title: 'Código da declaração',
      dataIndex: 'codigoDeclaracao',
      render: (v: number) => String(v).padStart(5, '0'),
    },
    {
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
    },
    {
      title: 'Código da formação',
      dataIndex: 'codigoFormacao',
    },
    {
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Tipo de declaração',
      dataIndex: 'tipoParticipacao',
      render: (v: number) => mapTipoParticipacao(v),
    },
    {
      title: 'Ações',
      width: 200,
      render: (_: any, record: DeclaracaoUsuarioDTO) => (
        <Button
          type='default'
          icon={<FiDownload />}
          loading={loadingDownload === record.id}
          onClick={() => onClickVisualizarDeclaracao(record)}
          style={{
            width: 190,
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Baixar declaração
        </Button>
      ),
    },
  ];

  const buscarCertificados = async (pagina: number, tamanhoPagina: number) => {
    const range = form.getFieldValue('dataEmissao');
    const filtros = {
      NumeroHomologacao: form.getFieldValue('numeroHomologacao'),
      NomeFormacao: form.getFieldValue('nomeFormacao'),
      CodigoCertificado: form.getFieldValue('codigoCertificado'),
      TipoParticipacao: form.getFieldValue('tipoCertificado'),
      DataEmissaoInicio: range?.[0] ? dayjs(range[0]).format('YYYY-MM-DD') : undefined,
      DataEmissaoFim: range?.[1] ? dayjs(range[1]).format('YYYY-MM-DD') : undefined,
      NumeroPagina: pagina,
      NumeroRegistros: tamanhoPagina,
    };
    const resp = await obterCertificadosUsuario(filtros);
    return resp;
  };

  const buscarDeclaracoes = async (pagina: number, tamanhoPagina: number) => {
    const range = form.getFieldValue('dataEmissao');
    const filtros = {
      CodigoFormacao: form.getFieldValue('codigoFormacao'),
      NomeFormacao: form.getFieldValue('nomeFormacao'),
      CodigoDeclaracao: form.getFieldValue('codigoDeclaracao'),
      TipoParticipacao: form.getFieldValue('tipoDeclaracao'),
      DataEmissaoInicio: range?.[0] ? dayjs(range[0]).format('YYYY-MM-DD') : undefined,
      DataEmissaoFim: range?.[1] ? dayjs(range[1]).format('YYYY-MM-DD') : undefined,
      NumeroPagina: pagina,
      NumeroRegistros: tamanhoPagina,
    };
    const resp = await obterDeclaracoesUsuario(filtros);
    return resp;
  };

  const buscar = async (pagina = 1, tamanhoPagina = pageSize, aba: AbaType = abaAtiva) => {
    try {
      setLoading(true);
      setDados([]);
      let resp: any;
      if (aba === 'certificados') {
        resp = await buscarCertificados(pagina, tamanhoPagina);
      } else {
        resp = await buscarDeclaracoes(pagina, tamanhoPagina);
      }

      if (resp.sucesso && resp.dados) {
        setDados(resp.dados.items);
        setTotal(resp.dados.totalRegistros);
        setPaginaAtual(pagina);
      } else {
        setDados([]);
        setTotal(0);
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: `Erro ao buscar ${aba}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscar(1);
  }, []);

  const changeTable = (pagination: any) => {
    const newPageSize = pagination.pageSize || 10;
    const newCurrent = pagination.current || 1;

    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPaginaAtual(1);
      buscar(1, newPageSize);
      return;
    }

    if (newCurrent !== paginaAtual) {
      setPaginaAtual(newCurrent);
      buscar(newCurrent, pageSize);
    }
  };

  const renderFiltros = () => (
    <Form form={form} layout='vertical'>
      <Row gutter={[16, 8]}>
        <Col md={8} style={{ display: abaAtiva === 'certificados' ? 'block' : 'none' }}>
          <b>
            <InputNumero
              formItemProps={{ label: 'Código do certificado', name: 'codigoCertificado' }}
              inputProps={{ placeholder: 'Exemplo: 1234567' }}
            />
          </b>
        </Col>
        <Col md={8} style={{ display: abaAtiva === 'declaracoes' ? 'block' : 'none' }}>
          <b>
            <InputNumero
              formItemProps={{ label: 'Código da declaração', name: 'codigoDeclaracao' }}
              inputProps={{ placeholder: 'Exemplo: 1234567' }}
            />
          </b>
        </Col>

        <Col md={8}>
          <b>
            <InputTexto
              formItemProps={{ label: 'Nome da formação', name: 'nomeFormacao' }}
              inputProps={{ placeholder: 'Digite o nome da formação...' }}
            />
          </b>
        </Col>
        
        <Col md={8} style={{ display: abaAtiva === 'certificados' ? 'block' : 'none' }}>
          <b>
            <InputNumero
              formItemProps={{ label: 'Código de homologação', name: 'numeroHomologacao' }}
              inputProps={{ placeholder: 'Exemplo: 00000000' }}
            />
          </b>
        </Col>
        <Col md={8} style={{ display: abaAtiva === 'declaracoes' ? 'block' : 'none' }}>
          <b>
            <InputNumero
              formItemProps={{ label: 'Código da formação', name: 'codigoFormacao' }}
              inputProps={{ placeholder: 'Exemplo: 00000000' }}
            />
          </b>
        </Col>
      </Row>

      <Row gutter={[16, 8]}>
        <Col md={12}>
          <b>
            <Form.Item label='Data de emissão' name='dataEmissao'>
              <RangePicker style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} placeholder={['Data inicial', 'Data final'] as any} />
            </Form.Item>
          </b>
        </Col>

        <Col md={12} style={{ display: abaAtiva === 'certificados' ? 'block' : 'none' }}>
          <b>
            <Form.Item label='Tipo de certificado' name='tipoCertificado'>
              <Select
                allowClear
                placeholder='Selecione'
                options={[
                  { label: 'Cursista', value: 1 },
                  { label: 'Regente', value: 2 },
                ]}
              />
            </Form.Item>
          </b>
        </Col>
        <Col md={12} style={{ display: abaAtiva === 'declaracoes' ? 'block' : 'none' }}>
          <b>
            <Form.Item label='Tipo de declaração' name='tipoDeclaracao'>
              <Select
                allowClear
                placeholder='Selecione'
                options={[
                  { label: 'Cursista', value: 1 },
                  { label: 'Regente', value: 2 },
                ]}
              />
            </Form.Item>
          </b>
        </Col>
      </Row>

      <Row justify='end' gutter={8} style={{ marginTop: 16 }}>
        <Col>
          <Button
            style={{ borderColor: '#ff6b35', color: '#ff6b35' }}
            onClick={() => {
              if (abaAtiva === 'certificados') {
                 form.resetFields(['codigoCertificado', 'numeroHomologacao', 'tipoCertificado', 'nomeFormacao', 'dataEmissao']);
              } else {
                 form.resetFields(['codigoDeclaracao', 'codigoFormacao', 'tipoDeclaracao', 'nomeFormacao', 'dataEmissao']);
              }
              setTotal(0);
              setPaginaAtual(1);
              setFiltroAplicado(false);
              buscar(1);
            }}
          >
            Limpar
          </Button>
        </Col>
        <Col>
          <Button
            type='primary'
            loading={loading}
            style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
            onClick={() => {
              setFiltroAplicado(true);
              setPaginaAtual(1);
              buscar(1);
            }}
          >
            Filtrar
          </Button>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      <style>
        {`
          .abas-certificados .ant-tabs-nav {
            width: 100%;
          }

          .abas-certificados .ant-tabs-nav-list {
            display: flex;
          }

          .abas-certificados .ant-tabs-tab {
            display: flex;
            justify-content: flex-start;
          }

          .abas-certificados .ant-tabs-tab-btn {
            text-align: left;
            font-weight: 500;
          }

          .abas-certificados .ant-tabs-tab-active .ant-tabs-tab-btn {
            font-weight: 600;
          }

          .abas-certificados .ant-tabs-nav-wrap {
            width: 100%;
          }
        `}
      </style>
      <Col>
        <HeaderPage title='Certificados e declarações' />

        <CardContent>
          <p style={{ marginBottom: 24 }}>
            Aqui você confere os certificados e declarações obtidos nas formações que já realizou. Se preferir, você pode buscar utilizando os campos de filtro.
          </p>

          <Tabs
            className="abas-certificados"
            type="card"
            activeKey={abaAtiva}
            onChange={(key) => {
              setTotal(0);
              setPaginaAtual(1);
              setAbaAtiva(key as AbaType);
              buscar(1, pageSize, key as AbaType);
            }}
            items={[
              { key: 'certificados', label: 'Certificados' },
              { key: 'declaracoes', label: 'Declarações' },
            ].map(item => ({
              ...item,
              children: abaAtiva === item.key ? (
                <>
                  {renderFiltros()}
                  <div className='codaf-supplementary-result'>
                    <Table
                      rowKey='id'
                      columns={abaAtiva === 'certificados' ? colunasCertificados : colunasDeclaracoes}
                      dataSource={dados}
                      style={{ marginTop: 24 }}
                      loading={loading}
                      pagination={{
                        current: paginaAtual,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 30, 50, 100],
                        locale: { items_per_page: '' },
                      }}
                      onChange={changeTable}
                    />
                  </div>
                </>
              ) : null
            }))}
          />
          <style>{tableWrapperStyle}</style>
        </CardContent>
      </Col>
    </>
  );
};

export default MeusCertificados;
