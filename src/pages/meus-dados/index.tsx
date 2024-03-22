import { Col, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputEmail from '~/components/main/input/email';
import SenhaCadastro from '~/components/main/input/senha-cadastro';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_EMAIL, CF_INPUT_SENHA, CF_INPUT_UNIDADE } from '~/core/constants/ids/input';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';
import { ROUTES } from '~/core/enum/routes-enum';

import { InputNome } from '~/components/main/input/nome';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import usuarioService from '~/core/services/usuario-service';
import ModalEditEmailButton from './components/modal-edit-email/modal-edit-email-button';
import { ModalEditNomeButton } from './components/modal-edit-nome/modal-edit-nome-button';
import ModalEditNovaSenhaButton from './components/modal-edit-nova-senha/modal-edit-nova-senha-button';
import { TipoUsuario } from '~/core/enum/tipo-usuario';
import InputUnidade from '~/components/main/input/unidade';
import ModalEditUnidadeButton from './components/modal-edit-unidade/modal-edit-unidade-button';

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
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const auth = useAppSelector((store) => store.auth);
  const perfil = useAppSelector((store) => store.perfil);

  const usuarioLogin = auth?.usuarioLogin;
  const usuarioNome = auth?.usuarioNome;
  const perfilNome = perfil.perfilSelecionado?.perfilNome;

  const [meusDados, setMeusDados] = useState<DadosUsuarioDTO>();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const obterDados = useCallback(() => {
    dispatch(setSpinning(true));
    usuarioService
      .obterMeusDados(usuarioLogin)
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setMeusDados({ ...resposta.data });
          form.setFieldsValue(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [usuarioLogin, form, dispatch]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <>
      <HeaderPage title='Meus dados'>
        <Row>
          <Col span={24}>
            <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
          </Col>
        </Row>
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
              </Row>
            </Form>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};

export default MeusDados;
