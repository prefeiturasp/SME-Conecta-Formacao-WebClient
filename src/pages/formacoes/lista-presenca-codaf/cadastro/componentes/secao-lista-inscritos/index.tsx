import { Button, Col, Row, Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React from 'react';
import { DeltaInscritosDTO } from '~/core/services/codaf-lista-presenca-service';

interface SecaoListaInscritosProps {
  mostrarDivergencia: boolean;
  deltaInscritos: DeltaInscritosDTO | null;
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

const getBannerText = (
  delta: DeltaInscritosDTO | null,
  nomeFormacao: string | undefined,
): string => {
  if (!delta) return '';
  const nome = nomeFormacao ?? '[nome da formação]';
  const temNovos = delta.totalNovos > 0;
  const temRemovidos = delta.totalRemovidos > 0;

  if (temNovos && temRemovidos) {
    return `Novas inscrições foram adicionadas e algumas canceladas na formação ${nome}. Para salvar as alterações no CODAF, preencha as informações obrigatórias dos novos cursistas clicando em "atualizar inscritos"`;
  }
  if (temRemovidos) {
    return `Algumas inscrições foram canceladas na formação ${nome}. Clique no botão "atualizar inscritos" para reprocessar a lista.`;
  }
  return `Há divergência entre a quantidade de inscritos na formação ${nome} e a lista de presença. Clique no botão "atualizar inscritos" para reprocessar a lista.`;
};

export const SecaoListaInscritos: React.FC<SecaoListaInscritosProps> = ({
  mostrarDivergencia,
  deltaInscritos,
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
  const bannerText = getBannerText(deltaInscritos, nomeFormacao);
  const mostrarListaCancelados =
    deltaInscritos &&
    deltaInscritos.totalRemovidos > 0 &&
    deltaInscritos.inscritosRemovidos?.length > 0;

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
        <>
          <Row gutter={[16, 8]} style={{ marginBottom: mostrarListaCancelados ? 0 : 16 }}>
            <Col span={24}>
              <div
                style={{
                  backgroundColor: '#ff9a52',
                  borderRadius: mostrarListaCancelados ? '4px 4px 0 0' : '4px',
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
                  <span style={{ color: '#fff', fontSize: '14px' }}>{bannerText}</span>
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

          {mostrarListaCancelados && (
            <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    padding: '16px 24px 16px 40px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#42474A',
                      marginBottom: 8,
                    }}
                  >
                    Cursistas com inscrições canceladas:
                  </p>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {deltaInscritos!.inscritosRemovidos.map((inscrito) => (
                      <li
                        key={inscrito.id}
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          color: '#42474A',
                        }}
                      >
                        {inscrito.nome} — {inscrito.documento}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          )}
        </>
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
