import { Button, Col, FormInstance, Row, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import DataTableEncontros from '~/components/lib/card-table-encontros';
import DrawerFormularioEncontroTurmas from '~/components/lib/drawer';
import DatePickerPeriodo from '~/components/main/input/date-range';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { DataEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { Colors } from '~/core/styles/colors';

const columns: ColumnsType<CronogramaEncontrosPaginadoDto> = [
  { key: 'turmas', title: 'Turma', dataIndex: 'turmas' },
  { key: 'datas', title: 'Data', dataIndex: 'datas' },
  { key: 'hora', title: 'Hora', dataIndex: 'hora' },
  { key: 'tipoEncontroDescricao', title: 'Tipo de Encontro', dataIndex: 'tipoEncontroDescricao' },
];
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
type FormularioDatasProps = {
  form: FormInstance;
  idProposta?: string;
};
const FormularioDatas: React.FC<FormularioDatasProps> = ({ form, idProposta }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dadosEncontro, setDadosEncontro] = useState<CronogramaEncontrosPaginadoDto>();

  const periodoRealizacao = form?.getFieldValue('periodoRealizacao');

  const dataInicial = periodoRealizacao?.[0] as Dayjs;
  const dataFinal = periodoRealizacao?.[1] as Dayjs;

  const propostaId = idProposta ? parseInt(idProposta) : 0;

  const url_api_encontro = `v1/Proposta/${propostaId}/encontro`;

  const abrirModal = () => {
    setDadosEncontro(undefined);
    const permiteAbrirModal = validiarPeriodo();

    if (permiteAbrirModal) {
      setOpenModal(true);
      return true;
    }
    return false;
  };

  const validiarPeriodo = () => {
    debugger;
    if (dataInicial && dataFinal && dataInicial?.isValid() && dataFinal?.isValid()) {
      notification.warning({
        message: 'Atenção',
        description: 'Informe a dada do Período de realização',
      });

      return false;
    }

    return true;
  };

  const onCloseModal = (salvou: boolean) => {
    setDadosEncontro(undefined);
    setOpenModal(false);
    if (salvou) {
      // TODO - Recaregar tabela
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
        <Col xs={24} sm={14} md={24} style={contentStyle}>
          Cronograma geral
        </Col>
        <Col xs={24} sm={14} md={24} lg={24} xl={5}>
          <b>
            <DatePickerPeriodo
              label='Período de realização'
              name='periodoRealizacao'
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
          <DataTableEncontros
            url={url_api_encontro}
            columns={columns}
            onRow={(row) => ({
              onClick: () => {
                onClickEditar(row);
              },
            })}
          />
        </Col>
        <Col xs={24} sm={14} md={24} style={contentStyle}>
          Inscrição
        </Col>
        <Col xs={24} sm={10} md={7} lg={7} xl={5}>
          <b>
            <DatePickerPeriodo label='Período de inscricao' name='periodoIncricao' required />
          </b>
        </Col>
      </Col>
    </>
  );
};

export default FormularioDatas;
