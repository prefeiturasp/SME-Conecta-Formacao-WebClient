import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
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
import { NOME_NAO_INFORMADO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickCancelar, onClickExcluir, onClickVoltar } from '~/core/utils/form';
import { validateNameAndSurname } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

export const FormUsuarioRedeParceria = () => {
  const [form] = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const { permissao } = useContext(PermissaoContext);

  const initialValues = location.state;
  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const onClickSalvar = () => {
    form.validateFields().then((resposta) => {
      if (resposta.sucesso) {
      }
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <HeaderPage title='Cadastro de novo usuário'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() => onClickVoltar({ navigate, route: ROUTES.USUARIO_REDE_PARCERIA })}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>

              {!!id && (
                <Col>
                  <ButtonExcluir
                    id={CF_BUTTON_EXCLUIR}
                    disabled={!permissao.podeExcluir}
                    onClick={() =>
                      onClickExcluir({ navigate, route: ROUTES.USUARIO_REDE_PARCERIA })
                    }
                  />
                </Col>
              )}

              <Col>
                <Button
                  block
                  type='default'
                  id={CF_BUTTON_CANCELAR}
                  onClick={() => onClickCancelar({ form })}
                  disabled={!form.isFieldsTouched()}
                >
                  Cancelar
                </Button>
              </Col>

              <Col>
                <ButtonPrimary id={CF_BUTTON_SALVAR} onClick={onClickSalvar}>
                  Salvar
                </ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8} md={12}>
                <SelectAreaPromotora formItemProps={{ required: true }} />
              </Col>

              <Col xs={24} sm={8} md={12}>
                <InputCPF formItemProps={{ required: true }} />
              </Col>

              <Col xs={24} sm={8} md={12}>
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

              <Col xs={24} sm={8} md={12}>
                <InputEmail formItemProps={{ required: true }} />
              </Col>

              <Col xs={24} sm={8} md={12}>
                <InputTelefone formItemProps={{ required: true }} />
              </Col>

              <Col xs={24} sm={8} md={12}>
                <SelectSituacaoRedeParceriaUsuario formItemProps={{ required: true }} />
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
