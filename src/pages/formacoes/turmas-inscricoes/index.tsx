import { Button, Col, Form, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectTurmaEncontros from '~/components/main/input/turmas-encontros';
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
import { TipoInscricao } from '~/core/enum/tipo-inscricao';
import { onClickVoltar } from '~/core/utils/form';
import { TurmasInscricoesListaPaginada } from './listagem';

export interface FiltroTurmaInscricoesProps {
  cpf: number | null;
  turmaId: number | null;
  nomeCursista: string | null;
  registroFuncional: number | null;
}

export const TurmasInscricoes = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const params = useParams();
  const id = params.id ? parseInt(params?.id) : 0;

  const nomeFormacao = location?.state?.nomeFormacao;
  const temTipoInscricaoManual = location.state.tiposInscricoes.includes(TipoInscricao.Manual);

  const paramsRoute = {
    state: location.state,
  };

  const [realizouFiltro, setRealizouFiltro] = useState(false);

  const [filters, setFilters] = useState<FiltroTurmaInscricoesProps>({
    cpf: null,
    turmaId: null,
    nomeCursista: null,
    registroFuncional: null,
  });

  const onClickNovo = () => navigate(`${ROUTES.FORMACAOES_INSCRICOES_NOVO}/${id}`, paramsRoute);

  const onInscricaoPorArquivo = () =>
    navigate(`${ROUTES.FORMACAOES_INSCRICOES_POR_ARQUIVO}/${id}`, paramsRoute);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const obterFiltros = () => {
    setRealizouFiltro(true);
    const cpf = form.getFieldValue('cpf');
    const turmaId = form.getFieldValue('turmaId');
    const nomeCursista = form.getFieldValue('nomeCursista');
    const registroFuncional = form.getFieldValue('registroFuncional');
    if (!cpf && !turmaId && !nomeCursista && !registroFuncional) {
      setRealizouFiltro(false);
    }
    setFilters({
      cpf: cpf,
      turmaId: turmaId,
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
                <ButtonVoltar
                  onClick={() => onClickVoltar({ navigate, route: ROUTES.FORMACAOES_INSCRICOES })}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              {temTipoInscricaoManual && (
                <Col>
                  <Button
                    block
                    type='default'
                    htmlType='submit'
                    id={CF_BUTTON_ARQUIVO}
                    onClick={onInscricaoPorArquivo}
                    style={{ fontWeight: 700 }}
                  >
                    Inscrição por arquivo
                  </Button>
                </Col>
              )}
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  onClick={onClickNovo}
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
                <SelectTurmaEncontros
                  idProposta={id}
                  selectProps={{ onChange: obterFiltros, mode: undefined }}
                  formItemProps={{
                    label: 'Turma',
                    name: 'turmaId',
                    style: { fontWeight: 'bold' },
                    rules: [{ required: false }],
                    tooltip: false,
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
