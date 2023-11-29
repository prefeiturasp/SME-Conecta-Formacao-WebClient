import { Button, Col, Drawer, Form, Row, Space, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTableContext } from '~/components/lib/card-table/provider';
import ButtonExcluir from '~/components/lib/excluir-button';
import EditorTexto from '~/components/main/input/editor-texto';
import InputRegistroFuncional from '~/components/main/input/input-registro-funcional';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
import { CF_BUTTON_EXCLUIR, CF_BUTTON_MODAL_CANCELAR } from '~/core/constants/ids/button/intex';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaRegenteDTO } from '~/core/dto/proposta-regente-dto';
import { confirmacao } from '~/core/services/alerta-service';
import {
  excluirRegente,
  obterPropostaRegentePorId,
  salvarPropostaProfissionalRegente,
} from '~/core/services/proposta-service';
import { PermissaoContext } from '~/routes/config/permissao-provider';

type DrawerRegenteProps = {
  openModal: boolean;
  onCloseModal: () => void;
  id?: number;
};

const DrawerRegente: React.FC<DrawerRegenteProps> = ({ openModal, onCloseModal, id = 0 }) => {
  const { tableState } = useContext(DataTableContext);

  const { desabilitarCampos } = useContext(PermissaoContext);

  const [formDrawer] = useForm();
  const paramsRoute = useParams();

  const [formInitialValues, setFormInitialValues] = useState<PropostaRegenteDTO>();

  const propostaId = paramsRoute?.id || 0;

  const fecharModal = (reloadData = false, checkFieldsTouched = true) => {
    if (checkFieldsTouched && formDrawer.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          onCloseModal();
          formDrawer.resetFields();
          if (reloadData) {
            tableState.reloadData();
          }
        },
      });
    } else {
      onCloseModal();
      formDrawer.resetFields();
      if (reloadData) {
        tableState.reloadData();
      }
    }
  };

  const salvarDados = async (values: PropostaRegenteDTO) => {
    const dtoRegente: PropostaRegenteDTO = {
      ...values,
      turmas: values.turmas.map((turma: any) => ({ turma })),
      id,
    };

    const response = await salvarPropostaProfissionalRegente(dtoRegente, propostaId);

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Registro salvo com Sucesso!',
      });
      fecharModal(true, false);
    }
  };

  const excluirDados = async () => {
    const response = await excluirRegente(id);

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
      const response = await obterPropostaRegentePorId(id);

      if (response.sucesso) {
        if (response.dados?.turmas?.length) {
          response.dados.turmas = response.dados.turmas.map((item) => item?.turma);
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

  const onClickCancelar = () => {
    if (formDrawer.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          formDrawer.resetFields();
        },
      });
    }
  };

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
            title='Regente'
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
                      onClick={onClickCancelar}
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
                        formDrawer.resetFields(['registroFuncional', 'nomeRegente']);
                        formDrawer.setFieldValue('registroFuncional', '');
                        formDrawer.setFieldValue('nomeRegente', '');
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
                          <InputRegistroFuncional
                            formItemPropsRF={{ rules: [{ required: rfEhObrigatorio }] }}
                            formItemPropsNome={{
                              rules: [{ required: !rfEhObrigatorio }],
                              name: 'nomeRegente',
                            }}
                            inputPropsRF={{
                              disabled: desabilitarCampos || !rfEhObrigatorio,
                              onChange: (e) => {
                                const value = e.target.value;
                                if (!value || value.length < 7) {
                                  formDrawer.resetFields(['nomeRegente']);
                                  formDrawer.setFieldValue('nomeRegente', '');
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
                  <EditorTexto
                    nome='miniBiografia'
                    label='Mini biografia'
                    required={false}
                    exibirTooltip={true}
                    disabled={desabilitarCampos}
                    mensagemTooltip='Breve resumo contendo a formação e principais atividades realizadas na temática da ação de formação proposta. Indicar link do Currículo Lattes, caso tenha.'
                  />
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

export default DrawerRegente;
