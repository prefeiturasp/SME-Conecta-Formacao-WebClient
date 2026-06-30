import {
  AutoComplete,
  Button,
  Col,
  Dropdown,
  Empty,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useCallback, useMemo, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import {
  baixarRelatorioCodaf,
  emitirCertificadosCodaf,
  imprimirRelatorioCodaf,
} from '~/core/services/codaf-lista-presenca-service';
import {
  CodafSuplementarDTO,
  obterCodafSuplementar,
} from '~/core/services/codaf-suplementar-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import {
  autocompletarFormacaoComCodaf,
  PropostaAutocompletarDTO,
} from '~/core/services/proposta-service';
import { onClickVoltar } from '~/core/utils/form';
import { downloadBlob } from '~/core/utils/functions';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';

dayjs.locale('pt-br');

type TrainingStatus = {
  value: number;
  label: string;
};

type CertificatePresentation = {
  label: string;
  disabled: boolean;
};

type PaginationChange = {
  current?: number;
  pageSize?: number;
};

type FilterCellProps = {
  children: React.ReactNode;
};

type MenuTextProps = {
  children: React.ReactNode;
  tooltip: string;
  blocked?: boolean;
};

const SUPPORT_COLOR = '#ff6b35';

const CODAF_SUPLEMENTAR_STATUS = {
  INICIADO: 1,
  AGUARDANDO_FINALIZACAO: 2,
  FINALIZADO: 3,
} as const;

const CERTIFICADO_STATUS = {
  SEM_CERTIFICADO: 0,
  NAO_EMITIDOS: 1,
  PODE_EMITIR: 2,
  EMITINDO: 3,
  EMITIDOS: 4,
} as const;

const trainingStatuses: TrainingStatus[] = [
  { value: CODAF_SUPLEMENTAR_STATUS.INICIADO, label: 'Iniciado' },
  { value: CODAF_SUPLEMENTAR_STATUS.AGUARDANDO_FINALIZACAO, label: 'Aguardando finalização' },
  { value: CODAF_SUPLEMENTAR_STATUS.FINALIZADO, label: 'Finalizado' },
];

const modalTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '100%',
  letterSpacing: '0%',
};

const outlineOrangeButtonStyle: React.CSSProperties = {
  borderColor: SUPPORT_COLOR,
  color: SUPPORT_COLOR,
  fontWeight: 500,
};

const strongButtonStyle: React.CSSProperties = {
  fontWeight: 700,
};

const tableWrapperStyle = `
.codaf-supplementary-result .ant-pagination {
  display: flex;
  justify-content: center;
}
.codaf-supplementary-result .ant-dropdown-menu {
  background-color: #FFFFFF;
}
.codaf-supplementary-result .ant-dropdown-menu-item {
  color: #42474A;
}
.codaf-supplementary-result .ant-dropdown-menu-item:hover {
  background-color: #f5f5f5;
  color: #42474A;
}
`;

const dropdownSurfaceStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 4,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
};

const clearButtonStyle: React.CSSProperties = {
  fontWeight: 700,
  borderColor: SUPPORT_COLOR,
  color: SUPPORT_COLOR,
};

const emptyResultStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  fontSize: '16px',
  color: '#999',
  width: '100%',
};

const helpIconStyle: React.CSSProperties = {
  color: SUPPORT_COLOR,
  cursor: 'help',
  marginRight: 4,
};

const tooltipIconStyle: React.CSSProperties = {
  color: SUPPORT_COLOR,
  cursor: 'help',
};

const menuTextStyle: React.CSSProperties = {
  display: 'block',
};

const nameCellStyle: React.CSSProperties = {
  maxWidth: 300,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const hiddenColumnsProfileNames = new Set<string | undefined>([
  TipoPerfilTagDisplay[TipoPerfilEnum.DF],
  'EMFORPEF',
]);

const statusTextByValue = new Map(trainingStatuses.map(({ value, label }) => [value, label]));

function FilterCell({ children }: FilterCellProps) {
  return (
    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
      <b>{children}</b>
    </Col>
  );
}

function ActionMenuText({ children, tooltip, blocked = false }: MenuTextProps) {
  if (!blocked) {
    return (
      <Tooltip title={tooltip}>
        <span style={menuTextStyle}>{children}</span>
      </Tooltip>
    );
  }

  return (
    <span style={menuTextStyle}>
      {children} &nbsp;
      <Tooltip title={tooltip}>
        <QuestionCircleOutlined style={helpIconStyle} />
      </Tooltip>
    </span>
  );
}

function getTrainingStatusLabel(status: number): string {
  return statusTextByValue.get(status) ?? 'Desconhecido';
}

function buildCertificateState(status?: number): CertificatePresentation {
  const stateByStatus: Record<number, CertificatePresentation> = {
    [CERTIFICADO_STATUS.SEM_CERTIFICADO]: { label: 'Sem certificado', disabled: true },
    [CERTIFICADO_STATUS.NAO_EMITIDOS]: { label: 'Não emitidos', disabled: true },
    [CERTIFICADO_STATUS.PODE_EMITIR]: { label: 'Emitir certificados', disabled: false },
    [CERTIFICADO_STATUS.EMITINDO]: { label: 'Emitindo certificado', disabled: true },
    [CERTIFICADO_STATUS.EMITIDOS]: { label: 'Certificados emitidos', disabled: true },
  };

  return stateByStatus[status ?? -1] ?? { label: '—', disabled: true };
}

function buildReportFileName(record: CodafSuplementarDTO): string {
  return `CODAF_${record.numeroHomologacao}_${record.nomeTurma.replace(' ', '_')}.xlsx`;
}

function resolveHeaderFileName(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) {
    return fallback;
  }

  const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  return fileNameMatch?.[1]?.replace(/['"]/g, '') || fallback;
}

function downloadPlainText(content: string, filename: string) {
  const normalizedContent = content.replace(/\|00\|HOM/g, '||HOM');
  const file = new Blob([normalizedContent], { type: 'text/plain;charset=utf-8' });
  const objectUrl = window.URL.createObjectURL(file);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(objectUrl);
}

function renderTrainingName(text: string) {
  return (
    <Tooltip title={text}>
      <div style={nameCellStyle}>{text}</div>
    </Tooltip>
  );
}

const CodafSuplementar: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const permission = obterPermissaoPorMenu(MenuEnum.CodafSuplementar);
  const selectedProfile = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [rows, setRows] = useState<CodafSuplementarDTO[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasFilter, setHasFilter] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [formationOptions, setFormationOptions] = useState<PropostaAutocompletarDTO[]>([]);
  const [searchingFormation, setSearchingFormation] = useState(false);
  const [classOptions, setClassOptions] = useState<RetornoListagemDTO[]>([]);
  const [isClassBlocked, setIsClassBlocked] = useState(true);

  const isDfAdmin = selectedProfile === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];
  const mustHideRestrictedColumns = hiddenColumnsProfileNames.has(selectedProfile);

  const openCreationNotice = useCallback(() => {
    setIsNoticeOpen(true);
  }, []);

  const closeCreationNotice = useCallback(() => {
    setIsNoticeOpen(false);
  }, []);

  const goToEnrollments = useCallback(() => {
    setIsNoticeOpen(false);
    navigate(ROUTES.FORMACAOES_INSCRICOES);
  }, [navigate]);

  const goToCreationForm = useCallback(() => {
    setIsNoticeOpen(false);
    navigate(ROUTES.CODAF_SUPLEMENTAR_NOVO);
  }, [navigate]);

  const loadRows = useCallback(
    async (page = 1, recordsPerPage = pageSize) => {
      setBusy(true);
      setFailed(false);

      try {
        const homologationNumber = form.getFieldValue('numeroHomologacao');
        const filters = {
          NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
          CodigoFormacao: form.getFieldValue('codigoFormacao') || undefined,
          NumeroHomologacao: homologationNumber ? Number(homologationNumber) : undefined,
          PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
          AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
          Status: form.getFieldValue('situacao'),
          NumeroPagina: page,
          NumeroRegistros: recordsPerPage,
        };

        const response = await obterCodafSuplementar(filters);

        if (!response.sucesso || !response.dados) {
          throw new Error('CODAF supplementary list request failed');
        }

        setRows(response.dados.items || []);
        setRecordsTotal(response.dados.totalRegistros || 0);
        setCurrentPage(page);
      } catch {
        setFailed(true);
        setRows([]);
        setRecordsTotal(0);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar dados do CODAF Suplementar',
        });
      } finally {
        setBusy(false);
      }
    },
    [form, pageSize],
  );

  const requestCertificateIssue = useCallback(
    async (record: CodafSuplementarDTO) => {
      try {
        setBusy(true);
        const response = await emitirCertificadosCodaf(record.id);

        if (!response.sucesso) {
          throw new Error('Certificate issue request failed');
        }

        notification.success({
          message: 'Sucesso',
          description:
            'O certificado está sendo emitido, volte mais tarde para acompanhar a atualização.',
        });
        await loadRows(currentPage);
      } catch {
        notification.error({
          message: 'Erro',
          description: 'Erro ao emitir certificados',
        });
      } finally {
        setBusy(false);
      }
    },
    [currentPage, loadRows],
  );

  const exportEnrolledList = useCallback(
    async (record: CodafSuplementarDTO) => {
      try {
        const response = await baixarRelatorioCodaf(record.id);

        if (response.sucesso && response.dados) {
          const filename = `HOM${record.numeroHomologacao}${record.id}.txt`;
          downloadPlainText(response.dados, filename);
          notification.success({
            message: 'Sucesso',
            description: `O arquivo ${filename} foi gerado com sucesso!`,
          });
          await loadRows(currentPage);
        }
      } catch {
        notification.error({
          message: 'Erro',
          description: 'Erro ao exportar lista de inscritos',
        });
      }
    },
    [currentPage, loadRows],
  );

  const downloadCodafReport = useCallback(
    async (record: CodafSuplementarDTO) => {
      let filename = buildReportFileName(record);

      try {
        setBusy(true);
        const response = await imprimirRelatorioCodaf(record.id);

        if (response.status !== 200) {
          throw new Error('Report download request failed');
        }

        filename = resolveHeaderFileName(response.headers['content-disposition'], filename);
        downloadBlob(response.data, filename);
        notification.success({
          message: 'Sucesso',
          description: `${filename}. Arquivo baixado com sucesso`,
        });
        await loadRows();
      } catch {
        notification.error({
          message: 'Erro',
          description: `${filename}. Não conseguimos gerar o seu arquivo. Tente novamente.`,
        });
      } finally {
        setBusy(false);
      }
    },
    [loadRows],
  );

  const buildActionsMenu = useCallback(
    (record: CodafSuplementarDTO): MenuProps => {
      const hasEolCourseCode = record.codigoCursoEol != null;
      const waitingForFinalization =
        record.status === CODAF_SUPLEMENTAR_STATUS.AGUARDANDO_FINALIZACAO;
      const finished = record.status === CODAF_SUPLEMENTAR_STATUS.FINALIZADO;
      const certificatesReady = record.statusCertificacaoTurma === CERTIFICADO_STATUS.EMITIDOS;
      const commonTxtAllowed = waitingForFinalization && hasEolCourseCode;
      const adminTxtAllowed = finished && isDfAdmin;
      const txtAllowed = commonTxtAllowed || adminTxtAllowed;

      const txtTooltip = (() => {
        if (txtAllowed) {
          return 'Clique para gerar TXT EOL';
        }

        if (waitingForFinalization && !hasEolCourseCode) {
          return 'Informe o valor de Cód. curso EOL para gerar o arquivo.';
        }

        return 'Função ativa apenas para a situação Aguardando finalização com valor de Cod. Curso EOL informado';
      })();

      const items: NonNullable<MenuProps['items']> = [];

      if (!mustHideRestrictedColumns) {
        items.push({
          key: 'export-enrolled-list',
          disabled: !txtAllowed,
          label: (
            <ActionMenuText tooltip={txtTooltip} blocked={!txtAllowed}>
              Gerar TXT EOL
            </ActionMenuText>
          ),
          onClick: (event) => {
            event.domEvent.stopPropagation();
            if (txtAllowed) {
              exportEnrolledList(record);
            }
          },
        });
      }

      items.push({
        key: 'download-codaf-report',
        disabled: !certificatesReady,
        label: (
          <ActionMenuText
            tooltip={
              certificatesReady
                ? 'Clique para exportar arquivo CODAF desta turma'
                : 'Gere os certificados para baixar o relatório CODAF.'
            }
            blocked={!certificatesReady}
          >
            Baixar Relatório CODAF
          </ActionMenuText>
        ),
        onClick: (event) => {
          event.domEvent.stopPropagation();
          if (certificatesReady) {
            downloadCodafReport(record);
          }
        },
      });

      return { items };
    },
    [downloadCodafReport, exportEnrolledList, isDfAdmin, mustHideRestrictedColumns],
  );

  const baseColumns = useMemo<ColumnsType<CodafSuplementarDTO>>(
    () => [
      {
        key: 'codigoFormacao',
        title: 'Código da formação',
        dataIndex: 'codigoFormacao',
        width: mustHideRestrictedColumns ? 100 : 80,
      },
      {
        key: 'numeroHomologacao',
        title: 'Número de homologação',
        dataIndex: 'numeroHomologacao',
        width: mustHideRestrictedColumns ? 100 : 80,
      },
      {
        key: 'nomeFormacao',
        title: 'Nome da formação',
        dataIndex: 'nomeFormacao',
        ellipsis: { showTitle: false },
        width: 300,
        render: renderTrainingName,
      },
      {
        key: 'nomeAreaPromotora',
        title: 'Área promotora',
        dataIndex: 'nomeAreaPromotora',
        width: mustHideRestrictedColumns ? 200 : 150,
        ellipsis: true,
      },
      {
        key: 'nomeTurma',
        title: 'Turma',
        dataIndex: 'nomeTurma',
        width: mustHideRestrictedColumns ? 150 : 120,
        ellipsis: true,
      },
      {
        key: 'status',
        title: 'Situação',
        dataIndex: 'status',
        width: mustHideRestrictedColumns ? 150 : 100,
        render: getTrainingStatusLabel,
      },
    ],
    [mustHideRestrictedColumns],
  );

  const certificateColumn = useMemo<ColumnsType<CodafSuplementarDTO>>(
    () => [
      {
        key: 'certificado',
        title: (
          <span>
            Certificado{' '}
            <Tooltip title='Ao emitir certificado, a conclusão do curso é gerada tanto para cursistas quanto para regentes.'>
              <QuestionCircleOutlined style={tooltipIconStyle} />
            </Tooltip>
          </span>
        ),
        width: 220,
        render: (_value, record) => {
          const certificate = buildCertificateState(record.statusCertificacaoTurma);

          return (
            <Button
              type='default'
              icon={<FiPrinter />}
              loading={busy && certificate.label === 'Emitir certificados'}
              disabled={certificate.disabled}
              onClick={(event) => {
                event.stopPropagation();
                requestCertificateIssue(record);
              }}
              style={{
                width: '100%',
                borderColor: certificate.disabled ? '#ccc' : SUPPORT_COLOR,
                color: certificate.disabled ? '#999' : SUPPORT_COLOR,
                fontWeight: 500,
                cursor: certificate.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {certificate.label}
            </Button>
          );
        },
      },
    ],
    [busy, requestCertificateIssue],
  );

  const actionColumn = useMemo<ColumnsType<CodafSuplementarDTO>>(
    () => [
      {
        key: 'acoes',
        title: 'Ações',
        width: 80,
        align: 'center',
        render: (_value, record) => (
          <Dropdown
            menu={buildActionsMenu(record)}
            trigger={['click']}
            placement='bottomRight'
            dropdownRender={(menu) => {
              const dropdownMenu = menu as React.ReactElement<{ style?: React.CSSProperties }>;

              return (
                <div style={dropdownSurfaceStyle}>
                  {React.cloneElement(dropdownMenu, {
                    style: { ...dropdownMenu.props.style, boxShadow: 'none' },
                  })}
                </div>
              );
            }}
          >
            <Button
              type='default'
              icon={<BsThreeDotsVertical />}
              style={outlineOrangeButtonStyle}
              onClick={(event) => event.stopPropagation()}
            />
          </Dropdown>
        ),
      },
    ],
    [buildActionsMenu],
  );

  const columns = useMemo(
    () =>
      mustHideRestrictedColumns
        ? [...baseColumns, ...actionColumn]
        : [...baseColumns, ...certificateColumn, ...actionColumn],
    [actionColumn, baseColumns, certificateColumn, mustHideRestrictedColumns],
  );

  const searchFormation = useCallback(async (searchText: string) => {
    const term = searchText.trim();

    if (!term) {
      setFormationOptions([]);
      return;
    }

    setSearchingFormation(true);

    try {
      const response = await autocompletarFormacaoComCodaf(term);
      setFormationOptions(response.sucesso && response.dados?.items ? response.dados.items : []);
    } catch {
      setFormationOptions([]);
    } finally {
      setSearchingFormation(false);
    }
  }, []);

  const selectFormation = useCallback(
    async (_value: string, option: any) => {
      const proposal = formationOptions.find(
        (item) => item.numeroHomologacao === option.numeroHomologacao,
      );

      if (!proposal) {
        return;
      }

      form.setFieldsValue({ turmaId: undefined });

      try {
        const response = await obterTurmasInscricao(proposal.propostaId);

        if (response.sucesso && response.dados) {
          setClassOptions(response.dados);
          setIsClassBlocked(false);
          return;
        }

        setClassOptions([]);
        setIsClassBlocked(true);
        notification.warning({
          message: 'Atenção',
          description: 'Nenhuma turma encontrada para esta formação',
        });
      } catch {
        setClassOptions([]);
        setIsClassBlocked(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar turmas da formação',
        });
      }
    },
    [form, formationOptions],
  );

  const applyFilter = useCallback(() => {
    setHasFilter(true);
    loadRows(1);
  }, [loadRows]);

  const resetFilter = useCallback(() => {
    form.resetFields();
    setRows([]);
    setRecordsTotal(0);
    setCurrentPage(1);
    setHasFilter(false);
    setFailed(false);
    setFormationOptions([]);
    setClassOptions([]);
    setIsClassBlocked(true);
  }, [form]);

  const changeTable = useCallback(
    (pagination: PaginationChange) => {
      if (pagination.pageSize && pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
        setCurrentPage(1);

        if (hasFilter) {
          loadRows(1, pagination.pageSize);
        }

        return;
      }

      loadRows(pagination.current || 1);
    },
    [hasFilter, loadRows, pageSize],
  );

  const formationAutoCompleteOptions = useMemo(
    () =>
      formationOptions.map((option) => ({
        value: option.numeroHomologacao.toString(),
        label: option.numeroHomologacao.toString(),
        numeroHomologacao: option.numeroHomologacao,
      })),
    [formationOptions],
  );

  const classSelectOptions = useMemo(
    () =>
      classOptions.map((classItem) => ({
        label: classItem.descricao,
        value: classItem.id,
      })),
    [classOptions],
  );

  const statusSelectOptions = useMemo(
    () => trainingStatuses.map(({ label, value }) => ({ label, value })),
    [],
  );


  return (
    <Col>
      <Modal
        title={<span style={modalTitleStyle}>Atenção!</span>}
        open={isNoticeOpen}
        onCancel={closeCreationNotice}
        centered
        width={600}
        footer={[
          <Button key='inscricoes' onClick={goToEnrollments} style={outlineOrangeButtonStyle}>
            Ir para tela de inscrições
          </Button>,
          <Button key='continuar' type='primary' onClick={goToCreationForm}>
            Continuar registro
          </Button>,
        ]}
      >
        <br />
        <p>
          Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na
          formação. Caso necessário, você pode realizar o cadastro pela tela de inscrições.
        </p>
        <br />
      </Modal>

      <HeaderPage title='CODAF Suplementar'>
        <Col span={24}>
          <Row gutter={[8, 8]} justify='end'>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                disabled={!permission.podeIncluir}
                onClick={openCreationNotice}
                style={strongButtonStyle}
              >
                Novo registro
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <FilterCell>
              <SelectAreaPromotora
                formItemProps={{ name: 'areaPromotoraId' }}
                selectProps={{ disabled: false }}
              />
            </FilterCell>
            <FilterCell>
              <InputTexto
                formItemProps={{
                  label: 'Nome da formação',
                  name: 'nomeFormacao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_NOME_FORMACAO,
                  placeholder: 'Nome da formação',
                  maxLength: 100,
                }}
              />
            </FilterCell>
          </Row>

          <Row gutter={[16, 8]}>
            <FilterCell>
              <InputNumero
                formItemProps={{
                  label: 'Código da formação',
                  name: 'codigoFormacao',
                  rules: [{ required: false }],
                }}
                inputProps={{
                  id: CF_INPUT_CODIGO_FORMACAO,
                  placeholder: 'Código da formação',
                  maxLength: 100,
                }}
              />
            </FilterCell>
            <FilterCell>
              <Form.Item label='Número de homologação' name='numeroHomologacao'>
                <AutoComplete
                  id={CF_INPUT_NUMERO_HOMOLOGACAO}
                  placeholder='Digite para buscar formação'
                  onSearch={searchFormation}
                  onSelect={selectFormation}
                  options={formationAutoCompleteOptions}
                  filterOption={false}
                  notFoundContent={
                    searchingFormation ? 'Buscando...' : 'Nenhuma formação encontrada'
                  }
                />
              </Form.Item>
            </FilterCell>
          </Row>

          <Row gutter={[16, 8]}>
            <FilterCell>
              <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                <Select
                  placeholder='Selecione a turma'
                  options={classSelectOptions}
                  disabled={isClassBlocked}
                  allowClear
                />
              </Form.Item>
            </FilterCell>
            <FilterCell>
              <Form.Item label='Situação' name='situacao' rules={[{ required: false }]}>
                <Select
                  placeholder='Selecione a situação'
                  options={statusSelectOptions}
                  allowClear
                />
              </Form.Item>
            </FilterCell>
          </Row>

          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
            <Col>
              <Button type='default' onClick={resetFilter} style={clearButtonStyle}>
                Limpar
              </Button>
            </Col>
            <Col>
              <Button type='primary' onClick={applyFilter} loading={busy} style={strongButtonStyle}>
                Filtrar
              </Button>
            </Col>
          </Row>

          {hasFilter && !failed && (
            <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
              <Col span={24}>
                {!busy && rows.length === 0 ? (
                  <div style={emptyResultStyle}>
                    <Empty description='Não encontramos registros para os filtros aplicados' />
                  </div>
                ) : (
                  <div className='codaf-supplementary-result'>
                    <Table
                      columns={columns}
                      dataSource={rows}
                      rowKey='id'
                      loading={busy}
                      pagination={{
                        current: currentPage,
                        pageSize,
                        total: recordsTotal,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 30, 50, 100],
                        locale: { items_per_page: '' },
                      }}
                      onChange={changeTable}
                      onRow={(record) => ({
                        onClick: () => navigate(`/formacoes/codaf-suplementar/editar/${record.id}`),
                        style: { cursor: 'pointer' },
                      })}
                      scroll={{ x: 'max-content' }}
                      locale={{
                        emptyText: 'Não encontramos registros para os filtros aplicados',
                      }}
                    />
                  </div>
                )}
                <style>{tableWrapperStyle}</style>
              </Col>
            </Row>
          )}
        </CardContent>
      </Form>
    </Col>
  );
};

export default CodafSuplementar;
