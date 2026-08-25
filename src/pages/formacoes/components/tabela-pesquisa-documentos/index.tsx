import { Col, Empty, Row, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import React from 'react';

type RegistroPesquisaDocumento = {
  id: React.Key;
};

type TabelaPesquisaDocumentosProps<T extends RegistroPesquisaDocumento> = {
  columns: ColumnsType<T>;
  dados: T[];
  filtroAplicado: boolean;
  loading: boolean;
  paginaAtual: number;
  registrosPorPagina: number;
  rowSelection: TableProps<T>['rowSelection'];
  totalRegistros: number;
  onChange: TableProps<T>['onChange'];
};

const TabelaPesquisaDocumentos = <T extends RegistroPesquisaDocumento>({
  columns,
  dados,
  filtroAplicado,
  loading,
  paginaAtual,
  registrosPorPagina,
  rowSelection,
  totalRegistros,
  onChange,
}: TabelaPesquisaDocumentosProps<T>) => {
  if (!filtroAplicado) return null;

  return (
    <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
      <Col span={24}>
        {!loading && dados.length === 0 ? (
          <div
            style={{
              width: '100%',
              height: '30vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Empty description='Sem dados' />
          </div>
        ) : (
          <div className='table-pagination-center'>
            <Table
              rowSelection={rowSelection}
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
              onChange={onChange}
              scroll={{ x: 'max-content' }}
            />
          </div>
        )}
        <style>{`
          .table-pagination-center .ant-pagination {
            display: flex;
            justify-content: center;
          }
          .table-pagination-center .ant-dropdown-menu {
            background-color: #FFFFFF;
          }
          .table-pagination-center .ant-dropdown-menu-item {
            color: #42474A;
          }
          .table-pagination-center .ant-dropdown-menu-item:hover {
            background-color: #f5f5f5;
            color: #42474A;
          }
          .table-pagination-center .ant-table-tbody > tr.ant-table-row-selected > td {
            background: #fff !important;
          }
          .table-pagination-center .ant-table-tbody > tr.ant-table-row-selected:hover > td {
            background: #fafafa !important;
          }
        `}</style>
      </Col>
    </Row>
  );
};

export default TabelaPesquisaDocumentos;
