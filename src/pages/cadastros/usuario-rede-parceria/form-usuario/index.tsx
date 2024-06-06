import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { cloneDeep } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputCPF from '~/components/main/input/cpf';
import InputEmail from '~/components/main/input/email';
import { SelectSituacaoRedeParceriaUsuario } from '~/components/main/input/situacao-rede-parceria-usuario';
import InputTelefone from '~/components/main/input/telefone';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_SALVAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import {
  NOME_NAO_INFORMADO,
  USUARIO_REDE_PARCERIA_EDITAR,
  USUARIO_REDE_PARCERIA_EXCLUIR,
  USUARIO_REDE_PARCERIA_NAO_SALVO,
  USUARIO_REDE_PARCERIA_SALVAR,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  UsuarioRedeParceriaDTO,
  UsuarioRedeParceriaPaginadoDTO,
} from '~/core/dto/usuario-rede-parceria-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import usuarioRedeParceria from '~/core/services/usuario-rede-parceria';
import { onClickCancelar, onClickVoltar } from '~/core/utils/form';
import { formatterCPFMask, maskTelefone, validateNameAndSurname } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

export const FormUsuarioRedeParceria = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { permissao } = useContext(PermissaoContext);
  const [formInitialValues, setFormInitialValues] = useState<UsuarioRedeParceriaDTO>();

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const carregarDados = useCallback(() => {
    if (id) {
      usuarioRedeParceria.obterUsuarioRedeParceriaId(id).then((resposta) => {
        if (resposta.sucesso) {
          const dados = resposta.dados;

          const cpf = formatterCPFMask(dados?.cpf);
          const telefone = maskTelefone(dados?.telefone);

          setFormInitialValues({
            ...resposta.dados,
            cpf,
            telefone,
          });
        }
      });
    }
  }, [id, formInitialValues]);

  const notificacao = (descricao: string) =>
    notification.success({
      message: 'Sucesso',
      description: descricao,
    });

  const onClickSalvar = () => {
    form.validateFields().then(() => {
      confirmacao({
        content: id ? USUARIO_REDE_PARCERIA_EDITAR : USUARIO_REDE_PARCERIA_SALVAR,
        onOk: async () => {
          const values = form.getFieldsValue();
          const clonedValues = cloneDeep(values);

          const valoresSalvar: UsuarioRedeParceriaDTO | UsuarioRedeParceriaPaginadoDTO = {
            nome: clonedValues?.nome,
            cpf: clonedValues?.cpf,
            email: clonedValues?.email,
            telefone: clonedValues?.telefone,
            areaPromotoraId: clonedValues?.areaPromotoraId,
            situacao: clonedValues?.situacao,
          };

          const endpoint = id
            ? usuarioRedeParceria.alterarUsuarioRedeParceria(id, valoresSalvar)
            : usuarioRedeParceria.inserirUsuarioRedeParceria(valoresSalvar);

          await endpoint.then((resposta) => {
            if (resposta.sucesso) {
              notificacao(resposta.dados.mensagem);
              navigate(ROUTES.USUARIO_REDE_PARCERIA);
            }
          });
        },
      });
    });
  };

  const onClickExcluir = async () => {
    if (id) {
      confirmacao({
        content: USUARIO_REDE_PARCERIA_EXCLUIR,
        onOk: async () => {
          await usuarioRedeParceria.excluirUsuarioRedeParceria(id).then((resposta) => {
            if (resposta.sucesso) {
              notificacao(resposta.dados.mensagem);
              navigate(ROUTES.USUARIO_REDE_PARCERIA);
            }
          });
        },
      });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  return (
    <Form
      form={form}
      layout='vertical'
      autoComplete='off'
      initialValues={formInitialValues}
      validateMessages={validateMessages}
    >
      <HeaderPage title='Cadastro de novo usuário'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() =>
                  onClickVoltar({
                    form,
                    navigate,
                    inverterOnOkCancel: true,
                    route: ROUTES.USUARIO_REDE_PARCERIA,
                    mensagem: USUARIO_REDE_PARCERIA_NAO_SALVO,
                  })
                }
                id={CF_BUTTON_VOLTAR}
              />
            </Col>

            {!!id && (
              <Col>
                <ButtonExcluir
                  id={CF_BUTTON_EXCLUIR}
                  disabled={!permissao.podeExcluir}
                  onClick={onClickExcluir}
                />
              </Col>
            )}

            <Col>
              <Form.Item shouldUpdate style={{ margin: 0 }}>
                {() => (
                  <ButtonSecundary
                    id={CF_BUTTON_CANCELAR}
                    disabled={!form.isFieldsTouched()}
                    onClick={() => onClickCancelar({ form })}
                  >
                    Cancelar
                  </ButtonSecundary>
                )}
              </Form.Item>
            </Col>

            <Col>
              <Form.Item shouldUpdate style={{ margin: 0 }}>
                {() => (
                  <ButtonPrimary
                    id={CF_BUTTON_SALVAR}
                    onClick={onClickSalvar}
                    disabled={!form.isFieldsTouched()}
                  >
                    {id ? 'Alterar' : 'Salvar'}
                  </ButtonPrimary>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <SelectAreaPromotora usuarioRedeParceria formItemProps={{ required: true }} />
            </Col>

            <Col xs={24} md={12}>
              <InputCPF formItemProps={{ required: true }} inputProps={{ disabled: !!id }} />
            </Col>

            <Col xs={24} md={12}>
              <InputTexto
                formItemProps={{
                  label: 'Nome do usuário',
                  name: 'nome',
                  rules: [
                    {
                      required: true,
                      message: NOME_NAO_INFORMADO,
                    },
                    {
                      validator: (_, value) =>
                        validateNameAndSurname({ form, nameField: 'nome', value }),
                    },
                  ],
                }}
                inputProps={{
                  id: CF_INPUT_NOME,
                  placeholder: 'Nome do usuário',
                  maxLength: 100,
                }}
              />
            </Col>

            <Col xs={24} md={12}>
              <InputEmail formItemProps={{ required: true }} />
            </Col>

            <Col xs={24} md={12}>
              <InputTelefone formItemProps={{ required: true }} />
            </Col>

            <Col xs={24} md={12}>
              <SelectSituacaoRedeParceriaUsuario formItemProps={{ required: true }} />
            </Col>
          </Row>
        </Col>
      </CardContent>
    </Form>
  );
};
