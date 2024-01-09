import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { ROUTES } from '~/core/enum/routes-enum';
import { FiltroInscricoesProps } from '..';

interface InscricoesListaPaginadaProps {
  filters?: FiltroInscricoesProps;
}

interface InscricoesProps {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  turmas: TurmasProps[];
}

interface TurmasProps {
  nomeTurma: string;
  data: string;
  quantidadeVagas: number;
  quantidadeInscricoes: number;
}

export const InscricoesListaPaginada: React.FC<InscricoesListaPaginadaProps> = ({ filters }) => {
  const navigate = useNavigate();

  const columns: ColumnsType<InscricoesProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao' },
    { title: 'Nome da formação', dataIndex: 'nomeFormacao' },
  ];

  const onClickEditar = (row: InscricoesProps) =>
    navigate(`${ROUTES.FORMACAOES_INSCRICOES}/editar/${row.id}`, { replace: true, state: row });

  const expandedRowRender = (record: InscricoesProps) => {
    const columns: ColumnsType<TurmasProps> = [
      { title: 'Turma', dataIndex: 'nomeTurma' },
      { title: 'Data', dataIndex: 'data' },
      { title: 'Quantidade de vagas', dataIndex: 'quantidadeVagas' },
      { title: 'Quantidade de inscricoes', dataIndex: 'quantidadeInscricoes' },
    ];

    return <DataTable dataSource={record.turmas} columns={columns} />;
  };

  return (
    <DataTable
      url='v1/Inscricao/formacao-turmas'
      filters={filters}
      columns={columns}
      expandable={{
        expandedRowRender,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <UpOutlined
              onClick={(e) => {
                onExpand(record, e);
                e.stopPropagation();
              }}
            />
          ) : (
            <DownOutlined
              onClick={(e) => {
                onExpand(record, e);
                e.stopPropagation();
              }}
            />
          ),
      }}
      onRow={(row) => ({
        onClick: () => {
          onClickEditar(row);
        },
      })}
    />
  );
};
