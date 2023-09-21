import { Button, Col, FormInstance, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import styled from 'styled-components';
import DataTable from '~/components/lib/card-table';
import DatePickerPeriodo from '~/components/main/input/date-range';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { Colors } from '~/core/styles/colors';
type FormDatasProps = {
  form: FormInstance;
};

const columns: ColumnsType<CronogramaEncontrosPaginadoDto> = [
  { key: 'turma', title: 'Turma', dataIndex: 'turma' },
  { key: 'data', title: 'Data', dataIndex: 'data' },
  { key: 'hora', title: 'Hora', dataIndex: 'hora' },
  { key: 'tipoEncontro', title: 'Tipo de Encontro', dataIndex: 'tipoEncontro' },
];
const url = '';
const contentStyle: React.CSSProperties = {
  fontSize: 18,
  color: Colors.ORANGE_CONECTA_FORMACAO,
  fontWeight: 'bold',
};
const stuleButtonAddData: React.CSSProperties = {
  float: 'right',
  textAlign: 'center',
  width: '200px',
  marginBottom: '10px',
  marginTop: '2px',
  marginLeft: '750px',
};
const contentStyleTituloListagem: React.CSSProperties = {
  fontSize: 16,
  color: 'black',
  fontWeight: 'bold',
};
const FormularioDatas: React.FC<FormDatasProps> = ({ form }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const abrirModal = async () => {
    setOpenModal(true);
  };
  return (
    <>
      <Col>
        <Col xs={24} sm={14} md={24} style={contentStyle}>
          Cronograma geral
        </Col>
        <Col xs={24} sm={14} md={24} lg={24} xl={5}>
          <b>
            <DatePickerPeriodo
              label='Período de realização'
              name='periodoRealizacaoFormDatas'
              required
              exibirTooltip
              titleToolTip='Primeiro dia da primeira turma até o último dia da última turma.'
            />
          </b>
        </Col>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={14} md={24} style={contentStyle}>
            Cronograma de encontros
          </Col>
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
        <Row>
          <Col xs={24} sm={14} md={24} style={contentStyleTituloListagem}>
            Listagem de encontros
          </Col>
        </Row>
        <Col span={24}>
          <DataTable url={url} columns={columns} />
        </Col>
        <Col xs={24} sm={14} md={24} style={contentStyle}>
          Inscrição
        </Col>
        <Col xs={24} sm={10} md={7} lg={7} xl={5}>
          <b>
            <DatePickerPeriodo
              label='Período de inscricao'
              name='periodoIncricaoFormDatas'
              required
            />
          </b>
        </Col>
      </Col>
    </>
  );
};

export default FormularioDatas;
