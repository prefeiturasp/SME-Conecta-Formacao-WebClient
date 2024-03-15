import { Col, Drawer, Form, Row, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import DataTableContextProvider, { DataTableContext } from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_ARQUIVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { validateMessages } from '~/core/constants/validate-messages';
import { ArquivoInscricaoImportadoDTO } from '~/core/dto/arquivo-inscricao-importado-dto';
import { RegistroDaInscricaoInsconsistenteDTO } from '~/core/dto/registros-inconsistencias-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  SituacaoImportacaoArquivoEnum,
  SituacaoImportacaoArquivoEnumDisplay,
} from '~/core/enum/situacao-importacao-arquivo-enum';
import importacaoArquivoService from '~/core/services/importacao-arquivo-service';
import { onClickVoltar } from '~/core/utils/form';

const columns: ColumnsType<ArquivoInscricaoImportadoDTO> = [
  {
    key: 'arquivo',
    title: 'Arquivo',
    dataIndex: 'nome',
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'situacao',
    render: (situacao: SituacaoImportacaoArquivoEnum) =>
      SituacaoImportacaoArquivoEnumDisplay[situacao],
  },
  {
    key: 'totalRegistros',
    title: 'Total Registros',
    dataIndex: 'totalRegistros',
  },
  {
    key: 'totalProcessados',
    title: 'Total Processados',
    dataIndex: 'totalProcessados',
  },
];

const columnsInconsistencias: ColumnsType<RegistroDaInscricaoInsconsistenteDTO> = [
  {
    key: 'turma',
    title: 'Turma',
    dataIndex: 'turma',
  },
  {
    key: 'colaboradorRede',
    title: 'Profissional da rede municipal',
    dataIndex: 'colaboradorRede',
  },
  {
    key: 'registroFuncional',
    title: 'RF',
    dataIndex: 'registroFuncional',
  },
  {
    key: 'cpf',
    title: 'CPF',
    dataIndex: 'cpf',
  },
  {
    key: 'nome',
    title: 'Nome',
    dataIndex: 'nome',
  },
  {
    key: 'erro',
    title: 'Erro',
    dataIndex: 'erro',
  },
];

export const InscricoesPorArquivoListagem = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const propostaId = params.id ? Number(params.id) : 0;
  const nomeFormacao = location?.state?.nomeFormacao;

  const [abrirModal, setAbrirModal] = useState<boolean>(false);

  const paramsRoute = {
    state: location.state,
  };

  const onClickEditar = (row: ArquivoInscricaoImportadoDTO) => setAbrirModal(true);

  const customRequest = useCallback(async (options: any, tableState: any) => {
    const { onSuccess, file } = options;

    const resposta = await importacaoArquivoService.importarArquivoInscricaoCursista(
      file,
      propostaId,
    );

    if (resposta.sucesso) {
      tableState.reloadData();
      onSuccess();
    }
  }, []);

  return (
    <DataTableContextProvider>
      <Col>
        <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
          <HeaderPage title={nomeFormacao}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <ButtonVoltar
                    onClick={() =>
                      onClickVoltar({
                        navigate,
                        route: `${ROUTES.FORMACAOES_INSCRICOES_EDITAR}/${propostaId}`,
                        paramsRoute,
                      })
                    }
                    id={CF_BUTTON_VOLTAR}
                  />
                </Col>
                <DataTableContext.Consumer>
                  {({ tableState }) => (
                    <>
                      <Col>
                        <ButtonSecundary
                          icon={<LuRefreshCw size={16} />}
                          onClick={() => {
                            tableState.reloadData();
                          }}
                          // id={CF_BUTTON_VOLTAR}
                        >
                          Atualizar dados
                        </ButtonSecundary>
                      </Col>
                      <Col>
                        <Upload
                          name='file'
                          customRequest={(options: any) => customRequest(options, tableState)}
                          fileList={[]}
                        >
                          <ButtonSecundary icon={<FaUpload size={16} />} id={CF_BUTTON_ARQUIVO}>
                            Importar Arquivo
                          </ButtonSecundary>
                        </Upload>
                      </Col>
                    </>
                  )}
                </DataTableContext.Consumer>
              </Row>
            </Col>
          </HeaderPage>

          <CardContent>
            <Col xs={24}>
              <Typography style={{ marginBottom: 12, fontWeight: 'bold' }}>
                Listagem de inscrições por arquivo
              </Typography>

              <DataTable
                url={`/v1/ImportacaoArquivo/${propostaId}/arquivos-importados`}
                columns={columns}
                onRow={(row) => ({
                  onClick: () => {
                    onClickEditar(row);
                  },
                })}
              />

              {abrirModal && (
                <Drawer open size='large' onClose={() => setAbrirModal(false)}>
                  <DataTable
                    url={`v1/ImportacaoArquivo/${propostaId}/registros-inconsistencia`}
                    columns={columnsInconsistencias}
                  />
                </Drawer>
              )}
            </Col>
          </CardContent>
        </Form>
      </Col>
    </DataTableContextProvider>
  );
};
