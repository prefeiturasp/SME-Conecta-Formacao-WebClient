import { Col, Form, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputEmail from '~/components/main/input/email';
import SenhaCadastro from '~/components/main/input/senha-cadastro';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
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

  const { meusDados } = useContext(MeusDadosContext);

  useEffect(() => {
    form.setFieldsValue({ ...meusDados });
  }, [meusDados]);

  return (
    <>
      <HeaderPage title='Meus dados'>
        <Row>
          <Col span={24}>
            <ButtonVoltar
              onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
              id={CF_BUTTON_VOLTAR}
            />
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
              </Row>
            </Form>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};

export default MeusDados;
