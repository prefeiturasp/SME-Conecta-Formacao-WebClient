import { Button, Col, Drawer, Form, Input, Row, TimePicker, Space, notification } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import React from 'react';
import SelectTipoEncontro from '~/components/main/input/tipo-encontro';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'dayjs/locale/pt-br';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import DatePickerMultiplos from '~/components/main/input/data-lista';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { EncontroTurmaDatasDto } from '../../../core/dto/cronograma-encontros-paginado-dto';
type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  form: FormInstance;
  onCloseModal: VoidFunction;
  idProposta: number;
};
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);
const format = 'HH:mm';
const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  idProposta,
  form,
}) => {
  const { RangePicker } = TimePicker;
  const [formDrawer] = useForm();
  const { TextArea } = Input;
  const validiarPeriodo = () => {
    const periodoRealizacao = form?.getFieldValue('periodoRealizacao');
    if (!periodoRealizacao) {
      notification.warning({
        message: 'Atenção',
        description: 'Informe a dada do Período de realização',
      });

      return false;
    }

    return true;
  };
  const validarSeEstaDentroDoPeriodo = (datas: EncontroTurmaDatasDto[]) => {
    const periodoRealizacao = form?.getFieldValue('periodoRealizacao');
    const periodoInicio = new Date(periodoRealizacao[0]);
    const periodoFim = new Date(periodoRealizacao[1]);
    for (let index = 0; index < datas.length; index++) {
      const dataFim =
        datas[index].dataFim != null
          ? datas[index].dataFim?.toDateString()
          : datas[index].dataInicio.toDateString();
      if (
        !(
          new Date(datas[index].dataInicio.toDateString()) >=
            new Date(periodoInicio.toDateString()) &&
          new Date(dataFim!) <= new Date(periodoFim.toDateString())
        )
      ) {
        notification.warning({
          message: 'Atenção',
          description: 'As dadas devem estar dentro do Período de realização',
        });
      }
    }
  };
  const validarDataInicialEFinal = (datas: EncontroTurmaDatasDto[]) => {
    for (let index = 0; index < datas.length; index++) {
      const dataFim =
        datas[index].dataFim != null
          ? new Date(datas[index].dataFim!.toDateString())
          : new Date(datas[index].dataInicio.toDateString());

      const dataInicio = new Date(datas[index].dataInicio?.toDateString());

      if (dataFim != null && dataFim < dataInicio) {
        notification.warning({
          message: 'Atenção',
          description: 'A data final não pode ser menor que a data inicial ',
        });
        return false;
      }
    }
    return true;
  };
  const obterDadosForm = () => {
    if (validiarPeriodo()) {
      formDrawer.submit();
      const horarios = formDrawer.getFieldValue('horarios');
      const horaInicio = new Date(horarios[0]).toLocaleTimeString('pt-BR');
      const horaFim = new Date(horarios[1]).toLocaleTimeString('pt-BR');
      const datas = Array<EncontroTurmaDatasDto>();
      const dataInicial = new Date(formDrawer.getFieldValue('dataInicial'));

      const dataFinal = formDrawer.getFieldValue('dataFinal')
        ? new Date(formDrawer.getFieldValue('dataFinal'))
        : null;
      const dataPrincial: EncontroTurmaDatasDto = { dataInicio: dataInicial, dataFim: dataFinal };
      datas.push(dataPrincial);

      const dataAdicionada = formDrawer.getFieldValue('datas');
      for (let index = 0; index < dataAdicionada?.length; index++) {
        const inicio = new Date(dataAdicionada[index].dataInicial);
        const final = dataAdicionada[index].dataFinal
          ? new Date(dataAdicionada[index].dataFinal)
          : null;
        const dataSelecionada: EncontroTurmaDatasDto = { dataInicio: inicio, dataFim: final };
        datas.push(dataSelecionada);
      }
      if (validarDataInicialEFinal(datas)) {
        validarSeEstaDentroDoPeriodo(datas);
        const dto: CronogramaEncontrosPaginadoDto = {
          idProposta: idProposta,
          local: formDrawer.getFieldValue('local'),
          datas: datas,
          horaFim: horaInicio,
          horaInicio: horaFim,
          tipoEncontro: formDrawer.getFieldValue('tipoEncontro'),
          turmasId: formDrawer.getFieldValue('turma'),
        };
        console.log(dto);
        //salvarDados(dto);
      }
    }
  };
  const fecharModal = () => {
    formDrawer.resetFields();
    onCloseModal();
  };
  return (
    <>
      {openModal ? (
        <>
          {openModal ? (
            <>
              <Drawer
                title='Encontro de turmas'
                width={720}
                onClose={fecharModal}
                open
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    <Button onClick={onCloseModal}>Cancelar</Button>
                    <Button onClick={obterDadosForm} type='primary'>
                      Salvar
                    </Button>
                  </Space>
                }
              >
                <Form form={formDrawer} layout='vertical' autoComplete='off'>
                  <Row gutter={[16, 16]}>
                    <Col span={10}>
                      <SelectTurmaEncontros idProposta={idProposta} />
                    </Col>
                    <Col span={12}>
                      <DatePickerMultiplos />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name='horarios'
                        label='Hora de início e Fim'
                        rules={[{ required: true, message: 'Informe a Hora de início e Fim' }]}
                      >
                        <RangePicker
                          format={format}
                          allowClear
                          style={{ width: '328px' }}
                          locale={localeDatePicker}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <SelectTipoEncontro />
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        label='Local'
                        name='local'
                        rules={[{ required: true, message: 'Informe o local' }]}
                      >
                        <TextArea
                          maxLength={200}
                          minLength={1}
                          showCount
                          placeholder='Informe o Local'
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Drawer>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DrawerFormularioEncontroTurmas;
