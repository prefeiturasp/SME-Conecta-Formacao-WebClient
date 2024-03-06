import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';

import { AxiosError, HttpStatusCode } from 'axios';
import { FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/main/erro-geral-login';
import { CF_BUTTON_ACESSAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_LOGIN, CF_INPUT_SENHA } from '~/core/constants/ids/input';
import {
  ERRO_EMAIL_NAO_VALIDADO,
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN
} from '~/core/constants/mensagens';
import { AutenticacaoDTO } from '~/core/dto/autenticacao-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { ROUTES } from '~/core/enum/routes-enum';
import { Colors } from '~/core/styles/colors';
import { CF_BUTTON_ESQUECI_SENHA } from '../../core/constants/ids/button/intex';

import { notification } from '~/components/lib/notification';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { confirmacao } from '~/core/services/alerta-service';
import autenticacaoService from '~/core/services/autenticacao-service';
import usuarioService from '~/core/services/usuario-service';
import { validarAutenticacao } from '~/core/utils/perfil';

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const [erroGeral, setErroGeral] = useState<string[]>();

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const onClickCriarConta = () => navigate(ROUTES.CADASTRO_DE_USUARIO);
  const onClickEsqueciSenha = () => navigate(ROUTES.REDEFINIR_SENHA, { state: login });
  const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
    const dataErro = erro?.response?.data;

    if (erro?.response?.status === HttpStatusCode.Unauthorized) {
      setErroGeral(dataErro?.mensagens);

      if (dataErro?.mensagens.includes(ERRO_EMAIL_NAO_VALIDADO)) {
        confirmacao({
          content: dataErro?.mensagens,
          onOk() {
            usuarioService.reenviarEmail(login).then((resposta) => {
              if (resposta.sucesso) {
                notification.success({
                  message: 'Sucesso',
                  description: 'E-mail reenviado com sucesso!',
                });
              }
            });
          },
          okText: 'Reenviar',
          cancelText: 'Cancelar',
        });
      }
      return;
    }

    if (typeof dataErro === 'string') {
      setErroGeral([dataErro]);
      return;
    }

    if (dataErro?.mensagens?.length) {
      setErroGeral(dataErro.mensagens);
      return;
    }

    setErroGeral([ERRO_LOGIN]);
  };

  const onFinish = (values: AutenticacaoDTO) => {
    dispatch(setSpinning(true));
    autenticacaoService
      .autenticar(values)
      .then((resposta) => {
        if (resposta?.data?.autenticado) {
          //TODO Ambiente clarity ainda será criado
          //window.clarity('identify', loginValidado);
          validarAutenticacao(resposta.data);
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
  };

  const onFinishFailed = ({ values }: ValidateErrorEntity<AutenticacaoDTO>) => {
    if (!values?.login && !values?.senha) {
      setErroGeral([ERRO_INFORMAR_USUARIO_SENHA]);
    }
  };

  const tooltipLogin = () => {
    return (
      <>
        <p>
          Rede direta: Informe o RF
          <br />
          Rede parceira: Informe o CPF. Caso ainda não possua acesso clique na opção
          &quot;Cadastre-se&quot;
        </p>
      </>
    );
  };

  return (
    <Col span={14}>
      <Form
        requiredMark='optional'
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        autoComplete='off'
        validateMessages={validateMessages}
      >
        <Row justify='center' gutter={[0, 14]}>
          <Col span={24}>
            <Form.Item
              tooltip={{
                title: tooltipLogin,
                icon: (
                  <Tooltip>
                    <FaQuestionCircle color={Colors.Neutral.DARK} />
                  </Tooltip>
                ),
              }}
              label='Usuário'
              name='login'
              hasFeedback={!login}
              rules={[{ required: true }, { min: 5 }]}
            >
              <Input
                placeholder='Informe o usuário'
                suffix={<span />}
                maxLength={100}
                id={CF_INPUT_LOGIN}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              tooltip={{
                title:
                  'Informe a senha de acesso aos sistemas da SME (Plateia, Intranet, SGP). Caso nunca tenha acessado tente informar a senha padrão que é Sgp e os últimos 4 dígitos do RF.',
                icon: (
                  <Tooltip>
                    <FaQuestionCircle color={Colors.Neutral.DARK} />
                  </Tooltip>
                ),
              }}
              label='Senha'
              name='senha'
              hasFeedback={!senha}
              rules={[{ required: true }, { min: 4 }]}
            >
              <Input.Password
                autoComplete='off'
                placeholder='Informe a senha'
                maxLength={100}
                id={CF_INPUT_SENHA}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 25]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              type='primary'
              block
              htmlType='submit'
              style={{ fontWeight: 700 }}
              id={CF_BUTTON_ACESSAR}
            >
              Acessar
            </Button>
          </Col>
          <Col span={24}>
            <Button
              type='text'
              block
              style={{ fontSize: 12 }}
              onClick={() => onClickEsqueciSenha()}
              id={CF_BUTTON_ESQUECI_SENHA}
            >
              Esqueci minha senha
            </Button>
          </Col>
          {erroGeral ? (
            <Col span={24}>
              <ErroGeralLogin erros={erroGeral} />
            </Col>
          ) : (
            <></>
          )}
          <Col span={24}>
            <Button
              block
              style={{ fontWeight: 700 }}
              id={CF_BUTTON_ACESSAR}
              onClick={() => onClickCriarConta()}
            >
              Cadastre-se
            </Button>
          </Col>
        </Row>
      </Form>
    </Col>
  );
};

export default Login;
