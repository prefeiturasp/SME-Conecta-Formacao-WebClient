import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import Select from '~/components/lib/inputs/select';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputCPF from '~/components/main/input/cpf';
import InputEmail from '~/components/main/input/email';
import InputTelefone from '~/components/main/input/telefone';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME_FORMACAO } from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

export const NovoUsuarioRedeParceria = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title='Cadastro de novo usuário'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              <Col>
                <ButtonPrimary id={CF_BUTTON_VOLTAR}>Novo</ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8} md={6}>
                <SelectAreaPromotora />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputCPF />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome do usuário',
                    name: 'nome',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome do usuário',
                    maxLength: 100,
                  }}
                />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputEmail />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <InputTelefone />
              </Col>

              <Col xs={24} sm={8} md={6}>
                <Form.Item label='Situacao'>
                  <Select placeholder='Situação' />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
