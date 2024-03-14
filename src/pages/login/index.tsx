import { Button, Col, Form, Input, Modal, Row, Tooltip, Typography } from 'antd';
import { notification } from '~/components/lib/notification';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';

import { AxiosError, HttpStatusCode } from 'axios';
import { FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/main/erro-geral-login';
import {
  CF_BUTTON_ACESSAR,
  CF_BUTTON_ALTERAR_EMAIL,
  CF_BUTTON_CANCELAR,
  CF_BUTTON_REENVIAR_EMAIL,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_LOGIN, CF_INPUT_SENHA } from '~/core/constants/ids/input';
import {
  ERRO_EMAIL_NAO_VALIDADO,
  ERRO_EMAIL_NAO_VALIDADO_ALTERAR_EMAIL,
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN,
  TOOLTIP_SENHA,
} from '~/core/constants/mensagens';
import { AutenticacaoDTO } from '~/core/dto/autenticacao-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { ROUTES } from '~/core/enum/routes-enum';
import { Colors } from '~/core/styles/colors';
import { CF_BUTTON_ESQUECI_SENHA } from '../../core/constants/ids/button/intex';

import { setSpinning } from '~/core/redux/modules/spin/actions';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import type { SearchProps } from 'antd/es/input/Search';
import Search from 'antd/es/input/Search';
import usuarioService from '~/core/services/usuario-service';

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const [erroGeral, setErroGeral] = useState<string[]>();
  const [informarEmail, setInformarEmail] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const onClickCriarConta = () => navigate(ROUTES.CADASTRO_DE_USUARIO);
  const exibirInputAlterarEmail = () => {
    setInformarEmail(true);
  };
  const onClickEsqueciSenha = () => navigate(ROUTES.REDEFINIR_SENHA, { state: login });
  const alterarEmail: SearchProps['onSearch'] = (value, _e) => {
    dispatch(setSpinning(true));
    if (value) {
      setInformarEmail(false);
      setOpenModal(false);
      usuarioService
        .alterarEmailDeValidacao({ login: login, senha: senha, email: value })
        .then((resposta) => {
          if (resposta?.status === HttpStatusCode.Ok) {
            notification.success({
              message: 'Sucesso',
              description: 'E-mail alterado com sucesso!',
            });
          }
        });
    } else {
      notification.warning({
        message: 'Atenção',
        description: 'Informe um e-mail!',
      });
    }
    dispatch(setSpinning(false));
  };
  const validarExibirErros = (erro: RetornoBaseDTO | undefined) => {
    if (erro?.status === HttpStatusCode.Unauthorized) {
      setErroGeral(erro?.mensagens);
      if (erro?.mensagens.includes(ERRO_EMAIL_NAO_VALIDADO)) {
        setOpenModal(true);
      }
      return;
    }

    if (typeof erro === 'string') {
      setErroGeral([erro]);
      return;
    }

    if (erro?.mensagens?.length) {
      setErroGeral(erro.mensagens);
      return;
    }

    setErroGeral([ERRO_LOGIN]);
  };

  const onFinish = (values: AutenticacaoDTO) => {
    dispatch(setSpinning(true));
    autenticacaoService
      .autenticar(values)
      .then((resposta) => {
        if (resposta?.dados?.autenticado) {
          //TODO Ambiente clarity ainda será criado
          //window.clarity('identify', loginValidado);
          validarAutenticacao(resposta.dados);
        } else {
          const erros: RetornoBaseDTO = {
            existemErros: resposta?.sucesso,
            mensagens: resposta?.mensagens,
            status: resposta?.status,
          };

          validarExibirErros(erros);
        }
      })
      .catch((e: AxiosError<RetornoBaseDTO>) => {
        validarExibirErros(e?.response?.data);
      })
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
    <>
      <Modal
        width={540}
        title={informarEmail ? 'Alterar e-mail de validação de usuário' : 'Atenção'}
        open={openModal}
        destroyOnClose
        closable={false}
        footer={[
          <Button
            key={CF_BUTTON_CANCELAR}
            type='text'
            onClick={() => {
              setInformarEmail(false);
              setOpenModal(false);
            }}
            style={{
              color: Colors.Neutral.DARK,
              fontWeight: 500,
              fontSize: 16,
              padding: '0px 15px',
            }}
          >
            Cancelar
          </Button>,
          <Button
            key={CF_BUTTON_REENVIAR_EMAIL}
            type='default'
            style={{
              color: Colors.SystemSME.ConectaFormacao.PRIMARY,
              border: `1px solid ${Colors.SystemSME.ConectaFormacao.PRIMARY}`,
              fontSize: 16,
              padding: '0px 15px',
              borderRadius: 4,
            }}
            onClick={() => {
              setInformarEmail(false);
              setOpenModal(false);
              usuarioService.reenviarEmail(login).then((resposta) => {
                if (resposta.sucesso) {
                  notification.success({
                    message: 'Sucesso',
                    description: 'E-mail reenviado com sucesso!',
                  });
                }
              });
            }}
          >
            Reenviar
          </Button>,
          <Button
            key={CF_BUTTON_ALTERAR_EMAIL}
            type='text'
            onClick={exibirInputAlterarEmail}
            style={{
              color: Colors.Neutral.DARK,
              fontWeight: 500,
              fontSize: 16,
              padding: '0px 15px',
            }}
          >
            Editar e-mail
          </Button>,
        ]}
      >
        {informarEmail ? (
          <Search
            placeholder='Informe o e-mail'
            allowClear
            enterButton='Alterar'
            size='large'
            onSearch={alterarEmail}
          />
        ) : (
          <Typography
            style={{ fontSize: 16, height: 'auto', width: 'auto', textAlign: 'justify' }}
            dangerouslySetInnerHTML={{ __html: ERRO_EMAIL_NAO_VALIDADO_ALTERAR_EMAIL }}
          />
        )}
      </Modal>
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
                  title: TOOLTIP_SENHA,
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
    </>
  );
};

export default Login;
