import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  Modal,
  Row,
  Table,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { CodafNaoHomologadoListagemDTO, obterListaCodafNaoHomologado } from '~/core/services/codaf-nao-homologado-service';
import { onClickVoltar } from '~/core/utils/form';
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

const CodafFormacoesNaoHomologadas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesNaoHomologadas);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);

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

  const getMenuAcoes = (record: CodafNaoHomologadoListagemDTO): MenuProps => {
    const isAguardando = record.status === 2;
    const isFinalizado = record.status === 3;
    const podeGerarComoComum = isAguardando;
    const podeGerarComoAdmin = isFinalizado && ehPerfilAdminDf;
    const podeGerarTxtEol = podeGerarComoComum || podeGerarComoAdmin;

    const getTooltipMessage = () => {
      if (podeGerarTxtEol) return 'Clique para gerar TXT EOL';
      if (isAguardando) return 'Informe o valor de Cód. curso EOL para gerar o arquivo.';
      return 'Função ativa apenas para a situação Aguardando DF ou para o perfil Admin DF quando a situação for Finalizado.';
    };

    const items: MenuProps['items'] = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        disabled: !podeGerarTxtEol,
        label: !podeGerarTxtEol ? (
          <span style={{ display: 'block' }}>
            Exportar Lista de inscritos &nbsp;
            <Tooltip title={getTooltipMessage()}>
              <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }} />
            </Tooltip>
          </span>
        ) : (
          <Tooltip title='Clique para gerar TXT EOL'>
            <span style={{ display: 'block' }}>Gerar TXT EOL</span>
          </Tooltip>
        ),
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

  const colunaAcoes: ColumnsType<CodafNaoHomologadoListagemDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_: any, record: CodafNaoHomologadoListagemDTO) => (
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
    <Col>
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>
            Atenção!
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        centered
        width={600}
        footer={[
          <Button
            key='inscricoes'
            onClick={onClickIrParaInscricoes}
            style={{ borderColor: '#ff6b35', color: '#ff6b35', fontWeight: 500 }}
          >
            Ir para tela de inscrições
          </Button>,
          <Button key='continuar' type='primary' onClick={onClickContinuarRegistro}>
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

      <HeaderPage title='CODAF não homologado'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
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
                disabled={!permissao.podeIncluir}
                onClick={onClickNovo}
                style={{ fontWeight: 700 }}
              >
                Novo registro
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <CardContent>
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

        <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <div className='table-pagination-center'>
              <Table
                columns={columns}
                dataSource={dados}
                rowKey='id'
                loading={loading}
                pagination={{
                  current: paginaAtual,
                  pageSize: registrosPorPagina,
                  total: totalRegistros,
                  showSizeChanger: true,
                  pageSizeOptions: [10, 20, 30, 50, 100],
                  locale: { items_per_page: '' },
                }}
                onChange={(pagination) =>
                  handleTableChange(pagination, registrosPorPagina, setRegistrosPorPagina)
                }
                onRow={(record) => ({
                  onClick: () => navigate(`/formacoes/lista-presenca-codaf/editar/${record.id}`),
                  style: { cursor: 'pointer' },
                })}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: 'Não encontramos registros para os filtros aplicados' }}
              />
            </div>
            <style>{`
              .table-pagination-center .ant-pagination { display: flex; justify-content: center; }
              .table-pagination-center .ant-dropdown-menu { background-color: #FFFFFF; }
              .table-pagination-center .ant-dropdown-menu-item { color: #42474A; }
              .table-pagination-center .ant-dropdown-menu-item:hover { background-color: #f5f5f5; color: #42474A; }
            `}</style>
          </Col>
        </Row>
      </CardContent>
    </Col>
  );
};

export default CodafFormacoesNaoHomologadas;
