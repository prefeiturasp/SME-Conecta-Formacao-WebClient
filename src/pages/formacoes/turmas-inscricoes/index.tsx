import { Col, Form, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { CF_INPUT_NOME, CF_INPUT_NOME_FORMACAO, CF_INPUT_RF } from '~/core/constants/ids/input';
import { validateMessages } from '~/core/constants/validate-messages';
import { ROUTES } from '~/core/enum/routes-enum';
import { TurmasInscricoesListaPaginada } from './listagem';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';

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
  const [realizouFiltro, setRealizouFiltro] = useState(false);
  const paramsRoute = useParams();

  const nomeFormacao = location.state.nomeFormacao;
  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const [filters, setFilters] = useState<FiltroTurmaInscricoesProps>({
    cpf: null,
    nomeTurma: null,
    nomeCursista: null,
    registroFuncional: null,
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onClickVoltar = () => navigate(ROUTES.FORMACAOES_INSCRICOES);

  const obterFiltros = () => {
    setRealizouFiltro(true);
    const cpf = form.getFieldValue('cpf');
    const nomeTurma = form.getFieldValue('nomeTurma');
    console.log(nomeTurma);
    const nomeCursista = form.getFieldValue('nomeCursista');
    const registroFuncional = form.getFieldValue('registroFuncional');
    if (!cpf && !nomeTurma && !nomeCursista && !registroFuncional) {
      setRealizouFiltro(false);
    }
    setFilters({
      cpf: cpf,
      nomeTurma: nomeTurma,
      nomeCursista: nomeCursista,
      registroFuncional: registroFuncional,
    });
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <HeaderPage title='Lista de inscrições'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
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
                <SelectTurmaEncontros
                  idProposta={id}
                  exibirTooltip={false}
                  selectProps={{ onChange: obterFiltros }}
                  selectMultiplo={false}
                  usarNomeComoChave={true}
                  formItemProps={{
                    label: 'Turma',
                    name: 'nomeTurma',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
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
                  <TurmasInscricoesListaPaginada
                    filters={filters}
                    realizouFiltro={realizouFiltro}
                  />
                </DataTableContextProvider>
              </Col>
            </Row>
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
