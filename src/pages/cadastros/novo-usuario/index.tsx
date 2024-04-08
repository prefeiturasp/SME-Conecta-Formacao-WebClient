import { Button, Checkbox, CheckboxProps, Col, Form, Input, Row } from 'antd';
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
import { ERRO_CADASTRO_USUARIO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { CadastroUsuarioFormDTO } from '~/core/dto/cadastro-usuario-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { sucesso } from '~/core/services/alerta-service';
import funcionarioExternoService from '~/core/services/funcionario-externo-service';
import usuarioService from '~/core/services/usuario-service';
import { removeAcentos, removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import { onClickVoltar } from '~/core/utils/form';

import SelectUEs from './components/ue';
import InputEmailEducacional from '~/components/main/input/email-educacional';
import SelectTipoEmail from '~/components/main/input/tipo-email';
import { TipoEmail } from '~/core/enum/tipo-email';

export const CadastroDeUsuario = () => {
  const [form] = useForm();
  const DOMINIO_DEFAULT = '@edu.sme.prefeitura.sp.gov.br';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [erroGeral, setErroGeral] = useState<string[]>();
  const [loadingCPF, setLoadingCPF] = useState<boolean>(false);
  const [cpfValido, setCpfValido] = useState<boolean>(false);
  const [ues, setUes] = useState<RetornoListagemDTO[]>();
  const [errorOnFinish, setErrorOnFinish] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);

  const onChangeCheck: CheckboxProps['onChange'] = (e) => {
    setChecked(e.target.checked);
  };

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
          codigoUnidade: data?.codigoUE,
          nomeUnidade: data?.nomeUe,
          ues: temApenasUmaUE ? data?.ues[0].id : [],
        });
        if (!data?.nomePessoa) {
          form.setFieldValue('tipoEmail', undefined);
        }

        !resposta.dados && form.getFieldInstance('nomePessoa').focus();
      })
      .finally(() => setLoadingCPF(false));
  };

  const onFinish = (values: CadastroUsuarioFormDTO) => {
    dispatch(setSpinning(true));
    usuarioService
      .cadastrarUsuarioExterno({
        cpf: values.cpf,
        nome: values.nomePessoa,
        email: values.email,
        codigoUnidade: values.codigoUnidade ? values.codigoUnidade : String(values.ues),
        senha: values.senha,
        confirmarSenha: values.confirmarSenha,
        emailEducacional: values.emailEducacional + DOMINIO_DEFAULT,
        tipoEmail: values.tipoEmail,
      })
      .then((resposta) => {
        if (resposta.dados) {
          sucesso({
            content: resposta.dados.mensagem,
            okText: 'Continuar',
            onOk() {
              navigate(ROUTES.LOGIN);
            },
          });
        }
      })
      .catch(validarExibirErros)
      .finally(() => dispatch(setSpinning(false)));
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
    } else {
      navigate(ROUTES.LOGIN);
    }
  };
  const criarEmailEdu = () => {
    const cpf = removerTudoQueNaoEhDigito(form.getFieldValue('cpf'));
    const tipoEmail: TipoEmail = form.getFieldValue('tipoEmail') as TipoEmail;
    const nome = form.getFieldValue('nomePessoa');
    let emailEdu = '';
    const nomeSplit = nome?.split(' ');
    if (nomeSplit && cpf.length === 11 && tipoEmail) {
      const primeiroNome = nomeSplit[0]?.toLowerCase();
      const ultimoNome =
        nomeSplit?.length - 1 > 0 ? nomeSplit[nomeSplit?.length - 1].toLowerCase() : '';
      if (tipoEmail == TipoEmail.FuncionarioUnidadeParceira) {
        emailEdu = `${primeiroNome}${ultimoNome}.${cpf}`;
      }
      if (tipoEmail == TipoEmail.Estagiario) {
        emailEdu = `${primeiroNome}${ultimoNome}.e${cpf}`;
      }
      form.setFieldValue('emailEducacional', removeAcentos(emailEdu));
    } else {
      emailEdu = '';
      form.setFieldValue('emailEducacional', undefined);
    }
  };
  const validateNameAndSurname = (_rule: any, value: string) => {
    criarEmailEdu();
    const names = value?.split(' ');

    if (names?.length <= 1 || names[1]?.trim() === '') {
      return Promise.reject('Por favor, digite o nome e o sobrenome.');
    }
    const newValue = value.replace(/[^\p{L}\s]/gu, '');
    form.setFieldValue('nomePessoa', newValue);
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
              formItemProps={{
                required: true,
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
                  criarEmailEdu();
                },
              }}
            />
          </Col>
          <Col span={24}>
            <SelectTipoEmail selectProps={{ onChange: criarEmailEdu }} />
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
              <Input
                maxLength={100}
                id={CF_INPUT_NOME}
                placeholder='Informe o nome completo'
                onChange={criarEmailEdu}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <InputEmail inputProps={{ id: CF_INPUT_EMAIL }} formItemProps={{ required: true }} />
          </Col>
          <Col span={24}>
            <InputEmailEducacional />
          </Col>
          {cpfValido && (
            <Col span={24}>
              <SelectUEs ues={ues} selectProps={{ id: CF_INPUT_UE }} />
            </Col>
          )}
          <Col span={24}>
            <InputCodigoEolUE />
          </Col>
          <Col span={24}>
            <Form.Item label='Nome da unidade' name='nomeUnidade' rules={[{ required: true }]}>
              <Input maxLength={100} id={CF_INPUT_NOME_UE} placeholder='Nome da unidade' disabled />
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
        <p style={{ marginBottom: '30px', marginTop: '10px' }}>
          <Checkbox checked={checked} onChange={onChangeCheck}>
            As informa��es prestadas s�o verdadeiras e me responsabilizo por elas
          </Checkbox>
        </p>
        <Row justify='center' gutter={[0, 21]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Button
              block
              type='primary'
              htmlType='submit'
              disabled={!checked}
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
              onClick={() => onClickVoltar({ form, navigate, route: ROUTES.LOGIN })}
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
