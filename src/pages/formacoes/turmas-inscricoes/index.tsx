import { Button, Col, Form, Row, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_BUTTON_ARQUIVO,
  CF_BUTTON_NOVO,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME, CF_INPUT_NOME_FORMACAO, CF_INPUT_RF } from '~/core/constants/ids/input';
import { NOVA_INSCRICAO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';
import { TurmasInscricoesListaPaginada } from './listagem';

export interface FiltroTurmaInscricoesProps {
  cpf: number | null;
  nomeTurma: string | null;
  nomeCursista: string | null;
  registroFuncional: number | null;
}

export const TurmasInscricoes = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const id = params.id;

  const nomeFormacao = location?.state?.nomeFormacao;

  const [filters, setFilters] = useState<FiltroTurmaInscricoesProps>({
    cpf: null,
    nomeTurma: null,
    nomeCursista: null,
    registroFuncional: null,
  });

  const onClickNovo = () =>
    navigate(`${ROUTES.FORMACAOES_INSCRICOES}/novo/${id}`, {
      state: location.state,
    });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const obterFiltros = () => {
    setFilters({
      cpf: form.getFieldValue('cpf'),
      nomeTurma: form.getFieldValue('nomeTurma'),
      nomeCursista: form.getFieldValue('nomeCursista'),
      registroFuncional: form.getFieldValue('registroFuncional'),
    });
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title='Lista de inscrições'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  onClick={() => onClickVoltar({ navigate, route: ROUTES.FORMACAOES_INSCRICOES })}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              <Col>
                <Upload fileList={[]}>
                  <Button
                    block
                    type='default'
                    htmlType='submit'
                    id={CF_BUTTON_ARQUIVO}
                    style={{ fontWeight: 700 }}
                  >
                    Inscrição por arquivo
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  onClick={() => onClickNovo()}
                  style={{ fontWeight: 700 }}
                >
                  {NOVA_INSCRICAO}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Typography.Title level={5} style={{ marginBottom: 24 }}>
            {nomeFormacao}
          </Typography.Title>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={6}>
                <InputTexto
                  formItemProps={{
                    label: 'Turma',
                    name: 'nomeTurma',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    onChange: obterFiltros,
                    placeholder: 'Turma',
                    id: CF_INPUT_NOME,
                  }}
                />
              </Col>

              <Col xs={24} sm={6}>
                <InputNumero
                  formItemProps={{
                    label: 'RF',
                    name: 'registroFuncional',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_RF,
                    onChange: obterFiltros,
                    style: { fontWeight: 'bold' },
                    placeholder: 'Registro Funcional',
                  }}
                />
              </Col>

              <Col xs={24} sm={6}>
                <InputTexto
                  formItemProps={{
                    label: 'CPF',
                    name: 'cpf',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    placeholder: 'CPF',
                    onChange: obterFiltros,
                    id: CF_INPUT_NOME_FORMACAO,
                  }}
                />
              </Col>

              <Col xs={24} sm={6}>
                <InputTexto
                  formItemProps={{
                    label: 'Nome do cursista',
                    name: 'nomeCursista',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    onChange: obterFiltros,
                    placeholder: 'Nome do cursista',
                    id: CF_INPUT_NOME,
                  }}
                />
              </Col>

              <Col xs={24}>
                <Typography style={{ marginBottom: 12, fontWeight: 'bold' }}>
                  Listagem de inscrições por turma
                </Typography>
                <DataTableContextProvider>
                  <TurmasInscricoesListaPaginada filters={filters} />
                </DataTableContextProvider>
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
