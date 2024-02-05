import { Button, Col, Drawer, Form, Input, Row, Space, TimePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonExcluir from '~/components/lib/excluir-button';
import { notification } from '~/components/lib/notification';
import DatePickerMultiplos from '~/components/main/input/data-lista';
import SelectTipoEncontro from '~/components/main/input/tipo-encontro';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import { CF_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';
import { validateMessages } from '~/core/constants/validate-messages';
import { dayjs } from '~/core/date/dayjs';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { DataEncontro, FormularioDrawerEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { PropostaEncontroDTO, PropostaEncontroDataDTO } from '~/core/dto/proposta-encontro-dto';
import { TipoEncontro } from '~/core/enum/tipo-encontro';
import { confirmacao } from '~/core/services/alerta-service';
import { removerPropostaEncontro, salvarPropostaEncontro } from '~/core/services/proposta-service';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';

const { TextArea } = Input;

type DrawerFormularioEncontroTurmasProps = {
  openModal: boolean;
  periodoRealizacao: DataEncontro;
  onCloseModal: (recarregarLista: boolean) => void;
  dadosEncontro?: CronogramaEncontrosPaginadoDto;
};

const DrawerFormularioEncontroTurmas: React.FC<DrawerFormularioEncontroTurmasProps> = ({
  openModal,
  onCloseModal,
  periodoRealizacao,
  dadosEncontro,
}) => {
  const [formDrawer] = useForm();
  const paramsRoute = useParams();

  const [tipoEncontroSelecionado, setTipoEncontroSelecionado] = useState(undefined);
  const [formInitialValues, setFormInitialValues] = useState<any>({
    datas: [{ dataInicio: '', dataFim: '' }],
  });

  const propostaId = paramsRoute?.id || 0;

  const carregarDados = useCallback(() => {
    const datas = dadosEncontro?.datasPeriodos.map((item: PropostaEncontroDataDTO) => ({
      dataInicio: dayjs.tz(item?.dataInicio),
      dataFim: item?.dataFim ? dayjs.tz(item?.dataFim) : null,
    }));

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
  }, [dadosEncontro]);

  useEffect(() => {
    if (dadosEncontro?.id) {
      carregarDados();
    }
  }, [carregarDados, dadosEncontro?.id]);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const dataInicial = periodoRealizacao?.dataInicio;
    const dataFinal = periodoRealizacao?.dataFim;

    return (current && current < dataInicial?.startOf('day')) || current > dataFinal?.endOf('day');
  };
  const obterTipoEncontro = () => {
    setTipoEncontroSelecionado(formDrawer.getFieldValue('tipoEncontro'));
  };
  const salvarDadosForm = async (values: FormularioDrawerEncontro) => {
    const horarios = values?.horarios;
    const horaInicio = horarios[0].format('HH:mm');
    const horaFim = horarios[1].format('HH:mm');
    const datas = values.datas.map((d) => ({
      dataInicio: d.dataInicio,
      dataFim: values?.datas[0]?.dataFim?.toString()?.length ? d.dataFim : null,
    }));
    const turmas = values.turmas.map((turmaId) => ({ turmaId }));

    const encontro: PropostaEncontroDTO = {
      id: dadosEncontro?.id || 0,
      propostaId: propostaId || 0,
      horaFim: horaFim.substring(0, 5),
      horaInicio: horaInicio.substring(0, 5),
      tipo: values.tipoEncontro,
      local: values.local,
      turmas,
      datas,
    };

    await salvarEncontro(encontro);
  };

  const salvarEncontro = async (encontro: PropostaEncontroDTO) => {
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

  const fecharModal = (recarregarLista?: boolean) => {
    if(recarregarLista){
      onCloseModal(!!recarregarLista);
    }else{
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          onCloseModal(!!recarregarLista);
          formDrawer.resetFields();
        },
      });
    }
  };

  const excluirEncontro = async () => {
    const response = await removerPropostaEncontro(dadosEncontro!.id!);
    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro excluído com Sucesso!',
      });
      fecharModal(true);
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
        <Drawer
          title='Encontro de turmas'
          size='large'
          onClose={() => fecharModal()}
          open
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
          <Form
            form={formDrawer}
            layout='vertical'
            autoComplete='off'
            initialValues={formInitialValues}
            validateMessages={validateMessages}
          >
            <Col span={24}>
              <Row gutter={[16, 8]}>
                <Col xs={24}>
                  <SelectTurmaEncontros idProposta={propostaId} />
                </Col>

                <DatePickerMultiplos disabledDate={disabledDate} />

                <Col xs={11}>
                  <Form.Item
                    name='horarios'
                    label='Hora de início e Fim'
                    rules={[{ required: true }]}
                  >
                    <TimePicker.RangePicker
                      format='HH:mm'
                      allowClear
                      style={{ width: '100%' }}
                      locale={localeDatePicker}
                    />
                  </Form.Item>
                </Col>
                <Col xs={13}>
                  <SelectTipoEncontro
                    exibirTooltip={false}
                    selectProps={{ onChange: obterTipoEncontro }}
                  />
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label='Local'
                    name='local'
                    key='local'
                    rules={[{ required: tipoEncontroSelecionado == TipoEncontro.Presencial }]}
                  >
                    <TextArea maxLength={200} placeholder='Informe o Local' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Form>
        </Drawer>
      ) : (
        <></>
      )}
    </>
  );
};

export default DrawerFormularioEncontroTurmas;
