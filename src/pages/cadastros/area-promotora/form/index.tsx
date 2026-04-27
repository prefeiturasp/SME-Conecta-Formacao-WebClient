import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import EmailLista from '~/components/main/input/email-lista';
import SelectPerfil from '~/components/main/input/perfil/select-perfil';
import TelefoneLista from '~/components/main/input/telefone-lista';
import Auditoria from '~/components/main/text/auditoria';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { DESEJA_EXCLUIR_REGISTRO } from '~/core/constants/mensagens';
import {
  CadastroAreaPromotoraRequestDTO,
  EmailAreaPromotora,
  TelefoneAreaPromotora,
} from '~/core/dto/area-promotora-dto';
import { AreaPromotoraTipoDTO } from '~/core/dto/area-promotora-tipo-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarAreaPromotora,
  deletarAreaPromotora,
  inserirAreaPromotora,
  obterAreaPromotoraPorId,
  obterTiposAreaPromotora,
} from '~/core/services/area-promotora-service';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { SelectDREAreaPromotora } from './components/select-dre-area-promotora';
import { SelectCoordenadoria } from '../../coordenadoria/components/select-coordenadoria/select-coordenadoria';

const { Option } = Select;

const FormCadastrosAreaPromotora: React.FC = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const paramsRoute = useParams();

  const { desabilitarCampos, permissao } = useContext(PermissaoContext);

  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>();
  const [dadosAuditoria, setDadosAuditoria] = useState<any>();

  const id = paramsRoute?.id || 0;

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

  const carregarDados = useCallback(async () => {
    const resposta = await obterAreaPromotoraPorId(id);

    if (resposta.sucesso && resposta.dados) {
      const dados = resposta.dados;
      
      form.setFieldsValue({
        ...dados,
        telefones: dados.telefones?.length ? dados.telefones : [{ telefone: '' }],
        emails: dados.emails?.length ? dados.emails : [{ email: '' }],
        perfil: dados.grupoId ? { value: dados.grupoId, visaoId: dados.visaoId } : undefined,
        coordenadoriaId: dados.coordenadoria?.id,
      });

      setDadosAuditoria(dados.auditoria);
    }
  }, [id, form]);

  useEffect(() => {
    if (id) {
      carregarDados();
    } else {
      form.setFieldsValue({
        telefones: [{ telefone: '' }],
        emails: [{ email: '' }]
      });
    }
  }, [carregarDados, id, form]);

  const obterTipos = useCallback(async () => {
    const resposta = await obterTiposAreaPromotora();
    if (resposta.sucesso) {
      setListaTipos(resposta.dados);
    }
  }, []);

  const salvar = async (values: any) => {
    const payload: CadastroAreaPromotoraRequestDTO = {
      nome: values.nome,
      tipo: values.tipo,
      coordenadoriaId: values.coordenadoriaId,
      grupoId: values.perfil?.value,
      dreId: typeof values.dreId === 'object' ? values.dreId?.id : values.dreId,
      telefones: values.telefones?.filter((item: TelefoneAreaPromotora) => !!item?.telefone) ?? [],
      emails: values.emails?.filter((item: EmailAreaPromotora) => !!item?.email) ?? [],
    };

    const response = id
      ? await alterarAreaPromotora(id, payload)
      : await inserirAreaPromotora(payload);

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
          deletarAreaPromotora(id).then((response) => {
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

  useEffect(() => {
    obterTipos();
  }, [obterTipos]);

  return (
    <Col>
      <style>{`
        .form-area-promotora .ant-form-item-label > label {
            color: #42474A !important;
            font-family: 'Roboto', sans-serif !important;
            font-size: 14px !important;
            font-weight: 700 !important;
        }
        /* Força a cor do asterisco obrigatório (*) a ser a mesma do texto */
        .form-area-promotora .ant-form-item-label > label.ant-form-item-required::before {
            color: #42474A !important;
            font-family: 'Roboto', sans-serif !important;
            font-weight: 700 !important;
        }
      `}</style>
      <Form
        className='form-area-promotora'
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={salvar}
        validateMessages={validateMessages}
        disabled={desabilitarCampos}
      >
        <HeaderPage title={tituloPagina}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() =>
                    onClickVoltar({
                      form,
                      navigate,
                      route: ROUTES.AREA_PROMOTORA,
                    })
                  }
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              {id ? (
                <Col>
                  <ButtonExcluir
                    id={CF_BUTTON_EXCLUIR}
                    onClick={onClickExcluir}
                    disabled={!permissao.podeExcluir}
                  />
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
                      onClick={() => onClickCancelar({ form })}
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
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label='Área promotora'
                  key='nome'
                  name='nome'
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input
                    type='text'
                    maxLength={50}
                    id={CF_INPUT_NOME}
                    placeholder='Nome da área promotora'
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label='Tipo' key='tipo' name='tipo' rules={[{ required: true }]}>
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
              </Col>

              <Col xs={24} sm={12}>
                <SelectPerfil />
              </Col>

              <SelectDREAreaPromotora />

              <Col xs={24} sm={12}>
                <SelectCoordenadoria 
                  formItemProps={{
                    label: 'Coordenadoria',
                    name: 'coordenadoriaId',
                    rules: [{ required: false }]
                  }}
                />
              </Col>

              <TelefoneLista disabled={desabilitarCampos} />
              <EmailLista disabled={desabilitarCampos} />
            </Row>
          </Col>
          <Auditoria dados={dadosAuditoria} />
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastrosAreaPromotora;
