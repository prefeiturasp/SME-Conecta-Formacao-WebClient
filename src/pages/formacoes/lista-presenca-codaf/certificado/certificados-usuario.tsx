import { Button, Col, DatePicker, Form, Row, Select, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import React, { useState } from 'react';
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
} from '~/core/services/codaf-lista-presenca-service';

const { RangePicker } = DatePicker;

const MeusCertificados: React.FC = () => {
  const [form] = Form.useForm();
  const [dados, setDados] = useState<CertificadoUsuarioDTO[]>([]);
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
        return '—';
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

  const colunas = [
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
      title: 'Cód. de homologação',
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
      title: 'Ação',
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

  const buscar = async (pagina = 1) => {
    try {
      setLoading(true);

      const range = form.getFieldValue('dataEmissao');

      const filtros = {
        NumeroHomologacao: form.getFieldValue('numeroHomologacao'),
        NomeFormacao: form.getFieldValue('nomeFormacao'),
        CodigoCertificado: form.getFieldValue('codigoCertificado'),
        TipoParticipacao: form.getFieldValue('tipoCertificado'),
        DataEmissaoInicio: range?.[0] ? dayjs(range[0]).format('YYYY-MM-DD') : undefined,
        DataEmissaoFim: range?.[1] ? dayjs(range[1]).format('YYYY-MM-DD') : undefined,
        NumeroPagina: pagina,
        NumeroRegistros: pageSize,
      };

      const resp = await obterCertificadosUsuario(filtros);

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
        description: 'Erro ao buscar certificados',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col>
      <HeaderPage title='Meus certificados' />

      <CardContent>
        <p style={{ marginBottom: 24 }}>
          Aqui você confere os certificados obtidos nas formações que já realizou. Se preferir, você
          pode buscar utilizando os campos de filtro.
        </p>

        <Form form={form} layout='vertical'>
          <Row gutter={[16, 8]}>
            <Col md={8}>
              <InputNumero
                formItemProps={{
                  label: 'Código de homologação',
                  name: 'numeroHomologacao',
                }}
                inputProps={{ placeholder: 'Código de homologação' }}
              />
            </Col>

            <Col md={8}>
              <InputTexto
                formItemProps={{
                  label: 'Nome da formação',
                  name: 'nomeFormacao',
                }}
                inputProps={{ placeholder: 'Nome da formação' }}
              />
            </Col>

            <Col md={8}>
              <Form.Item label='Data de emissão' name='dataEmissao'>
                <RangePicker style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col md={8}>
              <InputNumero
                formItemProps={{
                  label: 'Código do certificado',
                  name: 'codigoCertificado',
                }}
                inputProps={{ placeholder: 'Código do certificado' }}
              />
            </Col>

            <Col md={8}>
              <Form.Item label='Tipo de certificado' name='tipoCertificado'>
                <Select
                  allowClear
                  options={[
                    { label: 'Cursista', value: 1 },
                    { label: 'Regente', value: 2 },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify='end' gutter={8} style={{ marginTop: 16 }}>
            <Col>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDados([]);
                  setTotal(0);
                  setFiltroAplicado(false);
                }}
              >
                Limpar
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                loading={loading}
                onClick={() => {
                  setFiltroAplicado(true);
                  buscar(1);
                }}
              >
                Filtrar
              </Button>
            </Col>
          </Row>
        </Form>

        {filtroAplicado && (
          <Table
            rowKey='id'
            columns={colunas}
            dataSource={dados}
            style={{ marginTop: 24 }}
            loading={loading}
            pagination={{
              current: paginaAtual,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (p, ps) => {
                setPageSize(ps);
                buscar(p);
              },
            }}
          />
        )}
      </CardContent>
    </Col>
  );
};

export default MeusCertificados;
