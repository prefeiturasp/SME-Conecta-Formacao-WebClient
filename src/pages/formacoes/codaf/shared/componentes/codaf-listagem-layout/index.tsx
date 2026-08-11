import React from 'react';
import { Col, Row, Button, Table, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import HeaderPage from '~/components/lib/header-page';
import CardContent from '~/components/lib/card-content';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_VOLTAR, CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

interface CodafListagemLayoutProps {
  title: string;
  permissaoIncluir: boolean;
  onClickNovo: () => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onClickIrParaInscricoes: () => void;
  onClickContinuarRegistro: () => void;
  children: React.ReactNode;
  dados: any[];
  columns: ColumnsType<any>;
  loading: boolean;
  paginaAtual: number;
  registrosPorPagina: number;
  totalRegistros: number;
  setRegistrosPorPagina: (size: number) => void;
  handleTableChange: (pagination: any, setter: any) => void;
  onRowClick: (record: any) => void;
}

export const CodafListagemLayout: React.FC<CodafListagemLayoutProps> = ({
  title,
  permissaoIncluir,
  onClickNovo,
  modalVisible,
  setModalVisible,
  onClickIrParaInscricoes,
  onClickContinuarRegistro,
  children,
  dados,
  columns,
  loading,
  paginaAtual,
  registrosPorPagina,
  totalRegistros,
  setRegistrosPorPagina,
  handleTableChange,
  onRowClick,
}) => {
  const navigate = useNavigate();

  return (
    <Col>
      <Modal
        title={
          <span
            style={{ fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}
          >
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

      <HeaderPage title={title}>
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
                disabled={!permissaoIncluir}
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
        {children}

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
                onChange={(pagination) => handleTableChange(pagination, setRegistrosPorPagina)}
                onRow={(record) => ({
                  onClick: () => onRowClick(record),
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
