import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/main/erro-geral-login';
import InputCodigoEolUE from '~/components/main/input/codigo-eol-ue';
import InputCPF from '~/components/main/input/cpf';
import InputEmail from '~/components/main/input/email';
import SenhaCadastro from '~/components/main/input/senha-cadastro';
import { CF_BUTTON_CONTINUAR, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CONFIRMAR_SENHA,
  CF_INPUT_CPF,
  CF_INPUT_EMAIL,
  CF_INPUT_NOME,
  CF_INPUT_NOME_UE,
  CF_INPUT_SENHA,
  CF_INPUT_UE,
} from '~/core/constants/ids/input';
import {
  CADASTRO_ENVIADO,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  ENVIAR_EMAIL_PARA_VALIDACAO,
  ERRO_CADASTRO_USUARIO,
} from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { confirmacao, sucesso } from '~/core/services/alerta-service';
import funcionarioExternoService from '~/core/services/funcionario-externo-service';
import usuarioService from '~/core/services/usuario-service';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import SelectUEs from './components/ue';

export const CadastroDeUsuario = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [erroGeral, setErroGeral] = useState<string[]>();
  const [loadingCPF, setLoadingCPF] = useState<boolean>(false);
  const [cpfValido, setCpfValido] = useState<boolean>(false);
  const [ues, setUes] = useState<RetornoListagemDTO[]>();
  const [errorOnFinish, setErrorOnFinish] = useState<boolean>(false);

  useEffect(() => {
    form.getFieldInstance('cpf').focus();
  }, [form]);

  const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
    const dataErro = erro?.response?.data;

    if (typeof dataErro === 'string') {
      setErroGeral([dataErro]);
      return;
    }

    if (dataErro?.mensagens?.length) {
      setErroGeral(dataErro.mensagens);
      return;
    }

    setErroGeral([ERRO_CADASTRO_USUARIO]);
  };

  const validaCPFExistente = (cpf: string) => {
    setLoadingCPF(true);

    funcionarioExternoService
      .obterFuncionarioExterno(cpf)
      .then((resposta: any) => {
        const data = resposta?.dados;

        if (!resposta.sucesso) {
          setCpfValido(false);
        } else {
          setUes(data.ues);
          if (data.ues) {
            setCpfValido(true);
          }
        }

        const temApenasUmaUE = data?.ues?.length === 1;

        form.setFieldsValue({
          nomePessoa: data?.nomePessoa,
          codigoUE: data?.codigoUE,
          nomeUe: data?.nomeUe,
          ues: temApenasUmaUE ? data?.ues[0].id : [],
        });

        !resposta.dados && form.getFieldInstance('nomePessoa').focus();
      })
      .finally(() => setLoadingCPF(false));
  };

  const onFinish = (values: any) => {
    dispatch(setSpinning(true));

    confirmacao({
      content: ENVIAR_EMAIL_PARA_VALIDACAO,
      okText: 'Continuar',
      onOk() {
        usuarioService
          .cadastrarUsuarioExterno({
            cpf: values.cpf,
            nome: values.nomePessoa,
            email: values.email,
            codigoUe: values.codigoUE ? values.codigoUE : String(values.ues),
            senha: values.senha,
            confirmarSenha: values.confirmarSenha,
          })
          .then((resposta) => {
            if (resposta.dados) {
              sucesso({
                content: CADASTRO_ENVIADO,
                okText: 'Continuar',
                onOk() {
                  navigate(ROUTES.LOGIN);
                },
              });
            }
          })
          .catch(validarExibirErros)
          .finally(() => dispatch(setSpinning(false)));
      },
      cancelText: 'Cancelar',
      onCancel() {
        dispatch(setSpinning(false));
      },
    });
  };

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          form.submit();
        },
        onCancel() {
          navigate(ROUTES.LOGIN);
        },
      });
    }

    navigate(ROUTES.LOGIN);
  };

  const validateNameAndSurname = (_rule: any, value: string) => {
    const names = value?.split(' ');

    if (names?.length <= 1 || names[1]?.trim() === '') {
      return Promise.reject('Por favor, digite o nome e o sobrenome.');
    }

    return Promise.resolve();
  };

  const validateStatusCPF = () => {
    if (loadingCPF) {
      return 'validating';
    }

    if (errorOnFinish) {
      setErrorOnFinish(false);
      return 'error';
    }

    if (form.getFieldValue('cpf')?.length === 14) {
      return '';
    }
  };

  return (
    <Col span={14}>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        onFinishFailed={(errorForm) => {
          if (errorForm) {
            setErrorOnFinish(true);
          }
        }}
        validateMessages={validateMessages}
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <InputCPF
              required
              formItemProps={{
                hasFeedback: loadingCPF,
                validateStatus: validateStatusCPF(),
              }}
              inputProps={{
                name: 'cpf',
                id: CF_INPUT_CPF,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = removerTudoQueNaoEhDigito(e.target.value);
                  if (value.length === 11) {
                    validaCPFExistente(value);
                  } else if (!value.length) {
                    form.resetFields();
                    setCpfValido(false);
                  } else {
                    setCpfValido(false);
                  }
                },
              }}
            />
          </Col>
          <Col span={24}>
            <Form.Item
              label='Nome completo'
              name='nomePessoa'
              rules={[
                {
                  required: true,
                  validator: validateNameAndSurname,
                  message: 'Por favor, informe o nome e o sobrenome.',
                },
              ]}
            >
              <Input maxLength={100} id={CF_INPUT_NOME} placeholder='Informe o nome completo' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputEmail inputProps={{ id: CF_INPUT_EMAIL }} formItemProps={{ required: true }} />
          </Col>
          <Col span={24}>
            <InputCodigoEolUE />
          </Col>
          <Col span={24}>
            <Form.Item label='Nome da UE' name='nomeUe' rules={[{ required: true }]}>
              <Input maxLength={100} id={CF_INPUT_NOME_UE} placeholder='Nome da UE' disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            {cpfValido && <SelectUEs ues={ues} selectProps={{ id: CF_INPUT_UE }} />}
          </Col>
          <Col span={24}>
            <SenhaCadastro inputProps={{ id: CF_INPUT_SENHA }} />
          </Col>
          <Col span={24}>
            <SenhaCadastro
              confirmarSenha={{ fieldName: 'senha' }}
              inputProps={{ id: CF_INPUT_CONFIRMAR_SENHA }}
              formItemProps={{ label: 'Confirmar senha', name: 'confirmarSenha' }}
            />
          </Col>
        </Row>

        <Row justify='center' gutter={[0, 21]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              block
              type='primary'
              htmlType='submit'
              id={CF_BUTTON_CONTINUAR}
              style={{ fontWeight: 700 }}
            >
              Continuar
            </Button>
          </Col>

          <Col span={24}>
            <Button
              block
              type='default'
              id={CF_BUTTON_VOLTAR}
              onClick={onClickVoltar}
              style={{ fontWeight: 700 }}
            >
              Voltar
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
