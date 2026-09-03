import { Col, Row, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';

interface SecaoListaInscritosProps {
  colunasCursistas: ColumnsType<any>;
  cursistas: any[];
  paginaAtualInscritos: number;
  registrosPorPaginaInscritos: number;
  totalRegistrosInscritos: number;
  handleTableChangeInscritos: (pagination: TablePaginationConfig) => void;
  rowSelection?: TableRowSelection<any>;
}

export const SecaoListaInscritos: React.FC<SecaoListaInscritosProps> = ({
  colunasCursistas,
  cursistas,
  paginaAtualInscritos,
  registrosPorPaginaInscritos,
  totalRegistrosInscritos,
  handleTableChangeInscritos,
  rowSelection,
}) => {

  return (
    <div>
      <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '100%',
              color: '#42474A',
              marginBottom: 8,
            }}
          >
            Lista de inscritos na formação
          </div>
          <p style={{ marginBottom: 16 }}>
            Insira as informações dos cursistas que finalizaram a formação.
          </p>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <div className='table-pagination-center'>
            <Table
              rowSelection={rowSelection}
              columns={colunasCursistas}
              rowKey='id'
              dataSource={cursistas}
              locale={{
                emptyText: 'Nenhum cursista cadastrado',
              }}
              pagination={{
                total: totalRegistrosInscritos,
                current: paginaAtualInscritos,
                showSizeChanger: true,
                pageSize: registrosPorPaginaInscritos,
                pageSizeOptions: [10, 20, 30, 50, 100],
                locale: { items_per_page: '' },
              }}
              onChange={handleTableChangeInscritos}
              scroll={{ x: 'max-content' }}
            />
          </div>
          <style>{`
                .table-pagination-center .ant-pagination {
                  justify-content: center;
                  display: flex;
                }
              `}</style>
        </Col>
      </Row>
    </div>
  );
};
