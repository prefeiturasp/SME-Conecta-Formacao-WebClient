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
  downloadCertificado,
  obterDeclaracoesUsuario,
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

  const isCertificado = abaAtiva === 'certificados';
  const labelTipo = isCertificado ? 'certificado' : 'declaração';

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

  const onClickVisualizar = async (record: any) => {
    try {
      setLoadingDownload(record.id);
      const action = isCertificado ? downloadCertificado : downloadDeclaracao;
      const response = await action(record.id);
      if (response.sucesso && response.dados?.urlDownload) {
        window.open(response.dados.urlDownload, '_blank');
      } else {
        notification.error({
          message: 'Erro',
          description: `Erro ao obter ${labelTipo} para download`,
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: `Erro ao obter ${labelTipo} para download`,
      });
    } finally {
      setLoadingDownload(null);
    }
  };

  const colunasDocumentos: ColumnsType<any> = [
    {
      title: `Código d${isCertificado ? 'o certificado' : 'a declaração'}`,
      dataIndex: isCertificado ? 'codigoCertificado' : 'codigoDeclaracao',
      render: (v: number) => String(v).padStart(5, '0'),
    },
    {
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
    },
    {
      title: isCertificado ? 'Código de homologação' : 'Código da formação',
      dataIndex: isCertificado ? 'numeroHomologacao' : 'codigoFormacao',
    },
    {
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: `Tipo de ${labelTipo}`,
      dataIndex: 'tipoParticipacao',
      render: (v: number) => mapTipoParticipacao(v),
    },
    {
      title: 'Ações',
      width: 200,
      render: (_: any, record: any) => (
        <Button
          type='default'
          icon={<FiDownload />}
          loading={loadingDownload === record.id}
          onClick={() => onClickVisualizar(record)}
          style={{
            width: 190,
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Baixar {labelTipo}
        </Button>
      ),
    },
  ];

  const buscar = async (pagina = 1, tamanhoPagina = pageSize, aba: AbaType = abaAtiva) => {
    try {
      setLoading(true);
      setDados([]);
      const range = form.getFieldValue('dataEmissao');
      const isCert = aba === 'certificados';
      
      const filtros: any = {
        NomeFormacao: form.getFieldValue('nomeFormacao'),
        TipoParticipacao: form.getFieldValue(isCert ? 'tipoCertificado' : 'tipoDeclaracao'),
        DataEmissaoInicio: range?.[0] ? dayjs(range[0]).format('YYYY-MM-DD') : undefined,
        DataEmissaoFim: range?.[1] ? dayjs(range[1]).format('YYYY-MM-DD') : undefined,
        NumeroPagina: pagina,
        NumeroRegistros: tamanhoPagina,
      };

      if (isCert) {
        filtros.NumeroHomologacao = form.getFieldValue('numeroHomologacao');
        filtros.CodigoCertificado = form.getFieldValue('codigoCertificado');
      } else {
        filtros.CodigoFormacao = form.getFieldValue('codigoFormacao');
        filtros.CodigoDeclaracao = form.getFieldValue('codigoDeclaracao');
      }

      const action = isCert ? obterCertificadosUsuario : obterDeclaracoesUsuario;
      const resp = await action(filtros);

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
        <Col md={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: `Código d${isCertificado ? 'o certificado' : 'a declaração'}`,
                name: isCertificado ? 'codigoCertificado' : 'codigoDeclaracao'
              }}
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
        
        <Col md={8}>
          <b>
            <InputNumero
              formItemProps={{
                label: isCertificado ? 'Código de homologação' : 'Código da formação',
                name: isCertificado ? 'numeroHomologacao' : 'codigoFormacao'
              }}
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

        <Col md={12}>
          <b>
            <Form.Item
              label={`Tipo de ${labelTipo}`}
              name={isCertificado ? 'tipoCertificado' : 'tipoDeclaracao'}
            >
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
              const baseFields = ['nomeFormacao', 'dataEmissao'];
              const customFields = isCertificado 
                ? ['codigoCertificado', 'numeroHomologacao', 'tipoCertificado']
                : ['codigoDeclaracao', 'codigoFormacao', 'tipoDeclaracao'];
              
              form.resetFields([...baseFields, ...customFields]);
              
              setTotal(0);
              setPaginaAtual(1);
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
                      columns={colunasDocumentos}
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
