import { Button, Col, Form, Row, Select, Table } from 'antd';
import { FormListFieldData } from 'antd/es/form';
import { createGlobalStyle } from 'styled-components';
import { InfoCircleFilled, PlusOutlined } from '@ant-design/icons';
import { GrupoPeriodoFormDTO, PropostaTurmaFormDTO } from '~/core/dto/proposta-dto';
import ButtonExcluir from '~/components/lib/excluir-button';
import { ColumnsType } from 'antd/es/table';
import editIcon from '~/assets/material-symbols_edit-outline.svg';
import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTableEncontros from '~/components/lib/card-table-encontros';
import DrawerFormularioEncontroTurmas from '~/components/lib/drawer/drawer-form-encontro-turmas';
import { notification } from '~/components/lib/notification';
import { DatePickerPeriodo } from '~/components/main/input/date-range';
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
const PeriodoTurmaSelectStyle = createGlobalStyle`
  .periodo-turma-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #f0f0f0;
    font-weight: normal;
  }
  .periodo-turma-select-dropdown .ant-select-item-option-state {
    display: none;
  }
  .periodo-turma-select-dropdown .ant-select-item-option {
    padding: 8px 12px;
  }
`;

type TurmaOption = { label: string; value: number | undefined; disabled: boolean };

type GrupoPeriodoRowProps = {
  field: FormListFieldData;
  opcoesDisponiveis: TurmaOption[];
  onAdd: () => void;
  onRemove: (name: number) => void;
};

const GrupoPeriodoRow: React.FC<GrupoPeriodoRowProps> = ({
  field,
  opcoesDisponiveis,
  onAdd,
  onRemove,
}) => (
  <Row key={field.key} gutter={[8, 4]} style={{ marginBottom: 12 }}>
    <Col xs={24} sm={12}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          color: '#42474A',
          lineHeight: '100%',
          marginBottom: 8,
        }}
      >
        Turmas
      </div>
      <Form.Item name={[field.name, 'propostaTurmasIds']} noStyle>
        <Select
          mode='multiple'
          placeholder='Selecione uma ou mais turmas'
          style={{ width: '100%' }}
          popupClassName='periodo-turma-select-dropdown'
          options={opcoesDisponiveis}
          optionRender={(option) =>
            option.data.disabled ? (
              <span style={{ color: '#8c8c8c', display: 'block', width: '100%' }}>
                {option.label}
              </span>
            ) : (
              option.label
            )
          }
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          color: '#42474A',
          lineHeight: '100%',
          marginBottom: 8,
        }}
      >
        Período de realização
      </div>
      <Row gutter={[8, 0]} wrap={false} align='middle'>
        <Col flex='1'>
          <DatePickerPeriodo
            formItemProps={{
              name: [field.name, 'periodo'],
              style: { marginBottom: 0 },
            }}
          />
        </Col>
        <Col>
          {field.name === 0 ? (
            <Button
              type='default'
              block
              icon={<PlusOutlined />}
              onClick={onAdd}
              style={{
                fontSize: 18,
                width: '43px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          ) : (
            <ButtonExcluir onClick={() => onRemove(field.name)} />
          )}
        </Col>
      </Row>
    </Col>
  </Row>
);

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
  const gruposPeriodosWatch: GrupoPeriodoFormDTO[] = Form.useWatch('gruposPeriodos', form) ?? [];

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
      <PeriodoTurmaSelectStyle />
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
          <Col xs={24}>
            <p
              style={{
                fontWeight: 400,
                fontSize: 14,
                color: '#42474A',
                lineHeight: '100%',
                margin: 0,
              }}
            >
              Defina o período geral da formação e as datas em que cada turma será realizada.
            </p>
          </Col>
          <Col xs={24} style={{ paddingTop: '24px' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: '#42474A',
                lineHeight: '100%',
                width: '100%',
              }}
            >
              <span style={{ color: '#b40c02' }}>*</span> Período geral da formação
            </div>
            <p
              style={{
                fontWeight: 400,
                fontSize: 14,
                color: '#42474A',
                lineHeight: '100%',
                width: '100%',
                margin: '4px 0 8px 0',
                paddingTop:'8px'
              }}
            >
              Defina o intervalo do início da primeira turma até o término da última.
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <ButtonParecer campo={CampoConsideracaoEnum.periodoRealizacao}>
              <b>
                <DatePickerPeriodo
                  formItemProps={{
                    label: null,
                    name: 'periodoRealizacao',
                    rules: [{ required: true, message: PERIODO_REALIZACAO_NAO_INFORMADO }],
                  }}
                />
              </b>
            </ButtonParecer>
          </Col>
          <Col xs={24}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: '#42474A',
                lineHeight: '100%',
                marginBottom: 8,
              }}
            >
              Período da realização por turma
            </div>
            <p
              style={{
                fontWeight: 400,
                fontSize: 14,
                color: '#42474A',
                lineHeight: '100%',
                marginBottom: 4,
                paddingTop: '8px',
                paddingBottom: '16px',
              }}
            >
              Defina o período em que as turmas selecionadas realizarão a formação. Se não for
              informado, será considerado o período definido em &quot;Período geral da
              formação&quot;.
            </p>
            <Form.List name='gruposPeriodos' initialValue={[{}]}>
              {(fields, { add, remove }) => {
                const turmas: PropostaTurmaFormDTO[] = form.getFieldValue('turmas') ?? [];
                const turmaOptions = turmas
                  .filter((t) => t.id)
                  .map((t) => ({ label: t.nome, value: t.id }))
                  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { numeric: true }));

                return (
                  <>
                    {fields.map((field) => {
                      const turmasSelecionadasEmOutrosGrupos = gruposPeriodosWatch
                        .filter((_, index) => index !== field.name)
                        .flatMap((g) => g.propostaTurmasIds ?? []);
                      const turmasSelecionadasNesteGrupo: number[] =
                        gruposPeriodosWatch[field.name]?.propostaTurmasIds ?? [];
                      const opcoesDisponiveis = turmaOptions.map((opt) => ({
                        ...opt,
                        disabled:
                          turmasSelecionadasEmOutrosGrupos.includes(opt.value as number) &&
                          !turmasSelecionadasNesteGrupo.includes(opt.value as number),
                      }));

                      return (
                        <GrupoPeriodoRow
                          key={field.key}
                          field={field}
                          opcoesDisponiveis={opcoesDisponiveis}
                          onAdd={() => add({})}
                          onRemove={remove}
                        />
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
            
            <div
              style={{
                border: '1px solid #F1F1F1',
                background: '#FAFAFA',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              <InfoCircleFilled
                style={{ color: '#086397', fontSize: 20, flexShrink: 0, marginRight: 5 }}
              />
              
              <span style={{ fontSize: 14, color: '#42474A' }}>
                Selecione uma ou mais turmas e atribua datas de início e fim da formação. Para
                turmas com datas diferentes, adicione uma nova linha e defina um período específico.
                É possível configurar várias turmas em lote ou ajustar cada turma individualmente.
              </span>
            </div>
          </Col>
          <Col xs={24} style={{ marginTop: 16 }}>
            <div
              style={{
                height: 1,
                backgroundColor: '#F0F0F0',
                marginBottom: 32,
              }}
            />
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
