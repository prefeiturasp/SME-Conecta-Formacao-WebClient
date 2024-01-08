import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Typography from 'antd/es/typography/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { InscricoesListaPaginada } from './listagem';

export interface FiltroInscricoesProps {
  id: number | null;
  nomeFormacao: string | null;
  numeroHomologacao: number | null;
}

export const Inscricoes = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FiltroInscricoesProps>({
    id: null,
    nomeFormacao: null,
    numeroHomologacao: null,
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const obterFiltros = () => {
    setFilters({
      id: form.getFieldValue('codigoFormacao'),
      nomeFormacao: form.getFieldValue('nomeFormacao'),
      numeroHomologacao: form.getFieldValue('numeroHomologacao'),
    });
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title='Inscrições'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <InputNumero
                  formItemProps={{
                    label: 'Código',
                    name: 'codigoFormacao',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    maxLength: 100,
                    onChange: obterFiltros,
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                  }}
                />
              </Col>

              <Col xs={24} sm={8}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome da formação',
                    name: 'nomeFormacao',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome da formação',
                    maxLength: 100,
                    onChange: obterFiltros,
                  }}
                />
              </Col>

              <Col xs={24} sm={8}>
                <InputNumero
                  formItemProps={{
                    label: 'Número de homologação',
                    name: 'numeroHomologacao',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    maxLength: 100,
                    onChange: obterFiltros,
                    id: CF_INPUT_NUMERO_HOMOLOGACAO,
                    placeholder: 'Número de homologação',
                  }}
                />
              </Col>

              <Col xs={24}>
                <Typography style={{ marginBottom: 12, fontWeight: 'bold' }}>
                  Listagem de cursos/turmas
                </Typography>
                <InscricoesListaPaginada filters={filters} />
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
