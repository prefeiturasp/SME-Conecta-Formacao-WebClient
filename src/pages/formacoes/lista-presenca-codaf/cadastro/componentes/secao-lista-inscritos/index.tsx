import { Button, Col, Row, Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React from 'react';

interface SecaoListaInscritosProps {
  mostrarDivergencia: boolean;
  nomeFormacao: string | undefined;
  onClickAtualizarInscritos: () => void;
  loading: boolean;
  colunasCursistas: ColumnsType<any>;
  cursistas: any[];
  paginaAtualInscritos: number;
  registrosPorPaginaInscritos: number;
  totalRegistrosInscritos: number;
  handleTableChangeInscritos: (pagination: TablePaginationConfig) => void;
}

export const SecaoListaInscritos: React.FC<SecaoListaInscritosProps> = ({
  mostrarDivergencia,
  nomeFormacao,
  onClickAtualizarInscritos,
  loading,
  colunasCursistas,
  cursistas,
  paginaAtualInscritos,
  registrosPorPaginaInscritos,
  totalRegistrosInscritos,
  handleTableChangeInscritos,
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

      {mostrarDivergencia && (
        <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div
              style={{
                backgroundColor: '#ff9a52',
                borderRadius: '4px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flex: 1,
                  width: '70%',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src='/Vector.png'
                    alt='Warning'
                    style={{
                      width: '15px',
                      height: '15px',
                    }}
                  />
                </div>
                <span style={{ color: '#fff', fontSize: '14px' }}>
                  Há divergência entre a quantidade de inscritos na formação{' '}
                  <strong>{nomeFormacao || '[nome da formação]'}</strong>
                  <br></br> e a lista de presença. Clique no botão &quot;atualizar a lista.
                </span>
              </div>
              <Button
                type='default'
                icon={
                  <ReloadOutlined
                    style={{
                      color: '#ff9a52',
                    }}
                  />
                }
                onClick={onClickAtualizarInscritos}
                loading={loading}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#fff',
                  color: '#ff9a52',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  padding: '4px 16px',
                  minWidth: '250px',
                  height: '38px',
                }}
              >
                Atualizar inscritos
              </Button>
            </div>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <div className='table-pagination-center'>
            <Table
              columns={colunasCursistas}
              dataSource={cursistas}
              rowKey='id'
              pagination={{
                current: paginaAtualInscritos,
                pageSize: registrosPorPaginaInscritos,
                total: totalRegistrosInscritos,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 30, 50, 100],
                locale: { items_per_page: '' },
              }}
              onChange={handleTableChangeInscritos}
              locale={{
                emptyText: 'Nenhum cursista cadastrado',
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
          <style>{`
                .table-pagination-center .ant-pagination {
                  display: flex;
                  justify-content: center;
                }
              `}</style>
        </Col>
      </Row>
    </div>
  );
};
