import { Col, Form, Progress, ProgressProps, Row, Space, Typography, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import CardContent from '~/components/lib/card-content';
import DataTableArquivosImportados from '~/components/lib/card-table-arquivos-importados';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import HeaderPage from '~/components/lib/header-page';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import {
  CF_BUTTON_ARQUIVO,
  CF_BUTTON_ATUALIZAR_DADOS,
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
import { DrawerInconsistencias } from './drawer-inconsistencias';

interface OptionsProps {
  onSuccess: () => void;
  file: File;
}

const progressColor: ProgressProps['strokeColor'] = {
  '0%': Colors.SystemSME.ConectaFormacao.PRIMARY,
  '100%': Colors.SystemSME.ConectaFormacao.PRIMARY,
};

const CustomTypography = (value: string, linha: ArquivoInscricaoImportadoDTO) => {
  const statusEhValidado = linha.situacao === SituacaoImportacaoArquivoEnum.Validado;
  const statusEhCancelado = linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado;
  const statusEhProcessado = linha.situacao === SituacaoImportacaoArquivoEnum.Processado;
  return (
    <Typography style={{ cursor: statusEhValidado || statusEhCancelado || statusEhProcessado ? 'pointer' : 'default' }}>
      {value}
    </Typography>
  );
};

const columns: ColumnsType<ArquivoInscricaoImportadoDTO> = [
  {
    key: 'arquivo',
    title: 'Arquivo',
    dataIndex: 'nome',
    render: (value, linha) => CustomTypography(value, linha),
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'situacao',
    render: (situacao: SituacaoImportacaoArquivoEnum, linha) =>
      CustomTypography(SituacaoImportacaoArquivoEnumDisplay[situacao], linha),
  },
  {
    key: 'totalRegistros',
    title: 'Total Registros',
    dataIndex: 'totalRegistros',
    render: (value, linha) => CustomTypography(value, linha),
  },
  {
    key: 'totalProcessados',
    title: 'Total Processados',
    dataIndex: 'totalProcessados',
    render: (_, linha) => {
      let status: ProgressProps['status'] = undefined;
      let percent = (linha.totalRegistros / linha.totalProcessados) * 100;
      const statusEhValidado = linha.situacao === SituacaoImportacaoArquivoEnum.Validado;
      const statusEhValidando = linha.situacao === SituacaoImportacaoArquivoEnum.Validando;
      const statusEhCancelado = linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado;
      const statusEhProcessado = linha.situacao === SituacaoImportacaoArquivoEnum.Processado;

      if (statusEhValidando) {
        status = 'active';
      }

      if (statusEhCancelado) {
        status = 'exception';
      }

      if (statusEhProcessado) {
        status = 'success';
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
          style={{ cursor: statusEhValidado || statusEhCancelado || statusEhProcessado ? 'pointer' : 'default' }}
        />
      );
    },
  },
];

export const InscricoesPorArquivoListagem = forwardRef(() => {
  const [form] = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const refTable = useRef<any>(null);

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

  const onClickEditar = async (linha: ArquivoInscricaoImportadoDTO) => {debugger;
    if (
      linha.situacao !== SituacaoImportacaoArquivoEnum.Validado &&
      linha.situacao !== SituacaoImportacaoArquivoEnum.Cancelado &&
      linha.situacao !== SituacaoImportacaoArquivoEnum.Processado
    )
      return;

    setLinhaId(linha.id);

    const resposta = await importacaoArquivoService.buscarInconsistencias(linha.id);

    if (resposta.sucesso) {
      if (resposta.dados?.items.length) {
        setDataSourceInconsistencias(resposta.dados.items);
        setAbrirDrawer(true);
        setSituacao(linha.situacao);
      } else {
        setAbrirModal(true);
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
      notification.success({
        message: 'Sucesso',
        description: 'Arquivo importado com sucesso',
      });

      refTable.current?.reloadTable();
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
        refTable.current?.reloadTable();
      }
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

          if (refTable?.current) {
            refTable.current?.reloadTable();
          }
        });
      },
    });
  };

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
                <Col>
                  <ButtonSecundary
                    id={CF_BUTTON_ATUALIZAR_DADOS}
                    icon={<LuRefreshCw size={16} />}
                    onClick={() => {
                      refTable.current?.reloadTable();
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
              </Row>
            </Col>
          </HeaderPage>

          <CardContent>
            <Col xs={24}>
              <Typography style={{ marginBottom: 12, fontWeight: 'bold' }}>
                Listagem de inscrições por arquivo
              </Typography>

              <DataTableArquivosImportados
                ref={refTable}
                columns={columns}
                url={`/v1/ImportacaoArquivo/${propostaId}/arquivos-importados`}
                onRow={(row) => ({
                  onClick: () => {
                    onClickEditar(row);
                  },
                })}
              />

              {abrirDrawer && (
                <DrawerInconsistencias
                  linhaId={linhaId}
                  situacao={situacao}
                  onClickCancelar={cancelarProcessamento}
                  onClickContinuar={continuarProcessamento}
                  dataSourceInconsistencias={dataSourceInconsistencias}
                  drawerProps={{ onClose: () => setAbrirDrawer(false) }}
                />
              )}

              {abrirModal && (
                <Modal
                  open
                  title='Registros'
                  centered
                  destroyOnClose
                  okText='Continuar'
                  cancelText='Fechar'
                  onOk={() => continuarProcessamento()}
                  onCancel={() => setAbrirModal(false)}
                  footer={(_, { OkBtn, CancelBtn }) => (
                    <Space>
                      <CancelBtn />
                      <ButtonSecundary type='text' onClick={cancelarProcessamento}>
                        Cancelar
                      </ButtonSecundary>
                      <OkBtn />
                    </Space>
                  )}
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
});
