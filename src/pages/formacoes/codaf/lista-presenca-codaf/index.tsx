import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { CodafListagemLayout } from '~/pages/formacoes/codaf/shared/componentes/codaf-listagem-layout';
import { notification } from '~/components/lib/notification';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  baixarRelatorioCodaf,
  CodafListaPresencaDTO,
  obterListaPresencaCodaf,
  emitirCertificadosCodaf,
  imprimirRelatorioCodaf,
} from '~/core/services/codaf-lista-presenca-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { downloadBlob } from '~/core/utils/functions';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { TipoCodaf } from '~/core/enum/tipo-codaf';
import { CodafFiltroForm } from '~/pages/formacoes/codaf/shared/componentes/codaf-filtro-form';
import { getColunasBase } from '~/pages/formacoes/codaf/shared/utils/colunas-codaf-listagem';
import { useCodafListagem } from '~/pages/formacoes/codaf/shared/hooks/use-codaf-listagem';

const situacoes = [
  { id: 1, descricao: 'Iniciado' },
  { id: 2, descricao: 'Aguardando DF' },
  { id: 3, descricao: 'Devolvido pelo DF' },
  { id: 4, descricao: 'Finalizado' },
];

const obterSituacaoTexto = (status: number): string => {
  const situacao = situacoes.find((s) => s.id === status);
  return situacao?.descricao || 'Desconhecido';
};

const LOCAL_STORAGE_KEY = 'codaf_emitir_certificados_clicked';
const EOL_STORAGE_KEY = 'eol_txt_generated';

const getEmitidos = (): number[] => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};
const saveEmitido = (id: number) => {
  const emitidos = getEmitidos();
  if (!emitidos.includes(id)) {
    emitidos.push(id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emitidos));
  }
};
const wasEmitido = (id: number): boolean => getEmitidos().includes(id);

const getGeneratedMap = (): Record<number, boolean> =>
  JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}');
const setGenerated = (id: number) => {
  const map = getGeneratedMap();
  map[id] = true;
  localStorage.setItem(EOL_STORAGE_KEY, JSON.stringify(map));
};
const wasGenerated = (id: number): boolean => !!getGeneratedMap()[id];

const ListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesHomologadas);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [, forceUpdate] = useState(0);

  const ehPerfilAdminDf = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];
  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const ocultarColunas = ehPerfilDF || ehPerfilEMFORPEF;

  const {
    dados,
    loading,
    paginaAtual,
    totalRegistros,
    opcoesFormacao,
    loadingAutocomplete,
    turmasAPI,
    turmaDisabled,
    buscarPagina,
    onSearchFormacao,
    onSelectFormacao,
    onClickFiltrar,
    onClickLimpar,
    handleTableChange,
  } = useCodafListagem<CodafListaPresencaDTO>(form, registrosPorPagina, {
    buscarDados: obterListaPresencaCodaf as any,
    campoData: 'dataEnvio',
    parametroData: 'DataEnvioDf',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingAcoes, setLoadingAcoes] = useState(false);

  React.useEffect(() => {
    buscarPagina(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickNovo = () => setModalVisible(true);
  const onClickIrParaInscricoes = () => {
    setModalVisible(false);
    navigate(ROUTES.FORMACAOES_INSCRICOES);
  };
  const onClickContinuarRegistro = () => {
    setModalVisible(false);
    navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO_NOVO);
  };

  const onClickEmitirCertificado = async (record: CodafListaPresencaDTO) => {
    try {
      setLoadingAcoes(true);
      saveEmitido(record.id);
      const response = await emitirCertificadosCodaf(record.id, TipoCodaf.ListaPresenca);
      forceUpdate((x) => x + 1);
      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description:
            'O certificado está sendo emitido, volte mais tarde para acompanhar a atualização.',
        });
        buscarPagina(paginaAtual);
      } else {
        notification.error({ message: 'Erro', description: 'Erro ao emitir certificados' });
      }
    } catch {
      notification.error({ message: 'Erro', description: 'Erro ao emitir certificados' });
    } finally {
      setLoadingAcoes(false);
    }
  };

  const downloadTxtFile = (content: string, filename: string) => {
    const formattedContent = content.replace(/\|00\|HOM/g, '||HOM');
    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onClickExportarListaInscritos = async (record: CodafListaPresencaDTO) => {
    try {
      const response = await baixarRelatorioCodaf(record.id);
      if (response.sucesso && response.dados) {
        const filename = `HOM${record.numeroHomologacao}${record.id}.txt`;
        downloadTxtFile(response.dados, filename);
        setGenerated(record.id);
        notification.success({
          message: 'Sucesso',
          description: `O arquivo ${filename} foi gerado com sucesso!`,
        });
        buscarPagina(paginaAtual);
      }
    } catch {
      notification.error({ message: 'Erro', description: 'Erro ao exportar lista de inscritos' });
    }
  };

  const onClickBaixarRelatorioCodaf = async (record: CodafListaPresencaDTO) => {
    try {
      setLoadingAcoes(true);
      let fileName = `CODAF_${record.numeroHomologacao}_${record.nomeTurma.replace(' ', '_')}.xlsx`;
      const response = await imprimirRelatorioCodaf(record.id);

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch?.[1]) fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
        downloadBlob(response.data, fileName);
        notification.success({
          message: 'Sucesso',
          description: `${fileName}. Arquivo baixado com sucesso`,
        });
        buscarPagina(paginaAtual);
      } else {
        notification.error({
          message: 'Erro',
          description: `${fileName}. Não conseguimos gerar o seu arquivo. Tente novamente.`,
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Não conseguimos gerar o seu arquivo. Tente novamente.',
      });
    } finally {
      setLoadingAcoes(false);
    }
  };

  const getMenuAcoes = (record: CodafListaPresencaDTO): MenuProps => {
    const hasCodigoCursoEol = record.codigoCursoEol != null;
    const isAguardandoDF = record.status === 2;
    const isFinalizado = record.status === 4;
    const isCertificacaoConcluida = record.statusCertificacaoTurma === 4;
    const podeGerarComoComum = isAguardandoDF && hasCodigoCursoEol;
    const podeGerarComoAdmin = isFinalizado && ehPerfilAdminDf;
    const podeGerarTxtEol = podeGerarComoComum || podeGerarComoAdmin;

    const getTooltipMessage = () => {
      if (podeGerarTxtEol) return 'Clique para gerar TXT EOL';
      if (isAguardandoDF && !hasCodigoCursoEol)
        return 'Informe o valor de Cód. curso EOL para gerar o arquivo.';
      return 'Função ativa apenas para a situação Aguardando DF com valor de Cod. Curso EOL informado';
    };

    const items: MenuProps['items'] = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        disabled: !podeGerarTxtEol,
        label: !podeGerarTxtEol ? (
          <span style={{ display: 'block' }}>
            Gerar TXT EOL &nbsp;
            <Tooltip title={getTooltipMessage()}>
              <QuestionCircleOutlined
                style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }}
              />
            </Tooltip>
          </span>
        ) : (
          <Tooltip title='Clique para gerar TXT EOL'>
            <span style={{ display: 'block' }}>Gerar TXT EOL</span>
          </Tooltip>
        ),
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
          if (podeGerarTxtEol) onClickExportarListaInscritos(record);
        },
      });
    }

    items.push({
      key: 'baixar-relatorio-codaf',
      disabled: !isCertificacaoConcluida,
      label: !isCertificacaoConcluida ? (
        <span style={{ display: 'block' }}>
          Baixar Relatório CODAF &nbsp;
          <Tooltip title='Gere os certificados para baixar o relatório CODAF.'>
            <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }} />
          </Tooltip>
        </span>
      ) : (
        <Tooltip title='Clique para exportar arquivo CODAF desta turma'>
          <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
        </Tooltip>
      ),
      onClick: (e: any) => {
        e.domEvent.stopPropagation();
        if (isCertificacaoConcluida) onClickBaixarRelatorioCodaf(record);
      },
    });

    return { items };
  };

  const getCertificadoButtonState = (record: CodafListaPresencaDTO) => {
    wasGenerated(record.id);
    wasEmitido(record.id);
    const status = record.statusCertificacaoTurma;
    if (status === 0) return { text: 'Sem certificado', disabled: true };
    if (status === 1) return { text: 'Não emitidos', disabled: true };
    if (status === 2) return { text: 'Emitir certificados', disabled: false };
    if (status === 3) return { text: 'Emitindo certificado', disabled: true };
    if (status === 4) return { text: 'Certificados emitidos', disabled: true };
    return { text: '—', disabled: true };
  };

  const colunasBase = getColunasBase<CodafListaPresencaDTO>(ocultarColunas, obterSituacaoTexto);

  const colunasAdicionais: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'certificado',
      title: (
        <span>
          Certificado{' '}
          <Tooltip title='Ao emitir certificado, a conclusão do curso é gerada tanto para cursistas quanto para regentes.'>
            <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
          </Tooltip>
        </span>
      ),
      width: 220,
      render: (_: any, record: CodafListaPresencaDTO) => {
        const { text, disabled } = getCertificadoButtonState(record);
        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            loading={loadingAcoes && text === 'Estamos emitindo certificado'}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onClickEmitirCertificado(record);
            }}
            style={{
              width: '100%',
              borderColor: !disabled ? '#ff6b35' : '#ccc',
              color: !disabled ? '#ff6b35' : '#999',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {text}
          </Button>
        );
      },
    },
  ];

  const colunaAcoes: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_: any, record: CodafListaPresencaDTO) => (
        <Dropdown
          menu={getMenuAcoes(record)}
          trigger={['click']}
          placement='bottomRight'
          dropdownRender={(menu) => (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
            </div>
          )}
        >
          <Button
            type='default'
            icon={<BsThreeDotsVertical />}
            style={{ borderColor: '#ff6b35', color: '#ff6b35' }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const columns = ocultarColunas
    ? [...colunasBase, ...colunaAcoes]
    : [...colunasBase, ...colunasAdicionais, ...colunaAcoes];

  return (
    <CodafListagemLayout
      title='CODAF Lista de Presença'
      permissaoIncluir={permissao?.podeIncluir ?? false}
      onClickNovo={onClickNovo}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      onClickIrParaInscricoes={onClickIrParaInscricoes}
      onClickContinuarRegistro={onClickContinuarRegistro}
      dados={dados}
      columns={columns}
      loading={loading}
      paginaAtual={paginaAtual}
      registrosPorPagina={registrosPorPagina}
      totalRegistros={totalRegistros}
      setRegistrosPorPagina={setRegistrosPorPagina}
      handleTableChange={handleTableChange}
      onRowClick={(record) =>
        navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO_EDITAR.replace(':id', String(record.id)))
      }
    >
      <CodafFiltroForm
        form={form}
        situacoes={situacoes}
        loading={loading}
        opcoesFormacao={opcoesFormacao}
        loadingAutocomplete={loadingAutocomplete}
        turmasAPI={turmasAPI}
        turmaDisabled={turmaDisabled}
        onSearchFormacao={onSearchFormacao}
        onSelectFormacao={onSelectFormacao}
        onClickFiltrar={onClickFiltrar}
        onClickLimpar={onClickLimpar}
        campoData={{ label: 'Data de envio para DF', name: 'dataEnvio' }}
      />
    </CodafListagemLayout>
  );
};

export default ListaPresencaCodaf;
