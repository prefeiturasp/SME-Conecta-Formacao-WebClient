import { Button, Col, Drawer, Form, Input, Row, TimePicker, Space, notification } from 'antd';
import { FormInstance, useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import SelectTipoEncontro from '~/components/main/input/tipo-encontro';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'dayjs/locale/pt-br';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import DatePickerMultiplos from '~/components/main/input/data-lista';
import { removerPropostaEncontro, salvarPropostaEncontro } from '~/core/services/proposta-service';
import {
  PropostaEncontroDTO,
  PropostaEncontroDataDTO,
  PropostaEncontroTurmaDTO,
} from '~/core/dto/proposta-encontro-dto';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import ButtonExcluir from '~/components/lib/excluir-button';
import { CF_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';
import { FormularioDrawerEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { RangePickerProps } from 'antd/es/date-picker';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  periodoRealizacao: {
    dataInicial: Dayjs;
    dataFinal: Dayjs;
  };
  onCloseModal: (salvou: boolean) => void;
  dadosEncontro?: CronogramaEncontrosPaginadoDto;
};

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);

const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  periodoRealizacao,
  dadosEncontro,
}) => {
  // const { RangePicker } = TimePicker;
  const [formDrawer] = useForm();
  const paramsRoute = useParams();

  const [formInitialValues, setFormInitialValues] = useState<any>();

  const propostaId = paramsRoute?.id || 0;

  // const validiarPeriodo = () => {
  //   if (!periodoRealizacao) {
  //     notification.warning({
  //       message: 'Atenção',
  //       description: 'Informe a dada do Período de realização',
  //     });

  //     return false;
  //   }

  //   return true;
  // };

  const carregarDados = useCallback(() => {
    // formDrawer.setFieldValue('local', dadosEncontro!.local);
    // formDrawer.setFieldValue('turmas', dadosEncontro!.turmasId);
    // formDrawer.setFieldValue('tipoEncontro', dadosEncontro!.tipoEncontro);

    // formDrawer.setFieldValue('horarios', [
    //   dayjs(dadosEncontro?.horarios[0], 'HH:mm'),
    //   dayjs(dadosEncontro?.horarios[1], 'HH:mm'),
    // ]);

    const datas = dadosEncontro?.datasPeriodos.map((item: any) => ({
      dataInicial: dayjs(item?.dataInicial),
      dataFinal: dayjs(item?.dataFinal),
    }));

    // formDrawer.setFieldValue('datas', datas);

    const valoresIniciais = {
      local: dadosEncontro!.local,
      turmas: dadosEncontro!.turmasId,
      tipoEncontro: dadosEncontro!.tipoEncontro,
      horarios: [
        dayjs(dadosEncontro?.horarios[0], 'HH:mm'),
        dayjs(dadosEncontro?.horarios[1], 'HH:mm'),
      ],
      datas,
    };

    setFormInitialValues({ ...valoresIniciais });

    console.log(dadosEncontro?.datasPeriodos);
  }, [dadosEncontro]);

  useEffect(() => {
    if (dadosEncontro?.id) {
      carregarDados();
    }
  }, [carregarDados, dadosEncontro?.id]);

  // const validarSeEstaDentroDoPeriodo = (datas: PropostaEncontroDataDTO[]) => {
  //   // const periodoRealizacao = form?.getFieldValue('periodoRealizacao');
  //   const periodoInicio = new Date(periodoRealizacao[0]);
  //   const periodoFim = new Date(periodoRealizacao[1]);
  //   for (let index = 0; index < datas.length; index++) {
  //     const dataFim = datas[index].dataFim ? datas[index].dataFim! : datas[index].dataInicio;
  //     if (
  //       !(
  //         new Date(datas[index].dataInicio.toDateString()) >=
  //           new Date(periodoInicio.toDateString()) &&
  //         new Date(dataFim.toDateString()) <= new Date(periodoFim.toDateString())
  //       )
  //     ) {
  //       notification.warning({
  //         message: 'Atenção',
  //         description: 'As dadas devem estar dentro do Período de realização',
  //       });
  //     }
  //   }
  // };
  // const validarDataInicialEFinal = (datas: PropostaEncontroDataDTO[]) => {
  //   for (let index = 0; index < datas.length; index++) {
  //     const dataFim =
  //       datas[index].dataFim != null ? datas[index].dataFim! : datas[index].dataInicio;

  //     const dataInicio = datas[index].dataInicio;

  //     if (dataFim != null && dataFim < dataInicio) {
  //       notification.warning({
  //         message: 'Atenção',
  //         description: 'A data final não pode ser menor que a data inicial ',
  //       });
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const dataInicial = periodoRealizacao?.dataInicial;
    const dataFinal = periodoRealizacao?.dataFinal;

    return (current && current < dataInicial?.startOf('day')) || current > dataFinal?.endOf('day');
  };

  const salvarDadosForm = async (values: FormularioDrawerEncontro) => {
    debugger;
    // if (validiarPeriodo()) {
    const horarios = values?.horarios;
    const horaInicio = horarios[0].format('hh:mm');
    const horaFim = horarios[1].format('hh:mm');

    const datas = values.datas;
    const turmas = values.turmas.map((turma) => ({ turma }));

    // const dataAdicionada = formDrawer.getFieldValue('datas');
    // for (let index = 0; index < dataAdicionada?.length; index++) {
    //   const inicio = new Date(dataAdicionada[index].dataInicial);
    //   const final = dataAdicionada[index].dataFinal
    //     ? new Date(dataAdicionada[index].dataFinal)
    //     : null;
    //   const dataSelecionada: PropostaEncontroDataDTO = {
    //     dataInicio: inicio,
    //     dataFim: final,
    //   };
    //   datas.push(dataSelecionada);
    // }
    // const turmasSelecionadas = formDrawer.getFieldValue('turmas');
    // for (let index = 0; index < turmasSelecionadas.length; index++) {
    //   const turma: PropostaEncontroTurmaDTO = { turma: turmasSelecionadas[index] };
    //   turmas.push(turma);
    // }
    // if (validarDataInicialEFinal(datas)) {
    // validarSeEstaDentroDoPeriodo(datas);
    debugger;
    const encontro: PropostaEncontroDTO = {
      id: dadosEncontro?.id || 0,
      propostaId: propostaId || 0,
      horaFim: horaFim.substring(0, 5),
      horaInicio: horaInicio.substring(0, 5),
      tipo: formDrawer.getFieldValue('tipoEncontro'),
      local: formDrawer.getFieldValue('local'),
      turmas: turmas,
      datas,
    };
    await salvarEncontro(encontro);
    // }
    // }
  };
  const salvarEncontro = async (encontro: PropostaEncontroDTO) => {
    console.log(encontro);

    const result = await salvarPropostaEncontro(propostaId, encontro);
    if (result.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro salvo com Sucesso!',
      });

      fecharModal(true);
    } else {
      notification.error({
        message: 'Erro',
        description: 'Falha ao salvar encontro!',
      });
    }
  };
  const fecharModal = (salvou?: boolean) => {
    formDrawer.resetFields();
    onCloseModal(!!salvou);
  };
  const excluirEncontro = async () => {
    const response = await removerPropostaEncontro(dadosEncontro!.id!);
    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro excluído com Sucesso!',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Falha ao excluir encontro!',
      });
    }
  };

  useEffect(() => {
    formDrawer.resetFields();
  }, [formDrawer, formInitialValues]);

  return (
    <>
      {openModal ? (
        <>
          {openModal ? (
            <Form
              form={formDrawer}
              layout='vertical'
              autoComplete='off'
              initialValues={formInitialValues}
            >
              <Drawer
                title='Encontro de turmas'
                width={720}
                onClose={() => fecharModal()}
                open
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    {dadosEncontro?.id ? (
                      <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={excluirEncontro} />
                    ) : null}
                    <Button onClick={() => fecharModal()}>Cancelar</Button>
                    <Button
                      type='primary'
                      onClick={() => {
                        formDrawer.validateFields().then(salvarDadosForm);
                      }}
                    >
                      Salvar
                    </Button>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <SelectTurmaEncontros idProposta={propostaId} />
                  </Col>
                  <Col span={12}>
                    <DatePickerMultiplos disabledDate={disabledDate} />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='horarios'
                      // key='horarios'
                      label='Hora de início e Fim'
                      rules={[{ required: true, message: 'Informe a Hora de início e Fim' }]}
                    >
                      <TimePicker.RangePicker
                        format='HH:mm'
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
                      key='local'
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
              </Drawer>
            </Form>
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
