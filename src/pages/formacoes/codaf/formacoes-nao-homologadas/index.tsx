import { Button, Dropdown, MenuProps, Tooltip, Row, Col } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { CodafListagemLayout } from '~/pages/formacoes/codaf/shared/componentes/codaf-listagem-layout';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  CodafNaoHomologadoListagemDTO,
  obterListaCodafNaoHomologado,
} from '~/core/services/codaf-nao-homologado-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { CodafFiltroForm } from '~/pages/formacoes/codaf/shared/componentes/codaf-filtro-form';
import { getColunasBase } from '~/pages/formacoes/codaf/shared/utils/colunas-codaf-listagem';
import { useCodafListagem } from '~/pages/formacoes/codaf/shared/hooks/use-codaf-listagem';

const situacoes = [
  { id: 1, descricao: 'Iniciado' },
  { id: 2, descricao: 'Aguardando finalização' },
  { id: 3, descricao: 'Finalizado' },
];

const obterSituacaoTexto = (status: number): string => {
  const situacao = situacoes.find((s) => s.id === status);
  return situacao?.descricao || 'Desconhecido';
};

interface DropdownMenuRenderProps {
  menu: React.ReactElement;
}

const CustomDropdownRender: React.FC<DropdownMenuRenderProps> = ({ menu }) => (
  <div
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }}
  >
    {React.cloneElement(menu, { style: { boxShadow: 'none' } })}
  </div>
);

const CodafFormacoesNaoHomologadas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesNaoHomologadas);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);

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
  } = useCodafListagem<CodafNaoHomologadoListagemDTO>(form, registrosPorPagina, {
    buscarDados: obterListaCodafNaoHomologado as any,
    campoData: 'dataFinalizacao',
    parametroData: 'DataFinalizacao',
  });

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
    navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO_NOVO);
  };

  const getDeclaracaoButtonState = (_record: CodafNaoHomologadoListagemDTO) => {
    const status = 0;
    if (status === 0) return { text: 'Sem declaração', disabled: true };
    if (status === 1) return { text: 'Não emitidas', disabled: true };
    if (status === 2) return { text: 'Emitir declarações', disabled: false };
    if (status === 3) return { text: 'Emitindo declarações', disabled: true };
    if (status === 4) return { text: 'Declarações emitidas', disabled: true };
    return { text: '—', disabled: true };
  };

  const getMenuAcoes = (): MenuProps => {
    const items: MenuProps['items'] = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        label: 'Exportar Lista de inscritos',
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
        },
      });
    }

    items.push({
      key: 'baixar-relatorio-codaf',
      label: (
        <Tooltip title='Gere as declarações para baixar o relatório CODAF.'>
          <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
        </Tooltip>
      ),
      onClick: (e: any) => {
        e.domEvent.stopPropagation();
      },
    });

    return { items };
  };

  const colunasBase = getColunasBase<CodafNaoHomologadoListagemDTO>(
    ocultarColunas,
    obterSituacaoTexto,
  );

  const colunasAdicionais: ColumnsType<CodafNaoHomologadoListagemDTO> = [
    {
      key: 'declaracao',
      title: (
        <span>
          Declaração{' '}
          <Tooltip title='Ao emitir declaração, a conclusão do curso é gerada tanto para cursistas quanto para regentes.'>
            <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
          </Tooltip>
        </span>
      ),
      width: 220,
      render: (_: any, record: CodafNaoHomologadoListagemDTO) => {
        const { text, disabled } = getDeclaracaoButtonState(record);
        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            loading={loading && text === 'Emitindo declarações'}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              borderColor: disabled ? '#ccc' : '#ff6b35',
              color: disabled ? '#999' : '#ff6b35',
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

  const colunaAcoes: ColumnsType<CodafNaoHomologadoListagemDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_: any) => (
        <Dropdown
          menu={getMenuAcoes()}
          trigger={['click']}
          placement='bottomRight'
          dropdownRender={(menu) => <CustomDropdownRender menu={menu as React.ReactElement} />}
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
      title='CODAF não homologado'
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
      onRowClick={(record) => navigate(`/formacoes/lista-presenca-codaf/editar/${record.id}`)}
    >
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <div
            style={{
              paddingBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              Aqui você cria um novo CODAF Suplementar. Preencha todas as informações antes de
              salvar.
            </div>
          </div>
        </Col>
      </Row>

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
        campoData={{ label: 'Data de envio para finalização', name: 'dataFinalizacao' }}
      />
    </CodafListagemLayout>
  );
};

export default CodafFormacoesNaoHomologadas;
