import { Button, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputEmail from '~/components/main/input/email';
import SenhaCadastro from '~/components/main/input/senha-cadastro';
import { CF_BUTTON_SALVAR, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { notification } from '~/components/lib/notification';
import usuarioService from '~/core/services/usuario-service';
import {
  CF_INPUT_EMAIL,
  CF_INPUT_EMAIL_EDUCACIONAL,
  CF_INPUT_SENHA,
  CF_INPUT_UNIDADE,
} from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes-enum';

import { InputNome } from '~/components/main/input/nome';
import InputUnidade from '~/components/main/input/unidade';
import { TipoUsuario } from '~/core/enum/tipo-usuario';
import { useAppSelector } from '~/core/hooks/use-redux';
import { onClickVoltar } from '~/core/utils/form';
import { MeusDadosContext } from '../../provider';
import ModalEditEmailButton from '../modal-edit-email/modal-edit-email-button';
import { ModalEditNomeButton } from '../modal-edit-nome/modal-edit-nome-button';
import ModalEditNovaSenhaButton from '../modal-edit-nova-senha/modal-edit-nova-senha-button';
import ModalEditUnidadeButton from '../modal-edit-unidade/modal-edit-unidade-button';
import SelectTipoEmail from '~/components/main/input/tipo-email';
import ModalEditTipoEmailEducacionalButton from '../modal-edit-tipo-email-educacional/modal-edit-tipo-email-educacional-button';
import { CF_SELECT_TIPO_EMAIL } from '~/core/constants/ids/select';

export const DadosPerfil = styled.div`
  color: #a4a4a4;

  svg {
    font-size: 200px;
  }

  @media (max-width: 600px) {
    svg {
      font-size: 100px !important;
    }
  }

  @media (max-width: 500px) {
    svg {
      font-size: 70px !important;
    }
  }
`;

const MeusDados: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const auth = useAppSelector((store) => store.auth);
  const perfil = useAppSelector((store) => store.perfil);

  const usuarioNome = auth?.usuarioNome;
  const perfilNome = perfil.perfilSelecionado?.perfilNome;

  const [pessoaComDeficiencia, setPessoaComDeficiencia] = useState<string | undefined>(undefined);
  const [precisaDeAdaptacao, setPrecisaDeAdaptacao] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { meusDados } = useContext(MeusDadosContext);
  useEffect(() => {
    form.setFieldsValue({ ...meusDados });

    const ua = meusDados?.usuarioAcessibilidade;
    if (ua) {
      const deficiencia =
        ua.possuiDeficiencia === true
          ? 'Sim'
          : ua.possuiDeficiencia === false
            ? 'Não'
          : 'Prefiro não responder';
      const adaptacao =
        ua.necessitaAdaptacao === true
          ? 'Sim'
          : ua.necessitaAdaptacao === false
          ? 'Não'
          : undefined;

      setPessoaComDeficiencia(deficiencia);
      setPrecisaDeAdaptacao(adaptacao);
      form.setFieldsValue({
        pessoaComDeficiencia: deficiencia,
        qualDeficiencia: ua.descricaoDeficiencia,
        precisaDeAdaptacao: adaptacao,
        qualTipoAdaptacao: ua.descricaoAdaptacao,
      });
    }
  }, [meusDados]);

  const onClickSalvar = async () => {
    const values = form.getFieldsValue(true);
    const login = auth?.usuarioLogin;

    const possuiDeficiencia =
      pessoaComDeficiencia === 'Sim'
        ? true
        : pessoaComDeficiencia === 'Não'
        ? false
        : pessoaComDeficiencia === 'Prefiro não responder'
        ? null
        : undefined;

    const payload = {
      usuarioId: meusDados?.usuarioAcessibilidade?.usuarioId ?? 0,
      possuiDeficiencia: possuiDeficiencia ?? null,
      descricaoDeficiencia: pessoaComDeficiencia === 'Sim' ? values.qualDeficiencia : undefined,
      necessitaAdaptacao: pessoaComDeficiencia === 'Sim' ? precisaDeAdaptacao === 'Sim' : undefined,
      descricaoAdaptacao:
        pessoaComDeficiencia === 'Sim' && precisaDeAdaptacao === 'Sim'
          ? values.qualTipoAdaptacao
          : undefined,
      salvar: true,
    };

    setLoading(true);
    try {
      const response = await usuarioService.salvarAcessibilidade(login, payload);
      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Acessibilidade salva com sucesso!',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: response.mensagens?.[0] || 'Erro ao salvar acessibilidade',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderPage title='Meus dadosxxxx'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickSalvar}
                loading={loading}
                id={CF_BUTTON_SALVAR}
                style={{ fontWeight: 700 }}
              >
                Salvar
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
        <Row>
          <Col xs={24} md={12}>
            <Space direction='vertical' align='center' style={{ width: '100%' }}>
              <DadosPerfil>
                <FaUserCircle />
              </DadosPerfil>
            </Space>
            <Space direction='vertical' align='center' style={{ width: '100%' }}>
              <Typography.Text strong>{usuarioNome}</Typography.Text>
              <Typography.Text>Perfil: {perfilNome} </Typography.Text>
              <Typography.Text>Usuário: {meusDados?.login}</Typography.Text>
              <Typography.Text>CPF: {meusDados?.cpf}</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Form form={form} layout='vertical' autoComplete='off'>
              <Row gutter={16}>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputNome
                      inputProps={{ disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <ModalEditNomeButton formPreview={form} />
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputEmail
                      inputProps={{ id: CF_INPUT_EMAIL, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <ModalEditEmailButton formPreview={form} />
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <SelectTipoEmail 
                      selectProps={{ id: CF_SELECT_TIPO_EMAIL, disabled: true }}
                      formItemProps={{
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    {meusDados?.tipo == TipoUsuario.Externo 
                      ? (<ModalEditTipoEmailEducacionalButton formPreview={form}/>) 
                      : (<></>)}
                  </Row>
                </Col>
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <InputEmail
                      inputProps={{ id: CF_INPUT_EMAIL_EDUCACIONAL, disabled: true }}
                      formItemProps={{
                        name: 'emailEducacional',
                        label: 'E-mail Educacional',
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                  </Row>
                </Col>
                {meusDados?.tipo == TipoUsuario.Externo ? (
                  <Col span={24}>
                    <Row wrap={false} align='middle'>
                      <InputUnidade
                        inputProps={{ id: CF_INPUT_UNIDADE, disabled: true }}
                        formItemProps={{
                          style: { width: '100%', marginRight: '8px' },
                          required: false,
                        }}
                      />
                      <ModalEditUnidadeButton formPreview={form} />
                    </Row>
                  </Col>
                ) : (
                  <></>
                )}
                <Col span={24}>
                  <Row wrap={false} align='middle'>
                    <SenhaCadastro
                      inputProps={{
                        id: CF_INPUT_SENHA,
                        disabled: true,
                      }}
                      formItemProps={{
                        initialValue: '************',
                        style: { width: '100%', marginRight: '8px' },
                        required: false,
                      }}
                    />
                    <ModalEditNovaSenhaButton />
                  </Row>
                </Col>

                <Col span={24}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontStyle: 'Bold',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      marginBottom: '8px',
                    }}
                  >
                    Acessibilidade
                  </p>
                </Col>

                <Col span={24}>
                  <p style={{ marginBottom: '16px' }}>
                    Compartilhe suas necessidades de acessibilidade para que possamos oferecer as
                    adaptações necessárias. Você pode atualizar essas informações a qualquer
                    momento.
                  </p>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Pessoa com deficiência?' name='pessoaComDeficiencia'>
                    <Select
                      allowClear
                      placeholder='Selecione'
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                        { label: 'Prefiro não responder', value: 'Prefiro não responder' },
                      ]}
                      onChange={(value) => {
                        setPessoaComDeficiencia(value);
                        form.setFieldValue('qualDeficiencia', undefined);
                        setPrecisaDeAdaptacao(undefined);
                        form.setFieldValue('precisaDeAdaptacao', undefined);
                        form.setFieldValue('qualTipoAdaptacao', undefined);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Qual deficiência?' name='qualDeficiencia'>
                    <Input
                      placeholder='Informe a deficiência'
                      maxLength={200}
                      disabled={pessoaComDeficiencia !== 'Sim'}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Precisa de adaptação?' name='precisaDeAdaptacao'>
                    <Select
                      allowClear
                      placeholder='Selecione'
                      disabled={pessoaComDeficiencia !== 'Sim'}
                      options={[
                        { label: 'Sim', value: 'Sim' },
                        { label: 'Não', value: 'Não' },
                      ]}
                      onChange={(value) => {
                        setPrecisaDeAdaptacao(value);
                        form.setFieldValue('qualTipoAdaptacao', undefined);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label='Qual tipo de adaptação?' name='qualTipoAdaptacao'>
                    <Input
                      placeholder='Informe o tipo de adaptação'
                      maxLength={200}
                      disabled={precisaDeAdaptacao !== 'Sim'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};

export default MeusDados;
