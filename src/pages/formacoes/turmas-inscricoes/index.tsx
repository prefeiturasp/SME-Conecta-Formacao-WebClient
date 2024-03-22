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
import SelectTodasTurmas from '~/components/main/input/selecionar-todas-turmas';

export interface FiltroTurmaInscricoesProps {
  cpf: number | null;
  turmasId: number[] | null;
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
    turmasId: null,
    nomeCursista: null,
    registroFuncional: null,
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);
  const alterarRealizouFiltro = (valor: boolean) => {
    setRealizouFiltro(valor);
  };
  const onClickVoltar = () => navigate(ROUTES.FORMACAOES_INSCRICOES);

  const obterFiltros = () => {
    setRealizouFiltro(true);
    const cpf = form.getFieldValue('cpf');
    const turmasId = form.getFieldValue('turmas');
    const nomeCursista = form.getFieldValue('nomeCursista');
    const registroFuncional = form.getFieldValue('registroFuncional');
    if (!cpf && turmasId?.length == 0 && !nomeCursista && !registroFuncional) {
      setRealizouFiltro(false);
    }
    setFilters({
      cpf: cpf,
      turmasId: turmasId,
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
                <SelectTodasTurmas
                  idProposta={id}
                  exibirTooltip={false}
                  required={false}
                  onChange={obterFiltros}
                  maxTagCount={1}
                  formItemProps={{
                    label: 'Turma',
                    name: 'turmas',
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
                    alterarRealizouFiltro={alterarRealizouFiltro}
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
