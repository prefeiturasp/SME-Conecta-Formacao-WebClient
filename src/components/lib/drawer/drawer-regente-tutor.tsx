import { Button, Col, Drawer, Form, Input, Row, Space, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/pt-br';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonExcluir from '~/components/lib/excluir-button';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import { CF_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';
import { validateMessages } from '~/core/constants/validate-messages';
import { FormularioDrawerEncontro } from '~/core/dto/formulario-drawer-encontro-dto';
import { TipoEncontro } from '~/core/enum/tipo-encontro';
import { removerPropostaEncontro, salvarPropostaEncontro } from '~/core/services/proposta-service';

const { TextArea } = Input;

type DrawerRegenteTutorProps = {
  openModal: boolean;
  onCloseModal: (recarregarLista: boolean) => void;
  dadosRegenteTutor: any;
};

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);

const DrawerRegenteTutor: React.FC<DrawerRegenteTutorProps> = ({
  openModal,
  onCloseModal,
  dadosRegenteTutor,
}) => {
  const [formDrawer] = useForm();
  const paramsRoute = useParams();
  const [tipoEncontroSelecionado, setTipoEncontroSelecionado] = useState(undefined);
  const [formInitialValues, setFormInitialValues] = useState<any>({
    datas: [{ dataInicio: '', dataFim: '' }],
  });

  const propostaId = paramsRoute?.id || 0;

  const carregarDados = useCallback(() => {
    const valoresIniciais = {
      local: dadosRegenteTutor!.local,
      turmas: dadosRegenteTutor!.turmasId,
      tipoEncontro: dadosRegenteTutor!.tipoEncontro,
    };

    setFormInitialValues({ ...valoresIniciais });
  }, [dadosRegenteTutor]);

  useEffect(() => {
    if (dadosRegenteTutor) {
      carregarDados();
    }
  }, [carregarDados, dadosRegenteTutor]);

  const obterTipoEncontro = () => {
    setTipoEncontroSelecionado(formDrawer.getFieldValue('tipoEncontro'));
  };
  const salvarDadosForm = async (values: FormularioDrawerEncontro) => {
    const turmas = values.turmas.map((turma) => ({ turma }));

    const encontro = {
      id: dadosRegenteTutor?.id || 0,
      propostaId: propostaId || 0,
      tipo: values.tipoEncontro,
      local: values.local,
      turmas,
    };

    await salvarEncontro(encontro);
  };

  const salvarEncontro = async (encontro) => {
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
    formDrawer.resetFields();
    onCloseModal(!!recarregarLista);
  };

  const excluirEncontro = async () => {
    const response = await removerPropostaEncontro(dadosRegenteTutor!.id!);
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
          title='Regente/Tutor'
          size='large'
          onClose={() => fecharModal()}
          open
          extra={
            <Space>
              {dadosRegenteTutor?.id ? (
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

export default DrawerRegenteTutor;
