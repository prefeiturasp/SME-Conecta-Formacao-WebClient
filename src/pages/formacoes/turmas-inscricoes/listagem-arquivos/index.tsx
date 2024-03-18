import { Col, Drawer, Form, Progress, ProgressProps, Row, Space, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import DataTableContextProvider, { DataTableContext } from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import {
  CF_BUTTON_ARQUIVO,
  CF_BUTTON_ATUALIZAR_DADOS,
  CF_BUTTON_MODAL_CANCELAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { DESEJA_CANCELAR_PROCESSAMENTO_ARQUIVO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { ArquivoInscricaoImportadoDTO } from '~/core/dto/arquivo-inscricao-importado-dto';
import { RegistroDaInscricaoInsconsistenteDTO } from '~/core/dto/registros-inconsistencias-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  SituacaoImportacaoArquivoEnum,
  SituacaoImportacaoArquivoEnumDisplay,
} from '~/core/enum/situacao-importacao-arquivo-enum';
import { confirmacao } from '~/core/services/alerta-service';
import importacaoArquivoService from '~/core/services/importacao-arquivo-service';
import { Colors } from '~/core/styles/colors';
import { onClickVoltar } from '~/core/utils/form';

interface OptionsProps {
  onSuccess: () => void;
  file: File;
}

const progressColor: ProgressProps['strokeColor'] = {
  '0%': Colors.SystemSME.ConectaFormacao.PRIMARY,
  '100%': Colors.SystemSME.ConectaFormacao.PRIMARY,
};

const CustomTypography = (value: string) => (
  <Typography style={{ cursor: 'pointer' }}>{value}</Typography>
);

const columns: ColumnsType<ArquivoInscricaoImportadoDTO> = [
  {
    key: 'arquivo',
    title: 'Arquivo',
    dataIndex: 'nome',
    render: (value) => CustomTypography(value),
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'situacao',
    render: (situacao: SituacaoImportacaoArquivoEnum) =>
      CustomTypography(SituacaoImportacaoArquivoEnumDisplay[situacao]),
  },
  {
    key: 'totalRegistros',
    title: 'Total Registros',
    dataIndex: 'totalRegistros',
    render: (value) => CustomTypography(value),
  },
  {
    key: 'totalProcessados',
    title: 'Total Processados',
    dataIndex: 'totalProcessados',
    render: (_, linha) => {
      let status: ProgressProps['status'] = undefined;
      let percent = (linha.totalRegistros / linha.totalProcessados) * 100;

      if (linha.situacao === SituacaoImportacaoArquivoEnum.Validando) {
        status = 'active';
      }

      if (linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado) {
        status = 'exception';
      }

      if (linha.totalProcessados === 100) {
        status = undefined;
      }

      return (
        <Progress
          size='small'
          status={status}
          percent={percent}
          strokeColor={progressColor}
          style={{ cursor: 'pointer' }}
        />
      );
    },
  },
];

const columnsInconsistencias: ColumnsType<RegistroDaInscricaoInsconsistenteDTO> = [
  {
    key: 'linha',
    title: 'Linha',
    dataIndex: 'linha',
  },
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
  const { tableState } = useContext(DataTableContext);

  const propostaId = params.id ? Number(params.id) : 0;
  const nomeFormacao = location?.state?.nomeFormacao;

  const [linhaId, setLinhaId] = useState<number>();
  const [situacao, setSituacao] = useState<number>();
  const [abrirModal, setAbrirModal] = useState<boolean>(false);
  const [abrirDrawer, setAbrirDrawer] = useState<boolean>(false);
  const [dataSourceInconsistencias, setDataSourceInconsistencias] =
    useState<RegistroDaInscricaoInsconsistenteDTO[]>();

  const paramsRoute = {
    state: location.state,
  };

  const onClickEditar = async (linha: ArquivoInscricaoImportadoDTO) => {
    if (linha.situacao !== SituacaoImportacaoArquivoEnum.Validado) return;

    setLinhaId(linha.id);

    const resposta = await importacaoArquivoService.buscarInconsistencias(linha.id);

    if (resposta.sucesso) {
      if (resposta.dados?.items.length) {
        setDataSourceInconsistencias(resposta.dados.items);
        if (
          linha.situacao === SituacaoImportacaoArquivoEnum.Validado ||
          linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado
        ) {
          setAbrirDrawer(true);
          setSituacao(linha.situacao);
        }
      } else {
        if (linha.situacao === SituacaoImportacaoArquivoEnum.Validado) {
          setAbrirModal(true);
        }
      }
    }
  };

  const customRequest = useCallback(async (options: OptionsProps) => {
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

  const continuarProcessamento = () => {
    if (!linhaId) return;

    importacaoArquivoService.continuarProcessamento(linhaId).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'O arquivo foi processado com sucesso!',
        });

        setAbrirModal(false);
        setAbrirDrawer(false);
      }

      setAbrirModal(false);
      setAbrirDrawer(false);
    });
  };

  const cancelarProcessamento = () => {
    if (!linhaId) return;

    confirmacao({
      content: DESEJA_CANCELAR_PROCESSAMENTO_ARQUIVO,
      onOk() {
        importacaoArquivoService.cancelarProcessamento(linhaId).then(() => {
          setAbrirDrawer(false);
          setAbrirModal(false);
        });
      },
    });
  };

  useEffect(() => {
    tableState.reloadData();
  }, [continuarProcessamento, cancelarProcessamento]);

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
                          id={CF_BUTTON_ATUALIZAR_DADOS}
                          icon={<LuRefreshCw size={16} />}
                          onClick={() => {
                            tableState.reloadData();
                          }}
                        >
                          Atualizar dados
                        </ButtonSecundary>
                      </Col>
                      <Col>
                        <Upload
                          name='file'
                          customRequest={(options: any) => customRequest(options)}
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

              {abrirDrawer && (
                <Drawer
                  title='Registros com inconsistências'
                  open
                  size='large'
                  onClose={() => setAbrirDrawer(false)}
                  extra={
                    <Space>
                      <ButtonSecundary
                        block
                        type='default'
                        id={CF_BUTTON_MODAL_CANCELAR}
                        onClick={() => cancelarProcessamento()}
                        style={{ fontWeight: 700 }}
                        disabled={situacao !== SituacaoImportacaoArquivoEnum.Validado}
                      >
                        Cancelar
                      </ButtonSecundary>

                      <ButtonPrimary
                        type='primary'
                        onClick={() => continuarProcessamento()}
                        disabled={situacao !== SituacaoImportacaoArquivoEnum.Validado}
                      >
                        Continuar
                      </ButtonPrimary>
                    </Space>
                  }
                >
                  <DataTable
                    columns={columnsInconsistencias}
                    dataSource={dataSourceInconsistencias}
                    url={`v1/ImportacaoArquivo/${linhaId}/registros-inconsistencia`}
                  />
                </Drawer>
              )}

              {abrirModal && (
                <Modal
                  open
                  title='Registros'
                  centered
                  destroyOnClose
                  okText='Continuar'
                  onOk={() => continuarProcessamento()}
                  onCancel={() => cancelarProcessamento()}
                >
                  <Typography.Text style={{ fontSize: 16 }}>
                    Os registros foram validados e estão prontos para processamento. Por favor,
                    prossiga clicando em "Continuar" para confirmar.
                  </Typography.Text>
                </Modal>
              )}
            </Col>
          </CardContent>
        </Form>
      </Col>
    </DataTableContextProvider>
  );
};
