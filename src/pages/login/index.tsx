import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import { useState } from 'react';

import { useForm, useWatch } from 'antd/es/form/Form';

import { useAppDispatch } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';

import { AxiosError } from 'axios';
import ErroGeralLogin from '~/components/main/erro-geral-login';
import { CF_BUTTON_ACESSAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_LOGIN, CF_INPUT_SENHA } from '~/core/constants/ids/input';
import {
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN,
  ERRO_LOGIN_SENHA_INCORRETOS,
} from '~/core/constants/mensagens';
import { AutenticacaoDTO } from '~/core/dto/autenticacao-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { ValidateErrorEntity } from '~/core/dto/validate-error-entity';
import { setDadosLogin } from '~/core/redux/modules/auth/actions';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { FaQuestionCircle } from 'react-icons/fa';
import { Colors } from '~/core/styles/colors';

const Login = () => {
  const dispatch = useAppDispatch();

  const [erroGeral, setErroGeral] = useState<string[]>();

  const [form] = useForm();

  const login = useWatch('login', form);
  const senha = useWatch('senha', form);

  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      min: 'Deve conter no mínimo ${min} caracteres',
    },
  };

  const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
    if (erro?.response?.status === 401) {
      setErroGeral([ERRO_LOGIN_SENHA_INCORRETOS]);
      return;
    }
    const dataErro = erro?.response?.data;

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
          dispatch(setDadosLogin(resposta.data));
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
                title:
                  'Informe o RF ou CPF para acessar o sistema. Caso não possua acesso procure a DF.',
                icon: (
                  <Tooltip>
                    <FaQuestionCircle color={Colors.TEXT} />
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
          {erroGeral ? (
            <Col span={24}>
              <ErroGeralLogin erros={erroGeral} />
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Form>
    </Col>
  );
};

export default Login;
