import { Button, Col, Drawer, Form, Row, Space, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonExcluir from '~/components/lib/excluir-button';
import { notification } from '~/components/lib/notification';
import EditorTexto from '~/components/main/input/editor-texto';
import InputRegistroFuncionalNome from '~/components/main/input/input-registro-funcional-nome';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTodasTurmas from '~/components/main/input/selecionar-todas-turmas';
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
import { onClickCancelar } from '~/core/utils/form';
import { formatterCPFMask } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

type DrawerRegenteProps = {
  openModal: boolean;
  onCloseModal: (recarregarLista: boolean) => void;
  id?: number;
};

const DrawerRegente: React.FC<DrawerRegenteProps> = ({ openModal, onCloseModal, id = 0 }) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const [formDrawer] = useForm();
  const paramsRoute = useParams();

  const [formInitialValues, setFormInitialValues] = useState<PropostaRegenteDTO>();
  const [carregando, setCarregando] = useState<boolean>(false);

  const propostaId = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

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

  const salvarDados = async (values: PropostaRegenteDTO) => {
    const dtoRegente: PropostaRegenteDTO = {
      ...values,
      turmas: values.turmas.map((turmaId: any) => ({ turmaId })),
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
    setCarregando(true);
    if (id) {
      const response = await obterPropostaRegentePorId(id);

      if (response.sucesso) {
        if (response.dados?.turmas?.length) {
          response.dados.turmas = response.dados.turmas.map((item) => item?.turmaId);
        }
        if (response.dados.cpf) response.dados.cpf = formatterCPFMask(response.dados.cpf);
        setFormInitialValues({ ...response.dados });
        setCarregando(false);
        return;
      }
    }
    setCarregando(false);
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
            <Spin spinning={carregando}> </Spin>
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
                        formDrawer.setFieldValue('cpf', '');
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
                            exibirCpf={!ehRedeMunicipal}
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
                  <SelectTodasTurmas
                    idProposta={propostaId}
                    exibirTooltip={false}
                    onChange={() => {
                      () => {
                        ('');
                      };
                    }}
                  />
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
