import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErroGeralLogin from '~/components/main/erro-geral-login';
import InputCPF from '~/components/main/input/cpf';
import SenhaCadastro from '~/components/main/input/senha-cadastro';
import { CF_BUTTON_CONTINUAR, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_EOL,
  CF_INPUT_CONFIRMAR_SENHA,
  CF_INPUT_CPF,
  CF_INPUT_EMAIL,
  CF_INPUT_NOME,
  CF_INPUT_NOME_UE,
  CF_INPUT_SENHA,
} from '~/core/constants/ids/input';
import { ENVIAR_EMAIL_PARA_VALIDACAO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import InputEmail from '../formacao-cursista/inscricao/components/input-email';

export const CadastroDeUsuario = () => {
  const [form] = useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [erroCPF, setErroCPF] = useState<boolean>(false);
  const [erroGeral, setErroGeral] = useState<string[]>();
  const [loadingCPF, setLoadingCPF] = useState<boolean>(false);
  const [CPFExistente, setCPFExistente] = useState<string[]>();

  useEffect(() => {
    form.getFieldInstance('cpf').focus();
    erroCPF && form.getFieldInstance('cpf').focus();
  }, [erroCPF, form]);

  // const validarExibirErros = (erro: AxiosError<RetornoBaseDTO>) => {
  //   const dataErro = erro?.response?.data;

  //   if (typeof dataErro === 'string') {
  //     setErroGeral([dataErro]);
  //     return;
  //   }

  //   if (dataErro?.mensagens?.length) {
  //     setErroGeral(dataErro.mensagens);
  //     return;
  //   }

  //   setErroGeral([ERRO_CADASTRO_USUARIO]);
  // };

  const validaCPFExistente = (value: string) => {
    setCPFExistente([]);
    setLoadingCPF(true);
    // usuarioService
    //   .validaCPFExistente(value)
    //   .then((resposta) => {
    //     !resposta.data && form.getFieldInstance('nome').focus();
    //   })
    //   .catch((erro: AxiosError<RetornoBaseDTO>) => {
    //     const dataErro = erro?.response?.data;

    //     if (dataErro?.mensagens?.length) {
    //       setErroCPF(true);
    //       setCPFExistente(dataErro.mensagens);
    //     }
    //   })
    //   .finally(() => setLoadingCPF(false));
  };

  const onFinish = (values: any) => {
    confirmacao({
      content: ENVIAR_EMAIL_PARA_VALIDACAO,
      onOk() {
        form.submit();
      },
      onCancel() {
        navigate(ROUTES.LOGIN);
      },
    });
    // dispatch(setSpinning(true));
    // usuarioService
    //   .cadastrarUsuarioExterno(values)
    //   .then((resposta) => {
    //     if (resposta.data) {
    //       navigate(ROUTES.LOGIN);
    //     }
    //   })
    //   .catch(validarExibirErros)
    //   .finally(() => dispatch(setSpinning(false)));
  };

  const onClickVoltar = () => navigate(ROUTES.LOGIN);

  const validateNameAndSurname = (_rule: any, value: string) => {
    const names = value.split(' ');

    if (names.length !== 2 || names[1].trim() === '') {
      return Promise.reject('Por favor, digite o nome e o sobrenome.');
    }

    return Promise.resolve();
  };

  return (
    <Col span={14}>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <InputCPF
              formItemProps={{
                required: true,
                help: CPFExistente,
                hasFeedback: loadingCPF,
                validateStatus: CPFExistente?.length ? 'error' : loadingCPF ? 'validating' : '',
              }}
              inputProps={{
                name: 'cpf',
                id: CF_INPUT_CPF,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = removerTudoQueNaoEhDigito(e.target.value);
                  value.length === 11 ? validaCPFExistente(value) : setCPFExistente([]);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <Form.Item
              label='Nome completo'
              name='nome'
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
            {/* Código EOL da UE: Deverá validar no EOL se é válido */}
            <Form.Item label='Código EOL da UE' name='codigoEolUe' rules={[{ required: true }]}>
              <Input id={CF_INPUT_CODIGO_EOL} placeholder='Informe o código EOL da UE' />
            </Form.Item>
          </Col>
          <Col span={24}>
            {/* Nome da UE: Carregar o nome da UE cujo código foi informado com a sigla do tipo */}
            <Form.Item label='Nome da UE' name='nomeUE' rules={[{ required: true }]}>
              <Input maxLength={100} id={CF_INPUT_NOME_UE} placeholder='Informe o nome completo' />
            </Form.Item>
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
