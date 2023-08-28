import { Button, Col, Form, Input, Row, Select, notification } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import InputTelefone from '~/components/lib/telefone';
import ButtonVoltar from '~/components/main/button/voltar';
import Auditoria from '~/components/main/text/auditoria';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME, CF_INPUT_TELEFONE } from '~/core/constants/ids/input';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_EXCLUIR_REGISTRO,
} from '~/core/constants/mensagens';
import { AreaPromotoraDTO } from '~/core/dto/area-promotora-dto';
import { AreaPromotoraTipoDTO } from '~/core/dto/area-promotora-tipo-dto';
import { GrupoDTO } from '~/core/dto/grupo-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from '~/core/services/api';
import areaPromotoraService from '~/core/services/area-promotora-service';
import grupoService from '~/core/services/grupo-service';

const AreaPromotoraNovo: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const dispatch = useAppDispatch();

  const { Option } = Select;
  const id = paramsRoute?.id || 0;

  const [listaGrupos, setListaGrupos] = useState<GrupoDTO[]>();
  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>();
  const [formInitialValues, setFormInitialValues] = useState<AreaPromotoraDTO>();

  const tituloPagina = paramsRoute?.id
    ? 'Alteração da Área Promotora'
    : 'Cadastro da Área Promotora';

  const validateMessages: FormProps['validateMessages'] = {
    required: 'Campo obrigatório',
    string: {
      range: 'Por favor, digite Nome',
    },
    types: {
      email: 'Por favor, Informe um e-mail válido',
    },
    whitespace: 'Campo obrigatório',
  };

  const urlBase = 'v1/AreaPromotora';

  const carregarDados = useCallback(async () => {
    const resposta = await obterRegistro<any>(`${urlBase}/${id}`);

    if (resposta.sucesso) {
      setFormInitialValues(resposta.dados);
    }
  }, [urlBase, id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  const obterGrupos = useCallback(() => {
    dispatch(setSpinning(true));
    grupoService
      .obterGrupos()
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setListaGrupos(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [dispatch]);

  const obterTipos = useCallback(() => {
    dispatch(setSpinning(true));
    areaPromotoraService
      .obterTipo()
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setListaTipos(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [dispatch]);

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          navigate(ROUTES.AREA_PROMOTORA);
        },
      });
    } else {
      navigate(ROUTES.AREA_PROMOTORA);
    }
  };

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const salvar = async (values: any) => {
    let response = null;
    if (id) {
      response = await alterarRegistro(urlBase, {
        id,
        ...values,
      });
    } else {
      response = await inserirRegistro(urlBase, values);
    }

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: `Registro ${id ? 'alterado' : 'inserido'} com sucesso!`,
      });
      navigate(ROUTES.AREA_PROMOTORA);
    }
  };

  const onClickExcluir = () => {
    if (id) {
      confirmacao({
        content: DESEJA_EXCLUIR_REGISTRO,
        onOk() {
          deletarRegistro(`${urlBase}/${id}`).then((response) => {
            if (response.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: 'Registro excluído com sucesso',
              });
              navigate(ROUTES.AREA_PROMOTORA);
            }
          });
        },
      });
    }
  };

  const obterAreaPromotora = useCallback(async () => {
    dispatch(setSpinning(true));
    areaPromotoraService
      .obterAreaPromotoraPorId(id)
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setFormInitialValues(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [dispatch, id]);

  useEffect(() => {
    obterGrupos();
    obterTipos();
    if (id) {
      obterAreaPromotora();
    }
  }, [obterGrupos, obterTipos, id, obterAreaPromotora]);

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={salvar}
        validateMessages={validateMessages}
        initialValues={formInitialValues}
      >
        <HeaderPage title={tituloPagina}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
              {id ? (
                <Col>
                  <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={onClickExcluir} />
                </Col>
              ) : (
                <></>
              )}
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      onClick={onClickCancelar}
                      style={{ fontWeight: 700 }}
                      disabled={!form.isFieldsTouched()}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                >
                  {id ? 'Alterar' : 'Salvar'}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name='nome'
              label='Nome'
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input
                type='text'
                placeholder={'Nome da área promotra'}
                maxLength={50}
                showCount
                id={CF_INPUT_NOME}
              />
            </Form.Item>
            <Form.Item
              name='tipoId'
              label='Tipo'
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <Select placeholder='Selecione o Tipo' allowClear>
                {listaTipos?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.nome}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name='grupoId'
              label='Perfil'
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Select placeholder='Selecione o Perfil' allowClear>
                {listaGrupos?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.nome}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <InputTelefone inputProps={{ id: CF_INPUT_TELEFONE }} />
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name='email'
              label='E-mail'
              rules={[{ required: false, type: 'email' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input
                type='email'
                placeholder={'Informe o E-mail'}
                maxLength={100}
                showCount
                id={CF_INPUT_NOME}
              />
            </Form.Item>
          </Form.Item>
          <Auditoria dados={formInitialValues} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default AreaPromotoraNovo;
