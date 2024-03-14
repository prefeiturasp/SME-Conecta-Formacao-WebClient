import { Button, Col, Drawer, Form, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonExcluir from '~/components/lib/excluir-button';
import { notification } from '~/components/lib/notification';
import InputRegistroFuncionalNome from '~/components/main/input/input-registro-funcional-nome';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import { CF_BUTTON_EXCLUIR, CF_BUTTON_MODAL_CANCELAR } from '~/core/constants/ids/button/intex';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaTutorDTO } from '~/core/dto/proposta-tutor-dto';
import { confirmacao } from '~/core/services/alerta-service';
import {
  excluirTutor,
  obterPropostaTutorPorId,
  salvarPropostaProfissionalTutor,
} from '~/core/services/proposta-service';
import { onClickCancelar } from '~/core/utils/form';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

type DrawerTutorProps = {
  openModal: boolean;
  onCloseModal: (recarregarLista: boolean) => void;
  id?: number;
};

const DrawerTutor: React.FC<DrawerTutorProps> = ({ openModal, onCloseModal, id = 0 }) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const [formDrawer] = useForm();
  const paramsRoute = useParams();

  const [formInitialValues, setFormInitialValues] = useState<PropostaTutorDTO>();

  const propostaId = paramsRoute?.id || 0;

  const fecharModal = (reloadData = false, checkFieldsTouched = true) => {
    if (checkFieldsTouched && formDrawer.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          onCloseModal(reloadData);
          formDrawer.resetFields();
        },
      });
    } else {
      onCloseModal(reloadData);
      formDrawer.resetFields();
    }
  };

  const salvarDados = async (values: PropostaTutorDTO) => {
    const dtoTutor: PropostaTutorDTO = {
      ...values,
      turmas: values.turmas.map((turmaId: any) => ({ turmaId })),
      id,
    };

    const response = await salvarPropostaProfissionalTutor(dtoTutor, propostaId);

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro salvo com Sucesso!',
      });
      fecharModal(true, false);
    }
  };

  const excluirDados = async () => {
    const response = await excluirTutor(id);

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro excluído com Sucesso!',
      });
      fecharModal(true);
    }
  };

  const obterDados = useCallback(async () => {
    if (id) {
      const response = await obterPropostaTutorPorId(id);

      if (response.sucesso) {
        if (response.dados?.turmas?.length) {
          response.dados.turmas = response.dados.turmas.map((item) => item?.turmaId);
        }

        setFormInitialValues({ ...response.dados });

        return;
      }
    }
  }, [id]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  useEffect(() => {
    formDrawer.resetFields();
  }, [formDrawer, formInitialValues]);

  return (
    <>
      {openModal ? (
        <Form
          form={formDrawer}
          layout='vertical'
          autoComplete='off'
          initialValues={
            formInitialValues || {
              profissionalRedeMunicipal: true,
            }
          }
          validateMessages={validateMessages}
          disabled={desabilitarCampos}
        >
          <Drawer
            title='Tutor'
            size='large'
            onClose={() => fecharModal()}
            open
            extra={
              <Space>
                {id ? (
                  <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={() => excluirDados()} />
                ) : (
                  <></>
                )}

                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_MODAL_CANCELAR}
                      onClick={() => onClickCancelar({ form: formDrawer })}
                      style={{ fontWeight: 700 }}
                      disabled={!formDrawer.isFieldsTouched()}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
                <Button
                  type='primary'
                  onClick={() => {
                    formDrawer.validateFields().then(salvarDados);
                  }}
                >
                  Salvar
                </Button>
              </Space>
            }
          >
            <Col span={24}>
              <Row gutter={[16, 8]}>
                <Col xs={12}>
                  <RadioSimNao
                    formItemProps={{
                      name: 'profissionalRedeMunicipal',
                      label: 'Profissional da rede municipal',
                    }}
                    radioGroupProps={{
                      onChange: () => {
                        formDrawer.resetFields(['registroFuncional', 'nomeTutor']);
                        formDrawer.setFieldValue('registroFuncional', '');
                        formDrawer.setFieldValue('nomeTutor', '');
                      },
                    }}
                  />
                </Col>
                <Col xs={24}>
                  <Form.Item shouldUpdate>
                    {(form) => {
                      const ehRedeMunicipal = form.getFieldValue('profissionalRedeMunicipal');
                      const rfEhObrigatorio = ehRedeMunicipal;

                      return (
                        <Row gutter={[16, 8]}>
                          <InputRegistroFuncionalNome
                            formItemPropsRF={{ rules: [{ required: rfEhObrigatorio }] }}
                            formItemPropsNome={{
                              rules: [{ required: desabilitarCampos || !rfEhObrigatorio }],
                              name: 'nomeTutor',
                            }}
                            inputPropsRF={{
                              disabled: !rfEhObrigatorio,
                              onChange: (e) => {
                                const value = e.target.value;
                                if (!value || value.length < 7) {
                                  formDrawer.resetFields(['nomeTutor']);
                                  formDrawer.setFieldValue('nomeTutor', '');
                                }
                              },
                            }}
                            inputPropsNome={{
                              disabled: desabilitarCampos || rfEhObrigatorio,
                            }}
                          />
                        </Row>
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <SelectTurmaEncontros idProposta={propostaId} exibirTooltip={false} />
                </Col>
              </Row>
            </Col>
          </Drawer>
        </Form>
      ) : (
        <></>
      )}
    </>
  );
};

export default DrawerTutor;
