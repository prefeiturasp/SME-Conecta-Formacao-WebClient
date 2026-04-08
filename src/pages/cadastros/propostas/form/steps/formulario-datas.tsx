import { Button, Col, Form, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import editIcon from '~/assets/material-symbols_edit-outline.svg';
import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTableEncontros from '~/components/lib/card-table-encontros';
import DrawerFormularioEncontroTurmas from '~/components/lib/drawer/drawer-form-encontro-turmas';
import { notification } from '~/components/lib/notification';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import {
  PERIODO_INSCRICAO_NAO_INFORMADO,
  PERIODO_REALIZACAO_NAO_INFORMADO,
} from '~/core/constants/mensagens';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { PropostaEncontroCronogramaDataDTO } from '~/core/dto/proposta-encontro-dto';
import { DataEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { CampoConsideracaoEnum } from '~/core/enum/campos-proposta-enum';
import { Colors } from '~/core/styles/colors';
import { ButtonParecer } from '../components/modal-parecer/modal-parecer-button';

const subColumns: ColumnsType<PropostaEncontroCronogramaDataDTO> = [
  {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    render: (val: string) => new Date(val).toLocaleDateString('pt-BR'),
  },
  { key: 'horaInicio', title: 'Hora de início', dataIndex: 'horaInicio' },
  { key: 'horaFim', title: 'Hora de fim', dataIndex: 'horaFim' },
];

const renderExpandedRow = (record: CronogramaEncontrosPaginadoDto) => (
  <div style={{ padding: '20px 20px 20px 0' }}>
    <Table
      size='small'
      bordered
      columns={subColumns}
      dataSource={record.datasPeriodos}
      pagination={false}
      rowKey={(r) => String(r.id ?? r.data)}
    />
  </div>
);
const contentStyle: React.CSSProperties = {
  fontSize: 18,
  color: Colors.SystemSME.ConectaFormacao.PRIMARY,
  fontWeight: 'bold',
};
const stuleButtonAddData: React.CSSProperties = {
  textAlign: 'center',
  width: '200px',
  marginBottom: '10px',
  marginTop: '2px',
  justifyContent: 'center',
  display: 'flex',
};
const contentStyleTituloListagem: React.CSSProperties = {
  fontSize: 16,
  color: 'black',
  fontWeight: 'bold',
};
type FormularioDatasProps = {
  recarregarTurmas: boolean;
};
const FormularioDatas: React.FC<FormularioDatasProps> = (recarregarTurmas) => {
  const form = Form.useFormInstance();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const paramsRoute = useParams();
  const [dadosEncontro, setDadosEncontro] = useState<CronogramaEncontrosPaginadoDto>();
  const id = paramsRoute?.id || 0;
  const refTable = useRef<any>(null);

  const toggleExpand = (rowId: number | undefined) => {
    if (rowId === undefined) return;
    setExpandedRowKeys((prev) =>
      prev.includes(rowId) ? prev.filter((k) => k !== rowId) : [...prev, rowId],
    );
  };

  const columns: ColumnsType<CronogramaEncontrosPaginadoDto> = [
    { key: 'turmas', title: 'Turma', dataIndex: 'turmas' },
    {
      key: 'diasEncontro',
      title: 'Dias de encontro',
      render: (_, row) => String(row.datasPeriodos?.length ?? 0).padStart(2, '0'),
    },
    { key: 'tipoEncontroDescricao', title: 'Tipo de Encontro', dataIndex: 'tipoEncontroDescricao' },
    {
      key: 'acao',
      title: 'Ação',
      width: 80,
      align: 'center',
      render: (_, row) => (
        <Button
          type='text'
          size='small'
          style={{ padding: 0, lineHeight: 1 }}
          onClick={() => onClickEditar(row)}
        >
          <img src={editIcon} alt='Editar' style={{ width: 28, height: 28 }} />
        </Button>
      ),
    },
    {
      key: 'expandir',
      title: '',
      width: 48,
      align: 'center',
      render: (_, row) => (
        <Button
          type='text'
          size='small'
          disabled={false}
          style={{ padding: 0, lineHeight: 1 }}
          onClick={() => toggleExpand(row.id)}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            style={{
              transform:
                row.id !== undefined && expandedRowKeys.includes(row.id)
                  ? 'rotate(-90deg)'
                  : 'rotate(90deg)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            <path
              d='M6 3L11 8L6 13'
              stroke='#BFBFC2'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </svg>
        </Button>
      ),
    },
  ];

  const expandable = {
    expandedRowRender: renderExpandedRow,
    expandedRowKeys,
    onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedRowKeys(keys as number[]),
    showExpandColumn: false,
  };

  const datasPeriodoRealizacao = Form.useWatch('periodoRealizacao', form);

  if (recarregarTurmas) {
    refTable.current?.reloadTable();
  }

  const dataInicio = datasPeriodoRealizacao?.[0] as Dayjs;
  const dataFim = datasPeriodoRealizacao?.[1] as Dayjs;

  const periodoRealizacao: DataEncontro = {
    dataInicio,
    dataFim,
  };

  const abrirModal = () => {
    setDadosEncontro(undefined);
    const permiteAbrirModal = validarPeriodo();

    if (permiteAbrirModal) {
      setOpenModal(true);
      return true;
    }
    return false;
  };

  const validarPeriodo = () => {
    if (!dataInicio || !dataFim || !dataInicio?.isValid() || !dataFim?.isValid()) {
      notification.warning({
        message: 'Atenção',
        description: 'Informe a data do Período de realização',
      });

      return false;
    }

    return true;
  };

  const onCloseModal = (recarregarLista: boolean) => {
    setDadosEncontro(undefined);
    setOpenModal(false);

    if (recarregarLista && refTable?.current) {
      refTable.current?.reloadTable();
    }
  };

  const onClickEditar = (encontro: CronogramaEncontrosPaginadoDto) => {
    if (abrirModal()) {
      setDadosEncontro(encontro);
    }
  };

  return (
    <>
      {openModal && (
        <DrawerFormularioEncontroTurmas
          openModal={openModal}
          onCloseModal={onCloseModal}
          periodoRealizacao={periodoRealizacao}
          dadosEncontro={dadosEncontro}
        />
      )}
      <Col>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={14} md={24} style={contentStyle}>
            Cronograma geral
          </Col>
          <Col sm={24} md={12} lg={8}>
            <ButtonParecer campo={CampoConsideracaoEnum.periodoRealizacao}>
              <b>
                <DatePickerPeriodo
                  formItemProps={{
                    label: 'Período de realização',
                    name: 'periodoRealizacao',
                    tooltip: getTooltipFormInfoCircleFilled(
                      'Primeiro dia da primeira turma até o último dia da última turma.',
                    ),
                    rules: [{ required: true, message: PERIODO_REALIZACAO_NAO_INFORMADO }],
                  }}
                />
              </b>
            </ButtonParecer>
          </Col>
          <Col xs={24}>
            <Row wrap={false} justify='space-between'>
              <Col style={contentStyle}>Cronograma de encontros</Col>
              <Col>
                <Button
                  type='primary'
                  id={CF_BUTTON_NOVO}
                  onClick={abrirModal}
                  style={stuleButtonAddData}
                >
                  Adicionar datas
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={14} md={24} style={contentStyleTituloListagem}>
            Listagem de encontros
          </Col>
          <Col span={24}>
            <style>{`
              .encontros-listagem .ant-table-expanded-row > .ant-table-cell {
                background: #ffffff !important;
                padding: 0 !important;
                border-top: 1px solid #f0f0f0 !important;
              }
              .encontros-listagem .ant-table-expanded-row .ant-table-thead > tr > th {
                border-top: 1px solid #f0f0f0 !important;
              }
              .encontros-listagem .ant-table-row-expand-icon-cell,
              .encontros-listagem col.ant-table-expand-icon-col {
                width: 0 !important;
                min-width: 0 !important;
                padding: 0 !important;
              }
            `}</style>
            <DataTableEncontros
              ref={refTable}
              url={`v1/Proposta/${id}/encontro`}
              columns={columns}
              expandable={expandable}
              className='encontros-listagem'
            />
          </Col>
          <Col xs={24} sm={14} md={24} style={contentStyle}>
            Inscrição
          </Col>
          <Col sm={24} md={12} lg={8}>
            <ButtonParecer campo={CampoConsideracaoEnum.periodoInscricao}>
              <b>
                <DatePickerPeriodo
                  formItemProps={{
                    label: 'Período de inscrição',
                    name: 'periodoInscricao',
                    rules: [{ required: true, message: PERIODO_INSCRICAO_NAO_INFORMADO }],
                  }}
                />
              </b>
            </ButtonParecer>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioDatas;
