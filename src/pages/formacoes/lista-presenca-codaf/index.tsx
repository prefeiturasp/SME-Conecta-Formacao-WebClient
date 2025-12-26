import { Button, Col, Dropdown, Form, MenuProps, Row, Select, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  CodafListaPresencaDTO,
  obterListaPresencaCodaf,
} from '~/core/services/codaf-lista-presenca-service';
import { onClickVoltar } from '~/core/utils/form';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';

const ListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.ListaPresencaCodaf);

  const [dados, setDados] = useState<CodafListaPresencaDTO[]>([]);
  //const [dadosOriginais, setDadosOriginais] = useState<CodafListaPresencaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [registrosPorPagina] = useState(10);

  const situacoes = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando DF' },
    { id: 3, descricao: 'Devolvido pelo DF' },
    { id: 4, descricao: 'Finalizado' },
  ];

  const turmas = [
    { label: 'DRE FB', value: 1 },
    { label: 'DRE CS', value: 2 },
    { label: 'DRE CL', value: 3 },
    { label: 'DRE BT', value: 4 },
    { label: 'DRE MP', value: 5 },
    { label: 'Turma 1', value: 6 },
  ];

  const onClickNovo = () => {
    console.log('Novo registro');
  };

  const onClickEmitirCertificado = (record: CodafListaPresencaDTO) => {
    console.log('Emitir certificado para:', record);
    notification.success({
      message: 'Certificado',
      description: `Emitindo certificado para ${record.nomeFormacao}`,
    });
  };

  const getMenuAcoes = (record: CodafListaPresencaDTO): MenuProps => ({
    items: [
      {
        key: '.TXT EOL',
        label: '.TXT EOL',
        onClick: () => console.log('Visualizar', record),
      },
      {
        key: 'CODAF',
        label: 'CODAF',
        onClick: () => console.log('Editar', record),
      }
    ],
  });

  const obterSituacaoTexto = (status: number): string => {
    const situacao = situacoes.find((s) => s.id === status);
    return situacao?.descricao || 'Desconhecido';
  };

  const columns: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'codigoFormacao',
      title: 'Código da formação',
      dataIndex: 'codigoFormacao',
      width: 100,
    },
    {
      key: 'numeroHomologacao',
      title: 'Número de homologação',
      dataIndex: 'numeroHomologacao',
      width: 140,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      ellipsis: true,
    },
    {
      key: 'nomeAreaPromotora',
      title: 'Área promotora',
      dataIndex: 'nomeAreaPromotora',
      width: 150,
      ellipsis: true,
    },
    {
      key: 'nomeTurma',
      title: 'Turma',
      dataIndex: 'nomeTurma',
      width: 120,
      ellipsis: true,
    },
    {
      key: 'status',
      title: 'Situação',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => obterSituacaoTexto(status),
    },
    {
      key: 'certificado',
      title: 'Certificado',
      width: 150,
      render: (_: any, record: CodafListaPresencaDTO) => (
        <Button
          type='default'
          icon={<FiPrinter />}
          onClick={() => onClickEmitirCertificado(record)}
          style={{
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Emitir certificados
        </Button>
      ),
    },
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: CodafListaPresencaDTO) => (
        <Dropdown menu={getMenuAcoes(record)} trigger={['click']} placement='bottomRight'>
          <Button
            type='default'
            icon={<BsThreeDotsVertical />}
            style={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
            }}
          />
        </Dropdown>
      ),
    },
  ];

  const buscarDados = async (pagina = 1) => {
    setLoading(true);
    try {
      const periodoEnvio = form.getFieldValue('periodoEnvio');
      const dataEnvioDf = periodoEnvio?.[0]
        ? dayjs(periodoEnvio[0]).format('YYYY-MM-DD')
        : undefined;

      const filtros = {
        NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
        CodigoFormacao: form.getFieldValue('codigoFormacao') || undefined,
        NumeroHomologacao: form.getFieldValue('numeroHomologacao') || undefined,
        //PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
        AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
        Status: form.getFieldValue('situacao'),
        DataEnvioDf: dataEnvioDf,
        NumeroPagina: pagina,
        NumeroRegistros: registrosPorPagina,
      };

      const response = await obterListaPresencaCodaf(filtros);

      if (response.sucesso && response.dados) {
        let dadosFiltrados = response.dados.items || [];

        // Filtro manual por turma
        const turmaIdSelecionada = form.getFieldValue('turmaId');
        if (turmaIdSelecionada) {
          const turmaSelecionada = turmas.find(t => t.value === turmaIdSelecionada);
          if (turmaSelecionada) {
            dadosFiltrados = dadosFiltrados.filter(
              item => item.nomeTurma === turmaSelecionada.label
            );
          }
        }

        setDados(dadosFiltrados);
        setTotalRegistros(dadosFiltrados.length);
        setPaginaAtual(pagina);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar dados da lista de presença CODAF',
        });
        setDados([]);
        setTotalRegistros(0);
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar dados da lista de presença CODAF',
      });
      setDados([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  };

  const onClickFiltrar = () => {
    buscarDados(1);
  };

  const onClickLimpar = () => {
    form.resetFields();
    setDados([]);
    setTotalRegistros(0);
    setPaginaAtual(1);
  };

  const handleTableChange = (pagination: any) => {
    buscarDados(pagination.current);
  };

  return (
    <Col>
      <HeaderPage title='Lista Presença Codaf'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                disabled={!permissao.podeIncluir}
                onClick={() => onClickNovo()}
                style={{ fontWeight: 700 }}
              >
                Novo registro
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Nome da formação',
                    name: 'nomeFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome da formação',
                    maxLength: 100,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <SelectAreaPromotora formItemProps={{ name: 'areaPromotoraId' }} />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Código da formação',
                    name: 'codigoFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                    maxLength: 100,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Número de homologação',
                    name: 'numeroHomologacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NUMERO_HOMOLOGACAO,
                    placeholder: 'Número de homologação',
                    maxLength: 100,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                  <Select placeholder='Selecione a turma' options={turmas} allowClear />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <DatePickerPeriodo
                  formItemProps={{
                    label: 'Período de envio para finalizar',
                    name: 'periodoEnvio',
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Situação' name='situacao' rules={[{ required: false }]}>
                  <Select
                    placeholder='Selecione a situação'
                    options={situacoes.map((s) => ({ label: s.descricao, value: s.id }))}
                    allowClear
                  />
                </Form.Item>
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
            <Col>
              <Button
                type='default'
                onClick={onClickLimpar}
                style={{
                  fontWeight: 700,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                }}
              >
                Limpar
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
          <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={dados}
                rowKey='id'
                loading={loading}
                pagination={{
                  current: paginaAtual,
                  pageSize: registrosPorPagina,
                  total: totalRegistros,
                  showSizeChanger: false,
                  showTotal: (total) => `Total de ${total} registros`,
                  style: { textAlign: 'center' },
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                locale={{
                  emptyText: 'Não encontramos registros para os filtros aplicados',
                }}
              />
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};

export default ListaPresencaCodaf;
